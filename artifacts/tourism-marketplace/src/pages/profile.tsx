import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import api, { getImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import { User, Lock, Mail, Camera } from "lucide-react";

export default function Profile() {
  const { user, refetchUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || ""
  });
  const [passData, setPassData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  if (!user) return null;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.put("/api/auth/me", profileData);
      await refetchUser();
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new_password !== passData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    setIsUpdatingPass(true);
    try {
      await api.put("/api/auth/me/password", {
        current_password: passData.current_password,
        new_password: passData.new_password
      });
      toast.success("Password updated successfully");
      setPassData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update password");
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("photo", file);
    
    const loadingToast = toast.loading("Uploading image...");
    try {
      await api.post("/api/auth/me/image", formData);
      await refetchUser();
      toast.success("Profile image updated", { id: loadingToast });
    } catch (error) {
      toast.error("Failed to upload image", { id: loadingToast });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer mb-4">
                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                  <AvatarImage src={getImageUrl(user.profile_image) || undefined} />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-8 h-8" />
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <h3 className="font-bold text-xl">{user.first_name} {user.last_name}</h3>
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                <User className="w-3 h-3" />
                <span className="capitalize">{user.role}</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input 
                      id="first_name" 
                      value={profileData.first_name}
                      onChange={e => setProfileData(p => ({ ...p, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input 
                      id="last_name" 
                      value={profileData.last_name}
                      onChange={e => setProfileData(p => ({ ...p, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" value={user.email} disabled className="pl-9 bg-muted/50" />
                  </div>
                  <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                </div>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" /> Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input 
                    id="current_password" 
                    type="password"
                    value={passData.current_password}
                    onChange={e => setPassData(p => ({ ...p, current_password: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password</Label>
                    <Input 
                      id="new_password" 
                      type="password"
                      value={passData.new_password}
                      onChange={e => setPassData(p => ({ ...p, new_password: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input 
                      id="confirm_password" 
                      type="password"
                      value={passData.confirm_password}
                      onChange={e => setPassData(p => ({ ...p, confirm_password: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="secondary" disabled={isUpdatingPass}>
                  {isUpdatingPass ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
