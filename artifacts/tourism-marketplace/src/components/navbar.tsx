import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/api";
import { Plane, Menu, User as UserIcon, LogOut, Heart, LayoutDashboard, Settings, Sun, Moon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return [isDark, setIsDark] as const;
}

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/programs", label: "Explore Tours" },
    { href: "/companies", label: "Companies" },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
          <Plane className="w-5 h-5 text-primary" />
          <span className="text-foreground">TRIP</span><span className="text-primary">PICK</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setIsDark(d => !d)}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-medium">Log in</Button>
              </Link>
              <Link href="/register">
                <Button className="text-sm font-medium rounded-full">Sign up</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={getImageUrl(user.profile_image) || undefined} alt={user.first_name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="w-[200px] truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />

                {user.role === 'admin' && (
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                )}

                {user.role === 'company' && (
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Company Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                )}

                {user.role === 'tourist' && (
                  <>
                    <Link href="/favorites">
                      <DropdownMenuItem className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>My Favorites</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}

                {(user.role === 'admin' || user.role === 'company') && (
                  <Link href="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                  </Link>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground"
            onClick={() => setIsDark(d => !d)}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full mt-6">
                <Link href="/" onClick={closeMenu} className="flex items-center gap-2 font-black text-xl tracking-tight mb-6">
                  <Plane className="w-5 h-5 text-primary" />
                  <span className="text-foreground">TRIP</span><span className="text-primary">PICK</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        location === link.href ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto border-t pt-6 pb-6">
                  {!user ? (
                    <div className="flex flex-col gap-3">
                      <Link href="/login" onClick={closeMenu}>
                        <Button variant="outline" className="w-full justify-start">Log in</Button>
                      </Link>
                      <Link href="/register" onClick={closeMenu}>
                        <Button className="w-full justify-start">Sign up</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-10 w-10 border border-border">
                          <AvatarImage src={getImageUrl(user.profile_image) || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{user.first_name} {user.last_name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {user.role === 'admin' && (
                          <Link href="/admin" onClick={closeMenu} className="flex items-center py-2 text-sm text-muted-foreground hover:text-foreground">
                            <LayoutDashboard className="mr-3 h-4 w-4" /> Admin Dashboard
                          </Link>
                        )}
                        {user.role === 'company' && (
                          <Link href="/dashboard" onClick={closeMenu} className="flex items-center py-2 text-sm text-muted-foreground hover:text-foreground">
                            <LayoutDashboard className="mr-3 h-4 w-4" /> Company Dashboard
                          </Link>
                        )}
                        {user.role === 'tourist' && (
                          <Link href="/favorites" onClick={closeMenu} className="flex items-center py-2 text-sm text-muted-foreground hover:text-foreground">
                            <Heart className="mr-3 h-4 w-4" /> My Favorites
                          </Link>
                        )}
                        <Link href="/profile" onClick={closeMenu} className="flex items-center py-2 text-sm text-muted-foreground hover:text-foreground">
                          <Settings className="mr-3 h-4 w-4" /> Account Settings
                        </Link>
                        <button onClick={() => { closeMenu(); handleLogout(); }} className="flex items-center py-2 text-sm text-destructive mt-2">
                          <LogOut className="mr-3 h-4 w-4" /> Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
