'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { MAIN_NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll for transparent/solid navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
        isScrolled || !isHomePage
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group/logo">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover/logo:scale-110',
                isScrolled || !isHomePage
                  ? 'bg-luxus-gold'
                  : 'bg-white'
              )}
            >
              <span
                className={cn(
                  'text-xl font-bold',
                  isScrolled || !isHomePage
                    ? 'text-white'
                    : 'text-luxus-gold'
                )}
              >
                R
              </span>
            </div>
            <span
              className={cn(
                'text-xl font-bold hidden sm:block transition-colors duration-300',
                isScrolled || !isHomePage
                  ? 'text-luxus-dark group-hover/logo:text-luxus-gold'
                  : 'text-white group-hover/logo:text-luxus-gold-light'
              )}
            >
              REDBOT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {MAIN_NAV_ITEMS.map((item) =>
              item.children ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors',
                        isScrolled || !isHomePage
                          ? 'text-luxus-dark hover:text-luxus-gold'
                          : 'text-white hover:text-luxus-gold-light'
                      )}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[180px]">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link
                          href={child.href}
                          className="w-full cursor-pointer"
                        >
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors duration-300',
                    'after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-luxus-gold',
                    'after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100',
                    pathname === item.href
                      ? 'text-luxus-gold after:scale-x-100'
                      : isScrolled || !isHomePage
                      ? 'text-luxus-dark hover:text-luxus-gold'
                      : 'text-white hover:text-luxus-gold-light'
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* CTA Button + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="hidden sm:flex bg-luxus-gold hover:bg-luxus-gold-dark text-white"
            >
              <Link href="/contacto">Comenzar</Link>
            </Button>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'lg:hidden',
                    isScrolled || !isHomePage
                      ? 'text-luxus-dark'
                      : 'text-white'
                  )}
                >
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between py-4 border-b">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-full bg-luxus-gold flex items-center justify-center">
                        <span className="text-xl font-bold text-white">R</span>
                      </div>
                      <span className="text-xl font-bold text-luxus-dark">
                        REDBOT
                      </span>
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="w-5 h-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Menu Items */}
                  <nav className="flex-1 py-6">
                    <ul className="space-y-1">
                      {MAIN_NAV_ITEMS.map((item) => (
                        <li key={item.label}>
                          {item.children ? (
                            <div className="space-y-1">
                              <span className="block px-4 py-2 text-sm font-medium text-luxus-gray">
                                {item.label}
                              </span>
                              <ul className="pl-4 space-y-1">
                                {item.children.map((child) => (
                                  <li key={child.href}>
                                    <Link
                                      href={child.href}
                                      className={cn(
                                        'block px-4 py-2 text-sm rounded-md transition-colors',
                                        pathname === child.href
                                          ? 'bg-luxus-cream text-luxus-gold font-medium'
                                          : 'text-luxus-dark hover:bg-luxus-cream'
                                      )}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <Link
                              href={item.href}
                              className={cn(
                                'block px-4 py-3 text-base font-medium rounded-md transition-colors',
                                pathname === item.href
                                  ? 'bg-luxus-cream text-luxus-gold'
                                  : 'text-luxus-dark hover:bg-luxus-cream'
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* Mobile Menu Footer */}
                  <div className="border-t pt-4 pb-6">
                    <Button
                      asChild
                      className="w-full bg-luxus-gold hover:bg-luxus-gold-dark text-white"
                    >
                      <Link
                        href="/contacto"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Comenzar
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
