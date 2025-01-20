import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LivesIndicatorProps {
    lives: number;
}

export function LivesIndicator({ lives }: LivesIndicatorProps) {
    return (
        <div className="flex gap-1">
            <AnimatePresence>
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 1 }}
                        animate={{ scale: i < lives ? 1 : 0.8 }}
                        exit={{ scale: 0 }}
                    >
                        <Heart
                            className={`w-6 h-6 transition-colors ${i < lives ? "text-red-500" : "text-slate-700"}`}
                            fill={i < lives ? "currentColor" : "none"}
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}