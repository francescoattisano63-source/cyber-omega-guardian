import { Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroShield from "@/assets/hero-shield.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroShield} 
          alt="Cyber Security Shield" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Powered by Omegalab Technology</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Il tuo Rischio Cyber</span>
            <br />
            <span className="text-gradient">Sotto Controllo</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Analisi completa della sicurezza informatica della tua azienda. 
            Scopri vulnerabilità, ottieni un rating di sicurezza e un piano d'azione personalizzato.
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {[
              "Analisi in 5 minuti",
              "Rating 0-100",
              "Report dettagliato"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#valutazione">
                Inizia Valutazione Gratuita
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <a href="https://cal.com/frattis63" target="_blank" rel="noopener noreferrer">
                Prenota una Demo
              </a>
            </Button>
          </div>

          {/* Trust Indicator */}
          <p className="mt-8 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            Affidato da oltre 100+ aziende italiane
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
