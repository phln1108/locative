import AppleIcon from "@/assets/apple";
import FacebookIcon from "@/assets/facebook";
import GoogleIcon from "@/assets/google";
import InputLogin from "@/components/forms/inputLogin";
import OtherLoginButton from "@/components/forms/other-login-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { locativeService } from "@/services/locative.service";
import { useAuth } from "@/providers/auth-provider";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const fullName = [name.trim(), surname.trim()].filter(Boolean).join(" ").trim();

    if (!name.trim()) {
      toast("Informe seu nome.", { type: "error" });
      return;
    }

    if (!normalizedEmail) {
      toast("Informe seu email.", { type: "error" });
      return;
    }

    if (password.length < 6) {
      toast("A senha deve ter pelo menos 6 caracteres.", { type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      toast("As senhas nao coincidem.", { type: "error" });
      return;
    }

    if (!acceptedTerms) {
      toast("Aceite os termos para continuar.", { type: "error" });
      return;
    }

    try {
      setLoading(true);
      await locativeService.register({
        email: normalizedEmail,
        senha: password,
        full_name: fullName || undefined,
      });
      await locativeService.login({
        email: normalizedEmail,
        senha: password,
      });
      login({ email: normalizedEmail });
      toast("Cadastro realizado com sucesso!", { type: "success" });
      navigate("/");
    } catch {
      toast("Nao foi possivel concluir o cadastro.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 flex justify-center gap-4 flex-col items-center absolute left-1/2 -translate-x-1/2 mt-12 px-4 py-4">
      <img className="rounded-full bg-surface-muted w-20 h-20 p-4" src="/logo.svg" />
      <h1 className="text-[1.875rem] ">Cadastrar</h1>
      <div className="flex gap-8 justify-center">
        <InputLogin
          required
          title="nome"
          type="text"
          placeholder="Seu Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <InputLogin
          title="sobrenome"
          type="text"
          placeholder="Sobrenome"
          value={surname}
          onChange={(event) => setSurname(event.target.value)}
        />
      </div>
      <InputLogin
        required
        title="Email"
        type="email"
        placeholder="Seu Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <InputLogin
        required
        title="Senha"
        type="password"
        placeholder="Digite sua Senha"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <InputLogin
        required
        title="Confime Senha"
        type="password"
        placeholder="Confirme sua Senha"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />

      <div className="flex items-center gap-3 w-full">
        <Checkbox
          id="terms"
          required
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
        />
        <Label
          htmlFor="terms"
          className="shrink-0 text-center text-sm leading-5 text-muted-foreground "
        >
          Aceito os termos e politicas de privacidade
        </Label>
      </div>

      <Button className="w-full rounded-full py-8" onClick={handleRegister} disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
      <Label className="shrink-0 text-center text-sm leading-5 text-muted-foreground">
        Ou Cadastre-se com
      </Label>
      <div className="flex w-full justify-between gap-4">
        <OtherLoginButton icon={<AppleIcon />} />
        <OtherLoginButton icon={<FacebookIcon />} />
        <OtherLoginButton icon={<GoogleIcon />} />
      </div>
      <div className="flex gap-2 items-center">
        <Label className="shrink-0 text-center text-sm leading-5 text-muted-foreground">
          Ja tem uma conta?
        </Label>
        <Link
          to={{
            pathname: "/login",
          }}
          className="text-base font-medium leading-6 underline text-foreground cursor-pointer"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
