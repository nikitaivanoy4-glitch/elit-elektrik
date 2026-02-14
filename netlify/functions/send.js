export async function handler(event, context) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = "5032819484";

  if (!TELEGRAM_TOKEN) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "TELEGRAM_TOKEN is missing" })
    };
  }

  const body = JSON.parse(event.body || "{}");

  const text = `📩 Новая заявка:\n\nИмя: ${body.name}\nТелефон: ${body.phone}\nОписание: ${body.description}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const telegramRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "HTML"
      })
    });

    const data = await telegramRes.json();

    if (!telegramRes.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
