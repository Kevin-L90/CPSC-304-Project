import Select from 'react-select'
import { useContext, useEffect, useState } from "react";
import Card, { CardType } from '../../Components/card';
import styled from 'styled-components';
import { UserIdContext } from '../../contexts/UserIdContext';
import { useNavigate } from 'react-router-dom';

const DeckTypeMap = {
    "Standard" : "STAN",
    "Commander" : "COMM",
    "PAUP" : "PAUP",
    "MDRN" : "MDRN",
};

const DeckTypeOptions = Object.keys(DeckTypeMap);

type DeckType = typeof DeckTypeOptions[number];

const StyledInput = styled.input`
    padding: 20px
    `;

const CreateDeckPage = () => {
    // A user must be logged in in-order to create a deck
    const { username } = useContext(UserIdContext);
    const navigate = useNavigate();

    const UserLoggedIn: boolean = !(username === "");
        
    const [DeckName, SetDeckName] = useState<string>("");
    const [CardsInDeck, SetCardsInDeck] = useState<CardType[]>([]);
    const [DeckType, SetDeckType] = useState<DeckType>();
    const [CardsDisplay, SetCardsDisplay] = useState<CardType[]>([]);
    
    useEffect(() => {
        if (!UserLoggedIn) {
            navigate("/")
        }

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
    }, [UserLoggedIn, navigate]);

    const options = DeckTypeOptions.map((option) => {
        return {value: option, label: option }
    });

    const handleDeckNameChange = (e) => {
        SetDeckName(e.target.value);
    }

    const handleDeckTypeChange = (e) => {
        SetDeckType(e.value);
    }

    const handleSubmission = () => {
        // Check that DeckType not null
        if (DeckType === undefined)
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

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }

        fetch("http://127.0.0.1:8080/createDeck?deckName=" + DeckName + "&playFormat=" + DeckTypeMap[DeckType], requestOptions)
        .then((res) => {
            return res.text()})
        .then((deckId) => {
            const PutCardOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            }

            CardsInDeck.forEach((card) => {
                fetch("http://127.0.0.1:8080/putCard?artId=" + card.artid.toString() + "&setName=" + card.set + "&deckId=" + deckId.toString(), PutCardOptions)
            })

            navigate("/deck/" + deckId.toString());
        })
    }

    const handleCardClicked = (Card: CardType) => {
        if ((CardsInDeck.filter(c => c === Card).length !== 0))
        {
            SetCardsInDeck(
                CardsInDeck.filter(card =>
                    card != Card    
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

    const CardSelectionStyling = (id: number): string => {
        return (CardsInDeck.filter(c => c.artid === id).length !== 0) ? "border-4 border-blue-600 border-spacing-12" : "";
    }

    return (
        <div>
            <form>
                <div className='py-4 flex flex-row px-16 grid-cols-4 gap-2'>
                    <div className='basis-1/3'>
                        <label className='inline-flex items-center'>
                            <h5 className='pr-2'>
                                Deck Name:
                            </h5>
                            <StyledInput type="text" onChange={handleDeckNameChange} 
                                className="h-10 bg-white text-black select-text"
                                />
                        </label>
                    </div>
                    <div className=''>
                        <label className='inline-flex items-center'>
                            <h5 className='pr-2'>
                                Deck Type:
                            </h5>
                            <Select options={options}
                                className="w-56"
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

                    <div className='pt-1.5'>
                        <div className='text-black w-full h-full items-center'>
                            <div className='bg-white ml-24 py-1.5 rounded-md cursor-pointer hover:bg-slate-400'
                                onClick={handleClearSelection}>
                                <h5 className='px-16'>
                                    Clear
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className='pt-1.5'>
                        <div className='text-black w-full h-full items-center'>
                            <div className='bg-white ml-24 py-1.5 rounded-md cursor-pointer hover:bg-slate-400'
                                onClick={handleSubmission}>
                                <h5 className='px-16'>
                                    Submit
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-slate-200 py-4 rounded-lg'>
                    <div className="grid grid-cols-8 gap-2 justify-center px-8">
                        {
                            CardsDisplay.map((card, index) =>
                            <div key={index} onClick={() => {handleCardClicked(card)}} 
                                            className={CardSelectionStyling(card.artid)}>
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

export default CreateDeckPage;