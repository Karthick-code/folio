import React from 'react';
import { MinimalTemplate } from './MinimalTemplate.jsx';
import { ModernTemplate } from './ModernTemplate.jsx';
import { ProfessionalTemplate } from './ProfessionalTemplate.jsx';
import { ClassicTemplate } from './ClassicTemplate.jsx';
import { ElegantTemplate } from './ElegantTemplate.jsx';

export const TemplateRenderer = ({ data, breakdown }) => {
  const template = data?.template || {};

  // Select appropriate font class
  const fontClass =
    template.fontStyle === 'serif'
      ? 'font-serif-display'
      : template.fontStyle === 'mono'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div className={`w-full bg-white select-text ${fontClass}`}>
      {template.templateId === 'minimal' && <MinimalTemplate data={data} breakdown={breakdown} />}
      {template.templateId === 'modern' && <ModernTemplate data={data} breakdown={breakdown} />}
      {template.templateId === 'professional' && <ProfessionalTemplate data={data} breakdown={breakdown} />}
      {template.templateId === 'classic' && <ClassicTemplate data={data} breakdown={breakdown} />}
      {template.templateId === 'elegant' && <ElegantTemplate data={data} breakdown={breakdown} />}
    </div>
  );
};
