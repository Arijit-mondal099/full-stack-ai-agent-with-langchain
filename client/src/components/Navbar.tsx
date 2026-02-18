"use client";

import { Loader2, LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogin = () => {
    window.location.href = process.env.NODE_ENV === "development"
    ? "http://localhost:4000/api/v1/auth/login"
    : `${process.env.NEXT_PUBLIC_API_URI}/auth/login`;
  }

  const handleLogout = async () => {
    setLoading(true);
    await api.post("/auth/logout", {});
    router.replace("/");
    setUser(null);
    setLoading(false);
  }

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await api.get<{ success: boolean; data: string }>(
          "/auth/me",
        );
        if (data.success) setUser(data.data);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, []);

  return (
    <header className="shadow-sm border-b border-gray-200 py-2 px-2">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agent</h1>

        {loading ? (
          <Button>
            <Loader2 className="animate-spin" />
          </Button>
        ) : user ? (
          <Button onClick={handleLogout}>
            <span>Logout</span>
            <LogOut />
          </Button>
        ) : (
          <Button onClick={handleLogin}>
            <span>Login</span>
            <LogIn />
          </Button>
        )}
      </nav>
    </header>
  );
};
