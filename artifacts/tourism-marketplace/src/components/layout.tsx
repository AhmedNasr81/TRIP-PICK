import { Navbar } from "./navbar";
import { Link } from "wouter";
import { Plane } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 font-black text-xl tracking-tight mb-3">
                <Plane className="w-5 h-5 text-primary" />
                <span className="text-foreground">TRIP</span><span className="text-primary">PICK</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover curated tours from trusted travel companies around the world.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">Explore</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/programs" className="hover:text-primary transition-colors">Browse Tours</Link></li>
                <li><Link href="/companies" className="hover:text-primary transition-colors">Travel Companies</Link></li>
                <li><Link href="/programs?sort_by=rate&order=desc" className="hover:text-primary transition-colors">Top Rated</Link></li>
                <li><Link href="/programs?sort_by=price&order=asc" className="hover:text-primary transition-colors">Best Value</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">For Companies</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/register" className="hover:text-primary transition-colors">List Your Tours</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Company Dashboard</Link></li>
                <li><Link href="/company-setup" className="hover:text-primary transition-colors">Setup Profile</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">Account</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-primary transition-colors">Log In</Link></li>
                <li><Link href="/register" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link href="/favorites" className="hover:text-primary transition-colors">My Favorites</Link></li>
                <li><Link href="/profile" className="hover:text-primary transition-colors">Profile Settings</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} TRIP PICK. All rights reserved.</p>
            <p className="text-xs">Built for adventurers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
