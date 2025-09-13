import { faker } from '@faker-js/faker'

// Categories
export const categories = [
  { id: 1, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop' },
  { id: 2, name: 'Clothing', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop' },
  { id: 3, name: 'Home & Garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop' },
  { id: 4, name: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop' },
  { id: 5, name: 'Books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop' },
  { id: 6, name: 'Beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop' }
]

// Generate products
const generateProducts = () => {
  const products = []
  const productImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
  ]

  for (let i = 1; i <= 60; i++) {
    products.push({
      id: i,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      category_id: faker.helpers.arrayElement(categories).id,
      image: faker.helpers.arrayElement(productImages),
      stock: faker.number.int({ min: 0, max: 100 }),
      rating: parseFloat(faker.number.float({ min: 3, max: 5 }).toFixed(1)),
      reviews: faker.number.int({ min: 5, max: 200 }),
      featured: faker.datatype.boolean({ probability: 0.2 })
    })
  }
  return products
}

export const products = generateProducts()

// Orders
export const orders = [
  {
    id: 1,
    user_id: 'user-1',
    total: 299.99,
    status: 'delivered',
    created_at: '2024-12-15T10:00:00Z',
    items: [
      { product_id: 1, quantity: 2, price: 149.99 }
    ]
  },
  {
    id: 2,
    user_id: 'user-1',
    total: 89.50,
    status: 'shipped',
    created_at: '2024-12-20T14:30:00Z',
    items: [
      { product_id: 3, quantity: 1, price: 89.50 }
    ]
  }
]
