'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth, onAuthStateChanged, signInWithGoogle, signOut, type User } from './firebase-client'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInWithGoogle: async () => { throw new Error('AuthProvider not mounted') },
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
