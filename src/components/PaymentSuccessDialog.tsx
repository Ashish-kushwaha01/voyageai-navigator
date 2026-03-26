import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

interface PaymentSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
}

export function PaymentSuccessDialog({ isOpen, onClose, paymentId }: PaymentSuccessDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md p-6 bg-card rounded-lg shadow-lg text-center">
        <AlertDialogHeader className="flex flex-col items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <AlertDialogTitle className="text-2xl font-bold text-foreground">Thank you for your purchase!</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm mt-2">
            Your Pro plan is now active. 10 credits have been added to your account. You can use them right away from your dashboard.
            <br />
            <span className="text-xs">Payment ID: {paymentId}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-col space-y-2 sm:space-y-0 sm:space-x-0 mt-4">
          <Link to="/dashboard" className="w-full">
            <Button onClick={onClose} className="w-full bg-hero-gradient text-primary-foreground text-lg py-2 rounded-md hover:opacity-90 transition-opacity">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/explore" className="w-full mt-2">
            <Button onClick={onClose} variant="outline" className="w-full">
              Explore New Places
            </Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
