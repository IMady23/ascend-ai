export interface ChatMessageLike {
  type?: string;
  content?: string;
}

export function shouldAppendChatMessage(history: ChatMessageLike[], message: ChatMessageLike): boolean {
  const trimmed = typeof message.content === "string" ? message.content.trim() : "";
  if (!trimmed) return false;

  const lastMessage = history[history.length - 1];
  if (!lastMessage) return true;

  const lastContent = typeof lastMessage.content === "string" ? lastMessage.content.trim() : "";
  return lastContent !== trimmed;
}

export function appendChatMessage(history: ChatMessageLike[], message: ChatMessageLike): ChatMessageLike[] {
  if (!shouldAppendChatMessage(history, message)) return history;

  return [...history, { ...message, content: typeof message.content === "string" ? message.content.trim() : "" }];
}
