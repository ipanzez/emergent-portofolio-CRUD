import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 28, className = "", ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: EASE }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.45, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ eyebrow, title, description, light = false }) => (
  <Reveal className="mb-12 max-w-2xl md:mb-16">
    <p className={`eyebrow ${light ? "text-white/50" : ""}`}>{eyebrow}</p>
    <h2 className={`mt-3 text-3xl font-bold tracking-tight md:text-4xl ${light ? "text-white" : "text-gray-900"}`}>{title}</h2>
    {description && <p className={`mt-4 text-base leading-relaxed md:text-lg ${light ? "text-white/60" : "text-gray-600"}`}>{description}</p>}
  </Reveal>
);
