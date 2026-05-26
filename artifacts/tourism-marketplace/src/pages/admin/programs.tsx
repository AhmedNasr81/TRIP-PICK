import { useState } from "react";
import { usePrograms, useDeleteProgram, useCountries, useCompanies } from "@/hooks/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/use-debounce";

const PAGE_SIZE = 50;

export default function AdminPrograms() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [countryId, setCountryId] = useState("-1");
  const [companyId, setCompanyId] = useState("-1");
  const [isActive, setIsActive] = useState("-1");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const { data: countries } = useCountries();
  const { data: companies } = useCompanies();

  const { data: programs, isLoading } = usePrograms({
    search: debouncedSearch || undefined,
    country_id: countryId === "-1" ? undefined : countryId,
    company_id: companyId === "-1" ? undefined : companyId,
    is_active: isActive,
    sort_by: sortBy,
    order,
    page,
    page_size: PAGE_SIZE,
  });

  const deleteProgram = useDeleteProgram();

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProgram.mutate(id, {
        onSuccess: () => toast.success("Program deleted"),
        onError: () => toast.error("Failed to delete program"),
      });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCountryId("-1");
    setCompanyId("-1");
    setIsActive("-1");
    setSortBy("created_at");
    setOrder("desc");
    setPage(1);
  };

  const activeFilterCount = [
    countryId !== "-1",
    companyId !== "-1",
    isActive !== "-1",
    sortBy !== "created_at",
  ].filter(Boolean).length;

  const hasPrev = page > 1;
  const hasNext = programs && programs.length === PAGE_SIZE;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Manage Programs</h1>
          <p className="text-muted-foreground">View, filter, and remove tour programs across all companies.</p>
        </div>
        {activeFilterCount > 0 && (
          <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2 self-start sm:self-auto">
            <X className="w-4 h-4" /> Clear {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}
          </Button>
        )}
      </div>

      {/* Filter bar */}
      <div className="bg-card border rounded-xl p-4 mb-6 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search programs by name..."
              className="pl-9"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              data-testid="input-admin-search-programs"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Country filter */}
          <Select value={countryId} onValueChange={(v) => { setCountryId(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-48" data-testid="filter-admin-country">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">All Countries</SelectItem>
              {countries?.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Company filter */}
          <Select value={companyId} onValueChange={(v) => { setCompanyId(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-48" data-testid="filter-admin-company">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">All Companies</SelectItem>
              {companies?.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status filter */}
          <Select value={isActive} onValueChange={(v) => { setIsActive(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44" data-testid="filter-admin-active">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">All Status</SelectItem>
              <SelectItem value="1">Active Only</SelectItem>
              <SelectItem value="0">Inactive Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort by */}
          <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44" data-testid="filter-admin-sort">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date Created</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="rate">Rating</SelectItem>
            </SelectContent>
          </Select>

          {/* Order */}
          <Select value={order} onValueChange={(v) => { setOrder(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44" data-testid="filter-admin-order">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {isLoading ? "Loading..." : `${programs?.length ?? 0} programs on page ${page}`}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-muted-foreground">Loading programs...</td>
                </tr>
              ) : programs?.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-muted-foreground">
                    No programs found. Try adjusting your filters.
                  </td>
                </tr>
              ) : programs?.map(p => (
                <tr key={p.id} className="hover:bg-muted/20" data-testid={`row-program-${p.id}`}>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-6 py-4 font-medium max-w-[200px] truncate" title={p.name}>{p.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.company_name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.country_name}</td>
                  <td className="px-6 py-4">${p.price.toLocaleString()}</td>
                  <td className="px-6 py-4">{p.duration}d</td>
                  <td className="px-6 py-4">
                    <Badge variant={p.is_active ? "default" : "secondary"} className="text-xs">
                      {p.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                    {format(new Date(p.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(p.id, p.name)}
                      disabled={deleteProgram.isPending}
                      data-testid={`button-delete-program-${p.id}`}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" size="sm" className="gap-2" disabled={!hasPrev} onClick={() => setPage(p => Math.max(1, p - 1))} data-testid="button-admin-programs-prev">
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        <span className="text-sm font-medium px-4 py-2 bg-muted rounded-md" data-testid="text-admin-programs-page">Page {page}</span>
        <Button variant="outline" size="sm" className="gap-2" disabled={!hasNext} onClick={() => setPage(p => p + 1)} data-testid="button-admin-programs-next">
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
