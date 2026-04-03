import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Star, Play, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Place } from "@/lib/webhooks";
import { useBookmarks } from "@/hooks/use-bookmarks";
import AIGuideModal from "./AIGuideModal";
import { Button } from "./ui/button";

const categoryColors: Record<string, string> = {
  Beach: "bg-ocean/10 text-ocean",
  Culture: "bg-sunset/10 text-sunset",
  Adventure: "bg-primary/10 text-primary",
};

// Unsplash travel images as fallbacks
const placeImages: Record<string, string> = {
  Santorini: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&fit=crop",
  Kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
  "Machu Picchu": "https://images.unsplash.com/photo-1587595431973-160d0d163f56?w=600&h=400&fit=crop",
  Bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
  "Swiss Alps": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=400&fit=crop",
  Marrakech: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=600&h=400&fit=crop",
};

export default function PlaceCard({ place, index, onDelete }: { place: Place; index?: number; onDelete?: (historyId: string) => void }) {
  const img = place.imageUrl || placeImages[place.name] || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop";

  const [imgSrc, setImgSrc] = useState(img);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link
        to={`/explore?place=${place.id}`} // Use place.id (UUID) for the URL
        className="group block rounded-xl overflow-hidden shadow-elevated bg-card hover:shadow-glow transition-shadow duration-300"
        data-test="place-card-link"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imgSrc}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgSrc("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[place.category] || "bg-muted text-muted-foreground"}`}>
              {place.category}
            </span>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(place.id);
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 flex items-center justify-center transition-colors"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
          <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg text-card-foreground">{place.name}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
            <MapPin className="w-3.5 h-3.5" />
            {place.country}
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{place.description}</p>
          <div className="flex items-center gap-1 mt-3">
            <Star className="w-4 h-4 text-sunset fill-sunset" />
            <span className="text-sm font-medium text-card-foreground">{place.rating}</span>
          </div>
        </div>
      </Link>
      {/* AIGuideModal and Bookmark Button are outside the Link for separate actions */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <AIGuideModal placeId={place.id} placeName={place.name} />
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(place);
          }}
          className={isBookmarked(place.id) ? "bg-yellow-400 text-black" : ""}
        >
          {isBookmarked(place.id) ? "Bookmarked" : "Bookmark"}
        </Button>
      </div>
    </motion.div>
  );
}
