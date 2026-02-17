import { Compass, Search, Map } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";


export default function SearchBar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (

        <div className="sticky top-0 bg-transparent z-1000">
            <div className="container mx-auto px-4 py-3">
                <form>
                    <div className="flex items-center gap-2 w-full">
                        {location.pathname !== "/" &&

                            <Button
                                type="button"
                                size="icon"
                                className="
                                        w-12 h-12 rounded-full
                                        bg-[rgb(0,136,204)]
                                        hover:bg-primary/90
                                        shadow-md
                                    "
                                aria-label="Explorar"
                                onClick={() => navigate("/")}
                            >
                                <Compass className="w-5 h-5 text-primary-foreground" />
                            </Button>
                        }
                        <div className="flex-1 flex items-center gap-2 bg-muted rounded-full shadow-sm px-2 py-2">
                            <input
                                type="text"
                                className="
                                            w-full bg-transparent border-0
                                            px-4 py-3 text-base
                                            placeholder:text-muted-foreground
                                            focus-visible:outline-none
                                            focus-visible:ring-0
                                        "
                                placeholder="O que procura?"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="w-12 h-12 rounded-full bg-button-secondary hover:bg-button-secondary/80 shadow-sm"
                                aria-label="Pesquisar"
                            >
                                <Search className="w-5 h-5 text-black" />
                            </Button>
                        </div>
                        {location.pathname !== "/map" &&

                            <Button
                                type="button"
                                size="icon"
                                className="
                                        w-12 h-12 rounded-full
                                        bg-[rgb(0,136,204)]
                                        hover:bg-primary/90
                                        shadow-md
                                    "
                                aria-label="Ver mapa"
                                onClick={() => navigate("/map")}
                            >
                                <Map className="w-5 h-5 text-primary-foreground" />
                            </Button>
                        }

                    </div>

                </form>
            </div>
        </div>
    )
}