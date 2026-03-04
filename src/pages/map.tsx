import Map from "@/components/map/map";
import Header from "@/components/navigation/header";


export default function MapPage() {
    return (
        <div className="h-dvh w-full flex flex-col overflow-hidden">
        <Header/>
        <Map/>
        </ div>
    )
}