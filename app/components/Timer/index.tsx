"use client";

import { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar";

export default function QuarterCountdown() {
  const [target, setTarget] = useState<Date>(() => getNextTargetTime());
  const [remaining, setRemaining] = useState<number>(
    target.getTime() - Date.now()
  );
  let soundPlayed = false;
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target.getTime() - now;
      if (diff <= 15000 && !soundPlayed) {
        soundPlayed = true;
        const audio = new Audio("resources/puffshroomtimesound.ogg");
        audio.play();
      }
      if (diff <= 0) {
        const nextTarget = getNextTargetTime(new Date(now + 1000));
        setTarget(nextTarget);
        setRemaining(nextTarget.getTime() - now);
        soundPlayed = false;
      } else {
        setRemaining(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  let percentage = calculatePercent(remaining);
  return formatTime(remaining, percentage);
}

function formatTime(ms: number, percent: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div>
      <div className="grid grid-flow-col gap-5 text-center text-white auto-cols-max">
        <div className="flex flex-col p-2 bg-black rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span aria-live="polite">
              {minutes.toString().padStart(2, "0")}
            </span>
          </span>
        </div>
        <div className="flex flex-col p-2 bg-black rounded-box text-neutral-content">
          <span className="countdown font-mono text-5xl">
            <span aria-live="polite">
              {seconds.toString().padStart(2, "0")}
            </span>
          </span>
        </div>
      </div>
      <ProgressBar percent={Math.round(percent)} />
    </div>
  );
}

function getNextTargetTime(from = new Date()): Date {
  const next = new Date(from);
  const minutes = from.getMinutes();

  if (minutes < 15) {
    next.setMinutes(15, 0, 0);
  } else if (minutes < 45) {
    next.setMinutes(45, 0, 0);
  } else {
    next.setHours(next.getHours() + 1);
    next.setMinutes(15, 0, 0);
  }

  return next;
}

function calculatePercent(remainingMs: number): number {
  const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

  const elapsed = INTERVAL_MS - remainingMs;
  const progress = elapsed / INTERVAL_MS;

  return Math.min(100, Math.max(0, progress * 100));
}
