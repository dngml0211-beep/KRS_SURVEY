/* =========================================================================
 * KRS 파일럿 설문 - 문항 데이터 (파일럿계획.md §11 기준 + 현장 반영)
 * -------------------------------------------------------------------------
 * · 질문·선택지 말투: 존댓말(~요/~어요)로 통일 (도서 제목 선택지는 원문 유지)
 * · '재밌던책'/'어려운이야기'는 레벨(K1/K3/K7)에 따라 선택지·이미지 분기 (branchByLevel/imageByLevel)
 * · '어려운이야기'는 이해도가 '잘 모르겠어요.'일 때만 노출 (showIf)
 * · '문장수집'은 K1에서만 노출(showForLevels), 관찰자용 [건너뛰기] 허용(skippable)
 * · 이미지: image / imageByLevel(레벨분기). 경로 없으면 자동 숨김
 * ========================================================================= */

// 레벨별 이야기 목록 (재밌던책 · 어려운이야기 공용)
var STORY_OPTIONS = {
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
};
var STORY_IMAGES = { K1: "images/k1_story.jpg", K3: "images/k3_story.jpg", K7: "images/k7_story.jpg" };
var CORE_IMAGES = { K1: "images/k1_core.jpg", K3: "images/k3_core.jpg", K7: "images/k7_core.jpg" };

window.KRS_QUESTIONS = [
  // ── 전체 경험 ─────────────────────────────────────────────
  {
    num: 1, key: "전체만족", section: "전체 경험", point: "전체 만족도", type: "single",
    text: "오늘 이야기도 읽고 여러 활동도 해봤는데, 어땠어요?", image: "images/how.webp",
    options: [
      { label: "재미있었어요.", emoji: "😄" },
      { label: "그냥 그랬어요.", emoji: "😐" },
      { label: "재미없었어요.", emoji: "😣" },
    ],
  },
  {
    num: 2, key: "분량", section: "전체 경험", point: "분량(전체)", type: "single",
    text: "오늘 한 활동은 많다고 느꼈나요, 적다고 느꼈나요?", image: "images/amount.webp",
    options: [
      { label: "많았어요." },
      { label: "딱 좋았어요." },
      { label: "적었어요." },
    ],
  },
  {
    num: 3, key: "재방문", section: "전체 경험", point: "재방문 의향", type: "single",
    text: "다음에도 이렇게 이야기 읽고 활동해보고 싶어요?", image: "images/next.webp",
    options: [
      { label: "하고 싶어요.", emoji: "😄" },
      { label: "잘 모르겠어요.", emoji: "😐" },
      { label: "하고 싶지 않아요.", emoji: "😣" },
    ],
  },

  // ── 코어 리딩북 ───────────────────────────────────────────
  {
    num: 4, key: "읽은시점", section: "코어 리딩북", point: "읽은 시점", type: "single",
    text: "코어 리딩북을 언제 읽었나요?",
    imageByLevel: CORE_IMAGES,
    options: [
      { label: "책을 미리 받아서 읽었어요." },
      { label: "오늘 여기서 처음 읽었어요." },
    ],
  },
  {
    num: 5, key: "완독", section: "코어 리딩북", point: "완독 여부", type: "single",
    text: "코어 리딩북을 끝까지 다 읽었어요?",
    imageByLevel: CORE_IMAGES,
    options: [
      { label: "다 읽었어요." },
      { label: "거의 다 읽었어요." },
      { label: "아직 다 못 읽었어요." },
    ],
  },
  {
    num: 6, key: "재밌던책", section: "코어 리딩북", point: "이야기 흥미 (레벨 분기)", type: "single",
    text: "책에서 가장 재미있었던 이야기는 뭐예요?",
    imageByLevel: STORY_IMAGES,
    branchByLevel: true,
    optionsByLevel: STORY_OPTIONS,
  },
  {
    num: 7, key: "이해도", section: "코어 리딩북", point: "이해도 및 난이도", type: "single",
    text: "이야기가 무슨 내용인지 “알겠다”는 생각이 들었어요?", image: "images/think.webp",
    options: [
      { label: "잘 알겠어요.", emoji: "😄" },
      { label: "조금 알겠어요.", emoji: "😐" },
      { label: "잘 모르겠어요.", emoji: "😣" },
    ],
  },
  {
    // 조건부: 이해도가 '잘 모르겠어요.'일 때만 노출
    num: 8, key: "어려운이야기", section: "코어 리딩북", point: "어려웠던 이야기", type: "single",
    text: "어떤 이야기가 이해하기 어려웠어요? 😥",
    showIf: { key: "이해도", in: ["잘 모르겠어요."] },
    imageByLevel: STORY_IMAGES,
    branchByLevel: true,
    optionsByLevel: STORY_OPTIONS,
  },
  {
    num: 9, key: "삽화", section: "코어 리딩북", point: "삽화 선호", type: "single",
    text: "책에 있는 그림(사진)은 마음에 들었어요?",
    imageByLevel: { K1: "images/k1_img.jpg", K3: "images/k3_img.jpg", K7: "images/k7_img.jpg" },
    options: [
      { label: "좋았어요.", emoji: "😄" },
      { label: "그냥 그랬어요.", emoji: "😐" },
      { label: "별로였어요.", emoji: "😣" },
    ],
  },

  // ── 디지털 ────────────────────────────────────────────────
  {
    num: 10, key: "퀴즈난이도", section: "디지털", point: "독후 퀴즈 난이도", type: "single",
    text: "책 읽고 푼 퀴즈는 어땠어요?",
    imageByLevel: { K1: "images/k1_quiz.jpg", K3: "images/k3_quiz.jpg", K7: "images/k7_quiz.jpg" },
    options: [
      { label: "쉬웠어요." },
      { label: "보통이었어요." },
      { label: "어려웠어요." },
    ],
  },
  {
    num: 11, key: "뷰어미션", section: "디지털", point: "뷰어미션 도움도", type: "single",
    text: "교과 스키마북 읽을 때 나오는 읽기 미션은 계속 읽는 데 도움이 됐어요?",
    imageByLevel: { K1: "images/k1_mission.jpg", K3: "images/k3_mission.jpg", K7: "images/k7_mission.jpg" },
    options: [
      { label: "도움 됐어요.", emoji: "😄" },
      { label: "보통이었어요.", emoji: "😐" },
      { label: "도움 안 됐어요.", emoji: "😣" },
    ],
  },
  {
    num: 12, key: "어휘챌린지", section: "디지털", point: "어휘 챌린지 흥미", type: "single",
    text: "어휘 챌린지 게임은 재미있었어요?",
    imageByLevel: { K1: "images/k1_voca.jpg", K3: "images/k3_voca.jpg", K7: "images/k7_voca.jpg" },
    options: [
      { label: "재미있었어요.", emoji: "😄" },
      { label: "그냥 그랬어요.", emoji: "😐" },
      { label: "재미없었어요.", emoji: "😣" },
    ],
  },
  {
    num: 13, key: "문장수집", section: "디지털", point: "나만의 문장 수집", type: "single",
    text: "마음에 드는 문장을 골라 생각을 적는 활동은 어땠어요?", image: null,
    showForLevels: ["K1"],   // K1에서만 노출 (K3/K7은 활동 없음)
    skippable: true,
    hint: "이 활동을 못 한 아이는 [이 문항 건너뛰기]를 눌러주세요",
    options: [
      { label: "재미있었어요.", emoji: "😄" },
      { label: "그냥 그랬어요.", emoji: "😐" },
      { label: "어려웠어요.", emoji: "😣" },
    ],
  },

  // ── 보상 ──────────────────────────────────────────────────
  {
    num: 14, key: "보상만족", section: "보상", point: "보상 만족도", type: "single",
    text: "별을 모아 빙고 게임까지 했는데, 재미있었어요?",
    image: "images/bingo.jpg",
    options: [
      { label: "재미있었어요.", emoji: "😄" },
      { label: "그냥 그랬어요.", emoji: "😐" },
      { label: "재미없었어요.", emoji: "😣" },
    ],
  },

  // ── 주관식 ────────────────────────────────────────────────
  {
    num: 15, key: "막힌곳", section: "주관식", point: "흐름·자립", type: "text",
    text: "오늘 하다가 “이거 어떻게 하는 거지?” 하고 멈칫하거나 막힌 데 있었어요? 어디였어요?",
    image: "images/stop.webp", placeholder: "아이 말 그대로 적어주세요",
  },
  {
    num: 16, key: "최고활동", section: "주관식", point: "전체 경험·선호", type: "text",
    text: "오늘 한 것 중에 가장 재미있었던 건 뭐예요?",
    image: "images/joy.webp", placeholder: "아이 말 그대로 적어주세요",
  },
];
