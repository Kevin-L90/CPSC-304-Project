import { useEffect, useState } from "react";

export type CardType = {
    name: string,
    set: string,
    artid: number,
}

type CardProps = CardType;

// Images will be requested from the backend
const Card = ({ name, set, artid } : CardProps) => {
    const [ImageUrl, SetImageUrl] = useState<string>("")
    
    useEffect(() => {
        fetch(GetImageLocation(artid))
        .then((res) => res.text())
        .then((d) => {
            const img_url = "https://drive.google.com/uc?export=view&id=XXX";
            const x = d.replace("https://drive.google.com/file/d/", "");
            const y = x.replace("/view?usp=drive_link", "");

            SetImageUrl(img_url.replace("XXX", y));
        });
    })

    const GetImageLocation = (artid: number) => {
        return "http://127.0.0.1:8080/card/" + artid.toString();
    };

    

    return (
        <div key={artid}>
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
                            {set}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card;