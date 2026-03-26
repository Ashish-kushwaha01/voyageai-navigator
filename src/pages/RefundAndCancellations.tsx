import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundAndCancellationsPage() {
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
              <span className="text-gradient">Refund and Cancellations</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Our policy regarding refunds and cancellations.
            </p>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert lg:prose-xl mx-auto"
          >
            <h2>Refund Policy</h2>
            <p>
              At VoyageAI, we strive to provide the best possible service. If you are not satisfied with your premium subscription, you may be eligible for a refund under the following conditions:
            </p>
            <ul>
              <li>Refund requests must be made within 7 days of the initial subscription purchase.</li>
              <li>Refunds will only be issued for the first-time purchase of a premium subscription. Subsequent renewals are not eligible for refunds.</li>
              <li>To request a refund, please contact our support team at [Your Support Email] with your purchase details and reason for cancellation.</li>
              <li>Refunds will be processed within 5-7 business days to the original payment method.</li>
            </ul>

            <h2>Cancellation Policy</h2>
            <p>
              You can cancel your VoyageAI premium subscription at any time.
            </p>
            <ul>
              <li>To cancel your subscription, please log in to your account and navigate to the "Subscription" or "Billing" section.</li>
              <li>Cancellations will take effect at the end of your current billing cycle. You will continue to have access to premium features until then.</li>
              <li>No pro-rata refunds will be issued for partial months or unused portions of a subscription period after the initial 7-day refund window.</li>
            </ul>

            <h2>Exceptions</h2>
            <p>
              Please note that certain circumstances may not qualify for a refund or cancellation, including but not limited to:
            </p>
            <ul>
              <li>Violation of our Terms and Conditions.</li>
              <li>Accounts that have been suspended or terminated due to fraudulent activity.</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about our Refund and Cancellation Policy, please contact us at [Your Support Email] or [Your Phone Number].
            </p>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}