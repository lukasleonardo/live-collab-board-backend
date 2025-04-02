import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "../models/User";

dotenv.config();

const generateToken= (user: IUser) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string,{
        expiresIn: "7d",
    });
}

export const registerUser = async (name: string, email: string, password: string) => {
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error("E-mail já cadastrado");
    }
    const user = await User.create({ name, email, password });
    return { user, token: generateToken(user) };
};


export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new Error("Credenciais inválidas");
    }
    return {user, token:generateToken(user)};
};


export const getUsers = async () => {
    const users = await User.find({}).select("-password");
    return users;
}