import { Link } from 'react-router-dom';
import { PATHS } from '@/utils/routePaths';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="font-sans uppercase tracking-widest text-primary text-sm mb-4">Lỗi 404</p>
      <h1 className="text-6xl md:text-8xl font-serif text-on-surface mb-6">Không tìm thấy</h1>
      <p className="text-on-surface-variant text-lg mb-10 max-w-md">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        to={PATHS.HOME}
        className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all tracking-widest uppercase text-xs shadow-lg"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
