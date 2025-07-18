interface Env {
  TELEGRAM_TOKEN: string;
  BOT_USERNAME: string;
}

export async function scheduled(event: ScheduledEvent, env: Env) {
  const TELEGRAM_TOKEN = env.TELEGRAM_TOKEN;
  const chatId = -1002650608498;

  const now = new Date();
  const day = now.getUTCDay();
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();

  if (day === 0) return; // skip Sunday

  let textToSend = "";

  const goodMorningMessages = [
    "Good morning bro bro. Wake tf up, let's go to work! 🙌",
    "ngerb lerng all bro ! tv tver ka",
  ];

  const goodNightMessages = [
    "Tos kg all bro yub hz bot barom 🌙",
    "Chab keng all bro kom nov yub pek 😴",
    "Yub hz neak ot ton mean ss kg tv , ot neak chat muy pg nov tver ey? 😴",
    "Goodnight hea hea bot som kg mun hz😴",
  ];

  // Phnom Penh 7:00 AM = UTC 00:00
  if (hours === 0 && minutes === 0) {
    const idx = Math.floor(Math.random() * goodMorningMessages.length);
    textToSend = goodMorningMessages[idx];
  }

  // Phnom Penh 11:30 PM = UTC 16:30
  else if (hours === 16 && minutes === 30) {
    const idx = Math.floor(Math.random() * goodNightMessages.length);
    textToSend = goodNightMessages[idx];
  }

  if (!textToSend) return;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: textToSend }),
    });
  } catch (e) {
    console.error("Failed to send Telegram message", e);
  }
}
