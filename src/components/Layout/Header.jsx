import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, signOut, isAdmin } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-white dark:bg-dark-card shadow-md dark:shadow-lg dark:border-b dark:border-dark-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">ShopEasy</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-sm font-medium">
              Products
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                <Link to="/orders" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-sm font-medium">
                  Orders
                </Link>
                <Link to="/cart" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light">
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-sm font-medium">
                    <User className="h-5 w-5" />
                    <span>{user.name || user.email}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200 dark:border-dark-border">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/cart" className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light">
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-blue-dark">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
             <Link to="/cart" className="relative p-2 mr-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-dark-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
              
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-base font-medium">
                Products
              </Link>
              
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-base font-medium">
                      Admin
                    </Link>
                  )}
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-base font-medium">
                    Orders
                  </Link>
                  <button
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-base font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue-light px-3 py-2 rounded-md text-base font-medium">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block bg-brand-blue text-white mx-3 my-2 px-3 py-2 rounded-md text-base font-medium hover:bg-brand-blue-dark text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
