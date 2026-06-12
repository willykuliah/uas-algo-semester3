"use client";
import bcrypt from "bcryptjs";
import { useState } from "react";
import axios from "axios";
import { GraduationCap, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.get(
        "https://apimahasiswa.muliabuana.sch.id/users",
      );

      const users = Array.isArray(res.data) ? res.data : [];

      const user = users.find((u: any) => u.username === username);
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        alert("Password salah");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");

      router.push("/admin");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-2xl font-bold">Portal</h1>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Silakan masuk menggunakan akun anda
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Username"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Sistem Informasi Akademik
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
