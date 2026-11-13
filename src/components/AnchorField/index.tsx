'use client'

import { useField, useFormFields, useConfig } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React from 'react'

type AnchorOption = {
  label: string
  value: string
}

export const AnchorField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const { config } = useConfig()

  const referencePath = path.replace(/\.anchor$/, '.reference')

  const reference = useFormFields(([fields]) => fields[referencePath]?.value) as
    { relationTo: 'pages' | 'posts'; value: string | number } | undefined

  const [options, setOptions] = React.useState<AnchorOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (reference?.relationTo !== 'pages' || !reference.value) {
      return
    }

    const controller = new AbortController()

    const loadAnchors = async () => {
      setLoading(true)
      setError(null)

      try {
        const apiURL = `${config.serverURL}${config.routes.api}/pages/${reference.value}`

        const response = await fetch(apiURL, {
          credentials: 'include',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Erreur API : ${response.status}`)
        }

        const page = await response.json()
        const anchors: AnchorOption[] = (page.layout || [])
          .map((block: any) => {
            const anchor = block.blockSettings?.anchor

            if (typeof anchor !== 'string' || !anchor.trim()) return null

            return {
              label: `${block.blockName || block.blockType} — #${anchor}`,
              value: anchor,
            }
          })
          .filter((anchor: AnchorOption | null): anchor is AnchorOption => anchor !== null)

        setOptions(anchors)

        if (value && !anchors.some((anchor) => anchor.value === value)) {
          setValue('')
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadAnchors()

    return () => controller.abort()
  }, [reference?.relationTo, reference?.value, config, value, setValue])

  if (reference?.relationTo !== 'pages') {
    return null
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={path} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
        {typeof field?.label === 'string' ? field.label : 'Anchor'}
      </label>

      <select
        id={path}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => setValue(event.target.value)}
        disabled={loading || options.length === 0}
        style={{
          width: '100%',
          padding: '0.6rem',
          border: '1px solid var(--theme-elevation-300)',
          borderRadius: '4px',
        }}
      >
        <option value="">No anchor</option>

        {options.map((anchor) => (
          <option key={anchor.value} value={anchor.value}>
            {anchor.label}
          </option>
        ))}
      </select>

      {loading && <small>Loading anchors…</small>}
      {error && <small style={{ color: 'red' }}>{error}</small>}
      {!loading && !error && options.length === 0 && (
        <small>No anchors available on this page.</small>
      )}
    </div>
  )
}
