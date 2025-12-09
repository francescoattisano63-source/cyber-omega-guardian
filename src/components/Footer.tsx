import { Shield, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer id="contatti" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Shield className="w-10 h-10 text-primary" />
                <div className="absolute inset-0 blur-lg bg-primary/30" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-gradient">
                  CyberShield
                </span>
                <span className="text-xs text-muted-foreground tracking-wider">
                  by Omegalab
                </span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Piattaforma di Cyber Security Rating che analizza la sicurezza informatica della tua azienda e fornisce un piano d'azione per proteggerti dalle minacce.
            </p>
            <Button variant="cta" size="lg" asChild>
              <a href="https://cal.com/frattis63" target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5 mr-2" />
                Prenota una Consulenza
              </a>
            </Button>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Navigazione</h4>
            <ul className="space-y-3">
              <li>
                <a href="#come-funziona" className="text-muted-foreground hover:text-foreground transition-colors">
                  Come Funziona
                </a>
              </li>
              <li>
                <a href="#valutazione" className="text-muted-foreground hover:text-foreground transition-colors">
                  Valutazione Gratuita
                </a>
              </li>
              <li>
                <a href="https://www.omegalab.eu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Omegalab.eu
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contatti</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:fattisano@omegagruppo.it" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  fattisano@omegagruppo.it
                </a>
              </li>
              <li>
                <a 
                  href="https://cal.com/frattis63" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  Prenota Appuntamento
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CyberShield by Omegalab. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
