import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiesPage() {
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
              <span className="text-gradient">Cookie Policy</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Understanding how we use cookies.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert lg:prose-xl mx-auto"
          >
            <h2>What are Cookies?</h2>
            <p>
              Cookies are small pieces of data stored on your device (computer or mobile device) when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the owners of the site.
            </p>

            <h2>How We Use Cookies</h2>
            <p>VoyageAI uses cookies for various purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> These cookies are strictly necessary for the basic functionality of our website, such as user authentication and session management.</li>
              <li><strong>Performance and Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the performance of our site.</li>
              <li><strong>Functionality Cookies:</strong> These cookies allow our website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features.</li>
              <li><strong>Advertising Cookies:</strong> These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaigns.</li>
            </ul>

            <h2>Your Choices Regarding Cookies</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting or amending your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
            </p>

            <h2>More Information</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at [Your Email Address].
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}