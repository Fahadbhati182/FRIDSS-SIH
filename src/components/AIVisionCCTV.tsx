'use client';

import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

export const AIVisionCCTV: React.FC = () => {
  return (
    <div className="bg-[#070e16] border-b border-[#142330] p-4 select-none">
      {/* Title Header */}
      <div className="flex items-center gap-2 mb-2">
        <Camera className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
          AI Vision &amp; CCTV De-Fogging Feed
        </span>
      </div>

      {/* Description Box */}
      <div className="bg-[#09141f] border border-[#162a3c] rounded-lg p-3.5 flex flex-col justify-center space-y-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold font-mono text-cyan-300">
            YOLOv9 Edge Computer Vision
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
          Real-time in-cabin camera &amp; roadside CCTV stream for obstacle detection, 
          distance estimation, and optical fog penetration on blind haul road curves.
        </p>
        <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-[#0e1d2c] border border-cyan-500/30 text-cyan-400">
            Edge ONNX
          </span>
          <span>&bull;</span>
          <span>Offline Inference</span>
          <span>&bull;</span>
          <span>60 FPS</span>
        </div>
      </div>
    </div>
  );
};
