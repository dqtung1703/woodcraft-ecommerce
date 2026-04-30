import { motion } from 'framer-motion';
import { Gem, Globe, Hammer, Users } from 'lucide-react';

const features = [
  { icon: Hammer, title: 'Thủ công 100%' },
  { icon: Users, title: 'Nghệ nhân truyền thống' },
  { icon: Gem, title: 'Độc bản nghệ thuật' },
  { icon: Globe, title: 'Xuất khẩu quốc tế' },
];

export default function USPSection() {
  return (
    <section className="py-20 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <feature.icon className="text-primary w-10 h-10" />
            <h3 className="font-serif text-lg">{feature.title}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
