import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductDiscountLabel } from '@/utils/productDiscount';
import { toProductDetail } from '@/utils/routePaths';
import StarRating from './StarRating';

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const discountLabel = getProductDiscountLabel(product.discount);

  return (
    <Link
      to={toProductDetail(product.id)}
      className="group bg-surface-container-low rounded-[1.25rem] p-4 block hover:shadow-lg transition-all hover:bg-white"
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
            <span className="text-on-surface-variant text-sm">Chưa có ảnh</span>
          </div>
        )}

        {product.has_discount && discountLabel && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discountLabel}
          </span>
        )}

        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur text-primary p-2.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-md">
          <ShoppingBag className="w-4 h-4" />
        </div>
      </div>

      <h3 className="font-serif text-base text-on-surface mb-1 line-clamp-2">{product.name}</h3>

      {product.avg_rating > 0 && <StarRating rating={product.avg_rating} size="sm" className="mb-2" />}

      <div className="flex items-center gap-2">
        <span className="text-primary font-bold">{formatCurrency(product.final_price)}</span>
        {product.has_discount ? (
          <span className="text-on-surface-variant text-sm line-through">
            {formatCurrency(product.price)}
          </span>
        ) : (
          product.original_price && product.original_price !== product.price && (
            <span className="text-on-surface-variant text-sm line-through">
              {formatCurrency(product.original_price)}
            </span>
          )
        )}
      </div>
    </Link>
  );
}
