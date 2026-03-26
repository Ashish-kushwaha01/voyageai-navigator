import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Star, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Place } from "@/lib/webhooks";
import { formatDistanceToNow } from "date-fns";
import { useHistory } from "@/hooks/use-history"; // Import the new hook

export default function HistoryPage() {
  const { history } = useHistory();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-24 pb-16 flex-1">
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
              {history.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={`/explore?place=${place.id}`}
                    className="group block rounded-xl overflow-hidden shadow-elevated bg-card hover:shadow-glow transition-shadow duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground`}>
                          {place.category}
                        </span>
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
                        {place.viewedAt && (
                          <>
                            <span className="mx-1 text-muted-foreground">•</span>
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(place.viewedAt), { addSuffix: true })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}