'use client'

import React from 'react'
import { useAllFormFields, useField, useForm } from '@payloadcms/ui'
import type { ThemePaletteName } from '@/theme/palettes'
import { themePalettes } from '@/theme/palettes'

type Props = {
  path: string
  field: {
    admin?: {
      custom?: {
        theme?: 'light' | 'dark'
      }
    }
  }
}

type PersonalPalette = {
  key: string
  name: string
  colors: Record<string, string>
}

export const PaletteSelector = ({ field }: Props) => {
  const theme = field.admin?.custom?.theme ?? 'light'

  const [formFields, dispatchFields] = useAllFormFields()
  const { getDataByPath, addFieldRow, removeFieldRow } = useForm()

  const groupPath = `${theme}Theme`
  const palettePath = `${theme}ThemePalette`
  const personalPath = `${theme}PersonalPalettes`
  const activePersonalPath = `${theme}ActivePersonalPalette`

  const { value: selectedPalette, setValue: setSelectedPalette } = useField<ThemePaletteName>({
    path: palettePath,
  })

  const personalPalettes = React.useMemo(() => {
    const data = getDataByPath(personalPath)

    return Array.isArray(data) ? (data as PersonalPalette[]) : []
  }, [formFields, personalPath, getDataByPath])

  const { value: activePersonalPalette, setValue: setActivePersonalPalette } = useField<string>({
    path: activePersonalPath,
  })

  const paletteNames = Object.keys(themePalettes) as ThemePaletteName[]

  const applyColors = (colors: Record<string, string>) => {
    Object.entries(colors).forEach(([name, value]) => {
      dispatchFields({
        type: 'UPDATE',
        path: `${groupPath}.${name}`,
        value,
      })
    })
  }

  const applyPalette = (paletteName: ThemePaletteName) => {
    const palette = themePalettes[paletteName][theme]

    applyColors(palette)

    setSelectedPalette(paletteName)
    setActivePersonalPalette('')
  }

  const applyPersonalPalette = (palette: PersonalPalette) => {
    applyColors(palette.colors)
    setActivePersonalPalette(palette.key)
  }

  const createFieldState = (value: string) => ({
    initialValue: value,
    valid: true,
    passesCondition: true,
    value,
  })

  const savePersonalPalette = () => {
    const name = window.prompt('Nom de votre palette personnelle :')

    if (!name?.trim()) return

    const colors = getDataByPath(groupPath) as Record<string, string> | undefined

    if (!colors) return

    const newPalette: PersonalPalette = {
      key: crypto.randomUUID(),
      name: name.trim(),
      colors: { ...colors },
    }

    const rowIndex = personalPalettes.length
    const rowPath = `${personalPath}.${rowIndex}`

    const subFieldState: Record<string, any> = {
      key: createFieldState(newPalette.key),
      name: createFieldState(newPalette.name),
    }

    Object.entries(newPalette.colors).forEach(([colorName, value]) => {
      subFieldState[`colors.${colorName}`] = createFieldState(value)
    })

    addFieldRow({
      path: personalPath,
      schemaPath: personalPath,
      rowIndex,
      subFieldState,
    })

    setTimeout(() => {
      console.log('Palettes dans le formulaire :', getDataByPath(personalPath))
    }, 100)

    setActivePersonalPalette(newPalette.key)

    Object.entries(subFieldState).forEach(([fieldPath, fieldState]) => {
      dispatchFields({
        type: 'UPDATE',
        path: `${rowPath}.${fieldPath}`,
        value: fieldState.value,
      })
    })
  }

  const updatePersonalPalette = (palette: PersonalPalette) => {
    const colors = getDataByPath(groupPath) as Record<string, string> | undefined

    if (!colors) return

    const rowIndex = personalPalettes.findIndex((item) => item.key === palette.key)

    if (rowIndex === -1) return

    const rowPath = `${personalPath}.${rowIndex}`

    dispatchFields({
      type: 'UPDATE',
      path: `${rowPath}.name`,
      value: palette.name,
    })

    dispatchFields({
      type: 'UPDATE',
      path: `${rowPath}.key`,
      value: palette.key,
    })

    Object.entries(colors).forEach(([name, value]) => {
      dispatchFields({
        type: 'UPDATE',
        path: `${rowPath}.colors.${name}`,
        value,
      })
    })
  }

  const deletePersonalPalette = (palette: PersonalPalette) => {
    const confirmed = window.confirm(`Supprimer la palette « ${palette.name} » ?`)

    if (!confirmed) return

    const rowIndex = personalPalettes.findIndex((item) => item.key === palette.key)

    if (rowIndex !== -1) {
      removeFieldRow({
        path: personalPath,
        rowIndex,
      })
    }
    if (activePersonalPalette === palette.key) {
      setActivePersonalPalette('')
    }
  }
  console.log('Palettes affichées :', personalPalettes)
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Palettes prédéfinies</h3>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {paletteNames.map((name) => {
          const palette = themePalettes[name][theme]

          return (
            <button
              key={name}
              type="button"
              onClick={() => applyPalette(name)}
              style={{
                padding: '0.75rem',
                border:
                  selectedPalette === name && !activePersonalPalette
                    ? '2px solid var(--theme-elevation-800)'
                    : '1px solid var(--theme-elevation-300)',
                borderRadius: '8px',
                cursor: 'pointer',
                background: 'var(--theme-elevation-50)',
                color: 'var(--theme-text)',
              }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                {[palette.background, palette.primary, palette.secondary, palette.accent].map(
                  (color, index) => (
                    <span
                      key={index}
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: '1px solid var(--theme-elevation-300)',
                      }}
                    />
                  ),
                )}
              </div>

              {themePalettes[name].label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        disabled={!selectedPalette || !themePalettes[selectedPalette]}
        onClick={() => {
          if (selectedPalette && themePalettes[selectedPalette]) {
            applyPalette(selectedPalette)
          }
        }}
        style={{ marginTop: '1rem' }}
      >
        Restaurer la palette sélectionnée
      </button>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Mes palettes personnelles</h3>

      <button type="button" onClick={savePersonalPalette} style={{ marginTop: '1rem' }}>
        Enregistrer comme nouvelle palette
      </button>

      {personalPalettes.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '1rem',
          }}
        >
          {personalPalettes.map((palette) => (
            <div
              key={palette.key}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                border:
                  activePersonalPalette === palette.key
                    ? '2px solid var(--theme-elevation-800)'
                    : '1px solid var(--theme-elevation-300)',
                borderRadius: '8px',
              }}
            >
              <button type="button" onClick={() => applyPersonalPalette(palette)}>
                {palette.name}
              </button>

              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  palette.colors.background,
                  palette.colors.primary,
                  palette.colors.secondary,
                  palette.colors.accent,
                ].map((color, index) => (
                  <span
                    key={index}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: '1px solid var(--theme-elevation-300)',
                    }}
                  />
                ))}
              </div>

              <button type="button" onClick={() => updatePersonalPalette(palette)}>
                Mettre à jour
              </button>

              <button type="button" onClick={() => deletePersonalPalette(palette)}>
                Supprimer
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: '1rem' }}>
          Vous n'avez pas encore enregistré de palette personnelle.
        </p>
      )}
    </div>
  )
}
