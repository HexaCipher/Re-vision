"use client";

import { Brain, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    imageUrl: string;
  };
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function Navbar({ user, showBackButton, backHref = "/dashboard", backLabel = "Back" }: NavbarProps) {
  const { signOut } = useClerk();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 lg:px-10 py-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        {showBackButton ? (
          <Link href={backHref} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <Brain className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold tracking-tight text-xl">Re-vision</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <Brain className="w-5 h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold tracking-tight text-xl">Re-vision</span>
          </Link>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-4"
      >
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/5 transition-colors">
                <Avatar className="h-10 w-10 border border-white/10">
                  <AvatarImage src={user.imageUrl} alt={user.name} />
                  <AvatarFallback className="bg-white text-slate-950 font-semibold">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 border-white/10 backdrop-blur-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem 
                onClick={() => signOut()} 
                className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/sign-in">
              <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 text-base font-medium h-11 px-6">
                Sign in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-white text-slate-950 hover:bg-slate-100 text-base font-semibold h-11 px-7 rounded-xl">
                Get started
              </Button>
            </Link>
          </>
        )}
      </motion.div>
    </nav>
  );
}

export function SimpleNavbar({ showBack = false, backHref = "/dashboard" }: { showBack?: boolean; backHref?: string }) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 lg:px-10 py-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href={showBack ? backHref : "/dashboard"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
            <Brain className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-white font-bold tracking-tight text-xl">Re-vision</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link href="/dashboard">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 text-base font-medium h-11 px-6">
            Dashboard
          </Button>
        </Link>
      </motion.div>
    </nav>
  );
}
