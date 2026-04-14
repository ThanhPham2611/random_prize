const adminForm = document.getElementById("adminForm");
const adminPasswordInput = document.getElementById("adminPassword");
const winRatePercentInput = document.getElementById("winRatePercent");
const currentRate = document.getElementById("currentRate");
const updatedAt = document.getElementById("updatedAt");
const statusMessage = document.getElementById("statusMessage");
const loadConfigButton = document.getElementById("loadConfigButton");

const setStatus = (message, isError = false) => {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("is-error", isError);
};

const setBusy = (isBusy) => {
  const buttons = adminForm.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = isBusy;
  });
};

const getAdminPassword = () => adminPasswordInput.value.trim();

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-admin-password": getAdminPassword(),
});

const requirePassword = () => {
  if (!getAdminPassword()) {
    throw new Error("Hay nhap mat khau admin truoc.");
  }
};

const formatPercent = (winRate) => `${(Number(winRate) * 100).toFixed(1)}%`;

const formatUpdatedAt = (value) => {
  if (!value) {
    return "Chua co lan cap nhat nao";
  }

  return new Date(value).toLocaleString("vi-VN");
};

const renderConfig = (config) => {
  currentRate.textContent = formatPercent(config.winRate);
  winRatePercentInput.value = (Number(config.winRate) * 100).toFixed(1);
  updatedAt.textContent = `Cap nhat: ${formatUpdatedAt(config.updatedAt)}`;
};

const loadConfig = async () => {
  requirePassword();
  setBusy(true);
  setStatus("Dang tai cau hinh...");

  try {
    const response = await fetch("./api/admin/rate", {
      method: "GET",
      headers: getHeaders(),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.details || payload.error || "Khong the tai cau hinh.");
    }

    renderConfig(payload);
    setStatus("Da tai cau hinh thanh cong.");
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    setBusy(false);
  }
};

adminForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    requirePassword();
  } catch (error) {
    setStatus(error.message, true);
    return;
  }

  const percentValue = Number(winRatePercentInput.value);

  if (!Number.isFinite(percentValue) || percentValue < 0 || percentValue > 100) {
    setStatus("Ti le trung phai nam trong khoang 0 den 100.", true);
    return;
  }

  setBusy(true);
  setStatus("Dang luu ti le moi...");

  try {
    const response = await fetch("./api/admin/rate", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        winRate: percentValue / 100,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.details || payload.error || "Khong the luu cau hinh.");
    }

    renderConfig(payload.config);
    setStatus("Da cap nhat ti le trung thuong.");
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    setBusy(false);
  }
});

loadConfigButton.addEventListener("click", () => {
  loadConfig();
});
