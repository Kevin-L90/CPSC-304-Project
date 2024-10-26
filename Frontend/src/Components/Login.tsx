import { useContext, useState } from "react";
import styled from "styled-components";
import { UserIdContext } from "../contexts/UserIdContext";

type LoginPopupProps = {
    onExit: () => void,
}

const StyledInput = styled.input`
    padding: 6px
    `;

const LoginPopup = ({ onExit }: LoginPopupProps) => {
    const [UsernameLocal, SetUsernameLocal] = useState<string>("")
    const [Password, SetPassword] = useState<string>("")

    const { SetUsername } = useContext(UserIdContext);

    const handleUserNameChange = (e) => {
        SetUsernameLocal(e.target.value);
    }

    const handlePasswordChange = (e) => {
        SetPassword(e.target.value);
    }

    const handleSubmission = () => {
        SetUsername(UsernameLocal);
        onExit();
    }

    return (
        <div className="absolute flex top-1/2 left-1/2 -ml-40 -mt-40 bg-slate-500 rounded-md z-10 border-gray-950 border-solid border-2">
            <div className="px-16 pt-8 pb-8">
                <div className="absolute cursor-pointer right-6 top-4 border-gray-800 border-2" onClick={onExit}>
                    <div className="px-1.5 py-0">
                        x
                    </div>
                </div>
                <div className="pb-3">
                    <h1>
                        Login
                    </h1>
                </div>

                <div>
                    <form>
                        <div className="pb-5">
                        <label>
                            <h5>
                                Username: 
                            </h5>
                            <StyledInput onChange={handleUserNameChange} />
                        </label>
                        </div>
                        <div>
                            <label>
                                <h5>
                                    Password:
                                </h5>
                                <StyledInput onChange={handlePasswordChange} type="password"/>
                            </label>
                        </div>
                        <div className="pt-4 flex flex-col items-center">
                            <button type="button" className="bg-neutral-200 text-slate-800" onClick={handleSubmission}>
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPopup;