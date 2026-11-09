'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

function toHex(color: string): string {
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color
  }

  if (typeof document === 'undefined') {
    return '#000000'
  }

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) return '#000000'

  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)

  const [r, g, b] = context.getImageData(0, 0, 1, 1).data

  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`
}

export const ColorField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })

  const currentValue = typeof value === 'string' ? value : '#000000'

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={path} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
        {typeof field?.label === 'string' ? field.label : path}
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input
          type="color"
          value={toHex(currentValue)}
          onChange={(event) => setValue(event.target.value)}
          style={{
            width: '52px',
            height: '42px',
            padding: '3px',
            cursor: 'pointer',
          }}
        />

        <input
          id={path}
          type="text"
          value={currentValue}
          onChange={(event) => setValue(event.target.value)}
          placeholder="#000000"
          style={{
            maxWidth: '180px',
            padding: '0.6rem',
            border: '1px solid var(--theme-elevation-300)',
            borderRadius: '4px',
          }}
        />

        <span
          aria-label="Aperçu de la couleur"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: currentValue,
            border: '1px solid var(--theme-elevation-300)',
          }}
        />
      </div>
    </div>
  )
}
