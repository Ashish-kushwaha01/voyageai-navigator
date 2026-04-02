import { motion } from "framer-motion";
import { User, MapPin, Clock, Star, CreditCard, BookmarkPlus, LogOut, Globe, Sparkles, Compass, History, Upload, Key, Settings, TrendingUp, TrendingDown, Timer, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useHistory } from "@/hooks/use-history";
import { useBookmarks } from "@/hooks/use-bookmarks";
import Sidebar from "@/components/Sidebar";
import PlaceCard from "@/components/PlaceCard"; // Import PlaceCard
import { formatDistanceToNow } from "date-fns"; // Import formatDistanceToNow
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function DashboardPage() {
  const { history } = useHistory();
  const { bookmarks } = useBookmarks();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="w-6 h-6" />
      </Button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex flex-col flex-1 lg:ml-64">
        <main className="flex-1 pt-24 pb-16 overflow-y-auto">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Dashboard</h1>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat Card 1: Destinations Explored */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl shadow-elevated p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{history.length}</div>
                <div className="text-sm text-muted-foreground">Destinations Explored</div>
              </div>
              <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-400">+12%</Badge>
            </motion.div>

            {/* Stat Card 2: AI Guide Credits Remaining */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl shadow-elevated p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{user?.user_metadata?.credits ?? 0}</div>
                <div className="text-sm text-muted-foreground">AI Guide Credits Remaining</div>
              </div>
              <Badge variant="secondary" className="ml-auto bg-red-500/20 text-red-400">-0.5s</Badge>
            </motion.div>

            {/* Stat Card 3: Bookmarks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-xl shadow-elevated p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                <BookmarkPlus className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">{bookmarks.length}</div>
                <div className="text-sm text-muted-foreground">Bookmarks</div>
              </div>
              <Badge variant="secondary" className="ml-auto bg-green-500/20 text-green-400">+8%</Badge>
            </motion.div>

            {/* Stat Card 4: Avg. Exploration Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-xl shadow-elevated p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold">3.2s</div>
                <div className="text-sm text-muted-foreground">Avg. Exploration Time</div>
              </div>
              <Badge variant="secondary" className="ml-auto bg-red-500/20 text-red-400">-0.5s</Badge>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link to="/explore">
                <div className="bg-card rounded-xl shadow-elevated p-6 flex flex-col items-center text-center hover:shadow-glow transition-shadow">
                  <Globe className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-lg">Explore Destinations</h3>
                  <p className="text-sm text-muted-foreground">Discover new places with AI</p>
                </div>
              </Link>
              <Link to="/history">
                <div className="bg-card rounded-xl shadow-elevated p-6 flex flex-col items-center text-center hover:shadow-glow transition-shadow">
                  <History className="w-8 h-8 text-ocean mb-3" />
                  <h3 className="font-semibold text-lg">View History</h3>
                  <p className="text-sm text-muted-foreground">Access your recently viewed places</p>
                </div>
              </Link>
              <Link to="/bookmarks">
                <div className="bg-card rounded-xl shadow-elevated p-6 flex flex-col items-center text-center hover:shadow-glow transition-shadow">
                  <BookmarkPlus className="w-8 h-8 text-yellow-400 mb-3" />
                  <h3 className="font-semibold text-lg">Manage Bookmarks</h3>
                  <p className="text-sm text-muted-foreground">Organize your saved destinations</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity / Saved Places */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card rounded-xl shadow-elevated p-6"
            >
              <h2 className="font-display text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {history.length > 0 ? (
                  history.slice(0, 5).map((item) => (
                    <Link to={`/explore?place=${item.id}`} key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.place_name} className="w-full h-full object-cover" />
                        ) : (
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.place_name}</p>
                        <p className="text-xs text-muted-foreground">Viewed {formatDistanceToNow(new Date(item.viewed_at), { addSuffix: true })}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent activity.</p>
                )}
              </div>
            </motion.div>

            {/* Saved Places */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-card rounded-xl shadow-elevated p-6"
            >
              <h2 className="font-display text-xl font-bold mb-4">Saved Places</h2>
              <div className="space-y-4">
                {bookmarks.length > 0 ? (
                  bookmarks.slice(0, 5).map((place) => (
                    <Link to={`/explore?place=${place.id}`} key={place.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors" >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {place.imageUrl ? (
                          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                        ) : (
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{place.name}</p>
                        <p className="text-xs text-muted-foreground">Bookmarked</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground">No saved places.</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
        <Footer />
      </div>
    </div>
  );
}
