import Select from 'react-select'
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { UserIdContext } from "../../contexts/UserIdContext";
import { DeckType } from "../../Components/Deck";
import Card, { CardType } from "../../Components/card";
import styled from "styled-components";

const DeckTypeMap = {
    "Standard" : "STAN",
    "Commander" : "COMM",
    "PAUP" : "PAUP",
    "MDRN" : "MDRN",
};

const DeckTypeOptions = Object.keys(DeckTypeMap);

type DeckFormat = typeof DeckTypeOptions[number];

const StyledInput = styled.input`
    padding: 20px
    `;

const EditDeckPage = () => {
    const { deckid } = useParams();
    const { username } = useContext(UserIdContext);

    const [DeckName, SetDeckName] = useState<string>("");
    const [DeckFormat, SetDeckFormat] = useState<DeckFormat>();
    const [DeckDetails, SetDeckDetails] = useState<DeckType | null>(null);
    
    const [OriginalDeck, SetOriginalDeck] = useState<CardType[]>([]);
    const [CardsInDeck, SetCardsInDeck] = useState<CardType[]>([]);
    const [CardsDisplay, SetCardsDisplay] = useState<CardType[]>([]);

    const [CreatorList, SetCreatorList] = useState<string[]>([]);
    const [UserTransfer, SetUserTransfer] = useState<string>(username);

    const navigate = useNavigate();

    const options = DeckTypeOptions.map((option) => {
        return { value: option, label: option }
    })

    const handleDeckNameChange = (e) => {
        SetDeckName(e.target.value);
    }

    const handleDeckTypeChange = (e) => {
        SetDeckFormat(e.value);
    }

    const handleUserTransferChange = (e) => {
        SetUserTransfer(e.value);
    }

    const handleSubmission = () => {
        // Check that DeckType not null
        if (DeckFormat === undefined)
        {
            // Run deck type pop up
            console.log("Error 1")
            return;
        } else if (CardsInDeck.length <= 0)
        {
            // Run error for no cards
            console.log("Error 2")
            return;
        }

        const postOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }

        // Check if the deck name is different
        if (DeckName !== DeckDetails?.name) {
            fetch("http://127.0.0.1:8080/updateDeckName?feature=deckName&oldName=" + DeckDetails?.name + "&newName=" + DeckName + "&deckId=" + DeckDetails?.id.toString(), postOptions);
        }

        if (DeckTypeMap[DeckFormat] !== DeckDetails?.format) {
            fetch("http://127.0.0.1:8080/updateDeckName?feature=playFormat&oldName=" + DeckDetails?.format + "&newName=" + DeckTypeMap[DeckFormat] + "&deckId=" + DeckDetails?.id.toString(), postOptions);
        }

        if (UserTransfer !== DeckDetails?.creator) {
            fetch("http://127.0.0.1:8080/updateCreatorName?oldName="+DeckDetails?.creator + "&newName=" + UserTransfer, postOptions);
        }

        // Filter cards in the new deck that were not in the old deck
        CardsInDeck.filter((card) => !OriginalDeck.includes(card))
            .forEach((c) => fetch("http://127.0.01:8080/putCard?artId=" + c.artid.toString() + "&deckId=" + DeckDetails?.id.toString() + "&setName=" + c.set, postOptions));

        // Filter cards in the old deck that are no longer in the new deck
        OriginalDeck.filter((card) => !CardsInDeck.includes(card))
            .forEach((c) => fetch("http://127.0.01:8080/removeCard?artId=" + c.artid.toString() + "&deckId=" + DeckDetails?.id.toString() + "&setName=" + c.set, postOptions));
    
        navigate("/deck/" + deckId.toString())
    }

    const handleCardClicked = (Card: CardType) => {
        if ((CardsInDeck.filter(c => (c.artid === Card.artid && c.set === Card.set)).length !== 0))
        {
            SetCardsInDeck(
                CardsInDeck.filter(card =>
                    card.artid !== Card.artid && card.set !== Card.set
                )
            )
        }
        else
        {
            SetCardsInDeck([
                ...CardsInDeck,
                Card
            ])
        }
    }
    
    const handleClearSelection = () => {
        SetCardsInDeck([]);
    }

    const CardSelectionStyling = (id: number, setname: string): string => {
        return (CardsInDeck.filter(c => c.artid === id && c.set === setname).length !== 0) ? "border-4 border-blue-600 border-spacing-12" : "";
    }

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

    const deckId: number = ParseStringToNumber(deckid);
    
    useEffect(() => {
        if (username === "") {
            navigate("/")
        }

        fetch("http://127.0.0.1:8080/deck/" + deckId.toString())
        .then((res) => res.json())
        .then((d) => {
            if (d.creatorID !== username) navigate("/")

            SetDeckDetails({
                name: d.deckName,
                format: d.playFormat,
                creator: d.creatorID,
                id: d.deckID
            })

            SetUserTransfer(d.creatorID)
            SetDeckName(d.deckName)
            SetDeckFormat(Object.keys(DeckTypeMap).find(key => DeckTypeMap[key] === d.playFormat));
        })

        fetch("http://127.0.0.1:8080/cards?queryType=&input=")
        .then((res) => res.json())
        .then((d) => {
            SetCardsDisplay(d.map((card) => 
            {
                return {
                    name: card.cardName,
                    set: card.setName,
                    artid: card.artID,
                }
            }))})

        fetch("http://127.0.0.1:8080/deck/cards/" + deckId.toString())
        .then((res) => res.json())
        .then((d) => {
            const ogDeck = d.map((card) => 
            {
                return {
                    name: card.cardName,
                    set: card.setName,
                    artid: card.artID,
                }
            })
            SetOriginalDeck(ogDeck);
            SetCardsInDeck(ogDeck);
        })

        fetch("http://127.0.01:8080/creators")
        .then((res) => res.json())
        .then((d) => {
            SetCreatorList(d.map((d) => d));
        })
    }, [deckId, navigate, username])

    return (
        (DeckDetails === null) ?
        <div className="text-center">
            Loading
        </div>
        :
        <div>
            <form>
                <div className='py-4 flex flex-row px-4 grid-cols-5 gap-2'>
                    <div className=''>
                        <label className='inline-flex items-center'>
                            <h5 className='pr-2'>
                                Deck Name:
                            </h5>
                            <StyledInput type="text" onChange={handleDeckNameChange} 
                                className="h-10 bg-white text-black select-text"
                                value={DeckName}
                                />
                        </label>
                    </div>
                    <div className=''>
                        <label className='inline-flex items-center'>
                            <h5 className='pr-2'>
                                Deck Type:
                            </h5>
                            <Select options={options}
                                className="w-40"
                                placeholder={"Select"}
                                styles={{
                                    option: (baseStyles, { isDisabled, isFocused }) => ({
                                        ...baseStyles,
                                        backgroundColor: isFocused ? 'lightskyblue' : 'white',
                                        color: 'black',
                                    })
                                }}
                                onChange={handleDeckTypeChange.bind(this)}
                            />
                        </label>
                    </div>
                    <div>
                        <label className="inline-flex items-center">
                            <h5 className="pl-6">
                                Deck Owner: 
                            </h5>
                            <Select options = {CreatorList.map((d) => {
                                return {
                                    value: d,
                                    label: d,
                                }
                            })}
                                className='w-40'
                                placeholder={"Owner"}
                                styles={{
                                    option: (baseStyles, { isDisabled, isFocused }) => ({
                                        ...baseStyles,
                                        backgroundColor: isFocused ? 'lightskyblue' : 'white',
                                        color: 'black',
                                    })
                                }}
                                onChange={handleUserTransferChange.bind(this)}
                            />
                        </label>
                    </div>

                    <div className='pt-1.5'>
                        <div className='text-black w-full h-full items-center'>
                            <div className='bg-white ml-8 py-1.5 rounded-md cursor-pointer hover:bg-slate-400'
                                onClick={handleClearSelection}>
                                <h5 className='px-16'>
                                    Clear
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className='pt-1.5'>
                        <div className='text-black w-full h-full items-center'>
                            <div className='bg-white ml-8 py-1.5 rounded-md cursor-pointer hover:bg-slate-400'
                                onClick={handleSubmission}>
                                <h5 className='px-16'>
                                    Submit
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-slate-200 py-4 rounded-lg'>
                    <div className="grid grid-cols-8 gap-2 justify-center px-8 pt-8">
                        {
                            CardsDisplay.map((card, index) =>
                            <div key={index} onClick={() => {handleCardClicked(card)}} 
                                            className={CardSelectionStyling(card.artid, card.set)}>
                                <div>
                                    <Card name={card.name} set={card.set} artid={card.artid}/>
                                </div>
                            </div>
                            )
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditDeckPage