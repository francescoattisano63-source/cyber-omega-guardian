import { AlertTriangle, CheckCircle2, Info, Shield, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface RiskAssessmentData {
  score: number;
  level: 'low' | 'moderate' | 'high';
  summary: string;
  explanation: string[];
  sources: string[];
  partial: boolean;
}

interface RiskAssessmentProps {
  assessment: RiskAssessmentData;
  title?: string;
}

const RiskAssessment = ({ assessment, title }: RiskAssessmentProps) => {
  const getRiskConfig = (level: 'low' | 'moderate' | 'high') => {
    switch (level) {
      case 'low':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-500/10',
          borderColor: 'border-emerald-500/30',
          progressColor: 'bg-emerald-500',
          label: 'Basso Rischio',
          emoji: '🟢'
        };
      case 'moderate':
        return {
          icon: AlertTriangle,
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          progressColor: 'bg-amber-500',
          label: 'Rischio Moderato',
          emoji: '🟡'
        };
      case 'high':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          progressColor: 'bg-red-500',
          label: 'Rischio Elevato',
          emoji: '🔴'
        };
    }
  };

  const config = getRiskConfig(assessment.level);
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Main Risk Card */}
      <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
        <CardContent className="pt-6">
          {/* Risk Status Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.emoji}</span>
              <div>
                <h3 className={`text-lg font-bold ${config.color}`}>
                  {config.label}
                </h3>
                {title && (
                  <p className="text-sm text-muted-foreground">{title}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${config.color}`}>
                {assessment.score}
              </div>
              <div className="text-xs text-muted-foreground">/ 100</div>
            </div>
          </div>

          {/* Risk Score Progress Bar */}
          <div className="mb-4">
            <div className="h-3 w-full bg-background/50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${config.progressColor} transition-all duration-500 rounded-full`}
                style={{ width: `${assessment.score}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0</span>
              <span>20</span>
              <span>60</span>
              <span>100</span>
            </div>
          </div>

          {/* Summary Text */}
          <p className="text-sm text-foreground leading-relaxed">
            {assessment.summary}
          </p>
        </CardContent>
      </Card>

      {/* Explanation Details */}
      {assessment.explanation.length > 0 && (
        <Card className="bg-background/50 border-border/50">
          <CardContent className="pt-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-muted-foreground" />
              Dettagli dell'analisi
            </h4>
            <ul className="space-y-2">
              {assessment.explanation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-muted-foreground/60 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Sources & Transparency */}
      <Card className="bg-muted/30 border-border/30">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="mb-2">
                <strong>Fonti consultate:</strong> {assessment.sources.join(', ')}
              </p>
              <p>
                Questa analisi si basa su fonti pubbliche e servizi di intelligence di terze parti. 
                I risultati forniscono un supporto decisionale e non costituiscono una garanzia di sicurezza assoluta.
              </p>
              {assessment.partial && (
                <p className="mt-2 text-amber-600">
                  ⚠️ Alcune fonti non erano disponibili. Il risultato potrebbe essere parziale.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessment;
