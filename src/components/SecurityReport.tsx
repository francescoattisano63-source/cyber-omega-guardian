import { Shield, AlertTriangle, CheckCircle, XCircle, Calendar, Mail, ArrowRight, Download, Clock, FileText, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

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
  hasRiskManagement: string;
  hasSupplyChainSecurity: string;
  hasIncidentReporting: string;
  hasCryptography: string;
  hasAssetManagement: string;
  hasAccessControl: string;
}

interface SecurityReportProps {
  data: ReportData;
  score: number;
  onReset: () => void;
}

const SecurityReport = ({ data, score, onReset }: SecurityReportProps) => {
  const { toast } = useToast();
  
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

  const getStatusText = (value: string) => {
    if (value === 'si') return 'Conforme';
    if (value === 'parziale') return 'Parziale';
    if (value === 'no') return 'Non conforme';
    return 'Non determinato';
  };

  const securityItems = [
    { label: "Firewall Aziendale", value: data.hasFirewall, category: "infrastruttura" },
    { label: "Backup Regolari", value: data.hasBackup, category: "infrastruttura" },
    { label: "Antivirus Enterprise", value: data.hasAntivirus, category: "infrastruttura" },
    { label: "Formazione Cybersecurity", value: data.hasTraining, category: "governance" },
    { label: "Autenticazione MFA", value: data.hasMFA, category: "accessi" },
    { label: "Piano Risposta Incidenti", value: data.hasIncidentPlan, category: "governance" },
  ];

  const nis2Items = [
    { label: "Gestione del Rischio Cyber", value: data.hasRiskManagement, article: "Art. 21(2)(a)" },
    { label: "Sicurezza Supply Chain", value: data.hasSupplyChainSecurity, article: "Art. 21(2)(d)" },
    { label: "Notifica Incidenti (24/72h)", value: data.hasIncidentReporting, article: "Art. 23" },
    { label: "Crittografia Dati", value: data.hasCryptography, article: "Art. 21(2)(h)" },
    { label: "Inventario Asset IT/OT", value: data.hasAssetManagement, article: "Art. 21(2)(i)" },
    { label: "Controllo Accessi (Least Privilege)", value: data.hasAccessControl, article: "Art. 21(2)(i)" },
  ];

  const criticalItems = [...securityItems, ...nis2Items].filter(item => item.value === 'no' || item.value === 'non-so');
  const warningItems = [...securityItems, ...nis2Items].filter(item => item.value === 'parziale');
  const nis2CriticalCount = nis2Items.filter(item => item.value === 'no' || item.value === 'non-so').length;

  const scoreInfo = getScoreLabel();

  const generatePDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, pageWidth, 50, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("CyberShield Assessment Report", pageWidth / 2, 25, { align: "center" });
    
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${data.companyName} - ${new Date().toLocaleDateString('it-IT')}`, pageWidth / 2, 38, { align: "center" });

    yPos = 65;
    pdf.setTextColor(0, 0, 0);

    // Score Section
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(15, yPos - 5, pageWidth - 30, 35, 5, 5, 'F');
    
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("CYBER SECURITY RATING", 20, yPos + 5);
    
    pdf.setFontSize(32);
    if (score < 40) pdf.setTextColor(220, 38, 38);
    else if (score < 70) pdf.setTextColor(234, 179, 8);
    else pdf.setTextColor(34, 197, 94);
    pdf.text(`${score}/100`, 20, yPos + 25);
    
    pdf.setFontSize(12);
    pdf.text(scoreInfo.label.toUpperCase(), 65, yPos + 25);
    
    pdf.setTextColor(0, 0, 0);
    yPos += 45;

    // Urgency Alert
    if (score < 70) {
      pdf.setFillColor(254, 226, 226);
      pdf.roundedRect(15, yPos - 5, pageWidth - 30, 25, 3, 3, 'F');
      pdf.setTextColor(153, 27, 27);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("⚠️ ATTENZIONE: AZIONE IMMEDIATA RICHIESTA", 20, yPos + 5);
      pdf.setFont("helvetica", "normal");
      pdf.text("La tua organizzazione presenta criticità che richiedono intervento urgente.", 20, yPos + 13);
      pdf.setTextColor(0, 0, 0);
      yPos += 30;
    }

    // Company Info
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("INFORMAZIONI AZIENDA", 20, yPos);
    yPos += 8;
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Azienda: ${data.companyName}`, 20, yPos);
    pdf.text(`Settore: ${data.sector}`, 110, yPos);
    yPos += 6;
    pdf.text(`Dipendenti: ${data.employees}`, 20, yPos);
    pdf.text(`Contatto: ${data.contactName}`, 110, yPos);
    yPos += 6;
    pdf.text(`Email: ${data.email}`, 20, yPos);
    yPos += 15;

    // Security Assessment
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("VALUTAZIONE SICUREZZA BASE", 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    securityItems.forEach(item => {
      pdf.setFont("helvetica", "normal");
      pdf.text(`• ${item.label}:`, 25, yPos);
      
      if (item.value === 'si') {
        pdf.setTextColor(34, 197, 94);
        pdf.text("✓ Conforme", 100, yPos);
      } else if (item.value === 'parziale') {
        pdf.setTextColor(234, 179, 8);
        pdf.text("⚠ Parziale", 100, yPos);
      } else {
        pdf.setTextColor(220, 38, 38);
        pdf.text("✗ Non conforme", 100, yPos);
      }
      pdf.setTextColor(0, 0, 0);
      yPos += 6;
    });

    yPos += 10;

    // NIS2 Compliance Section
    pdf.setFillColor(255, 251, 235);
    pdf.roundedRect(15, yPos - 5, pageWidth - 30, 10, 3, 3, 'F');
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(180, 83, 9);
    pdf.text("CONFORMITÀ NIS2 (Direttiva UE 2022/2555)", 20, yPos + 3);
    pdf.setTextColor(0, 0, 0);
    yPos += 15;

    pdf.setFontSize(10);
    nis2Items.forEach(item => {
      pdf.setFont("helvetica", "normal");
      pdf.text(`• ${item.label} [${item.article}]:`, 25, yPos);
      
      if (item.value === 'si') {
        pdf.setTextColor(34, 197, 94);
        pdf.text("✓ Conforme", 130, yPos);
      } else if (item.value === 'parziale') {
        pdf.setTextColor(234, 179, 8);
        pdf.text("⚠ Parziale", 130, yPos);
      } else {
        pdf.setTextColor(220, 38, 38);
        pdf.text("✗ Non conforme", 130, yPos);
      }
      pdf.setTextColor(0, 0, 0);
      yPos += 6;
    });

    // New page for recommendations
    pdf.addPage();
    yPos = 20;

    // Critical Issues
    if (criticalItems.length > 0) {
      pdf.setFillColor(254, 226, 226);
      pdf.roundedRect(15, yPos - 5, pageWidth - 30, 10, 3, 3, 'F');
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(153, 27, 27);
      pdf.text(`CRITICITÀ RILEVATE (${criticalItems.length})`, 20, yPos + 3);
      yPos += 15;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      criticalItems.forEach(item => {
        pdf.text(`• ${item.label}`, 25, yPos);
        yPos += 6;
      });
      yPos += 10;
    }

    // Warnings
    if (warningItems.length > 0) {
      pdf.setFillColor(254, 249, 195);
      pdf.roundedRect(15, yPos - 5, pageWidth - 30, 10, 3, 3, 'F');
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(161, 98, 7);
      pdf.text(`AREE DI MIGLIORAMENTO (${warningItems.length})`, 20, yPos + 3);
      yPos += 15;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      warningItems.forEach(item => {
        pdf.text(`• ${item.label}`, 25, yPos);
        yPos += 6;
      });
      yPos += 10;
    }

    // Recommendations
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("RACCOMANDAZIONI", 20, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const recommendations = [
      "1. Implementare immediatamente le misure di sicurezza mancanti",
      "2. Avviare un percorso di conformità NIS2 entro 6 mesi",
      "3. Condurre un audit completo della sicurezza IT",
      "4. Formare il personale sulle best practice di cybersecurity",
      "5. Documentare tutte le procedure di sicurezza",
    ];
    recommendations.forEach(rec => {
      pdf.text(rec, 20, yPos);
      yPos += 7;
    });

    yPos += 15;

    // Contact CTA
    pdf.setFillColor(15, 23, 42);
    pdf.roundedRect(15, yPos - 5, pageWidth - 30, 35, 5, 5, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("PRENOTA UNA CONSULENZA GRATUITA", pageWidth / 2, yPos + 8, { align: "center" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Email: fattisano@omegagruppo.it", pageWidth / 2, yPos + 18, { align: "center" });
    pdf.text("Prenota online: cal.com/frattis63", pageWidth / 2, yPos + 26, { align: "center" });

    // Footer
    pdf.setTextColor(128, 128, 128);
    pdf.setFontSize(8);
    pdf.text("Report generato da CyberShield by Omegalab - www.omegalab.eu", pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: "center" });

    // Save
    pdf.save(`CyberShield_Report_${data.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Report Scaricato!",
      description: "Il PDF è stato salvato nella cartella download.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Report di Sicurezza & NIS2 Compliance</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
          {data.companyName}
        </h2>
        <p className="text-muted-foreground">{data.sector} • {data.employees} dipendenti</p>
      </div>

      {/* Urgency Alert */}
      {score < 70 && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-destructive/20 to-warning/20 border border-destructive/50 animate-pulse-glow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/30 flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-destructive mb-2">
                ⚠️ ATTENZIONE: Azione Immediata Richiesta
              </h3>
              <p className="text-muted-foreground mb-3">
                La tua organizzazione presenta <strong className="text-destructive">{criticalItems.length} criticità</strong> che richiedono intervento urgente. 
                {nis2CriticalCount > 0 && (
                  <span> Di queste, <strong className="text-warning">{nis2CriticalCount} riguardano la conformità NIS2</strong>, 
                  obbligatoria dal 17 Ottobre 2024 con sanzioni fino al 2% del fatturato globale.</span>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Tempo stimato per la remediation: 3-6 mesi</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
      <h3 className="font-display text-xl font-semibold mb-4">Sicurezza Base</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {securityItems.map((item, index) => (
          <div key={index} className="glass rounded-xl p-4 flex items-center justify-between">
            <span className="text-foreground">{item.label}</span>
            {getStatusIcon(item.value)}
          </div>
        ))}
      </div>

      {/* NIS2 Compliance Section */}
      <div className="glass rounded-2xl p-6 mb-8 border-warning/50 bg-gradient-to-br from-warning/5 to-transparent">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">
              Conformità NIS2
            </h3>
            <p className="text-sm text-muted-foreground">Direttiva UE 2022/2555 - In vigore dal 17/10/2024</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nis2Items.map((item, index) => (
            <div key={index} className="bg-background/50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-foreground block">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.article}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{getStatusText(item.value)}</span>
                {getStatusIcon(item.value)}
              </div>
            </div>
          ))}
        </div>

        {nis2CriticalCount > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
            <p className="text-sm text-destructive font-medium">
              ⚠️ La tua azienda non è conforme a {nis2CriticalCount} requisiti NIS2. 
              Le sanzioni per la non conformità possono arrivare fino a €10M o 2% del fatturato globale.
            </p>
          </div>
        )}
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

      {/* Download Section */}
      <div className="glass rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold mb-1">Scarica il Report Completo</h3>
            <p className="text-sm text-muted-foreground">PDF con tutte le analisi e raccomandazioni</p>
          </div>
          <Button variant="hero" size="lg" onClick={generatePDF}>
            <Download className="w-5 h-5 mr-2" />
            Scarica PDF
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="glass rounded-2xl p-8 text-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4">
          <Clock className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-3">
          Non aspettare: ogni giorno conta!
        </h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Le minacce cyber non aspettano. I nostri esperti possono aiutarti a risolvere le criticità 
          e raggiungere la conformità NIS2 prima delle scadenze normative.
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