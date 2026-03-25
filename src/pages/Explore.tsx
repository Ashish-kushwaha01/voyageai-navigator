import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import SkeletonCard from "@/components/SkeletonCard";
import AIGuideModal from "@/components/AIGuideModal";
import { fetchPlaces, type Place } from "@/lib/webhooks";

const categories = ["All", "Beach", "Culture", "Adventure"];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const selectedPlaceId = searchParams.get("place");

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await fetchPlaces(query);
      setPlaces(result.data);
      setLoading(false);
    })();
  }, []);

  const filtered = places.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.country.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-24 pb-16 flex-1">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Explore <span className="text-gradient">Destinations</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover amazing places around the world
            </p>
          </motion.div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search destinations..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={activeCategory === cat ? "default" : "outline"}
                  className={activeCategory === cat ? "bg-hero-gradient text-primary-foreground" : ""}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected place detail */}
          {selectedPlace && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 rounded-xl overflow-hidden bg-card shadow-elevated"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Video embed placeholder */}
                <div className="aspect-video bg-foreground/5 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Video player — connect YouTube API via n8n</p>
                  </div>
                </div>
                {/* Info */}
                <div className="p-6 flex flex-col justify-center">
                  <h2 className="font-display text-2xl font-bold">{selectedPlace.name}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{selectedPlace.country}</p>
                  <p className="text-sm mt-3 leading-relaxed">{selectedPlace.description}</p>
                  <div className="mt-4">
                    <AIGuideModal placeId={selectedPlace.id} placeName={selectedPlace.name} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.map((place, i) => <PlaceCard key={place.id} place={place} index={i} />)}
          </div>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No destinations found. Try a different search.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
