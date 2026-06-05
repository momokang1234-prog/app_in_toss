import { useState, type FormEvent } from "react";

interface BusinessVerifyProps {
  onComplete: (businessInfo: BusinessInfo) => void;
}

interface BusinessInfo {
  businessNumber: string;
  businessName: string;
  representative: string;
  address: string;
  verified: boolean;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontSize: 15,
  border: "1px solid #E5E8EB",
  borderRadius: 10,
  outline: "none",
  marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#6B7684",
  display: "block",
  marginBottom: 4,
};

export function BusinessVerify({ onComplete }: BusinessVerifyProps) {
  const [businessNumber, setBusinessNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BusinessInfo | null>(null);

  const formatNumber = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 10);
    if (digits.length > 5) return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    if (digits.length > 3) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return digits;
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    const digits = businessNumber.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("사업자등록번호 10자리를 입력하세요");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: 국세청 사업자등록정보 진위확인 API 연동
      // 현재는 mock 응답
      await new Promise((r) => setTimeout(r, 1500));

      const mockResult: BusinessInfo = {
        businessNumber: businessNumber,
        businessName: "(주)토스테스트",
        representative: "김토스",
        address: "서울특별시 강남구 테헤란로 123",
        verified: true,
      };

      setResult(mockResult);
    } catch {
      setError("사업자 확인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          사업자 확인 완료
        </h2>
        <p style={{ color: "#6B7684", marginBottom: 24, fontSize: 14 }}>
          사업자 정보가 확인되었습니다
        </p>

        <div
          style={{
            backgroundColor: "#F5F6F8",
            borderRadius: 12,
            padding: "20px 16px",
            marginBottom: 24,
          }}
        >
          {[
            ["사업자등록번호", result.businessNumber],
            ["상호(법인명)", result.businessName],
            ["대표자", result.representative],
            ["사업장 소재지", result.address],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #E5E8EB",
                fontSize: 14,
              }}
            >
              <span style={{ color: "#6B7684" }}>{k}</span>
              <span style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}

          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              backgroundColor: "#E8F5E9",
              borderRadius: 8,
              fontSize: 13,
              color: "#2E7D32",
              textAlign: "center",
            }}
          >
            ✓ 사업자 확인 완료
          </div>
        </div>

        <button
          onClick={() => onComplete(result)}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#3182F6",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          다음 단계로
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleVerify}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
        사업자 확인
      </h2>
      <p style={{ color: "#6B7684", marginBottom: 24, fontSize: 14 }}>
        사업자등록번호를 입력하여 사업자를 확인합니다
      </p>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: 16,
            backgroundColor: "#FFF3F0",
            borderRadius: 10,
            color: "#FF4500",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <label style={labelStyle}>사업자등록번호</label>
      <input
        style={inputStyle}
        value={businessNumber}
        onChange={(e) => {
          setBusinessNumber(formatNumber(e.target.value));
          if (error) setError(null);
        }}
        placeholder="000-00-00000"
        inputMode="numeric"
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "16px",
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          backgroundColor: loading ? "#9098A4" : "#3182F6",
          border: "none",
          borderRadius: 12,
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: 8,
        }}
      >
        {loading ? "확인 중..." : "사업자 확인"}
      </button>
    </form>
  );
}
