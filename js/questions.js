/* =========================================================================
 * KRS 파일럿 설문 - 문항 데이터 (파일럿계획.md §11 최종 질문지 기준)
 * -------------------------------------------------------------------------
 * · 3번 문항(흐름·자립, '14번과 겹쳐 제외')은 제외 → 객관식 12 + 주관식 2 = 14문항
 * · 6번(재밌던책)만 레벨(K1/K3/K7)에 따라 선택지가 바뀜 (branchByLevel)
 * · 11번(문장수집)은 관찰자용 [이 문항 건너뛰기] 허용 (skippable)
 * · 이미지: 각 문항 image, 각 선택지 img 에 경로를 넣으면 자동 표시(없으면 숨김)
 *     예) image: "images/q5_book.png"  /  options:[{label:'…', img:'images/opt_a.png'}]
 * ========================================================================= */
window.KRS_QUESTIONS = [
  // ── 전체 경험 ─────────────────────────────────────────────
  {
    num: 1, key: "전체만족", section: "전체 경험", point: "전체 만족도", type: "single",
    text: "오늘 이야기도 읽고 여러 활동도 해봤는데, 어땠어?", image: null,
    options: [
      { label: "재미있었다", emoji: "😄" },
      { label: "그냥 그랬다", emoji: "😐" },
      { label: "재미없었다", emoji: "😣" },
    ],
  },
  {
    num: 2, key: "분량", section: "전체 경험", point: "분량(전체)", type: "single",
    text: "오늘 한 활동은 많다고 느꼈어, 적다고 느꼈어?", image: null,
    options: [
      { label: "많았다" },
      { label: "딱 좋았다" },
      { label: "적었다" },
    ],
  },
  {
    num: 3, key: "재방문", section: "전체 경험", point: "재방문 의향", type: "single",
    text: "다음에도 이렇게 이야기 읽고 활동해보고 싶어?", image: null,
    options: [
      { label: "하고 싶다", emoji: "😄" },
      { label: "잘 모르겠다", emoji: "😐" },
      { label: "하고 싶지 않다", emoji: "😣" },
    ],
  },

  // ── 코어 리딩북 ───────────────────────────────────────────
  {
    num: 4, key: "완독", section: "코어 리딩북", point: "완독 여부", type: "single",
    text: "코어 리딩북을 끝까지 다 읽었어?", image: null,
    options: [
      { label: "다 읽었다" },
      { label: "거의 다 읽었다" },
      { label: "아직 다 못 읽었다" },
    ],
  },
  {
    num: 5, key: "재밌던책", section: "코어 리딩북", point: "이야기 흥미 (레벨 분기)", type: "single",
    text: "책에서 가장 재미있었던 이야기는 뭐야?", image: null,
    hint: "책을 보여주고 그 안에서 고르게 해주세요",
    branchByLevel: true,
    optionsByLevel: {
      K1: [
        { label: "누구 똥?" },
        { label: "나무가 쿨쿨" },
        { label: "오르락내리락" },
        { label: "상상의 숲" },
        { label: "숲속의 하루" },
      ],
      K3: [
        { label: "용기 사탕" },
        { label: "달팽이가 나타났어요!" },
        { label: "쓰레기의 변신" },
        { label: "문해력 놀이터" },
      ],
      K7: [
        { label: "강물 위의 초능력자" },
        { label: "빙글빙글 지폐" },
        { label: "연기가 솔솔" },
        { label: "수상한 곰팡이" },
        { label: "페르세우스의 모험" },
      ],
    },
  },
  {
    num: 6, key: "이해도", section: "코어 리딩북", point: "이해도 및 난이도", type: "single",
    text: "이야기가 무슨 내용인지 “알겠다”는 생각이 들었어?", image: null,
    options: [
      { label: "잘 알겠다", emoji: "😄" },
      { label: "조금 알겠다", emoji: "😐" },
      { label: "잘 모르겠다", emoji: "😣" },
    ],
  },
  {
    num: 7, key: "삽화", section: "코어 리딩북", point: "삽화 선호", type: "single",
    text: "책에 있는 그림(사진)은 마음에 들었어?", image: null,
    options: [
      { label: "좋았다", emoji: "😄" },
      { label: "그냥 그랬다", emoji: "😐" },
      { label: "별로였다", emoji: "😣" },
    ],
  },

  // ── 디지털 ────────────────────────────────────────────────
  {
    num: 8, key: "퀴즈난이도", section: "디지털", point: "독후 퀴즈 난이도", type: "single",
    text: "책 읽고 푼 퀴즈는 어땠어?", image: null,
    options: [
      { label: "쉬웠다" },
      { label: "보통이었다" },
      { label: "어려웠다" },
    ],
  },
  {
    num: 9, key: "뷰어미션", section: "디지털", point: "뷰어미션 도움도", type: "single",
    text: "교과 스키마북 읽을 때 나오는 읽기 미션은 계속 읽는 데 도움이 됐어?", image: null,
    options: [
      { label: "도움 됐다", emoji: "😄" },
      { label: "보통이었다", emoji: "😐" },
      { label: "도움 안 됐다", emoji: "😣" },
    ],
  },
  {
    num: 10, key: "어휘챌린지", section: "디지털", point: "어휘 챌린지 흥미", type: "single",
    text: "어휘 챌린지 게임은 재미있었어?", image: null,
    options: [
      { label: "재미있었다", emoji: "😄" },
      { label: "그냥 그랬다", emoji: "😐" },
      { label: "재미없었다", emoji: "😣" },
    ],
  },
  {
    num: 11, key: "문장수집", section: "디지털", point: "나만의 문장 수집", type: "single",
    text: "마음에 드는 문장을 골라 생각을 적는 활동은 어땠어?", image: null,
    skippable: true,
    hint: "이 활동을 못 한 아이는 [이 문항 건너뛰기]를 눌러주세요",
    options: [
      { label: "재미있었다", emoji: "😄" },
      { label: "그냥 그랬다", emoji: "😐" },
      { label: "어려웠다", emoji: "😣" },
    ],
  },

  // ── 보상 ──────────────────────────────────────────────────
  {
    num: 12, key: "보상만족", section: "보상", point: "보상 만족도", type: "single",
    text: "별을 모아 빙고 게임까지 했는데, 재미있었어?", image: null,
    options: [
      { label: "재미있었다", emoji: "😄" },
      { label: "그냥 그랬다", emoji: "😐" },
      { label: "재미없었다", emoji: "😣" },
    ],
  },

  // ── 주관식 ────────────────────────────────────────────────
  {
    num: 13, key: "막힌곳", section: "주관식", point: "흐름·자립", type: "text",
    text: "오늘 하다가 “이거 어떻게 하는 거지?” 하고 멈칫하거나 막힌 데 있었어? 어디였어?",
    image: null, placeholder: "아이 말 그대로 적어주세요",
  },
  {
    num: 14, key: "최고활동", section: "주관식", point: "전체 경험·선호", type: "text",
    text: "오늘 한 것 중에 가장 재미있었던 건 뭐야?",
    image: null, placeholder: "아이 말 그대로 적어주세요",
  },
];
