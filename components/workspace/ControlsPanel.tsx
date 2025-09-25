"use client";

import { useState, type FC } from 'react';
import { Bot, ChevronDown, Loader2, Upload, PanelLeftClose } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}

// --- ĐÃ SỬA: Thiết kế lại hoàn toàn SegmentedControl để khớp với hình ảnh ---
const SegmentedControl = <T extends string>({ options, value, onValueChange, className }: SegmentedControlProps<T>) => (
  <div className={cn("flex items-center w-full p-1 rounded-lg bg-muted", className)}>
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onValueChange(option.value)}
        className={cn(
          "flex-1 text-muted-foreground text-sm font-semibold py-1.5 rounded-md transition-all duration-200",
          value === option.value && "bg-background shadow-sm text-foreground"
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);

interface ControlsPanelProps {
  onToggle: () => void;
}

export const ControlsPanel: FC<ControlsPanelProps> = ({ onToggle }) => {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          toast.success("Model generated successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    // --- ĐÃ SỬA: Áp dụng Card, bỏ Glassmorphism và thêm viền màu xanh ---
    <Card className="flex flex-col h-full overflow-hidden border-t-4 border-t-blue-800">
      <div className="p-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold">Controls</h2>
            <p className="text-sm text-muted-foreground">Generate your 3D model.</p>
          </div>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Collapse Panel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>

      <div className="flex-1 flex flex-col gap-6 overflow-y-auto p-4 pt-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Input Mode</Label>
              <SegmentedControl
                options={[{ label: 'Text to 3D', value: 'text' }, { label: 'Image to 3D', value: 'image' }]}
                value={mode}
                onValueChange={setMode}
              />
            </div>

            {mode === 'text' && (
              <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., a photorealistic, high-poly model of a futuristic spaceship..."
                  className="min-h-[144px]"
                />
              </motion.div>
            )}
            
            {mode === 'image' && (
              <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Label>Upload Image</Label>
                <div className="group border-2 border-dashed h-36 rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:border-primary transition-colors bg-secondary/50 hover:bg-accent">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2 transition-colors group-hover:text-primary" />
                  <p className="text-sm text-muted-foreground">Formats: png, jpg, webp</p>
                </div>
              </motion.div>
            )}
            
            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard V1</SelectItem>
                  <SelectItem value="premium">Premium V2</SelectItem>
                  <SelectItem value="experimental">Experimental</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                  <Label>Level of Detail</Label>
                  <span className="text-sm font-medium">50%</span>
              </div>
              {/* --- ĐÃ SỬA: Trả Slider về mặc định --- */}
              <Slider defaultValue={[50]} max={100} step={1} className="flex-1" />
            </div>
          </div>
      </div>

      <div className="mt-auto p-4 border-t space-y-3 bg-card rounded-b-lg shrink-0">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Cost: 1 model</span>
          <span>10 tokens</span>
        </div>
        {isGenerating && <Progress value={generationProgress} className="mb-2 h-2" />}
        {/* --- ĐÃ SỬA: Bỏ gradient, đổi thành bo góc `rounded-lg` --- */}
        <Button 
          size="lg" 
          className="w-full font-bold h-12 text-base rounded-lg"
          onClick={handleGenerate} 
          disabled={isGenerating}
        >
          {isGenerating ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Bot className="h-5 w-5 mr-2" />}
          {isGenerating ? 'Generating...' : 'Generate Model'}
        </Button>
      </div>
    </Card>
  );
};