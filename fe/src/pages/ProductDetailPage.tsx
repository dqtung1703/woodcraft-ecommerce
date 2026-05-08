import { ArrowLeft, CheckCircle, ChevronRight, Package, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { productService } from '@/services/productService';
import type { Product, ProductDetail } from '@/types/product';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductDiscountLabel } from '@/utils/productDiscount';
import { PATHS } from '@/utils/routePaths';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const toast = useToast();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const discountLabel = product ? getProductDiscountLabel(product.discount) : null;

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);
    setLoading(true);
    setError(null);
    setQuantity(1);

    productService
      .getProduct(numId)
      .then((data) => {
        setProduct(data);
        setSelectedImage(data.image);
        productService.getRelatedProducts(numId).then(setRelated).catch(() => {});
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-on-surface-variant">{error ?? 'Không tìm thấy sản phẩm.'}</p>
        <Link to={PATHS.PRODUCTS} className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Quay lại bộ sưu tập
        </Link>
      </div>
    );
  }

  // Build gallery from main image + extra images
  const gallery = [
    ...(product.image ? [product.image] : []),
    ...(product.images ?? []).filter((img) => img !== product.image),
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-10" aria-label="Breadcrumb">
        <Link to={PATHS.HOME} className="hover:text-primary transition-colors">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={PATHS.PRODUCTS} className="hover:text-primary transition-colors">Bộ sưu tập</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-on-surface line-clamp-1 max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main product section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-surface-container-low rounded-[1.25rem] overflow-hidden">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">
                Chưa có ảnh
              </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  aria-label={`Ảnh ${idx + 1}`}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {product.category && (
            <span className="font-sans uppercase tracking-widest text-primary text-xs mb-3 block">
              {product.category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-serif text-on-surface mb-4 leading-tight">
            {product.name}
          </h1>

          {product.avg_rating > 0 && <StarRating rating={product.avg_rating} size="md" className="mb-4" />}

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary">{formatCurrency(product.final_price)}</span>
            {product.has_discount && product.original_price && (
              <>
                <span className="text-lg text-on-surface-variant line-through">
                  {formatCurrency(product.original_price)}
                </span>
                {discountLabel && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                    {discountLabel}
                  </span>
                )}
              </>
            )}
          </div>

          {product.description && (
            <p className="text-on-surface-variant leading-relaxed mb-6">{product.description}</p>
          )}

          {/* Specs */}
          <div className="space-y-2 mb-8 text-sm border-t border-outline-variant/40 pt-6">
            {product.material && (
              <div className="flex gap-3">
                <span className="text-on-surface-variant w-28 flex-shrink-0">Chất liệu</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            <div className="flex gap-3 items-center">
              <span className="text-on-surface-variant w-28 flex-shrink-0">Tình trạng</span>
              {product.stock > 0 ? (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <Package className="w-4 h-4" /> Còn hàng ({product.stock})
                </span>
              ) : (
                <span className="text-red-500 font-medium">Hết hàng</span>
              )}
            </div>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden">
              <button
                className="px-4 py-3 hover:bg-surface-container-low disabled:opacity-30 transition-colors"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <span className="px-5 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
              <button
                className="px-4 py-3 hover:bg-surface-container-low disabled:opacity-30 transition-colors"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>

            <button
              disabled={product.stock === 0 || addingToCart}
              onClick={async () => {
                if (!isAuthenticated) { navigate(PATHS.LOGIN); return; }
                setAddingToCart(true);
                try {
                  await addItem(product.id, quantity);
                  setAddedToCart(true);
                  toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
                  setTimeout(() => setAddedToCart(false), 2500);
                } catch {
                  toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
                } finally {
                  setAddingToCart(false);
                }
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:cursor-not-allowed ${
                addedToCart
                  ? 'bg-green-600 text-white'
                  : 'bg-primary text-white hover:opacity-90 disabled:opacity-40'
              }`}
              aria-label="Thêm vào giỏ hàng"
            >
              {addedToCart ? (
                <><CheckCircle className="w-5 h-5" /> Đã thêm vào giỏ!</>
              ) : addingToCart ? (
                <><ShoppingBag className="w-5 h-5 animate-bounce" /> Đang thêm...</>
              ) : product.stock === 0 ? (
                'Hết hàng'
              ) : (
                <><ShoppingBag className="w-5 h-5" /> Thêm vào giỏ hàng</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="mb-24" aria-labelledby="reviews-heading">
          <h2 id="reviews-heading" className="text-2xl font-serif text-on-surface mb-8">
            Đánh giá ({product.reviews_count})
          </h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-surface-container-low rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-on-surface">{review.user_name}</span>
                  <span className="text-xs text-on-surface-variant">
                    {new Date(review.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <StarRating rating={review.rating} size="sm" className="mb-3" />
                {review.comment && <p className="text-on-surface-variant text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-2xl font-serif text-on-surface mb-8">
            Sản phẩm liên quan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
