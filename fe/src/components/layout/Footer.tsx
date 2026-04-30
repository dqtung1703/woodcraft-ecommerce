import { ChevronRight, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';

export default function Footer() {
  return (
    <footer id="footer" className="w-full py-16 px-6 md:px-12 bg-surface-container-highest border-t border-outline-variant/20 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div className="text-xl font-serif text-on-surface">Chuyên Mỹ Artisan Village</div>
          <p className="text-on-surface-variant font-medium text-sm">
            Hơn 1000 năm gìn giữ và phát triển tinh hoa khảm trai, sơn mài Việt Nam.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-serif font-bold mb-6">Khám phá</h4>
          <ul className="space-y-4">
            <li>
              <Link className="text-on-surface-variant hover:text-primary transition-all text-sm" to={PATHS.PRODUCTS}>
                Bộ sưu tập
              </Link>
            </li>
            <li>
              <Link className="text-on-surface-variant hover:text-primary transition-all text-sm" to={PATHS.ORDERS}>
                Đơn hàng
              </Link>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-all text-sm" href="/#heritage">
                Di sản làng nghề
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-all text-sm" href="/#process">
                Quy trình chế tác
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif font-bold mb-6">Liên hệ</h4>
          <ul className="space-y-4 text-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Làng nghề Chuyên Mỹ, Phú Xuyên, Hà Nội</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+84988123456" className="hover:text-primary transition-colors">+84 988 123 456</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@chuyenmyartisan.vn" className="hover:text-primary transition-colors">
                info@chuyenmyartisan.vn
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-serif font-bold mb-6">Bản tin</h4>
          <p className="text-sm text-on-surface-variant mb-4">
            Đăng ký để nhận thông tin về các bộ sưu tập mới nhất.
          </p>
          <div className="relative">
            <input
              className="w-full bg-white border border-outline-variant rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none text-sm"
              placeholder="Email của bạn"
              type="email"
              aria-label="Email đăng ký bản tin"
            />
            <button className="absolute right-2 top-2 bg-primary text-white p-1 rounded-lg hover:bg-primary/90 transition-colors" aria-label="Đăng ký">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-4">
        <p>© 1024–2024 Chuyên Mỹ Artisan Village. 1000 Years of Heritage.</p>
        <div className="flex gap-8">
          <span>Designed with Craftsmanship</span>
          <span>Certified Artisan Network</span>
        </div>
      </div>
    </footer>
  );
}
