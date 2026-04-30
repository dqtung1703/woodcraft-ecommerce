import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    text: '"Sản phẩm quá tinh xảo, tôi thực sự bất ngờ trước độ chi tiết của các mảnh khảm trai trên bộ tranh."',
    author: 'Ông Hoàng Nam, Hà Nội',
  },
  {
    text: '"The craftsmanship is museum quality. It brings a soul to my living room that factory furniture just can\'t."',
    author: 'David Miller, United Kingdom',
  },
  {
    text: '"Dịch vụ vận chuyển rất cẩn thận, đóng gói gỗ chuyên dụng nên hàng đến tay hoàn hảo."',
    author: 'Chị Lan Anh, TP. Hồ Chí Minh',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {reviews.map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="bg-white p-8 md:p-10 rounded-[1.25rem] shadow-sm"
          >
            <div className="flex text-primary-container mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="italic text-on-surface mb-6 text-lg">{review.text}</p>
            <p className="font-bold text-on-surface">— {review.author}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
