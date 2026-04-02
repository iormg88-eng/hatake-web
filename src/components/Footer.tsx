import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto py-6 px-4 border-t border-[#d6e4d0] bg-[#f5f2ed]">
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#4a7c59]">
        <Link href="/privacy" className="hover:underline">プライバシーポリシー</Link>
        <Link href="/legal" className="hover:underline">特定商取引法に基づく表記</Link>
        <Link href="/terms" className="hover:underline">利用規約</Link>
        <a
          href="https://forms.gle/aDRFnKnU4wJPHBs28"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          お問い合わせ
        </a>
      </nav>
      <p className="text-center text-xs text-gray-400 mt-3">© 2025 hatake</p>
    </footer>
  );
}
