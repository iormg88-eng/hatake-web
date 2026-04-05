import Link from "next/link";

export const metadata = { title: "プライバシーポリシー | hatake" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f5f2ed] px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#d6e4d0] p-8 space-y-8">
        <h1 className="text-xl font-bold text-[#1c2e1a]">プライバシーポリシー</h1>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">1. はじめに</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            hatake（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
            本ポリシーは、本サービスが収集・利用する情報について説明します。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">2. 収集する情報</h2>
          <ul className="text-sm text-gray-600 leading-relaxed list-disc list-inside space-y-1">
            <li>メールアドレス・パスワード（アカウント登録時）</li>
            <li>圃場名・作業記録・添付写真などの入力情報</li>
            <li>アクセスログ（IPアドレス、ブラウザ情報等）</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">3. 利用目的</h2>
          <ul className="text-sm text-gray-600 leading-relaxed list-disc list-inside space-y-1">
            <li>本サービスの提供・運営・改善</li>
            <li>ユーザーへのお問い合わせ対応</li>
            <li>不正利用の検知・防止</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">4. 第三者提供</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。
            ただし、サービス運営のため以下の外部サービスを利用しています。
          </p>
          <ul className="text-sm text-gray-600 leading-relaxed list-disc list-inside space-y-1">
            <li>Amazon Web Services（写真ファイルの保存）</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">5. データの保管</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            収集した情報はアカウント削除時に速やかに削除します。ただし法令上の保存義務がある場合はこの限りではありません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold text-[#1c2e1a]">6. お問い合わせ</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            本ポリシーに関するお問い合わせは
            <a
              href="https://forms.gle/aDRFnKnU4wJPHBs28"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4a7c59] underline mx-1"
            >
              お問い合わせフォーム
            </a>
            よりお寄せください。
          </p>
        </section>

        <p className="text-xs text-gray-400">制定日：2026年4月1日</p>

        <Link href="/" className="block text-sm text-[#4a7c59] hover:underline">
          ← トップへ戻る
        </Link>
      </div>
    </div>
  );
}
