"use client";

import { motion } from "framer-motion";
import { Add } from "iconsax-reactjs";

interface FabProps {
  onClick?: () => void;
  icon?: React.ReactNode;
}

export function Fab({ onClick, icon }: FabProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 20 }}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.06 }}
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 z-40"
    >
      {icon ?? <Add size={24} color="white" />}
    </motion.button>
  );
}
