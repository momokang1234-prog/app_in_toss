/**
 * 토스 인증 API 클라이언트
 * 
 * 흐름:
 * 1. AccessToken 발급 (client_credentials)
 * 2. 원터치 인증 요청 (세션키 + txId)
 * 3. 인증 상태 폴링
 * 4. 결과 조회 (CI, 이름, 전화번호)
 */

const BASE_URL = "https://oauth2.cert.toss.im";
const AUTH_BASE_URL = "https://cert.toss.im/api/v2";

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface AuthRequestResponse {
  resultType: "SUCCESS" | "FAIL";
  success?: {
    txId: string;
    status: "REQUESTED" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
    requestedDt: string;
  };
  error?: {
    errorType: number;
    errorCode: string;
    reason: string;
  };
}

export interface AuthResultResponse {
  resultType: "SUCCESS" | "FAIL";
  success?: {
    txId: string;
    status: string;
    userName: string;
    userPhone: string;
    ci: string;
    certifiedDt: string;
  };
  error?: {
    errorType: number;
    errorCode: string;
    reason: string;
  };
}

/**
 * 1단계: AccessToken 발급
 * 서버 사이드에서 호출해야 함 (client_secret 노출 방지)
 */
export async function getAccessToken(
  clientId: string,
  clientSecret: string
): Promise<AccessTokenResponse> {
  const response = await fetch(`${BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "ca",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`AccessToken 발급 실패: ${response.status}`);
  }

  return response.json();
}

/**
 * 2단계: 원터치 본인 인증 요청
 * 클라이언트에서 호출 → 토스 앱으로 푸시 발송
 */
export async function requestOneTouchAuth(
  accessToken: string,
  sessionKey: string
): Promise<AuthRequestResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/certifications/one-touch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionKey }),
  });

  if (!response.ok) {
    throw new Error(`인증 요청 실패: ${response.status}`);
  }

  return response.json();
}

/**
 * 3단계: 인증 상태 확인 (폴링)
 */
export async function checkAuthStatus(
  accessToken: string,
  txId: string,
  sessionKey: string
): Promise<AuthRequestResponse> {
  const response = await fetch(
    `${AUTH_BASE_URL}/certifications/one-touch/${txId}/status`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-session-key": sessionKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`상태 확인 실패: ${response.status}`);
  }

  return response.json();
}

/**
 * 4단계: 인증 결과 조회
 * COMPLETED 상태에서 호출 → CI, 이름, 전화번호 수신
 */
export async function getAuthResult(
  accessToken: string,
  txId: string,
  sessionKey: string
): Promise<AuthResultResponse> {
  const response = await fetch(
    `${AUTH_BASE_URL}/certifications/one-touch/${txId}/result`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-session-key": sessionKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`결과 조회 실패: ${response.status}`);
  }

  return response.json();
}
