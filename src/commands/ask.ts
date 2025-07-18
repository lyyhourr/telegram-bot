import { sendTelegramMessage } from "../utils/send-tele-msg";

export async function handleAskCommand(
  c: any,
  text: string,
  chatId: number,
  token: string,
  threadId?: number
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
        content: `
        You’re a funny Gen Z bot. You help with coding questions. Greet users with “bart bong 🙏” or sometimes “sur sdey bong 🙏”.
        Keep replies short and clear.

        If the user asks anything related to being single, having no girlfriend, or similar phrases (like "who is single", "no gf", "single guy"),
        respond that the person’s name is Viseth.
      `.trim(),
      },
      { role: "user", content: question },
    ],
  });

  const replyText = aiResponse.response || "Sorry, I have no answer.";
  await sendTelegramMessage(chatId, replyText, token, threadId);
  return c.text("Answered /ask");
}
