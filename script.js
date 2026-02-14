// ----------------------
// ОТПРАВКА ЗАЯВКИ ЧЕРЕЗ NETLIFY FUNCTION
// ----------------------

async function sendToServer(data) {
  try {
    const res = await fetch("/.netlify/functions/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return await res.json();
  } catch (err) {
    console.error("Ошибка отправки:", err);
    return { success: false };
  }
}

// ----------------------
// ОБРАБОТКА ФОРМЫ ЗАЯВКИ
// ----------------------

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("request-form");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nameEl = document.getElementById("name");
      const phoneEl = document.getElementById("phone");
      const descEl = document.getElementById("description");

      const name = nameEl ? nameEl.value.trim() : "";
      const phone = phoneEl ? phoneEl.value.trim() : "";
      const description = descEl ? descEl.value.trim() : "";

      if (!name || !phone || !description) {
        alert("Пожалуйста, заполните все поля.");
        return;
      }

      const result = await sendToServer({ name, phone, description });

      if (result.success) {
        alert("Заявка отправлена! Мы свяжемся с вами.");
        form.reset();
      } else {
        alert("Ошибка при отправке. Попробуйте позже.");
      }
    });
  }
});

// ----------------------
// КАЛЬКУЛЯТОР ЭЛИТЭЛЕКТРИК
// ----------------------

const PRICES = {
  socket: 350,
  switcher: 350,
  cablePerMeter: 100,
  panel: 6000,
  breaker: 900,
  light: 900,
  chandelier: 2200,
  rcd: 2500,
  warmFloorPerM2: 1200,
  fullWiringPerM2: 1900,
  visit: 1500,
  diagnostics: 1200
};

function formatPrice(value) {
  return value.toLocaleString("ru-RU") + " ₽";
}

function getCheckedValue(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : null;
}

function getNumberValue(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const v = parseFloat(el.value.replace(",", "."));
  return isNaN(v) ? 0 : v;
}

function updateCalc() {
  const objectType = getCheckedValue("objectType");

  const sockets = getNumberValue("calc-sockets");
  const switches = getNumberValue("calc-switches");
  const cable = getNumberValue("calc-cable");
  const lights = getNumberValue("calc-lights");
  const chandeliers = getNumberValue("calc-chandeliers");
  const warmFloor = getNumberValue("calc-warmfloor");
  const area = getNumberValue("calc-area");

  const needPanel = document.getElementById("calc-panel")?.checked;
  const needBreakers = document.getElementById("calc-breakers")?.checked;
  const needRcd = document.getElementById("calc-rcd")?.checked;
  const needVisit = document.getElementById("calc-visit")?.checked;
  const needDiagnostics = document.getElementById("calc-diagnostics")?.checked;

  let total = 0;
  let lines = [];

  if (sockets > 0) {
    const sum = sockets * PRICES.socket;
    total += sum;
    lines.push(`Розетки: ${sockets} × ${formatPrice(PRICES.socket)} = ${formatPrice(sum)}`);
  }

  if (switches > 0) {
    const sum = switches * PRICES.switcher;
    total += sum;
    lines.push(`Выключатели: ${switches} × ${formatPrice(PRICES.switcher)} = ${formatPrice(sum)}`);
  }

  if (cable > 0) {
    const sum = cable * PRICES.cablePerMeter;
    total += sum;
    lines.push(`Прокладка кабеля: ${cable} м × ${formatPrice(PRICES.cablePerMeter)} = ${formatPrice(sum)}`);
  }

  if (lights > 0) {
    const sum = lights * PRICES.light;
    total += sum;
    lines.push(`Светильники: ${lights} × ${formatPrice(PRICES.light)} = ${formatPrice(sum)}`);
  }

  if (chandeliers > 0) {
    const sum = chandeliers * PRICES.chandelier;
    total += sum;
    lines.push(`Люстры: ${chandeliers} × ${formatPrice(PRICES.chandelier)} = ${formatPrice(sum)}`);
  }

  if (warmFloor > 0) {
    const sum = warmFloor * PRICES.warmFloorPerM2;
    total += sum;
    lines.push(`Тёплый пол: ${warmFloor} м² × ${formatPrice(PRICES.warmFloorPerM2)} = ${formatPrice(sum)}`);
  }

  if (area > 0) {
    const sum = area * PRICES.fullWiringPerM2;
    total += sum;
    lines.push(`Разводка электрики под ключ: ${area} м² × ${formatPrice(PRICES.fullWiringPerM2)} = ${formatPrice(sum)}`);
  }

  if (needPanel) {
    total += PRICES.panel;
    lines.push(`Щиток: ${formatPrice(PRICES.panel)}`);
  }

