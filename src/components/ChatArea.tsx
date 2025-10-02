import { useState, useEffect } from "react";
import { Share, HelpCircle, Paperclip, Brain, Image, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/hooks/useChatHistory";

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  onActionClick: (action: "reasoning" | "image" | "research") => void;
}

const ChatArea = ({ messages, onSendMessage, isLoading, onActionClick }: ChatAreaProps) => {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    await onSendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action: "reasoning" | "image" | "research") => {
    onActionClick(action);
    toast({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Mode`,
      description: `Mode ${action} activé. Envoyez votre message.`,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-background relative overflow-hidden">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs">B</span>
          </div>
          <span className="font-medium text-foreground">iBeeBot 4o</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-accent transition-smooth">
            <Share className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-accent transition-smooth">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <ScrollArea className="flex-1 relative">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <div className="relative mb-12">
              <div className="w-32 h-32 rounded-full gradient-orb animate-float shadow-glow" />
              <div className="absolute inset-0 w-32 h-32 rounded-full gradient-orb animate-pulse-glow blur-xl" />
            </div>
            
            <h2 className="text-4xl font-bold text-center mb-2 text-foreground">
              Good Morning, Judha
            </h2>
            <p className="text-4xl font-bold text-center">
              How Can I <span className="text-primary">Assist You Today?</span>
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-8 px-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 transition-smooth ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-secondary text-secondary-foreground rounded-2xl px-6 py-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-border p-6 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <div className="flex items-center gap-2 bg-background border border-input rounded-2xl px-4 py-3 transition-smooth hover:border-primary/50 focus-within:border-primary shadow-soft">
              <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">B</span>
              </div>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Initiate a query or send a command to the AI..."
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm px-0"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 hover:bg-accent transition-smooth"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => handleActionClick("reasoning")}
              className="gap-2 transition-smooth hover:border-primary hover:text-primary hover:scale-105"
            >
              <Brain className="w-4 h-4" />
              Reasoning
            </Button>
            <Button
              variant="outline"
              onClick={() => handleActionClick("image")}
              className="gap-2 transition-smooth hover:border-primary hover:text-primary hover:scale-105"
            >
              <Image className="w-4 h-4" />
              Create Image
            </Button>
            <Button
              variant="outline"
              onClick={() => handleActionClick("research")}
              className="gap-2 transition-smooth hover:border-primary hover:text-primary hover:scale-105"
            >
              <Search className="w-4 h-4" />
              Deep Research
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
