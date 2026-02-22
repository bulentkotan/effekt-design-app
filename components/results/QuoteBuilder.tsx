'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QuoteLineItem } from '@/types'
import {
  pricingCategories,
  calculateLineTotal,
  calculateVAT,
  formatAED,
  VAT_RATE,
  allPricingItems,
} from '@/lib/pricing'

interface QuoteBuilderProps {
  lineItems: QuoteLineItem[]
  onChange?: (items: QuoteLineItem[]) => void
}

const UNIT_LABELS: Record<string, string> = {
  sqm: 'sq m',
  lm: 'lin. m',
  nos: 'nos',
  ls: 'lump sum',
  set: 'set',
}

export default function QuoteBuilder({ lineItems, onChange }: QuoteBuilderProps) {
  const [items, setItems] = useState<QuoteLineItem[]>(lineItems)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [showAddPanel, setShowAddPanel] = useState(false)

  const updateItems = useCallback(
    (updater: (prev: QuoteLineItem[]) => QuoteLineItem[]) => {
      setItems(prev => {
        const next = updater(prev)
        onChange?.(next)
        return next
      })
    },
    [onChange]
  )

  const toggleIncluded = useCallback(
    (pricingId: string) => {
      updateItems(prev =>
        prev.map(item =>
          item.pricingId === pricingId
            ? { ...item, isIncluded: !item.isIncluded }
            : item
        )
      )
    },
    [updateItems]
  )

  const updateQuantity = useCallback(
    (pricingId: string, quantity: number) => {
      if (quantity < 0) return
      updateItems(prev =>
        prev.map(item =>
          item.pricingId === pricingId ? { ...item, quantity } : item
        )
      )
    },
    [updateItems]
  )

  const removeItem = useCallback(
    (pricingId: string) => {
      updateItems(prev => prev.filter(item => item.pricingId !== pricingId))
    },
    [updateItems]
  )

  const addItem = useCallback(
    (pricingItemId: string) => {
      const pricingItem = allPricingItems.find(p => p.id === pricingItemId)
      if (!pricingItem) return
      if (items.some(i => i.pricingId === pricingItemId)) return

      const newLine: QuoteLineItem = {
        pricingId: pricingItem.id,
        name: pricingItem.name,
        description: pricingItem.description,
        unit: pricingItem.unit,
        unitRate: pricingItem.unitRate,
        quantity: pricingItem.minQty || 1,
        isIncluded: true,
        isOptional: pricingItem.isOptional,
        category: pricingItem.category,
      }

      updateItems(prev => [...prev, newLine])
      setShowAddPanel(false)
    },
    [items, updateItems]
  )

  const grouped = useMemo(() => {
    const groups: Record<string, QuoteLineItem[]> = {}
    for (const item of items) {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    }
    return groups
  }, [items])

  const includedItems = useMemo(
    () => items.filter(i => i.isIncluded),
    [items]
  )

  const subtotal = useMemo(
    () =>
      includedItems.reduce(
        (sum, item) => sum + calculateLineTotal(item.unitRate, item.quantity),
        0
      ),
    [includedItems]
  )

  const vat = calculateVAT(subtotal)
  const grandTotal = subtotal + vat

  const availableToAdd = useMemo(
    () =>
      allPricingItems.filter(
        p => !items.some(i => i.pricingId === p.id)
      ),
    [items]
  )

  const categoryMeta = useMemo(() => {
    const map: Record<string, { name: string; icon: string }> = {}
    for (const cat of pricingCategories) {
      map[cat.id] = { name: cat.name, icon: cat.icon }
    }
    return map
  }, [])

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-bg-white">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-border bg-sage-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs tracking-brand-wide text-brand-green uppercase mb-1">
              Investment Breakdown
            </h3>
            <p className="text-xs text-text-muted">
              Adjust quantities or toggle items to customise your quote
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Estimated Total</p>
            <p className="text-xl font-serif text-text-dark">{formatAED(grandTotal)}</p>
          </div>
        </div>
      </div>

      {/* Line items by category */}
      <div className="divide-y divide-border">
        {Object.entries(grouped).map(([catId, catItems]) => {
          const meta = categoryMeta[catId] || { name: catId, icon: '📦' }
          const catSubtotal = catItems
            .filter(i => i.isIncluded)
            .reduce((s, i) => s + calculateLineTotal(i.unitRate, i.quantity), 0)
          const isExpanded = expandedCategory === catId

          return (
            <div key={catId}>
              {/* Category header */}
              <button
                type="button"
                onClick={() => setExpandedCategory(isExpanded ? null : catId)}
                className="w-full flex items-center justify-between px-5 sm:px-6 py-3.5 hover:bg-sage-100/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{meta.icon}</span>
                  <span className="text-sm font-medium text-text-dark">
                    {meta.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sage-200 text-text-muted">
                    {catItems.filter(i => i.isIncluded).length}/{catItems.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-medium font-medium">
                    {formatAED(catSubtotal)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-text-muted transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded line items */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-4 space-y-2">
                      {catItems.map(item => (
                        <LineItemRow
                          key={item.pricingId}
                          item={item}
                          onToggle={toggleIncluded}
                          onQuantityChange={updateQuantity}
                          onRemove={removeItem}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Add items */}
      {availableToAdd.length > 0 && (
        <div className="border-t border-border px-5 sm:px-6 py-3">
          <button
            type="button"
            onClick={() => setShowAddPanel(!showAddPanel)}
            className="flex items-center gap-2 text-sm text-brand-green hover:text-brand-green-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add more items to your design
          </button>

          <AnimatePresence>
            {showAddPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {availableToAdd.map(pItem => (
                    <button
                      key={pItem.id}
                      type="button"
                      onClick={() => addItem(pItem.id)}
                      className="flex items-start gap-2 p-2.5 rounded-lg border border-border hover:border-brand-green/30 hover:bg-sage-100/50 transition-colors text-left"
                    >
                      <svg
                        className="w-4 h-4 mt-0.5 text-brand-green shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-text-dark">{pItem.name}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {formatAED(pItem.unitRate)} / {UNIT_LABELS[pItem.unit]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Totals */}
      <div className="border-t border-border bg-sage-100 p-5 sm:p-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">
            Subtotal ({includedItems.length} items)
          </span>
          <span className="text-text-dark font-medium">{formatAED(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">VAT ({VAT_RATE * 100}%)</span>
          <span className="text-text-dark">{formatAED(vat)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border-dark">
          <span className="text-sm font-medium text-text-dark">Grand Total</span>
          <span className="text-lg font-serif text-brand-green font-medium">
            {formatAED(grandTotal)}
          </span>
        </div>
        <p className="text-[10px] text-text-muted pt-1">
          * Indicative pricing based on recent Dubai villa projects. Final quote subject to site survey.
        </p>
      </div>
    </div>
  )
}

function LineItemRow({
  item,
  onToggle,
  onQuantityChange,
  onRemove,
}: {
  item: QuoteLineItem
  onToggle: (id: string) => void
  onQuantityChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
}) {
  const lineTotal = item.isIncluded
    ? calculateLineTotal(item.unitRate, item.quantity)
    : 0

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-lg border transition-colors ${
        item.isIncluded
          ? 'border-border bg-bg-white'
          : 'border-border/50 bg-sage-100/30 opacity-60'
      }`}
    >
      {/* Toggle + name */}
      <div className="flex items-start gap-2.5 flex-1 min-w-0">
        <button
          type="button"
          onClick={() => onToggle(item.pricingId)}
          className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
            item.isIncluded
              ? 'bg-brand-green border-brand-green text-white'
              : 'border-text-muted/30 bg-bg-white'
          }`}
          aria-label={item.isIncluded ? 'Exclude item' : 'Include item'}
        >
          {item.isIncluded && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-dark truncate">{item.name}</p>
          <p className="text-[10px] text-text-muted truncate">{item.description}</p>
        </div>
      </div>

      {/* Quantity + rate + total */}
      <div className="flex items-center gap-3 ml-7 sm:ml-0">
        {item.unit !== 'ls' ? (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onQuantityChange(item.pricingId, item.quantity - 1)}
              disabled={item.quantity <= 0}
              className="w-6 h-6 rounded border border-border flex items-center justify-center text-text-muted hover:border-brand-green hover:text-brand-green transition-colors disabled:opacity-30"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={e => {
                const v = parseInt(e.target.value, 10)
                if (!isNaN(v) && v >= 0) onQuantityChange(item.pricingId, v)
              }}
              className="w-12 text-center text-xs font-medium text-text-dark bg-transparent border border-border rounded px-1 py-1 focus:outline-none focus:border-brand-green"
            />
            <button
              type="button"
              onClick={() => onQuantityChange(item.pricingId, item.quantity + 1)}
              className="w-6 h-6 rounded border border-border flex items-center justify-center text-text-muted hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <span className="text-[10px] text-text-muted w-10">{UNIT_LABELS[item.unit]}</span>
          </div>
        ) : (
          <span className="text-[10px] text-text-muted w-[120px] text-center">lump sum</span>
        )}

        <span className="text-xs text-text-muted w-16 text-right">
          @{formatAED(item.unitRate)}
        </span>

        <span className="text-xs font-medium text-text-dark w-20 text-right">
          {item.isIncluded ? formatAED(lineTotal) : '—'}
        </span>

        {item.isOptional && (
          <button
            type="button"
            onClick={() => onRemove(item.pricingId)}
            className="ml-1 text-text-muted/40 hover:text-red-400 transition-colors"
            aria-label="Remove item"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
