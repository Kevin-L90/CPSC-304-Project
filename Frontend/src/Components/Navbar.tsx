import { useContext, useState } from "react";
import LoginPopup from "./Login";
import NavButton from "./NavButton";
import { UserIdContext } from "../contexts/UserIdContext";

const Navbar = () => {
    const { username, SetUsername } = useContext(UserIdContext);

    const [DisplayLogin, SetDisplayLogin] = useState<boolean>(false);

    const handleLoginButton = () => SetDisplayLogin(!DisplayLogin);

    const removeLoginButton = () => SetDisplayLogin(false);

    const handleLogoutButton = () => {
        removeLoginButton();
        SetUsername("");
    }

    return (
        <div>
            {(username === "") ? 
                <div className="grid grid-cols-3 gap-4 justify-center">
                    <div>
                        <NavButton title="Cards" link="/cards" onClick={removeLoginButton}/>
                    </div>
                    <div>
                       <NavButton title="Decks" link="/decks" onClick={removeLoginButton}/>
                    </div>
                    <div>
                        <div className="bg-lime-300 rounded-md text-lg cursor-pointer" onClick={handleLoginButton}>
                            <div className="py-4 text-center text-blue-600">
                                Login
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="grid grid-cols-5 gap-4 justify-center">
                    <div>
                        <NavButton title="Cards" link="/cards" onClick={removeLoginButton}/>
                    </div>
                    <div>
                       <NavButton title="Decks" link="/decks" onClick={removeLoginButton}/>
                    </div>
                    <div>
                        <NavButton title="My Decks" link={"/user/"+username} onClick={removeLoginButton}/>
                    </div>
                    <div>
                        <NavButton title="Account Settings" link={"/user/settings"} onClick={removeLoginButton}/>
                    </div>
                    <div>
                        <NavButton title="Logout" link={"/"} onClick={handleLogoutButton} />
                    </div>
                </div>
                }

            {DisplayLogin ? <LoginPopup onExit={removeLoginButton}/> : null}
        </div>
    )
};

export default Navbar;