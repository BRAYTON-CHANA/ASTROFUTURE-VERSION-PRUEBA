'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket } from 'lucide-react';

const navLinks = [
  { href: '/explorer', label: 'Explorer' },
  { href: '/simulation', label: 'Simulation' },
  { href: '/cuestionario', label: 'Quiz' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 md:px-6 bg-secondary text-secondary-foreground shadow-md">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <Rocket className="h-6 w-6" />
        <span className="hidden sm:inline-block">AstroFuture</span>
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-sm font-semibold transition-colors hover:text-secondary-foreground/80',
              pathname === link.href ? 'text-secondary-foreground' : 'text-secondary-foreground'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-secondary/95 text-secondary-foreground w-[250px]">
            <div className="flex flex-col p-6">
                <Link href="/" className="flex items-center gap-2 mb-8">
                    <Rocket className="h-6 w-6" />
                    <span className="font-semibold">AstroFuture</span>
                </Link>
                <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            'text-lg font-semibold transition-colors hover:text-secondary-foreground/80',
                            pathname === link.href ? 'text-secondary-foreground' : 'text-secondary-foreground'
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
                </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
