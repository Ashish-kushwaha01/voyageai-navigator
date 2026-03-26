import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRazorpayPayment } from "@/hooks/use-razorpay-payment";
import { useState } from "react"; // Import useState
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual explorers",
    features: [
      "Browse all destinations",
      "5 AI Guide queries/month",
      "Watch virtual tours",
      "Basic map view",
    ],
    cta: "Current Plan",
    highlight: false,
  },
  {
    name: "Premium",
    price: "$9",
    period: "/month",
    description: "For serious travelers and planners",
    features: [
      "Everything in Free",
      "Unlimited AI Guide queries",
      "Trip Planner with itineraries",
      "Priority recommendations",
      "Offline saved places",
      "Street View integration",
    ],
    cta: "Upgrade Now",
    highlight: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "Plan trips with friends and family",
    features: [
      "Everything in Premium",
      "Up to 5 members",
      "Shared itineraries",
      "Collaborative planning",
      "Travel group chat",
    ],
    cta: "Coming Soon",
    highlight: false,
  },
];

export default function PricingPage() {
  const { openPaymentGateway } = useRazorpayPayment();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; amount: number } | null>(null);

  const handleUpgradeClick = (planName: string, amount: number) => {
    setSelectedPlan({ name: planName, amount: amount });
    setIsAlertDialogOpen(true);
  };

  const confirmPayment = () => {
    if (selectedPlan) {
      openPaymentGateway({
        amount: selectedPlan.amount * 100, // Convert to paisa
        currency: "INR",
        name: `VoyageAI ${selectedPlan.name}`,
        description: `Upgrade to ${selectedPlan.name} Plan`,
        handler: (response: any) => {
          alert(`Payment successful! You are now a ${selectedPlan.name} user. Payment ID: ${response.razorpay_payment_id}`);
          // Here you would typically verify the payment on your server and update user's plan
        },
      });
    }
    setIsAlertDialogOpen(false);
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-28 pb-20 flex-1 overflow-y-auto">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" /> Simple Pricing
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold">
              Choose Your <span className="text-gradient">Journey</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Start for free, upgrade when you're ready for more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 md:p-8 flex flex-col ${
                  plan.highlight
                    ? "bg-hero-gradient text-primary-foreground shadow-glow ring-2 ring-primary/20 scale-[1.03]"
                    : "bg-card shadow-elevated"
                }`}
              >
                {plan.highlight && (
                  <div className="inline-flex items-center gap-1 bg-primary-foreground/20 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "opacity-80" : "text-muted-foreground"}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mt-2 ${plan.highlight ? "opacity-80" : "text-muted-foreground"}`}>{plan.description}</p>

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-primary-foreground" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className={`mt-8 w-full ${
                    plan.highlight
                      ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      : plan.cta === "Coming Soon"
                      ? "opacity-60 pointer-events-none"
                      : "bg-hero-gradient text-primary-foreground hover:opacity-90"
                  }`}
                  onClick={() => plan.cta === "Upgrade Now" && handleUpgradeClick(plan.name, parseFloat(plan.price.replace('$', '')))}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Upgrade</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to upgrade to the <strong>{selectedPlan?.name}</strong> plan for <strong>₹{selectedPlan?.amount}</strong>.
              Click "Pay Now" to proceed with the payment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPayment}>Pay Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
