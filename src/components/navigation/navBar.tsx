import { Map, Search, User, UsersRound } from "lucide-react"
import NavButton from "./navButton";


const NavBar = () => {
    // const location = useLocation();


    return (
        <div className="w-88 h-fit py-2 px-4 fixed flex gap-1 rounded-xl justify-around items-center bottom-4 left-1/2 -translate-x-1/2 z-50 shadow-floating">
            <NavButton
                icon={<Search />}
                title="Explorar"
                selected
            />
            <NavButton
                icon={<Map />}
                title="Mapa"
            />
            <NavButton
                icon={<UsersRound />}
                title="Comunidade"
            />
            <NavButton
                icon={<User />}
                title="Perfil"
            />
        </div>
    )
}

export default NavBar