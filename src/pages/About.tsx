import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-28 pb-20 flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold">
              About <span className="text-gradient">VoyageAI</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Your ultimate AI-powered travel companion.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert lg:prose-xl mx-auto"
          >
            <h2>Our Mission</h2>
            <p>
              At VoyageAI, we believe that travel should be an enriching and seamless experience. Our mission is to empower explorers like you with intelligent tools and personalized insights, making every journey unforgettable. We leverage cutting-edge AI to transform how you discover, plan, and enjoy your adventures.
            </p>

            <h2>What We Offer</h2>
            <ul>
              <li><strong>AI-Powered Destination Discovery:</strong> Uncover hidden gems and popular spots tailored to your interests.</li>
              <li><strong>Personalized Travel Guides:</strong> Get instant, AI-generated guides with highlights, best times to visit, and more.</li>
              <li><strong>Seamless Planning:</strong> Organize your trips with ease, from booking to itinerary management.</li>
              <li><strong>Rich Media Experience:</strong> Explore destinations through captivating images and engaging video tours.</li>
            </ul>

            <h2>Our Story</h2>
            <p>
              VoyageAI was founded by a team of passionate travelers and AI enthusiasts who saw an opportunity to revolutionize the travel industry. Frustrated with generic travel advice and fragmented planning tools, we set out to create a platform that truly understands and caters to individual travel desires. From a small idea, VoyageAI has grown into a comprehensive solution, continuously evolving with feedback from our vibrant community.
            </p>

            <h2>Join Our Journey</h2>
            <p>
              We're constantly innovating and expanding our features to bring you the best travel experience possible. Join the VoyageAI community today and embark on your next great adventure with confidence and excitement!
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}