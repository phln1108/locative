import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/providers/auth-provider";
import { locativeService } from "@/services/locative.service";
import {
  HeartIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon,
  UserIcon,
  Sun,
  Moon,
  EyeIcon,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DashboardButton() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout: clearSession } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    locativeService.logout();
    clearSession();
    navigate("/login");
    toast("Sessao encerrada com sucesso.", { type: "success" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52 z-5000" align="end">
        <DropdownMenuGroup className="p-2">
          <p className="font-medium">{isAuthenticated ? "Conta" : "Visitante"}</p>
          <p className="text-xs text-muted-foreground">
            {isAuthenticated ? user?.email ?? "Usuario logado" : "Faca login para liberar recursos"}
          </p>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {isAuthenticated ? (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserIcon />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/favorites")}>
              <HeartIcon />
              Meus Favoritos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/reviews")}>
              <Star />
              Avaliacoes
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/login")}>
              <UserIcon />
              Entrar
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === "light" ? (
              <>
                <Moon />
                Modo Escuro
              </>
            ) : (
              <>
                <Sun />
                Modo Claro
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon />
            Configuracoes e Privacidade
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EyeIcon />
            Rever Tutorial
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {isAuthenticated && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={logout}>
                <LogOutIcon />
                Sair
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

