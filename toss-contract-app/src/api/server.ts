/**
 * 서버 사이드 API 유틸리티
 *
 * 토스 인증 API 래퍼
 * 실제 운영 시 Express/Hono 등 프레임워크에서 import하여 사용
 */

import {
  getAccessToken,
  requestOneTouchAuth,
  checkAuthStatus,
  getAuthResult,
} from "./toss-auth";

interface Env {
  TOSS_CERT_CLIENT_ID: string;
  TOSS_CERT_CLIENT_SECRET: string;
}

/**
 * 토스 인증 API 핸들러 팩토리
 * 프레임워크 독립적 — Express, Hono, Cloudflare Workers 등에서 사용 가능
 */
export function createTossAuthHandlers(env: Env) {
  return {
    /** POST /api/auth/token */
    async getToken() {
      try {
        const token = await getAccessToken(
          env.TOSS_CERT_CLIENT_ID,
          env.TOSS_CERT_CLIENT_SECRET
        );
        return { status: 200, body: token };
      } catch {
        return { status: 500, body: { error: "토큰 발급 실패" } };
      }
    },

    /** POST /api/auth/request */
    async requestAuth(body: { accessToken: string; sessionKey: string }) {
      try {
        const result = await requestOneTouchAuth(
          body.accessToken,
          body.sessionKey
        );
        return { status: 200, body: result };
      } catch {
        return { status: 500, body: { error: "인증 요청 실패" } };
      }
    },

    /** GET /api/auth/status/:txId */
    async getStatus(
      txId: string,
      accessToken: string,
      sessionKey: string
    ) {
      try {
        const result = await checkAuthStatus(accessToken, txId, sessionKey);
        return { status: 200, body: result };
      } catch {
        return { status: 500, body: { error: "상태 확인 실패" } };
      }
    },

    /** GET /api/auth/result/:txId */
    async getResult(
      txId: string,
      accessToken: string,
      sessionKey: string
    ) {
      try {
        const result = await getAuthResult(accessToken, txId, sessionKey);
        return { status: 200, body: result };
      } catch {
        return { status: 500, body: { error: "결과 조회 실패" } };
      }
    },
  };
}
