import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

export const Navbar = () => {
    const { logout } = useLogout();
    const { state } = useAuthContext();
    const user = state.user;

    const handleLogout = () => {
        logout();
    }

    return (
        <header className="bg-blue-100">
            <div className="flex justify-between p-6">
                <Link className="hover:text-slate-400" to="/">
                    <h1 className="font-semibold text-3xl sm:text-4xl">FitLog</h1>
                </Link>
                <nav>
                   {user && (<div className="flex gap-4">
                        <span>{user.email}</span>
                        <button onClick={handleLogout}>Logout</button>
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
};