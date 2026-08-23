'use client'

/**
 * src/app/admin/AdminDashboard.tsx
 *
 * Client-side admin dashboard with:
 * - Inventory overview (all products + stock levels)
 * - Instagram/manual order entry form
 * - Stock adjustment panel
 * - Recent inventory log
 * - Recent orders by channel
 */

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Package, TrendingDown, AlertTriangle, CheckCircle, Instagram, Globe, Plus, Minus, RefreshCw, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { createInstagramOrder } from './actions'
import { adjustStockAction } from './actions'
import type { StockInfo } from '@/lib/inventory/types'

// ── Types ──────────────────────────────────────────────────────────────────────

interface Props {
  productsWithStock: StockInfo[]
  recentLogs: any[]
  recentOrders: any[]
}

// ── Stock Status Badge ─────────────────────────────────────────────────────────

function StockBadge({ status }: { status: string }) {
  const cfg = {
    IN_STOCK: { label: 'In Stock', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
    LOW_STOCK: { label: 'Low Stock', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    SOLD_OUT: { label: 'Sold Out', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  }[status] || { label: status, cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }

  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

// ── Channel Badge ──────────────────────────────────────────────────────────────

function ChannelBadge({ channel }: { channel: string }) {
  const cfg = {
    WEBSITE: { label: 'Website', cls: 'bg-blue-500/20 text-blue-400', icon: <Globe className="w-3 h-3" /> },
    INSTAGRAM: { label: 'Instagram', cls: 'bg-pink-500/20 text-pink-400', icon: <Instagram className="w-3 h-3" /> },
  }[channel] || { label: channel, cls: 'bg-gray-500/20 text-gray-400', icon: null }

  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.cls}`}>
      {cfg.icon}{cfg.label}
    </span>
  )
}

// ── Inventory Panel ────────────────────────────────────────────────────────────

function InventoryPanel({ productsWithStock, onAdjust }: {
  productsWithStock: StockInfo[]
  onAdjust: (productId: string, variantKey: string, productName: string, size: string, currentStock: number) => void
}) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = productsWithStock.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  )

  const totalVariants = productsWithStock.flatMap(p => p.variants).length
  const soldOut = productsWithStock.flatMap(p => p.variants).filter(v => v.status === 'SOLD_OUT').length
  const lowStock = productsWithStock.flatMap(p => p.variants).filter(v => v.status === 'LOW_STOCK').length

  return (
    <section>
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
            <Package className="w-3.5 h-3.5" />Products
          </div>
          <div className="text-2xl font-bold text-white">{productsWithStock.length}</div>
          <div className="text-xs text-gray-500">{totalVariants} total variants</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400 text-xs mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />Low Stock
          </div>
          <div className="text-2xl font-bold text-amber-400">{lowStock}</div>
          <div className="text-xs text-gray-500">variants near zero</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-xs mb-1">
            <TrendingDown className="w-3.5 h-3.5" />Sold Out
          </div>
          <div className="text-2xl font-bold text-red-400">{soldOut}</div>
          <div className="text-xs text-gray-500">variants unavailable</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Product list */}
      <div className="space-y-2">
        {filtered.map(product => {
          const isExpanded = expanded === product.productId
          const hasIssues = product.variants.some(v => v.status !== 'IN_STOCK')

          return (
            <div key={product.productId} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <button
                onClick={() => setExpanded(isExpanded ? null : product.productId)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white text-sm">{product.productName}</span>
                  {hasIssues && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{product.variants.length} sizes</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-700 divide-y divide-gray-700/50">
                  {product.variants.map(variant => (
                    <div key={variant.key} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-700/20">
                      <div className="flex items-center gap-3">
                        {variant.colorHex && (
                          <span
                            className="w-3 h-3 rounded-full border border-gray-600 flex-shrink-0"
                            style={{ backgroundColor: variant.colorHex }}
                          />
                        )}
                        <div>
                          <span className="text-sm text-gray-200 font-medium">{variant.size}</span>
                          <span className="text-xs text-gray-500 ml-2">{variant.color}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-gray-200 min-w-[2rem] text-right">
                          {variant.stock}
                        </span>
                        <StockBadge status={variant.status} />
                        <button
                          onClick={() => onAdjust(product.productId, variant.key, product.productName, variant.size, variant.stock)}
                          className="p-1.5 rounded-lg bg-gray-700 hover:bg-amber-500/20 hover:text-amber-400 text-gray-400 transition-colors"
                          title="Adjust stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Stock Adjustment Modal ─────────────────────────────────────────────────────

function StockAdjustModal({
  target,
  onClose,
  onSave,
}: {
  target: { productId: string; variantKey: string; productName: string; size: string; currentStock: number }
  onClose: () => void
  onSave: (newStock: number, reason: string) => Promise<void>
}) {
  const [newStock, setNewStock] = useState(target.currentStock)
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    if (!reason.trim()) {
      setError('Please enter a reason for the adjustment.')
      return
    }
    setError(null)
    startTransition(async () => {
      await onSave(newStock, reason)
    })
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" 
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div 
        className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-sm" 
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-adjust-title"
      >
        <h3 id="stock-adjust-title" className="font-bold text-white text-lg mb-1">Adjust Stock</h3>
        <p className="text-gray-400 text-sm mb-4">{target.productName} — {target.size}</p>

        <div className="mb-4">
          <label htmlFor="adjust-new-stock" className="block text-xs text-gray-400 uppercase tracking-wider mb-2">New Stock Quantity</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setNewStock(Math.max(0, newStock - 1))} className="w-9 h-9 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
              <Minus className="w-4 h-4" />
            </button>
            <input
              id="adjust-new-stock"
              type="number"
              min="0"
              value={newStock}
              onChange={e => setNewStock(Math.max(0, parseInt(e.target.value) || 0))}
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-center font-mono font-bold text-white text-xl focus:outline-none focus:border-amber-500"
            />
            <button type="button" onClick={() => setNewStock(newStock + 1)} className="w-9 h-9 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Change: {newStock > target.currentStock ? '+' : ''}{newStock - target.currentStock} units
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="adjust-reason" className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Reason *</label>
          <input
            id="adjust-reason"
            type="text"
            placeholder="e.g. Received new shipment, Manual count correction"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-gray-200 text-sm transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Instagram Order Form ───────────────────────────────────────────────────────

function InstagramOrderForm({ productsWithStock }: { productsWithStock: StockInfo[] }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; orderId?: string; error?: string } | null>(null)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedVariantKey, setSelectedVariantKey] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [customerName, setCustomerName] = useState('')
  const [customerContact, setCustomerContact] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'BANK' | 'OTHER'>('COD')
  const [notes, setNotes] = useState('')

  const selectedProduct = productsWithStock.find(p => p.productId === selectedProductId)
  const availableVariants = selectedProduct?.variants.filter(v => v.available) || []
  const selectedVariant = selectedProduct?.variants.find(v => v.key === selectedVariantKey)

  // Get unit price — we need this from the product data
  // Since StockInfo doesn't include price, we'll need to handle this
  // For now use a notes field for the admin to record price
  const [unitPrice, setUnitPrice] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId || !selectedVariantKey || !customerName.trim()) return

    setResult(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set('productId', selectedProductId)
      formData.set('variantKey', selectedVariantKey)
      formData.set('productName', selectedProduct?.productName || '')
      formData.set('size', selectedVariant?.size || '')
      formData.set('color', selectedVariant?.color || '')
      formData.set('quantity', quantity.toString())
      formData.set('unitPrice', unitPrice.toString())
      formData.set('customerName', customerName)
      formData.set('customerContact', customerContact)
      formData.set('paymentMethod', paymentMethod)
      formData.set('notes', notes)

      const res = await createInstagramOrder(formData)
      setResult(res)

      if (res.success) {
        // Reset form
        setSelectedProductId('')
        setSelectedVariantKey('')
        setQuantity(1)
        setCustomerName('')
        setCustomerContact('')
        setNotes('')
        setUnitPrice(0)
      }
    })
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Instagram className="w-5 h-5 text-pink-400" />
        <h2 className="font-bold text-white text-lg">Create Instagram DM Order</h2>
      </div>

      {result && (
        <div className={`mb-4 p-4 rounded-xl border ${result.success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {result.success ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="font-bold">Order confirmed: {result.orderId}</span>
            </div>
          ) : (
            <div>
              <span className="font-bold">Failed:</span> {result.error}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="admin-customer-name" className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Customer Name *</label>
            <input
              id="admin-customer-name"
              required
              type="text"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              placeholder="Rahul Sharma"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50"
            />
          </div>
          <div>
            <label htmlFor="admin-customer-contact" className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Phone / Instagram</label>
            <input
              id="admin-customer-contact"
              type="text"
              value={customerContact}
              onChange={e => setCustomerContact(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50"
            />
          </div>
        </div>

        {/* Product Selection */}
        <div>
          <label htmlFor="admin-select-product" className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Product *</label>
          <select
            id="admin-select-product"
            required
            value={selectedProductId}
            onChange={e => {
              setSelectedProductId(e.target.value)
              setSelectedVariantKey('')
            }}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-pink-500/50"
          >
            <option value="">Select product...</option>
            {productsWithStock.map(p => (
              <option key={p.productId} value={p.productId}>{p.productName}</option>
            ))}
          </select>
        </div>

        {/* Variant / Size Selection */}
        {selectedProduct && (
          <div>
            <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Size *</span>
            <div className="grid grid-cols-4 gap-2">
              {selectedProduct.variants.map(variant => (
                <button
                  key={variant.key}
                  type="button"
                  disabled={!variant.available}
                  onClick={() => setSelectedVariantKey(variant.key)}
                  className={`py-2.5 rounded-lg border text-sm font-bold transition-all ${
                    selectedVariantKey === variant.key
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : !variant.available
                      ? 'bg-transparent border-gray-700 text-gray-600 cursor-not-allowed line-through'
                      : 'bg-transparent border-gray-600 text-gray-300 hover:border-pink-500/50'
                  }`}
                >
                  <div>{variant.size}</div>
                  <div className={`text-[10px] font-normal ${variant.status === 'LOW_STOCK' ? 'text-amber-400' : 'text-gray-500'}`}>
                    {variant.stock} left
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="admin-order-quantity" className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Quantity *</label>
            <input
              id="admin-order-quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-pink-500/50"
            />
          </div>
          <div>
            <label htmlFor="admin-unit-price" className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Unit Price (₹) *</label>
            <input
              id="admin-unit-price"
              required
              type="number"
              min="0"
              value={unitPrice}
              onChange={e => setUnitPrice(parseInt(e.target.value) || 0)}
              placeholder="2999"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Payment Method</span>
          <div className="grid grid-cols-4 gap-2">
            {(['COD', 'UPI', 'BANK', 'OTHER'] as const).map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-2 rounded-lg border text-xs font-bold transition-all ${
                  paymentMethod === method
                    ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="admin-order-notes" className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Notes (optional)</label>
          <textarea
            id="admin-order-notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Instagram handle, special instructions, etc."
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !selectedProductId || !selectedVariantKey || !customerName.trim() || !unitPrice}
          className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Confirming Order...</>
          ) : (
            <><Instagram className="w-4 h-4" />Confirm Instagram Order</>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          This will immediately decrement inventory and create a confirmed order.
        </p>
      </form>
    </section>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export function AdminDashboard({ productsWithStock, recentLogs, recentOrders }: Props) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'instagram' | 'orders' | 'logs'>('inventory')
  const [adjustTarget, setAdjustTarget] = useState<{
    productId: string; variantKey: string; productName: string; size: string; currentStock: number
  } | null>(null)
  const [adjustResult, setAdjustResult] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const tabs = [
    { key: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" /> },
    { key: 'instagram', label: 'Instagram Order', icon: <Instagram className="w-4 h-4" /> },
    { key: 'orders', label: 'Orders', icon: <Globe className="w-4 h-4" /> },
    { key: 'logs', label: 'Audit Log', icon: <RefreshCw className="w-4 h-4" /> },
  ] as const

  const handleAdjustSave = async (newStock: number, reason: string) => {
    if (!adjustTarget) return
    startTransition(async () => {
      const formData = new FormData()
      formData.set('productId', adjustTarget.productId)
      formData.set('variantKey', adjustTarget.variantKey)
      formData.set('newStock', newStock.toString())
      formData.set('reason', reason)

      const res = await adjustStockAction(formData)
      setAdjustResult(res.success ? `Stock updated to ${newStock}` : res.error || 'Failed')
      setAdjustTarget(null)

      // Auto-clear result
      setTimeout(() => setAdjustResult(null), 3000)
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-white text-xl">Awaraa&apos;s Culture — Admin</h1>
          <p className="text-xs text-gray-500 mt-0.5">Inventory & Order Management</p>
        </div>
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-200 transition-colors">← Back to Store</Link>
      </header>

      {/* Toast notification */}
      {adjustResult && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-200 shadow-xl">
          {adjustResult}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-800 px-6">
        <div className="flex gap-1 -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'inventory' && (
          <InventoryPanel
            productsWithStock={productsWithStock}
            onAdjust={(productId, variantKey, productName, size, currentStock) =>
              setAdjustTarget({ productId, variantKey, productName, size, currentStock })
            }
          />
        )}

        {activeTab === 'instagram' && (
          <InstagramOrderForm productsWithStock={productsWithStock} />
        )}

        {activeTab === 'orders' && (
          <section>
            <h2 className="font-bold text-white text-lg mb-4">Recent Orders</h2>
            <div className="space-y-2">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-sm">No orders yet.</p>
              ) : recentOrders.map((order: any) => (
                <div key={order._id} className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white font-mono text-sm">{order.orderId}</span>
                        <ChannelBadge channel={order.channel} />
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          order.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'FULFILLED' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>{order.status}</span>
                      </div>
                      <p className="text-sm text-gray-300">{order.customer?.name}</p>
                      <p className="text-xs text-gray-500">{order.customer?.contact}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(order.items || []).map((item: any, i: number) => (
                          <span key={i} className="text-[11px] bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">
                            {item.productName} · {item.size} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-amber-400 font-bold">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.paymentMethod}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'logs' && (
          <section>
            <h2 className="font-bold text-white text-lg mb-4">Inventory Audit Log</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700 text-left">
                    <th className="pb-2 pr-4 text-xs text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="pb-2 pr-4 text-xs text-gray-500 uppercase tracking-wider">Operation</th>
                    <th className="pb-2 pr-4 text-xs text-gray-500 uppercase tracking-wider">Channel</th>
                    <th className="pb-2 pr-4 text-xs text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="pb-2 pr-4 text-xs text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="pb-2 pr-4 text-xs text-gray-500 uppercase tracking-wider font-mono">Δ Qty</th>
                    <th className="pb-2 pr-4 text-xs text-gray-500 uppercase tracking-wider font-mono">Before→After</th>
                    <th className="pb-2 text-xs text-gray-500 uppercase tracking-wider">Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentLogs.length === 0 ? (
                    <tr><td colSpan={8} className="py-8 text-center text-gray-500">No inventory changes recorded yet.</td></tr>
                  ) : recentLogs.map((log: any) => (
                    <tr key={log.logId} className="hover:bg-gray-800/50">
                      <td className="py-2 pr-4 text-xs text-gray-500 whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                      </td>
                      <td className="py-2 pr-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          log.operationType === 'SALE' ? 'bg-red-500/20 text-red-400' :
                          log.operationType === 'RESTOCK' ? 'bg-green-500/20 text-green-400' :
                          log.operationType === 'CANCELLATION' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>{log.operationType}</span>
                      </td>
                      <td className="py-2 pr-4"><ChannelBadge channel={log.channel || 'SYSTEM'} /></td>
                      <td className="py-2 pr-4 text-gray-300 text-xs">{log.productName || log.productId}</td>
                      <td className="py-2 pr-4 text-gray-300 text-xs">{log.size || '—'}</td>
                      <td className="py-2 pr-4 font-mono text-sm font-bold">
                        <span className={log.quantityChange > 0 ? 'text-green-400' : 'text-red-400'}>
                          {log.quantityChange > 0 ? '+' : ''}{log.quantityChange}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-xs text-gray-400 font-mono">
                        {log.stockBefore !== null && log.stockBefore !== undefined ? log.stockBefore : '?'}
                        {' → '}
                        {log.stockAfter !== null && log.stockAfter !== undefined ? log.stockAfter : '?'}
                      </td>
                      <td className="py-2 text-xs text-gray-500 font-mono">{log.orderId || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {/* Stock Adjustment Modal */}
      {adjustTarget && (
        <StockAdjustModal
          target={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onSave={handleAdjustSave}
        />
      )}
    </div>
  )
}
