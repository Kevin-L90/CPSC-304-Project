import { Link } from "react-router-dom";
import { DeckType } from "../../../Components/Deck";
import { useEffect, useState } from "react";

type DeckProps = DeckType & {
    onDelete: (e: unknown) => void,
    onEdit: (e: unknown) => void,
};

// Images will be requested from the backend
const EditableDeck = ({ name, format, creator, id, onDelete, onEdit } : DeckProps) => {
    const [ImageUrl, SetImageUrl] = useState<string>("")
    
    const GetImageLocation = (id: number) => {
        return "http://127.0.0.1:8080/deck/thumbnail/" + id.toString();
    }

    const GetDeckPageLocation = (id: number) => {
        return "/deck/" + id.toString();
    }

    const handleEdit = () => {
        onEdit(id)
    }

    const handleDelete = () => {
        onDelete(id);
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
            <Link to={GetDeckPageLocation(id)}>
                <div className="bg-black rounded-sm">
                    <div className="px-2">
                        <img src={ImageUrl} />
                    </div>

                    <div className="bg-slate-500 rounded-lg">
                        <div className="text-left text-slate-100 pl-2">
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
            </Link>
            <div className="grid grid-cols-2 rounded-lg gap-0.5 text-black">
                    <div className="text-center rounded-lg bg-slate-100 border-slate-500 border-2 hover:bg-slate-500 hover:border-slate-800 cursor-pointer"
                            onClick={handleEdit}>
                        Edit
                    </div>
                    <div className="text-center rounded-lg bg-slate-100 border-slate-500 border-2 hover:bg-slate-500 hover:border-slate-800 cursor-pointer"
                            onClick={handleDelete}>
                        Delete
                    </div>
                </div>
        </div>
    )
}

export default EditableDeck;