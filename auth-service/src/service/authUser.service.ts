import { AuthDataSource } from "../db/datasource";
import jwt from "jsonwebtoken";
import { AuthUser } from "../entities/authUser.entity";
import dotenv from "dotenv";
import validator from "validator";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import AppError from "../utils/AppError";
import { mqService } from "..";

dotenv.config();

const repository = AuthDataSource.getRepository(AuthUser);

function createJWTToken(userId: string) {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "", {
    expiresIn: "1h",
  });
  return token;
}

function generateRefreshToken() {
  return randomUUID();
}

async function signup(
  email: string,
  password: string,
): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }
  if (!validator.isEmail(email)) {
    throw new AppError(400, "Invalid email");
  }

  if (!validator.isStrongPassword(password)) {
    throw new AppError(
      400,
      "Password is not strong enough, must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
    );
  }

  const exists = await repository.findOneBy({ email });
  if (exists) {
    throw new AppError(400, "User with that email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = repository.create({
    email,
    password: hashedPassword,
    refreshToken: generateRefreshToken(),
    refreshTokenExpiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });

  const savedUser = await repository.save(user);

  mqService?.sendMessage(
    JSON.stringify({ email: savedUser.email, id: savedUser.id }),
    "user_created",
  );

  return {
    user: savedUser,
    accessToken: createJWTToken(user.id),
    refreshToken: user.refreshToken,
  };
}

async function login(
  email: string,
  password: string,
): Promise<{ user: AuthUser; accessToken: string; refreshToken: string }> {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  const user = await repository.findOneBy({ email });
  if (!user) {
    throw new AppError(400, "User with that email does not exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(401, "Invalid password");
  }

  const token = createJWTToken(user.id);
  const refreshToken = generateRefreshToken();
  user.refreshToken = refreshToken;
  await repository.save(user);

  return { user, accessToken: token, refreshToken: user.refreshToken };
}

function isTokenExpired(expiry: Date): boolean {
  return new Date() > expiry;
}

async function refresh(
  refreshToken: string,
  userId: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  if (!refreshToken || !userId) {
    throw new AppError(400, "User id and refresh token are required");
  }
  const user = await repository.findOneBy({ id: userId });
  if (!user) {
    throw new AppError(400, "User was not found");
  }
  if (
    user.refreshToken !== refreshToken ||
    isTokenExpired(user.refreshTokenExpiration)
  ) {
    throw new AppError(401, "Invalid refresh token");
  }

  const JWTtoken = createJWTToken(user.id);
  const newRefreshToken = generateRefreshToken();

  user.refreshToken = newRefreshToken;
  user.refreshTokenExpiration = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  await repository.save(user);

  return { accessToken: JWTtoken, refreshToken: newRefreshToken };
}

function authenticate(jwtToken: string): string {
  try {
    const { id } = jwt.verify(jwtToken, process.env.JWT_SECRET || "") as {
      id: string;
    };
    return id;
  } catch (error) {
    throw new AppError(401, "Invalid token");
  }
}

// function for testing purposes
function getAllUsers() {
  return repository.find();
}

const AuthService = {
  signup,
  login,
  refresh,
  authenticate,
  getAllUsers,
};

export default AuthService;
