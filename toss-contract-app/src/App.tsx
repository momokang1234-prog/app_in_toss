import { useState } from "react";
import { ContractForm } from "./components/ContractForm";
import { AuthScreen } from "./components/AuthScreen";
import { ContractResult } from "./components/ContractResult";

type Step = "auth" | "form" | "result";

export default function App() {
  const [step, setStep] = useState<Step>("auth");
  const [ci, setCi] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  const handleAuthComplete = (ci: string, name: string) => {
    setCi(ci);
    setUserName(name);
    setStep("form");
  };

  const handleContractComplete = () => {
    setStep("result");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px" }}>
      {step === "auth" && (
        <AuthScreen onAuthComplete={handleAuthComplete} />
      )}
      {step === "form" && (
        <ContractForm
          ci={ci}
          userName={userName}
          onComplete={handleContractComplete}
        />
      )}
      {step === "result" && <ContractResult />}
    </div>
  );
}
