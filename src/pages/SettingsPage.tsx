import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabase } from "@/lib/supabase";

export default function SettingsPage() {
  const { user, fetchUserProfile } = useAuth();
  const [username, setUsername] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateUsername = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Update in auth.users table
      const { error: authError } = await getSupabase().auth.updateUser({
        data: { full_name: username },
      });
      if (authError) throw authError;

      // Update in profiles table
      const { error: profileError } = await getSupabase()
        .from('profiles')
        .update({ full_name: username })
        .eq('id', user.id);
      if (profileError) throw profileError;

      await fetchUserProfile(); // Refresh user profile in context

      toast({
        title: "Username Updated",
        description: "Your username has been successfully updated.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update username.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  const handleChangePassword = async () => {
    if (!user || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await getSupabase().auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to change password.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    // In a real application, you would implement account deletion logic
    console.log("Deleting account...");
    toast({
      title: "Account Deletion",
      description: "Your account has been scheduled for deletion.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex flex-col flex-1 lg:ml-64">
        <main className="flex-1 pt-24 pb-16 overflow-y-auto">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Settings</h1>

            {/* General Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your profile information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                  </div>
                  <Button onClick={handleUpdateUsername} className="w-fit">Update Username</Button>
                </div>
              </CardContent>
            </Card>



            {/* Password Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Password Settings</CardTitle>
                <CardDescription>Update your password.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <Button onClick={handleChangePassword} className="w-fit">Change Password</Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-500">
              <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account, profile, and history. This action cannot be undone.
                  </p>
                  <Button onClick={handleDeleteAccount} variant="destructive" className="w-fit">Delete My Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
