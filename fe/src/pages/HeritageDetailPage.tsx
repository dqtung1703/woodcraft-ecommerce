import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';

import heroImg     from '@/assets/heritage/hero.png';
import macroImg    from '@/assets/heritage/macro.png';
import villageImg  from '@/assets/heritage/village.png';
import artisanImg  from '@/assets/heritage/artisan.png';
import productsImg from '@/assets/heritage/products.png';
import processImg  from '@/assets/heritage/process.png';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

const steps = [
  { no: '01', title: 'Chọn gỗ', desc: 'Gỗ mít, gỗ trắc hay gỗ hương được tuyển lựa kỹ, phơi khô hoàn toàn trước khi đưa vào xưởng.' },
  { no: '02', title: 'Chọn vỏ trai', desc: 'Vỏ trai, vỏ ốc xà cừ được nhập về từ khắp nơi, chọn lọc theo độ dày, màu sắc và ánh ngũ sắc.' },
  { no: '03', title: 'Cắt tạo hình', desc: 'Nghệ nhân dùng cưa nhỏ và đục tinh xảo cắt từng mảnh vỏ trai thành hình hoa, lá, chim, thú theo mẫu vẽ.' },
  { no: '04', title: 'Khảm thủ công', desc: 'Từng mảnh vỏ được khảm vào nền gỗ bằng đục chạm tỉ mỉ — đòi hỏi đôi tay nghệ nhân cực kỳ khéo léo.' },
  { no: '05', title: 'Đánh bóng hoàn thiện', desc: 'Sản phẩm được phủ sơn mài nhiều lớp, mài nhẵn, đánh bóng để lộ ra những đường khảm lấp lánh sắc màu.' },
];

const artisans = [
  { name: 'Nghệ nhân Nguyễn Văn Thành', title: 'Bậc thầy khảm trai 50 năm kinh nghiệm', quote: 'Mỗi đường khảm là một lời thì thầm gửi đến ngàn năm sau.' },
  { name: 'Nghệ nhân Trần Thị Hoa',     title: 'Chuyên gia sơn mài truyền thống',       quote: 'Tôi học nghề từ cha, cha học từ ông — đây là báu vật của làng.' },
  { name: 'Nghệ nhân Lê Đức Minh',      title: 'Thợ chạm khắc gỗ hàng đầu',            quote: 'Bàn tay chạm vào gỗ như chạm vào linh hồn của thiên nhiên.' },
];

export default function HeritageDetailPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="bg-surface text-on-surface overflow-x-hidden">

      {/* ═══ 1. HERO ═══ */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={heroImg} alt="Nghệ nhân khảm trai" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-surface" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p {...fadeUp(0.2)} className="font-sans uppercase tracking-[0.4em] text-primary-container text-sm mb-6">
            Làng Nghề Chuyên Mỹ · Phú Xuyên · Hà Nội
          </motion.p>
          <motion.h1 {...fadeUp(0.4)} className="font-serif text-5xl md:text-7xl leading-tight mb-8 text-white drop-shadow-lg">
            Ngàn Năm<br /><em className="text-primary-container">Khảm Trai</em><br />Việt
          </motion.h1>
          <motion.p {...fadeUp(0.6)} className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Nơi lưu giữ tinh hoa nghệ thuật cẩn xà cừ hơn nghìn năm văn hiến, được trao truyền qua từng thế hệ bàn tay nghệ nhân Chuyên Mỹ.
          </motion.p>
          <motion.div {...fadeUp(0.8)} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#history" className="group flex items-center gap-3 bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg">
              Khám phá di sản <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link to={PATHS.PRODUCTS} className="flex items-center gap-3 border-2 border-white/70 text-white px-8 py-4 rounded-full hover:border-white hover:bg-white/10 transition-all duration-300">
              Bộ sưu tập
            </Link>
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70">
          <ArrowDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ═══ 2. HISTORY ═══ */}
      <section id="history" className="py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeUp(0)}>
            <p className="font-sans uppercase tracking-[0.3em] text-primary text-xs mb-6">Hành Trình Ngàn Năm</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8 text-on-surface">
              Di Sản Hơn<br /><em className="text-primary">1.000 Năm</em><br />Văn Hiến
            </h2>
            <div className="w-16 h-px bg-primary-container mb-8" />
            <div className="space-y-5 text-on-surface-variant text-lg leading-relaxed">
              <p>Làng nghề Chuyên Mỹ (Phú Xuyên, Hà Nội) từ lâu đã nổi tiếng khắp vùng Kinh Kỳ với nghề khảm trai truyền thống. Theo sử sách, cụ Tổ nghề là ngài Trương Công Thành — một vị tướng thời Lý, người đã có công truyền dạy kỹ nghệ cẩn xà cừ tinh xảo cho dân làng từ gần một thiên niên kỷ trước.</p>
              <p>Mỗi tác phẩm từ Chuyên Mỹ không đơn thuần là đồ gỗ, mà là sự kết hợp kỳ diệu giữa thiên nhiên và bàn tay con người. Những mảnh vỏ trai, vỏ ốc được lựa chọn kỹ lưỡng, qua công đoạn mài giũa, cắt tỉa tỉ mỉ tạo nên những bức tranh lấp lánh sắc màu ngũ sắc.</p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[['1.000+', 'Năm lịch sử'], ['500+', 'Nghệ nhân'], ['50+', 'Quốc gia xuất khẩu']].map(([n, l]) => (
                <div key={l} className="border-l-2 border-primary-container pl-4">
                  <p className="font-serif text-3xl text-primary font-bold">{n}</p>
                  <p className="text-on-surface-variant text-sm mt-1">{l}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
                <img src={villageImg} alt="Làng nghề" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square shadow-md">
                <img src={macroImg} alt="Chi tiết khảm" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="rounded-2xl overflow-hidden aspect-square shadow-md">
                <img src={processImg} alt="Quy trình" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
                <img src={productsImg} alt="Sản phẩm" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3. CRAFT ART — subtle warm band ═══ */}
      <section className="relative py-28 overflow-hidden bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp(0.2)} className="rounded-3xl overflow-hidden aspect-square shadow-xl order-2 lg:order-1">
            <img src={macroImg} alt="Chi tiết khảm trai" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div {...fadeUp(0)} className="order-1 lg:order-2">
            <p className="font-sans uppercase tracking-[0.3em] text-primary text-xs mb-6">Tinh Hoa Nghệ Thuật</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8 text-on-surface">
              Nghệ Thuật<br /><em className="text-primary">Khảm Trai</em><br />Truyền Thống
            </h2>
            <div className="w-16 h-px bg-primary-container mb-8" />
            <div className="space-y-5 text-on-surface-variant text-lg leading-relaxed">
              <p>Kỹ thuật khảm trai (cẩn xà cừ) là di sản độc đáo của người Việt, đạt đến đỉnh cao tinh xảo tại làng Chuyên Mỹ. Nghệ nhân phải mất nhiều năm học nghề để thành thạo từng đường chạm, từng mảnh ghép.</p>
              <p>Ánh sáng phản chiếu qua từng mảnh vỏ trai tạo nên hiệu ứng ngũ sắc huyền ảo — một kiệt tác không thể làm giả bằng bất kỳ máy móc nào.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 4. ARTISANS ═══ */}
      <section className="py-28 px-6 md:px-16 max-w-7xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-20">
          <p className="font-sans uppercase tracking-[0.3em] text-primary text-xs mb-4">Những Con Người Giữ Lửa</p>
          <h2 className="font-serif text-4xl md:text-5xl text-on-surface">
            Nghệ Nhân <em className="text-primary">Làng Nghề</em>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisans.map((a, i) => (
            <motion.div key={i} {...fadeUp(i * 0.15)}
              className="group border border-outline-variant rounded-3xl p-8 hover:border-primary-container hover:bg-surface-container-low transition-all duration-500 shadow-sm hover:shadow-md">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-6 ring-2 ring-outline-variant group-hover:ring-primary-container transition-all">
                <img src={artisanImg} alt={a.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-primary text-sm font-serif italic mb-4 leading-relaxed">"{a.quote}"</p>
              <div className="w-8 h-px bg-primary-container mb-4" />
              <h3 className="font-serif text-on-surface font-bold mb-1">{a.name}</h3>
              <p className="text-on-surface-variant text-sm">{a.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ 5. PROCESS ═══ */}
      <section className="py-28 px-6 md:px-16 bg-surface-container">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <p className="font-sans uppercase tracking-[0.3em] text-primary text-xs mb-4">Từ Bàn Tay Đến Kiệt Tác</p>
            <h2 className="font-serif text-4xl md:text-5xl text-on-surface">
              Quy Trình <em className="text-primary">Chế Tác</em>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-3">
              {steps.map((s, i) => (
                <motion.button key={i} {...fadeUp(i * 0.08)} onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                    activeStep === i
                      ? 'border-primary bg-surface-container-lowest shadow-md'
                      : 'border-outline-variant bg-surface hover:border-primary/40 hover:bg-surface-container-low'
                  }`}>
                  <div className="flex items-center gap-4">
                    <span className={`font-serif text-2xl font-bold transition-colors ${activeStep === i ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                      {s.no}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-on-surface font-bold mb-1">{s.title}</h3>
                      {activeStep === i && (
                        <p className="text-on-surface-variant text-sm leading-relaxed mt-2">{s.desc}</p>
                      )}
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary/50 transition-transform ${activeStep === i ? 'rotate-180' : ''}`} />
                  </div>
                </motion.button>
              ))}
            </div>
            <motion.div {...fadeUp(0.2)} className="relative rounded-3xl overflow-hidden aspect-square sticky top-32 shadow-xl">
              <img src={processImg} alt="Quy trình chế tác" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <p className="text-primary-container font-sans uppercase tracking-widest text-xs">{steps[activeStep].no}</p>
                <p className="font-serif text-white text-xl font-bold">{steps[activeStep].title}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 6. PRESERVATION CTA — cinematic image overlay ═══ */}
      <section className="relative py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img src={villageImg} alt="Làng nghề" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.p {...fadeUp(0)} className="font-sans uppercase tracking-[0.3em] text-primary-container text-xs mb-6">
            Giữ Hồn Di Sản
          </motion.p>
          <motion.h2 {...fadeUp(0.1)} className="font-serif text-4xl md:text-6xl leading-tight mb-8 text-white">
            Mỗi Tác Phẩm Là<br /><em className="text-primary-container">Một Lời Hứa</em><br />Với Ngàn Năm
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="text-white/75 text-lg leading-relaxed mb-12">
            Khi bạn sở hữu một tác phẩm khảm trai Chuyên Mỹ, bạn không chỉ mua một món đồ đẹp — bạn đang gìn giữ và tiếp nối một nền văn hóa ngàn năm của dân tộc Việt Nam.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="flex justify-center">
            <Link to={PATHS.PRODUCTS}
              className="group flex items-center gap-3 bg-primary text-white font-bold px-8 py-4 rounded-full hover:bg-primary/90 transition-all hover:scale-105 shadow-lg">
              Khám phá bộ sưu tập <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ 7. MINI CONTACT BAR ═══ */}
      <section className="py-16 px-6 md:px-16 bg-surface-container-highest border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-on-surface-variant text-sm">
          <div>
            <p className="font-serif text-on-surface text-xl mb-3 italic">Chuyên Mỹ Artisan</p>
            <p className="leading-relaxed">Hơn 1000 năm gìn giữ và phát triển tinh hoa khảm trai, sơn mài Việt Nam.</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" /><span>Làng nghề Chuyên Mỹ, Phú Xuyên, Hà Nội</span></div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /><a href="tel:+84988123456" className="hover:text-primary transition-colors">+84 988 123 456</a></div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /><a href="mailto:info@chuyenmyartisan.vn" className="hover:text-primary transition-colors">info@chuyenmyartisan.vn</a></div>
          </div>
          <div className="flex items-center">
            <Link to={PATHS.HOME} className="text-primary hover:text-primary/70 transition-colors font-medium">
              ← Về trang chủ
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-outline-variant/20 text-center text-on-surface-variant/40 text-xs">
          © 1024–2024 Chuyên Mỹ Artisan Village · 1000 Years of Heritage
        </div>
      </section>
    </div>
  );
}
