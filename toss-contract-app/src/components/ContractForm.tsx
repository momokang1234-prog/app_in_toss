import { useState, type FormEvent } from "react";

interface ContractFormProps {
  ci: string;
  userName: string;
  onComplete: () => void;
}

type SalaryType = "monthly" | "hourly" | "daily";

interface FormData {
  employer: string;
  position: string;
  startDate: string;
  salaryType: SalaryType;
  salary: string;
  workHours: string;
  workDays: string;
}

const SALARY_OPTIONS: { value: SalaryType; label: string; unit: string }[] = [
  { value: "monthly", label: "월급", unit: "원/월" },
  { value: "hourly", label: "시급", unit: "원/시간" },
  { value: "daily", label: "일당", unit: "원/일" },
];

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

export function ContractForm({ ci: _ci, userName, onComplete }: ContractFormProps) {
  const [form, setForm] = useState<FormData>({
    employer: "",
    position: "",
    startDate: "",
    salaryType: "monthly",
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

  const selectedUnit = SALARY_OPTIONS.find((o) => o.value === form.salaryType)?.unit ?? "원";

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
        근로계약서 작성
      </h2>
      <p style={{ color: "#6B7684", marginBottom: 24, fontSize: 14 }}>
        {userName}님의 정보가 확인되었습니다
      </p>

      {/* 사업장명 */}
      <label style={labelStyle}>사업장명</label>
      <input
        style={{ ...inputStyle, borderColor: errors.employer ? "#FF4500" : "#E5E8EB" }}
        value={form.employer}
        onChange={(e) => handleChange("employer", e.target.value)}
        placeholder="사업장명을 입력하세요"
      />
      {errors.employer && <p style={errorStyle}>{errors.employer}</p>}

      {/* 직무/직급 */}
      <label style={labelStyle}>직무/직급</label>
      <input
        style={{ ...inputStyle, borderColor: errors.position ? "#FF4500" : "#E5E8EB" }}
        value={form.position}
        onChange={(e) => handleChange("position", e.target.value)}
        placeholder="직무 또는 직급"
      />
      {errors.position && <p style={errorStyle}>{errors.position}</p>}

      {/* 입사일 */}
      <label style={labelStyle}>입사일</label>
      <input
        style={{ ...inputStyle, borderColor: errors.startDate ? "#FF4500" : "#E5E8EB" }}
        type="date"
        value={form.startDate}
        onChange={(e) => handleChange("startDate", e.target.value)}
      />
      {errors.startDate && <p style={errorStyle}>{errors.startDate}</p>}

      {/* 급여 유형 */}
      <label style={labelStyle}>급여 유형</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {SALARY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleChange("salaryType", opt.value)}
            style={{
              flex: 1,
              padding: "10px 0",
              fontSize: 14,
              fontWeight: form.salaryType === opt.value ? 600 : 400,
              color: form.salaryType === opt.value ? "#fff" : "#333D4B",
              backgroundColor: form.salaryType === opt.value ? "#3182F6" : "#F5F6F8",
              border: form.salaryType === opt.value ? "none" : "1px solid #E5E8EB",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 금액 */}
      <label style={labelStyle}>금액 ({selectedUnit})</label>
      <input
        style={{ ...inputStyle, borderColor: errors.salary ? "#FF4500" : "#E5E8EB" }}
        type="number"
        value={form.salary}
        onChange={(e) => handleChange("salary", e.target.value)}
        placeholder={`급여 금액 (${selectedUnit})`}
        min="0"
      />
      {errors.salary && <p style={errorStyle}>{errors.salary}</p>}

      {/* 근무 시간 */}
      <label style={labelStyle}>근무 시간</label>
      <input
        style={{ ...inputStyle, borderColor: errors.workHours ? "#FF4500" : "#E5E8EB" }}
        value={form.workHours}
        onChange={(e) => handleChange("workHours", e.target.value)}
        placeholder="예: 09:00 ~ 18:00"
      />
      {errors.workHours && <p style={errorStyle}>{errors.workHours}</p>}

      {/* 근무 요일 */}
      <label style={labelStyle}>근무 요일</label>
      <input
        style={{ ...inputStyle, borderColor: errors.workDays ? "#FF4500" : "#E5E8EB" }}
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
