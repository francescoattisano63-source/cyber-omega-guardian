import { useState } from "react";
import { Building, Mail, User, Globe, Server, Shield, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  companyName: string;
  sector: string;
  employees: string;
  email: string;
  contactName: string;
  website: string;
  hasFirewall: string;
  hasBackup: string;
  hasAntivirus: string;
  hasTraining: string;
  hasMFA: string;
  hasIncidentPlan: string;
}

interface AssessmentFormProps {
  onComplete: (data: FormData, score: number) => void;
}

const AssessmentForm = ({ onComplete }: AssessmentFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    sector: "",
    employees: "",
    email: "",
    contactName: "",
    website: "",
    hasFirewall: "",
    hasBackup: "",
    hasAntivirus: "",
    hasTraining: "",
    hasMFA: "",
    hasIncidentPlan: ""
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateScore = () => {
    let score = 0;
    const securityFields = ['hasFirewall', 'hasBackup', 'hasAntivirus', 'hasTraining', 'hasMFA', 'hasIncidentPlan'];
    
    securityFields.forEach(field => {
      const value = formData[field as keyof FormData];
      if (value === 'si') score += 15;
      else if (value === 'parziale') score += 8;
    });

    // Add some base score based on company size
    if (formData.employees === '1-10') score += 5;
    else if (formData.employees === '11-50') score += 8;
    else if (formData.employees === '51-200') score += 10;
    else if (formData.employees === '200+') score += 10;

    return Math.min(score, 100);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const score = calculateScore();
    
    toast({
      title: "Analisi Completata!",
      description: "Il tuo report di sicurezza è pronto.",
    });

    setIsLoading(false);
    onComplete(formData, score);
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.companyName && formData.sector && formData.employees;
    }
    if (step === 2) {
      return formData.email && formData.contactName;
    }
    if (step === 3) {
      return formData.hasFirewall && formData.hasBackup && formData.hasAntivirus;
    }
    return formData.hasTraining && formData.hasMFA && formData.hasIncidentPlan;
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center">
            <div 
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-gradient-primary' : 'bg-muted'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Step 1: Company Info */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Building className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Dati Aziendali</h3>
              <p className="text-sm text-muted-foreground">Informazioni sulla tua organizzazione</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Nome Azienda *</Label>
              <Input
                id="companyName"
                placeholder="Es. Acme S.r.l."
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="sector">Settore *</Label>
              <Select value={formData.sector} onValueChange={(v) => updateField('sector', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleziona settore" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manifatturiero">Manifatturiero</SelectItem>
                  <SelectItem value="servizi">Servizi</SelectItem>
                  <SelectItem value="commercio">Commercio</SelectItem>
                  <SelectItem value="sanitario">Sanitario</SelectItem>
                  <SelectItem value="finanziario">Finanziario</SelectItem>
                  <SelectItem value="tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="employees">Numero Dipendenti *</Label>
              <Select value={formData.employees} onValueChange={(v) => updateField('employees', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleziona range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10</SelectItem>
                  <SelectItem value="11-50">11-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="200+">Oltre 200</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="website">Sito Web (opzionale)</Label>
              <div className="relative mt-1.5">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="website"
                  placeholder="https://www.esempio.it"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Contatto</h3>
              <p className="text-sm text-muted-foreground">I tuoi dati per ricevere il report</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="contactName">Nome e Cognome *</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="contactName"
                  placeholder="Mario Rossi"
                  value={formData.contactName}
                  onChange={(e) => updateField('contactName', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="mario.rossi@azienda.it"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Security Assessment Part 1 */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Server className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Infrastruttura</h3>
              <p className="text-sm text-muted-foreground">Sistemi di protezione base</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Avete un Firewall aziendale? *</Label>
              <Select value={formData.hasFirewall} onValueChange={(v) => updateField('hasFirewall', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleziona risposta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sì, configurato e aggiornato</SelectItem>
                  <SelectItem value="parziale">Sì, ma non aggiornato</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="non-so">Non so</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Effettuate backup regolari? *</Label>
              <Select value={formData.hasBackup} onValueChange={(v) => updateField('hasBackup', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleziona risposta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sì, giornalieri e verificati</SelectItem>
                  <SelectItem value="parziale">Sì, ma non regolarmente</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="non-so">Non so</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Avete un antivirus aziendale? *</Label>
              <Select value={formData.hasAntivirus} onValueChange={(v) => updateField('hasAntivirus', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleziona risposta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sì, con licenza enterprise</SelectItem>
                  <SelectItem value="parziale">Sì, versione gratuita</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="non-so">Non so</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Security Assessment Part 2 */}
      {step === 4 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Policy e Formazione</h3>
              <p className="text-sm text-muted-foreground">Procedure di sicurezza</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Formazione cybersecurity per i dipendenti? *</Label>
              <Select value={formData.hasTraining} onValueChange={(v) => updateField('hasTraining', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleziona risposta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sì, periodica</SelectItem>
                  <SelectItem value="parziale">Solo all'assunzione</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="non-so">Non so</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Utilizzate l'autenticazione a due fattori (MFA)? *</Label>
              <Select value={formData.hasMFA} onValueChange={(v) => updateField('hasMFA', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleziona risposta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sì, su tutti i sistemi critici</SelectItem>
                  <SelectItem value="parziale">Solo su alcuni sistemi</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="non-so">Non so</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Avete un piano di risposta agli incidenti? *</Label>
              <Select value={formData.hasIncidentPlan} onValueChange={(v) => updateField('hasIncidentPlan', v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Seleziona risposta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sì, documentato e testato</SelectItem>
                  <SelectItem value="parziale">Sì, ma non testato</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="non-so">Non so</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setStep(s => s - 1)}
          disabled={step === 1}
        >
          Indietro
        </Button>

        {step < 4 ? (
          <Button
            variant="hero"
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
          >
            Continua
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            variant="hero"
            onClick={handleSubmit}
            disabled={!canProceed() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analisi in corso...
              </>
            ) : (
              <>
                Genera Report
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssessmentForm;
