import { useContext, useEffect, useState } from "react";
import { UserIdContext } from "../../contexts/UserIdContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledInput = styled.input`
    padding: 12px
    `;

const UserSettingsPage = () => {
    const { username, SetUsername } = useContext(UserIdContext);
    
    const [InputUsername, SetInputUsername] = useState<string>(username)

    const navigate = useNavigate();

    const handleUsernameSubmission = () => {
        if (username === InputUsername) return;

        const PostOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }

        fetch("http://127.0.0.1:8080/updateCreatorName?oldName=" + username + "&newName=" + InputUsername, PostOptions);

        SetUsername(InputUsername);
    }

    const handleUsernameChange = (e) => {
        SetInputUsername(e.target.value);
    }

    useEffect(() => {
        if (username === "") {
            navigate("/");
        }
    })

    return (
        <div>
            <div className="border-white border-2">
                <div className="text-center text-2xl font-semibold pt-4">
                    <h5>
                        Account Settings
                    </h5>
                </div>
                <form className="pt-12 pb-8">
                    <div className="flex items-center justify-center">
                        <label className="inline-flex items-center text-lg">
                            <h5 className="pr-4">
                                Change Username: 
                            </h5>
                            <StyledInput type="text" onChange={handleUsernameChange} value={InputUsername}
                                className="" 
                                />
                        </label>
                    </div>

                    <div className="pt-12 flex items-center justify-center">
                        <div className="border-2 border-white cursor-pointer hover:bg-slate-700 hover:border-slate-400"
                                onClick={handleUsernameSubmission}>
                            <div className="px-4 py-2">
                                Submit
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserSettingsPage;