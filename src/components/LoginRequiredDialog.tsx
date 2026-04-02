import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
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
import { Button } from "@/components/ui/button";

interface LoginRequiredDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginRequiredDialog({ isOpen, onClose }: LoginRequiredDialogProps) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate("/login");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md p-6 bg-card rounded-lg shadow-lg">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <User className="w-10 h-10 text-primary mb-3" />
          <AlertDialogTitle className="text-2xl font-bold text-foreground">Login Required</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm mt-2">
            You need to be logged in to access premium features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-col sm:space-x-0 sm:space-y-2 mt-4">
          <AlertDialogAction onClick={handleLoginClick} className="w-full bg-hero-gradient text-primary-foreground text-lg py-2 rounded-md hover:opacity-90 transition-opacity">
            Login Now
          </AlertDialogAction>
          <AlertDialogCancel onClick={onClose} className="w-full mt-2">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
