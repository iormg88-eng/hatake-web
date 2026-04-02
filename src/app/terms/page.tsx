import Link from "next/link";

export const metadata = { title: "利用規約 | hatake" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f5f2ed] px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#d6e4d0] p-8 space-y-8">
        <h1 className="text-xl font-bold text-[#1c2e1a]">利用規約</h1>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">1. 適用</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本規約は、hatake（以下「本サービス」）の利用条件を定めるものです。
            ユーザーは本規約に同意した上でご利用ください。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">2. 禁止事項</h2>
          <p className="text-sm text-gray-600 leading-relaxed">ユーザーは以下の行為を行ってはなりません。</p>
          <ul className="text-sm text-gray-600 leading-relaxed list-disc list-inside space-y-1">
            <li>法令または公序良俗に違反する行為</li>
            <li>他のユーザーまたは第三者の権利を侵害する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>不正アクセスやリバースエンジニアリング</li>
            <li>虚偽の情報を登録する行為</li>
            <li>その他、運営が不適切と判断する行為</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">3. 免責事項</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本サービスは現状有姿で提供されます。運営は本サービスの継続性・正確性・完全性を保証しません。
            本サービスの利用によって生じた損害について、運営は一切の責任を負いません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">4. サービスの変更・停止</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            運営は事前の通知なく、本サービスの内容変更・機能追加・停止を行う場合があります。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">5. アカウントの管理</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            ユーザーはアカウント情報（メールアドレス・パスワード）を自己の責任で管理してください。
            アカウントの不正利用により生じた損害について、運営は責任を負いません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">6. 知的財産権</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本サービスに関する著作権その他の知的財産権は運営に帰属します。
            ユーザーが投稿したコンテンツの権利はユーザーに帰属しますが、
            サービス改善目的での利用を許諾するものとします。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">7. 規約の変更</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            運営は必要に応じて本規約を変更できます。変更後も本サービスを継続利用した場合、
            変更後の規約に同意したものとみなします。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">8. 準拠法・管轄裁判所</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本規約は日本法に準拠します。本サービスに関する紛争については、
            運営の所在地を管轄する裁判所を専属的合意管轄とします。
          </p>
        </section>

        <p className="text-xs text-gray-400">制定日：2025年1月1日</p>

        <Link href="/" className="block text-sm text-[#4a7c59] hover:underline">
          ← トップへ戻る
        </Link>
      </div>
    </div>
  );
}
