import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"

export function ExhibitionCard({ exhibition }: { exhibition: any }) {
  return (
    <Link href={`/exhibitions/${exhibition._id}`} className="flex-none w-80">
      <Card
        className="
          overflow-hidden 
          h-full 
          cursor-pointer 
          transition-all 
          hover:-translate-y-1 
          hover:shadow-2xl 
          rounded-2xl 
          border 
          border-border/50 
          bg-surface
        "
      >
        <div className="relative">
          {/* Poster */}
          {exhibition.posterPicture ? (
            <img
              src={exhibition.posterPicture}
              alt={exhibition.name}
              className="w-full h-52 object-cover"
            />
          ) : (
            <div className="w-full h-52 bg-gradient-to-br from-accent-light to-accent flex items-center justify-center">
              <Calendar className="h-16 w-16 text-white/60" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {/* Date badge */}
          <div className="
            absolute top-3 right-3 
            px-3 py-1 
            rounded-xl 
            text-xs 
            font-semibold 
            text-white 
            bg-white/10 
            backdrop-blur-md 
            shadow-lg
          ">
            {new Date(exhibition.startDate).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short"
            })}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <h3 className="font-bold text-lg text-foreground line-clamp-1">
            {exhibition.name}
          </h3>

          {/* Description */}
          <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
            {exhibition.description}
          </p>

          {/* Info */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 bg-accent/10 rounded-md">
                <MapPin className="h-4 w-4 text-accent" />
              </div>
              <span className="line-clamp-1">{exhibition.venue}</span>
            </div>

            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 bg-accent/10 rounded-md">
                <Calendar className="h-4 w-4 text-accent" />
              </div>
              <span>{exhibition.durationDay} days</span>
            </div>

            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 bg-accent/10 rounded-md">
                <Users className="h-4 w-4 text-accent" />
              </div>
              <span>
                {exhibition.smallBoothQuota + exhibition.bigBoothQuota} booths available
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
