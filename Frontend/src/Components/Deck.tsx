import { useEffect, useState } from "react";

export type DeckType = {
    name: string,
    format: string,
    creator: string,
    id: number
}

type DeckProps = DeckType;

// Images will be requested from the backend
const Deck = ({ name, format, creator, id } : DeckProps) => {
    const [ImageUrl, SetImageUrl] = useState<string>("")

    const GetImageLocation = (id: number) => {
        return "http://127.0.0.1:8080/deck/thumbnail/" + id.toString();
    }

    useEffect(() => {
        fetch(GetImageLocation(id))
        .then((res) => res.text())
        .then((d) => {
            const img_url = "https://drive.google.com/uc?export=view&id=XXX";
            const x = d.replace("https://drive.google.com/file/d/", "");
            const y = x.replace("/view?usp=drive_link", "");

            SetImageUrl(img_url.replace("XXX", y));
        });
    })
    

    return (
        <div key={id}>
            <div className="bg-black rounded-sm">
                <div className="px-2 py-2">
                    <img src={ImageUrl} />
                </div>

                <div className="bg-slate-500 rounded-lg">
                    <div className="text-left text-slate-100">
                        <div className="text-base">
                            {name}
                        </div> 
                        <div className="text-sm italic text-slate-300">
                            {format}
                        </div>
                        <div className="text-sm italic text-slate-300">
                            {creator}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Deck;