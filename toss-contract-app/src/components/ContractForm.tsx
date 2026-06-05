import { useState, type FormEvent } from "react";

interface ContractFormProps {
  ci: string;
  userName: string;
  onComplete: () => void;
}

interface FormData {
  employer: string;
  position: string;
  startDate: string;
  salary: string;
  workHours: string;
  workDays: string;
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

/**
 * 근로계약서 작성 폼
 * - 토스 인증 완료 후 표시
 * - CI 기반으로 사용자 자동 매칭
 */
export function ContractForm({ ci: _ci, userName, onComplete }: ContractFormProps) {
  const [form, setForm] = useState<FormData>({
    employer: "",
    position: "",
    startDate: "",
    salary: "",
    workHours: "",
    workDays: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.employer.trim()) newErrors.employer = "사업장명을 입력하세요";
    if (!form.position.trim()) newErrors.position = "직무/직급을 입력하세요";
    if (!form.startDate) newErrors.startDate = "입사일을 선택하세요";
    if (!form.salary || Number(form.salary) <= 0)
      newErrors.salary = "급여를 입력하세요";
    if (!form.workHours.trim()) newErrors.workHours = "근무 시간을 입력하세요";
    if (!form.workDays.trim()) newErrors.workDays = "근무 요일을 입력하세요";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      // TODO: 서버에 계약서 저장 + 전자서명 요청
      await new Promise((r) => setTimeout(r, 1000));
      onComplete();
    } finally {
      setSubmitting(false);
    }
  };

  const errorStyle: React.CSSProperties = {
    color: "#FF4500",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
        근로계약서 작성
      </h2>
      <p style={{ color: "#6B7684", marginBottom: 24, fontSize: 14 }}>
        {userName}님의 정보가 확인되었습니다
      </p>

      <label style={labelStyle}>사업장명</label>
      <input
        style={{
          ...inputStyle,
          borderColor: errors.employer ? "#FF4500" : "#E5E8EB",
        }}
        value={form.employer}
        onChange={(e) => handleChange("employer", e.target.value)}
        placeholder="사업장명을 입력하세요"
      />
      {errors.employer && <p style={errorStyle}>{errors.employer}</p>}

      <label style={labelStyle}>직무/직급</label>
      <input
        style={{
          ...inputStyle,
          borderColor: errors.position ? "#FF4500" : "#E5E8EB",
        }}
        value={form.position}
        onChange={(e) => handleChange("position", e.target.value)}
        placeholder="직무 또는 직급"
      />
      {errors.position && <p style={errorStyle}>{errors.position}</p>}

      <label style={labelStyle}>입사일</label>
      <input
        style={{
          ...inputStyle,
          borderColor: errors.startDate ? "#FF4500" : "#E5E8EB",
        }}
        type="date"
        value={form.startDate}
        onChange={(e) => handleChange("startDate", e.target.value)}
      />
      {errors.startDate && <p style={errorStyle}>{errors.startDate}</p>}

      <label style={labelStyle}>급여 (원)</label>
      <input
        style={{
          ...inputStyle,
          borderColor: errors.salary ? "#FF4500" : "#E5E8EB",
        }}
        type="number"
        value={form.salary}
        onChange={(e) => handleChange("salary", e.target.value)}
        placeholder="월 급여"
        min="0"
      />
      {errors.salary && <p style={errorStyle}>{errors.salary}</p>}

      <label style={labelStyle}>근무 시간</label>
      <input
        style={{
          ...inputStyle,
          borderColor: errors.workHours ? "#FF4500" : "#E5E8EB",
        }}
        value={form.workHours}
        onChange={(e) => handleChange("workHours", e.target.value)}
        placeholder="예: 09:00 ~ 18:00"
      />
      {errors.workHours && <p style={errorStyle}>{errors.workHours}</p>}

      <label style={labelStyle}>근무 요일</label>
      <input
        style={{
          ...inputStyle,
          borderColor: errors.workDays ? "#FF4500" : "#E5E8EB",
        }}
        value={form.workDays}
        onChange={(e) => handleChange("workDays", e.target.value)}
        placeholder="예: 월~금"
      />
      {errors.workDays && <p style={errorStyle}>{errors.workDays}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          padding: "16px",
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          backgroundColor: submitting ? "#9098A4" : "#3182F6",
          border: "none",
          borderRadius: 12,
          cursor: submitting ? "not-allowed" : "pointer",
          marginTop: 8,
        }}
      >
        {submitting ? "제출 중..." : "계약서 제출"}
      </button>
    </form>
  );
}
