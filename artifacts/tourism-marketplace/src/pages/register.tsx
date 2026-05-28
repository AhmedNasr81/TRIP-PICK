import { useState } from "react";
import { Link } from "wouter";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "tourist"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRoleChange = (val: string) => {
    setFormData(prev => ({ ...prev, role: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/api/auth/register", formData);
      setRegistered(true);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30 py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Check Your Email</h2>
            <p className="text-muted-foreground">
              We sent a verification link to <span className="font-medium text-foreground">{formData.email}</span>. Click the link in the email to activate your account.
            </p>
            <p className="text-sm text-muted-foreground">Didn't receive it? Check your spam folder.</p>
            <Link href="/login">
              <Button className="mt-2 w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>Join WanderLust to discover amazing tours or host your own.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" required value={formData.first_name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" required value={formData.last_name} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">I want to...</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourist">Book tours (Tourist)</SelectItem>
                  <SelectItem value="company">Host tours (Travel Company)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">Log in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
