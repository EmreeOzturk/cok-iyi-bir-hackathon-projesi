"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CpuChipIcon, HomeIcon, ShoppingBagIcon, WalletIcon } from "@heroicons/react/24/outline";
import { WalletConnection } from "./wallet-connection";
import { useWalletStore } from "@/stores/use-wallet-store";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Marketplace", href: "/service-marketplace", icon: ShoppingBagIcon },
  { name: "Dashboard", href: "/agent-dashboard", icon: CpuChipIcon },
  { name: "Wallet", href: "/wallet-controls", icon: WalletIcon },
];

export function Header() {
  const pathname = usePathname();
  const { connectedAccount } = useWalletStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <CpuChipIcon className="h-6 w-6" />
          </div>
          <span className="hidden sm:inline-block">SuiPay Agent</span>
        </Link>

        {/* Navigation */}
        <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
          {connectedAccount && navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connection */}
        <div className="ml-auto">
          <WalletConnection />
        </div>
      </div>
    </header>
  );
}
