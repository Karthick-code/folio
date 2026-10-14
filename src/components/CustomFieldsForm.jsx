import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export const CustomFieldsForm = ({ customFields = [], onChange }) => {
  const handleAddField = (label = '', value = '') => {
    const newField = {
      id: `cf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label,
      value,
    };
    onChange([...customFields, newField]);
  };

  const handleUpdate = (id, updates) => {
    onChange(customFields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleRemove = (id) => {
    onChange(customFields.filter((f) => f.id !== id));
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_10px_-2px_rgba(28,25,23,0.03)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-800/70 font-medium text-sm">06</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Custom Attributes</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Event dates, venues & milestone codes</span>
        </div>

        <button
          type="button"
          onClick={() => handleAddField()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100/90 hover:bg-stone-200/80 rounded-xl transition-colors border border-stone-200/70"
        >
          <Plus className="w-3.5 h-3.5 text-stone-500" />
          <span>Add Attribute</span>
        </button>
      </div>

      {customFields.length === 0 ? (
        <div className="text-center py-5 bg-stone-50/60 rounded-xl border border-dashed border-stone-200/80">
          <p className="text-xs text-stone-500 mb-2.5">No custom specifications attached.</p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[11px] text-stone-400">Quick add:</span>
            <button
              type="button"
              onClick={() => handleAddField('Event Date', '')}
              className="text-xs px-2.5 py-1 bg-white border border-stone-200/80 rounded-lg text-stone-700 hover:border-stone-400 transition-colors shadow-2xs"
            >
              + Event Date
            </button>
            <button
              type="button"
              onClick={() => handleAddField('Venue', '')}
              className="text-xs px-2.5 py-1 bg-white border border-stone-200/80 rounded-lg text-stone-700 hover:border-stone-400 transition-colors shadow-2xs"
            >
              + Venue
            </button>
            <button
              type="button"
              onClick={() => handleAddField('Project Name', '')}
              className="text-xs px-2.5 py-1 bg-white border border-stone-200/80 rounded-lg text-stone-700 hover:border-stone-400 transition-colors shadow-2xs"
            >
              + Project Name
            </button>
            <button
              type="button"
              onClick={() => handleAddField('Deliverables ETA', '')}
              className="text-xs px-2.5 py-1 bg-white border border-stone-200/80 rounded-lg text-stone-700 hover:border-stone-400 transition-colors shadow-2xs"
            >
              + Deliverables ETA
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {customFields.map((field) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type="text"
                value={field.label}
                onChange={(e) => handleUpdate(field.id, { label: e.target.value })}
                placeholder="Attribute Label (e.g. Event Date)"
                className="w-1/3 px-3 py-1.5 text-xs sm:text-sm bg-[#FBFBF9] border border-stone-200 rounded-lg focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => handleUpdate(field.id, { value: e.target.value })}
                placeholder="Value (e.g. 18 November 2026)"
                className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-[#FBFBF9] border border-stone-200 rounded-lg focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
              />
              <button
                type="button"
                onClick={() => handleRemove(field.id)}
                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/60 transition-colors"
                title="Remove field"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
