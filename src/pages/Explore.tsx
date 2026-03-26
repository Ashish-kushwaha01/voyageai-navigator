import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { useHistory } from "@/hooks/use-history";
import { useBookmarks } from "@/hooks/use-bookmarks";

const categories = ["All", "Beach", "Culture", "Adventure"];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const selectedPlaceId = searchParams.get("place");
  const navigate = useNavigate();
  const { addPlaceToHistory, history } = useHistory();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // New state for input field
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    (async () => {
      setLoading(true);
      let fetchedPlaces: Place[] = [];

      if (selectedPlaceId) {
        // If there's a selectedPlaceId in the URL, try to find it in history
        const historicalPlace = history.find((p) => p.id === selectedPlaceId);
        if (historicalPlace) {
          fetchedPlaces = [historicalPlace];
        } else {
          // If not found in history, try to fetch it by its ID (which is the video ID)
          // This assumes the webhook can handle fetching by video ID if it's not in history
          const result = await fetchPlaces(selectedPlaceId); // Pass ID as query
          fetchedPlaces = result.data;
        }
      } else if (query) {
        // If there's a search query, fetch places based on the query
        const result = await fetchPlaces(query);
        fetchedPlaces = result.data;
      }

      setPlaces(fetchedPlaces);
      setLoading(false);

      // If a single place is found, ensure the URL reflects its ID and add to history
      if (fetchedPlaces.length === 1) {
        const foundPlace = fetchedPlaces[0];
        if (selectedPlaceId !== foundPlace.id) {
          navigate(`/explore?place=${foundPlace.id}`);
        }
        addPlaceToHistory(foundPlace); // Add to history
      }
    })();
  }, [query, selectedPlaceId, navigate, addPlaceToHistory]);

  const handleSearch = () => {
    setQuery(searchInput);
  };

  const filtered = query
    ? places // If there's a query, display places directly (which comes from the webhook)
    : places.filter((p) => {
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.country.toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      });

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-24 pb-16 flex-1 overflow-y-auto">
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
            <div className="relative flex-1 flex items-center gap-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search destinations..."
                className="pl-10 flex-1"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button onClick={handleSearch} className="h-full">Search</Button>
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
                {/* Video embed or Image */}
                <div className="aspect-video bg-foreground/5 flex items-center justify-center">
                  {selectedPlace.videoId ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedPlace.videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedPlace.name}
                    ></iframe>
                  ) : selectedPlace.imageUrl ? (
                    <img
                      src={selectedPlace.imageUrl}
                      alt={selectedPlace.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">No media available</p>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-6 flex flex-col justify-center">
                  <h2 className="font-display text-2xl font-bold">{selectedPlace.name}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{selectedPlace.country}</p>
                  <p className="text-sm mt-3 leading-relaxed">{selectedPlace.description}</p>
                  {selectedPlace.moreInfo && (
                    <p className="text-sm mt-3 leading-relaxed text-muted-foreground">
                      {selectedPlace.moreInfo}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <AIGuideModal placeId={selectedPlace.id} placeName={selectedPlace.name} />
                    {selectedPlace.location && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${selectedPlace.location?.lat},${selectedPlace.location?.lng}`,
                            "_blank"
                          )
                        }
                      >
                        <MapPin className="w-4 h-4 mr-2" /> View on Map
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => selectedPlace && toggleBookmark(selectedPlace)}
                      className={isBookmarked(selectedPlace.id) ? "bg-yellow-400 text-black" : ""}
                    >
                      {isBookmarked(selectedPlace.id) ? "Bookmarked" : "Bookmark"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          {!selectedPlace && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : filtered.map((place, i) => <PlaceCard key={place.id} place={place} index={i} />)}
            </div>
          )}

          {!loading && filtered.length === 0 && !selectedPlace && (
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
