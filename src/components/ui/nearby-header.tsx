interface Props {
  title: string;
  subtitle: string;
  total: number;
}

export default function NearbyHeader({ title, subtitle, total }: Props) {
  const parsedSubtitle = subtitle || `${total} lugares encontrados perto de voce`;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{parsedSubtitle}</p>
      </div>
    </div>
  );
}
