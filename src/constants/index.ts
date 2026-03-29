import type { TagType, StatusType } from "@/types";

export const TAGS: { id: TagType; emoji: string; label: string }[] = [
  { id: "bug",     emoji: "🐛", label: "害虫" },
  { id: "disease", emoji: "🍂", label: "病気" },
  { id: "water",   emoji: "💧", label: "水分" },
  { id: "growth",  emoji: "🌱", label: "生育" },
  { id: "work",    emoji: "🔧", label: "作業" },
  { id: "machine", emoji: "🚜", label: "機械" },
];

export const STATUS: Record<
  StatusType,
  { label: string; color: string; bg: string; dot: string }
> = {
  good: {
    label: "良好",
    color: "text-green-700",
    bg: "bg-green-50",
    dot: "bg-green-500",
  },
  caution: {
    label: "注意",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    dot: "bg-yellow-400",
  },
  urgent: {
    label: "緊急",
    color: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-500",
  },
  unknown: {
    label: "未記録",
    color: "text-gray-500",
    bg: "bg-gray-50",
    dot: "bg-gray-300",
  },
};
