export function ContractResult() {
  return (
    <div style={{ textAlign: "center", paddingTop: 60 }}>
      <div
        style={{
          width: 64,
          height: 64,
          margin: "0 auto 20px",
          backgroundColor: "#E8F5E9",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
        }}
      >
        ✓
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
        계약서 제출 완료
      </h2>
      <p style={{ color: "#6B7684", lineHeight: 1.6, marginBottom: 32 }}>
        근로계약서가 성공적으로 제출되었습니다.
        <br />
        확인 후 서명 요청이 발송됩니다.
      </p>

      <div
        style={{
          backgroundColor: "#F5F6F8",
          borderRadius: 12,
          padding: "20px 16px",
          textAlign: "left",
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 12,
            color: "#333D4B",
          }}
        >
          진행 상태
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "본인 인증", done: true },
            { label: "계약서 작성", done: true },
            { label: "사업자 확인", done: false },
            { label: "전자서명", done: false },
          ].map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: step.done ? "#3182F6" : "#9098A4",
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: step.done ? "#3182F6" : "#E5E8EB",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  flexShrink: 0,
                }}
              >
                {step.done ? "✓" : i + 1}
              </span>
              {step.label}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => window.location.reload()}
        style={{
          width: "100%",
          padding: "14px",
          fontSize: 15,
          fontWeight: 600,
          color: "#3182F6",
          backgroundColor: "#fff",
          border: "1px solid #3182F6",
          borderRadius: 12,
          cursor: "pointer",
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
