import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateCompanyProfile } from "@/hooks/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

export default function CompanySetup() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    whatsapp: "",
    additional_contact: "",
    address: ""
  });
  const createProfile = useCreateCompanyProfile();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProfile.mutate(formData, {
      onSuccess: () => {
        toast.success("Company profile created!");
        setLocation("/dashboard");
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.detail || "Failed to create profile");
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30 py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Set up your company profile</CardTitle>
          <CardDescription>
            Tell tourists about your travel company before you start adding programs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input 
                id="name" 
                required 
                value={formData.name} 
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">About the Company *</Label>
              <Textarea 
                id="description" 
                required 
                rows={4}
                value={formData.description} 
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
                placeholder="What makes your company unique?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input 
                  id="whatsapp" 
                  placeholder="e.g. +1234567890"
                  value={formData.whatsapp} 
                  onChange={e => setFormData(p => ({ ...p, whatsapp: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional_contact">Additional Contact (Website/Email)</Label>
                <Input 
                  id="additional_contact" 
                  value={formData.additional_contact} 
                  onChange={e => setFormData(p => ({ ...p, additional_contact: e.target.value }))} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address / Location</Label>
              <Input 
                id="address" 
                value={formData.address} 
                onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} 
              />
            </div>

            <Button type="submit" className="w-full" disabled={createProfile.isPending}>
              {createProfile.isPending ? "Saving..." : "Complete Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
