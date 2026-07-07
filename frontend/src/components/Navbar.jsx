import { Menu, Moon, Sparkles, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../state/ThemeContext";

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="glass-navbar sticky top-0 z-50 border-b border-line/80 px-8 py-3 shadow-soft">
      <div className="flex min-h-14 items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-line bg-elevated text-mint shadow-soft">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-mint">
              AI Recruitment
            </p>
            <h1 className="text-xl font-bold tracking-normal text-ink sm:text-2xl">Copilot</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="relative inline-flex h-11 w-20 items-center rounded-full border border-line bg-elevated p-1 shadow-soft transition"
            aria-label="Toggle theme"
          >
            <motion.span
              layout
              animate={{ x: isDark ? 34 : 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="grid h-9 w-9 place-items-center rounded-full bg-mint text-white shadow-button"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "moon" : "sun"}
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                >
                  {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="grid h-11 w-11 place-items-center rounded-md border border-line bg-elevated text-ink shadow-soft transition hover:border-mint hover:text-mint"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
