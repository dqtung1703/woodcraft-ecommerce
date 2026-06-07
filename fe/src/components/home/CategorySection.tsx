import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';
import furnitureImg from '@/assets/heritage/furniture.jpg';
import lacquerplateImg from '@/assets/heritage/lacquerplate.jpg';
import giftImg from '@/assets/heritage/gift.png';

type CategoryItem = {
  title: string;
  desc: string | null;
  colSpan: string;
  imgAlt: string;
  img: string;
  titleSize: string;
  imgClass?: string;
  hideText?: boolean;
};

const categories: CategoryItem[] = [
  {
    title: 'Nội thất gỗ',
    desc: 'Kiệt tác không gian sống từ gỗ quý tự nhiên.',
    colSpan: 'md:col-span-2',
    imgAlt: 'Luxury handcrafted wood furniture with mother of pearl inlay',
    img: furnitureImg,
    titleSize: 'text-3xl',
  },
  {
    title: 'Sơn mài nghệ thuật',
    desc: null,
    colSpan: '',
    imgAlt: 'Traditional Vietnamese lacquerware artwork',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg-9FYX26HsCBTc_FcreFRFH7tsByQOgQam-hJDRlcMaND6uJblga2hj2hBhVSs085tBR-vQsE10oiJarCN-sCjky_KaakYkhnXNjlH-d06krSJ5tz9yinkEhfImN-fTO9ThAmLLddIREE-liBIFiXnuetvXzARLjRa5Ck5U5Ow_EQci__i6XT7F356PcnLEKt4o_-IgQG427qOTN3CTPOLBbm-DaUEaDQV81N2CNKckU2hw6XNXCK3_X8rbJ-V_VAv0PSwSP-daA',
    titleSize: 'text-2xl',
  },
  {
    title: 'Tranh khảm trai',
    desc: null,
    colSpan: '',
    imgAlt: 'Exquisite mother of pearl inlay box',
    img: lacquerplateImg,
    titleSize: 'text-2xl',
  },
  {
    title: 'Quà tặng cao cấp',
    desc: 'Sự tinh tế trong từng chi tiết nhỏ nhất.',
    colSpan: 'md:col-span-2',
    imgAlt: 'High-end artisanal corporate gifts',
    img: giftImg,
    titleSize: 'text-3xl',
    hideText: true,
  },
];

export default function CategorySection() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="font-sans uppercase tracking-widest text-primary text-sm mb-2 block">
          Our Collections
        </span>
        <h2 className="text-4xl font-serif text-on-surface">Danh mục sản phẩm</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[700px]">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={`${cat.colSpan} relative rounded-[1.25rem] overflow-hidden group cursor-pointer h-64 md:h-auto`}
          >
            <Link to={PATHS.PRODUCTS} className="block w-full h-full bg-[#0a0a0a] relative overflow-hidden">
              {cat.imgClass?.includes('object-contain') && (
                <img
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50 scale-110 pointer-events-none"
                  src={cat.img}
                />
              )}
              <img
                alt={cat.imgAlt}
                className={`relative z-10 w-full h-full ${cat.imgClass || 'object-cover'} transition-transform duration-700 group-hover:scale-105`}
                src={cat.img}
              />
              {!cat.hideText && (
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent p-8 md:p-10 flex flex-col justify-end z-20">
                  <h3 className={`${cat.titleSize} text-white font-serif mb-2`}>{cat.title}</h3>
                  {cat.desc && <p className="text-white/80 max-w-md">{cat.desc}</p>}
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
