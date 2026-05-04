export type CartItem = {
  id: number;
  product_id: number;
  name: string;
  image: string | null;
  price: number;
  final_price: number;
  quantity: number;
  subtotal: number;
  stock: number;
};

export type Cart = {
  items_count: number;
  total_price: number;
  items: CartItem[];
};

export type AddToCartPayload = {
  product_id: number;
  quantity: number;
};

export type UpdateCartItemPayload = {
  quantity: number;
};
