import AppleIcon from "@/assets/apple";
import FacebookIcon from "@/assets/facebook";
import GoogleIcon from "@/assets/google";
import InputPassword from "@/components/forms/inputLogin"
import OtherLoginButton from "@/components/forms/other-login-button";
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
    const navigate = useNavigate();

    const login = () => {
        navigate("/")
        toast("Logado com sucesso!", { type: "success" })
    }

    return (
        <div className="w-100 flex justify-center gap-6 flex-col items-center absolute left-1/2 -translate-x-1/2 mt-12 px-4 py-4">
            <img className="rounded-full bg-surface-muted w-20 h-20 p-4" src="/logo.svg" />
            <h1 className="text-[1.875rem] ">Entrar</h1>
            <InputPassword title="Email" type="email" placeholder="Digite seu Email" />
            <InputPassword title="Senha" type="password" placeholder="Digite sua Senha" />
            <Button className="w-full rounded-full py-8" onClick={login}>Entrar</Button>
            <Button className="w-full rounded-full py-8" variant="outline" onClick={login} >Continuar sem cadastro</Button>
            <Label
                className="shrink-0 text-center text-sm leading-5 text-muted-foreground">
                Ou entre com
            </Label>
            <div className="flex w-full justify-between gap-4">
                <OtherLoginButton icon={<AppleIcon />} />
                <OtherLoginButton icon={<FacebookIcon />} />
                <OtherLoginButton icon={<GoogleIcon />} />
            </div>

            <div className="flex gap-2 items-center">
                <Label
                    className="shrink-0 text-center text-sm leading-5 text-muted-foreground">
                    Não possui cadastro?
                </Label>
                <Link to={{
                    pathname: "/register",
                }} className="text-base font-medium leading-6 underline text-foreground cursor-pointer">
                    Cadastre-se
                </Link>
            </div>
        </div>
    )
}

export default LoginPage
