"use client";

import { Brain, LogOut, Menu, X, LayoutDashboard, Home } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {showBackButton ? (
            <Link href={backHref} className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              </div>
              <span className="text-white font-bold tracking-tight text-lg sm:text-xl">Re-vision</span>
            </Link>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              </div>
              <span className="text-white font-bold tracking-tight text-lg sm:text-xl">Re-vision</span>
            </Link>
          )}
        </motion.div>

        {/* Desktop nav */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden sm:flex items-center gap-3 sm:gap-4"
        >
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-white/5 transition-colors">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border border-white/10">
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback className="bg-white text-slate-950 font-semibold text-sm sm:text-base">
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
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 text-sm sm:text-base font-medium h-10 sm:h-11 px-4 sm:px-6">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-white text-slate-950 hover:bg-slate-100 text-sm sm:text-base font-semibold h-10 sm:h-11 px-5 sm:px-7 rounded-xl">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        {/* Mobile menu button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sm:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[57px] z-40 sm:hidden bg-black/95 backdrop-blur-2xl border-b border-white/5"
          >
            <div className="flex flex-col p-4 gap-2">
              {user ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={user.imageUrl} alt={user.name} />
                      <AvatarFallback className="bg-white text-slate-950 font-semibold">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 text-base font-medium h-12 gap-3">
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-500/10 text-base font-medium h-12 gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center text-slate-400 hover:text-white hover:bg-white/5 text-base font-medium h-12">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 text-base font-semibold h-12 rounded-xl">
                      Get started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SimpleNavbar({ showBack = false, backHref = "/dashboard" }: { showBack?: boolean; backHref?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 sm:py-4 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={showBack ? backHref : "/dashboard"} className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
            </div>
            <span className="text-white font-bold tracking-tight text-lg sm:text-xl">Re-vision</span>
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden sm:block"
        >
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 text-sm sm:text-base font-medium h-10 sm:h-11 px-4 sm:px-6">
              Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Mobile menu button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="sm:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[57px] z-40 sm:hidden bg-black/95 backdrop-blur-2xl border-b border-white/5"
          >
            <div className="flex flex-col p-4 gap-2">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 text-base font-medium h-12 gap-3">
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
