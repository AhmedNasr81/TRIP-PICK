import { useState, useCallback } from "react";
import { useCompanies, useCountries } from "@/hooks/api-hooks";
import { CompanyCard } from "@/components/company-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 12;

export default function Companies() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [countryId, setCountryId] = useState("-1");
  const [sortBy, setSortBy] = useState("rate");
  const [page, setPage] = useState(1);

  const { data: countries } = useCountries();

  const params: Record<string, any> = {
    keyword: debouncedSearch || undefined,
    country_id: countryId === "-1" ? undefined : countryId,
    sort_by: sortBy,
    page,
    page_size: PAGE_SIZE,
  };

  const { data: companies, isLoading } = useCompanies(params);

  const activeFilterCount = [
    countryId !== "-1",
    sortBy !== "rate",
  ].filter(Boolean).length;

  const resetFilters = useCallback(() => {
    setSearch("");
    setCountryId("-1");
    setSortBy("rate");
    setPage(1);
  }, []);

  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Filter by Country</label>
        <Select value={countryId} onValueChange={(v) => { setCountryId(v); setPage(1); }}>
          <SelectTrigger data-testid="filter-companies-country">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">All Countries</SelectItem>
            {countries?.map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Sort By</label>
        <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
          <SelectTrigger data-testid="filter-companies-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rate">Highest Rated</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={resetFilters}>
        <X className="w-4 h-4" /> Reset Filters
      </Button>
    </div>
  );

  const hasPrev = page > 1;
  const hasNext = companies && companies.length === PAGE_SIZE;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-3">Travel Partners</h1>
        <p className="text-lg text-muted-foreground">
          Discover trusted tour operators and travel companies from around the world.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-4xl mx-auto">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search companies by name or keyword..."
            className="pl-10 h-11 rounded-lg"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            data-testid="input-search-companies"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Country filter — desktop inline */}
        <div className="hidden sm:block w-52">
          <Select value={countryId} onValueChange={(v) => { setCountryId(v); setPage(1); }}>
            <SelectTrigger className="h-11 rounded-lg" data-testid="filter-companies-country-inline">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">All Countries</SelectItem>
              {countries?.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort — desktop inline */}
        <div className="hidden sm:block w-44">
          <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
            <SelectTrigger className="h-11 rounded-lg" data-testid="filter-companies-sort-inline">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rate">Highest Rated</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile filter sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="sm:hidden h-11 gap-2" data-testid="button-mobile-filters-companies">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="h-5 px-1.5 text-xs">{activeFilterCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mb-5 max-w-4xl mx-auto">
        <span data-testid="text-companies-count">
          {isLoading ? "Searching..." : `${companies?.length ?? 0} compan${companies?.length !== 1 ? "ies" : "y"} on page ${page}`}
        </span>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-primary hover:underline text-xs font-medium">
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {isLoading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))
          : companies && companies.length > 0
          ? companies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))
          : (
            <div className="col-span-full py-24 text-center bg-card rounded-2xl border border-dashed">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-xl font-bold mb-2">No companies found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters.</p>
              <Button variant="outline" onClick={resetFilters} className="gap-2">
                <X className="w-4 h-4" /> Clear Filters
              </Button>
            </div>
          )}
      </div>

      {/* Pagination */}
      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!hasPrev} className="gap-2" data-testid="button-companies-prev">
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-sm font-medium px-4 py-2 bg-muted rounded-md" data-testid="text-companies-page">Page {page}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={!hasNext} className="gap-2" data-testid="button-companies-next">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
