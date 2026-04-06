"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/lib/api";
import type { GroupDetail, User } from "@/types";

export default function SettingsPage() {
  const router = useRouter();
  const [detail, setDetail] = useState<GroupDetail | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Group name edit
  const [editingName, setEditingName] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  // Leave group
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState("");

  // Upgrade
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // Invite copy
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    const gid = Cookies.get("hatake_gid");
    if (!gid) { router.replace("/dashboard"); return; }
    try {
      const [groupRes, meRes] = await Promise.all([
        api.get<GroupDetail>(`/api/v1/groups/${gid}`),
        api.get<{ user: User }>("/api/v1/me"),
      ]);
      setDetail(groupRes.data);
      setGroupName(groupRes.data.group.name);
      setMe(meRes.data.user);
    } catch {
      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setNameError("");
    setNameSaving(true);
    const gid = Cookies.get("hatake_gid");
    try {
      const res = await api.patch(`/api/v1/groups/${gid}`, { group: { name: groupName } });
      setDetail((prev) => prev ? { ...prev, group: res.data.group } : prev);
      setEditingName(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors?.[0] ?? "更新に失敗しました";
      setNameError(msg);
    } finally {
      setNameSaving(false);
    }
  }

  async function handleLeave() {
    setLeaveError("");
    setLeaveLoading(true);
    const gid = Cookies.get("hatake_gid");
    try {
      await api.delete(`/api/v1/groups/${gid}/leave`);
      Cookies.remove("hatake_gid");
      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors?.[0] ?? "離脱に失敗しました";
      setLeaveError(msg);
      setShowLeaveConfirm(false);
    } finally {
      setLeaveLoading(false);
    }
  }

  async function handleUpgrade() {
    setUpgradeLoading(true);
    try {
      const res = await api.post<{ url: string }>("/api/v1/subscriptions/create_checkout");
      window.location.href = res.data.url;
    } catch {
      setUpgradeLoading(false);
    }
  }

  function handleCopyInvite() {
    if (!detail) return;
    navigator.clipboard.writeText(detail.group.invite_token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed]">
        <p className="text-[#4a7c59] text-sm">読み込み中...</p>
      </div>
    );
  }

  if (!detail || !me) return null;

  const { group, members } = detail;
  const myMembership = members.find((m) => m.email === me.email);
  const isAdmin = myMembership?.role === "admin";

  return (
    <div className="min-h-screen bg-[#f5f2ed] flex flex-col">
      {/* Header */}
      <header className="bg-[#1c2e1a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard/fields" className="text-green-300 hover:text-white text-sm">
          ← 戻る
        </Link>
        <h1 className="text-base font-bold">設定</h1>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-4 py-5 space-y-4 max-w-2xl mx-auto w-full">

        {/* Group name */}
        <section className="bg-white rounded-2xl border border-[#d6e4d0] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#1c2e1a]">グループ名</h2>
          {editingName && isAdmin ? (
            <form onSubmit={handleSaveName} className="space-y-3">
              {nameError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{nameError}</p>
              )}
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                className="w-full rounded-lg border border-[#c5d9be] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59]"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={nameSaving}
                  className="flex-1 bg-[#1c2e1a] hover:bg-[#2a4028] disabled:opacity-60 text-white font-semibold rounded-lg py-2 text-sm"
                >
                  {nameSaving ? "保存中..." : "保存"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingName(false); setGroupName(group.name); setNameError(""); }}
                  className="flex-1 border border-gray-200 text-gray-500 rounded-lg py-2 text-sm"
                >
                  キャンセル
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-[#1c2e1a] font-medium">{group.name}</p>
              {isAdmin && (
                <button
                  onClick={() => setEditingName(true)}
                  className="text-xs text-[#4a7c59] hover:underline"
                >
                  編集
                </button>
              )}
            </div>
          )}
        </section>

        {/* Invite token */}
        <section className="bg-white rounded-2xl border border-[#d6e4d0] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#1c2e1a]">招待トークン</h2>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 break-all">
              {group.invite_token}
            </code>
            <button
              onClick={handleCopyInvite}
              className="text-xs px-3 py-2 border border-[#c5d9be] rounded-lg text-[#4a7c59] hover:bg-[#eef4eb] whitespace-nowrap"
            >
              {copied ? "コピー済" : "コピー"}
            </button>
          </div>
        </section>

        {/* Members */}
        <section className="bg-white rounded-2xl border border-[#d6e4d0] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-[#1c2e1a]">メンバー ({members.length}人)</h2>
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1c2e1a]">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.role === "admin" ? "bg-[#e8f5ee] text-[#4a7c59]" : "bg-gray-100 text-gray-500"}`}>
                  {m.role === "admin" ? "管理者" : "メンバー"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Plan */}
        {me.plan === "free" ? (
          <section className="bg-white rounded-2xl border border-[#d6e4d0] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1c2e1a]">プラン</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">無料</span>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">無料プランでできること</p>
              <ul className="space-y-1.5">
                {["圃場10件まで", "メンバー3名まで", "写真アップロード（3枚）", "絵文字タグ・メモ"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#1c2e1a]">
                    <span className="text-[#4a7c59] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#e8f5ee] rounded-xl p-4 space-y-2">
              <p className="text-xs font-medium text-[#4a7c59]">Proプランにアップグレードすると</p>
              <ul className="space-y-1.5">
                {["圃場無制限", "メンバー無制限", "複数グループ参加・切り替え"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#1c2e1a]">
                    <span className="text-[#4a7c59]">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="w-full bg-[#4a7c59] hover:bg-[#3d6b4a] disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              {upgradeLoading ? "リダイレクト中..." : "Proにアップグレード（月額500円）"}
            </button>
          </section>
        ) : (
          <section className="bg-white rounded-2xl border border-[#4a7c59] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#1c2e1a]">プラン</h2>
              <span className="text-xs bg-[#1c2e1a] text-white px-2.5 py-0.5 rounded-full font-medium">Pro ✓</span>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Proプランの特典</p>
              <ul className="space-y-1.5">
                {["圃場無制限", "メンバー無制限", "複数グループ参加・切り替え", "写真アップロード（3枚）", "絵文字タグ・メモ"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#1c2e1a]">
                    <span className="text-[#4a7c59] font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Leave group */}
        <section className="bg-white rounded-2xl border border-red-100 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-red-600">グループを離脱する</h2>
          {leaveError && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{leaveError}</p>
          )}
          <button
            onClick={() => setShowLeaveConfirm(true)}
            className="w-full border border-red-300 text-red-500 hover:bg-red-50 font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            グループを離脱する
          </button>
        </section>
      </main>

      {/* Leave confirm dialog */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLeaveConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-[#1c2e1a]">本当に離脱しますか？</h3>
            <p className="text-sm text-gray-500">
              グループを離脱すると圃場データにアクセスできなくなります。
              {isAdmin && members.length > 1 && " 次のメンバーが管理者に昇格します。"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLeave}
                disabled={leaveLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold rounded-xl py-2.5 text-sm"
              >
                {leaveLoading ? "処理中..." : "離脱する"}
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-500 rounded-xl py-2.5 text-sm"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
