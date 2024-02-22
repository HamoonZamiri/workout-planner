import React, { useState } from "react";
import { useSignup } from "../hooks/auth/useSignup";
import validator from "validator";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, error, setError, isLoading } = useSignup();
  const specialChars = ["!", "@", "#", "$", "%", "^", "&", "*"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validator.isEmail(email)) {
      setError("Email is not valid");
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!validator.isStrongPassword(password)) {
      setError("Password is not strong enough, check conditions above!");
      return;
    }
    await signup(email, password);
  };

  const checkPassword = () => {
    let minLength = false;
    let hasLowercase = false;
    let hasUppercase = false;
    let hasNumber = false;
    let hasSpecial = false;
    if (password.length >= 8) {
      minLength = true;
    }
    for (const c of password) {
      if (validator.isAlpha(c) && c === c.toLowerCase()) {
        hasLowercase = true;
      }
      if (validator.isAlpha(c) && c === c.toUpperCase()) {
        hasUppercase = true;
      }
      if (validator.isNumeric(c)) {
        hasNumber = true;
      }
      if (specialChars.includes(c)) {
        hasSpecial = true;
      }
    }
    const matchingPassword = password !== "" && password === confirmPassword;
    return {
      minLength,
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecial,
      matchingPassword,
    };
  };

  const {
    minLength,
    hasLowercase,
    hasUppercase,
    hasNumber,
    hasSpecial,
    matchingPassword,
  } = checkPassword();

  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-3xl font-semibold mb-6 ">
        Sign up for a new account
      </h3>
      <form className="w-4/5 sm:w-2/5" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="">Email</label>
          <input
            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                        placeholder:text-gray-400 sm:text-sm sm:leading-6"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
          />
        </div>
        <div className="mb-6">
          <label>Password</label>
          <input
            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-50 sm:text-sm sm:leading-6"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value.replace(" ", ""));
            }}
            value={password}
          />
        </div>
        <div className="mb-6">
          <label>Confirm Password</label>
          <input
            className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
            type="password"
            onChange={(e) => {
              setConfirmPassword(e.target.value.replace(" ", ""));
            }}
            value={confirmPassword}
          />
        </div>
        <p className="font-semibold text-md">Passwords must:</p>
        <ul className="list-disc list-inside mb-4 text-xs sm:text-base">
          <li className={!minLength ? "text-red-500" : "text-green-500"}>
            Have a minimum length of 8
          </li>
          <li className={!hasLowercase ? "text-red-500" : "text-green-500"}>
            Have one lowercase character
          </li>
          <li className={!hasUppercase ? "text-red-500" : "text-green-500"}>
            Have one uppercase character
          </li>
          <li className={!hasNumber ? "text-red-500" : "text-green-500"}>
            Have one number
          </li>
          <li className={!hasSpecial ? "text-red-500" : "text-green-500"}>
            Have one special character (!, @, #, $, %, ^, &, *)
          </li>
          <li className={!matchingPassword ? "text-red-500" : "text-green-500"}>
            Match the confirmed password
          </li>
        </ul>
        <button
          className="w-full h-8 bg-blue-100 hover:bg-blue-200"
          disabled={isLoading}
        >
          Signup
        </button>
        {error && <div className="text-red-500">{error}</div>}
        <div className="mt-10">
          <h3 className="font-semibold">What does sign in offer?</h3>
          <ul className="list-disc list-inside text-xs sm:text-base">
            <li>Storage of all your workouts and routines</li>
            <li>Video chatting with fitness experts</li>
            <li>
              State of the art AI assistance tool to help build your profile
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
};
export default Signup;

