import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/providers/theme-provider";
import { MapPin, HeartIcon, LogOutIcon, MenuIcon, SettingsIcon, UserIcon, Sun, Moon, EyeIcon } from "lucide-react"
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";

export default function DashboardButton() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate()

    const logout = () => {
        navigate("/login")
        toast("Sessão encerrada com sucesso.", { type: "success" })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost"><MenuIcon /></Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-44 z-5000" align="end">
                <DropdownMenuGroup className="p-2">
                    <p className="font-medium">Nome</p>
                    <p className="text-xs text-muted-foreground">Nome@google.com</p>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <UserIcon />
                        Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <HeartIcon />
                        Meus Favoritos
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <MapPin />
                        Lugares Salvos
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={toggleTheme}
                    >
                        {theme === "light" ?
                            <>
                                <Moon />
                                Modo Escuro
                            </>
                            :
                            <>
                                <Sun />
                                Modo Claro
                            </>
                        }
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <SettingsIcon />
                        Configurações e Privacidade
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <EyeIcon />
                        Rever Tutorial
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={logout}>
                        <LogOutIcon />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 
