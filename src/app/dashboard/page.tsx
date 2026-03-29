"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";
import type { Group } from "@/types";

type Mode = "menu" | "create" | "join";

export default function DashboardPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("menu");
  const [groupName, setGroupName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const gid = Cookies.get("hatake_gid");
    if (gid) router.replace("/dashboard/fields");
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ group: Group }>("/api/v1/groups", {
        group: { name: groupName },
      });
      Cookies.set("hatake_gid", String(res.data.group.id), { expires: 30 });
      router.push("/dashboard/fields");
    } catch {
      setError("グループの作成に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ group: Group }>("/api/v1/groups/0/join", {
        invite_token: inviteToken.trim(),
      });
      Cookies.set("hatake_gid", String(res.data.group.id), { expires: 30 });
      router.push("/dashboard/fields");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { errors?: string[] } } })?.response?.data
          ?.errors?.[0] ?? "参加に失敗しました。トークンを確認してください";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f2ed] px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* ロゴ */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1c2e1a]">🌾 畑</h1>
          <p className="text-sm text-[#4a7c59] mt-1">圃場状態共有アプリ</p>
        </div>

        {mode === "menu" && (
          <div className="bg-white rounded-2xl border border-[#d6e4d0] p-8 space-y-4">
            <p className="text-sm text-gray-500 text-center">
              グループへの参加または作成が必要です
            </p>
            <button
              onClick={() => setMode("create")}
              className="w-full bg-[#1c2e1a] hover:bg-[#2a4028] text-white font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              グループを作成する
            </button>
            <button
              onClick={() => setMode("join")}
              className="w-full border border-[#4a7c59] text-[#4a7c59] hover:bg-[#eef4eb] font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              招待トークンで参加する
            </button>
          </div>
        )}

        {mode === "create" && (
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl border border-[#d6e4d0] p-8 space-y-5"
          >
            <h2 className="text-lg font-semibold text-[#1c2e1a]">
              グループを作成
            </h2>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#1c2e1a]">
                グループ名
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                placeholder="例：山田農園"
                className="w-full rounded-lg border border-[#c5d9be] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1c2e1a] hover:bg-[#2a4028] disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading ? "作成中..." : "作成する"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("menu"); setError(""); }}
              className="w-full text-sm text-gray-400 hover:text-gray-600"
            >
              戻る
            </button>
          </form>
        )}

        {mode === "join" && (
          <form
            onSubmit={handleJoin}
            className="bg-white rounded-2xl border border-[#d6e4d0] p-8 space-y-5"
          >
            <h2 className="text-lg font-semibold text-[#1c2e1a]">
              グループに参加
            </h2>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </p>
            )}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#1c2e1a]">
                招待トークン
              </label>
              <input
                type="text"
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                required
                placeholder="管理者から受け取ったトークン"
                className="w-full rounded-lg border border-[#c5d9be] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4a7c59] hover:bg-[#3d6b4a] disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              {loading ? "参加中..." : "参加する"}
            </button>
            <button
              type="button"
              onClick={() => { setMode("menu"); setError(""); }}
              className="w-full text-sm text-gray-400 hover:text-gray-600"
            >
              戻る
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
