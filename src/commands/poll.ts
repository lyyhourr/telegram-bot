import { sendTelegramMessage } from "../utils/send-tele-msg";

export async function handlePollCommand(
  c: any,
  text: string,
  chatId: number,
  token: string,
  threadId?: number
) {
  const raw = text.replace(/^\/poll(@\w+)?\s*/, "");

  const parts = raw.split("|").map((part) => part.trim());

  if (parts.length < 2) {
    await sendTelegramMessage(
      chatId,
      "Please provide a question and at least one option. Example:\n/poll Question | Option 1 | Option 2",
      token,
      threadId
    );
    return c.text("No poll options provided");
  }

  const question = parts[0];
  const options = parts.slice(1);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendPoll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        question: question,
        options: options,
        is_anonymous: false,
        allows_multiple_answers: false,
        message_thread_id: threadId,
      }),
    });

    return c.text("Poll sent");
  } catch (error) {
    console.error("Failed to send poll:", error);
    await sendTelegramMessage(chatId, "Failed to send poll.", token, threadId);
    return c.text("Error sending poll");
  }
}
