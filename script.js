const WIN_RATE = 0.4;
const giftButton = document.getElementById("giftButton");
const resultModal = document.getElementById("resultModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const playAgainButton = document.getElementById("playAgainButton");
const modalTag = document.getElementById("modalTag");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const spinCount = document.getElementById("spinCount");
const latestResult = document.getElementById("latestResult");

let totalSpins = 0;
let isRolling = false;

const pickResult = () => Math.random() < WIN_RATE;

const randomDelay = () => {
  const minDelay = 1000;
  const maxDelay = 2000;
  return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
};

const openModal = (isWin) => {
  resultModal.classList.add("is-visible");
  resultModal.setAttribute("aria-hidden", "false");

  const modalCard = resultModal.querySelector(".modal-card");
  modalCard.classList.remove("is-win", "is-lose");
  modalCard.classList.add(isWin ? "is-win" : "is-lose");

  if (isWin) {
    modalTag.textContent = "Jackpot";
    modalTitle.textContent = "Bạn Đã Trúng Thưởng!";
    modalMessage.textContent = "Chúc mừng! Hệ thống vừa random ra kết quả trúng thưởng cho lượt quay này.";
  } else {
    modalTag.textContent = "Thử Lại Nhé";
    modalTitle.textContent = "Chúc Bạn May Mắn Lần Sau";
    modalMessage.textContent = "Lần này chưa trúng rồi, nhưng cơ hội 40% vẫn đang chờ bạn ở lượt tiếp theo.";
  }

  playAgainButton.focus();
};

const closeModal = () => {
  resultModal.classList.remove("is-visible");
  resultModal.setAttribute("aria-hidden", "true");
  giftButton.focus();
};

const finalizeSpin = (isWin) => {
  isRolling = false;
  giftButton.classList.remove("is-spinning");
  giftButton.classList.toggle("is-win", isWin);

  latestResult.textContent = isWin ? "Trúng thưởng" : "Không trúng";
  openModal(isWin);
};

giftButton.addEventListener("click", () => {
  if (isRolling) {
    return;
  }

  isRolling = true;
  totalSpins += 1;
  spinCount.textContent = String(totalSpins);
  latestResult.textContent = "Đang quay...";

  giftButton.classList.remove("is-win");
  giftButton.classList.add("is-spinning");

  const isWin = pickResult();
  const delay = randomDelay();

  window.setTimeout(() => finalizeSpin(isWin), delay);
});

playAgainButton.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && resultModal.classList.contains("is-visible")) {
    closeModal();
  }
});
