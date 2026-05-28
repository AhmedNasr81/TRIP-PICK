import { useState } from "react";
import { useAdminUsers, useUpdateUserStatus, useDeleteAdminUser } from "@/hooks/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("-1");
  const [isActive, setIsActive] = useState("-1");
  const [page, setPage] = useState(1);

  const { data: users, isLoading } = useAdminUsers({
    search,
    role: role === "-1" ? "" : role,
    is_active: isActive === "-1" ? "" : isActive,
    page,
    page_size: 50
  });

  const updateStatus = useUpdateUserStatus();
  const deleteUser = useDeleteAdminUser();

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    updateStatus.mutate(
      { id, is_active: !currentStatus },
      { onSuccess: () => toast.success("User status updated") }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Permanently delete this user?")) return;
    deleteUser.mutate(id, {
      onSuccess: () => toast.success("User deleted"),
      onError: () => toast.error("Failed to delete"),
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-muted-foreground">View and manage all registered users.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">All Roles</SelectItem>
            <SelectItem value="tourist">Tourist</SelectItem>
            <SelectItem value="company">Company</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={isActive} onValueChange={setIsActive}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">All Status</SelectItem>
            <SelectItem value="1">Active</SelectItem>
            <SelectItem value="0">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Active</th>
                <th className="px-6 py-4 font-medium">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t">
              {isLoading ? (
                <tr><td colSpan={6} className="p-8 text-center">Loading...</td></tr>
              ) : users?.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No users found.</td></tr>
              ) : users?.map(u => (
                <tr key={u.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 font-medium">{u.first_name} {u.last_name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 capitalize">{u.role}</td>
                  <td className="px-6 py-4">{format(new Date(u.created_at), "MMM d, yyyy")}</td>
                  <td className="px-6 py-4">
                    <Switch 
                      checked={u.is_active} 
                      onCheckedChange={() => handleToggleStatus(u.id, u.is_active)}
                      disabled={updateStatus.isPending || u.role === 'admin'}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost" size="icon"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(u.id)}
                      disabled={u.role === 'admin' || deleteUser.isPending}
                      title={u.role === 'admin' ? "Cannot delete admin" : "Delete user"}
                    >
                      <Trash2 className="w-4 h-4" />
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
        <Button variant="outline" disabled={!users || users.length < 50} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
