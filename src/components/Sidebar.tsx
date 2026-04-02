import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, LayoutDashboard, History, BookmarkPlus, Settings, LogOut, Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Globe,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Bookmarks",
    href: "/bookmarks",
    icon: BookmarkPlus,
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully!");
      navigate("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setIsLogoutDialogOpen(false);
    }
  };

  const sidebarContent = (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-y-0 left-0 z-40 w-64 flex-col border-r bg-sidebar p-4 flex"
    >
      <div className="flex items-center justify-center h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-hero-gradient flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Voyage<span className="text-gradient">AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 py-4">
        {sidebarNavItems.map((item) => (
          <Link key={item.href} to={item.href} onClick={onClose}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                location.pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/20"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-sidebar-border">
        {/* User Plan */}
        <div className="mb-4 p-3 bg-sidebar-accent/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">
                {user?.user_metadata?.plan_type === "paid" ? "Pro Plan" : "Free Plan"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.user_metadata?.credits ?? 0} credits left
              </p>
            </div>
          </div>
          {user?.user_metadata?.plan_type !== "paid" && (
            <Link to="/pricing" onClick={onClose}>
              <Button size="sm" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90">
                Upgrade to Pro
              </Button>
            </Link>
          )}
        </div>

        {/* User Info */}
        {user && (
          <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-sidebar-accent/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {user.user_metadata?.full_name ? user.user_metadata.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">{user.user_metadata?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">{user.email}</p>
                </div>
              </div>
              <AlertDialogTrigger asChild>
                <LogOut className="w-6 h-6 text-muted-foreground" />
              </AlertDialogTrigger>
            </div>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be redirected to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
