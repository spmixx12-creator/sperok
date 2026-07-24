import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sticker } from '../types';
import { Sparkles, Smile, CheckCircle, Tag, RotateCcw, Trash2, HelpCircle } from 'lucide-react';

const STAMP_PRESETS = [
  { value: '⭐️', label: 'Sparkle', color: '#FBBF24', type: 'stamp' },
  { value: 'APPROVED', label: 'Approved Stamp', color: '#EF4444', type: 'badge' },
  { value: '😊', label: 'Smiley', color: '#10B981', type: 'stamp' },
  { value: 'CRAFTED', label: 'Crafted Tag', color: '#3B82F6', type: 'badge' },
  { value: '🎨', label: 'Art Palette', color: '#8B5CF6', type: 'stamp' },
  { value: '✨', label: 'Glow', color: '#EC4899', type: 'stamp' },
  { value: '🔥', label: 'Fire', color: '#F97316', type: 'stamp' },
  { value: 'DESIGN IS LIFE', label: 'Slogan', color: '#171717', type: 'badge' },
];

interface InteractivePlaygroundProps {
  stickers: Sticker[];
  onAddSticker: (sticker: Sticker) => void;
  onClearStickers: () => void;
  onUpdateStickerPos: (id: string, x: number, y: number) => void;
}

export default function InteractivePlayground({
  stickers,
  onAddSticker,
  onClearStickers,
  onUpdateStickerPos,
}: InteractivePlaygroundProps) {
  const [selectedPreset, setSelectedPreset] = useState(STAMP_PRESETS[0]);
  const [showTooltip, setShowTooltip] = useState(true);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent triggering when clicking interactive controls
    if ((e.target as HTMLElement).closest('.playground-control')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create new sticker
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      rotation: Math.floor(Math.random() * 40) - 20, // -20deg to 20deg
      scale: 0.9 + Math.random() * 0.3,
      type: selectedPreset.type as any,
      value: selectedPreset.value,
      color: selectedPreset.color,
    };

    onAddSticker(newSticker);
    if (showTooltip) setShowTooltip(false);
  };

  return (
    <div 
      className="absolute inset-0 z-10 custom-cursor-stamp"
      onClick={handleCanvasClick}
    >
      {/* Placed Stickers Layer */}
      <AnimatePresence>
        {stickers.map((sticker) => (
          <motion.div
            key={sticker.id}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              // Update coordinate positions after drag
              onUpdateStickerPos(sticker.id, sticker.x + info.offset.x, sticker.y + info.offset.y);
            }}
            initial={{ scale: 0, rotate: 0, x: sticker.x - 40, y: sticker.y - 40 }}
            animate={{ 
              scale: sticker.scale, 
              rotate: sticker.rotation,
              x: sticker.x - 40,
              y: sticker.y - 40
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute select-none cursor-grab active:cursor-grabbing playground-control"
            style={{ originX: 0.5, originY: 0.5 }}
          >
            {sticker.type === 'badge' ? (
              <div 
                className="px-3 py-1.5 font-display font-bold text-xs uppercase tracking-wider rounded border-2 shadow-sm"
                style={{
                  backgroundColor: sticker.color === '#171717' ? '#171717' : '#FAF7F2',
                  borderColor: sticker.color,
                  color: sticker.color === '#171717' ? '#FAF7F2' : sticker.color,
                  transform: 'skewX(-6deg)',
                  boxShadow: `3px 3px 0px ${sticker.color}50`
                }}
              >
                {sticker.value}
              </div>
            ) : (
              <div 
                className="text-4xl drop-shadow-md select-none pointer-events-none"
              >
                {sticker.value}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Control Center */}
      <div className="absolute top-20 right-4 md:right-8 bg-white/95 backdrop-blur-md border border-neutral-200/80 p-3 rounded-2xl shadow-xl max-w-xs z-30 playground-control">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-display font-semibold text-xs tracking-tight">Grid Canvas Playground</span>
          </div>
          {stickers.length > 0 && (
            <button 
              onClick={onClearStickers}
              className="p-1 text-neutral-400 hover:text-red-500 rounded transition-colors"
              title="Clear all stamps"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <p className="text-[11px] text-neutral-500 mb-3 leading-relaxed">
          {showTooltip ? "✨ Choose a creative stamp below, then click anywhere on the background grid to customize the site layout!" : "Awesome! Drag stamps or select another preset to build your custom layout."}
        </p>

        {/* Presets Grid */}
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {STAMP_PRESETS.map((preset) => {
            const isSelected = selectedPreset.value === preset.value;
            return (
              <button
                key={preset.value}
                onClick={() => setSelectedPreset(preset)}
                className={`h-9 flex flex-col items-center justify-center rounded-lg border text-sm transition-all relative ${
                  isSelected 
                    ? 'bg-neutral-900 border-neutral-900 text-white font-medium scale-105' 
                    : 'bg-neutral-50/50 hover:bg-neutral-50 border-neutral-200 text-neutral-800'
                }`}
                title={preset.label}
              >
                <span className={preset.type === 'badge' ? 'text-[9px] font-bold tracking-tight px-1' : 'text-base'}>
                  {preset.type === 'badge' ? preset.value.substring(0, 3) + '.' : preset.value}
                </span>
                {isSelected && (
                  <motion.div 
                    layoutId="selectedPresetDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400"
                  />
                )}
              </button>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 font-mono">
          <span>STAMP: {selectedPreset.label}</span>
          <span>STAMPS_PLACED: {stickers.length}</span>
        </div>
      </div>
    </div>
  );
}
