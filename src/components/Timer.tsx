import { useEffect, useRef, useState } from "react";
import { playTick } from "@/utils/sound";

export function Timer({ seconds, onExpire, onTick }: { seconds: number; onExpire: () => void; onTick?: (s: number) => void; }) {
  const [remain, setRemain] = useState(seconds);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    setRemain(seconds);
    ref.current && window.clearInterval(ref.current);
    ref.current = window.setInterval(() => {
      setRemain((r) => {
        const next = r - 1;
        if (next <= 5 && next > 0) playTick();
        onTick?.(next);
        if (next <= 0) {
          window.clearInterval(ref.current!);
          onExpire();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (ref.current) window.clearInterval(ref.current); };
  }, [seconds]);

  const isUrgent = remain <= 5;

  return (
    <div className={`rounded-full px-4 py-2 text-sm font-semibold border ${isUrgent ? "border-destructive text-destructive" : "border-primary text-primary"}`}>
      {remain}s
    </div>
  );
}
