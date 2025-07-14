export async function sendTelegramMessage(
  chatId: number,
  text: string,
  token: string,
  threadId?: number
) {
  try {
    const payload: Record<string, any> = {
      chat_id: chatId,
      text,
    };

    if (threadId !== undefined) {
      payload.message_thread_id = threadId;
    }

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Telegram sendMessage failed:", errorBody);
    }
  } catch (e) {
    console.error("Error sending message to Telegram:", e);
  }
}
