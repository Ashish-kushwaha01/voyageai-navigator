import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard"; // Import PlaceCard
import { formatDistanceToNow } from "date-fns";
import { useHistory } from "@/hooks/use-history"; // Import the new hook

export default function HistoryPage() {
  const { history, deleteHistoryItem } = useHistory();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-24 pb-16 flex-1 overflow-y-auto">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Your <span className="text-gradient">History</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Places you've recently viewed
            </p>
          </motion.div>

          {history.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No viewed destinations yet. Start exploring!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item, index) => (
                <PlaceCard
                    key={item.id}
                    place={{
                      id: item.id,
                      place_id: item.place_id,
                      name: item.place_name,
                      country: item.country,
                      description: item.description,
                      imageUrl: item.image_url,
                      videoId: item.video_id,
                      rating: item.rating,
                      category: item.category,
                      moreInfo: item.more_info,
                      location: item.location_name ? {
                        name: item.location_name,
                        lat: item.location_lat,
                        lng: item.location_lng,
                      } : undefined,
                    }}
                    index={index}
                    onDelete={deleteHistoryItem}
                  />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}