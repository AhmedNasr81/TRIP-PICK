import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useMyCompany, useUpdateMyCompany, useUploadMyCompanyImage, 
  usePrograms, useCreateProgram, useUpdateProgram, useDeleteProgram,
  useCountries
} from "@/hooks/api-hooks";
import { getImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Edit, Trash2, Plus, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: company, isLoading: isLoadingCompany, error: companyError } = useMyCompany();
  const updateCompany = useUpdateMyCompany();
  const uploadImage = useUploadMyCompanyImage();
  const createProgram = useCreateProgram();
  const deleteProgram = useDeleteProgram();
  const { data: countries } = useCountries();

  // Redirect if no profile exists
  useEffect(() => {
    if (companyError && (companyError as any).response?.status === 404) {
      setLocation("/company-setup");
    }
  }, [companyError, setLocation]);

  const { data: programs, isLoading: isLoadingPrograms } = usePrograms(
    company ? { company_id: company.id } : undefined
  );

  // Form states
  const [profileData, setProfileData] = useState({
    name: "", description: "", whatsapp: "", additional_contact: "", address: ""
  });
  
  const [programData, setProgramData] = useState({
    country_id: "", name: "", description: "", duration: "", start_at: "", price: ""
  });
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);

  useEffect(() => {
    if (company) {
      setProfileData({
        name: company.name,
        description: company.description,
        whatsapp: company.whatsapp,
        additional_contact: company.additional_contact,
        address: company.address
      });
    }
  }, [company]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany.mutate(profileData, {
      onSuccess: () => toast.success("Company profile updated")
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Uploading logo...");
    uploadImage.mutate(file, {
      onSuccess: () => toast.success("Logo updated", { id: toastId }),
      onError: () => toast.error("Upload failed", { id: toastId })
    });
  };

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault();
    createProgram.mutate({
      ...programData,
      country_id: parseInt(programData.country_id),
      duration: parseInt(programData.duration),
      price: parseInt(programData.price)
    }, {
      onSuccess: () => {
        toast.success("Program created successfully");
        setIsProgramModalOpen(false);
        setProgramData({ country_id: "", name: "", description: "", duration: "", start_at: "", price: "" });
      }
    });
  };

  const handleDeleteProgram = (id: number) => {
    if (confirm("Are you sure you want to delete this program?")) {
      deleteProgram.mutate(id, {
        onSuccess: () => toast.success("Program deleted")
      });
    }
  };

  if (isLoadingCompany) return <div className="p-8"><Skeleton className="h-[600px]" /></div>;
  if (!company) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
          <AvatarImage src={getImageUrl(company.image) || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary">
            <Building2 />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{company.name} Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your company profile and tours.</p>
        </div>
      </div>

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="mb-8 bg-muted/50 p-1 w-full max-w-md grid grid-cols-2">
          <TabsTrigger value="programs">My Programs</TabsTrigger>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-6">
          <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
            <h2 className="text-xl font-bold">Programs & Tours</h2>
            <Dialog open={isProgramModalOpen} onOpenChange={setIsProgramModalOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="w-4 h-4 mr-2" /> Add Program</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Program</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateProgram} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Program Name</Label>
                    <Input required value={programData.name} onChange={e => setProgramData(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Destination Country</Label>
                      <Select value={programData.country_id} onValueChange={val => setProgramData(p => ({ ...p, country_id: val }))}>
                        <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>
                          {countries?.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price (USD)</Label>
                      <Input type="number" required value={programData.price} onChange={e => setProgramData(p => ({ ...p, price: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (Days)</Label>
                      <Input type="number" required value={programData.duration} onChange={e => setProgramData(p => ({ ...p, duration: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date (Optional)</Label>
                      <Input type="date" value={programData.start_at} onChange={e => setProgramData(p => ({ ...p, start_at: e.target.value }))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea rows={4} required value={programData.description} onChange={e => setProgramData(p => ({ ...p, description: e.target.value }))} />
                  </div>
                  <Button type="submit" className="w-full" disabled={createProgram.isPending}>Create Program</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Program</th>
                    <th className="px-6 py-4 font-medium">Destination</th>
                    <th className="px-6 py-4 font-medium">Price/Duration</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-t">
                  {isLoadingPrograms ? (
                    <tr><td colSpan={5} className="p-8 text-center">Loading...</td></tr>
                  ) : programs?.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No programs found. Click Add Program to create one.</td></tr>
                  ) : programs?.map(p => (
                    <tr key={p.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4">{p.country_name}</td>
                      <td className="px-6 py-4">${p.price} / {p.duration} days</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setLocation(`/programs/${p.id}`)}>
                            View
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteProgram(p.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-8 flex flex-col sm:flex-row items-center gap-6 pb-8 border-b">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                    <AvatarImage src={getImageUrl(company.image) || undefined} />
                    <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                      <Building2 className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="text-white w-8 h-8" />
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Company Logo</h3>
                  <p className="text-sm text-muted-foreground mb-3">Upload a square image for best results.</p>
                  <Button variant="outline" size="sm" className="relative">
                    <Camera className="w-4 h-4 mr-2" /> Upload Image
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input required value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>About Company</Label>
                  <Textarea rows={5} required value={profileData.description} onChange={e => setProfileData(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input value={profileData.whatsapp} onChange={e => setProfileData(p => ({ ...p, whatsapp: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website / Additional Contact</Label>
                    <Input value={profileData.additional_contact} onChange={e => setProfileData(p => ({ ...p, additional_contact: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={profileData.address} onChange={e => setProfileData(p => ({ ...p, address: e.target.value }))} />
                </div>
                <Button type="submit" disabled={updateCompany.isPending}>
                  {updateCompany.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
