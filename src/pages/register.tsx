import InputPassword from "@/components/forms/inputLogin"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "react-router-dom"
import OtherLoginButton from "@/components/forms/other-login-button"
import GoogleIcon from "@/assets/google"
import AppleIcon from "@/assets/apple"
import FacebookIcon from "@/assets/facebook"

const RegisterPage = () => {

    return (
        <div className="w-100 flex justify-center gap-4 flex-col items-center absolute left-1/2 -translate-x-1/2 mt-12 px-4 py-4">
            <img className="rounded-full bg-surface-muted w-20 h-20 p-4" src="/logo.svg" />
            <h1 className="text-[1.875rem] ">Cadastrar</h1>
            <div className="flex gap-8 justify-center">
                <InputPassword required title="nome" type="text" placeholder="Seu Nome" />
                <InputPassword title="sobrenome" type="text" placeholder="Sobrenome" />
            </div>
            <InputPassword required title="Email" type="email" placeholder="Seu Email" />

            <InputPassword required title="Senha" type="password" placeholder="Digite sua Senha" />
            <InputPassword required title="Confime Senha" type="password" placeholder="Confirme sua Senha" />

            <div className="flex items-center gap-3 w-full">
                <Checkbox id="terms" required />
                <Label
                    htmlFor="terms"
                    className="shrink-0 text-center text-sm leading-5 text-muted-foreground "
                >
                    Aceito os termos e políticas de privacidade
                </Label>
            </div>

            <Button className="w-full rounded-full py-8">Cadastrar</Button>
            <Label
                className="shrink-0 text-center text-sm leading-5 text-muted-foreground">
                Ou Cadastre-se com
            </Label>
            <div className="flex w-full justify-between gap-4">
                <OtherLoginButton icon={<AppleIcon />} />
                <OtherLoginButton icon={<FacebookIcon />} />
                <OtherLoginButton icon={<GoogleIcon />} />
            </div>
            <div className="flex gap-2 items-center">
                <Label
                    className="shrink-0 text-center text-sm leading-5 text-muted-foreground">
                    Já tem uma conta?
                </Label>
                <Link to={{
                    pathname: "/login",
                }} className="text-base font-medium leading-6 underline text-foreground cursor-pointer">
                    Entrar
                </Link>
            </div>
        </ div>
    )
}

export default RegisterPage
