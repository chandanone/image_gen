"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Wand2, Type } from "lucide-react"; // Icons add visual cues

export default function Home() {
  return (
    // Added a subtle radial gradient background
    <div className="relative w-full h-dvh flex justify-center items-center overflow-hidden bg-[#030303]">
      {/* Background Glow Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="relative z-10 flex justify-center items-center flex-col px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
          >
            Image GenX
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-center text-lg text-white/40 max-w-md leading-relaxed"
          >
            Transform your imagination into reality. Generate stunning visuals
            and creative text using next-gen AI models.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/create_image" className="w-full">
              <Button
                size="lg"
                className="w-full font-bold px-8 py-6 rounded-xl bg-white text-black hover:bg-white/90 transition-all group"
              >
                <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Create Image
              </Button>
            </Link>

            <Link href="/create_text" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full font-bold px-8 py-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                <Type className="mr-2 h-5 w-5" />
                Generate Text
              </Button>
            </Link>
          </motion.div>

          {/* Subtle Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/30"
          >
            <Sparkles className="h-3 w-3" />
            <span>Powered by Pollination AI</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
