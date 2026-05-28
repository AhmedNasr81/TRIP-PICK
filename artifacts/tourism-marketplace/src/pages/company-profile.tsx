import { useState, useCallback } from "react";
import { useCompany, useReviews, useCreateReview, useDeleteReview, useUpdateReview, useCompanyPrograms } from "@/hooks/api-hooks";
import { useParams, Link } from "wouter";
import { getImageUrl } from "@/lib/api";
import { StarRating } from "@/components/star-rating";
import { ProgramCard } from "@/components/program-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageSquare, Globe, Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 6;
const DEFAULT_PRICE_MIN = 0;
const DEFAULT_PRICE_MAX = 10000;
const DEFAULT_DURATION_MIN = 1;
const DEFAULT_DURATION_MAX = 90;

export default function CompanyProfile() {
  const { id } = useParams();
  const { data: company, isLoading } = useCompany(id || "");
  const { user } = useAuth();

  // Programs filter state
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [priceRange, setPriceRange] = useState([DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX]);
  const [durationRange, setDurationRange] = useState([DEFAULT_DURATION_MIN, DEFAULT_DURATION_MAX]);
  const [startFrom, setStartFrom] = useState("");
  const [startTo, setStartTo] = useState("");
  const [programPage, setProgramPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const programParams: Record<string, any> = {
    search: debouncedSearch || undefined,
    sort_by: sortBy,
    order,
    price_min: priceRange[0] > DEFAULT_PRICE_MIN ? priceRange[0] : undefined,
    price_max: priceRange[1] < DEFAULT_PRICE_MAX ? priceRange[1] : undefined,
    duration_min: durationRange[0] > DEFAULT_DURATION_MIN ? durationRange[0] : undefined,
    duration_max: durationRange[1] < DEFAULT_DURATION_MAX ? durationRange[1] : undefined,
    start_at_from: startFrom || undefined,
    start_at_to: startTo || undefined,
    page: programPage,
    page_size: PAGE_SIZE,
  };

  const { data: programs, isLoading: isLoadingPrograms } = useCompanyPrograms(id || "", programParams);

  const activeFilterCount = [
    !!debouncedSearch,
    priceRange[0] > DEFAULT_PRICE_MIN || priceRange[1] < DEFAULT_PRICE_MAX,
    durationRange[0] > DEFAULT_DURATION_MIN || durationRange[1] < DEFAULT_DURATION_MAX,
    !!startFrom,
    !!startTo,
  ].filter(Boolean).length;

  const resetProgramFilters = useCallback(() => {
    setSearch("");
    setSortBy("created_at");
    setOrder("desc");
    setPriceRange([DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX]);
    setDurationRange([DEFAULT_DURATION_MIN, DEFAULT_DURATION_MAX]);
    setStartFrom("");
    setStartTo("");
    setProgramPage(1);
  }, []);

  // Reviews state
  const { data: reviews, isLoading: isLoadingReviews } = useReviews(id || "");
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();
  const updateReview = useUpdateReview();
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(5);

  const handleReviewSubmit = () => {
    if (!reviewText.trim() || !company) return;
    createReview.mutate({ company_id: company.id, rate: rating, comment: reviewText }, {
      onSuccess: () => {
        toast.success("Review submitted!");
        setReviewText("");
        setRating(5);
      },
      onError: () => toast.error("Failed to submit review"),
    });
  };

  const handleDeleteReview = (reviewId: number) => {
    if (!company) return;
    if (confirm("Delete your review?")) {
      deleteReview.mutate({ reviewId, companyId: company.id }, {
        onSuccess: () => toast.success("Review deleted"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-72 rounded-2xl mb-8" />
        <Skeleton className="h-10 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!company) {
    return <div className="container mx-auto py-20 text-center text-2xl font-bold">Company not found</div>;
  }

  const hasPrevPrograms = programPage > 1;
  const hasNextPrograms = programs && programs.length === PAGE_SIZE;

  return (
    <div className="bg-background pb-20">
      {/* Banner */}
      <div className="h-64 md:h-80 w-full relative">
        <img
          src={getImageUrl(company.image) || "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80"}
          alt={company.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Company Header Card */}
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-xl border mb-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl border-4 border-background overflow-hidden bg-muted -mt-20 md:-mt-24 shadow-lg">
              <img
                src={getImageUrl(company.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&size=200&background=0d9488&color=fff`}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <StarRating rating={company.avg_rating || 0} size={16} />
                  <span>{company.avg_rating ? company.avg_rating.toFixed(1) : "New"}</span>
                  <span className="text-muted-foreground font-normal">({company.rate_count} reviews)</span>
                </div>
                {company.address && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} /> <span>{company.address}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {company.whatsapp && (
                  <Button
                    onClick={() => window.open(`https://wa.me/${company.whatsapp.replace(/\D/g, '')}`, '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl gap-2"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </Button>
                )}
                {company.additional_contact && (
                  <Button variant="outline" className="rounded-xl gap-2" onClick={() => {
                    const c = company.additional_contact;
                    window.open(c.startsWith('http') ? c : `mailto:${c}`, '_blank');
                  }}>
                    <Globe className="w-4 h-4" /> Contact
                  </Button>
                )}
              </div>
            </div>
          </div>
          {company.description && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{company.description}</p>
            </div>
          )}
        </div>

        {/* Programs Section */}
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">Programs by {company.name}</h2>
            <Link href={`/programs?company_id=${company.id}`}>
              <Button variant="ghost" size="sm" className="text-primary gap-1">
                View on Programs page
              </Button>
            </Link>
          </div>

          {/* Search + Filter toggle row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search programs..."
                className="pl-10 h-10 rounded-lg"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setProgramPage(1); }}
                data-testid="input-company-program-search"
              />
              {search && (
                <button onClick={() => { setSearch(""); setProgramPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setProgramPage(1); }}>
              <SelectTrigger className="w-full sm:w-44 h-10 rounded-lg" data-testid="sort-company-programs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest First</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="rate">Rating</SelectItem>
              </SelectContent>
            </Select>

            <Select value={order} onValueChange={(v) => { setOrder(v); setProgramPage(1); }}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-lg" data-testid="order-company-programs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">High to Low</SelectItem>
                <SelectItem value="asc">Low to High</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="h-10 gap-2 shrink-0"
              onClick={() => setShowFilters(f => !f)}
              data-testid="button-toggle-program-filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
              {activeFilterCount > 0 && <Badge className="h-4 px-1 text-xs">{activeFilterCount}</Badge>}
              {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>

          {/* Expandable advanced filters */}
          {showFilters && (
            <div className="bg-card border rounded-xl p-5 mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Price Range</span>
                  <span className="text-muted-foreground">${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}</span>
                </div>
                <Slider
                  value={priceRange}
                  min={DEFAULT_PRICE_MIN}
                  max={DEFAULT_PRICE_MAX}
                  step={100}
                  onValueChange={(val) => { setPriceRange(val); setProgramPage(1); }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Duration (days)</span>
                  <span className="text-muted-foreground">{durationRange[0]} – {durationRange[1]}d</span>
                </div>
                <Slider
                  value={durationRange}
                  min={DEFAULT_DURATION_MIN}
                  max={DEFAULT_DURATION_MAX}
                  step={1}
                  onValueChange={(val) => { setDurationRange(val); setProgramPage(1); }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Start Date From</label>
                <Input
                  type="date"
                  value={startFrom}
                  onChange={(e) => { setStartFrom(e.target.value); setProgramPage(1); }}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Start Date To</label>
                <Input
                  type="date"
                  value={startTo}
                  onChange={(e) => { setStartTo(e.target.value); setProgramPage(1); }}
                  className="h-9 text-sm"
                />
              </div>

              {activeFilterCount > 0 && (
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={resetProgramFilters} className="gap-1 text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" /> Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>
              {isLoadingPrograms ? "Loading..." : `${programs?.length ?? 0} program${programs?.length !== 1 ? "s" : ""} on page ${programPage}`}
            </span>
            {activeFilterCount > 0 && (
              <button onClick={resetProgramFilters} className="flex items-center gap-1 text-primary hover:underline text-xs font-medium">
                <X className="w-3 h-3" /> Clear {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingPrograms
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <Skeleton key={i} className="h-[380px] rounded-xl" />
                ))
              : programs && programs.length > 0
              ? programs.map(p => <ProgramCard key={p.id} program={p} />)
              : (
                <div className="col-span-full py-16 text-center bg-card rounded-xl border border-dashed">
                  <Search className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-40" />
                  <h3 className="font-bold mb-1">No programs found</h3>
                  <p className="text-sm text-muted-foreground mb-3">Try adjusting your filters.</p>
                  {activeFilterCount > 0 && (
                    <Button variant="outline" size="sm" onClick={resetProgramFilters} className="gap-1">
                      <X className="w-3 h-3" /> Clear Filters
                    </Button>
                  )}
                </div>
              )}
          </div>

          {/* Program Pagination */}
          {(hasPrevPrograms || hasNextPrograms) && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button variant="outline" size="sm" onClick={() => setProgramPage(p => Math.max(1, p - 1))} disabled={!hasPrevPrograms} className="gap-2">
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>
              <span className="text-sm font-medium px-3 py-1.5 bg-muted rounded-md">Page {programPage}</span>
              <Button variant="outline" size="sm" onClick={() => setProgramPage(p => p + 1)} disabled={!hasNextPrograms} className="gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>

        {/* Reviews Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Reviews ({company.rate_count})</h2>

          {user?.role === 'tourist' && !reviews?.some(r => r.user_id === user?.id) && (
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">Leave a review</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                        <StarRating rating={rating >= star ? 1 : 0} size={24} max={1} />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{rating}/5</span>
                </div>
                <Textarea
                  placeholder="Share your experience with this company..."
                  className="mb-4 bg-background"
                  rows={4}
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  data-testid="textarea-review"
                />
                <Button onClick={handleReviewSubmit} disabled={!reviewText.trim() || createReview.isPending} data-testid="button-submit-review">
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {isLoadingReviews
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
              : reviews && reviews.length > 0
              ? reviews.map(review => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={getImageUrl(review.reviewer_image) || undefined} />
                            <AvatarFallback>{review.reviewer_first_name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">
                              {review.reviewer_first_name} {review.reviewer_last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(review.created_at), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StarRating rating={review.rate} size={14} />
                          {user?.id === review.user_id && (
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => {
                                  setEditingReviewId(review.id);
                                  setEditReviewText(review.comment);
                                  setEditReviewRating(review.rate);
                                }}
                                className="text-xs text-primary hover:underline"
                              >
                                Edit
                              </button>
                              <button onClick={() => handleDeleteReview(review.id)} className="text-xs text-destructive hover:underline">
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {editingReviewId === review.id ? (
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Rating:</span>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(star => (
                                <button key={star} onClick={() => setEditReviewRating(star)} className="focus:outline-none">
                                  <StarRating rating={editReviewRating >= star ? 1 : 0} size={20} max={1} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <textarea
                            className="w-full border rounded-lg p-2 text-sm resize-none bg-background"
                            rows={3}
                            value={editReviewText}
                            onChange={e => setEditReviewText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              disabled={!editReviewText.trim() || updateReview.isPending}
                              onClick={() => {
                                updateReview.mutate(
                                  { reviewId: review.id, data: { rate: editReviewRating, comment: editReviewText } },
                                  { onSuccess: () => { toast.success("Review updated!"); setEditingReviewId(null); } }
                                );
                              }}
                            >
                              {updateReview.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingReviewId(null)}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/90 leading-relaxed">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              : (
                <div className="text-center py-12 border rounded-xl border-dashed">
                  <p className="text-muted-foreground">No reviews yet. Be the first to leave one.</p>
                </div>
              )}
          </div>
        </section>
      </div>
    </div>
  );
}
