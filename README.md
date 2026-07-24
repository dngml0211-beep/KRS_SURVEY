# KRS_SURVEY

북클럽 3.0 플랫폼 파일럿 **아이 설문 웹페이지 + 실시간 대시보드**. (`파일럿계획.md` §11 최종 질문지 기준)

관찰자가 태블릿을 아이 앞에 두고 진행하며, 완료 시 응답 1건(아이 1명 = 문서 1개)이 **Firebase(Firestore)에 자동 저장**됩니다.
객관식 12문항 + 주관식 2문항, 6번 문항은 레벨(K1/K3/K7)에 따라 도서 목록이 바뀝니다.

## 구성

```
index.html        설문 — 3개 화면(시작 · 설문 · 결과), 패드 가로형 UI
dashboard.html    실시간 대시보드 — 문항별 그래프 · 레벨 필터 · CSV 내보내기
css/style.css     설문 디자인 시스템
js/config.js      ⚙️ Firebase 설정 등 — 여기만 수정
js/questions.js   설문 문항·선택지·레벨분기 (콘텐츠 편집은 여기서)
js/app.js         화면 전환·유효성·저장(Firebase 전송) 로직
images/           문항/선택지 이미지 자리 (선택)
```

## 실행 / 배포

- **로컬 테스트**: 이 폴더에서 `npx http-server -p 5500 -c-1` → `http://localhost:5500` (설문) / `http://localhost:5500/dashboard.html` (대시보드)
- **배포(GitHub Pages)**: 레포 **Settings → Pages → Branch: `main` / root** → 발급된 URL로 태블릿에서 접속
  - 설문: `https://<user>.github.io/KRS_SURVEY/`
  - 대시보드: `https://<user>.github.io/KRS_SURVEY/dashboard.html`

## 데이터 저장 — Firebase (Firestore)

- 설문 [저장하기] → Firestore 컬렉션 **`responses`** 에 문서 1건 자동 추가. 3대 태블릿이 같은 프로젝트로 **실시간 누적**.
- 전송 **성공 시 기기에 아무것도 남지 않음**(프라이버시). 전송 실패/오프라인 때만 임시 보관 후 **자동 재전송**.
- 설정값은 `js/config.js`의 `FIREBASE`에 들어 있음. (프로젝트: `krs-survey`)

### 데이터 스키마 (문서 1개 = 아이 1명, 필드 18개)
```
타임스탬프, 이름, 나이, 레벨, 전체만족, 분량, 재방문, 완독, 재밌던책,
이해도, 삽화, 퀴즈난이도, 뷰어미션, 어휘챌린지, 문장수집, 보상만족, 막힌곳, 최고활동
```

## 대시보드 (dashboard.html)

- Firestore를 **실시간으로 읽어** KPI · 문항별 분포 그래프 · 주관식 목록을 표시
- **레벨 필터**(전체/K1/K3/K7), **CSV 내보내기**(BOM 포함, 엑셀에서 바로 분석)

## 보안 (Firestore 규칙)

현재 규칙은 **공개**입니다 — 누구나 제출/조회 가능:
```
match /responses/{doc} {
  allow read, create: if true;    // 제출·조회 공개
  allow update, delete: if false; // 수정·삭제 차단(데이터 훼손 방지)
}
```
> ⚠️ 아이 실명이 담기므로, 필요 시 **로그인(공통 비밀번호) 방식**으로 잠글 수 있음:
> 규칙을 `allow read: if request.auth != null;` 로 바꾸고, Firebase Authentication에 공통 계정 1개(이메일=`config.js`의 `DASHBOARD_EMAIL`) 생성 → 대시보드가 비밀번호 입력을 요구함.

## 응답 삭제/관리

- 규칙상 대시보드/설문에서는 삭제 불가 → **Firebase 콘솔 > Firestore Database > 데이터** 에서만 관리
- 테스트 문서 등은 콘솔에서 직접 삭제
