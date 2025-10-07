import { useState } from "react";
import ChatArea from "@/components/ChatArea";
import { useChatHistory, Message } from "@/hooks/useChatHistory";
import { useToast } from "@/hooks/use-toast";
import { sendMessageToWebhook } from "@/services/chatService";

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
  const [currentMode, setCurrentMode] = useState<"reasoning" | "image" | "research" | null>(null);
  const { toast } = useToast();

  const sendMessageToN8n = async (message: string, mode: string | null) => {
    try {
      // Délègue l'appel au service centralisé (gère timeouts, parse robust, messages d'erreur)
      const result = await sendMessageToWebhook(message);
      if (result.error) {
        throw new Error(result.error);
      }
      const aiText = (result.output || "").toString();
      
      // Évite d'écho le message utilisateur
      const userNorm = message.trim().toLowerCase();
      const aiNorm = aiText.trim().toLowerCase();
      const nearEcho = aiNorm === userNorm || (aiNorm.includes(userNorm) && Math.abs(aiNorm.length - userNorm.length) <= 10);
      if (!aiText || nearEcho) {
        return "J'ai bien reçu votre message. Le serveur n8n n'a pas renvoyé de réponse exploitable. Vérifiez votre workflow pour retourner un champ `output` (ou `response`).";
      }
      return aiText;
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
      
      return "Désolé, je ne peux pas me connecter au serveur n8n pour le moment. Veuillez vérifier que n8n est en cours d'exécution sur http://localhost:5678";
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
