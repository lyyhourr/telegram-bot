import { sendTelegramMessage } from "../utils/send-tele-msg";

export function isIdCommand(text: string) {
  return /^\/id(@\w+)?(\s|$)/i.test(text);
}

export async function handleIdCommand(
  c: any,
  chatId: number,
  threadId: number | undefined,
  token: string
) {
  let reply = `chat_id: ${chatId}`;
  if (threadId !== undefined) {
    reply += `\nmessage_thread_id: ${threadId}`;
  }

  await sendTelegramMessage(chatId, reply, token, threadId);
  return c.text("Replied with chat ID");
}
