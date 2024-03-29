import React, {useState} from "react";
import { useSignup } from "../hooks/useSignup";
const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signup, error, isLoading} = useSignup();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(email, password);
    }
    return (
        <div className="w-full flex flex-col items-center">
            <h3 className="text-3xl font-semibold mb-6 ">Sign up for a new account</h3>
            <form className="w-4/5 sm:w-2/5" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="">Email</label>
                    <input
                        className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                        type="email"
                        onChange={(e) => {setEmail(e.target.value)}}
                        value={email}
                    />
                </div>
                <div className="mb-6">
                    <label>Password</label>
                    <input
                        className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="password"
                        onChange={(e) => {setPassword(e.target.value)}}
                        value={password}
                    />
                </div>
                <button className="w-full h-8 bg-blue-100 hover:bg-blue-200" disabled={isLoading}>Signup</button>
                {error && <div className="text-red-500">{error}</div>}
                <div className="mt-10">
                    <h3 className="font-semibold">What does sign in offer?</h3>
                    <ul className="list-disc">
                        <li>Storage of all your workouts and routines</li>
                        <li>Video chatting with fitness experts</li>
                        <li>State of the art AI assistance tool to help build your profile</li>
                    </ul>
                </div>
            </form>
        </div>
    )
}
export default Signup;