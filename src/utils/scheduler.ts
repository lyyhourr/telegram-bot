interface Env {
  TELEGRAM_TOKEN: string;
  BOT_USERNAME: string;
}

export async function scheduled(event: ScheduledEvent, env: Env) {
  const TELEGRAM_TOKEN = env.TELEGRAM_TOKEN;
  const chatId = -1002650608498;

  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();

  let textToSend = "";

  const goodMorningMessages = [
    "Good morning bro bro. Wake tf up, let's go to work! 🙌",
    "Good morning hea hea ! ngerb lerng tv tver ka",
  ];

  const goodNightMessages = [
    "Tos kg all bro yub hz bot barom 🌙",
    "Goodnight hea hea ! Chab keng all bro kom nov yub pek 😴",
    "Yub hz neak ot ton mean ss kg tv , ot neak chat muy pg nov tver ey? 😴",
    "Goodnight hea hea bot som kg mun hz😴",
  ];

  const sundayMorningMessages = [
    "Today is Sunday! Enjoy your day off, all bro! 😎☀️",
    "Bro bros, today is Sunday — chill out and recharge ⚡",
    "Sunday jg neak ot mean ss ke tov na nor 😂",
    "Sunday jg nham jeak jeak ot 🍗😂🍻",
  ];

  // Special Sunday message at 9:00 AM Phnom Penh = UTC 2:00 AM
  if (day === 0 && hours === 2 && minutes === 0) {
    const idx = Math.floor(Math.random() * sundayMorningMessages.length);
    textToSend = sundayMorningMessages[idx];
  }

  // Skip Sunday for normal messages
  if (day !== 0) {
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
