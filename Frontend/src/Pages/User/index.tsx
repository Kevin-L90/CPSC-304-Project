import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import Deck, { DeckType } from "../../Components/Deck";
import { UserIdContext } from "../../contexts/UserIdContext";
import EditableDeck from "./Components/EditableDeck";

const UserPage = () => {
    const { userid } = useParams();
    const { username } = useContext(UserIdContext);

    const [DeckList, SetDeckList] = useState<DeckType[]>([]);
    const [OmnipresentTypes, SetOmnipresentTypes] = useState<string[]>(["a", "b", "c"]);
    const navigate = useNavigate();

    const GetDeckPageLocation = (id: number) => {
        return "/deck/" + id.toString();
    }

    const handleDeckDelete = (id) => {
        SetDeckList(DeckList.filter(deck => deck.id !== id));
    
        const DeleteOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }

        fetch("http://127.0.0.1:8080/deck/" + id.toString(), DeleteOptions)
    }

    const handleDeckEdit = (id) => {
        navigate("/decks/edit/" + id.toString());
    }

    useEffect(() => {
        fetch("http://127.0.0.1:8080/userDecks?creatorName=" + userid)
        .then((res) => res.json())
        .then((d) => {
            SetDeckList(d.map((deck) => {
                return {
                    name: deck.deckName,
                    format: deck.playFormat,
                    creator: deck.creatorID,
                    id: deck.deckID,
                }
            }))
        })

        fetch("http://127.0.0.1:8080/deckTypes?creatorID=" + userid)
        .then((res) => res.json())
        .then((d) => {
            SetOmnipresentTypes(d);
        })
    }, [userid])

    return (
        <div>
            <div className="text-center py-8">
                <h1>
                    User {userid}'s Page
                </h1>
            </div>
            <div>
                <div className="mx-4 pb-4 border-solid border-white border-2">
                    <div className="text-center text-3xl">
                        <h3>
                            Omnipresent Types
                        </h3>
                    </div>
                    <div>
                        <div className="grid grid-flow-col px-32">
                        {
                            OmnipresentTypes.map((d, index) => 
                            <div key={index} className="text-center">
                                {d}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="grid grid-cols-5 gap-4 justify-center px-4 py-4">
                    {
                        DeckList.map((deck, index) => 
                        <div key={index}>                        
                            {
                                (userid === username) ?
                                <EditableDeck name={deck.name} format={deck.format} creator={deck.creator} id={deck.id} onDelete={handleDeckDelete} onEdit={handleDeckEdit}/>
                                :
                                <Link to={GetDeckPageLocation(deck.id)}>
                                    <Deck name={deck.name} format={deck.format} creator={deck.creator} id={deck.id} />
                                </Link>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserPage