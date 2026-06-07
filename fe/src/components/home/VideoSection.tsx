import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 text-center bg-background text-on-surface">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-6 md:px-12 mb-16"
      >
        <span className="font-sans uppercase tracking-widest text-[#D4AF37] text-sm mb-4 block">PHIM TƯ LIỆU</span>
        <h2 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-6">
          Quy Trình Chế Tác Thủ Công Tinh Xảo
        </h2>
        <p className="text-lg italic mb-8 text-on-surface-variant">
          Xem cách các nghệ nhân làng nghề Chuyên Mỹ thổi hồn vào từng mảnh vỏ trai, ốc để tạo nên những tuyệt tác.
        </p>
        <div className="w-24 h-[1px] bg-[#D4AF37]/40 mx-auto" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-5xl mx-auto px-6"
      >
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group border border-outline-variant/30">
          {isPlaying ? (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/VRDt0YdG9KM?autoplay=1"
              title="Quy Trình Chế Tác Thủ Công Tinh Xảo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <img
                alt="Workshop Process"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                src="https://img.youtube.com/vi/VRDt0YdG9KM/maxresdefault.jpg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-[#D4AF37] text-[#1A1816] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                  aria-label="Phát video"
                >
                  <Play className="w-8 h-8 fill-current" />
                </button>
              </div>
              <div className="absolute bottom-6 left-8 text-xs font-sans uppercase tracking-widest text-[#D4AF37]">
                ĐỘC QUYỀN: BÊN TRONG XƯỞNG KHẢM NGHỆ NHÂN
              </div>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}
