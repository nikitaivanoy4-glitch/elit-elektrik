export async function handler(event, context) {
  const TOKEN = process.env.TELEGRAM_TOKEN; // токен берём из Netlify
  const CHAT_ID = "ТВОЙ_CHAT_ID"; // сюда вставь свой chat_id

  const data = JSON.parse(event.body);

  const text = `
📩 Новая заявка с сайта
👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
📄 Описание: ${data.description}
  `;

  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  });

  return {
    statusCode: 200,
    body: "OK"
  };
}
