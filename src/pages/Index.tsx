import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";
import { useChatHistory, Message } from "@/hooks/useChatHistory";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createNewConversation,
    addMessage,
    deleteConversation,
    getCurrentConversation,
  } = useChatHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentMode, setCurrentMode] = useState<"reasoning" | "image" | "research" | null>(null);
  const { toast } = useToast();

  const sendMessageToN8n = async (message: string, mode: string | null) => {
    // Remplacez cette URL par votre webhook n8n
    const n8nWebhookUrl = "YOUR_N8N_WEBHOOK_URL_HERE";
    
    try {
      const response = await fetch(n8nWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          mode: mode || "chat",
          timestamp: new Date().toISOString(),
          context: "health_advice",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to n8n");
      }

      const data = await response.json();
      return data.response || "Je suis là pour vous aider avec vos questions de santé.";
    } catch (error) {
      console.error("Error connecting to n8n:", error);
      
      // Fallback responses based on mode
      if (mode === "reasoning") {
        return "Mode Reasoning activé. Je vais analyser votre question en profondeur et vous fournir un raisonnement détaillé.";
      } else if (mode === "image") {
        return "Mode Create Image activé. Je vais générer une image basée sur votre description.";
      } else if (mode === "research") {
        return "Mode Deep Research activé. Je vais effectuer une recherche approfondie sur votre sujet.";
      }
      
      return "Je suis votre assistant santé. Posez-moi vos questions sur la santé et le bien-être.";
    }
  };

  const handleSendMessage = async (message: string) => {
    let conversationId = currentConversationId;

    if (!conversationId) {
      conversationId = createNewConversation();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    addMessage(conversationId, userMessage);
    setIsLoading(true);

    try {
      const aiResponse = await sendMessageToN8n(message, currentMode);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      addMessage(conversationId, assistantMessage);
      setCurrentMode(null); // Reset mode after use
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    createNewConversation();
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    toast({
      title: "Conversation supprimée",
      description: "La conversation a été supprimée avec succès.",
    });
  };

  const handleActionClick = (action: "reasoning" | "image" | "research") => {
    setCurrentMode(action);
  };

  const currentConversation = getCurrentConversation();
  const messages = currentConversation?.messages || [];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewConversation={handleNewConversation}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <ChatArea
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onActionClick={handleActionClick}
      />
    </div>
  );
};

export default Index;
