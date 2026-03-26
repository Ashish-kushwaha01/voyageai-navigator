import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUsPage() {
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
              <span className="text-gradient">Contact Us</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              We'd love to hear from you!
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert lg:prose-xl mx-auto"
          >
            <p>
              Whether you have a question about our features, pricing, need assistance, or just want to give feedback, our team is ready to help.
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-elevated">
                <Mail className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold text-lg">Email Us</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:support@voyageai.com" className="text-primary hover:underline">support@voyageai.com</a>
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-elevated">
                <Phone className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold text-lg">Call Us</h3>
                <p className="text-muted-foreground">
                  <a href="tel:+911234567890" className="text-primary hover:underline">+91 12345 67890</a>
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-elevated">
                <MapPin className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold text-lg">Visit Us</h3>
                <p className="text-muted-foreground">
                  VoyageAI Headquarters<br />
                  123 Travel Lane, Wanderlust City<br />
                  State, Country - 123456
                </p>
              </div>
            </div>

            <h2 className="mt-10">Send Us a Message</h2>
            <p>
              For general inquiries, please use the contact information above. For specific support requests, please visit our help center.
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}