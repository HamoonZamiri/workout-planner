import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//static signup function including hashing
userSchema.statics.signup = async function (email, password) {
    //validation
    if(!email || !password){
        throw Error("Email and Password are required");
    }
    if(!validator.isEmail(email)){
        throw Error("Email is invalid");
    }

    if(!validator.isStrongPassword(password)){
        throw Error("Password is not strong enough");
    }

    const exists = await this.findOne({ email });
    if(exists){
        throw Error("Email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hashedPassword });
    return user
}

//static login function
userSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw Error("All fields must be filled");
    }
    const user = await this.findOne( { email} );
    if(!user){
        throw Error("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw Error("Invalid email or password");
    }

    return user;
}
export const User = mongoose.model("User", userSchema);