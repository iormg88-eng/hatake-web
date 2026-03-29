"use client";

import { useState } from "react";
import api from "@/lib/api";
import { TAGS } from "@/constants";
import type { Field, StatusType, TagType } from "@/types";

const STATUS_OPTIONS: { value: StatusType; label: string; dot: string; bg: string; border: string }[] = [
  { value: "good",    label: "順調",  dot: "bg-[#4a7c59]", bg: "bg-[#e8f5ee]", border: "border-[#4a7c59]" },
  { value: "caution", label: "要確認", dot: "bg-[#e6a817]", bg: "bg-[#fef9e7]", border: "border-[#e6a817]" },
  { value: "urgent",  label: "緊急",  dot: "bg-[#e74c3c]", bg: "bg-[#fdecea]", border: "border-[#e74c3c]" },
];

type Props = {
  field: Field;
  onClose: () => void;
  onSuccess: () => void;
};

export default function FieldUpdateModal({ field, onClose, onSuccess }: Props) {
  const [status, setStatus] = useState<StatusType>(
    field.latest_log?.status ?? "good"
  );
  const [tags, setTags] = useState<TagType[]>(field.latest_log?.tags ?? []);
  const [memo, setMemo] = useState(field.latest_log?.memo ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleTag(tag: TagType) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/v1/field_logs", {
        field_log: { field_id: field.id, status, memo, tags },
      });
      onSuccess();
    } catch {
      setError("更新に失敗しました。もう一度お試しください");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Handle bar (mobile) */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1c2e1a]">{field.name}</h2>
            {field.latest_log && (
              <p className="text-xs text-gray-400 mt-0.5">
                最終更新: {field.latest_log.updated_by}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Status */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#1c2e1a]">ステータス</p>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`flex items-center gap-2 justify-center rounded-xl py-2.5 text-sm font-medium border-2 transition-all ${
                    status === opt.value
                      ? `${opt.bg} ${opt.border}`
                      : "bg-gray-50 border-transparent text-gray-500"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dot}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#1c2e1a]">タグ（複数可）</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
                    tags.includes(tag.id)
                      ? "bg-[#1c2e1a] text-white border-[#1c2e1a]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <span>{tag.emoji}</span>
                  <span>{tag.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-[#1c2e1a]">メモ</p>
              <span className="text-xs text-gray-400">{memo.length}/120</span>
            </div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value.slice(0, 120))}
              rows={3}
              placeholder="状況や対応内容を記入（任意）"
              className="w-full rounded-xl border border-[#c5d9be] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59] focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c2e1a] hover:bg-[#2a4028] disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            {loading ? "更新中..." : "この状態で更新する"}
          </button>
        </form>
      </div>
    </div>
  );
}
