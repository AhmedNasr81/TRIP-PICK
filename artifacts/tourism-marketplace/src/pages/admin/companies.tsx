import { useState } from "react";
import { useCompanies } from "@/hooks/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function AdminCompanies() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: companies, isLoading } = useCompanies({
    keyword: search,
    page,
    page_size: 50
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Companies</h1>
        <p className="text-muted-foreground">Directory of all travel partners.</p>
      </div>

      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
              ) : companies?.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No companies found.</td></tr>
              ) : companies?.map(c => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 font-mono text-xs">{c.id}</td>
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4">{c.avg_rating ? c.avg_rating.toFixed(1) : "N/A"} ({c.rate_count})</td>
                  <td className="px-6 py-4 text-xs">
                    {c.whatsapp && <div className="truncate w-32">WA: {c.whatsapp}</div>}
                    {c.additional_contact && <div className="truncate w-32">{c.additional_contact}</div>}
                  </td>
                  <td className="px-6 py-4">{format(new Date(c.created_at), "MMM d, yyyy")}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/companies/${c.id}`}>
                      <Button variant="ghost" size="sm">
                        <ExternalLink size={16} className="mr-2" /> View Profile
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
        <span className="text-sm">Page {page}</span>
        <Button variant="outline" disabled={!companies || companies.length < 50} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
