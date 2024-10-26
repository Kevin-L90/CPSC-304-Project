import { Link, Outlet } from "react-router-dom";

import Navbar from "./Components/Navbar";
import { useState } from "react";
import { UserIdContext } from "./contexts/UserIdContext";

const Layout = () => {
    const [Username, SetUsername] = useState<string>("");

    return (
        <UserIdContext.Provider value={{username: Username, SetUsername: SetUsername}}>
            <div className="layout px-32">
                <Link to={"/"}>
                    <h1 className="text-center text-white">
                        MTG Card Tracker
                    </h1>
                </Link>
            
                <div className="py-4">
                    <Navbar />
                </div>

                <Outlet />
            </div>
        </UserIdContext.Provider>
    )
}

export default Layout;