// components/workspace/ControlsPanel.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Image as ImageIcon, Type, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlsPanelProps {
  onToggle: () => void;
}

export const ControlsPanel = ({ onToggle }: ControlsPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [detailLevel, setDetailLevel] = useState([50]);
  const [inputMode, setInputMode] = useState("text");

  return (
    <div className="glass-card rounded-lg flex flex-col h-full">
      <div className="p-4 border-b border-card-border/50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Controls</h2>
          <p className="text-sm text-muted-foreground">Generate your model.</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="hover:bg-black/[.08] dark:hover:bg-white/[.08]">
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <Tabs value={inputMode} onValueChange={setInputMode} className="w-full">
          <TabsList className="grid grid-cols-2 w-full bg-black/[.08] dark:bg-white/[.08] p-1 h-auto rounded-lg">
            <TabsTrigger
              value="text"
              className={cn(
                "flex items-center gap-2 rounded-md transition-all text-sm h-8",
                inputMode === 'text' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-md' 
                  : 'bg-transparent text-muted-foreground'
              )}
            >
              <Type className="w-4 h-4 mr-1" />
              Text to 3D
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className={cn(
                "flex items-center gap-2 rounded-md transition-all text-sm h-8",
                inputMode === 'image' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-md' 
                  : 'bg-transparent text-muted-foreground'
              )}
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              Image to 3D
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-4">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              placeholder="e.g., a futuristic spaceship..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-24 mt-2 border-0 bg-black/[.08] dark:bg-white/[.08] focus-visible:ring-1 focus-visible:ring-ring"
            />
          </TabsContent>
          <TabsContent value="image" className="mt-4">
             <label className="text-sm font-medium">Upload Image</label>
             <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-black/[.04] dark:bg-white/[.04] hover:border-primary transition-colors cursor-pointer mt-2">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
             </div>
          </TabsContent>
        </Tabs>
        <div>
          <label className="text-sm font-medium">AI Model</label>
          <Select defaultValue="standard">
            <SelectTrigger className="mt-2 glass"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard V1</SelectItem>
              <SelectItem value="advanced">Advanced V2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Level of Detail</label>
            <Badge variant="secondary">{detailLevel[0]}%</Badge>
          </div>
          <Slider value={detailLevel} onValueChange={setDetailLevel} max={100} step={10} />
        </div>
      </div>
      <div className="p-4 border-t border-card-border/50 space-y-4">
        <div className="text-sm text-muted-foreground space-y-1 glass p-3 rounded-md">
          <div className="flex justify-between"><span>Cost:</span><span className="font-medium">1 model</span></div>
          <div className="flex justify-between"><span>Tokens:</span><span className="font-medium">10 tokens</span></div>
        </div>
        {/* === THAY ĐỔI: Áp dụng variant="default" để có màu xanh === */}
        <Button variant="default" size="lg" className="w-full h-12 text-base font-medium">
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Model
        </Button>
      </div>
    </div>
  );
}