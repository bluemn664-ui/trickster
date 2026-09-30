// =========================================
// common.js
// 모든 페이지가 함께 쓰는 기능
// =========================================

// 휴대폰 화면에서 메뉴 열기 / 닫기
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", function () {
  navMenu.classList.toggle("open");
});

// 푸터에 올해 연도 자동 표시
document.getElementById("year").textContent = new Date().getFullYear();
