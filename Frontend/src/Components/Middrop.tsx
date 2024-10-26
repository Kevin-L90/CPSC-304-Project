import { Outlet } from "react-router-dom";

const Middrop = () => {
    return (
        <div className="rounded-xl bg-red-900">
            <Outlet />
        </div>
    )   
}

export default Middrop;