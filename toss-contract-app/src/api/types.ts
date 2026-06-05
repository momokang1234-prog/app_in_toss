/** 근로계약서 데이터 타입 */
export interface ContractData {
  ci: string;
  userName: string;
  employer: string;
  position: string;
  startDate: string;
  salary: string;
  workHours: string;
  workDays: string;
  submittedAt?: string;
  signedAt?: string;
  status: "draft" | "submitted" | "signed" | "completed";
}

/** 계약서 서명 요청 */
export interface SignatureRequest {
  contractId: string;
  ci: string;
  signatureData: string; // base64 이미지 또는 전자서명 토큰
}
