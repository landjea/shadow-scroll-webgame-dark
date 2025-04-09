
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { CornerDownRight } from "lucide-react";

interface TextLine {
  id: number;
  content: string;
  type: 'system' | 'player' | 'response';
}

const GameConsole: React.FC = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TextLine[]>([
    { id: 1, content: "Welcome to Shadow Scroll.", type: 'system' },
    { id: 2, content: "You find yourself in a dark forest. The trees loom overhead, blocking out most of the moonlight. You can barely make out a path ahead of you.", type: 'system' },
    { id: 3, content: "What would you like to do?", type: 'system' }
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    
    const target = e.target as HTMLInputElement;
    const inputValue = target.value;
    
    if (!inputValue.trim()) return;
    
    // Add player input to history
    const newId = history.length > 0 ? history[history.length - 1].id + 1 : 1;
    setHistory([...history, { id: newId, content: inputValue, type: 'player' }]);
    
    // Process command and generate response
    setTimeout(() => {
      let response: string;
      const command = inputValue.toLowerCase();
      
      if (command.includes("look") || command.includes("examine")) {
        response = "The forest is dense and dark. You can see a faint path leading north, and something shiny glinting between the roots of a nearby tree.";
      } else if (command.includes("go north") || command.includes("follow path")) {
        response = "You cautiously follow the path north. The trees seem to close in around you as you walk, but the path remains clear.";
      } else if (command.includes("pick up") || command.includes("take shiny")) {
        response = "You bend down and find a small silver key half-buried in the dirt. You take the key and put it in your pocket.";
      } else {
        response = "You're not sure if that's possible right now.";
      }
      
      setHistory(prev => [...prev, { id: newId + 1, content: response, type: 'response' }]);
    }, 500);
    
    // Clear input
    target.value = "";
  };
  
  // Scroll to bottom when history updates
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [history]);
  
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-3">
          {history.map((line) => (
            <div
              key={line.id}
              className={`animate-text-appear pb-1 ${
                line.type === 'player' 
                  ? 'flex items-start text-game-accent font-mono' 
                  : line.type === 'system'
                  ? 'text-game-highlight font-mono'
                  : 'font-mono'
              }`}
            >
              {line.type === 'player' && (
                <CornerDownRight size={16} className="mr-2 mt-1 opacity-70" />
              )}
              <div>{line.content}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <input
        type="text"
        onKeyDown={handleSubmit}
        className="w-full bg-game-darker text-game-text font-mono p-2 border-t border-game-dark/80 outline-none"
        placeholder="Enter your action..."
        autoComplete="off"
      />
    </div>
  );
};

export default GameConsole;

