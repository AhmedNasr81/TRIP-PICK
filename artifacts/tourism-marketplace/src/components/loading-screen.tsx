import { motion, AnimatePresence } from "framer-motion";

const WORD1 = "TRIP";
const WORD2 = "PICK";

function AnimatedLetter({ char, delay }: { char: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      {char}
    </motion.span>
  );
}

export function LoadingScreen({ visible }: { visible: boolean }) {
  const letters1 = WORD1.split("");
  const letters2 = WORD2.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 45%, #1a1040 100%)",
          }}
        >
          {/* Ambient glow orbs */}
          <motion.div
            className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
            animate={{ scale: [1.15, 1, 1.15], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Stars / particles */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              className="pointer-events-none absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{
                delay: Math.random() * 2,
                duration: Math.random() * 2 + 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Main logo */}
          <div className="relative flex flex-col items-center select-none">
            {/* Glow behind text */}
            <motion.div
              className="pointer-events-none absolute inset-0 -m-8 rounded-3xl blur-3xl"
              style={{ background: "rgba(56,189,248,0.15)" }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* TRIP PICK text */}
            <div className="flex items-baseline gap-5">
              {/* TRIP */}
              <div className="flex">
                {letters1.map((char, i) => (
                  <AnimatedLetter key={i} char={char} delay={i * 0.09} />
                ))}
              </div>

              {/* Dot separator */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.3, ease: "backOut" }}
                className="inline-block h-2.5 w-2.5 rounded-full mb-2"
                style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)" }}
              />

              {/* PICK */}
              <div className="flex">
                {letters2.map((char, i) => (
                  <AnimatedLetter key={i} char={char} delay={0.5 + i * 0.09} />
                ))}
              </div>
            </div>

            {/* Underline accent */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 h-0.5 w-40 rounded-full origin-left"
              style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8, transparent)" }}
            />
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.65, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mt-5 text-sm uppercase tracking-[0.35em] font-light text-sky-200"
          >
            Discover your next adventure
          </motion.p>

          {/* Spinner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.4 }}
            className="mt-10 relative h-10 w-10"
          >
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-sky-400/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-1.5 rounded-full border-2 border-transparent border-b-violet-400 border-l-violet-400/40"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
