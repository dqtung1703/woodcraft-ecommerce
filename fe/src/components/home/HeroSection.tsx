import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img
          alt="Nghệ nhân khảm trai làng Chuyên Mỹ"
          className="w-full h-full object-cover brightness-75 contrast-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWpU2HQqgdJOUAylO3lrJjcRQiynumEazjyivryyzGXh0eZvQqdBI1p6WBJUE7g5mOGabczPfG-8EAH91Zot9hTi0uW_WcjAtvNPEPxQEMsLlwaBCfauncGpCzpUPc3ndS7yltwdeXDNUKIEwfCSQm7yiQiQLfjmPrd-fR8_LgqUNGlYth-LXm-GDXxHsIztAgIuh9asrk37CK_HBLKlBNxNwMS0BLZ2yTv3UPHbOG9w-nHfabVojCQYhhLve_shrUYPQRP9e2eRQ"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 px-6 md:px-32 max-w-5xl text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <span className="font-sans uppercase tracking-[0.5em] text-[#d4af37]/90 text-sm mb-2 block">
            Hereditary Craftsmanship
          </span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-[1.1] tracking-tight">
            Tinh hoa 1000 năm <br />
            <span className="italic font-light">làng nghề Chuyên Mỹ</span>
          </h1>
          <div className="flex flex-wrap gap-6 items-center">
            <Link
              to={PATHS.PRODUCTS}
              className="bg-gold-gradient text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all duration-500 tracking-widest uppercase text-xs shadow-2xl"
            >
              Mua ngay
            </Link>
            <Link
              to={PATHS.PRODUCTS}
              className="backdrop-blur-md bg-white/5 border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-500 tracking-widest uppercase text-xs"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
