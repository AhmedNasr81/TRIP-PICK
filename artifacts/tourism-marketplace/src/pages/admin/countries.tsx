import { useState } from "react";
import { useCountries, useCreateCountry, useUploadCountryImage } from "@/hooks/api-hooks";
import { getImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Plus, Camera } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCountries() {
  const { data: countries, isLoading } = useCountries();
  const createCountry = useCreateCountry();
  const uploadImage = useUploadCountryImage(0); // We'll pass ID directly when calling mutate
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCountryName, setNewCountryName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    createCountry.mutate({ name: newCountryName }, {
      onSuccess: (country) => {
        if (selectedFile) {
          uploadImage.mutate(selectedFile, {
            onSuccess: () => {
              toast.success("Country and image created!");
              resetForm();
            }
          });
        } else {
          toast.success("Country created!");
          resetForm();
        }
      }
    });
  };

  const resetForm = () => {
    setNewCountryName("");
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const handleImageChange = (countryId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Uploading image...");
    
    // Create a new instance of the hook's mutation just for this upload
    const formData = new FormData();
    formData.append("photo", file);
    
    import("@/lib/api").then(({ api }) => {
      api.post(`/api/admin/countries/${countryId}/image`, formData)
        .then(() => {
          toast.success("Image updated", { id: toastId });
          // Ideally invalidate queries here, but a page reload is okay for admin image update fallback
          window.location.reload();
        })
        .catch(() => toast.error("Upload failed", { id: toastId }));
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Countries</h1>
          <p className="text-muted-foreground">Add and manage destination countries.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Country</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Destination</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Country Name</Label>
                <Input required value={newCountryName} onChange={e => setNewCountryName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <Input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
              </div>
              <Button type="submit" className="w-full" disabled={createCountry.isPending || uploadImage.isPending}>
                Create Destination
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
        ) : countries?.map(country => (
          <Card key={country.id} className="overflow-hidden group">
            <div className="h-32 w-full relative bg-muted">
              <img 
                src={getImageUrl(country.image) || `https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80&${country.id}`} 
                alt={country.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" size="sm" className="relative">
                  <Camera className="w-4 h-4 mr-2" /> Change Image
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleImageChange(country.id, e)} />
                </Button>
              </div>
            </div>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> {country.name}
              </div>
              <div className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {country.program_count} tours
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
