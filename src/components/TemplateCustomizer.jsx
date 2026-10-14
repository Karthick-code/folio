import React from 'react';

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', desc: 'Airy, clean white, understated hairlines', tag: 'Universal' },
  { id: 'modern', name: 'Modern', desc: 'Contemporary grid, subtle visual accents', tag: 'Studio' },
  { id: 'professional', name: 'Professional', desc: 'Structured corporate borders & legal breakdown', tag: 'Corporate' },
  { id: 'classic', name: 'Classic', desc: 'Traditional formal invoice with double rules', tag: 'Traditional' },
  { id: 'elegant', name: 'Elegant', desc: 'Luxurious serif styling for photography & creatives', tag: 'Creative' },
];

const ACCENT_COLORS = [
  { label: 'Obsidian Slate', value: '#1C1917' },
  { label: 'Warm Amber Gold', value: '#B45309' },
  { label: 'Deep Forest Green', value: '#14532D' },
  { label: 'Vintage Navy', value: '#1E293B' },
  { label: 'Bordeaux Wine', value: '#881337' },
  { label: 'Burnt Terracotta', value: '#C2410C' },
  { label: 'Warm Bronze', value: '#78350F' },
  { label: 'Classic Cobalt', value: '#1D4ED8' },
];

export const TemplateCustomizer = ({ template, onChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_10px_-2px_rgba(28,25,23,0.03)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-800/70 font-medium text-sm">09</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Document Layout & Aesthetics</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Curated styles, palette & typography</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Template Selector Grid */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-2.5">
            Select Presentation Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {TEMPLATES.map((tmpl) => {
              const isSelected = template.templateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => onChange({ ...template, templateId: tmpl.id })}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'border-stone-900 bg-stone-50/90 ring-1 ring-stone-900 shadow-2xs'
                      : 'border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-stone-900">{tmpl.name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-900 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{tmpl.desc}</p>
                  <span className="inline-block mt-2 text-[9px] font-medium text-stone-400 uppercase tracking-widest">
                    {tmpl.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette & Typography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          {/* Accent Color */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2.5">
              Accent Tonal Highlight
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_COLORS.map((col) => (
                <button
                  key={col.value}
                  type="button"
                  onClick={() => onChange({ ...template, accentColor: col.value })}
                  style={{ backgroundColor: col.value }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    template.accentColor === col.value
                      ? 'ring-2 ring-offset-2 ring-stone-900 scale-110 shadow-xs'
                      : 'hover:scale-105 opacity-85 hover:opacity-100'
                  }`}
                  title={col.label}
                />
              ))}
              <div className="relative flex items-center ml-1">
                <input
                  type="color"
                  value={template.accentColor}
                  onChange={(e) => onChange({ ...template, accentColor: e.target.value })}
                  className="w-7 h-7 rounded-lg border border-stone-300 cursor-pointer p-0 bg-transparent"
                  title="Custom hex color code"
                />
              </div>
            </div>
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-2.5">
              Typography Family
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onChange({ ...template, fontStyle: 'sans' })}
                className={`py-1.5 px-2 text-xs rounded-xl border text-center transition-all font-sans ${
                  template.fontStyle === 'sans'
                    ? 'border-stone-900 bg-stone-900 text-stone-50 font-medium shadow-2xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Sans Serif
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...template, fontStyle: 'serif' })}
                className={`py-1.5 px-2 text-xs rounded-xl border text-center transition-all font-serif-display ${
                  template.fontStyle === 'serif'
                    ? 'border-stone-900 bg-stone-900 text-stone-50 font-medium shadow-2xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Editorial Serif
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...template, fontStyle: 'mono' })}
                className={`py-1.5 px-2 text-xs rounded-xl border text-center transition-all font-mono ${
                  template.fontStyle === 'mono'
                    ? 'border-stone-900 bg-stone-900 text-stone-50 font-medium shadow-2xs'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Monospace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
