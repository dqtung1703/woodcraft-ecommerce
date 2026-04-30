import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';

const categories = [
  {
    title: 'Nội thất gỗ',
    desc: 'Kiệt tác không gian sống từ gỗ quý tự nhiên.',
    colSpan: 'md:col-span-2',
    imgAlt: 'Luxury handcrafted wood furniture with mother of pearl inlay',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcVjbfKP3QHP8ojKcHHccxOda7Urc_cCYtXQ-x1oxVSNxyN-MKWzpuwJTbrdbr1hdJEnH3HsjBqBB_VIBe4qb8gqoIZ3LNt9V0ERRAlrgYqZHVL-7jv8Hizm9mL1UqASkkX9Kg3oPskk-mmNF2YCcKRCkuAexudq78vJfUqdLFeuzLBFeHEMXC3F4kmCqxhBEsUbdYhBPy-2jCEc6Z8SxkZ-t_2DxpDVO7JBDJO7cn5s8jgyedXeiEcNtkt_p_yE8lupW81akkHKc',
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
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9bn5YmjST16uvy52C8CKqTuDkaLaA6ZEpgK7PjKfs_OFYehZvGbsVMNxDiSagpyPzAMzeHTKFFAzka8aSLye86qhmLFqnYUrJBoWY1NSI3-iCrIN9Pjr4darDeC1m9rHyemHHCrdExaMzycFxQjnVBWubSdxogp8WOQdPD9fGqUgZ8ai_RPj8_ZHpk-oz1zlLrLE_BNtHAMvpCttJP-i4qDXMUCTo3RxRmvUTX9nU6EQj6Ubs6ETaUZuDpN2pw-myYLILKiGjJlo',
    titleSize: 'text-2xl',
  },
  {
    title: 'Quà tặng cao cấp',
    desc: 'Sự tinh tế trong từng chi tiết nhỏ nhất.',
    colSpan: 'md:col-span-2',
    imgAlt: 'High-end artisanal corporate gifts',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCldKtv2nwuMLeDo2ENYXHNFhegIWD5Xp3GVvsBzYCNggdmUJ29XaniZ3Kv15SH-gJrSnHg8GZId8EPrsmuSkfQXENs6vjjH6cheFNM5kB_3nb3RLu2p7Wf6pnide0aa2EJiYSn3N6QaPYNBz0yNFekUDdB232HW2cqGpgIV7w-X5A_oWsQUsDvUP5s_HYSInyr630mqI3P0VZo5VMibLBn3Djoy4xKuIZMuJSrw3XZVw6tIYZSoZS0So4QOdNDz7HcwaOOzsrnZYQ',
    titleSize: 'text-3xl',
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
            <Link to={PATHS.PRODUCTS}>
              <img
                alt={cat.imgAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={cat.img}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent p-8 md:p-10 flex flex-col justify-end">
                <h3 className={`${cat.titleSize} text-white font-serif mb-2`}>{cat.title}</h3>
                {cat.desc && <p className="text-white/80 max-w-md">{cat.desc}</p>}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
