import { useState, useCallback } from "react";

interface AuthScreenProps {
  onAuthComplete: (ci: string, userName: string) => void;
}

/**
 * 토스 인증 화면
 * - 원터치 인증: 토스 앱 바로 호출 → 이탈 최소화
 * - 폴링으로 인증 상태 확인 → 완료 시 콜백
 */
export function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleOneTouchAuth = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatus("인증 요청 중...");

    try {
      // 1. AccessToken 발급
      const tokenRes = await fetch("/api/auth/token", { method: "POST" });
      if (!tokenRes.ok) throw new Error("토큰 발급 실패");
      const { access_token } = await tokenRes.json();

      // 2. 세션키 생성 (서버에서 처리하거나 클라이언트에서 생성)
      const sessionKey = crypto.randomUUID();

      // 3. 원터치 인증 요청
      const authRes = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: access_token, sessionKey }),
      });
      const authData = await authRes.json();

      if (authData.resultType !== "SUCCESS") {
        throw new Error(authData.error?.reason || "인증 요청 실패");
      }

      const txId = authData.success.txId;
      setStatus("토스 앱에서 인증을 확인해주세요...");

      // 4. 인증 상태 폴링 (최대 5분)
      const maxAttempts = 60;
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((r) => setTimeout(r, 5000));

        const statusRes = await fetch(
          `/api/auth/status/${txId}?accessToken=${access_token}&sessionKey=${sessionKey}`
        );
        const statusData = await statusRes.json();

        if (statusData.success?.status === "COMPLETED") {
          setStatus("인증 완료! 결과 조회 중...");

          // 5. 결과 조회
          const resultRes = await fetch(
            `/api/auth/result/${txId}?accessToken=${access_token}&sessionKey=${sessionKey}`
          );
          const resultData = await resultRes.json();

          if (resultData.resultType === "SUCCESS") {
            onAuthComplete(resultData.success.ci, resultData.success.userName);
            return;
          }
        }

        if (statusData.success?.status === "EXPIRED") {
          throw new Error("인증 시간이 만료되었습니다. 다시 시도해주세요.");
        }

        setStatus(`인증 대기 중... (${i + 1}/${maxAttempts})`);
      }

      throw new Error("인증 시간 초과");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [onAuthComplete]);

  return (
    <div style={{ textAlign: "center", paddingTop: 80 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        근로계약
      </h1>
      <p style={{ color: "#6B7684", marginBottom: 40 }}>
        토스 인증으로 간편하게 본인 확인 후 계약을 진행합니다
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

      {status && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: 16,
            backgroundColor: "#F0F5FF",
            borderRadius: 10,
            color: "#3182F6",
            fontSize: 14,
          }}
        >
          {status}
        </div>
      )}

      <button
        onClick={handleOneTouchAuth}
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
        }}
      >
        {loading ? "인증 중..." : "토스로 본인 인증하기"}
      </button>
    </div>
  );
}
