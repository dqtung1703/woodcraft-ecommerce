import { motion } from 'framer-motion';

export default function GlobalOutlookSection() {
  return (
    <section className="py-24 bg-surface text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 md:px-12"
      >
        <span className="font-sans uppercase tracking-widest text-primary text-sm mb-4 block">
          International Vision
        </span>
        <h2 className="text-4xl md:text-5xl font-serif text-on-surface mb-6">
          Sản xuất tại Việt Nam — Phân phối toàn cầu
        </h2>
        <p className="text-on-surface-variant text-lg mb-12">
          Chúng tôi tự hào đưa những sản phẩm thủ công mỹ nghệ tinh xảo nhất của làng nghề Việt vươn
          tầm thế giới, có mặt tại các triển lãm nghệ thuật quốc tế từ Paris, Tokyo đến New York.
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 grayscale opacity-40">
          <span className="font-bold text-xl md:text-2xl">ARTISAN FAIR</span>
          <span className="font-bold text-xl md:text-2xl">GLOBAL CRAFT</span>
          <span className="font-bold text-xl md:text-2xl">VIET HERITAGE</span>
        </div>
      </motion.div>
    </section>
  );
}
