import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type ListingInfo = {
    sellerName: string,
    platformName: string,
    platformLink: string,
}

type CardInformation = {
    name: string,
    set: string,
    type: string,
    rarity: string,
    mana: string,
    artist: string
}

const CardPage = () => {
    const [CardInfo, SetCardInfo] = useState<CardInformation | null>(null);
    const [ListingList, SetListingList] = useState<ListingInfo[]>([]);
    const [ImageUrl, SetImageUrl] = useState<string>("")

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

    const GetImageLocation = (artid: number): string => {
        return "http://127.0.0.1:8080/card/" + artid.toString();
    };

    const GetCardLink = (artId: number, cardName: string, setName: string) => {
        return "http://127.0.0.1:8080/card/" + setName + "/" + cardName + "/" + artId.toString();
    };

    const GetListingLink = (setname: string, artid: number): string => {
        return "http://127.0.0.1:8080/listinginfo/" + setname + "/" + artid.toString();
    }

    const { artid, setname, cardname } = useParams()
    
    const artId = ParseStringToNumber(artid);
    const cardName = (cardname === undefined) ? "" : cardname;
    const setName = (setname === undefined) ? "" : setname;

    useEffect(() => {
        fetch(GetCardLink(artId, cardName, setName))
        .then((res) => res.json())
        .then((d) => {
            SetCardInfo({
                name: d.cardName,
                set: d.setName,
                type: "Light",
                rarity: d.rarity,
                mana: d.mana,
                artist: d.artID
            })
        })

        fetch(GetImageLocation(artId))
        .then((res) => res.text())
        .then((d) => {
            const img_url = "https://drive.google.com/uc?export=view&id=XXX";
            const x = d.replace("https://drive.google.com/file/d/", "");
            const y = x.replace("/view?usp=drive_link", "");

            SetImageUrl(img_url.replace("XXX", y));

        fetch(GetListingLink(setName, artId))
        .then((res) => res.json())
        .then((d) => {
            SetListingList(d.map((listing) => {
                return {
                    sellerName: listing.sellerName,
                    platformName: listing.platformName,
                    platformLink: listing.platformLink,
                }
            }))
        })
        });
    }, [artId, cardName, setName]);

    

    return (
        (CardInfo === null) ? 
            (
            <div id="Loading">
                Loading
            </div>
            ) : (
            <div>
                <div id="card-name" className="pb-4 text-center text-4xl font-medium">
                    {CardInfo.name}
                </div>
                <div id="card-picture" className="flex justify-center h-96">
                    <img className="object-scale-down m-auto max-h-full" src={ImageUrl} />
                </div>
                <div className="pt-4">
                <div id="card-details" className="px-36 bg-slate-50 py-4 rounded-lg">
                    <div className="justify-center text-black text-center">
                        <div className="grid grid-cols-3">
                            <div className="">
                                Set: {CardInfo.set}
                            </div>
                            <div className="">
                                Type: {CardInfo.type}
                            </div>
                            <div className="">
                                Rarity: {CardInfo.rarity}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 px-32">
                            <div className="">
                                Mana: {CardInfo.mana}
                            </div>
                            <div className="">
                                Artist: {CardInfo.artist}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div id="card-listings">
                    <div className="bg-purple-600 rounded-sm px-4 py-4">
                        <div className="text-center text-xl font-semibold">
                            <h3>
                                Listings
                            </h3>
                        </div>
                    {
                        (ListingList.length > 0) ?
                        ListingList.map((listing, index) => 
                        <div key={index}>
                            <div className="grid grid-cols-3 text-center pt-3">
                                <div>
                                    Platform Name: {listing.platformName}
                                </div>
                                <div>
                                    Seller: {listing.sellerName}
                                </div>
                                <div>
                                    Link: <a href={listing.platformLink}>{listing.platformLink}</a>
                                </div>
                            </div>
                        </div>
                        )
                        :
                        <div className="text-center pt-3">
                            No Listings
                        </div>
                    }
                    </div>
                </div>
                
            </div>
        ))};

export default CardPage;