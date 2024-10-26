import { Link } from "react-router-dom";

type NavButtonProps = {
    title: string,
    link: string,
    onClick: () => void,
}

const NavButton = ({ title, link, onClick }: NavButtonProps) => {
    return (
        <div className="bg-lime-300 rounded-md text-lg">
            <Link to={link} onClick={onClick}>
                <div className="py-4 text-center text-blue-600">
                    {title}
                </div>
            </Link>
        </div>
    )
}

export default NavButton;