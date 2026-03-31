"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { TAGS } from "@/constants";
import type { Field, FieldLog, StatusType } from "@/types";

const STATUS_CONFIG: Record<
  StatusType,
  { dot: string; text: string; label: string }
> = {
  good:    { dot: "bg-[#4a7c59]", text: "text-[#4a7c59]",  label: "順調"  },
  caution: { dot: "bg-[#e6a817]", text: "text-[#c88a00]",  label: "要確認" },
  urgent:  { dot: "bg-[#e74c3c]", text: "text-[#e74c3c]",  label: "緊急"  },
  unknown: { dot: "bg-gray-300",  text: "text-gray-400",   label: "未記録" },
};

type LogEntry = FieldLog & { field_name: string };

function formatElapsed(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}分前`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}時間前`;
  return `${Math.floor(diffHours / 24)}日前`;
}

function tagEmojis(tags: string[]): string {
  return tags
    .map((t) => TAGS.find((tg) => tg.id === t)?.emoji ?? "")
    .filter(Boolean)
    .join(" ");
}

export default function HistoryPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");

  const fetchHistory = useCallback(async () => {
    const gid = Cookies.get("hatake_gid");
    if (!gid) { router.replace("/dashboard"); return; }

    try {
      // Get group detail to find all fields
      const groupRes = await api.get<{
        group: { name: string };
        fields: Field[];
      }>(`/api/v1/groups/${gid}`);

      const { group, fields } = groupRes.data;
      setGroupName(group.name);

      // Fetch logs for all fields in parallel
      const results = await Promise.all(
        fields.map((f) =>
          api
            .get<{ field_logs: FieldLog[] }>(`/api/v1/field_logs?field_id=${f.id}`)
            .then((res) =>
              res.data.field_logs.map((log) => ({
                ...log,
                field_name: f.name,
              }))
            )
            .catch(() => [] as LogEntry[])
        )
      );

      const all = results
        .flat()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      setLogs(all);
    } catch {
      Cookies.remove("hatake_gid");
      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

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

  return (
    <div className="min-h-screen bg-[#f5f2ed] flex flex-col">
      {/* Header */}
      <header className="bg-[#1c2e1a] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard/fields" className="text-green-300 hover:text-white text-sm">
          ← 圃場一覧
        </Link>
        <h1 className="text-base font-bold">
          {groupName} の更新履歴
        </h1>
      </header>

      <main className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full">
        {logs.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <p className="text-2xl mb-2">📋</p>
            <p>更新履歴がまだありません</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#d6e4d0]" />

            <div className="space-y-4">
              {logs.map((log, i) => {
                const cfg = STATUS_CONFIG[log.status ?? "unknown"];
                return (
                  <div key={`${log.id}-${i}`} className="flex gap-4">
                    {/* Dot */}
                    <div className="flex-shrink-0 w-10 flex justify-center pt-1">
                      <span className={`w-3 h-3 rounded-full border-2 border-white shadow ${cfg.dot}`} />
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-100 p-4 space-y-2 mb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm text-[#1c2e1a]">
                            {log.field_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {log.user?.name ?? "不明"} が更新
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs font-medium ${cfg.text}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {formatElapsed(log.created_at)}
                          </span>
                        </div>
                      </div>

                      {log.tags.length > 0 && (
                        <p className="text-base">{tagEmojis(log.tags)}</p>
                      )}

                      {log.memo && (
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {log.memo}
                        </p>
                      )}

                      {log.photo_urls && log.photo_urls.length > 0 && (
                        <div className="flex gap-2 flex-wrap pt-1">
                          {log.photo_urls.map((url, j) => (
                            <a key={j} href={url} target="_blank" rel="noopener noreferrer">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={url}
                                alt={`写真${j + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
