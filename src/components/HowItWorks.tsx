import { Building, Search, FileText, PhoneCall } from "lucide-react";

const steps = [
  {
    icon: Building,
    title: "Inserisci i Dati Aziendali",
    description: "Compila il modulo con le informazioni sulla tua azienda e la sua infrastruttura IT"
  },
  {
    icon: Search,
    title: "Analisi Automatica",
    description: "Il nostro sistema analizza il perimetro di sicurezza e identifica le vulnerabilità"
  },
  {
    icon: FileText,
    title: "Ricevi il Report",
    description: "Ottieni un rating di sicurezza da 0 a 100 e un report dettagliato delle criticità"
  },
  {
    icon: PhoneCall,
    title: "Consulenza Gratuita",
    description: "Prenota una call con i nostri esperti per un piano d'azione personalizzato"
  }
];

const HowItWorks = () => {
  return (
    <section id="come-funziona" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Il Processo
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
            Come <span className="text-gradient">Funziona</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            In pochi minuti ottieni una visione completa della sicurezza informatica della tua azienda
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="glass p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary">
                      <step.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-card border border-primary text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
