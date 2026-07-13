import { motion } from 'framer-motion';

export default function Hero({ title, subtitle, cta }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(232,93,58,0.25), transparent 60%)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl md:text-7xl leading-tight max-w-3xl"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-6 text-lg text-muted max-w-xl"
        >
          {subtitle}
        </motion.p>
        <motion.a
          href="#grid"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          className="inline-block mt-10 px-8 py-3 rounded-full bg-copper text-bg font-medium shadow-glow"
        >
          {cta}
        </motion.a>
      </div>
    </section>
  );
}
