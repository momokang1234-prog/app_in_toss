import { useState } from "react";
import { AuthScreen } from "./components/AuthScreen";
import { BusinessVerify } from "./components/BusinessVerify";
import { ContractForm } from "./components/ContractForm";
import { ContractResult } from "./components/ContractResult";

type Step = "auth" | "business" | "form" | "result";

export default function App() {
  const [step, setStep] = useState<Step>("auth");
  const [ci, setCi] = useState("");
  const [userName, setUserName] = useState("");

  const handleAuthComplete = (ci: string, name: string) => {
    setCi(ci);
    setUserName(name);
    setStep("business");
  };

  const handleBusinessComplete = () => {
    setStep("form");
  };

  const handleContractComplete = () => {
    setStep("result");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "16px" }}>
      {/* 진행 단계 표시 */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {(["auth", "business", "form", "result"] as const).map((s) => {
          const active = s === step;
          const done =
            (s === "auth" && step !== "auth") ||
            (s === "business" && (step === "form" || step === "result")) ||
            (s === "form" && step === "result");
          return (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: done ? "#3182F6" : active ? "#3182F6" : "#E5E8EB",
                opacity: done ? 1 : active ? 0.8 : 0.4,
              }}
            />
          );
        })}
      </div>

      {step === "auth" && (
        <AuthScreen onAuthComplete={handleAuthComplete} />
      )}
      {step === "business" && (
        <BusinessVerify onComplete={handleBusinessComplete} />
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
