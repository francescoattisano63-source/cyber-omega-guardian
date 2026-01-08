import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { subscriptionPricing, SubscriptionLevel } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  Mail, 
  Globe, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Crown,
  Zap,
  Building2,
  Loader2,
  Lock,
  ExternalLink
} from "lucide-react";

interface BreachInfo {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  DataClasses: string[];
}

interface EmailResult {
  email: string;
  breaches: BreachInfo[];
  breachCount: number;
  reputation: {
    email: string;
    reputation: string;
    suspicious: boolean;
    references: number;
    details: {
      blacklisted: boolean;
      malicious_activity: boolean;
      credentials_leaked: boolean;
      data_breach: boolean;
    };
  } | null;
}

interface DomainResult {
  domain: string;
  analysis: {
    domain: string;
    reputation: number;
    categories: Record<string, string>;
    lastAnalysisDate: string;
    stats: {
      harmless: number;
      malicious: number;
      suspicious: number;
      undetected: number;
    };
    registrar: string;
    creationDate: string;
  } | null;
}

const CyberDashboard = () => {
  const { level, features, upgrade } = useSubscription("Basic");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [emailResult, setEmailResult] = useState<EmailResult | null>(null);
  const [domainResult, setDomainResult] = useState<DomainResult | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingDomain, setLoadingDomain] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailCheck = async () => {
    if (!email) return;
    
    if (!features.emailBreach) {
      setError("Questa funzionalità richiede un piano superiore");
      return;
    }

    setLoadingEmail(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('check-email', {
        body: { email }
      });
      
      if (fnError) throw fnError;
      setEmailResult(data);
    } catch (err) {
      console.error('Email check error:', err);
      setError("Errore durante il controllo dell'email");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleDomainCheck = async () => {
    if (!domain) return;
    
    if (!features.domainLookup) {
      setError("Questa funzionalità richiede un piano superiore");
      return;
    }

    setLoadingDomain(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('check-domain', {
        body: { domain }
      });
      
      if (fnError) throw fnError;
      setDomainResult(data);
    } catch (err) {
      console.error('Domain check error:', err);
      setError("Errore durante il controllo del dominio");
    } finally {
      setLoadingDomain(false);
    }
  };

  const getLevelIcon = (lvl: SubscriptionLevel) => {
    switch (lvl) {
      case "Basic": return <Shield className="h-5 w-5" />;
      case "Pro": return <Zap className="h-5 w-5" />;
      case "Enterprise": return <Crown className="h-5 w-5" />;
    }
  };

  const getLevelColor = (lvl: SubscriptionLevel) => {
    switch (lvl) {
      case "Basic": return "bg-muted text-muted-foreground";
      case "Pro": return "bg-cyber-accent/20 text-cyber-accent";
      case "Enterprise": return "bg-primary/20 text-primary";
    }
  };

  return (
    <section id="dashboard" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className={`${getLevelColor(level)} mb-4`}>
            {getLevelIcon(level)}
            <span className="ml-2">Piano {level}</span>
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cyber Guardian Dashboard
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitora la sicurezza delle tue email e domini in tempo reale
          </p>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-6">
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-destructive">{error}</span>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Check
              </TabsTrigger>
              <TabsTrigger value="domain" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Domain/IP Check
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Piano
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Verifica Email Breaches
                  </CardTitle>
                  <CardDescription>
                    Controlla se un indirizzo email è stato compromesso in data breach conosciuti
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="esempio@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleEmailCheck} 
                      disabled={loadingEmail || !email}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {loadingEmail ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verifica"
                      )}
                    </Button>
                  </div>

                  {emailResult && (
                    <div className="space-y-4 mt-6">
                      {/* Breach Results */}
                      <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          {emailResult.breachCount > 0 ? (
                            <>
                              <XCircle className="h-5 w-5 text-destructive" />
                              <span className="text-destructive">
                                {emailResult.breachCount} Data Breach Trovati
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              <span className="text-primary">Nessun Breach Trovato</span>
                            </>
                          )}
                        </h4>
                        
                        {emailResult.breaches.length > 0 && (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {emailResult.breaches.map((breach, idx) => (
                              <div 
                                key={idx}
                                className="p-3 rounded bg-destructive/10 border border-destructive/30"
                              >
                                <div className="font-medium text-destructive">{breach.Title}</div>
                                <div className="text-sm text-muted-foreground">
                                  Data breach: {breach.BreachDate}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Dati esposti: {breach.DataClasses?.join(", ") || "N/A"}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reputation Results */}
                      {emailResult.reputation && (
                        <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-cyber-accent" />
                            Reputazione Email
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-muted-foreground">Reputazione:</span>
                              <Badge className={
                                emailResult.reputation.reputation === "high" 
                                  ? "bg-primary/20 text-primary ml-2"
                                  : emailResult.reputation.reputation === "medium"
                                  ? "bg-yellow-500/20 text-yellow-500 ml-2"
                                  : "bg-destructive/20 text-destructive ml-2"
                              }>
                                {emailResult.reputation.reputation}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Sospetto:</span>
                              <Badge className={
                                emailResult.reputation.suspicious 
                                  ? "bg-destructive/20 text-destructive ml-2"
                                  : "bg-primary/20 text-primary ml-2"
                              }>
                                {emailResult.reputation.suspicious ? "Sì" : "No"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="domain">
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-cyber-accent" />
                    Analisi Dominio/IP
                  </CardTitle>
                  <CardDescription>
                    Verifica la reputazione e la sicurezza di un dominio o IP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="esempio.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleDomainCheck} 
                      disabled={loadingDomain || !domain}
                      className="bg-cyber-accent hover:bg-cyber-accent/90 text-background"
                    >
                      {loadingDomain ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Analizza"
                      )}
                    </Button>
                  </div>

                  {domainResult?.analysis && (
                    <div className="space-y-4 mt-6">
                      <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-cyber-accent" />
                          Risultati Analisi: {domainResult.domain}
                        </h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 rounded bg-primary/10">
                            <div className="text-2xl font-bold text-primary">
                              {domainResult.analysis.stats.harmless}
                            </div>
                            <div className="text-xs text-muted-foreground">Sicuri</div>
                          </div>
                          <div className="text-center p-3 rounded bg-destructive/10">
                            <div className="text-2xl font-bold text-destructive">
                              {domainResult.analysis.stats.malicious}
                            </div>
                            <div className="text-xs text-muted-foreground">Malevoli</div>
                          </div>
                          <div className="text-center p-3 rounded bg-yellow-500/10">
                            <div className="text-2xl font-bold text-yellow-500">
                              {domainResult.analysis.stats.suspicious}
                            </div>
                            <div className="text-xs text-muted-foreground">Sospetti</div>
                          </div>
                          <div className="text-center p-3 rounded bg-muted">
                            <div className="text-2xl font-bold text-muted-foreground">
                              {domainResult.analysis.stats.undetected}
                            </div>
                            <div className="text-xs text-muted-foreground">Non rilevati</div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reputazione:</span>
                            <span>{domainResult.analysis.reputation}</span>
                          </div>
                          {domainResult.analysis.registrar && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Registrar:</span>
                              <span>{domainResult.analysis.registrar}</span>
                            </div>
                          )}
                          {domainResult.analysis.creationDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Data creazione:</span>
                              <span>{new Date(domainResult.analysis.creationDate).toLocaleDateString('it-IT')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription">
              <div className="grid md:grid-cols-3 gap-6">
                {(["Basic", "Pro", "Enterprise"] as SubscriptionLevel[]).map((lvl) => (
                  <Card 
                    key={lvl}
                    className={`bg-card/50 backdrop-blur border-border/50 ${
                      level === lvl ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${getLevelColor(lvl)}`}>
                        {getLevelIcon(lvl)}
                      </div>
                      <CardTitle>{lvl}</CardTitle>
                      <div className="text-2xl font-bold text-primary">
                        {subscriptionPricing[lvl].price}
                        <span className="text-sm text-muted-foreground">
                          {subscriptionPricing[lvl].period}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Email Breach Check
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Email Reputation
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Domain Lookup
                        </li>
                        <li className="flex items-center gap-2">
                          {lvl !== "Basic" ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={lvl === "Basic" ? "text-muted-foreground" : ""}>
                            Webhook Alerts
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          {lvl === "Enterprise" ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={lvl !== "Enterprise" ? "text-muted-foreground" : ""}>
                            Threat Feed
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          {lvl !== "Basic" ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={lvl === "Basic" ? "text-muted-foreground" : ""}>
                            Export Report
                          </span>
                        </li>
                      </ul>
                      
                      {level === lvl ? (
                        <Button className="w-full" variant="outline" disabled>
                          Piano Attuale
                        </Button>
                      ) : (
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={() => upgrade(lvl)}
                        >
                          Passa a {lvl}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA per consulenza */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-cyber-accent/10 border-primary/30 max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Vuoi una valutazione completa?</h3>
              <p className="text-muted-foreground mb-4">
                I nostri esperti possono analizzare approfonditamente la tua infrastruttura
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a 
                  href="https://cal.com/frattis63" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Prenota una Consulenza
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CyberDashboard;
