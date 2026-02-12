'use client';

import { useState } from 'react';

interface CustomField {
  id: string;
  caption: string;
  type: string;
  required: boolean;
  placeholder?: string | null;
  helpText?: string | null;
  options?: string | null;
}

interface DynamicFormFieldProps {
  field: CustomField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export default function DynamicFormField({ field, value, onChange, error }: DynamicFormFieldProps) {
  const fieldId = `field-${field.id}`;
  const fieldName = `customField_${field.id}`;

  const renderField = () => {
    switch (field.type) {
      case 'TEXT_FIELD':
      case 'EMAIL':
        return (
          <input
            type={field.type === 'EMAIL' ? 'email' : 'text'}
            id={fieldId}
            name={fieldName}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.placeholder || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
          />
        );

      case 'PASSWORD':
        return (
          <input
            type="password"
            id={fieldId}
            name={fieldName}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.placeholder || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
          />
        );

      case 'TEXT_AREA':
        return (
          <textarea
            id={fieldId}
            name={fieldName}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.placeholder || ''}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
          />
        );

      case 'NUMBER':
        return (
          <input
            type="number"
            id={fieldId}
            name={fieldName}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.placeholder || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
          />
        );

      case 'DATE':
        return (
          <input
            type="date"
            id={fieldId}
            name={fieldName}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
          />
        );

      case 'DROPDOWN':
      case 'MULTISELECT':
        const options = field.options ? field.options.split('\n').filter(o => o.trim()) : [];
        if (field.type === 'MULTISELECT') {
          return (
            <select
              id={fieldId}
              name={fieldName}
              multiple
              value={Array.isArray(value) ? value : []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                onChange(selected);
              }}
              required={field.required}
              className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
            >
              {options.map((opt, i) => (
                <option key={i} value={opt.trim()}>
                  {opt.trim()}
                </option>
              ))}
            </select>
          );
        }
        return (
          <select
            id={fieldId}
            name={fieldName}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
          >
            <option value="">Select {field.caption}</option>
            {options.map((opt, i) => (
              <option key={i} value={opt.trim()}>
                {opt.trim()}
              </option>
            ))}
          </select>
        );

      case 'CHECKBOX':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id={fieldId}
              name={fieldName}
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              required={field.required}
              className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
            />
            <span className="text-gray-700">{field.placeholder || field.caption}</span>
          </label>
        );

      case 'RADIO':
        const radioOptions = field.options ? field.options.split('\n').filter(o => o.trim()) : [];
        return (
          <div className="space-y-2">
            {radioOptions.map((opt, i) => (
              <label key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={fieldName}
                  value={opt.trim()}
                  checked={value === opt.trim()}
                  onChange={(e) => onChange(e.target.value)}
                  required={field.required}
                  className="w-4 h-4 text-yellow-500 border-gray-300 focus:ring-yellow-400"
                />
                <span className="text-gray-700">{opt.trim()}</span>
              </label>
            ))}
          </div>
        );

      case 'FILE':
      case 'PICTURE':
        return (
          <div>
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded border border-gray-300 inline-block">
              Choose file
              <input
                type="file"
                id={fieldId}
                name={fieldName}
                accept={field.type === 'PICTURE' ? 'image/*' : '*'}
                onChange={(e) => onChange(e.target.files?.[0] || null)}
                required={field.required}
                className="hidden"
              />
            </label>
            {value && (
              <span className="ml-3 text-gray-500 text-sm">
                {value instanceof File ? value.name : 'File selected'}
              </span>
            )}
          </div>
        );

      case 'LOCATION':
        return (
          <input
            type="text"
            id={fieldId}
            name={fieldName}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.placeholder || 'City, State'}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
          />
        );

      default:
        return (
          <input
            type="text"
            id={fieldId}
            name={fieldName}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.placeholder || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={fieldId} className="block text-gray-700 font-medium mb-2">
        {field.caption} {field.required && <span className="text-red-500">*</span>}
      </label>
      {renderField()}
      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
