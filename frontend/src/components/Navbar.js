import React from "react"
import {Link} from "react-router-dom"
import { useLogout } from "../hooks/useLogout"
import { useAuthContext } from "../hooks/useAuthContext"

export const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const handleClick = () => {
        logout();
    }
    return (
        <header>
            <div className="flex justify-between p-6">
                <Link className="hover:text-slate-400" to="/">
                    <h1 className="font-semibold text-4xl">FitLog</h1>
                </Link>
                <nav>
                   {user && (<div>
                        <span>{user.email}</span>
                        <button onClick={handleClick}>Logout</button>
                    </div>)}
                    {!user && (
                    <div className="flex gap-4">
                        <Link className="hover:text-slate-400" to="/login">Login</Link>
                        <Link className="hover:text-slate-400" to="/signup">Signup</Link>
                    </div>)
                    }
                </nav>
            </div>
        </header>
    )
}