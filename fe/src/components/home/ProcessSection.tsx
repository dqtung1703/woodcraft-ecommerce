import { motion } from 'framer-motion';

const steps = [
  { num: 1, title: 'Chọn gỗ', desc: 'Lựa chọn các loại gỗ quý lâu năm, độ bền cao.' },
  { num: 2, title: 'Chạm khắc', desc: 'Phác họa và đục đẽo họa tiết thô trên mặt gỗ.' },
  { num: 3, title: 'Khảm trai', desc: 'Cẩn những mảnh xà cừ, vỏ trai óng ánh vào gỗ.' },
  { num: 4, title: 'Sơn mài', desc: 'Phủ nhiều lớp sơn ta truyền thống tạo độ bóng.' },
  { num: 5, title: 'Hoàn thiện', desc: 'Đánh bóng và kiểm tra chi tiết cuối cùng.' },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-surface-container-high px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto text-center mb-20"
      >
        <span className="font-sans uppercase tracking-widest text-primary text-sm mb-2 block">Our Craft</span>
        <h2 className="text-4xl font-serif text-on-surface">Quy trình chế tác</h2>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg">
              {step.num}
            </div>
            <h4 className="font-serif text-xl mb-3">{step.title}</h4>
            <p className="text-sm text-on-surface-variant">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
