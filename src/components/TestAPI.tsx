import React, { useState } from "react";
import { checkEmailBreach, checkEmailReputation } from "@/api/email";
import { domainReport } from "@/api/domain";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestAPI() {
  const { level, features, upgrade } = useSubscription("Basic");

  const [emailResult, setEmailResult] = useState<any>(null);
  const [domainResult, setDomainResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmail = "test@example.com";
  const testDomain = "example.com";

  const runTests = async () => {
    setLoading(true);
    try {
      const emailBreach = await checkEmailBreach(testEmail);
      const emailRep = await checkEmailReputation(testEmail);
      setEmailResult({ emailBreach, emailRep });

      const domain = await domainReport(testDomain);
      setDomainResult(domain);

      alert("Test completato! Controlla i risultati qui sotto.");
    } catch (err) {
      alert("Errore durante il test: " + err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Cyber Guardian API Test</h1>
      <p className="text-muted-foreground">Livello attuale: <strong>{level}</strong></p>

      <Button onClick={runTests} disabled={loading}>
        {loading ? "Testing..." : "Esegui Test API"}
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Email Test ({testEmail})</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify(emailResult, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Domain Test ({testDomain})</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify(domainResult, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => upgrade("Pro")}>
          Pro
        </Button>
        <Button variant="destructive" onClick={() => upgrade("Enterprise")}>
          Enterprise
        </Button>
      </div>
    </div>
  );
}
