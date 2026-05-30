import { useState } from "react";
import { useProgram, useToggleFavorite } from "@/hooks/api-hooks";
import { useParams, Link } from "wouter";
import { getImageUrl } from "@/lib/api";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, Heart, Share2, Building2, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgramDetail() {
  const { id } = useParams();
  const { data: program, isLoading } = useProgram(id || "");
  const toggleFavorite = useToggleFavorite();
  const { user } = useAuth();

  // Local optimistic state for instant UI feedback
  const [localFavorited, setLocalFavorited] = useState<boolean | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-[500px] rounded-2xl mb-8" />
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return <div className="container mx-auto py-20 text-center font-bold text-2xl">Program not found</div>;
  }

  const isFavorited = localFavorited !== null ? localFavorited : (program.is_favorited ?? false);

  const handleFavorite = () => {
    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }
    if (toggleFavorite.isPending) return;
    const next = !isFavorited;
    setLocalFavorited(next);
    toggleFavorite.mutate(
      { id: program.id, isFavorited: isFavorited },
      {
        onError: () => setLocalFavorited(null),
        onSuccess: () => setLocalFavorited(null),
      }
    );
  };

  const heroImage = getImageUrl(program.main_image) || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80";

  return (
    <div className="bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] max-h-[700px] w-full bg-muted">
        <img 
          src={heroImage} 
          alt={program.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-4 pb-10 pt-20">
            <div className="max-w-4xl flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {program.country_name}
                  </span>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <StarRating rating={program.avg_rating || 0} size={16} className="text-yellow-400" />
                    <span className="text-sm font-medium">{program.avg_rating ? program.avg_rating.toFixed(1) : "New"}</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight text-white drop-shadow-md">
                  {program.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
                  <Link href={`/companies/${program.company_id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Building2 size={18} />
                    <span>{program.company_name}</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{program.duration} Days</span>
                  </div>
                  {program.start_at && (
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>{format(new Date(program.start_at), "MMMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleFavorite}
                  disabled={toggleFavorite.isPending}
                  whileTap={{ scale: 0.82 }}
                  whileHover={{ scale: 1.1 }}
                  className={`rounded-full h-12 w-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${isFavorited ? "text-red-400" : ""}`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isFavorited ? "filled" : "empty"}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Heart className={isFavorited ? "fill-current" : ""} size={20} />
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
                <Button size="icon" variant="outline" className="rounded-full h-12 w-12 bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20 text-white">
                  <Share2 />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold mb-6">About this adventure</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                {program.description}
              </div>
            </section>

            {program.images && program.images.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {program.images.map((img) => (
                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-muted">
                      <img 
                        src={getImageUrl(img.image) || ""} 
                        alt="Gallery image" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border shadow-lg rounded-2xl p-8">
                <div className="mb-6 pb-6 border-b">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold block mb-2">Price</span>
                  <div className="text-4xl font-bold text-foreground">
                    ${program.price.toLocaleString()}
                  </div>
                </div>
                
                {program.company_whatsapp && (
                  <a
                    href={`https://wa.me/${program.company_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in booking: ${program.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mb-4"
                  >
                    <Button className="w-full h-14 text-lg rounded-xl bg-green-500 hover:bg-green-600 text-white gap-2" size="lg">
                      <MessageCircle size={22} />
                      Book via WhatsApp
                    </Button>
                  </a>
                )}
                
                <p className="text-center text-sm text-muted-foreground">
                  You won't be charged yet
                </p>
              </div>

              <div className="bg-card border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Hosted by</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Building2 />
                  </div>
                  <div>
                    <div className="font-bold">{program.company_name}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <StarRating rating={program.avg_rating || 0} size={12} />
                      <span>{program.avg_rating ? program.avg_rating.toFixed(1) : "New"}</span>
                    </div>
                  </div>
                </div>
                <Link href={`/companies/${program.company_id}`}>
                  <Button variant="outline" className="w-full">View Company Profile</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
