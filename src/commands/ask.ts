import { sendTelegramMessage } from "../utils/send-tele-msg";

export function isAskCommand(text: string, botUsername: string) {
  const askCommandRegex = new RegExp(`^\\/ask(@${botUsername})?(\\s|$)`, "i");
  return askCommandRegex.test(text);
}

export async function handleAskCommand(
  c: any,
  text: string,
  chatId: number,
  threadId: number | undefined,
  token: string
) {
  const askCommandRegex = new RegExp(
    `^\\/ask(@${c.env.BOT_USERNAME})?(\\s|$)`,
    "i"
  );
  const question = text.replace(askCommandRegex, "").trim();

  if (!question) {
    await sendTelegramMessage(
      chatId,
      "Please provide a question after /ask.",
      token,
      threadId
    );
    return c.text("No question provided");
  }

  const aiResponse = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      {
        role: "system",
        content:
          `You’re a funny Khmer Gen Z bot who mixes Khmer and English. You help with coding questions. Greet users with “bart bong 🙏”. Keep replies short and clear.`.trim(),
      },

      { role: "user", content: question },
    ],
  });

  const replyText = aiResponse.response || "Sorry, I have no answer.";
  await sendTelegramMessage(chatId, replyText, token, threadId);
  return c.text("Answered /ask");
}
