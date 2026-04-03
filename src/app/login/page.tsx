"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/lib/api";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/v1/users/sign_in", {
        user: { email, password },
      });
      // API returns "Bearer <token>", strip the prefix before storing
      const raw: string = res.data.token ?? "";
      Cookies.set("token", raw.replace(/^Bearer\s+/, ""), { expires: 7 });
      const groupId = res.data.user?.group_id;
      if (groupId) {
        Cookies.set("hatake_gid", String(groupId), { expires: 30 });
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { errors?: string[] } } })
        ?.response?.data;
      const message = data?.errors?.[0] ?? "ログインに失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f2]">
    <main className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1c2e1a] tracking-wide">
            🌾 hatake
          </h1>
          <p className="text-sm text-[#4a7c59] mt-1">圃場状態共有アプリ</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-[#d6e4d0] p-8 space-y-5"
        >
          <h2 className="text-xl font-semibold text-[#1c2e1a]">ログイン</h2>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1c2e1a]">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@farm.jp"
              className="w-full rounded-lg border border-[#c5d9be] px-4 py-2.5 text-sm text-[#1c2e1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#1c2e1a]">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-[#c5d9be] px-4 py-2.5 text-sm text-[#1c2e1a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a7c59] hover:bg-[#3d6b4a] disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>

          <p className="text-center text-sm text-gray-500">
            アカウントをお持ちでない方は{" "}
            <Link
              href="/register"
              className="text-[#4a7c59] font-medium hover:underline"
            >
              新規登録
            </Link>
          </p>
        </form>
      </div>
    </main>
    <Footer />
    </div>
  );
}
