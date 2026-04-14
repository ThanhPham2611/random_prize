const SHAKE_MIN_DURATION = 620;
const SHAKE_MAX_DURATION = 820;
const OPEN_REVEAL_DELAY = 280;
const SPIN_API_URL = "/api/spin";
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

const requestSpinResult = async () => {
  const response = await fetch(SPIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.details || payload.error || "Không thể quay lúc này.");
  }

  return payload;
};

const openSystemModal = (message) => {
  resultModal.classList.add("is-visible");
  resultModal.setAttribute("aria-hidden", "false");

  const modalCard = resultModal.querySelector(".modal-card");
  modalCard.classList.remove("is-win");
  modalCard.classList.add("is-lose");
  modalTitle.classList.remove("modal-title--prize");

  modalTag.textContent = "THÔNG BÁO HỆ THỐNG";
  modalTitle.textContent = "Tạm thời chưa quay được";
  modalMessage.textContent = message;

  playAgainButton.focus();
};

const openModal = (isWin) => {
  resultModal.classList.add("is-visible");
  resultModal.setAttribute("aria-hidden", "false");

  const modalCard = resultModal.querySelector(".modal-card");
  modalCard.classList.remove("is-win", "is-lose");
  modalCard.classList.add(isWin ? "is-win" : "is-lose");
  modalTitle.classList.remove("modal-title--prize");

  if (isWin) {
    modalTag.textContent = "TƯNG BỪNG LỄ HỘI (24/4 - 3/5)";
    modalTitle.classList.add("modal-title--prize");
    modalTitle.innerHTML = '<span class="modal-title-main">1000 điểm </span><span class="modal-title-sub">garden club</span>';
    modalMessage.textContent = "Cảm ơn bạn đã follow OA zalo The Garden Shopping Center";
  } else {
    modalTag.textContent = "TƯNG BỪNG LỄ HỘI (24/4 - 3/5)";
    modalTitle.textContent = "Chúc Bạn May Mắn Lần Sau";
    modalMessage.textContent = "Cảm ơn bạn đã follow OA zalo The Garden Shopping Center";
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

const handleSpinError = (error) => {
  resetGiftState();
  openSystemModal(error.message || "Hệ thống quay chưa sẵn sàng. Vui lòng thử lại sau.");
};

giftButton.addEventListener("click", () => {
  if (isRolling) {
    return;
  }

  const delay = randomDelay();
  const spinRequest = requestSpinResult();

  isRolling = true;
  giftButton.classList.remove("is-open", "is-win");
  giftButton.classList.add("is-shaking");
  giftButton.style.setProperty("--shake-duration", `${delay}ms`);
  setBadgeText(OPENING_BADGE_TEXT);

  window.setTimeout(async () => {
    try {
      const result = await spinRequest;
      finalizeSpin(Boolean(result.isWin));
    } catch (error) {
      handleSpinError(error);
    }
  }, delay);
});

playAgainButton.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && resultModal.classList.contains("is-visible")) {
    closeModal();
  }
});
