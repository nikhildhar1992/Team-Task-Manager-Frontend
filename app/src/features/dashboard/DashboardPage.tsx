import { useState } from 'react';
import { placeOrder } from './api';

interface Product {
  id: string;
  name: string;
  nameKashmiri: string;
  price: number;
  unit: string;
  description: string;
  emoji: string;
  badge?: string;
}

interface CartItem extends Product {
  qty: number;
}

const PRODUCTS: Product[] = [
  {
    id: 'kesar',
    name: 'Kashmiri Kesar',
    nameKashmiri: 'کٔشیری کیسر',
    price: 450,
    unit: 'per gram',
    description: 'Pure Grade A saffron hand-picked from Pampore fields. Rich aroma, deep crimson threads.',
    emoji: '🌸',
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
  },
  {
    id: 'walnuts',
    name: 'Kashmiri Walnuts',
    nameKashmiri: 'اکھروٹ',
    price: 120,
    unit: 'per 100g',
    description: 'Papershell walnuts from the walnut groves of Shopian. Light, crisp, and full-flavoured.',
    emoji: '🌰',
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
  },
  {
    id: 'rajma',
    name: 'Kashmiri Rajma',
    nameKashmiri: 'راجما',
    price: 95,
    unit: 'per 250g',
    description: 'Small, speckled kidney beans from high-altitude fields. Creamy texture when cooked.',
    emoji: '🫘',
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
  },
  {
    id: 'chai',
    name: 'Kashmiri Chai',
    nameKashmiri: 'کٔشیری چاے',
    price: 110,
    unit: 'per 50g',
    description: 'Pink tea (noon chai) made from Kashmiri gunpowder green tea, baking soda, and salt.',
    emoji: '🍵',
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
    badge: 'Premium',
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

function VideoCard({
  video,
}: {
  video: (typeof KESAR_VIDEOS)[number];
}) {
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

function Badge({ text }: { text: string }) {
  return (
    <span className="absolute -top-2 -right-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white shadow">
      {text}
    </span>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {product.badge ? <Badge text={product.badge} /> : null}
      <div className="text-4xl mb-3">{product.emoji}</div>
      <h3 className="font-semibold text-slate-900 text-sm">{product.name}</h3>
      <p className="text-xs text-slate-400 mb-1">{product.nameKashmiri}</p>
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{product.description}</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-amber-700">₹{product.price}</span>
          <span className="text-xs text-slate-400 ml-1">{product.unit}</span>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

function Cart({
  items,
  onRemove,
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

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="text-2xl mb-2">🛒</p>
        <p className="text-sm text-slate-500">Your cart is empty</p>
        <p className="text-xs text-slate-400 mt-1">Add some Kashmiri treasures above</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-amber-900 text-sm">🛒 Your Cart ({items.length} items)</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-red-500 hover:underline"
        >
          Clear all
        </button>
      </div>

      <ul className="space-y-2 mb-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <span>{item.emoji}</span>
              <div>
                <p className="text-xs font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-400">
                  ₹{item.price} × {item.qty}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-700">₹{item.price * item.qty}</span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="text-xs text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-amber-200 pt-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-amber-900">Total</span>
        <span className="text-lg font-bold text-amber-700">₹{total}</span>
      </div>

      <button
        type="button"
        onClick={onPlaceOrderClick}
        className="mt-3 w-full rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors"
      >
        Place Order
      </button>

      {showCheckoutForm ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-white p-3">
          <label className="block text-xs font-medium text-slate-700">Delivery address</label>
          <textarea
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
            rows={3}
            placeholder="Enter full shipping address"
            value={shippingAddress}
            onChange={(event) => onShippingAddressChange(event.target.value)}
          />
          {orderError ? <p className="mt-2 text-xs text-red-700">{orderError}</p> : null}
          {orderSuccess ? <p className="mt-2 text-xs text-emerald-700">{orderSuccess}</p> : null}
          <button
            type="button"
            onClick={onBuy}
            className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            disabled={isBuying || !shippingAddress.trim()}
          >
            {isBuying ? 'Placing order...' : 'Buy'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function DashboardPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

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

  return (
    <div className="space-y-10">
      {/* Hero */}
      <header className="rounded-2xl bg-gradient-to-r from-amber-700 to-amber-500 px-8 py-10 text-white shadow-md">
        <p className="text-xs uppercase tracking-widest text-amber-200 mb-1">Direct from the Valley</p>
        <h1 className="text-4xl font-bold tracking-tight">Koshurwaan</h1>
        <p className="mt-2 text-amber-100 text-sm max-w-md">
          Authentic Kashmiri produce — saffron, dry fruits, spices, and teas — sourced straight from local farmers.
        </p>
      </header>

      {/* Products + Cart */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Our Products</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Cart</h2>
          <Cart
            items={cart}
            onRemove={removeFromCart}
            onClear={() => {
              clearCart();
              setShowCheckoutForm(false);
              setShippingAddress('');
            }}
            onPlaceOrderClick={() => {
              setShowCheckoutForm(true);
              setOrderError(null);
              setOrderSuccess(null);
            }}
            showCheckoutForm={showCheckoutForm}
            shippingAddress={shippingAddress}
            onShippingAddressChange={setShippingAddress}
            onBuy={handleBuy}
            isBuying={isBuying}
            orderError={orderError}
            orderSuccess={orderSuccess}
          />
        </div>
      </div>

      {/* Kesar video section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">🌸 From the Kesar Fields</h2>
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

      {/* Footer note */}
      <footer className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-center">
        <p className="text-xs text-slate-500">
          🏔️ All products sourced directly from Kashmiri farmers · Free shipping on orders above ₹999 · COD available
        </p>
      </footer>
    </div>
  );
}
