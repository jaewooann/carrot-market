import Link from "next/link";

interface FloatingButtonProps {
  children: React.ReactNode;
  href: string;
}

export default function FloatingButton({
  children,
  href,
}: FloatingButtonProps): JSX.Element {
  return (
    <Link href={href}>
      <div className="fixed hover:bg-orange-500 transition-colors cursor-pointer bottom-24 right-5 shadow-xl bg-orange-400 rounded-full border-transparent p-4 text-white">
        {children}
      </div>
    </Link>
  );
}
