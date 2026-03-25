import { motion } from "framer-motion";
import { User, MapPin, Clock, Star, CreditCard, BookmarkPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const savedPlaces = [
  { name: "Santorini, Greece", date: "Mar 12, 2026" },
  { name: "Kyoto, Japan", date: "Mar 10, 2026" },
  { name: "Bali, Indonesia", date: "Mar 8, 2026" },
];

const history = [
  { name: "Machu Picchu", action: "AI Guide used", time: "2 hours ago" },
  { name: "Swiss Alps", action: "Watched virtual tour", time: "Yesterday" },
  { name: "Marrakech", action: "Explored via map", time: "3 days ago" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-24 pb-16 flex-1">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Dashboard</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl shadow-elevated p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-hero-gradient flex items-center justify-center">
                  <User className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg">Explorer</h3>
                  <p className="text-sm text-muted-foreground">explorer@voyageai.com</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">Free</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Places Saved</span>
                  <span className="font-medium">{savedPlaces.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Guides Used</span>
                  <span className="font-medium">5 / 10</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button size="sm" className="flex-1 bg-hero-gradient text-primary-foreground gap-1 hover:opacity-90">
                  <CreditCard className="w-4 h-4" /> Upgrade
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </motion.div>

            {/* Saved places */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl shadow-elevated p-6"
            >
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-primary" /> Saved Places
              </h3>
              <div className="space-y-3">
                {savedPlaces.map((p) => (
                  <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{p.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl shadow-elevated p-6"
            >
              <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-ocean" /> Recent Activity
              </h3>
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.name + h.action} className="flex items-start justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <span className="text-sm font-medium">{h.name}</span>
                      <p className="text-xs text-muted-foreground">{h.action}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{h.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
