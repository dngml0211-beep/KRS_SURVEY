/* =========================================================================
 * KRS 파일럿 설문 - 환경 설정
 * -------------------------------------------------------------------------
 * 데이터 수집(2단계)에서 Power Automate 플로우를 만든 뒤,
 * 발급받은 "HTTP POST URL"을 아래 SUBMIT_URL 에 붙여넣으면 연결됩니다.
 * (비워두면 응답은 이 기기(localStorage)에만 저장되고, 언제든 CSV로 내보낼 수 있습니다.)
 * ========================================================================= */
window.KRS_CONFIG = {
  // [옵션 A] Power Automate/서버 POST URL (엔드포인트-무관). 비우면 사용 안 함.
  SUBMIT_URL: "",

  // [옵션 B] Firebase(Firestore) 자동수집 — Firebase 콘솔 > 프로젝트 설정 > 웹 앱의 config 값을 그대로 붙여넣으세요.
  //   projectId 와 apiKey 가 채워지면 자동으로 Firestore 로 전송됩니다. (비어 있으면 localStorage 저장만)
  FIREBASE: {
    apiKey: "AIzaSyBSiXXpDqnMqyZ7X073xyjEzxcJ9TSdKRE",
    authDomain: "krs-survey.firebaseapp.com",
    projectId: "krs-survey",
    storageBucket: "krs-survey.firebasestorage.app",
    messagingSenderId: "335094163162",
    appId: "1:335094163162:web:218596f608e45014e0a7e3",
  },
  FIREBASE_COLLECTION: "responses", // 응답이 쌓일 Firestore 컬렉션 이름

  // 대시보드(dashboard.html) 공통 로그인용 이메일. Firebase Authentication 에 이 이메일로
  // 계정 1개를 만들고, 그 비밀번호를 관찰자들이 공유합니다. (비밀번호는 코드에 넣지 않음)
  DASHBOARD_EMAIL: "krs-dashboard@thinkbig.co",

  // 시작 화면에서 고를 수 있는 레벨 (필요 시 여기만 추가하면 됨. questions.js 의 optionsByLevel 도 함께 확장)
  LEVELS: ["K1", "K3", "K7"],

  // 나이 입력 허용 범위
  AGE_MIN: 4,
  AGE_MAX: 15,
};
