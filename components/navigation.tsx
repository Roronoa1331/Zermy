"use client";

import Link from "next/link";
import { ShoppingCart, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const user = await response.json();
        
        if (response.ok) {
          setIsLoggedIn(true);
          setUserName(user.name);
          setUserRole(user.role);
          // Store user data in localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
          setIsLoggedIn(false);
          setUserName('');
          setUserRole('');
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
        setUserName('');
        setUserRole('');
        localStorage.removeItem('currentUser');
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.removeItem("currentUser");
        setIsLoggedIn(false);
        setUserName("");
        setUserRole("");
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-semibold font-montserrat">
          ZERMY
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-accent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`${
              pathname === "/" ? "font-semibold" : "text-muted-foreground"
            }`}
          >
            Əsas
          </Link>
          <Link
            href="/products"
            className={`${
              pathname === "/products" ? "font-semibold" : "text-muted-foreground"
            }`}
          >
            Məhsullar
          </Link>
          <Link
            href="/contacts"
            className={`${
              pathname === "/contacts" ? "font-semibold" : "text-muted-foreground"
            }`}
          >
            Əlaqə
          </Link>
          {!isLoggedIn && (
            <Link
              href="/auth/seller/register"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Satıcı ol
            </Link>
          )}
          {isLoggedIn && userRole === "seller" && (
            <Link
              href="/seller"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
            >
              Satıcı panel
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="relative p-2 hover:bg-accent rounded-full">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  <span>{userName}</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="ghost" size="icon">
              <Link href="/auth">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="flex flex-col items-start space-y-4 p-4">
            <Link
              href="/"
              className={`${
                pathname === "/" ? "font-semibold" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Əsas
            </Link>
            <Link
              href="/products"
              className={`${
                pathname === "/products" ? "font-semibold" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Məhsullar
            </Link>
            <Link
              href="/contacts"
              className={`${
                pathname === "/contacts" ? "font-semibold" : "text-muted-foreground"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Əlaqə
            </Link>
            {!isLoggedIn && (
              <Link
                href="/auth/seller/register"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Satıcı ol
              </Link>
            )}
            {isLoggedIn && userRole === "seller" && (
              <Link
                href="/seller"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Satıcı panel
              </Link>
            )}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-accent rounded-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            {isLoggedIn ? (
              <div className="flex flex-col items-start space-y-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    <span>{userName}</span>
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="ghost" size="icon">
                <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

