import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { Link } from "react-router-dom";
import { MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Your Bookmarks</h1>

          {bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">No bookmarks yet!</p>
              <p className="text-md text-muted-foreground mb-6">Start exploring and bookmark your favorite destinations.</p>
              <Link to="/explore">
                <Button size="lg">Explore Destinations</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((place) => (
                <div key={place.id} className="bg-card rounded-xl shadow-elevated overflow-hidden flex flex-col">
                  <Link to={`/explore?place=${place.id}`} className="block">
                    <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="font-semibold text-xl mb-2">{place.name}</h2>
                    <p className="text-muted-foreground text-sm flex-1">{place.description.substring(0, 100)}...</p>
                    <div className="flex items-center justify-between mt-4">
                      <Link to={`/explore?place=${place.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => removeBookmark(place.id)}>
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
