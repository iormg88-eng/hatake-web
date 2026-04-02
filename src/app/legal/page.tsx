import Link from "next/link";

export const metadata = { title: "特定商取引法に基づく表記 | hatake" };

const items: { label: string; value: string }[] = [
  { label: "販売業者", value: "個人運営" },
  { label: "運営責任者", value: "非公開（お問い合わせにて開示）" },
  { label: "所在地", value: "非公開（お問い合わせにて開示）" },
  { label: "お問い合わせ", value: "お問い合わせフォームよりご連絡ください" },
  { label: "販売価格", value: "無料（現在有料プランなし）" },
  { label: "支払方法", value: "該当なし" },
  { label: "サービス提供時期", value: "登録完了後、即時利用可能" },
  { label: "返品・キャンセル", value: "デジタルサービスのため返品不可。アカウント削除はいつでも可能" },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#f5f2ed] px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#d6e4d0] p-8 space-y-6">
        <h1 className="text-xl font-bold text-[#1c2e1a]">特定商取引法に基づく表記</h1>

        <table className="w-full text-sm border-collapse">
          <tbody>
            {items.map(({ label, value }) => (
              <tr key={label} className="border-t border-[#e8f0e4]">
                <th className="text-left py-3 pr-4 text-[#1c2e1a] font-medium w-40 align-top">
                  {label}
                </th>
                <td className="py-3 text-gray-600 leading-relaxed">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-gray-400">
          ※ 本サービスは現在無料で提供しており、課金機能はございません。
        </p>

        <Link href="/" className="block text-sm text-[#4a7c59] hover:underline">
          ← トップへ戻る
        </Link>
      </div>
    </div>
  );
}
