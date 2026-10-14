import React from 'react';
import { calculateItemAmount, formatCurrency } from '../utils/calculations.js';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';

export const InvoiceItemsForm = ({
  items = [],
  currency = 'INR',
  showItemDiscount,
  showItemTax,
  onChange,
  onToggleItemDiscount,
  onToggleItemTax,
}) => {
  const handleAddItem = (presetDescription = '') => {
    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      description: presetDescription,
      quantity: 1,
      unit: presetDescription ? 'Service' : 'Qty',
      rate: 0,
      discountType: 'percent',
      discountValue: 0,
      taxRate: 0,
      amount: 0,
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (id, updates) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...updates };
        const calc = calculateItemAmount(merged, showItemTax ? 'per_item' : 'single');
        return { ...merged, amount: calc.total };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDuplicateItem = (index) => {
    const source = items[index];
    const duplicated = {
      ...source,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    const updated = [...items];
    updated.splice(index + 1, 0, duplicated);
    onChange(updated);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) {
      onChange([
        {
          id: `item-${Date.now()}`,
          description: '',
          quantity: 1,
          unit: 'Qty',
          rate: 0,
          discountType: 'percent',
          discountValue: 0,
          taxRate: 0,
          amount: 0,
        },
      ]);
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_10px_-2px_rgba(28,25,23,0.03)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-800/70 font-medium text-sm">04</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Line Items & Services</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Deliverables, sessions & rates</span>
        </div>

        {/* Optional column toggles */}
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer text-stone-600 font-medium">
            <input
              type="checkbox"
              checked={showItemDiscount}
              onChange={onToggleItemDiscount}
              className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-3.5 h-3.5"
            />
            Item Discount
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-stone-600 font-medium">
            <input
              type="checkbox"
              checked={showItemTax}
              onChange={onToggleItemTax}
              className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-3.5 h-3.5"
            />
            Line Tax %
          </label>
        </div>
      </div>

      {/* Item rows */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const itemCalc = calculateItemAmount(item, showItemTax ? 'per_item' : 'single');

          return (
            <div
              key={item.id}
              className="p-4 bg-[#FAF9F7] hover:bg-[#F6F4F0] rounded-xl border border-stone-200/70 transition-all"
            >
              <div className="grid grid-cols-12 gap-3 items-start">
                {/* Description */}
                <div className="col-span-12 sm:col-span-5">
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">
                    Description <span className="text-amber-800">*</span>
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                    placeholder="e.g. Wedding Photography, Consulting, Web Design, etc."
                    className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
                  />
                </div>

                {/* Qty & Unit */}
                <div className="col-span-6 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-500 mb-1">Qty</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-center text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-500 mb-1">Unit</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => handleUpdateItem(item.id, { unit: e.target.value })}
                        placeholder="Hours"
                        className="w-full px-2 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-center text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Rate */}
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Rate</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={item.rate}
                    onChange={(e) => handleUpdateItem(item.id, { rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-right text-stone-900"
                  />
                </div>

                {/* Per-item Discount (if enabled) */}
                {showItemDiscount && (
                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-[11px] font-medium text-stone-500 mb-1">
                      Discount ({item.discountType === 'percent' ? '%' : 'Fixed'})
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        min="0"
                        value={item.discountValue}
                        onChange={(e) => handleUpdateItem(item.id, { discountValue: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2 py-1.5 text-xs bg-white border border-stone-200 rounded-l-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-right text-stone-900"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateItem(item.id, {
                            discountType: item.discountType === 'percent' ? 'fixed' : 'percent',
                          })
                        }
                        className="px-2 py-1 text-[10px] font-semibold bg-stone-200/70 border-y border-r border-stone-200 rounded-r-lg text-stone-700 hover:bg-stone-300/80 transition-colors"
                        title="Toggle percentage or fixed discount"
                      >
                        {item.discountType === 'percent' ? '%' : currency}
                      </button>
                    </div>
                  </div>
                )}

                {/* Per-item Tax (if enabled) */}
                {showItemTax && (
                  <div className="col-span-6 sm:col-span-1">
                    <label className="block text-[11px] font-medium text-stone-500 mb-1">Tax %</label>
                    <input
                      type="number"
                      min="0"
                      value={item.taxRate}
                      onChange={(e) => handleUpdateItem(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden font-mono-num text-center text-stone-900"
                    />
                  </div>
                )}

                {/* Amount & Actions */}
                <div className="col-span-12 sm:col-span-3 sm:ml-auto flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-4">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block sm:hidden">Total</span>
                    <span className="text-xs sm:text-sm font-semibold font-mono-num text-stone-900">
                      {formatCurrency(itemCalc.total, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded-md hover:bg-stone-200/50"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 rounded-md hover:bg-stone-200/50"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateItem(index)}
                      className="p-1 text-stone-400 hover:text-stone-800 rounded-md hover:bg-stone-200/50"
                      title="Duplicate item"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50/60"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Actions */}
      <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleAddItem()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-2xs transition-all active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Line Item</span>
        </button>

        {/* Quick add common items */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 overflow-x-auto py-1">
          <span className="text-[11px] text-stone-400 hidden md:inline">Quick Add:</span>
          <button
            type="button"
            onClick={() => handleAddItem('Creative Photography Session')}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-700 rounded-lg text-[11px] transition-colors whitespace-nowrap border border-stone-200/50"
          >
            + Photography Session
          </button>
          <button
            type="button"
            onClick={() => handleAddItem('Web Development & Architecture')}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-700 rounded-lg text-[11px] transition-colors whitespace-nowrap border border-stone-200/50"
          >
            + Web Development
          </button>
          <button
            type="button"
            onClick={() => handleAddItem('Retainer Consulting')}
            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-700 rounded-lg text-[11px] transition-colors whitespace-nowrap border border-stone-200/50"
          >
            + Consulting
          </button>
        </div>
      </div>
    </div>
  );
};
