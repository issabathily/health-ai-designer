import { Home, Compass, BookOpen, Clock, Search, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const navigationItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Compass, label: "Explore", active: false },
  { icon: BookOpen, label: "Library", active: false },
  { icon: Clock, label: "History", active: false },
];

const conversationPrompts = {
  tomorrow: [
    "What's something you've learned recently?",
    "If you could teleport anywhere...",
    "What's one goal you want to achieve?",
  ],
  sevenDaysAgo: [
    "Ask me anything weird or random...",
    "How are you feeling today, really...",
    "What's one habit you wish you...",
  ],
};

const Sidebar = () => {
  return (
    <aside className="w-80 border-r border-border bg-sidebar-background flex flex-col h-screen">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <h1 className="text-xl font-bold text-sidebar-primary">BeeBot</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search" 
            className="pl-9 pr-9 bg-background border-input transition-smooth hover:border-primary/50 focus:border-primary"
          />
          <Command className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        </div>
      </div>

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

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2">Tomorrow</h3>
            <div className="space-y-1">
              {conversationPrompts.tomorrow.map((prompt, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-smooth hover:text-sidebar-accent-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 px-2">7 Days Ago</h3>
            <div className="space-y-1">
              {conversationPrompts.sevenDaysAgo.map((prompt, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-smooth hover:text-sidebar-accent-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
