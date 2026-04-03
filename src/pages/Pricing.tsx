import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRazorpayPayment } from "@/hooks/use-razorpay-payment";
import { PaymentSuccessDialog } from "@/components/PaymentSuccessDialog";
import { useState } from "react"; // Import useState
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "sonner"; // Import toast
import { LoginRequiredDialog } from "@/components/LoginRequiredDialog"; // Import LoginRequiredDialog
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
      price: "₹0",
      amount: 0,
      period: "forever",
      description: "Perfect for casual explorers",
      features: [
        "Browse all destinations",
        "5 AI Guide queries/month",
        "Watch virtual tours",
        "Basic map view",
      ],
      buttonText: "Current Plan",
      buttonVariant: "default",
    },
    {
      name: "Premium",
      price: "₹499",
      amount: 49900,
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
      buttonText: "Upgrade Now",
      buttonVariant: "premium",
    },
    {
      name: "Team",
      price: "₹999",
      amount: 99900,
      period: "/month",
      description: "Plan trips with friends and family",
      features: [
        "Everything in Premium",
        "Up to 5 members",
        "Shared itineraries",
        "Collaborative planning",
        "Travel group chat",
      ],
      buttonText: "Coming Soon",
      buttonVariant: "default",
      disabled: true,
    },
  ];

export default function PricingPage() {
  const { openPaymentGateway } = useRazorpayPayment();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isPaymentSuccessDialogOpen, setIsPaymentSuccessDialogOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; amount: number } | null>(null);
  const [isLoginRequiredDialogOpen, setIsLoginRequiredDialogOpen] = useState(false); // New state for login dialog

  const { user } = useAuth(); // Use the useAuth hook
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleUpgradeClick = (planName: string, amount: number) => {
    if (!user) {
      // If user is not logged in, open the LoginRequiredDialog
      setIsLoginRequiredDialogOpen(true);
      return;
    }
    setSelectedPlan({ name: planName, amount: amount });
    setIsAlertDialogOpen(true);
  };

  const confirmPayment = () => {
    if (selectedPlan) {
      openPaymentGateway({
        amount: selectedPlan.amount, // Amount is already in Paise
        currency: "INR",
        name: `VoyageAI ${selectedPlan.name}`,
        description: `Upgrade to ${selectedPlan.name} Plan`,
        handler: (response: { razorpay_payment_id: string }) => {
          setPaymentId(response.razorpay_payment_id);
          setIsPaymentSuccessDialogOpen(true);
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
                  plan.buttonVariant === "premium"
                    ? "bg-hero-gradient text-primary-foreground shadow-glow ring-2 ring-primary/20 scale-[1.03]"
                    : "bg-card shadow-elevated"
                }`}
              >
                {plan.buttonVariant === "premium" && (
                  <div className="inline-flex items-center gap-1 bg-primary-foreground/20 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.buttonVariant === "premium" ? "opacity-80" : "text-muted-foreground"}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mt-2 ${plan.buttonVariant === "premium" ? "opacity-80" : "text-muted-foreground"}`}>{plan.description}</p>

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.buttonVariant === "premium" ? "text-primary-foreground" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className={(() => {
                    const userPlanType = user?.user_metadata?.plan_type;
                    let classes = `mt-8 w-full `;
                    let currentButtonDisabled = plan.disabled;

                    if (plan.name === "Free") {
                      if (userPlanType === "free") {
                        currentButtonDisabled = true;
                        classes += "bg-hero-gradient text-primary-foreground opacity-80 cursor-default";
                      } else if (userPlanType === "paid") {
                        currentButtonDisabled = true;
                        classes += "bg-hero-gradient text-primary-foreground opacity-60 pointer-events-none";
                      } else { // Not logged in
                        currentButtonDisabled = true;
                        classes += "bg-hero-gradient text-primary-foreground opacity-80 cursor-default";
                      }
                    } else if (plan.name === "Premium") {
                      if (userPlanType === "free") {
                        currentButtonDisabled = false;
                        classes += "bg-primary-foreground text-primary hover:bg-primary-foreground/90";
                      } else if (userPlanType === "paid") {
                        currentButtonDisabled = true;
                        classes += "bg-primary-foreground text-primary opacity-80 cursor-default";
                      } else { // Not logged in
                        currentButtonDisabled = false;
                        classes += "bg-primary-foreground text-primary hover:bg-primary-foreground/90";
                      }
                    } else if (plan.name === "Team") {
                      currentButtonDisabled = true;
                      classes += "opacity-60 pointer-events-none bg-hero-gradient text-primary-foreground";
                    }
                    return classes;
                  })()}
                  onClick={() => {
                    handleUpgradeClick(plan.name, plan.amount);
                  }}
                  disabled={(() => {
                    const userPlanType = user?.user_metadata?.plan_type;
                    let currentButtonDisabled = plan.disabled;

                    if (plan.name === "Free") {
                      if (userPlanType === "free") {
                        currentButtonDisabled = true;
                      } else if (userPlanType === "paid") {
                        currentButtonDisabled = true;
                      } else { // Not logged in
                        currentButtonDisabled = true;
                      }
                    } else if (plan.name === "Premium") {
                      if (userPlanType === "free") {
                        currentButtonDisabled = false;
                      } else if (userPlanType === "paid") {
                        currentButtonDisabled = true;
                      } else { // Not logged in
                        currentButtonDisabled = false;
                      }
                    } else if (plan.name === "Team") {
                      currentButtonDisabled = true;
                    }
                    return currentButtonDisabled;
                  })()}
                >
                  {(() => {
                    const userPlanType = user?.user_metadata?.plan_type;
                    let buttonText = plan.buttonText;

                    if (plan.name === "Free") {
                      if (userPlanType === "free") {
                        buttonText = "Current Plan";
                      } else if (userPlanType === "paid") {
                        buttonText = "Free Plan";
                      } else { // Not logged in
                        buttonText = "Current Plan";
                      }
                    } else if (plan.name === "Premium") {
                      if (userPlanType === "free") {
                        buttonText = "Upgrade Now";
                      } else if (userPlanType === "paid") {
                        buttonText = "Current Plan";
                      } else { // Not logged in
                        buttonText = "Upgrade Now";
                      }
                    } else if (plan.name === "Team") {
                      buttonText = "Coming Soon";
                    }
                    return buttonText;
                  })()}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent className="max-w-md p-6 bg-card rounded-lg shadow-lg">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <Sparkles className="w-10 h-10 text-primary mb-3" />
            <AlertDialogTitle className="text-2xl font-bold text-foreground">Upgrade to Pro</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm mt-2">
              Unlock the full potential of VoyageAI with Pro features. ₹499/month - 10 AI credits for 1 month.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 my-4 text-sm text-foreground max-h-60 overflow-y-auto pr-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> 10 AI credits for 1 month
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Advanced AI Guide features
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Unlimited trip planning & itineraries
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Priority support
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Exclusive destination insights
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Offline access to saved places
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Ad-free experience
            </div>
          </div>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-col sm:space-x-0 sm:space-y-2 mt-4">
            <AlertDialogAction onClick={confirmPayment} className="w-full bg-hero-gradient text-primary-foreground text-lg py-2 rounded-md hover:opacity-90 transition-opacity">
              Start Pro Trial — ₹499
            </AlertDialogAction>
            <AlertDialogCancel className="w-full mt-2">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentSuccessDialog
        isOpen={isPaymentSuccessDialogOpen}
        onClose={() => setIsPaymentSuccessDialogOpen(false)}
        paymentId={paymentId}
      />

      <Footer />

      <LoginRequiredDialog
        isOpen={isLoginRequiredDialogOpen}
        onClose={() => setIsLoginRequiredDialogOpen(false)}
      />
    </div>
  );
}
