import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';

export default function PromoSection() {
  return (
    <section className="py-24 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto bg-primary rounded-[2rem] p-12 md:p-20 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12"
      >
        <div className="relative z-10 md:max-w-xl">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Miễn phí vận chuyển toàn quốc cho đơn hàng đầu tiên
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Chào mừng bạn đến với Chuyên Mỹ Artisan. Hãy để chúng tôi mang tinh hoa văn hóa đến
            không gian sống của bạn.
          </p>
          <Link
            to={PATHS.PRODUCTS}
            className="inline-block bg-white text-primary px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl"
          >
            Mua ngay
          </Link>
        </div>
        <div className="relative z-10">
          <Truck className="w-40 h-40 md:w-64 md:h-64 opacity-20" />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold-gradient opacity-10 skew-x-12 translate-x-20" />
      </motion.div>
    </section>
  );
}
