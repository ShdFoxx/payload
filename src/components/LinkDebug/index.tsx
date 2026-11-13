'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

export const LinkDebug: TextFieldClientComponent = () => {
  const fields = useFormFields(([fields]) => fields)

  React.useEffect(() => {
    const relevantFields = Object.entries(fields)
      .filter(([key]) => key.includes('blockSettings.anchor') || key.startsWith('layout'))
      .map(([key, state]) => ({
        key,
        value: state.value,
      }))

    console.log('LINK DEBUG - PAGE BLOCKS:', JSON.stringify(relevantFields, null, 2))

    const references = Object.entries(fields)
      .filter(([key]) => key.endsWith('.reference'))
      .map(([key, state]) => ({
        key,
        value: state.value,
      }))

    console.log('LINK DEBUG - REFERENCES:', JSON.stringify(references, null, 2))
  }, [fields])

  return null
}
