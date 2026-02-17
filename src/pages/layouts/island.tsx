import DarkModeButton from "@/components/theme/dark-mode-button";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";



export default function IslandLayout() {
    return (
        <div className="h-full w-full max-w-272 flex justify-center px-8">
            <DarkModeButton />
            <Outlet />
        </div>
    );
}
