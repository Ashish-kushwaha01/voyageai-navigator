import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  const [username, setUsername] = useState("Vivek Mishra");
  const [email, setEmail] = useState("vivekofficialonline@gmail.com");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { toast } = useToast();

  const handleUpdateUsername = () => {
    // In a real application, you would send this to your backend
    console.log("Updating username:", username);
    toast({
      title: "Username Updated",
      description: "Your username has been successfully updated.",
    });
  };

  const handleChangeEmail = () => {
    // In a real application, you would send this to your backend
    console.log("Changing email to:", newEmail);
    toast({
      title: "Email Change Initiated",
      description: "A confirmation link has been sent to your new email address.",
    });
    setNewEmail("");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }
    // In a real application, you would send this to your backend
    console.log("Changing password...");
    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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

            {/* Email Settings */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>Change your email address.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-email">Current Email</Label>
                    <Input id="current-email" type="email" value={email} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-email">New Email</Label>
                    <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  </div>
                  <Button onClick={handleChangeEmail} className="w-fit">Change Email</Button>
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
