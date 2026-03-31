"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { TAGS } from "@/constants";
import type { Field, GroupDetail, StatusType } from "@/types";
import FieldUpdateModal from "@/components/FieldUpdateModal";

// ── Design constants ─────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  StatusType,
  { dot: string; bg: string; border: string; text: string; label: string }
> = {
  good:    { dot: "bg-[#4a7c59]", bg: "bg-[#e8f5ee]", border: "border-[#c0dfd0]", text: "text-[#4a7c59]",  label: "順調"  },
  caution: { dot: "bg-[#e6a817]", bg: "bg-[#fef9e7]", border: "border-[#f0d080]", text: "text-[#c88a00]",  label: "要確認" },
  urgent:  { dot: "bg-[#e74c3c]", bg: "bg-[#fdecea]", border: "border-[#e74c3c]", text: "text-[#e74c3c]",  label: "緊急"  },
  unknown: { dot: "bg-gray-300",  bg: "bg-white",      border: "border-gray-200",  text: "text-gray-400",   label: "未記録" },
};

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatElapsed(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 24) {
    return new Date(dateStr).toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return `${Math.floor(diffMs / (1000 * 60 * 60 * 24))}日前`;
}

function isStale(dateStr: string): boolean {
  return Date.now() - new Date(dateStr).getTime() > 2 * 24 * 60 * 60 * 1000;
}

function tagEmojis(tags: string[]): string {
  return tags
    .map((t) => TAGS.find((tg) => tg.id === t)?.emoji ?? "")
    .filter(Boolean)
    .join(" ");
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FieldsPage() {
  const router = useRouter();
  const [detail, setDetail] = useState<GroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  // Add-field sheet
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCrop, setNewCrop] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  // Invite token display
  const [showInvite, setShowInvite] = useState(false);

  const fetchGroup = useCallback(async () => {
    const gid = Cookies.get("hatake_gid");
    if (!gid) { router.replace("/dashboard"); return; }
    try {
      const res = await api.get<GroupDetail>(`/api/v1/groups/${gid}`);
      setDetail(res.data);
    } catch {
      Cookies.remove("hatake_gid");
      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchGroup(); }, [fetchGroup]);

  async function handleAddField(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);
    const gid = Cookies.get("hatake_gid");
    try {
      await api.post(`/api/v1/groups/${gid}/fields`, {
        field: { name: newName, crop: newCrop || null },
      });
      setAddOpen(false);
      setNewName("");
      setNewCrop("");
      fetchGroup();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { errors?: string[] } } })?.response?.data
          ?.errors?.[0] ?? "圃場の追加に失敗しました";
      setAddError(msg);
    } finally {
      setAddLoading(false);
    }
  }

  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("hatake_gid");
    router.push("/login");
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f2ed]">
        <div className="text-center space-y-2">
          <p className="text-[#4a7c59] text-sm">読み込み中...</p>
          <p className="text-gray-400 text-xs">初回は1分ほどかかる場合があります</p>
        </div>
      </div>
    );
  }

  if (!detail) return null;

  const { group, fields } = detail;

  // Summary counts
  const counts = {
    urgent:  fields.filter((f) => f.latest_log?.status === "urgent").length,
    caution: fields.filter((f) => f.latest_log?.status === "caution").length,
    good:    fields.filter((f) => f.latest_log?.status === "good").length,
    unknown: fields.filter((f) => !f.latest_log || f.latest_log.status === "unknown").length,
  };

  return (
    <div className="min-h-screen bg-[#f5f2ed] flex flex-col">
      {/* Header */}
      <header className="bg-[#1c2e1a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-base font-bold leading-tight">🌾 {group.name}</h1>
        </div>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/dashboard/history" className="text-green-300 hover:text-white">
            履歴
          </Link>
          <button
            onClick={() => setShowInvite((v) => !v)}
            className="text-green-300 hover:text-white"
            title="招待トークンを表示"
          >
            招待
          </button>
          <button onClick={handleLogout} className="text-green-300 hover:text-white">
            ログアウト
          </button>
        </nav>
      </header>

      {/* Invite token panel */}
      {showInvite && (
        <div className="bg-[#2a4028] text-white px-4 py-3 text-xs flex items-center gap-2">
          <span className="text-green-300">招待トークン:</span>
          <code className="font-mono text-white break-all">{group.invite_token}</code>
        </div>
      )}

      <main className="flex-1 px-4 py-5 space-y-4 max-w-2xl mx-auto w-full">
        {/* Summary bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: "urgent",  label: "緊急",  dot: "bg-[#e74c3c]", count: counts.urgent },
            { key: "caution", label: "要確認", dot: "bg-[#e6a817]", count: counts.caution },
            { key: "good",    label: "順調",  dot: "bg-[#4a7c59]", count: counts.good },
            { key: "unknown", label: "未記録", dot: "bg-gray-300",  count: counts.unknown },
          ].map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col items-center gap-1"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
              <span className="text-lg font-bold text-[#1c2e1a] leading-none">
                {item.count}
              </span>
              <span className="text-[10px] text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Field cards */}
        {fields.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            <p className="text-2xl mb-2">🌱</p>
            <p>圃場がまだありません</p>
            <p className="mt-1">下のボタンから追加してください</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field) => {
              const log = field.latest_log;
              const st = log?.status ?? "unknown";
              const cfg = STATUS_CONFIG[st];
              const stale = log ? isStale(log.updated_at) : false;

              return (
                <button
                  key={field.id}
                  onClick={() => setSelectedField(field)}
                  className={`w-full text-left rounded-2xl border p-4 transition-all active:scale-[0.99] ${cfg.bg} ${cfg.border} ${stale ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {/* Field name + status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <span className="font-semibold text-[#1c2e1a] text-sm">
                          {field.name}
                        </span>
                        {field.crop && (
                          <span className="text-xs text-gray-400">{field.crop}</span>
                        )}
                        {stale && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-700 border border-yellow-300 px-1.5 py-0.5 rounded-full">
                            要再確認
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {log && log.tags.length > 0 && (
                        <p className="text-base mt-1 ml-4">{tagEmojis(log.tags)}</p>
                      )}

                      {/* Memo */}
                      {log?.memo && (
                        <p className="text-xs text-gray-500 mt-1 ml-4 line-clamp-2">
                          {log.memo}
                        </p>
                      )}

                      {/* Photos */}
                      {log?.photo_urls && log.photo_urls.length > 0 && (
                        <div className="flex gap-1.5 mt-2 ml-4">
                          {log.photo_urls.map((url, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              key={i}
                              src={url}
                              alt={`写真${i + 1}`}
                              className="w-14 h-14 object-cover rounded-lg border border-white/60"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: status badge + time */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                      {log && (
                        <span className="text-[11px] text-gray-400">
                          {formatElapsed(log.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Add field button */}
        <button
          onClick={() => setAddOpen(true)}
          className="w-full border-2 border-dashed border-[#c5d9be] rounded-2xl py-4 text-sm text-[#4a7c59] hover:bg-[#eef4eb] transition-colors"
        >
          ＋ 圃場を追加
        </button>
      </main>

      {/* Add field sheet */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddOpen(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-6 space-y-5">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto sm:hidden" />
            <h2 className="text-lg font-bold text-[#1c2e1a]">圃場を追加</h2>
            {addError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {addError}
              </p>
            )}
            <form onSubmit={handleAddField} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#1c2e1a]">
                  圃場名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="例：第1圃場"
                  className="w-full rounded-lg border border-[#c5d9be] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59]"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-[#1c2e1a]">
                  作物（任意）
                </label>
                <input
                  type="text"
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  placeholder="例：トマト"
                  className="w-full rounded-lg border border-[#c5d9be] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59]"
                />
              </div>
              <button
                type="submit"
                disabled={addLoading}
                className="w-full bg-[#1c2e1a] hover:bg-[#2a4028] disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
              >
                {addLoading ? "追加中..." : "追加する"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Field update modal */}
      {selectedField && (
        <FieldUpdateModal
          field={selectedField}
          onClose={() => setSelectedField(null)}
          onSuccess={() => {
            setSelectedField(null);
            fetchGroup();
          }}
        />
      )}
    </div>
  );
}
