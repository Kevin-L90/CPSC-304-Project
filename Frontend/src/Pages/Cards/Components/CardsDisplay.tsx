import { useEffect, useState } from "react";
import FilterBar from "../../../Components/Filterbar";
import Card, { CardType } from "../../../Components/card";
import { Link } from "react-router-dom";
import SearchBar from "../../../Components/SearchBar";

const Sorting = {
    "Alphabetical": "alphabetOrdering",
    "Numerical": "numericOrdering",
    "Multiple Printings": "multiplePrinting",
    "None": "",
}

const CardsDisplay = () => {
    const [CardList, SetCardList] = useState<CardType[]>([]);
    const [Search, SetSearch] = useState<string>("");
    const [Ordering, SetOrdering] = useState<string>("");

    const GetCardPageLocation = (artid: number, cardname: string, setname: string) => {
        return "/card/" + artid.toString() + "/" + setname + "/" + cardname;
    };

    const GenerateCombinations = (inputList: string[]): string[] => {
        const outputList: string[] = [];
        const n: number = inputList.length;
    
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j <= n; j++) {
                const combination: string = inputList.slice(i, j).join(' ');
                outputList.push(combination);
            }
        }
        
        return outputList;
    }

    const handleSearch = (e) => {
        SetSearch(e.target.value);
    }

    const handleChangeOrdering = (e) => {
        if (e === null)
        {
            SetOrdering("")
        } else 
        {
            SetOrdering(Sorting[e.value])
        }
    }

    const filters = [
        {
            identifier: "Sort By",
            options: Object.keys(Sorting),
            onChange: handleChangeOrdering,
        }]

    useEffect(() => {
        switch (Search) {
            case "":
                fetch("http://127.0.0.1:8080/cards?queryType=" + Ordering + "&input=")
                .then((res) => res.json())
                .then((d) => {
                SetCardList(d.map((card) => 
                {
                return {
                    name: card.cardName,
                    set: card.setName,
                    artid: card.artID,
                }}))})

                break;
            default:
                fetch("http://127.0.0.1:8080/cards?queryType=findCardOfName&queryType=" + Ordering + "&" + GenerateCombinations(Search.split(" ")).map((s) => "input=" + s + "&").join(''))
                .then((res) => res.json())
                .then((d) => {
                    SetCardList(d.map((card) => 
                    {
                    return {
                        name: card.cardName,
                        set: card.setName,
                        artid: card.artID,
                    }}))
                })
                break;
        }
        
    }, [Search, Ordering]);

    return (
        <div>
            <div className="px-32 pb-3 grid grid-cols-6 gap-4">
                <div className="col-start-2 col-span-2 justify-center">
                    <FilterBar filters={filters} />
                </div>
                <div className="col-span-2">
                    <SearchBar onChange={handleSearch}/>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-4 justify-center px-4 py-4">
                {
                    CardList.map((card, index) =>
                    <div key={index}>
                        <Link to={GetCardPageLocation(card.artid, card.name, card.set)}>
                            <Card name={card.name} set={card.set} artid={card.artid} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CardsDisplay;