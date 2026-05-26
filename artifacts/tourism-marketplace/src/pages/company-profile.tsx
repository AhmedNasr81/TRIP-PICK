import { useCompany, useReviews, useMyReviewId, useCreateReview, useDeleteReview } from "@/hooks/api-hooks";
import { useParams, Link } from "wouter";
import { getImageUrl } from "@/lib/api";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Globe, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function CompanyProfile() {
  const { id } = useParams();
  const { data: company, isLoading } = useCompany(id || "");
  const { data: reviews, isLoading: isLoadingReviews } = useReviews(id || "");
  const { data: myReviewIdData } = useMyReviewId(id || "");
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();
  const { user } = useAuth();
  
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-64 rounded-2xl mb-8" />
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full mb-8" />
      </div>
    );
  }

  if (!company) {
    return <div className="container mx-auto py-20 text-center font-bold text-2xl">Company not found</div>;
  }

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) return;
    createReview.mutate({ company_id: company.id, rate: rating, comment: reviewText }, {
      onSuccess: () => {
        toast.success("Review submitted!");
        setReviewText("");
        setRating(5);
      }
    });
  };

  const handleDeleteReview = (reviewId: number) => {
    if (confirm("Are you sure you want to delete your review?")) {
      deleteReview.mutate({ reviewId, companyId: company.id });
    }
  };

  const bannerImage = getImageUrl(company.image) || "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80";

  return (
    <div className="bg-background pb-20">
      <div className="h-64 md:h-80 w-full relative">
        <img src={bannerImage} alt={company.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-xl border mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl border-4 border-background overflow-hidden bg-muted -mt-20 md:-mt-24 shadow-lg">
              <img 
                src={getImageUrl(company.image) || `https://ui-avatars.com/api/?name=${company.name}&size=200`} 
                alt={company.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <StarRating rating={company.avg_rating || 0} size={16} />
                  <span>{company.avg_rating ? company.avg_rating.toFixed(1) : "New"}</span>
                  <span className="text-muted-foreground font-normal">({company.rate_count} reviews)</span>
                </div>
                {company.address && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{company.address}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                {company.whatsapp && (
                  <Button onClick={() => window.open(`https://wa.me/${company.whatsapp.replace(/\D/g, '')}`, '_blank')} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                    <MessageSquare className="mr-2 w-4 h-4" /> WhatsApp
                  </Button>
                )}
                {company.additional_contact && (
                  <Button variant="outline" className="rounded-xl" onClick={() => {
                    if (company.additional_contact.startsWith('http')) {
                      window.open(company.additional_contact, '_blank');
                    } else {
                      window.location.href = `mailto:${company.additional_contact}`;
                    }
                  }}>
                    <Globe className="mr-2 w-4 h-4" /> Contact
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-xl font-bold mb-4">About the Company</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{company.description || "No description provided."}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reviews</h2>
            </div>

            {user?.role === 'tourist' && !myReviewIdData?.review_id && (
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-4">Leave a review</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium">Your rating:</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => setRating(star)} className="text-chart-2 focus:outline-none">
                          <StarRating rating={rating >= star ? 1 : 0} size={24} max={1} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea 
                    placeholder="Tell others about your experience with this company..."
                    className="mb-4 bg-background"
                    rows={4}
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                  <Button onClick={handleReviewSubmit} disabled={!reviewText.trim() || createReview.isPending}>
                    {createReview.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {isLoadingReviews ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
              ) : reviews && reviews.length > 0 ? (
                reviews.map(review => (
                  <Card key={review.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={getImageUrl(review.reviewer_image) || undefined} />
                            <AvatarFallback>{review.reviewer_first_name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-sm">
                              {review.reviewer_first_name} {review.reviewer_last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(review.created_at), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <StarRating rating={review.rate} size={14} />
                          {user?.id === review.user_id && (
                            <button 
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-xs text-destructive hover:underline mt-2"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/90">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 border rounded-xl border-dashed">
                  <p className="text-muted-foreground">No reviews yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card rounded-2xl p-6 border shadow-sm">
              <h3 className="font-bold text-lg mb-4">Programs by {company.name}</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Discover all the adventures and experiences offered by this company.
              </p>
              <Link href={`/programs?company_id=${company.id}`}>
                <Button className="w-full">View All Programs</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
