import { handleAskCommand } from "./ask";
import { handleCommandList } from "./command";
import { handleIdCommand } from "./id";
import { handleWeatherCommand } from "./weather";
import { handlePollCommand } from "./poll";

type CommandMatcher = {
  match: RegExp | string;
  handler: (
    c: any,
    text: string,
    chatId: number,
    token: string,
    threadId?: number
  ) => Promise<any>;
};

export const ALL_COMMANDS: CommandMatcher[] = [
  {
    match: /^\/id(@\w+)?(\s|$)/i,
    handler: async (c, text, chatId, token, threadId) =>
      handleIdCommand(c, chatId, threadId, token),
  },
  {
    match: "/ask",
    handler: handleAskCommand,
  },
  {
    match: "/weather",
    handler: handleWeatherCommand,
  },
  {
    match: "/command",
    handler: handleCommandList,
  },
  {
    match: "/poll",
    handler: handlePollCommand,
  },
];
