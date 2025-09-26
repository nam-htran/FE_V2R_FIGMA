// app/workspace/page.tsx
"use client";

import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Image as ImageIcon, Type, Bot, Search } from "lucide-react";
import { ViewerPanel } from "@/components/ViewerPanel";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function WorkspacePage() {
  const [prompt, setPrompt] = useState("");
  const [detailLevel, setDetailLevel] = useState([50]);
  const [inputMode, setInputMode] = useState("text");

  const [leftPanelSize, setLeftPanelSize] = useState(25);
  const [rightPanelSize, setRightPanelSize] = useState(22);

  const isLeftPanelCollapsed = leftPanelSize <= 5;
  const isRightPanelCollapsed = rightPanelSize <= 5;

  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        
        <ResizablePanel
          collapsible collapsedSize={4} defaultSize={25} minSize={20} maxSize={30}
          onResize={setLeftPanelSize}
          className={cn("p-4 transition-all duration-300 ease-in-out", isLeftPanelCollapsed && "p-2")}
        >
          <div className="h-full w-full glass-card rounded-lg flex flex-col relative">
            {isLeftPanelCollapsed ? (
                <div className="flex h-full items-center justify-center">
                    <Button variant="ghost" size="icon" onClick={() => setLeftPanelSize(25)}>
                        <Sparkles className="h-5 w-5" />
                    </Button>
                </div>
            ) : (
                <>
                    <div className="p-4 border-b border-card-border/50 shrink-0">
                        <h2 className="text-xl font-semibold">Controls</h2>
                    </div>
                    
                    <div className="p-6 space-y-6 flex-1 overflow-y-auto pb-6">
                        {/* TABS SECTION */}
                        <Tabs value={inputMode} onValueChange={setInputMode} className="w-full">
                            <TabsList className="grid grid-cols-2 w-full bg-black/[.08] dark:bg-white/[.08] p-1 h-10 rounded-full">
                                <TabsTrigger value="text" className={cn( "flex items-center gap-2 rounded-full transition-all text-sm h-full", inputMode === 'text' ? 'bg-background text-foreground shadow-md' : 'bg-transparent text-muted-foreground' )}>
                                    <Type className="w-4 h-4" /> Text to 3D
                                </TabsTrigger>
                                <TabsTrigger value="image" className={cn( "flex items-center gap-2 rounded-full transition-all text-sm h-full", inputMode === 'image' ? 'bg-background text-foreground shadow-md' : 'bg-transparent text-muted-foreground' )}>
                                    <ImageIcon className="w-4 h-4" /> Image to 3D
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="text" className="space-y-4 mt-6">
                                <label className="text-sm font-semibold">Prompt</label>
                                <Textarea placeholder="e.g., a futuristic spaceship..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-24 resize-none border-0 bg-black/[.08] dark:bg-white/[.08] focus-visible:ring-1 focus-visible:ring-ring rounded-xl" />
                            </TabsContent>
                            <TabsContent value="image" className="space-y-4 mt-6">
                                 <label className="text-sm font-semibold">Upload Image</label>
                                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-black/[.04] dark:bg-white/[.04] hover:border-primary transition-colors cursor-pointer">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* AI MODEL SECTION */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold">AI Model</label>
                          <Select defaultValue="standard">
                              <SelectTrigger className="mt-1 h-12 rounded-xl border bg-background focus:ring-1 focus:ring-ring">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="standard">Standard V1</SelectItem>
                                  <SelectItem value="advanced">Advanced V2</SelectItem>
                              </SelectContent>
                          </Select>
                        </div>

                        {/* LEVEL OF DETAIL SECTION */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold">Level of Detail</label>
                                <span className="text-sm text-muted-foreground">{detailLevel[0]}%</span>
                            </div>
                            <Slider value={detailLevel} onValueChange={setDetailLevel} max={100} step={10} />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 border-t border-card-border/50 space-y-4 bg-card/80 backdrop-blur-sm rounded-b-lg">
                        <div className="text-sm space-y-2 bg-black/[.08] dark:bg-white/[.08] p-4 rounded-xl">
                            <div className="flex justify-between text-muted-foreground">
                              <span>Cost:</span> <span className="font-medium text-foreground">1 model</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Tokens:</span> <span className="font-medium text-foreground">10 tokens</span>
                            </div>
                        </div>
                        
                        {/* --- SỬA ĐỔI CUỐI CÙNG: Ghi đè style bằng className của Tailwind --- */}
                        <Button
                            size="lg"
                            className="w-full bg-blue-900 text-white hover:bg-blue-950"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate 3D Model
                        </Button>
                    </div>
                </>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={53} minSize={30}>
          <div className="h-full p-2"> <ViewerPanel modelUrl="/model.glb" /> </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
            collapsible collapsedSize={4} defaultSize={22} minSize={18} maxSize={30}
            onResize={setRightPanelSize}
            className={cn("p-4 transition-all duration-300 ease-in-out", isRightPanelCollapsed && "p-2")}
        >
          <div className="h-full w-full glass-card rounded-lg flex flex-col">
            {isRightPanelCollapsed ? ( <div className="flex h-full items-center justify-center"> <Button variant="ghost" size="icon" onClick={() => setRightPanelSize(22)}> <Bot className="h-5 w-5" /> </Button> </div>
            ) : (
                <>
                    <div className="p-4 border-b border-card-border/50"> <h2 className="text-lg font-semibold">Asset Library</h2> </div>
                    <div className="p-4 space-y-4 flex-1 flex flex-col">
                        <div className="relative">
                           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                           <Input placeholder="Search assets..." className="pl-9 border-0 bg-black/[.08] dark:bg-white/[.08] focus-visible:ring-1 focus-visible:ring-ring rounded-lg" />
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center animate-glow">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-1">Your Creative Library</h3>
                            <p className="text-sm">Your first model will appear here.</p>
                        </div>
                    </div>
                     <div className="p-2 border-t border-card-border/50 flex items-center justify-between text-sm">
                        <Button variant="ghost" size="sm" disabled>‹</Button>
                        <span>1 / 1</span>
                        <Button variant="ghost" size="sm" disabled>›</Button>
                    </div>
                </>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}