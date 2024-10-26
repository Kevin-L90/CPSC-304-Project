import { useEffect, useState } from "react";
import FilterBar from "../../../Components/Filterbar";
import { Link } from "react-router-dom";
import Deck, { DeckType } from "../../../Components/Deck";

type DeckSelection = "Standard" | "Lowest Curve";

const DecksDisplay = () => {
    const [DeckList, SetDeckList] = useState<DeckType[]>([]);
    const [DeckSelection, SetDeckSelection] = useState<DeckSelection>("Standard");

    const handleSelectionChange = (e) => {
        if (e === null) {
            SetDeckSelection("Standard")
        } else {
            SetDeckSelection(e.value)
        }
    }

    const filters = [
        {
            identifier: "Deck Selection",
            options: [
                "Standard",
                "Lowest Curve",
            ],
            onChange: handleSelectionChange,
        }
    ]

    const GetDeckPageLocation = (id: number) => {
        return "/deck/" + id.toString();
    }

    useEffect(() => {
        switch (DeckSelection) {
            case "Standard":
                fetch("http://127.0.0.1:8080/decks")
                .then((res) => res.json())
                .then((d) => {
                SetDeckList(d.map((deck) => 
                {
                    return {
                        name: deck.deckName,
                        format: deck.playFormat,
                        creator: deck.creatorID,
                        id: deck.deckID
                }}))})
                break;
            
            case "Lowest Curve":
                fetch("http://127.0.0.1:8080/deckCurve")
                .then((res) => res.json())
                .then((d) => {
                SetDeckList(d.map((deck) => 
                {
                    return {
                        name: deck.deckName,
                        format: deck.playFormat,
                        creator: deck.creatorID,
                        id: deck.deckID
                }}))})
                break;
        
            default:
                break;
        } 
        
    }, [DeckSelection]);

    return (
        <div>
            <div className="px-72 py-4">
                <FilterBar filters={filters} />
            </div>
            <div className="grid grid-cols-5 gap-4 justify-center px-4">
                {
                    DeckList.map((deck, index) =>
                    <div key={index}>
                        <Link to={GetDeckPageLocation(deck.id)}>
                            <Deck name={deck.name} format={deck.format} creator={deck.creator} id={deck.id} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DecksDisplay;