import { ArrowLeft, Funnel, MapPin, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import NearbyCard from "@/components/ui/nearby-card"
import { mockedNearPlaces } from "@/models/mocked"

import { useNavigate } from "react-router-dom";

const NearbyPlacesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-background border-b">
        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center gap-4">
            <Button size="icon" variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1">
              <h1 className="text-[20px] font-semibold">
                Lugares próximos
              </h1>
              <p className="text-sm text-muted-foreground">
                {mockedNearPlaces.length} lugares encontrados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            <Select>
              <SelectTrigger className="w-auto gap-2">
                <MapPin className="w-4 h-4" />
                <SelectValue placeholder="Todas distâncias" />
              </SelectTrigger>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Funnel className="w-4 h-4" />
                  Categorias
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>

            <Select>
              <SelectTrigger className="w-auto gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <SelectValue placeholder="Mais próximos" />
              </SelectTrigger>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockedNearPlaces.map((place) => (
          <NearbyCard
            key={place.title}
            {...place}
            variant="grid"
          />
        ))}
      </div>
    </div>
  )
}

export default NearbyPlacesPage
