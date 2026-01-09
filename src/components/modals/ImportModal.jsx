import { motion } from "framer-motion";
import { useRouter } from "next/router";
import ImportBoard from "@/components/ux/ImportBoard";

export default function ImportModal() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-50">
      {/* dark backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => router.back()}
      />

      {/* bottom sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="absolute bottom-0 left-0 right-0 bg-stone-900 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
      >
        <ImportBoard />
      </motion.div>
    </div>
  );
}
