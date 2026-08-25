import { login, signup, signInWithOAuth } from './actions'
import { PasswordInput } from './password-input'

export default function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 md:px-16 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(18,103,232,0.06)_0%,transparent_70%)] pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-[440px] p-6 sm:p-10 rounded-2xl bg-card border border-border shadow-lg z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">Vink Connect</h1>
          <p className="text-sm text-muted-foreground">Inicia sesión o crea tu cuenta</p>
        </div>

        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground">Correo Electrónico</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-3.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition duration-150 ease-out text-foreground placeholder:text-muted-foreground"
              placeholder="nombre@empresa.com"
            />
          </div>
          
          <PasswordInput />

          <div className="flex flex-col gap-3 mt-4">
            <button 
              formAction={login} 
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition duration-150 ease-out active:scale-[0.97] shadow-sm"
            >
              Iniciar Sesión
            </button>
            <button 
              formAction={signup} 
              className="w-full py-4 rounded-xl border border-primary text-primary font-semibold hover:bg-primary/5 transition duration-150 ease-out active:scale-[0.97] bg-transparent"
            >
              Crear Cuenta Nueva
            </button>
          </div>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-3 text-muted-foreground font-medium">o continuar con</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Google */}
          <form action={signInWithOAuth}>
            <input type="hidden" name="provider" value="google" />
            <button
              type="submit"
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl border border-border bg-background hover:bg-muted transition duration-150 ease-out active:scale-[0.97]"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-sm font-semibold text-foreground">Google</span>
            </button>
          </form>

          {/* GitHub */}
          <form action={signInWithOAuth}>
            <input type="hidden" name="provider" value="github" />
            <button
              type="submit"
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl border border-border bg-background hover:bg-muted transition duration-150 ease-out active:scale-[0.97]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-foreground">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">GitHub</span>
            </button>
          </form>

          {/* Apple */}
          <form action={signInWithOAuth}>
            <input type="hidden" name="provider" value="apple" />
            <button
              type="submit"
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl border border-border bg-background hover:bg-muted transition duration-150 ease-out active:scale-[0.97]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-foreground">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.948 1.56-.027 2.583-1.52 3.584-2.974 1.155-1.688 1.636-3.324 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.519 1.09zM15.502 3.833c.843-1.012 1.414-2.427 1.258-3.833-1.196.04-2.673.804-3.542 1.816-.78.895-1.453 2.335-1.271 3.713 1.336.104 2.712-.687 3.555-1.696z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">Apple</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
