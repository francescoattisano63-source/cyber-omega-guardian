import { useState } from "react";
import AssessmentForm from "./AssessmentForm";
import SecurityReport from "./SecurityReport";

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

const AssessmentSection = () => {
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<FormData | null>(null);
  const [score, setScore] = useState(0);

  const handleComplete = (data: FormData, calculatedScore: number) => {
    setReportData(data);
    setScore(calculatedScore);
    setShowReport(true);
    
    // Scroll to top of section
    document.getElementById('valutazione')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReset = () => {
    setShowReport(false);
    setReportData(null);
    setScore(0);
  };

  return (
    <section id="valutazione" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        {!showReport ? (
          <>
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">
                Valutazione Gratuita
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
                Analizza la tua <span className="text-gradient">Sicurezza</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Compila il questionario per ricevere un rating di sicurezza e un report personalizzato delle vulnerabilità della tua azienda
              </p>
            </div>

            <AssessmentForm onComplete={handleComplete} />
          </>
        ) : (
          reportData && <SecurityReport data={reportData} score={score} onReset={handleReset} />
        )}
      </div>
    </section>
  );
};

export default AssessmentSection;
