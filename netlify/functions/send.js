export default async (req, res) => {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = "5832819484";

  if (!TELEGRAM_TOKEN) {
    return res.status(500).json({ error: "TELEGRAM_TOKEN is missing" });
  }

  const body = JSON.parse(req.body || "{}");
  const text = `📩 Новая заявка:\n\nИмя: ${body.name}\nТелефон: ${body.phone}\nОписание: ${body.description}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  try {
    const telegramRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "HTML",
      }),
    });

    const data = await telegramRes.json();

    if (!telegramRes.ok) {
      return res.status(500).json({ error: data });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
