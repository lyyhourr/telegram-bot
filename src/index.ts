import { Hono } from "hono";
import { ALL_COMMANDS } from "./commands";
import { scheduled } from "./utils/scheduler";

const app = new Hono<{
  Bindings: Cloudflare & {
    TELEGRAM_TOKEN: string;
    BABYBIO_API_SECRET: string;
    BABYBIO_BD_ALERT_URL: string;
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

    const text = message.text.trim();
    const chatId = message.chat.id;
    const threadId = message.message_thread_id;

    const command = ALL_COMMANDS.find((cmd) => {
      if (typeof cmd.match === "string") {
        return text.toLowerCase().startsWith(cmd.match.toLowerCase());
      } else {
        return cmd.match.test(text);
      }
    });

    if (!command) {
      console.log("Message does not match any known command - ignored");
      return c.text("Ignored (no matching command)");
    }

    return await command.handler(c, text, chatId, TELEGRAM_TOKEN, threadId);
  } catch (e) {
    console.error("Error in webhook handler:", e);
    return c.text("Error", 500);
  }
});

export default {
  fetch: app.fetch,
  scheduled,
};
