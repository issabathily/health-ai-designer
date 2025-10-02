import { Home, Compass, BookOpen, Clock, Search, Command, ChevronLeft, ChevronRight, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/hooks/useChatHistory";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Compass, label: "Explore", active: false },
  { icon: BookOpen, label: "Library", active: false },
  { icon: Clock, label: "History", active: false },
];

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onDeleteConversation,
  onNewConversation,
  isCollapsed,
  onToggleCollapse 
}: SidebarProps) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days <= 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const groupedConversations = conversations.reduce((acc, conv) => {
    const dateLabel = formatDate(conv.updatedAt);
    if (!acc[dateLabel]) {
      acc[dateLabel] = [];
    }
    acc[dateLabel].push(conv);
    return acc;
  }, {} as Record<string, Conversation[]>);

  return (
    <aside className={cn(
      "border-r border-border bg-sidebar-background flex flex-col h-screen transition-all duration-300",
      isCollapsed ? "w-16" : "w-80"
    )}>
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            {!isCollapsed && <h1 className="text-xl font-bold text-sidebar-primary">BeeBot</h1>}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onToggleCollapse}
            className="hover:bg-sidebar-accent transition-smooth"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
        
        {!isCollapsed && (
          <>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search" 
                className="pl-9 pr-9 bg-background border-input transition-smooth hover:border-primary/50 focus:border-primary"
              />
              <Command className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            </div>
            <Button 
              onClick={onNewConversation}
              className="w-full gradient-primary text-white hover:opacity-90 transition-smooth"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </>
        )}
      </div>

      {!isCollapsed && (
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 transition-smooth ${
                item.active 
                  ? "bg-secondary text-sidebar-primary font-medium" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      )}

      <ScrollArea className="flex-1 px-4">
        {!isCollapsed && (
          <div className="space-y-6 pb-4">
            {Object.entries(groupedConversations).map(([dateLabel, convs]) => (
              <div key={dateLabel}>
                <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2">{dateLabel}</h3>
                <div className="space-y-1">
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      className={cn(
                        "group flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg transition-smooth",
                        currentConversationId === conv.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      <button
                        onClick={() => onSelectConversation(conv.id)}
                        className="flex-1 text-left truncate"
                      >
                        {conv.title}
                      </button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-smooth h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                No conversations yet.
                <br />
                Start a new chat!
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
