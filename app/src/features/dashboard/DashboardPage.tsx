import { useMemo, useState } from 'react';
import { placeOrder } from './api';

type ProductCategory = 'all' | 'dry-fruits' | 'spices-tea' | 'traditional';

interface Product {
  id: string;
  name: string;
  nameKashmiri: string;
  price: number;
  unit: string;
  description: string;
  emoji: string;
  image: string;
  category: Exclude<ProductCategory, 'all'>;
  badge?: string;
}

interface CartItem extends Product {
  qty: number;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'dry-fruits', label: 'Dry Fruits' },
  { id: 'spices-tea', label: 'Spices & Tea' },
  { id: 'traditional', label: 'Traditional' },
];

const PRODUCTS: Product[] = [
  {
    id: 'kesar',
    name: 'Kashmiri Kesar',
    nameKashmiri: 'کٔشیری کیسر',
    price: 450,
    unit: 'per gram',
    description: 'Pure Grade A saffron hand-picked from Pampore fields. Rich aroma, deep crimson threads.',
    emoji: '🌸',
    image: '/images/products/kesar.jpg',
    category: 'dry-fruits',
    badge: 'Best Seller',
  },
  {
    id: 'almonds',
    name: 'Kashmiri Almonds',
    nameKashmiri: 'بادام',
    price: 180,
    unit: 'per 100g',
    description: 'Thin-skinned, sweet Kashmir valley almonds. Perfect for gifting and cooking.',
    emoji: '🫒',
    image: '/images/products/almonds.jpg',
    category: 'dry-fruits',
    badge: 'Farm Fresh',
  },
  {
    id: 'walnuts',
    name: 'Kashmiri Walnuts',
    nameKashmiri: 'اکھروٹ',
    price: 120,
    unit: 'per 100g',
    description: 'Papershell walnuts from the walnut groves of Shopian. Light, crisp, and full-flavoured.',
    emoji: '🌰',
    image: '/images/products/walnuts.jpg',
    category: 'dry-fruits',
    badge: 'Farm Fresh',
  },
  {
    id: 'kishmish',
    name: 'Kishmish (Raisins)',
    nameKashmiri: 'کشمش',
    price: 90,
    unit: 'per 100g',
    description: 'Sun-dried green raisins from Kashmir. Naturally sweet with no added sugar.',
    emoji: '🫐',
    image: '/images/products/raisins.jpg',
    category: 'dry-fruits',
  },
  {
    id: 'rajma',
    name: 'Kashmiri Rajma',
    nameKashmiri: 'راجما',
    price: 95,
    unit: 'per 250g',
    description: 'Small, speckled kidney beans from high-altitude fields. Creamy texture when cooked.',
    emoji: '🫘',
    image: '/images/products/rajma.jpg',
    category: 'dry-fruits',
    badge: 'Local Favourite',
  },
  {
    id: 'masala',
    name: 'Kashmiri Masala Mix',
    nameKashmiri: 'مصالحہ',
    price: 140,
    unit: 'per 50g',
    description: 'Authentic blend of Kashmiri chilli, fennel, ginger, and cardamom. Flame-dried, not sun-dried.',
    emoji: '🌶️',
    image: '/images/products/masala.jpg',
    category: 'spices-tea',
  },
  {
    id: 'chai',
    name: 'Kashmiri Chai',
    nameKashmiri: 'کٔشیری چاے',
    price: 110,
    unit: 'per 50g',
    description: 'Pink tea (noon chai) made from Kashmiri gunpowder green tea, baking soda, and salt.',
    emoji: '🍵',
    image: '/images/products/chai.jpg',
    category: 'spices-tea',
    badge: 'Signature',
  },
  {
    id: 'kahwa',
    name: 'Kahwa Green Tea',
    nameKashmiri: 'قہوہ',
    price: 160,
    unit: 'per 50g',
    description: 'Traditional Kashmiri kahwa with whole spices: cinnamon, cloves, cardamom, and rose petals.',
    emoji: '☕',
    image: '/images/products/kahwa.jpg',
    category: 'spices-tea',
    badge: 'Premium',
  },
  {
    id: 'athoor',
    name: 'Kashmiri Athoor',
    nameKashmiri: 'آتھور',
    price: 150,
    unit: 'per pair',
    description: 'Traditional Kashmiri golden tassel ornament, part of the bridal Dejhoor set. Handcrafted gold-thread tassels.',
    emoji: '✨',
    image: '/images/products/athoor.jpg',
    category: 'traditional',
    badge: 'Handcrafted',
  },
  {
    id: 'aanchar',
    name: 'Haak Monj Aanchar',
    nameKashmiri: 'ہاک مونج آچار',
    price: 450,
    unit: 'per kg',
    description: 'Authentic Kashmiri kohlrabi and haak greens pickle. Slow-spiced, tangy, and traditionally preserved.',
    emoji: '🫙',
    image: '/images/products/aanchar.jpg',
    category: 'traditional',
    badge: 'Home Style',
  },
  {
    id: 'isband',
    name: 'Kashmiri Isband',
    nameKashmiri: 'اِزبند',
    price: 165,
    unit: 'per 100g',
    description:
      'Wild rue (Peganum harmala) seeds from Kashmir — burnt at weddings and celebrations in a copper Isband-soz. Fragrant smoke traditionally believed to ward off the evil eye and bless new beginnings.',
    emoji: '🌿',
    image: '/images/products/isband.jpg',
    category: 'traditional',
    badge: 'Sacred Ritual',
  },
];

const KESAR_VIDEOS = [
  {
    id: 'v1',
    title: 'Saffron Harvesting in Pampore, Kashmir',
    searchUrl: 'https://www.youtube.com/results?search_query=Kashmiri+saffron+harvesting+Pampore',
    previewLabel: 'Pampore Saffron Fields',
    description: 'A short look at saffron threads being picked from the farm at dawn.',
  },
  {
    id: 'v2',
    title: 'How Kashmiri Kesar is Picked by Hand',
    searchUrl: 'https://www.youtube.com/results?search_query=Kashmiri+kesar+harvesting+short',
    previewLabel: 'Hand Harvesting',
    description: 'See the careful hand-picking process that keeps saffron strands intact.',
  },
  {
    id: 'v3',
    title: 'Kashmir Saffron Farm — Golden Fields',
    searchUrl: 'https://www.youtube.com/results?search_query=Kashmir+saffron+farm+video',
    previewLabel: 'Golden Fields',
    description: 'Quick showcase clips from the saffron farms in the Kashmir valley.',
  },
];

function VideoCard({ video }: { video: (typeof KESAR_VIDEOS)[number] }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video bg-gradient-to-br from-amber-950 via-orange-800 to-amber-500">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
          <span className="self-start rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-50">
            Kesar video
          </span>
          <div>
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl">
              ▶
            </div>
            <p className="text-sm font-semibold">{video.previewLabel}</p>
            <p className="mt-1 text-xs text-amber-50/90">{video.description}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-3">
        <p className="text-xs font-medium leading-snug text-slate-700">{video.title}</p>
        <a
          className="mt-3 inline-flex rounded-md bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700"
          href={video.searchUrl}
          target="_blank"
          rel="noreferrer"
        >
          Watch on YouTube
        </a>
      </div>
    </article>
  );
}

function ProductCard({
  product,
  qtyInCart,
  onAdd,
}: {
  product: Product;
  qtyInCart: number;
  onAdd: (product: Product) => void;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-amber-200 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-slate-50 to-white p-4">
        {product.badge ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            {product.badge}
          </span>
        ) : null}
        <img
          src={product.image}
          alt={product.name}
          className="mx-auto h-full max-h-[130px] w-full object-contain transition-transform duration-[1400ms] ease-in-out group-hover:scale-110"
        />
        {/* Full description — visible only on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-900/90 via-slate-900/80 to-transparent px-4 pb-4 pt-10 opacity-0 transition-all duration-500 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs leading-relaxed text-white">{product.description}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-0.5 text-xs text-amber-700/80">{product.nameKashmiri}</p>
        <div className="mt-4 flex items-end justify-between gap-2 border-t border-slate-100 pt-3">
          <div>
            <p className="text-lg font-bold text-slate-900">₹{product.price}</p>
            <p className="text-[10px] text-slate-400">{product.unit}</p>
          </div>
          {qtyInCart > 0 ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              {qtyInCart} in cart
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

function CartPanel({
  items,
  onRemove,
  onIncrease,
  onDecrease,
  onClear,
  onPlaceOrderClick,
  showCheckoutForm,
  shippingAddress,
  onShippingAddressChange,
  onBuy,
  isBuying,
  orderError,
  orderSuccess,
}: {
  items: CartItem[];
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onClear: () => void;
  onPlaceOrderClick: () => void;
  showCheckoutForm: boolean;
  shippingAddress: string;
  onShippingAddressChange: (value: string) => void;
  onBuy: () => void;
  isBuying: boolean;
  orderError: string | null;
  orderSuccess: string | null;
}) {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div id="shop-cart" className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
            <p className="text-xs text-slate-500">
              {totalQty === 0 ? 'No items yet' : `${totalQty} item${totalQty !== 1 ? 's' : ''} selected`}
            </p>
          </div>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-slate-400 hover:text-red-500"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🛒
          </div>
          <p className="text-sm font-medium text-slate-700">Cart is empty</p>
          <p className="mt-1 text-xs text-slate-400">Browse products and tap Add to start</p>
        </div>
      ) : (
        <>
          <ul className="max-h-[340px] divide-y divide-slate-100 overflow-y-auto px-3 py-1">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50 p-1">
                  <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">₹{item.price} · {item.unit}</p>
                  <p className="mt-0.5 text-sm font-semibold text-amber-700">₹{item.price * item.qty}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => onDecrease(item.id)}
                      className="px-2 py-1 text-sm text-slate-600 hover:text-amber-700"
                    >
                      −
                    </button>
                    <span className="min-w-[1.25rem] text-center text-xs font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => onIncrease(item.id)}
                      className="px-2 py-1 text-sm text-slate-600 hover:text-amber-700"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="text-[10px] text-slate-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-100 px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Subtotal</span>
              <span className="text-xl font-bold text-slate-900">₹{total}</span>
            </div>
            <p className="text-[11px] text-slate-400">Free shipping on orders above ₹999 · COD available</p>

            {!showCheckoutForm ? (
              <button
                type="button"
                onClick={onPlaceOrderClick}
                className="w-full rounded-xl bg-amber-600 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
              >
                Checkout · ₹{total}
              </button>
            ) : (
              <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                <label className="block text-xs font-semibold text-slate-700">Delivery address</label>
                <textarea
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                  rows={3}
                  placeholder="Full name, phone, address, pincode"
                  value={shippingAddress}
                  onChange={(e) => onShippingAddressChange(e.target.value)}
                />
                {orderError ? <p className="text-xs text-red-600">{orderError}</p> : null}
                {orderSuccess ? <p className="text-xs font-medium text-emerald-600">{orderSuccess}</p> : null}
                <button
                  type="button"
                  onClick={onBuy}
                  disabled={isBuying || !shippingAddress.trim()}
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isBuying ? 'Placing order…' : 'Confirm order'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function DashboardPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState<ProductCategory>('all');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const filteredProducts = useMemo(
    () => (category === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  );

  const cartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const cartQtyMap = useMemo(
    () => Object.fromEntries(cart.map((item) => [item.id, item.qty])),
    [cart],
  );

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function increaseQty(id: string) {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
    );
  }

  function decreaseQty(id: string) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0),
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  async function handleBuy() {
    if (!shippingAddress.trim() || cart.length === 0 || isBuying) {
      return;
    }

    setIsBuying(true);
    setOrderError(null);
    setOrderSuccess(null);

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    try {
      const result = await placeOrder({
        shippingAddress: shippingAddress.trim(),
        currency: 'INR',
        subtotal: totalAmount,
        totalAmount,
        items: cart.map((item) => ({
          productId: item.id,
          itemName: item.name,
          unitPrice: item.price,
          quantity: item.qty,
          lineTotal: item.price * item.qty,
        })),
      });

      setOrderSuccess(`Order placed successfully${result.orderId ? ` (Order #${result.orderId})` : ''}.`);
      setCart([]);
      setShowCheckoutForm(false);
      setShippingAddress('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      setOrderError(message);
    } finally {
      setIsBuying(false);
    }
  }

  function scrollToCart() {
    document.getElementById('shop-cart')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const cartProps = {
    items: cart,
    onRemove: removeFromCart,
    onIncrease: increaseQty,
    onDecrease: decreaseQty,
    onClear: () => {
      clearCart();
      setShowCheckoutForm(false);
      setShippingAddress('');
    },
    onPlaceOrderClick: () => {
      setShowCheckoutForm(true);
      setOrderError(null);
      setOrderSuccess(null);
    },
    showCheckoutForm,
    shippingAddress,
    onShippingAddressChange: setShippingAddress,
    onBuy: handleBuy,
    isBuying,
    orderError,
    orderSuccess,
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Store header */}
      <header className="mb-6 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-amber-800 via-amber-600 to-orange-500 px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-100/90">
                Direct from the Valley
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Koshurwaan</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-amber-50/90">
                Authentic Kashmiri saffron, dry fruits, spices, teas & traditional crafts — farm to doorstep.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-medium">
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">Farm sourced</span>
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">Free ship ₹999+</span>
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">COD available</span>
            </div>
          </div>
        </div>
      </header>

      {/* Shop layout: products + sticky cart */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <section className="min-w-0 space-y-5">
          {/* Category filters */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    category === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-amber-300 hover:text-amber-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-400">{filteredProducts.length} products</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                qtyInCart={cartQtyMap[product.id] ?? 0}
                onAdd={addToCart}
              />
            ))}
          </div>
        </section>

        {/* Desktop cart — sticky sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-6">
          <CartPanel {...cartProps} />
        </aside>
      </div>

      {/* Mobile cart — sticky bottom bar */}
      {cartQty > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">{cartQty} item{cartQty !== 1 ? 's' : ''} in cart</p>
              <p className="text-lg font-bold text-slate-900">₹{cartTotal}</p>
            </div>
            <button
              type="button"
              onClick={scrollToCart}
              className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white"
            >
              View cart
            </button>
          </div>
        </div>
      ) : null}

      {/* Mobile cart panel — below products */}
      <div className="mt-6 lg:hidden">
        <CartPanel {...cartProps} />
      </div>

      {/* Kesar videos */}
      <section className="mt-10 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">From the Kesar Fields</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Watch how Kashmiri saffron is hand-harvested at dawn in Pampore.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {KESAR_VIDEOS.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
