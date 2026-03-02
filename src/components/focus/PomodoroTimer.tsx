"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Button } from "@/components/ui";
import { 
  Pause, 
  Play, 
  RotateCcw, 
  Coffee, 
  Focus,
  CheckCircle2,
  Bell 
} from "lucide-react";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroTimer({ onComplete }: { onComplete: (duration: number) => void }) {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionEnd();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Update Page Title
  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    document.title = isActive ? `(${timeStr}) AkshitOS` : "FocusForge | AkshitOS";
  }, [timeLeft, isActive]);

  const handleSessionEnd = useCallback(() => {
    setIsActive(false);
    if (!isBreak) {
      onComplete(FOCUS_TIME);
      setTimeLeft(BREAK_TIME);
      setIsBreak(true);
      new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a1b1a1.mp3").play().catch(() => {}); // Optional sound
    } else {
      setTimeLeft(FOCUS_TIME);
      setIsBreak(false);
    }
  }, [isBreak, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className={`relative overflow-hidden transition-all duration-700 ${isBreak ? 'border-accent-secondary/50 shadow-green-900/10' : 'border-accent-primary/50 shadow-blue-900/10'}`}>
      {/* Background Pulse */}
      {isActive && (
        <div className={`absolute inset-0 opacity-5 animate-pulse ${isBreak ? 'bg-accent-secondary' : 'bg-accent-primary'}`} />
      )}

      <div className="relative p-10 flex flex-col items-center text-center space-y-8">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-primary border border-text-secondary/10">
          {isBreak ? (
            <div className="flex items-center gap-2 text-accent-secondary">
              <Coffee size={14} className="animate-bounce" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Break Time</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-accent-primary">
              <Focus size={14} className="animate-spin-slow" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Focus Session</span>
            </div>
          )}
        </div>

        <div className="relative">
          <svg className="w-64 h-64 -rotate-90 transform">
            <circle
              className="text-bg-primary stroke-current"
              strokeWidth="6"
              fill="transparent"
              r="120"
              cx="128"
              cy="128"
            />
            <circle
              className={`${isBreak ? 'text-accent-secondary' : 'text-accent-primary'} stroke-current transition-all duration-1000 ease-linear`}
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - timeLeft / (isBreak ? BREAK_TIME : FOCUS_TIME))}
              strokeLinecap="round"
              fill="transparent"
              r="120"
              cx="128"
              cy="128"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-7xl font-extrabold text-text-primary tracking-tighter tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full max-w-xs">
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 h-12 rounded-2xl" 
            onClick={resetTimer}
          >
            <RotateCcw size={18} />
          </Button>
          <Button 
            className={`w-20 h-20 rounded-full shadow-2xl transition-transform active:scale-95 ${isBreak ? 'bg-accent-secondary hover:bg-green-600' : 'bg-accent-primary'}`}
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex-1 h-12 rounded-2xl"
            onClick={handleSessionEnd}
          >
            <CheckCircle2 size={18} />
          </Button>
        </div>
        
        <p className="text-xs text-text-secondary font-medium italic opacity-70">
          {isActive ? "Embrace the flow. No distractions allowed." : "Press play when you're ready to start deep work."}
        </p>
      </div>
    </Card>
  );
}
