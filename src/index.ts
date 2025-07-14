import { Hono } from "hono";
import { handleAskCommand, isAskCommand } from "./commands/ask";
import { handleIdCommand, isIdCommand } from "./commands/id";

const app = new Hono<{
  Bindings: CloudflareBindings & {
    TELEGRAM_TOKEN: string;
    BOT_USERNAME: string;
  };
}>();

app.post("/telegram-webhook", async (c) => {
  const TELEGRAM_TOKEN = c.env.TELEGRAM_TOKEN;

  if (!TELEGRAM_TOKEN) {
    console.error("Telegram token missing in environment");
    return c.text("Internal Server Error", 500);
  }

  try {
    const bodyText = await c.req.text();
    const body = JSON.parse(bodyText);
    const message = body.message;

    if (!message?.text) {
      return c.text("No message text");
    }

    const text = message.text;
    const chatId = message.chat.id;
    const threadId = message.message_thread_id;

    if (isIdCommand(text)) {
      return await handleIdCommand(c, chatId, threadId, TELEGRAM_TOKEN);
    }

    if (isAskCommand(text, c.env.BOT_USERNAME)) {
      return await handleAskCommand(c, text, chatId, threadId, TELEGRAM_TOKEN);
    }

    console.log("Message does not match any known command - ignored");
    return c.text("Ignored (no matching command)");
  } catch (e) {
    console.error("Error in webhook handler:", e);
    return c.text("Error", 500);
  }
});

export default app;
