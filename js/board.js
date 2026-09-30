// =========================================
// board.js
// 동화 게시판: 내 동화 올리기
// 지금은 서버가 없어서 이 브라우저(localStorage)에만 저장돼요.
// =========================================

// ----- 1. 필요한 요소 가져오기 -----
const noStory = document.getElementById("no-story");
const uploadForm = document.getElementById("upload-form");
const nicknameInput = document.getElementById("nickname");
const uploadMessage = document.getElementById("upload-message");
const doneMessage = document.getElementById("done-message");
const waitingArea = document.getElementById("waiting-area");
const waitingList = document.getElementById("waiting-list");

// ----- 2. 저장소 읽기 / 쓰기 함수 -----
// 저장이 막힌 브라우저에서도 페이지가 멈추지 않도록 try / catch 로 감싸요
function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

// ----- 3. 메인화면에서 완성한 동화 불러오기 -----
// 메인화면의 [게시판에 올리기] 버튼이 "trickster-my-story" 에 저장해 둔 동화
const myStory = readStorage("trickster-my-story");

if (myStory) {
  document.getElementById("preview-title").textContent = myStory.title;
  document.getElementById("preview-body").textContent = myStory.body;
  uploadForm.hidden = false;
} else {
  noStory.hidden = false;
}

// ----- 4. 올리기 -----
uploadForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nickname = nicknameInput.value.trim();
  if (nickname === "") {
    uploadMessage.textContent = "별명을 적어 주세요.";
    nicknameInput.focus();
    return;
  }

  // 선생님 확인을 기다리는 목록에 추가
  const waiting = readStorage("trickster-waiting") || [];
  waiting.push({
    nickname: nickname,
    title: myStory.title,
    body: myStory.body,
    date: new Date().toLocaleDateString("ko-KR")
  });

  if (!writeStorage("trickster-waiting", waiting)) {
    uploadMessage.textContent = "저장하지 못했어요. 브라우저 설정을 확인해 주세요.";
    return;
  }

  // 같은 동화를 두 번 올리지 않도록 지워 두기
  try {
    localStorage.removeItem("trickster-my-story");
  } catch (error) {}

  uploadForm.hidden = true;
  doneMessage.hidden = false;
  showWaitingList();
});

// ----- 5. 확인을 기다리는 내 동화 보여주기 -----
function showWaitingList() {
  const waiting = readStorage("trickster-waiting") || [];
  if (waiting.length === 0) {
    return;
  }

  waitingList.innerHTML = "";
  waiting.forEach(function (story) {
    const item = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = story.title + " (" + story.nickname + ", " + story.date + ")";

    const label = document.createElement("span");
    label.className = "waiting-label";
    label.textContent = "선생님 확인 중";

    item.appendChild(text);
    item.appendChild(label);
    waitingList.appendChild(item);
  });

  waitingArea.hidden = false;
}

showWaitingList();
