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

  if (needBreakers) {
    total += PRICES.breaker * 6;
    lines.push(`Автоматы (примерно 6 шт.): ${formatPrice(PRICES.breaker * 6)}`);
  }

  if (needRcd) {
    total += PRICES.rcd * 2;
    lines.push(`УЗО (примерно 2 шт.): ${formatPrice(PRICES.rcd * 2)}`);
  }

  if (needVisit) {
    total += PRICES.visit;
    lines.push(`Выезд мастера: ${formatPrice(PRICES.visit)}`);
  }

  if (needDiagnostics) {
    total += PRICES.diagnostics;
    lines.push(`Диагностика: ${formatPrice(PRICES.diagnostics)}`);
  }

  if (objectType === "house") {
    total = Math.round(total * 1.05);
  } else if (objectType === "office") {
    total = Math.round(total * 1.08);
  }

  const totalEl = document.getElementById("calc-total");
  const breakdownEl = document.getElementById("calc-breakdown");

  if (totalEl) totalEl.textContent = formatPrice(total);
  if (breakdownEl) {
    breakdownEl.innerHTML = lines.length
      ? lines.map(l => `• ${l}`).join("<br>")
      : "Выберите услуги и укажите параметры, чтобы увидеть детальный расчёт.";
  }
}

function initCalc() {
  const calcRoot = document.getElementById("elit-calc");
  if (!calcRoot) return;

  calcRoot.addEventListener("input", updateCalc);
  calcRoot.addEventListener("change", e => {
    if (e.target.classList.contains("calc-chip-input")) {
      const name = e.target.name;
      document
        .querySelectorAll(`.calc-chip-input[name="${name}"]`)
        .forEach(input => {
          const chip = input.closest(".calc-chip");
          if (!chip) return;
          chip.classList.toggle("active", input.checked);
        });
    }
    updateCalc();
  });

  updateCalc();
}

document.addEventListener("DOMContentLoaded", () => {
  initCalc();
  initNews();
});

// ----------------------
// ПРОСТАЯ ИМИТАЦИЯ НОВОСТЕЙ
// ----------------------

function initNews() {
  const newsContainer = document.getElementById("news-dynamic");
  if (!newsContainer) return;

  const items = [
    {
      title: "Новый стандарт по безопасности электромонтажа",
      date: "Февраль 2026",
      text: "Мы обновили внутренние регламенты под актуальные требования ПУЭ и ГОСТ, чтобы ваши объекты были максимально защищены."
    },
    {
      title: "Снижение стоимости комплексной разводки",
      date: "Январь 2026",
      text: "Для заказов от 80 м² действует пониженный коэффициент на разводку электрики под ключ."
    },
    {
      title: "Расширение команды ЭлитЭлектрик",
      date: "Декабрь 2025",
      text: "К нам присоединились новые инженеры-проектировщики с опытом работы на крупных объектах."
    }
  ];

  newsContainer.innerHTML = items
    .map(
      item => `
      <article class="news-card">
        <h3>${item.title}</h3>
        <small>${item.date}</small>
        <p>${item.text}</p>
      </article>
    `
    )
    .join("");
}

