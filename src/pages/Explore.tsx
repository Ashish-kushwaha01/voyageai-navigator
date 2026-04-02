import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
import { toast } from "sonner";
import { isUUID } from "@/lib/utils"; // Import isUUID utility
import { supabase } from "@/lib/supabase"; // Import supabase client
import { useAuth } from "@/contexts/AuthContext";
import { useGuestCredits } from "@/hooks/useGuestCredits";

const categories = ["All", "Beach", "Culture", "Adventure"];

export default function ExplorePage() {
  const [searchParams] = useSearchParams();
  const selectedPlaceId = searchParams.get("place");
  const navigate = useNavigate();
  const { addPlaceToHistory } = useHistory();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { user, fetchUserProfile } = useAuth(); // Use the useAuth hook
  const { credits: guestCredits, decrementCredits: decrementGuestCredits, hasCredits: hasGuestCredits } = useGuestCredits();

  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState(""); // New state for input field
  const [activeCategory, setActiveCategory] = useState("All");
  const [singlePlaceNotFound, setSinglePlaceNotFound] = useState(false); // New state for handling single place not found
  const lastAddedPlaceId = useRef<string | null>(null);
  const lastQuery = useRef<string | null>(null); // To track the last successfully processed query

  const processSuccessfulSearch = async (foundPlace: Place) => {
    if (user) {
      const currentCredits = user.user_metadata?.credits || 0;
      if (currentCredits > 0) {
        const { error } = await supabase
          .from("profiles")
          .update({ credits: currentCredits - 1 })
          .eq("id", user.id);

        if (error) {
          console.error("Error decrementing credits:", error.message);
          toast.error("Failed to decrement credits.");
        } else {
          await fetchUserProfile(); // Refresh user profile to show updated credits
        }
      }
    } else {
      // Decrement guest credits
      decrementGuestCredits();
    }
    addPlaceToHistory(query, foundPlace);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setSinglePlaceNotFound(false); // Reset on new effect run
      let fetchedPlaces: Place[] = [];

      if (selectedPlaceId) {
        // Now use the selectedPlaceId directly (whether it's a UUID or YouTube ID) to fetch the place details
        const result = await fetchPlaces({ placeId: selectedPlaceId });
        fetchedPlaces = result.data;
        if (fetchedPlaces.length === 0) {
          setSinglePlaceNotFound(true);
        }
      } else if (query) {
        // If there's a search query, fetch places based on the query
        const result = await fetchPlaces({ query: query });
        fetchedPlaces = result.data;

        // Only process if the query is new and yielded results
        if (fetchedPlaces.length === 1 && query !== lastQuery.current) {
          await processSuccessfulSearch(fetchedPlaces[0]);
          lastQuery.current = query; // Mark this query as processed
        }
      }

      setPlaces(fetchedPlaces);
      setLoading(false);

      // Add to history only if a new search was performed (query is present and no selectedPlaceId)
      if (query && !selectedPlaceId && fetchedPlaces.length === 1) {
        const foundPlace = fetchedPlaces[0];
        // This part is now handled by processSuccessfulSearch, but keeping for clarity if other conditions apply
        // addPlaceToHistory(query, foundPlace);
      }
    })();
  }, [query, selectedPlaceId, addPlaceToHistory, navigate]); // Removed user, fetchUserProfile from dependencies

  const handleSearch = async () => {
    if (searchInput.trim()) {
      if (user) {
        const currentCredits = user.user_metadata?.credits || 0;
        if (currentCredits <= 0) {
          toast.error("You have no credits left. Please upgrade to Pro or wait for credits to reset.");
          return;
        }
      } else {
        // Guest user credit check
        if (!hasGuestCredits) {
          toast.error("You have no guest credits left. Please sign in or sign up for more features!");
          return;
        }
      }

      setLoading(true); // Start loading
      navigate("/explore"); // Always navigate to base explore URL
      setQuery(searchInput.trim()); // Set query to trigger useEffect
    }
  };

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  // Derived state to determine which single place to display in detail
  const selectedPlaceForDisplay = selectedPlaceId
    ? selectedPlace // If URL has placeId, use that specific place
    : places.length === 1 && query // If no placeId in URL, but a query yielded one result
    ? places[0]
    : undefined;

  // Determine what to render based on selectedPlaceId and places state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (selectedPlaceId && singlePlaceNotFound) {
      return (
        <div className="text-center py-20 text-muted-foreground">
          <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Destination not found. Please check the ID or try a different search.</p>
        </div>
      );
    }

    if (selectedPlaceForDisplay) {
      // Render single detailed place view
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-xl overflow-hidden bg-card shadow-elevated"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Video embed or Image */}
            <div className="aspect-video bg-foreground/5 flex items-center justify-center">
              {selectedPlaceForDisplay.videoId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedPlaceForDisplay.videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={selectedPlaceForDisplay.name}
                ></iframe>
              ) : selectedPlaceForDisplay.imageUrl ? (
                <img
                  src={selectedPlaceForDisplay.imageUrl}
                  alt={selectedPlaceForDisplay.name}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop")}
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
              <h2 className="font-display text-2xl font-bold">{selectedPlaceForDisplay.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{selectedPlaceForDisplay.country}</p>
              <p className="text-sm mt-3 leading-relaxed">{selectedPlaceForDisplay.description}</p>
              {selectedPlaceForDisplay.moreInfo && (
                <p className="text-sm mt-3 leading-relaxed text-muted-foreground">
                  {selectedPlaceForDisplay.moreInfo}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <AIGuideModal placeId={selectedPlaceForDisplay.id} placeName={selectedPlaceForDisplay.name} />
                {selectedPlaceForDisplay.location && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${selectedPlaceForDisplay.location?.name}`,
                        "_blank"
                      )
                    }
                  >
                    <MapPin className="w-4 h-4 mr-2" /> View on Map
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => selectedPlaceForDisplay && toggleBookmark(selectedPlaceForDisplay)}
                  className={isBookmarked(selectedPlaceForDisplay.id) ? "bg-yellow-400 text-black" : ""}
                >
                  {isBookmarked(selectedPlaceForDisplay.id) ? "Bookmarked" : "Bookmark"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (places.length > 0) {
      // Render grid of search results
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place, i) => (
            <PlaceCard key={place.id} place={place} index={i} />
          ))}
        </div>
      );
    }

    if (query) {
      // No destinations found for the query
      return (
        <div className="col-span-full text-center py-20 text-muted-foreground">
          <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No destinations found for "{query}". Try a different search.</p>
        </div>
      );
    }

    // Initial state: no search performed
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p>Start by searching for a destination!</p>
      </div>
    );
  };

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

          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-card rounded-lg shadow-elevated flex items-center justify-between"
            >
              <p className="text-sm text-muted-foreground">
                You have {guestCredits} guest credits left.
              </p>
              {!hasGuestCredits && (
                <Link to="/login">
                  <Button size="sm">Sign In / Sign Up</Button>
                </Link>
              )}
            </motion.div>
          )}

          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}
