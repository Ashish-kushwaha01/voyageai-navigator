import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, User, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRazorpayPayment } from "@/hooks/use-razorpay-payment";
import { PaymentSuccessDialog } from "@/components/PaymentSuccessDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { openPaymentGateway } = useRazorpayPayment();
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isPaymentSuccessDialogOpen, setIsPaymentSuccessDialogOpen] = useState(false);
  const [paymentId, setPaymentId] = useState("");

  const handlePremiumClick = () => {
    setIsAlertDialogOpen(true);
  };

  const confirmPayment = () => {
    openPaymentGateway({
      amount: 50000, // Amount in paisa (e.g., 50000 paisa = 500 INR)
      currency: "INR",
      name: "VoyageAI Premium",
      description: "Unlock premium features for VoyageAI",
      handler: (response: { razorpay_payment_id: string }) => {
        setPaymentId(response.razorpay_payment_id);
        setIsPaymentSuccessDialogOpen(true);
      },
      prefill: {
        name: "VoyageAI User",
        email: "user@example.com",
        contact: "9999999999",
      },
    });
    setIsAlertDialogOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-hero-gradient flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Voyage<span className="text-gradient">AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4" /> Sign In
            </Button>
          </Link>
          <Button size="sm" className="bg-hero-gradient text-primary-foreground gap-2 hover:opacity-90" onClick={handlePremiumClick}>
              <Sparkles className="w-4 h-4" /> Get Premium
            </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium ${
                    location.pathname === link.to
                      ? "text-primary bg-accent"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-border my-2" />
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="w-4 h-4" /> Sign In
                </Button>
              </Link>
              <Button className="w-full bg-hero-gradient text-primary-foreground gap-2" onClick={() => { setOpen(false); handlePremiumClick(); }}>
                  <Sparkles className="w-4 h-4" /> Get Premium
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </nav>
  );
}
