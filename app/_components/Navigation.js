"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navList = [
  { href: "/cabins", name: "Cabins" },
  { href: "/about", name: "About" },
];

export default function Navigation({ children }) {
  const pathname = usePathname();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        {navList.map((nav) => {
          const isActive =
            pathname === nav.href || pathname?.startsWith(nav.href + "/");
          return (
            <li key={nav.href}>
              <Link
                href={nav.href}
                aria-disabled={isActive}
                className={`hover:text-accent-400 transition-colors ${
                  isActive ? "text-accent-400" : ""
                }`}
              >
                {nav.name}
              </Link>
            </li>
          );
        })}
        {/* display guest area... */}
        <li key="/account">
          <Link
            href="/account"
            aria-disabled={
              pathname === "/account" || pathname?.startsWith("/account" + "/")
            }
            className={`hover:text-accent-400 transition-colors flex items-center gap-2 ${
              pathname === "/account" || pathname?.startsWith("/account" + "/")
                ? "text-accent-400 cursor-default pointer-events-none"
                : ""
            }`}
          >
            {/* ...with user-avatar if auth_ed */}
            {children}
            <span>Guest area</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
