import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              <div className="absolute inset-0 blur-lg bg-primary/30" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl text-gradient">
                CyberShield
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground tracking-wider">
                by Omegalab
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#come-funziona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Come Funziona
            </a>
            <a href="#dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#valutazione" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Valutazione
            </a>
            <a href="#contatti" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contatti
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="hero" size="lg" asChild>
              <a href="https://cal.com/frattis63" target="_blank" rel="noopener noreferrer">
                Prenota Consulenza
              </a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a 
                href="#come-funziona" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Come Funziona
              </a>
              <a 
                href="#dashboard" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </a>
              <a 
                href="#valutazione" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Valutazione
              </a>
              <a 
                href="#contatti" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contatti
              </a>
              <Button variant="hero" size="lg" asChild className="mt-2">
                <a href="https://cal.com/frattis63" target="_blank" rel="noopener noreferrer">
                  Prenota Consulenza
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
