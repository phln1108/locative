import AppleIcon from "@/assets/apple";
import FacebookIcon from "@/assets/facebook";
import GoogleIcon from "@/assets/google";
import InputLogin from "@/components/forms/inputLogin";
import OtherLoginButton from "@/components/forms/other-login-button";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { locativeService } from "@/services/locative.service";
import { useAuth } from "@/providers/auth-provider";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: loginSession, logout: logoutSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      await locativeService.login({ email, senha: password });
      loginSession({ email });
      navigate("/");
      toast("Logado com sucesso!", { type: "success" });
    } catch {
      toast("Falha no login. Verifique email e senha.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    locativeService.logout();
    logoutSession();
    navigate("/");
    toast("Modo visitante ativado", { type: "info" });
  };

  return (
    <div className="w-100 flex justify-center gap-6 flex-col items-center absolute left-1/2 -translate-x-1/2 mt-12 px-4 py-4">
      <img className="rounded-full bg-surface-muted w-20 h-20 p-4" src="/logo.svg" />
      <h1 className="text-[1.875rem] ">Entrar</h1>
      <InputLogin
        title="Email"
        type="email"
        placeholder="Digite seu Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <InputLogin
        title="Senha"
        type="password"
        placeholder="Digite sua Senha"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button className="w-full rounded-full py-8" onClick={login} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
      <Button className="w-full rounded-full py-8" variant="outline" onClick={loginAsGuest}>
        Continuar sem cadastro
      </Button>
      <Label className="shrink-0 text-center text-sm leading-5 text-muted-foreground">Ou entre com</Label>
      <div className="flex w-full justify-between gap-4">
        <OtherLoginButton icon={<AppleIcon />} />
        <OtherLoginButton icon={<FacebookIcon />} />
        <OtherLoginButton icon={<GoogleIcon />} />
      </div>

      <div className="flex gap-2 items-center">
        <Label className="shrink-0 text-center text-sm leading-5 text-muted-foreground">
          Nao possui cadastro?
        </Label>
        <Link
          to={{
            pathname: "/register",
          }}
          className="text-base font-medium leading-6 underline text-foreground cursor-pointer"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
