import { Shield, AlertTriangle, CheckCircle, XCircle, Calendar, Mail, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportData {
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

interface SecurityReportProps {
  data: ReportData;
  score: number;
  onReset: () => void;
}

const SecurityReport = ({ data, score, onReset }: SecurityReportProps) => {
  const getScoreColor = () => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = () => {
    if (score >= 70) return { label: "Buono", color: "bg-success" };
    if (score >= 40) return { label: "Medio", color: "bg-warning" };
    return { label: "Critico", color: "bg-destructive" };
  };

  const getStatusIcon = (value: string) => {
    if (value === 'si') return <CheckCircle className="w-5 h-5 text-success" />;
    if (value === 'parziale') return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <XCircle className="w-5 h-5 text-destructive" />;
  };

  const securityItems = [
    { label: "Firewall Aziendale", value: data.hasFirewall },
    { label: "Backup Regolari", value: data.hasBackup },
    { label: "Antivirus Enterprise", value: data.hasAntivirus },
    { label: "Formazione Cybersecurity", value: data.hasTraining },
    { label: "Autenticazione MFA", value: data.hasMFA },
    { label: "Piano Risposta Incidenti", value: data.hasIncidentPlan },
  ];

  const criticalItems = securityItems.filter(item => item.value === 'no' || item.value === 'non-so');
  const warningItems = securityItems.filter(item => item.value === 'parziale');

  const scoreInfo = getScoreLabel();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Report di Sicurezza</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
          {data.companyName}
        </h2>
        <p className="text-muted-foreground">{data.sector} • {data.employees} dipendenti</p>
      </div>

      {/* Score Card */}
      <div className="glass rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Cyber Security Rating
            </h3>
            <div className="flex items-end gap-2">
              <span className={`font-display text-6xl md:text-7xl font-bold ${getScoreColor()}`}>
                {score}
              </span>
              <span className="text-2xl text-muted-foreground mb-2">/100</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mt-3 ${scoreInfo.color}`}>
              <span className="text-sm font-medium text-primary-foreground">{scoreInfo.label}</span>
            </div>
          </div>

          {/* Score Gauge */}
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${score * 2.51} 251`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className={`w-12 h-12 ${getScoreColor()}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Security Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {securityItems.map((item, index) => (
          <div key={index} className="glass rounded-xl p-4 flex items-center justify-between">
            <span className="text-foreground">{item.label}</span>
            {getStatusIcon(item.value)}
          </div>
        ))}
      </div>

      {/* Critical Issues */}
      {criticalItems.length > 0 && (
        <div className="glass rounded-2xl p-6 mb-6 border-destructive/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-destructive">
                Criticità Rilevate ({criticalItems.length})
              </h3>
              <p className="text-sm text-muted-foreground">Interventi urgenti consigliati</p>
            </div>
          </div>
          <ul className="space-y-2">
            {criticalItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warningItems.length > 0 && (
        <div className="glass rounded-2xl p-6 mb-8 border-warning/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-warning">
                Aree di Miglioramento ({warningItems.length})
              </h3>
              <p className="text-sm text-muted-foreground">Ottimizzazioni consigliate</p>
            </div>
          </div>
          <ul className="space-y-2">
            {warningItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Section */}
      <div className="glass rounded-2xl p-8 text-center">
        <h3 className="font-display text-2xl font-bold mb-3">
          Vuoi migliorare il tuo punteggio?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          I nostri esperti possono aiutarti a risolvere le criticità e implementare le migliori pratiche di sicurezza per la tua azienda.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="cta" size="xl" asChild>
            <a href="https://cal.com/frattis63" target="_blank" rel="noopener noreferrer">
              <Calendar className="w-5 h-5 mr-2" />
              Prenota Consulenza Gratuita
            </a>
          </Button>
          <Button variant="glass" size="lg" asChild>
            <a href={`mailto:fattisano@omegagruppo.it?subject=Report Sicurezza ${data.companyName}&body=Salve, ho completato la valutazione CyberShield e vorrei maggiori informazioni.`}>
              <Mail className="w-4 h-4 mr-2" />
              Contattaci via Email
            </a>
          </Button>
        </div>
      </div>

      {/* Reset */}
      <div className="text-center mt-8">
        <Button variant="ghost" onClick={onReset}>
          Esegui una nuova valutazione
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SecurityReport;
