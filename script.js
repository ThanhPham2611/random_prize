const WIN_RATE = 0.4;
const SHAKE_MIN_DURATION = 1100;
const SHAKE_MAX_DURATION = 1550;
const OPEN_REVEAL_DELAY = 280;
const DEFAULT_BADGE_TEXT = "Click để mở";
const OPENING_BADGE_TEXT = "Đang mở...";
const OPENED_BADGE_TEXT = "Hộp quà đã mở";

const giftButton = document.getElementById("giftButton");
const resultModal = document.getElementById("resultModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const playAgainButton = document.getElementById("playAgainButton");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const tapBadge = document.getElementById("tapBadge");

let isRolling = false;

const pickResult = () => Math.random() < WIN_RATE;

const randomDelay = () => {
  return Math.floor(Math.random() * (SHAKE_MAX_DURATION - SHAKE_MIN_DURATION + 1)) + SHAKE_MIN_DURATION;
};

const setBadgeText = (text) => {
  tapBadge.textContent = text;
};

const resetGiftState = () => {
  isRolling = false;
  giftButton.classList.remove("is-shaking", "is-open", "is-win");
  giftButton.style.removeProperty("--shake-duration");
  setBadgeText(DEFAULT_BADGE_TEXT);
};

const openModal = (isWin) => {
  resultModal.classList.add("is-visible");
  resultModal.setAttribute("aria-hidden", "false");

  const modalCard = resultModal.querySelector(".modal-card");
  modalCard.classList.remove("is-win", "is-lose");
  modalCard.classList.add(isWin ? "is-win" : "is-lose");

  if (isWin) {
    modalTag.textContent = "THE GARDEN";
    modalTitle.textContent = "Bạn Đã Trúng Thưởng!";
    modalMessage.textContent = "Cảm ơn bạn đã follow OA 💙. Chúc mừng bạn đã trúng 1.000 điểm Garden Club!";
  } else {
    modalTag.textContent = "THE GARDEN";
    modalTitle.textContent = "Chúc Bạn May Mắn Lần Sau";
    modalMessage.textContent = "Cảm ơn bạn đã follow OA 💙. Chúc bạn may mắn lần sau!";
  }

  playAgainButton.focus();
};

const closeModal = () => {
  resultModal.classList.remove("is-visible");
  resultModal.setAttribute("aria-hidden", "true");
  resetGiftState();
  giftButton.focus();
};

const finalizeSpin = (isWin) => {
  giftButton.classList.remove("is-shaking");
  giftButton.classList.add("is-open");
  giftButton.classList.toggle("is-win", isWin);
  setBadgeText(OPENED_BADGE_TEXT);

  window.setTimeout(() => {
    isRolling = false;
    openModal(isWin);
  }, OPEN_REVEAL_DELAY);
};

giftButton.addEventListener("click", () => {
  if (isRolling) {
    return;
  }

  const isWin = pickResult();
  const delay = randomDelay();

  isRolling = true;
  giftButton.classList.remove("is-open", "is-win");
  giftButton.classList.add("is-shaking");
  giftButton.style.setProperty("--shake-duration", `${delay}ms`);
  setBadgeText(OPENING_BADGE_TEXT);

  window.setTimeout(() => finalizeSpin(isWin), delay);
});

playAgainButton.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && resultModal.classList.contains("is-visible")) {
    closeModal();
  }
});
