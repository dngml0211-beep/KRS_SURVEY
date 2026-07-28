/* =========================================================================
 * KRS 파일럿 설문 - 문항 데이터 (파일럿계획.md §11 기준 + 현장 반영)
 * -------------------------------------------------------------------------
 * · 질문·선택지 말투: 존댓말(~요/~어요)로 통일 (도서 제목 선택지는 원문 유지)
 * · '재밌던책'/'어려운이야기'는 레벨(K1/K3/K7)에 따라 선택지·이미지 분기 (branchByLevel/imageByLevel)
 * · '재밌던책'(6번)은 단일선택(1개, '없었어요' 포함). '어려운이야기'(8번)는 복수선택(multi)이며 7번에서 '어려운 이야기도 있었어요.' 선택 시에만 노출(showIf)
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

// '재밌던책'(6번) 전용: 레벨별 도서 목록 뒤에 공통 '없었어요' 추가
// (STORY_OPTIONS 원본은 8번 '어려운이야기'와 공유하므로 건드리지 않고 concat으로 복제)
var FUN_STORY_OPTIONS = {
  K1: STORY_OPTIONS.K1.concat([{ label: "없었어요", variant: "none" }]),
  K3: STORY_OPTIONS.K3.concat([{ label: "없었어요", variant: "none" }]),
  K7: STORY_OPTIONS.K7.concat([{ label: "없었어요", variant: "none" }]),
};

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
      { label: "딱 좋았어요." },
      { label: "너무 많았어요." },
      { label: "조금 부족했어요." },
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
    num: 5, key: "혼자읽기", section: "코어 리딩북", point: "혼자 읽기 (자립)", type: "single",
    text: "책을 혼자서 읽을 수 있었어요?",
    imageByLevel: CORE_IMAGES,
    options: [
      { label: "혼자서도 충분했어요!", emoji: "😄" },
      { label: "조금 도움 받았어요.", emoji: "😅" },
      { label: "많이 어려웠어요.", emoji: "😣" },
    ],
  },
  {
    num: 6, key: "재밌던책", section: "코어 리딩북", point: "이야기 흥미 (레벨 분기)", type: "single",
    text: "책에서 가장 재미있던 이야기는 뭐예요? 😄",
    imageByLevel: STORY_IMAGES,
    branchByLevel: true,
    optionsByLevel: FUN_STORY_OPTIONS,
  },
  {
    num: 7, key: "어려움여부", section: "코어 리딩북", point: "어려운 이야기 유무", type: "single",
    text: "혹시 어려웠던 이야기도 있었어요?", image: "images/think.webp",
    options: [
      { label: "다 재밌었어요.", emoji: "😄" },
      { label: "어려운 이야기도 있었어요.", emoji: "😥" },
    ],
  },
  {
    // 조건부: 7번에서 '어려운 이야기도 있었어요.' 선택 시에만 노출 · 복수선택
    num: 8, key: "어려운이야기", section: "코어 리딩북", point: "어려웠던 이야기 (레벨 분기)", type: "single",
    text: "어떤 이야기가 이해하기 어려웠어요? 😥",
    hint: "여러 개 고를 수 있어요",
    multi: true,
    showIf: { key: "어려움여부", in: ["어려운 이야기도 있었어요."] },
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

  // ── 동기부여 ──────────────────────────────────────────────
  {
    num: 12, key: "보상만족", section: "동기부여", point: "재독 동기부여", type: "single",
    text: "빙고를 완성하기 위해 책을 더 읽고 싶을 것 같아요?",
    image: "images/bingo.jpg",
    options: [
      { label: "열심히 할 것 같아요.", emoji: "😄" },
      { label: "잘 모르겠어요.", emoji: "😐" },
      { label: "안할 것 같아요.", emoji: "😣" },
    ],
  },

  // ── 주관식 ────────────────────────────────────────────────
  {
    num: 13, key: "막힌곳", section: "주관식", point: "흐름·자립", type: "text",
    text: "오늘 하다가 “이거 어떻게 하는 거지?” 하고 멈칫하거나 막힌 데 있었어요? 어디였어요?",
    image: "images/stop.webp", placeholder: "생각한 내용을 적어주세요",
  },
  {
    num: 14, key: "최고활동", section: "주관식", point: "전체 경험·선호", type: "text",
    text: "오늘 한 것 중에 가장 재미있었던 건 뭐예요?",
    image: "images/joy.webp", placeholder: "생각한 내용을 적어주세요",
  },
];
