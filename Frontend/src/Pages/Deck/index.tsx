import { useContext, useEffect, useState } from "react";
import Card, { CardType } from "../../Components/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeckType } from "../../Components/Deck";
import { UserIdContext } from "../../contexts/UserIdContext";

const DeckPage = () => {
    const { username } = useContext(UserIdContext);

    const [DeckDetails, SetDeckDetails] = useState<DeckType | null>(null);
    const [CardList, SetCardList] = useState<CardType[]>([]);

    const navigate = useNavigate();

    const GetCardPageLocation = (artid: number, cardname: string, setname: string) => {
        return "/card/" + artid.toString() + "/" + setname + "/" + cardname;
    };

    const ParseStringToNumber = (s: string | undefined): number => {
        let res = -1

        if (typeof s !== "string") {
            return -1;
        }

        try {
            res = parseInt(s);
        } catch (error) {
            res = -1;
        }

        return res;
    };

    const handleDelete = () => {
        const DeleteOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }

        fetch("http://127.0.0.1:8080/deck/" + deckId.toString(), DeleteOptions);

        navigate("/")
    }

    const handleEdit = () => {
        navigate("/decks/edit/" + DeckDetails?.id.toString())
    }

    const { deckid } = useParams();
    const deckId: number = ParseStringToNumber(deckid);

    useEffect(() => {
        fetch("http://127.0.0.1:8080/deck/" + deckId.toString())
        .then((res) => res.json())
        .then((d) => {
            SetDeckDetails({
                name: d.deckName,
                format: d.playFormat,
                creator: d.creatorID,
                id: d.deckID
            })
        })
        
        fetch("http://127.0.0.1:8080/deck/cards/" + deckId.toString())
        .then((res) => res.json())
        .then((d) => {
            SetCardList(d.map((card) => 
            {
                return {
                    name: card.cardName,
                    set: card.setName,
                    artid: card.artID,
                }
            }))
        })
    }, [deckId])

    return (
        (DeckDetails === null) ?
        <div className="text-center">
            Loading
        </div>
        :
        <div>
            <div className="grid grid-cols-10">
                <div className="col-span-4 col-start-4">
                    <h1 className="text-center">
                        {DeckDetails.name}
                    </h1>
                </div>
                {
                    (username === DeckDetails.creator) ? 
                    <>
                        <div className="col-start-9 items-center flex">
                        <div className="bg-white text-black rounded-md px-2 py-2 cursor-pointer border-slate-500 border-2 hover:bg-slate-500 hover:border-slate-800"
                                    onClick={handleEdit}>
                                Edit Deck
                            </div>
                        </div>
                        <div className="col-start-10 items-center flex">
                            <div className="bg-white text-black rounded-md px-2 py-2 cursor-pointer border-slate-500 border-2 hover:bg-slate-500 hover:border-slate-800"
                                    onClick={handleDelete}>
                                Delete Deck
                            </div>
                        </div>
                    </>
                    :
                    null
                }
            </div>
            <div className="grid grid-cols-6 pt-3">
                <div className="col-start-3">
                    <b>Format:</b>   {DeckDetails.format}
                </div>
                <div className="col-start-4">
                    <b>Creator:</b>   <a href={"/user/" + DeckDetails.creator} className="text-white">{DeckDetails.creator}</a>
                </div>
            </div>

            <div className="grid grid-cols-6 gap-4 justify-center px-8 pt-5 pb-4">
                {
                    (CardList.length > 0) ?
                    CardList.map((card, index) => 
                    <div key={index}>
                        <Link to={GetCardPageLocation(card.artid, card.name, card.set)}>
                            <Card name={card.name} set={card.set} artid={card.artid} />
                        </Link>
                    </div>
                    ) :
                    <div className="col-span-2 col-start-3 text-center pt-4">
                        No Cards In Deck
                    </div>
                }
            </div>
        </div>
    )
};

export default DeckPage;