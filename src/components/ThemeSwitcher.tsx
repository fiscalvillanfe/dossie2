import { useState, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'auto'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'dark'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    } else {
      root.setAttribute('data-theme', newTheme)
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const themes: { key: Theme; icon: any; label: string }[] = [
    { key: 'light', icon: Sun, label: 'Claro' },
    { key: 'dark', icon: Moon, label: 'Escuro' },
    { key: 'auto', icon: Monitor, label: 'Auto' }
  ]

  return (
    <div className="flex items-center bg-slate-700/30 rounded-xl p-1 border border-slate-600/40">
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => handleThemeChange(key)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            theme === key
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
          }`}
          title={`Tema ${label}`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}