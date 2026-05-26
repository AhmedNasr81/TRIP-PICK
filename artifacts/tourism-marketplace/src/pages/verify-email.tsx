import { useEffect, useState } from "react";
import { Link } from "wouter";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");

  useEffect(() => {
    const verify = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Token is missing.");
        return;
      }
      
      try {
        await api.get(`/api/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage("Your email has been successfully verified!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.detail || "Failed to verify email. The link may have expired.");
      }
    };
    
    verify();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            {status === "loading" && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
            {status === "success" && <CheckCircle2 className="h-10 w-10 text-green-500" />}
            {status === "error" && <XCircle className="h-10 w-10 text-destructive" />}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {status === "loading" && "Verifying Email"}
            {status === "success" && "Email Verified"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-base">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status !== "loading" && (
            <Link href="/login">
              <Button className="w-full">
                Continue to Login
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
