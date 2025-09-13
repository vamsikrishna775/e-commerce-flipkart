import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock user for demo purposes
    const mockUser = localStorage.getItem('mockUser')
    if (mockUser) {
      setUser(JSON.parse(mockUser))
    }
    setLoading(false)

    // For real Supabase integration, uncomment below:
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     if (session?.user) {
    //       setUser(session.user)
    //     } else {
    //       setUser(null)
    //     }
    //     setLoading(false)
    //   }
    // )

    // return () => subscription?.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    try {
      // Mock implementation
      const mockUser = {
        id: Date.now().toString(),
        email,
        ...userData,
        role: 'user'
      }
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
      setUser(mockUser)
      return { user: mockUser, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signIn = async (email, password) => {
    try {
      // Mock implementation - check for admin credentials
      let mockUser
      if (email === 'admin@shop.com' && password === 'admin123') {
        mockUser = {
          id: 'admin-1',
          email,
          role: 'admin',
          name: 'Admin User'
        }
      } else {
        mockUser = {
          id: Date.now().toString(),
          email,
          role: 'user',
          name: 'Demo User'
        }
      }
      localStorage.setItem('mockUser', JSON.stringify(mockUser))
      setUser(mockUser)
      return { user: mockUser, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signOut = async () => {
    localStorage.removeItem('mockUser')
    setUser(null)
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
