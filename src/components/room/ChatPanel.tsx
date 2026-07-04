import { useState, useRef, useEffect } from "react";
import { Send, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/types";

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  selfId: string;
}

export function ChatPanel({
  open,
  onClose,
  messages,
  onSendMessage,
  selfId,
}: ChatPanelProps) {
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  if (!open) return null;

  return (
    <div className="w-full md:w-[360px] h-full shrink-0 border-l border-white/5 bg-slate-900 flex flex-col relative z-40 select-none">
      
      {/* Header */}
      <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">In-call messages</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/10 text-white/60 hover:text-white rounded-lg">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground p-3 text-center bg-white/5 border-b border-white/5">
        Messages are visible only to people in the call and are deleted when the meeting ends.
      </p>

      {/* Message list area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3.5 pb-4">
          {messages.map((m) => {
            if (m.system) {
              return (
                <div key={m.id} className="text-center">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-medium text-white/50">
                    {m.content}
                  </span>
                </div>
              );
            }

            const isSelf = m.senderId === selfId;

            return (
              <div key={m.id} className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
                <span className="text-[10px] font-medium text-white/40 mb-1 select-none px-1">
                  {isSelf ? "You" : m.senderName} · {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words ${
                    isSelf
                      ? "bg-gradient-brand text-white rounded-tr-none shadow-brand"
                      : "bg-white/5 border border-white/5 text-white/90 rounded-tl-none"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <Separator className="bg-white/5" />

      {/* Input controls form */}
      <form onSubmit={handleSend} className="p-4 flex gap-2 shrink-0">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send a message"
          className="h-10 rounded-xl border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30"
          autoComplete="off"
        />
        <Button type="submit" size="icon" className="h-10 w-10 shrink-0 rounded-xl bg-gradient-brand text-white btn-glow">
          <Send className="h-4 w-4" />
        </Button>
      </form>

    </div>
  );
}
export default ChatPanel;
