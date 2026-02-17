import { Link } from "react-router-dom";
import { ArrowLeft, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Ícone */}
        <div className="flex justify-center mb-6">
          <Ghost className="h-16 w-16 text-muted-foreground" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-semibold tracking-tight">
          Página não encontrada
        </h1>

        {/* Descrição */}
        <p className="mt-3 text-muted-foreground">
          A página que você tentou acessar não existe ou foi movida.
        </p>

        {/* Ações */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-muted transition"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
