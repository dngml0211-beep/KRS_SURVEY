/* =========================================================================
 * KRS 파일럿 설문 - 앱 로직 (바닐라 JS)
 * · 화면 전환(시작→설문→결과) · 레벨 분기 · 유효성 · 건너뛰기
 * · 저장: Firebase(Firestore) 자동 전송. 성공하면 기기에 안 남김,
 *   실패/미연결 시에만 localStorage 에 임시 보관 후 자동 재전송
 * ========================================================================= */
(function () {
  "use strict";

  var CFG = window.KRS_CONFIG || {};
  var QUESTIONS = window.KRS_QUESTIONS || [];

  var LS_PENDING = "krs_pending"; // 전송 대기(실패) 응답 — 전송 성공 시 기기에 남기지 않음

  var state = {
    respondent: { 이름: "", 나이: "", 레벨: "" },
    answers: {},
    idx: 0,
  };

  // Firebase(Firestore) — config 채워지면 활성화
  var FB_READY = false, fbDB = null;
  function initFirebase() {
    try {
      var fc = CFG.FIREBASE;
      if (window.firebase && fc && fc.apiKey && fc.projectId) {
        if (!firebase.apps.length) firebase.initializeApp(fc);
        fbDB = firebase.firestore();
        FB_READY = true;
      }
    } catch (e) { FB_READY = false; fbDB = null; }
  }
  function hasBackend() { return FB_READY || !!CFG.SUBMIT_URL; }

  // ---- helpers ----------------------------------------------------------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function show(id) {
    var scr = document.querySelectorAll(".screen");
    for (var i = 0; i < scr.length; i++) scr[i].classList.remove("active");
    $("#" + id).classList.add("active");
    $("#topbar").style.display = (id === "screen-survey") ? "block" : "none";
    window.scrollTo(0, 0);
  }
  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function optionsFor(q) {
    if (q.branchByLevel) return (q.optionsByLevel[state.respondent.레벨] || []);
    return q.options || [];
  }
  function imageFor(q) {
    if (q.imageByLevel) return q.imageByLevel[state.respondent.레벨] || null;
    return q.image || null;
  }
  // 조건부 문항: 레벨(showForLevels) · 이전 답변(showIf) 조건 만족할 때만 노출
  function shouldShow(idx) {
    var q = QUESTIONS[idx];
    if (!q) return true;
    if (q.showForLevels && q.showForLevels.indexOf(state.respondent.레벨) === -1) return false;
    if (!q.showIf) return true;
    var c = q.showIf, ans = state.answers[c.key];
    if (c.in) return c.in.indexOf(ans) !== -1;
    if (c.equals !== undefined) return ans === c.equals;
    if (c.notEquals !== undefined) return ans != null && ans !== "" && ans !== c.notEquals;
    return true;
  }
  function visibleIndices() {
    var arr = [];
    for (var i = 0; i < QUESTIONS.length; i++) if (shouldShow(i)) arr.push(i);
    return arr;
  }
  function nextVisible(from) {
    for (var i = from + 1; i < QUESTIONS.length; i++) if (shouldShow(i)) return i;
    return -1;
  }
  function prevVisible(from) {
    for (var i = from - 1; i >= 0; i--) if (shouldShow(i)) return i;
    return -1;
  }

  // ---- intro ------------------------------------------------------------
  function initIntro() {
    // 레벨 버튼 생성
    var group = $("#level-group");
    (CFG.LEVELS || []).forEach(function (lv) {
      var b = el("button", "level-btn", lv);
      b.type = "button";
      b.addEventListener("click", function () {
        state.respondent.레벨 = lv;
        var all = group.querySelectorAll(".level-btn");
        for (var i = 0; i < all.length; i++) all[i].classList.remove("selected");
        b.classList.add("selected");
      });
      group.appendChild(b);
    });

    $("#start-btn").addEventListener("click", startSurvey);

    refreshStatusLine();
  }

  function refreshStatusLine() {
    var pend = lsGet(LS_PENDING).length;
    var msg = hasBackend() ? "완료하면 자동으로 저장돼요." : "이 기기에 임시 저장돼요.";
    $("#intro-foot").innerHTML = msg + (pend ? " · 전송 대기 <b>" + pend + "건</b>" : "");
  }

  function startSurvey() {
    var name = $("#in-name").value.trim();
    var age = $("#in-age").value.trim();

    if (!name) { toast("아이 이름을 입력해주세요"); $("#in-name").focus(); return; }
    var ageN = parseInt(age, 10);
    if (!age || isNaN(ageN) || ageN < (CFG.AGE_MIN || 1) || ageN > (CFG.AGE_MAX || 99)) {
      toast("나이를 확인해주세요"); $("#in-age").focus(); return;
    }
    if (!state.respondent.레벨) { toast("진행한 레벨을 선택해주세요"); return; }

    state.respondent.이름 = name;
    state.respondent.나이 = ageN;
    state.answers = {};
    state.idx = 0;

    show("screen-survey");
    renderQuestion();
  }

  // ---- survey render ----------------------------------------------------
  function renderQuestion() {
    var q = QUESTIONS[state.idx];

    // 진행률: 노출되는 문항 기준 (조건부 문항 반영)
    var vis = visibleIndices();
    var pos = vis.indexOf(state.idx);
    if (pos < 0) pos = 0;
    var vtotal = vis.length;

    // 왼쪽 pane: 섹션 · 진행 · 질문 · 힌트 · 이미지
    $("#sec-chip").textContent = q.section;
    $("#q-count").textContent = (pos + 1) + " / " + vtotal;
    $("#bar-fill").style.width = ((pos + 1) / vtotal * 100) + "%";
    $("#q-title").textContent = q.text;

    var hint = $("#q-hint");
    if (q.hint) { hint.textContent = "💡 " + q.hint; hint.style.display = ""; }
    else { hint.style.display = "none"; }

    var imgWrap = $("#q-image");
    imgWrap.innerHTML = "";
    var imgSrc = imageFor(q);
    if (imgSrc) {
      var img = el("img"); img.src = imgSrc; img.alt = "";
      img.onerror = function () { imgWrap.style.display = "none"; };
      imgWrap.appendChild(img); imgWrap.style.display = "";
    } else { imgWrap.style.display = "none"; }

    // 오른쪽 pane: 선택지 / 주관식
    var ans = $("#q-answer");
    ans.innerHTML = "";

    if (q.type === "text") {
      var ta = el("textarea", "textarea");
      ta.placeholder = q.placeholder || "";
      ta.value = state.answers[q.key] || "";
      ta.addEventListener("input", function () { state.answers[q.key] = ta.value; updateNav(); });
      ans.appendChild(ta);
    } else {
      optionsFor(q).forEach(function (o) {
        var btn = el("button", "opt"); btn.type = "button";
        if (o.emoji) btn.appendChild(el("span", "emoji", esc(o.emoji)));
        if (o.img) {
          var im = el("img", "opt-img"); im.src = o.img; im.alt = "";
          im.onerror = function () { im.style.display = "none"; };
          btn.appendChild(im);
        }
        btn.appendChild(el("span", "opt-label", esc(o.label)));
        btn.appendChild(el("span", "check"));
        if (state.answers[q.key] === o.label) btn.classList.add("selected");
        btn.addEventListener("click", function () {
          state.answers[q.key] = o.label;
          var all = ans.querySelectorAll(".opt");
          for (var i = 0; i < all.length; i++) all[i].classList.remove("selected");
          btn.classList.add("selected");
          updateNav();
        });
        ans.appendChild(btn);
      });
    }

    // 건너뛰기 (skippable)
    var skipRow = $("#skip-row");
    skipRow.innerHTML = "";
    if (q.skippable) {
      var sb = el("button", "btn-text", "이 문항 건너뛰기");
      sb.type = "button";
      sb.addEventListener("click", function () { state.answers[q.key] = "(건너뜀)"; goNext(); });
      skipRow.appendChild(sb);
    }

    $("#prev-btn").style.display = "";  // 항상 표시 (첫 문항에선 시작화면으로)
    $("#next-btn").textContent = (nextVisible(state.idx) === -1) ? "완료" : "다음";
    updateNav();
  }

  function isAnswered() {
    var q = QUESTIONS[state.idx];
    if (q.type === "text") return true;              // 주관식은 비워도 진행 허용
    return state.answers[q.key] != null && state.answers[q.key] !== "";
  }
  function updateNav() { $("#next-btn").disabled = !isAnswered(); }

  function goNext() {
    var n = nextVisible(state.idx);
    if (n === -1) showResult();
    else { state.idx = n; renderQuestion(); }
  }
  function goPrev() {
    var p = prevVisible(state.idx);
    if (p === -1) show("screen-intro");  // 첫 문항에서 [이전] → 시작화면
    else { state.idx = p; renderQuestion(); }
  }

  // ---- result -----------------------------------------------------------
  function showResult() {
    var r = state.respondent;
    $("#result-heading").innerHTML = "다 했어요!<br>" + esc(r.이름) + "님 정말 고마워요!";
    $("#result-meta").innerHTML =
      '<span class="tag">이름 <b>' + esc(r.이름) + "</b></span>" +
      '<span class="tag">나이 <b>' + esc(r.나이) + "살</b></span>" +
      '<span class="tag">레벨 <b>' + esc(r.레벨) + "</b></span>";

    var sum = $("#summary"); sum.innerHTML = "";
    QUESTIONS.forEach(function (q, i) {
      if (!shouldShow(i)) return;  // 조건부로 안 뜬 문항은 요약에서도 제외
      var v = state.answers[q.key];
      var item = el("div", "summary-item");
      item.appendChild(el("span", "s-q", q.num + ". " + esc(q.point)));
      var a = el("span", "s-a" + (v ? "" : " empty"), esc(v || "미응답"));
      item.appendChild(a);
      sum.appendChild(item);
    });

    setStatus("", "");
    show("screen-result");
    requestAnimationFrame(updateSummaryFade);
  }

  // 스크롤 위치에 따라 요약 목록 상·하단 페이드 토글 (넘칠 때만)
  function updateSummaryFade() {
    var s = $("#summary");
    if (!s) return;
    var atTop = s.scrollTop > 6;
    var atBottom = s.scrollTop + s.clientHeight < s.scrollHeight - 6;
    s.style.setProperty("--fade-top", atTop ? "24px" : "0px");
    s.style.setProperty("--fade-bottom", atBottom ? "24px" : "0px");
  }

  function buildRow() {
    var r = state.respondent;
    var row = {
      "타임스탬프": new Date().toISOString(),
      "이름": r.이름,
      "나이": r.나이,
      "레벨": r.레벨,
    };
    QUESTIONS.forEach(function (q, i) { row[q.key] = shouldShow(i) ? (state.answers[q.key] || "") : ""; });
    return row;
  }

  function setStatus(cls, msg) {
    var s = $("#save-status");
    s.className = "status" + (cls ? " show " + cls : "");
    s.textContent = msg || "";
  }

  // ---- save / submit ----------------------------------------------------
  function saveResponse() {
    var row = buildRow();

    if (!hasBackend()) {
      // 백엔드 미연결 시에만 임시 보관 (연결되면 자동 전송)
      var q0 = lsGet(LS_PENDING); q0.push(row); lsSet(LS_PENDING, q0);
      setStatus("warn", "저장 대기 — 서버 연결 후 자동 전송됩니다.");
      afterSave();
      return;
    }

    setStatus("ok", "전송 중…");
    sendRow(row).then(function () {
      setStatus("ok", "전송 완료! 저장되었습니다. ✓");
    }).catch(function () {
      var pend = lsGet(LS_PENDING); pend.push(row); lsSet(LS_PENDING, pend);
      setStatus("warn", "전송 실패 → 대기함에 보관했어요. 연결되면 자동 재전송됩니다.");
    }).then(afterSave);
  }

  function afterSave() {
    $("#save-btn").disabled = true;
    $("#save-btn").textContent = "저장됨 ✓";
  }

  // 백엔드로 한 행 전송 (Firebase 우선, 없으면 POST)
  function sendRow(row) {
    if (FB_READY) {
      return fbDB.collection(CFG.FIREBASE_COLLECTION || "responses").add(row).then(function () { return true; });
    }
    if (CFG.SUBMIT_URL) {
      // CORS 프리플라이트 회피: text/plain 로 JSON 문자열 전송
      return fetch(CFG.SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(row),
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return true;
      });
    }
    return Promise.reject(new Error("no-backend"));
  }

  function retryPending() {
    if (!hasBackend()) return;
    var pend = lsGet(LS_PENDING);
    if (!pend.length) return;
    var remain = [];
    var chain = Promise.resolve();
    pend.forEach(function (row) {
      chain = chain.then(function () {
        return sendRow(row).catch(function () { remain.push(row); });
      });
    });
    chain.then(function () {
      lsSet(LS_PENDING, remain);
      refreshStatusLine();
      if (pend.length !== remain.length) toast("대기 응답 " + (pend.length - remain.length) + "건 재전송 완료");
    });
  }

  // ---- wire result buttons ---------------------------------------------
  function initResult() {
    $("#save-btn").addEventListener("click", saveResponse);
    $("#edit-btn").addEventListener("click", function () { show("screen-survey"); renderQuestion(); });
    $("#new-btn").addEventListener("click", function () {
      // 시작 화면 초기화 (레벨은 유지해 같은 레벨 아이 연속 진행 편하게)
      $("#in-name").value = ""; $("#in-age").value = "";
      $("#save-btn").disabled = false; $("#save-btn").textContent = "저장하기";
      refreshStatusLine();
      show("screen-intro");
    });
    $("#summary").addEventListener("scroll", updateSummaryFade, { passive: true });
    window.addEventListener("resize", updateSummaryFade);
  }

  // ---- boot -------------------------------------------------------------
  function init() {
    if (!QUESTIONS.length) { document.body.innerHTML = "<p style='padding:24px'>questions.js 로드 실패</p>"; return; }
    initFirebase();
    initIntro();
    $("#prev-btn").addEventListener("click", goPrev);
    $("#next-btn").addEventListener("click", goNext);
    initResult();
    retryPending();
    show("screen-intro");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
