import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';

export default function HeritageSection() {
  const images = [
    { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8M3hPy2HxCfF7_8-0L8CJsLQoOKm-xtgo0wVa5otO3R7xPvp_y7mgb81-qwoLagpTEgyxie35AKuAlKpK23pi0IaEOs_kEmtrJ6fQSsKNv_mNYuY4x_2BPfxS6QboTD_hcVbjVH78O8otTff0tWqQynp-91iQuE5iw9_ms4Y1_fxpwe0oHEzTamz8AthHm-ZTBB0XsGvezEKgNCCb8FIo8myp1RLYoJUcIeYhtQ9_e59_pIMHCXRIyXHvlTMVf8bu-FIYcKvN_eY', alt: 'Nghệ nhân khảm trai', label: 'Nghệ nhân khảm trai', rowSpan: '' },
    { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg-9FYX26HsCBTc_FcreFRFH7tsByQOgQam-hJDRlcMaND6uJblga2hj2hBhVSs085tBR-vQsE10oiJarCN-sCjky_KaakYkhnXNjlH-d06krSJ5tz9yinkEhfImN-fTO9ThAmLLddIREE-liBIFiXnuetvXzARLjRa5Ck5U5Ow_EQci__i6XT7F356PcnLEKt4o_-IgQG427qOTN3CTPOLBbm-DaUEaDQV81N2CNKckU2hw6XNXCK3_X8rbJ-V_VAv0PSwSP-daA', alt: 'Cẩn xà cừ tinh xảo', label: 'Cẩn xà cừ tinh xảo', rowSpan: 'row-span-2' },
    { src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBx6HC2lBLF5uRS6r6k7g0-LniR_3RofkEZdNtl7P6A5WRH2s7i7l4FE0FR-s7EA1hS1igTxf4b_mTJqzmUOaCK8KhwvhrmEUutef6hFzsROpjC1hVddOVpVJ084CE-Kk56-hcad_QUjAiBefaJ7-D9zlmFmfPTaOoz5cFxmqgEvdt8g_p4TWevsFAqjDxa1AVud5JrhIBqzIMq-W80M8B_wlCjxZ3S28s_DnPCYBKOhtoRieCtUoSDgZTRLVW7Ods02hZdPdywDOM', alt: 'Xương mộc truyền thống', label: 'Xương mộc truyền thống', rowSpan: '' },
  ];

  return (
    <section id="heritage" className="py-24 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Image grid */}
        <div className="grid grid-cols-2 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className={`bg-surface-container-high rounded-xl overflow-hidden relative group ${img.rowSpan}`}
            >
              <img alt={img.alt} className="w-full h-full object-cover" src={img.src} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
              <span className="absolute bottom-4 left-4 text-white text-xs font-sans uppercase tracking-widest">
                {img.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-sans uppercase tracking-widest text-primary text-sm mb-4 block">
            HÀNH TRÌNH NGÀN NĂM
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-on-surface mb-6 leading-tight">
            Di Sản Làng Nghề Khảm Trai Chuyên Mỹ — Nghìn Năm Văn Hiến
          </h2>
          <p className="text-primary italic mb-8">Nơi hội tụ tinh hoa nghệ thuật cẩn xà cừ từ thế kỷ XI</p>
          <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
            <p>
              Làng nghề Chuyên Mỹ (Phú Xuyên, Hà Nội) từ lâu đã nổi tiếng khắp vùng Kinh Kỳ với nghề
              khảm trai truyền thống. Theo sử sách, cụ Tổ nghề là ngài Trương Công Thành — một vị
              tướng thời Lý, người đã có công truyền dạy kỹ nghệ cẩn xà cừ tinh xảo cho dân làng từ
              gần một thiên niên kỷ trước.
            </p>
            <p>
              Mỗi tác phẩm từ Chuyên Mỹ không đơn thuần là đồ gỗ, mà là sự kết hợp kỳ diệu giữa
              thiên nhiên và bàn tay con người. Những mảnh vỏ trai, vỏ ốc được lựa chọn kỹ lưỡng,
              qua công đoạn mài giũa, cắt tỉa tỉ mỉ tạo nên những bức tranh lấp lánh sắc màu ngũ sắc.
            </p>
          </div>
          <Link to={PATHS.HERITAGE} className="flex items-center gap-4 text-primary font-bold group mt-10 border-b-2 border-primary-container pb-2">
            Khám phá câu chuyện làng nghề
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
