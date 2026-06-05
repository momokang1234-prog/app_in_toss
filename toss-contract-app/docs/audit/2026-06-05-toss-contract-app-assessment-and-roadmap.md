# 토스 근로계약서 앱 점검·평가·개발 계획

> 기준 시각: 2026-06-05 KST(UTC+9) 10:50 전후
> 대상 저장소: `/Users/ganghyeon-ug/Desktop/💼 프로젝트/AI_Agents/TOSS/toss-contract-app`
> 실행 우회 경로: `/tmp/toss-contract-app` symlink

## 1. 결론

현재 상태는 “앱인토스 WebView 프로토타입” 수준.

좋은 점:
- React 18 + Vite + TypeScript 구성 정상
- 앱인토스 SDK 2.x 설치 확인
- `granite.config.ts` 기본 설정 존재
- 본인인증 → 사업자확인 → 계약서작성 → 결과 화면 흐름 골격 존재
- TypeScript 컴파일, Vite 빌드 통과

핵심 한계:
- Toss Auth, 사업자 검증, 계약 저장, 전자서명 모두 mock 또는 미연결
- TDS 패키지는 설치됐지만 실제 UI 컴포넌트 미사용
- 근로계약서 필수 도메인 항목 부족
- 보안 구조 미완성: accessToken/sessionKey가 URL query로 노출되는 설계
- 서버 API 유틸은 있으나 라우터/배포 가능한 백엔드에 연결되지 않음
- 테스트/린트/릴리즈 품질 게이트 없음

현재 평가: 42 / 100
- 빌드 가능성: 80
- 앱인토스 기본 구성: 65
- Toss Auth 운영 준비도: 25
- 근로계약 도메인 완성도: 30
- 전자서명/문서화: 15
- UX 완성도: 50
- 보안/개인정보: 25
- 테스트/운영성: 20

권장 판단:
- 지금은 배포 불가
- 다음 목표는 “mock 프로토타입” → “사내 테스트 가능한 MVP” 전환
- 최우선은 보안 경계 재설계와 계약 도메인 스키마 확정

---

## 2. 확인한 실행 결과

### 2.1 정적/빌드 점검

실행 명령:
- `npm exec -- tsc --noEmit`
- `node ./node_modules/vite/bin/vite.js build`

결과:
- TypeScript: PASS
- Build: PASS
- Vite 6.4.3
- transformed modules: 31
- output JS: 154.59 kB, gzip 49.53 kB
- output CSS: 0.19 kB, gzip 0.17 kB

한계:
- `test` script 없음
- `lint` script 없음
- e2e 없음
- 접근성 검사 없음

### 2.2 의존성 확인

package-lock 기준:
- `@apps-in-toss/web-framework`: 2.6.1
- `@toss/tds-mobile`: 2.4.0
- `react`: 18.3.1
- `react-dom`: 18.3.1
- `vite`: 6.4.3

리스크:
- `package.json`은 `@apps-in-toss/web-framework: latest`, `@toss/tds-mobile: latest` 사용
- 재설치 시 의존성 변동 가능
- 앱인토스 업로드/심사 전 버전 pin 필요

### 2.3 브라우저 플로우 점검

Puppeteer mobile viewport 390x844 기준.

확인 흐름:
1. 인증 화면 진입
2. 개발 모드 mock 인증
3. 사업자번호 빈 값 검증 에러
4. 사업자번호 입력 후 mock 사업자 확인
5. 계약서 작성 화면 진입
6. 빈 계약서 제출 시 필수 입력 에러 표시

생성 스크린샷:
- `docs/audit/screenshots/01-auth.png`
- `docs/audit/screenshots/02-business.png`
- `docs/audit/screenshots/03-business-empty-error.png`
- `docs/audit/screenshots/04-business-verified.png`
- `docs/audit/screenshots/05-contract-form.png`
- `docs/audit/screenshots/06-contract-empty-errors.png`

관찰:
- 콘솔 에러 1건: 404 resource. favicon 또는 정적 자원 누락 가능성 큼
- 페이지 크래시 없음
- 개발 플로우는 부분적으로 동작
- 날짜 input 자동화 입력은 상태 반영이 불안정하게 관찰됨. 실제 수동 입력/모바일 date picker에서 별도 확인 필요

---

## 3. Acceptance Criteria 매트릭스

| AC | 상태 | 판단 |
|---|---:|---|
| 앱인토스 SDK 2.x 사용 | 부분 통과 | web-framework 2.6.1 확인. 다만 실제 앱인토스 빌드/업로드 검증 미실행 |
| React 18 + Vite + TS | 통과 | React 18.3.1, Vite 빌드/TS 통과 |
| granite.config.ts appName/displayName/primaryColor | 통과 | `toss-contract-app`, `근로계약`, `#3182F6` |
| Vite dev 서버 5173 | 통과 | 127.0.0.1:5173 응답 200 |
| 모바일 max-width 480 | 통과 | App wrapper 적용 |
| 본인 인증 플로우 | 부분 통과 | 화면 흐름과 mock 있음. 운영 Toss Auth 미완성 |
| AccessToken 발급 API | 실패 | 유틸 함수만 존재. 실제 서버 라우트 없음 |
| 원터치 인증 결과 CI/이름 수신 | 실패 | mock만 동작. 운영 복호화/세션 처리 없음 |
| 서버 사이드 API 엔드포인트 설계 | 부분 통과 | `createTossAuthHandlers` 존재하나 미연결 |
| TDS 컴포넌트 기반 UI | 실패 | 패키지만 설치, 실제 import/use 없음 |
| 계약서 작성 폼 | 부분 통과 | 기본 항목만 있음. 법정/실무 항목 부족 |
| 계약서 제출 및 전자서명 요청 | 실패 | 실제 저장/서명 API 없음 |
| 완료 확인 화면 | 부분 통과 | 화면은 있으나 상태 표시 오류 존재 |
| 에러/로딩 UI | 부분 통과 | 기본 에러/로딩 있음. 실패 상세/재시도/복구 부족 |

---

## 4. 주요 결함·리스크

### P0 — 배포 차단

1. 서버 API 미연결
- `AuthScreen`은 `/api/auth/token`, `/api/auth/request`를 호출
- 실제 Vite/Express/Hono 라우터 없음
- `vite.config.ts`는 `/api`를 `https://cert.toss.im/api/v2`로 proxy rewrite
- 즉 `/api/auth/token`은 운영 OAuth token endpoint와 맞지 않음

2. Toss Auth 보안 경계 오류
- client가 accessToken을 받고 status/result query string에 포함
- query string은 브라우저 히스토리, 서버 로그, 프록시 로그, referrer로 누출 가능
- accessToken/sessionKey는 브라우저에 전달하지 않는 구조가 필요

3. TossCertSessionGenerator/복호화 미구현
- 현재 `crypto.randomUUID()` 기반 sessionKey
- 개인정보 암호화/복호화 흐름 미구현
- 운영 Toss 인증 계약과 mTLS 전제 미반영

4. 계약 데이터 영속화 없음
- 계약서 제출은 `setTimeout` 후 결과 화면으로 이동
- 서버 저장, draft ID, 계약 ID, 상태 관리 없음

5. 전자서명 없음
- 결과 화면 텍스트만 “서명 요청 발송” 표시
- 서명 요청/서명 캡처/타임스탬프/감사 로그 없음

6. 근로계약 필수 항목 부족
- 현재: 사업장명, 직무, 입사일, 급여유형, 금액, 근무시간, 근무요일
- 부족: 사용자/사업자 법정 식별정보, 근무장소, 계약기간, 임금 구성·계산·지급일·지급방법, 소정근로시간, 휴게시간, 휴일/주휴일, 연차유급휴가, 취업규칙/기타 근로조건, 단시간 근로자별 근로일·근로시간 등

### P1 — MVP 품질 리스크

1. BusinessVerify mock
- 국세청 사업자등록정보 진위확인 미연동
- mock 사업자 정보가 계약서로 전달되지 않음

2. App state 손실
- `BusinessVerify`에서 받은 `businessInfo`를 App이 버림
- `ContractForm`은 `ci` prop을 `_ci`로 받아 사용하지 않음
- 사용자의 인증 정보가 계약 데이터에 연결되지 않음

3. 완료 화면 상태 오류
- 실제 플로우상 사업자 확인 완료 후 form 진입
- `ContractResult`는 “사업자 확인”을 false로 표시

4. TDS 미사용
- 현재 거의 전부 inline style
- Toss 앱 내 UX 일관성, 접근성, 심사 대응에 취약

5. 테스트/린트 부재
- 계약 도메인 검증은 회귀 위험 높음
- 최소 단위 테스트/e2e 필요

6. 저장소 위생
- `.gitignore` 없음
- `node_modules/` untracked
- `package-lock.json` 변경 상태 확인 필요

### P2 — 운영/확장 리스크

1. 계약서 PDF/미리보기 없음
2. 계약 템플릿 versioning 없음
3. 개인정보 보관/삭제 정책 없음
4. 관리자/사업주 대시보드 없음
5. 모니터링/감사 로그 없음
6. Toss Console 업로드 전 체크리스트 없음

---

## 5. 권장 제품 방향

### 5.1 MVP 정의

MVP는 “토스 안에서 근로자 본인확인 후, 사업자 검증된 사업장이 표준 근로계약서를 작성·미리보기·서명요청·완료 저장할 수 있는 흐름”으로 정의.

MVP 필수 플로우:
1. 근로자 Toss 본인인증
2. 사업자번호 검증
3. 근로계약서 필수 항목 입력
4. 법정 최소 검증: 최저임금, 휴게시간, 주휴/근로일, 필수 항목 누락
5. 계약서 HTML/PDF 미리보기
6. 근로자·사용자 전자서명
7. 계약 완료본 저장/다운로드
8. 감사 로그: 누가, 언제, 무엇에 동의/서명했는지

### 5.2 초기 타깃

권장 1차 타깃:
- 소상공인/매장 아르바이트 근로계약
- 시급제/주급제 중심
- 고정 요일·고정 시간 근무

이유:
- Saladoop 운영 도메인과 맞음
- 단시간 근로자 계약서 수요 큼
- 법정 검증 룰을 명확하게 만들기 좋음

### 5.3 피해야 할 초기 범위

MVP에서 제외 권장:
- 교대제/탄력근로/포괄임금
- 외국인 근로자 계약
- 5인 미만/이상 사업장별 복잡한 예외 자동판정
- 급여 자동정산 전체 연동
- 노무 법률 자문 자동 생성

---

## 6. 향후 개발 로드맵

### Phase 0 — 저장소 정리와 품질 게이트

목표: 안정적으로 개발 가능한 상태 만들기.

작업:
1. `.gitignore` 추가
   - `node_modules/`
   - `dist/`
   - `.env*`
   - `.DS_Store`
2. package script 추가
   - `typecheck`: `tsc --noEmit`
   - `build`: 유지
   - `test`: Vitest
   - `lint`: ESLint
   - `e2e`: Playwright 또는 Puppeteer smoke
3. 의존성 version pin
   - `@apps-in-toss/web-framework: 2.6.1`
   - `@toss/tds-mobile: 2.4.0`
4. README/ENV 예시 추가
   - `.env.example`
   - Toss Auth 계약 필요 항목
   - 로컬 dev/prod 차이
5. CI 전제 명령 고정
   - `npm ci`
   - `npm run typecheck`
   - `npm run build`
   - `npm run test`

완료 기준:
- clone 후 `npm ci && npm run typecheck && npm run build` 통과
- `node_modules`가 git status에 나타나지 않음

예상: 0.5일

---

### Phase 1 — 계약 도메인 모델 확정

목표: 입력 폼이 아니라 “계약 데이터 엔진”으로 전환.

신규/수정 파일 권장:
- `src/domain/contract/schema.ts`
- `src/domain/contract/laborRules.ts`
- `src/domain/contract/validation.ts`
- `src/domain/contract/template.ts`
- `src/domain/contract/__tests__/validation.test.ts`

필수 데이터 모델:
- worker
  - name
  - ci/hash
  - phone
  - address optional
- employer
  - businessNumber
  - businessName
  - representative
  - address
- contract
  - contractType: fullTime/partTime/fixedTerm
  - startDate
  - endDate optional
  - workplace
  - jobDescription
  - wageType
  - baseWage
  - wagePaymentDate
  - wagePaymentMethod
  - workDays
  - startTime/endTime
  - breakMinutes
  - weeklyHoliday
  - paidLeaveClause
  - socialInsuranceClause
  - severanceClause
  - templateVersion
  - status

검증 룰:
- 필수 항목 누락 금지
- 시급 최저임금 미만 경고/차단
- 4시간 이상 근무 시 휴게 30분 이상
- 8시간 이상 근무 시 휴게 60분 이상
- 주 15시간 이상이면 주휴일 항목 필수
- 단시간 근로자: 근로일별 근로시간 명시
- 날짜 역전 방지

완료 기준:
- validation unit test 20개 이상
- 계약 데이터에서 화면/문서 생성 가능

예상: 1~2일

---

### Phase 2 — Toss Auth 백엔드 경계 재설계

목표: 브라우저에 인증 토큰/세션키/secret을 노출하지 않는 구조.

권장 구조:
- frontend는 opaque `authSessionId`만 보유
- backend가 accessToken/sessionKey/txId 관리
- status/result도 backend가 Toss API 호출
- CI/전화번호/이름은 필요한 값만 최소화하여 암호화 저장

신규 서버 권장:
- `server/src/index.ts`
- `server/src/routes/tossCert.ts`
- `server/src/services/tossCertClient.ts`
- `server/src/services/authSessionStore.ts`
- `server/src/middleware/security.ts`

API 초안:
- `POST /api/toss-cert/sessions`
  - creates Toss one-touch certification request
  - returns `{ authSessionId, status }`
- `GET /api/toss-cert/sessions/:authSessionId`
  - returns sanitized status
- `POST /api/toss-cert/sessions/:authSessionId/complete`
  - server fetches/decrypts result
  - returns `{ verified: true, user: { name } }`

보안 원칙:
- accessToken은 client에 반환 금지
- sessionKey query string 금지
- mTLS 인증서 서버 저장
- `TOSS_CERT_CLIENT_SECRET` client 번들 금지
- 개인정보 로그 마스킹
- CI 원문 저장 최소화. 저장 시 KMS/DB encryption 또는 hash+암호화 분리

완료 기준:
- mock 모드와 운영 모드 명확히 분리
- dev server proxy가 실제 backend로 향함
- token/sessionKey가 네트워크 탭에서 보이지 않음

예상: 3~5일

---

### Phase 3 — 사업자 검증 연동

목표: mock 사업자 확인 제거.

작업:
1. 국세청 사업자등록정보 진위확인 API 조사/키 발급
2. backend route 추가
   - `POST /api/business/verify`
3. BusinessVerify → 실제 API 호출
4. 검증된 businessInfo를 App state/contract draft에 연결
5. 사업자번호 입력 UX 개선
   - 자동 하이픈
   - 실패 사유 표시
   - 재시도

완료 기준:
- mock/offline mode 분리
- 검증 결과가 계약서 employer 필드에 자동 반영
- 실패 케이스 테스트 통과

예상: 1~2일

---

### Phase 4 — 프론트엔드 UX/TDS 전환

목표: Toss 앱 안에서 자연스러운 모바일 계약 작성 경험.

작업:
1. inline style 제거 또는 최소화
2. `@toss/tds-mobile` 컴포넌트 사용
   - Button
   - TextField
   - List/Section
   - FixedBottomCTA 계열
   - Top/Navigation 계열
3. 상태 머신 도입
   - auth
   - businessVerify
   - draft
   - preview
   - sign
   - complete
4. draft auto-save
5. 뒤로가기/수정 플로우
6. 진행 단계 텍스트 접근성 추가
7. 날짜/시간 입력 컴포넌트 표준화
8. 완료 화면 상태 오류 수정

완료 기준:
- TDS import/use 확인
- mobile e2e smoke 통과
- 사용자가 입력한 인증/사업자/계약 데이터가 최종 preview까지 유지

예상: 3~4일

---

### Phase 5 — 계약서 미리보기/PDF/전자서명

목표: “제출 완료”가 아니라 실제 계약 문서 완성.

작업:
1. 계약서 HTML template 생성
   - `src/domain/contract/template.ts`
2. preview 화면 추가
   - `src/components/ContractPreview.tsx`
3. PDF 생성 서버 추가
   - Playwright/Chromium 또는 PDF 서비스
4. 전자서명 방식 결정
   - 간단 서명 이미지
   - Toss 인증 기반 동의 토큰
   - 외부 전자서명 API
5. signature audit log 추가
   - signerId
   - signedAt KST
   - IP/UserAgent 최소 저장
   - contractHash
   - templateVersion
6. 완료본 다운로드/재조회

완료 기준:
- 계약서 PDF 파일 생성
- worker/employer 서명 상태 추적
- 완료본 hash와 audit log 저장

예상: 5~7일

---

### Phase 6 — 운영 준비/Toss Console 제출 준비

목표: sandbox 심사/내부 테스트 가능 상태.

작업:
1. 앱 아이콘/브랜드 자산 등록
2. `granite.config.ts` icon URL 설정
3. Toss Auth 계약 상태 확인
4. mTLS 인증서 서버 배치
5. sandbox QA checklist 작성
6. 에러 모니터링 추가
   - Sentry 또는 lightweight logger
7. 개인정보 처리방침/이용약관/동의문 연결
8. 릴리즈 태그/빌드 산출물 고정

완료 기준:
- Apps in Toss Console sandbox 실행
- 10개 이상 시나리오 e2e 통과
- 개인정보/인증/계약 저장 정책 문서화

예상: 2~3일

---

## 7. 우선순위 백로그

### P0 — 반드시 먼저

1. `.gitignore` 및 repo hygiene
2. `typecheck/build/test/lint` script 추가
3. Toss Auth backend route 실제 연결
4. token/sessionKey client 노출 제거
5. contract schema + validation 엔진 생성
6. businessInfo/ci/userName을 contract draft에 연결
7. 전자서명 전까지 결과 화면 문구 수정
8. `ContractResult` 사업자 확인 false 버그 수정

### P1 — MVP 완성

1. 국세청 사업자 검증
2. TDS 컴포넌트 전환
3. 계약서 미리보기
4. PDF 생성
5. 서명 요청/서명 완료 플로우
6. 계약 draft/complete 저장 API
7. 개인정보 동의/보관/삭제 플로우
8. e2e smoke 테스트

### P2 — 제품화

1. 관리자/사업주 계약 목록
2. Saladoop 급여/스케줄 데이터 연동
3. 근로시간 캘린더 기반 자동 계약 생성
4. 주휴/휴게/최저임금 자동 경고
5. 계약 변경 이력/재서명
6. 알림/리마인더
7. 노무 리스크 리포트

---

## 8. 추천 구현 순서

1. 저장소 정리
2. contract schema/validation 테스트 작성
3. App state를 contract draft 중심으로 재구성
4. backend skeleton 추가
5. Toss Auth mock/prod adapter 분리
6. 사업자 검증 mock/prod adapter 분리
7. TDS UI 전환
8. preview 화면 추가
9. PDF/전자서명 구현
10. sandbox QA

---

## 9. 다음 실행안

추천: Phase 0 + Phase 1부터 진행.

첫 PR 범위:
- `.gitignore`
- scripts 추가
- Vitest 설치
- contract schema/validation 추가
- 기존 ContractForm을 schema 기반으로 리팩터링 준비
- App state에 `authUser`, `businessInfo`, `contractDraft` 명시

예상 작업 시간: 1~2일

첫 PR 완료 기준:
- `npm ci`
- `npm run typecheck`
- `npm run build`
- `npm run test`
- 계약 필수 항목 validation test 통과

---

## 10. 법무/노무 확인 필요

이 문서는 개발 평가용이며 법률 자문 확정안이 아님.

실제 배포 전 확인 필요:
- 근로기준법상 근로조건 명시 의무 항목
- 단시간 근로자 계약서 필수 명시 항목
- 전자문서/전자서명 효력 요건
- 개인정보 수집·이용·보관·파기 동의
- CI 저장/처리 가능 범위
- 사업자 검증 API 이용 약관
