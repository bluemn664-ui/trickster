// =========================================
// main.js
// 메인화면의 동화 만들기(글쓰기) 기능
// =========================================

// ----- 1. 재료 뽑기에 쓸 목록 (자유롭게 추가하세요) -----

// 트릭스터: 사이트에서 읽은 주인공들. 꾀나 재주가 드러나는 말을 앞에 붙여요.
const tricksters = [
  "꾀 많은 토끼",
  "흉내쟁이 호랑이",
  "변신술의 달인 손오공",
  "술로 꾀를 낸 스사노오",
  "불을 가져온 코요테",
  "이야기를 모은 거미 아난시",
  "차솥으로 변신하는 너구리",
  "장난꾸러기 신 로키",
  "느림보 거북 자부치"
];

// 상대: 힘이 세거나 높은 쪽. 꼭 약점을 하나 붙여요. (4단계 '뒤집기'의 실마리가 돼요)
const rivals = [
  "욕심 많은 호랑이",
  "잠꾸러기 거인",
  "심술궂은 용",
  "허풍쟁이 사자",
  "고집 센 임금님",
  "뽐내기 좋아하는 사슴",
  "무엇이든 믿어 버리는 도깨비"
];

// 배경: 뒤집기 도구가 될 물건이나 특징이 보이는 장소
const places = [
  "꽁꽁 언 강",
  "깊은 우물이 있는 숲",
  "안개 낀 강가",
  "바닷속 용궁",
  "시끌벅적한 시장",
  "구름 위 하늘나라",
  "메아리가 울리는 동굴"
];

// 목록에서 하나를 무작위로 고르는 함수
function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// 낱말 뒤에 알맞은 조사 붙이기: 받침이 있으면 "이", 없으면 "가"
// 예) 손오공 → 손오공이, 토끼 → 토끼가
function addJosa(word) {
  const code = word.charCodeAt(word.length - 1) - 0xAC00;
  const isHangul = code >= 0 && code <= 11171;
  const hasBatchim = isHangul && code % 28 !== 0;
  return word + (hasBatchim ? "이" : "가");
}

// ----- 2. 필요한 요소 가져오기 -----
const form = document.getElementById("story-form");
const titleInput = document.getElementById("story-title");
const stepInputs = [
  document.getElementById("step1"),
  document.getElementById("step2"),
  document.getElementById("step3"),
  document.getElementById("step4"),
  document.getElementById("step5"),
  document.getElementById("step6")
];
const choiceButtons = document.querySelectorAll(".choice");
const formMessage = document.getElementById("form-message");
const result = document.getElementById("result");

let selectedResult = ""; // 5단계에서 고른 결과 (성공 / 실패 / 전혀 새로운 결과)

// ----- 3. 재료 뽑기 -----
document.getElementById("pick-btn").addEventListener("click", function () {
  const trickster = pickOne(tricksters);
  const rival = pickOne(rivals);
  const place = pickOne(places);

  document.getElementById("pick-trickster").textContent = trickster;
  document.getElementById("pick-rival").textContent = rival;
  document.getElementById("pick-place").textContent = place;

  // 주인공, 상대 칸이 비어 있을 때만 뽑은 재료를 넣어 줌
  if (stepInputs[0].value.trim() === "") {
    stepInputs[0].value = place + "에 " + addJosa(trickster) + " 살았어요.";
  }
  if (stepInputs[2].value.trim() === "") {
    stepInputs[2].value = addJosa(rival) + " 길을 막고 있었어요.";
  }
  saveDraft();
});

// ----- 4. 뜻밖의 결과 선택 버튼 -----
choiceButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    choiceButtons.forEach(function (b) {
      b.classList.remove("selected");
    });
    button.classList.add("selected");
    selectedResult = button.dataset.result;
    saveDraft();
  });
});

// ----- 5. 이야기 완성 -----
form.addEventListener("submit", function (event) {
  event.preventDefault(); // 페이지가 새로고침되지 않게 막기

  // 비어 있는 칸 찾기
  if (titleInput.value.trim() === "") {
    showMessage("제목을 적어 주세요.", titleInput);
    return;
  }
  for (let i = 0; i < stepInputs.length; i++) {
    if (stepInputs[i].value.trim() === "") {
      showMessage((i + 1) + "단계 칸이 비어 있어요.", stepInputs[i]);
      return;
    }
  }
  formMessage.textContent = "";

  // 6개 문장을 이어서 동화 본문 만들기
  const sentences = stepInputs.map(function (input) {
    return addPeriod(input.value.trim());
  });

  document.getElementById("result-title").textContent = titleInput.value.trim();
  document.getElementById("result-body").textContent = sentences.join(" ");
  document.getElementById("result-choice").textContent = selectedResult ? "결과: " + selectedResult : "";

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth" });
});

// 안내 문구를 보여주고 해당 칸으로 이동
function showMessage(text, input) {
  formMessage.textContent = text;
  input.focus();
}

// 문장 끝에 마침표가 없으면 붙여 주기
function addPeriod(text) {
  const last = text.charAt(text.length - 1);
  if (last === "." || last === "!" || last === "?") {
    return text;
  }
  return text + ".";
}

// ----- 6. 다시 쓰기 -----
document.getElementById("rewrite-btn").addEventListener("click", function () {
  if (!confirm("쓴 내용을 모두 지우고 처음부터 다시 쓸까요?")) {
    return;
  }
  form.reset();
  selectedResult = "";
  choiceButtons.forEach(function (b) {
    b.classList.remove("selected");
  });
  result.hidden = true;
  removeDraft();
  form.scrollIntoView({ behavior: "smooth" });
});

// ----- 7. 게시판에 올리기 -----
// 완성한 동화를 브라우저에 저장한 뒤 게시판 페이지로 이동
document.getElementById("board-btn").addEventListener("click", function () {
  const myStory = {
    title: document.getElementById("result-title").textContent,
    body: document.getElementById("result-body").textContent,
    hero: stepInputs[0].value.trim()
  };
  try {
    localStorage.setItem("trickster-my-story", JSON.stringify(myStory));
  } catch (error) {
    // 저장이 막힌 브라우저에서는 그냥 넘어감
  }
  location.href = "html/board.html";
});

// ----- 8. 쓰던 글 자동 저장 / 불러오기 -----
// 새로고침하거나 다른 페이지에 다녀와도 쓰던 글이 남아 있게 해 줌
function saveDraft() {
  const draft = {
    title: titleInput.value,
    steps: stepInputs.map(function (input) {
      return input.value;
    }),
    result: selectedResult
  };
  try {
    localStorage.setItem("trickster-draft", JSON.stringify(draft));
  } catch (error) {}
}

function loadDraft() {
  let draft = null;
  try {
    draft = JSON.parse(localStorage.getItem("trickster-draft"));
  } catch (error) {}
  if (!draft) {
    return;
  }

  titleInput.value = draft.title || "";
  stepInputs.forEach(function (input, i) {
    input.value = draft.steps[i] || "";
  });
  selectedResult = draft.result || "";
  choiceButtons.forEach(function (b) {
    if (b.dataset.result === selectedResult) {
      b.classList.add("selected");
    }
  });
}

function removeDraft() {
  try {
    localStorage.removeItem("trickster-draft");
  } catch (error) {}
}

form.addEventListener("input", saveDraft); // 글자를 입력할 때마다 저장
loadDraft(); // 페이지를 열 때 저장된 글 불러오기

// ----- 9. 지역 페이지에서 넘어왔을 때 주인공 칸 채우기 -----
// 지역 페이지의 [이 트릭스터처럼 이야기 만들기] 버튼은 index0930.html?hero=호랑이#write 처럼 이동해요
const heroName = new URLSearchParams(location.search).get("hero");
if (heroName && stepInputs[0].value.trim() === "") {
  stepInputs[0].value = heroName + "처럼 꾀 많은 주인공이 살았어요.";
  saveDraft();
}
