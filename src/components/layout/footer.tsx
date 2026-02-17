export function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 shrink-0 border-t border-border bg-muted/50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="mb-6 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="font-semibold">
              Sobre o LOCATIVE
            </h3>
            <p className="text-sm text-muted-foreground">
              Ele conecta você ao que está acontecendo ao seu redor,
              lugares, eventos, serviços e experiências em tempo real.
              Descubra o que fazer, onde comer, como chegar ou simplesmente
              o que está rolando perto de você.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">
              Links Rápidos
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="cursor-pointer hover:text-foreground transition-colors">
                Como Funciona
              </li>
              <li className="cursor-pointer hover:text-foreground transition-colors">
                Categorias
              </li>
              <li className="cursor-pointer hover:text-foreground transition-colors">
                Para Empresas
              </li>
              <li className="cursor-pointer hover:text-foreground transition-colors">
                Acesso à API
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">
              Legal e Suporte
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="cursor-pointer hover:text-foreground transition-colors">
                Política de Privacidade
              </li>
              <li className="cursor-pointer hover:text-foreground transition-colors">
                Termos de Serviço
              </li>
              <li className="cursor-pointer hover:text-foreground transition-colors">
                Acessibilidade
              </li>
              <li className="cursor-pointer hover:text-foreground transition-colors">
                Central de Ajuda
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            © 2024 LOCATIVE. Descoberta semântica para exploração urbana.
          </p>
        </div>
      </div>
    </footer>
  );
}
