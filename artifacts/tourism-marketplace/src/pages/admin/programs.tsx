import { useState } from "react";
import { usePrograms, useDeleteProgram } from "@/hooks/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function AdminPrograms() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: programs, isLoading } = usePrograms({
    search,
    is_active: -1, // Fetch all including inactive
    page,
    page_size: 50
  });

  const deleteProgram = useDeleteProgram();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this program?")) {
      deleteProgram.mutate(id, {
        onSuccess: () => toast.success("Program deleted")
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Programs</h1>
        <p className="text-muted-foreground">View all programs across all companies.</p>
      </div>

      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search programs..."
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
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Destination</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
              ) : programs?.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No programs found.</td></tr>
              ) : programs?.map(p => (
                <tr key={p.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 font-mono text-xs">{p.id}</td>
                  <td className="px-6 py-4 font-medium">{p.name}</td>
                  <td className="px-6 py-4">{p.company_name}</td>
                  <td className="px-6 py-4">{p.country_name}</td>
                  <td className="px-6 py-4">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={16} />
                    </Button>
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
        <Button variant="outline" disabled={!programs || programs.length < 50} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
