import { useContext } from "react";
import NavButton from "../../Components/NavButton";
import { UserIdContext } from "../../contexts/UserIdContext";
import DecksDisplay from "./Components/DecksDisplay";



const DecksPage = () => {
    const { username } = useContext(UserIdContext);


    return (
        <div className="py-2">
            <div className="grid grid-cols-4">
                <div className="col-start-2 col-span-2 items-center">
                    <h1 className="text-center">
                        Decks
                    </h1>
                </div>

                <div className="col-start-4">
                    {
                        (username === "") ?
                        null :
                        <div className="flex justify-center">
                            <NavButton title={"Create Deck"} link="/decks/create" onClick={() => {}}/>
                        </div>
                    }
                </div>
            </div>

            <DecksDisplay />
        </div>
    )
}

export default DecksPage;