import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe, MapPin, Sparkles, ArrowRight, Play, Compass, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import type { Place } from "@/lib/webhooks";

const trendingPlaces: Place[] = [
  { id: "1", name: "Santorini", country: "Greece", description: "Iconic white-washed buildings overlooking the Aegean Sea", imageUrl: "", videoId: "", rating: 4.9, category: "Beach" },
  { id: "2", name: "Kyoto", country: "Japan", description: "Ancient temples surrounded by serene bamboo forests", imageUrl: "", videoId: "", rating: 4.8, category: "Culture" },
  { id: "3", name: "Machu Picchu", country: "Peru", description: "Mystical Incan citadel high in the Andes mountains", imageUrl: "", videoId: "", rating: 4.9, category: "Adventure" },
];

const features = [
  { icon: Play, title: "Virtual Tours", desc: "Explore places through immersive videos and street views" },
  { icon: Sparkles, title: "AI Travel Guide", desc: "Get instant AI-powered insights about any destination" },
  { icon: Compass, title: "Smart Picks", desc: "Personalized recommendations based on your preferences" },
  { icon: Map, title: "Trip Planner", desc: "Plan multi-day itineraries with our premium tools" },
];

const stats = [
  { value: "10K+", label: "Destinations" },
  { value: "500K+", label: "Virtual Tours" },
  { value: "50K+", label: "Travelers" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden overflow-y-auto">
        <div className="absolute inset-0 bg-hero-gradient opacity-[0.04]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-ocean/10 rounded-full blur-3xl animate-pulse-glow" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> AI-Powered Travel Discovery
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Explore the World
              <br />
              <span className="text-gradient">Without Limits</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Discover breathtaking destinations through virtual tours, AI-guided insights,
              and smart trip planning — all from your browser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link to="/explore">
                <Button size="lg" className="bg-hero-gradient text-primary-foreground gap-2 px-8 hover:opacity-90 text-base">
                  <Globe className="w-5 h-5" /> Start Exploring <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="gap-2 px-8 text-base">
                  View Plans
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-12 md:gap-20 mt-16"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-gradient">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Travel Smarter with <span className="text-gradient">AI</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Everything you need to discover, plan, and experience destinations worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-elevated hover:shadow-glow transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Trending Destinations</h2>
              <p className="mt-2 text-muted-foreground">The most popular places this month</p>
            </div>
            <Link to="/explore" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPlaces.map((place, i) => (
              <PlaceCard key={place.id} place={place} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-hero-gradient p-10 md:p-16 text-center text-primary-foreground">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to Explore?</h2>
            <p className="mt-3 opacity-90 max-w-md mx-auto">
              Join thousands of virtual travelers and unlock AI-powered trip planning.
            </p>
            <Link to="/explore">
              <Button size="lg" variant="secondary" className="mt-8 gap-2 text-base">
                <MapPin className="w-5 h-5" /> Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
