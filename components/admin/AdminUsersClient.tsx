"use client";
// components/admin/AdminUsersClient.tsx
import { useState } from "react";
import { User } from "@/types";
import { Search, ShieldCheck, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";

interface UserWithCount extends User {
  _count?: { orders: number };
}

interface Props {
  users: UserWithCount[];
  currentUserId: string;
}

export default function AdminUsersClient({ users: initialUsers, currentUserId }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = async (userId: string, currentRole: string) => {
    if (userId === currentUserId) {
      toast.error("Cannot change your own role");
      return;
    }
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      );
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="font-playfair text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500">{users.length} registered users</p>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-coral"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3.5 font-bold text-gray-600">User</th>
                <th className="text-left px-4 py-3.5 font-bold text-gray-600 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3.5 font-bold text-gray-600">Role</th>
                <th className="text-right px-4 py-3.5 font-bold text-gray-600 hidden md:table-cell">Orders</th>
                <th className="text-right px-4 py-3.5 font-bold text-gray-600 hidden lg:table-cell">Joined</th>
                <th className="text-right px-4 py-3.5 font-bold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: "#FF6B6B" }}>
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">{user.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-gray-600 truncate max-w-[200px]">
                    {user.email}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role === "ADMIN" ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right hidden md:table-cell text-gray-600">
                    {(user._count as any)?.orders || 0}
                  </td>
                  <td className="px-4 py-3.5 text-right hidden lg:table-cell text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => toggleRole(user.id, user.role)}
                      disabled={user.id === currentUserId}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-400 hover:text-purple-600 border-gray-200 text-gray-600"
                    >
                      {user.role === "ADMIN" ? "→ User" : "→ Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
