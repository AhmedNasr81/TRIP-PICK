import { useCompanies } from "@/hooks/api-hooks";
import { CompanyCard } from "@/components/company-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export default function Companies() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [sortBy, setSortBy] = useState<string>("rate");

  const params = {
    keyword: debouncedSearch,
    sort_by: sortBy,
  };

  const { data: companies, isLoading } = useCompanies(params);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Travel Partners</h1>
        <p className="text-lg text-muted-foreground">
          Discover trusted tour operators and travel companies from around the world.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search companies by name or location..." 
            className="pl-10 h-14 text-base rounded-2xl bg-card border-border shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-14 rounded-2xl bg-card border-border shadow-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rate">Highest Rated</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground max-w-4xl mx-auto">
        <span>Showing {companies?.length || 0} companies</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))
        ) : companies && companies.length > 0 ? (
          companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-card rounded-2xl border border-dashed">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No companies found</h3>
            <p className="text-muted-foreground">Try adjusting your search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
