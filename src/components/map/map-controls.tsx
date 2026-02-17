import { useMap } from "react-leaflet";
import { Plus, Minus, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    getLocation: () => Promise<[number, number]>;
}

export default function MapControls({ getLocation }: Props) {
    const map = useMap();

    const handleRecenter = async () => {
        const coords = await getLocation();
        if (coords) {
            map.setView(coords, 16, { animate: true });
        }
    };

    return (
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-[1000]">
            <Button size="icon" variant="secondary" onClick={() => map.zoomIn()}>
                <Plus size={18} />
            </Button>

            <Button size="icon" variant="secondary" onClick={() => map.zoomOut()}>
                <Minus size={18} />
            </Button>

            <Button size="icon" variant="secondary" onClick={handleRecenter}>
                <LocateFixed size={18} />
            </Button>
        </div>
    );
}
