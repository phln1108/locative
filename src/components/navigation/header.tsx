import { useLocation, useNavigate } from "react-router-dom";
import DashboardButton from "@/components/navigation/dashboard-menu";
import SearchBar from "./search-bar";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="bg-background border-b border-border shrink-0">
            <div className="container mx-auto px-4">

                <div className="flex items-center justify-between py-4">
                    <button
                        className="cursor-pointer text-xl sm:text-2xl font-bold text-foreground hover:opacity-70 transition-opacity"
                        onClick={() => navigate("/")}
                    >
                        LOCATIVE
                    </button>

                    <DashboardButton />
                </div>
            </div>
            {location.pathname !== "/map" &&
                <SearchBar/>
            }
        </header>
    )
}
