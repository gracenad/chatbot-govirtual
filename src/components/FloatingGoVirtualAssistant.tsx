"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAssistantContext } from "@/providers/AssistantProvider";
import Image from "next/image";

interface AssistantContextType {
  showAssistant: boolean;
  setShowAssistant: (value: boolean) => void;
}

interface GoVirtualAssistantProps {
  onClose: () => void;
}

const GoVirtualAssistant = dynamic<GoVirtualAssistantProps>(
  () => import("@/components/GoVirtualAssistant"),
  { ssr: false }
);

const FloatingGoVirtualAssistant: React.FC = () => {
const { showAssistant, setShowAssistant } =
  useAssistantContext() as AssistantContextType;
const [isAtBottom, setIsAtBottom] = useState(() => false);

useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const totalHeight = document.body.scrollHeight;
    const scrollThreshold = 100;

    setIsAtBottom(scrollTop + viewportHeight >= totalHeight - scrollThreshold);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <div>
      <div>
        <div
          style={{
            cursor:"pointer",
            display: "flex",
            alignItems: "end",
            justifyContent: "end",
            position: "absolute",
            bottom: 16,
            right: 16,
            margin: "0.25rem",
            transition: "all 0.3s",
            ...(isAtBottom ? { marginBottom: "4rem" } : {})
          }}

        >
          {showAssistant ? (
            <GoVirtualAssistant onClose={() => setShowAssistant(false)} />
          ) : (
            <motion.button
              onClick={() => setShowAssistant(true)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                backgroundColor: "transparent",
                border: "none"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.cursor = "pointer")
              }
            >
              {/* <Image src="/favicon.ico" alt="Assistant" width={55} height={55} unoptimized /> */}
              <Image src="/chatbot.png" alt="Assistant" width={55} height={55} priority />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingGoVirtualAssistant;
