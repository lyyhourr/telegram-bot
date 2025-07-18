import { sendTelegramMessage } from "../utils/send-tele-msg";

const COMMANDS_DESCRIPTION = [
  "🆔 /id - Show chat and thread IDs",
  "🤖 /ask [question] - Ask a coding question to the bot",
  "🌤️ /weather [city] - Get weather info (default: Phnom Penh)",
  "📜 /command - List all available commands",
  "📊 /poll [question] - Create a poll with your question",
];

export async function handleCommandList(
  c: any,
  text: string,
  chatId: number,
  token: string,
  threadId?: number
) {
  const reply = `Here are the available commands:\n\n${COMMANDS_DESCRIPTION.join(
    "\n"
  )}`;

  await sendTelegramMessage(chatId, reply, token, threadId);
  return c.text("Sent command list");
}
