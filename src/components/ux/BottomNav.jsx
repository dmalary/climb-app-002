"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  House,
  Share2,
  SquarePlus,
  ChartNoAxesCombined,
  UserRoundPen,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const { userId } = useAuth();

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  const profileHref = userId ? `/profile/${userId}` : "/";

  const items = [
    { href: "/", icon: House },
    { href: "/social", icon: Share2 },
    { href: "/import", icon: SquarePlus, primary: true },
    { href: "/analytics", icon: ChartNoAxesCombined },
    { href: profileHref, icon: UserRoundPen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-800 bg-stone-900">
      <div className="max-w-lg mx-auto h-16 flex items-center justify-around">

        {items.map(({ href, icon: Icon, primary }) => {
          const active = isActive(href);

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center justify-center w-12 h-12 rounded-full
                transition
                ${primary
                  ? "bg-white text-black -mt-6 shadow-lg"
                  : active
                  ? "text-white"
                  : "text-stone-400"}
              `}
            >
              <Icon size={primary ? 28 : 22} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
