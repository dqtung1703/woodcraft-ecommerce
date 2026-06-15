import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';

const SOURCE_URL = 'https://langnghechuyenmy.vn/gioi-thieu';

const images = {
  hero: 'https://cdn6080.cdn4s1.com/media/gioi-thieu/1.webp',
  craft: 'https://cdn6080.cdn4s1.com/media/gioi-thieu/2.webp',
  village: 'https://cdn6080.cdn4s1.com/media/gioi-thieu/3.webp',
  future: 'https://cdn6080.cdn4s1.com/media/gioi-thieu/4.webp',
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const milestones = [
  {
    label: 'Thế kỷ XI',
    title: 'Khởi nguồn nghề khảm trai',
    text: 'Theo tư liệu giới thiệu của làng nghề, nghề khảm trai xã Chuyên Mỹ đã có từ thế kỷ XI.',
  },
  {
    label: 'Chuôn Ngọ',
    title: 'Nơi thờ Tổ nghề',
    text: 'Đình làng Chuôn Ngọ thờ ông Trương Công Thành, vị tướng thời Lý được suy tôn là Tổ nghề khảm trai.',
  },
  {
    label: 'Những năm 1990',
    title: 'Thời kỳ hưng thịnh',
    text: 'Làng nghề từng phát triển mạnh với các làng cung cấp vật liệu trai, ốc, làm tranh và đồ mộc gia đình.',
  },
  {
    label: '2025',
    title: 'Hướng tới mạng lưới thủ công sáng tạo',
    text: 'Chuyên Mỹ triển khai hồ sơ, tiêu chí và các hoạt động tôn vinh làng nghề gắn với OCOP và du lịch.',
  },
];

const craftStories = [
  {
    title: 'Khảm trai Chuyên Mỹ',
    text: 'Những mảnh vỏ trai, vỏ ốc được chọn lọc và ghép lên nền gỗ để tạo nên tranh khảm, hoành phi, câu đối và đồ mộc gia đình có độ tinh xảo cao.',
  },
  {
    title: 'Sơn mài Bối Khê',
    text: 'Thôn Bối Khê nổi tiếng với sản phẩm sơn son thếp vàng, tượng Phật, hoành phi câu đối và các dòng bát, đĩa, lọ hoa, khay, tranh sơn xuất khẩu.',
  },
  {
    title: 'Sinh kế từ nghề truyền thống',
    text: 'Sau gần một nghìn năm thăng trầm, nghề khảm trai - sơn mài vẫn tạo việc làm cho hàng nghìn lao động tại Chuyên Mỹ và các xã lân cận.',
  },
];

export default function HeritageDetailPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <div className="bg-surface text-on-surface overflow-x-hidden">
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={images.hero} alt="Làng nghề khảm trai sơn mài Chuyên Mỹ" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-surface" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto max-w-6xl px-6 py-28 md:px-12">
          <motion.p {...fadeUp(0.1)} className="mb-6 font-sans text-sm uppercase text-primary-container">
            Chuyên Mỹ, Phú Xuyên, Hà Nội
          </motion.p>
          <motion.h1 {...fadeUp(0.2)} className="max-w-4xl font-serif text-5xl leading-tight text-white drop-shadow-lg md:text-7xl">
            Khảm trai - sơn mài Chuyên Mỹ
          </motion.h1>
          <motion.p {...fadeUp(0.3)} className="mt-8 max-w-2xl text-lg leading-relaxed !text-white md:text-xl">
            Câu chuyện về làng nghề gần một nghìn năm tuổi, nơi nghề khảm trai và sơn mài tiếp tục được giữ gìn trong đời sống, sản xuất và du lịch sáng tạo.
          </motion.p>
          <motion.div {...fadeUp(0.4)} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#story" className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 font-bold text-white shadow-lg transition hover:bg-primary/90">
              Đọc câu chuyện <ArrowRight className="h-5 w-5" />
            </a>
            <Link to={PATHS.PRODUCTS} className="inline-flex items-center justify-center rounded-full border border-white/70 px-7 py-4 font-medium text-white transition hover:bg-white/10">
              Xem sản phẩm
            </Link>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-white/70">
          <ArrowDown className="h-6 w-6" />
        </motion.div>
      </section>

      <section id="story" className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-24 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div {...fadeUp(0)}>
          <p className="mb-5 font-sans text-xs uppercase text-primary">Tư liệu làng nghề</p>
          <h2 className="font-serif text-4xl leading-tight text-on-surface md:text-5xl">
            Lưu giữ nét đẹp văn hóa của dân tộc
          </h2>
          <div className="my-8 h-px w-16 bg-primary-container" />
          <div className="space-y-5 text-lg leading-relaxed text-on-surface-variant">
            <p>
              Theo giới thiệu của làng nghề Chuyên Mỹ, nghề khảm trai tại xã đã có từ thế kỷ XI. Đình làng Chuôn Ngọ thờ ông Trương Công Thành, một vị tướng dưới triều Lý, được suy tôn là Tổ nghề vì có công dạy nghề cho dân làng.
            </p>
            <p>
              Chuyên Mỹ gồm nhiều làng làm nghề khảm trai như Chuôn Thượng, Chuôn Trung, Chuôn Ngọ và Chuôn Hạ. Riêng Chuôn Ngọ là nơi có đình thờ Tổ nghề, gắn với lịch sử và bề dày làm nghề đặc sắc hơn cả.
            </p>
            <p>
              Thời kỳ những năm 1990 được xem là giai đoạn hưng thịnh: có làng chuyên cung cấp vật liệu trai, ốc; có làng làm tranh; có làng làm đồ mộc gia đình như hoành phi, câu đối. Từ nghề truyền thống, nhiều nghệ nhân đã làm giàu cho bản thân và quê hương.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <img src={images.craft} alt="Sản phẩm khảm trai Chuyên Mỹ" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
            <div className="aspect-square overflow-hidden rounded-lg shadow-md">
              <img src={images.future} alt="Trưng bày sản phẩm làng nghề Chuyên Mỹ" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
          </div>
          <div className="space-y-4 pt-10">
            <div className="aspect-square overflow-hidden rounded-lg shadow-md">
              <img src={images.village} alt="Nghệ nhân và sản phẩm khảm trai sơn mài" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
            <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-md">
              <img src={images.hero} alt="Không gian làng nghề Chuyên Mỹ" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-surface-container-low px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp(0)} className="mb-14 max-w-3xl">
            <p className="mb-5 font-sans text-xs uppercase text-primary">Dòng nghề nổi bật</p>
            <h2 className="font-serif text-4xl leading-tight text-on-surface md:text-5xl">
              Khảm trai Chuôn Ngọ và sơn mài Bối Khê
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {craftStories.map((item, index) => (
              <motion.article key={item.title} {...fadeUp(index * 0.1)} className="rounded-lg border border-outline-variant bg-surface p-7 shadow-sm">
                <p className="mb-4 font-serif text-2xl text-primary">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mb-4 font-serif text-2xl text-on-surface">{item.title}</h3>
                <p className="leading-relaxed text-on-surface-variant">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div {...fadeUp(0)} className="overflow-hidden rounded-lg shadow-xl">
            <img src={images.village} alt="Hoạt động tại làng nghề khảm trai sơn mài Chuyên Mỹ" className="h-full w-full object-cover" />
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <p className="mb-5 font-sans text-xs uppercase text-primary">Dấu mốc phát triển</p>
            <div className="space-y-5">
              {milestones.map((item) => (
                <div key={item.title} className="grid grid-cols-[92px_1fr] gap-5 border-b border-outline-variant/60 pb-5">
                  <p className="text-sm font-semibold uppercase text-primary">{item.label}</p>
                  <div>
                    <h3 className="font-serif text-2xl text-on-surface">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-on-surface-variant">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden py-32">
        <img src={images.future} alt="Trung tâm giới thiệu và quảng bá sản phẩm OCOP Chuyên Mỹ" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.p {...fadeUp(0)} className="mb-5 font-sans text-xs uppercase text-primary-container">
            Hướng đi mới
          </motion.p>
          <motion.h2 {...fadeUp(0.1)} className="font-serif text-4xl leading-tight text-white md:text-6xl">
            Làng nghề gắn với thiết kế sáng tạo, OCOP và du lịch
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed !text-white">
            Chuyên Mỹ đang triển khai việc hoàn thiện hồ sơ, tiêu chí công nhận thành viên mạng lưới các Thành phố Thủ công sáng tạo thế giới, đồng thời phát triển không gian giới thiệu, quảng bá và bán sản phẩm OCOP của làng nghề.
          </motion.p>
          <motion.div {...fadeUp(0.3)} className="mt-10">
            <a href={SOURCE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-bold text-white shadow-lg transition hover:bg-primary/90">
              Xem nguồn tư liệu <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
