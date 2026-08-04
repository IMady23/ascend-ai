import { appendChatMessage, shouldAppendChatMessage } from "../../lib/ai/chat-history";

describe("chat history helpers", () => {
  it("appends a new message to the existing history", () => {
    const history = [{ type: "user", content: "Hello" }];

    const next = appendChatMessage(history, { type: "user", content: "How are you?" });

    expect(next).toEqual([
      { type: "user", content: "Hello" },
      { type: "user", content: "How are you?" },
    ]);
  });

  it("ignores blank messages", () => {
    const history = [{ type: "user", content: "Hello" }];

    const next = appendChatMessage(history, { type: "user", content: "   " });

    expect(next).toEqual(history);
  });

  it("ignores duplicate consecutive messages", () => {
    const history = [{ type: "user", content: "Hello" }];

    expect(shouldAppendChatMessage(history, { type: "user", content: "Hello" })).toBe(false);
    expect(shouldAppendChatMessage(history, { type: "user", content: "How are you?" })).toBe(true);
  });
});
