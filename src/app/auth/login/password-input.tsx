'use client'

import { useState } from 'react'

export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="password" className="text-sm font-semibold text-foreground">Contraseña</label>
      <div className="relative">
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground placeholder:text-muted-foreground"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-muted"
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>
    </div>
  )
}
