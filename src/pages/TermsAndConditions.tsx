import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditionsPage() {
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
              <span className="text-gradient">Terms and Conditions</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Please read our terms carefully.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert lg:prose-xl mx-auto"
          >
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the VoyageAI website and services, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must not use our services.
            </p>

            <h2>2. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
            </p>

            <h2>3. Use of Service</h2>
            <p>
              VoyageAI provides AI-powered travel planning and discovery tools. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the service.
            </p>

            <h2>4. User Accounts</h2>
            <p>
              To access certain features of the service, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
            </p>

            <h2>5. Intellectual Property</h2>
            <p>
              All content, trademarks, services marks, trade names, logos, and icons are proprietary to VoyageAI. Nothing contained on the website should be construed as granting any license or right to use any trademark displayed on this website without the written permission of VoyageAI.
            </p>

            <h2>6. Disclaimers</h2>
            <p>
              The service is provided on an "AS IS" and "AS AVAILABLE" basis. VoyageAI makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              VoyageAI will not be liable for any damages of any kind arising from the use of this service, including, but not limited to direct, indirect, incidental, punitive, and consequential damages.
            </p>

            <h2>8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
            </p>

            <h2>9. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at [Your Email Address].
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}