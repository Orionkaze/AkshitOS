"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
      <Card className="w-full max-w-md space-y-8 p-10 shadow-2xl border-accent-primary/5">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-accent-primary tracking-tighter">AkshitOS</h1>
          <p className="text-text-secondary text-sm font-medium">Log in to your productivity dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <Input 
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input 
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && <p className="text-xs text-alert-error font-medium animate-shake text-center">{error}</p>}

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-text-secondary/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-bg-surface px-4 text-text-secondary font-medium tracking-widest">Or continue with</span>
          </div>
        </div>

        <Button 
          variant="secondary" 
          className="w-full gap-3" 
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale opacity-70 group-hover:grayscale-0" alt="Google" />
          Google OAuth
        </Button>

        <p className="text-center text-sm text-text-secondary">
          New here?{" "}
          <Link href="/register" className="text-accent-primary font-bold hover:underline transition-all">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
