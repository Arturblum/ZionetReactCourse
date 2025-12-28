import { expect, test, type Page } from '@playwright/test'

const productList = {
  products: [
    {
      id: 1,
      title: 'Phone Max',
      price: 999,
      category: 'smartphones',
      thumbnail:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQI12P4z8DwHwAFiwJ/lJ+6xQAAAABJRU5ErkJggg==',
    },
    {
      id: 2,
      title: 'Desk Lamp',
      price: 49,
      category: 'home',
      thumbnail:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQI12P4z8DwHwAFiwJ/lJ+6xQAAAABJRU5ErkJggg==',
    },
  ],
  total: 2,
  skip: 0,
  limit: 20,
}

const productDetail = {
  id: 1,
  title: 'Phone Max',
  price: 999,
  description: 'A flagship phone with a crisp display.',
  category: 'smartphones',
  thumbnail:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQI12P4z8DwHwAFiwJ/lJ+6xQAAAABJRU5ErkJggg==',
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear()
  })
})

async function mockProductsList(page: Page) {
  await page.route('**/products?limit=20&skip=0', (route) =>
    route.fulfill({ json: productList }),
  )
}

async function mockProductDetail(page: Page) {
  await page.route('**/products/1', (route) =>
    route.fulfill({ json: productDetail }),
  )
}

async function mockAddToCart(page: Page) {
  await page.route('**/carts/add', (route) =>
    route.fulfill({
      json: {
        id: 10,
        products: [{ id: 1, quantity: 1 }],
        total: 999,
        discountedTotal: 999,
        userId: 1,
        totalProducts: 1,
        totalQuantity: 1,
      },
    }),
  )
}

test('saves a contact on the home form', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('First name').fill('Ada')
  await page.getByLabel('Email').fill('ada@example.com')
  await page.getByRole('button', { name: 'Save contact' }).click()

  await expect(page.getByRole('status')).toContainText('Contact saved.')
  await expect(page.getByText('Ada')).toBeVisible()
  await expect(page.getByText('1 contact')).toBeVisible()
})

test('toggles the theme label in the header', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'Theme: light' })).toBeVisible()
  await page.getByRole('button', { name: 'Theme: light' }).click()
  await expect(page.getByRole('button', { name: 'Theme: dark' })).toBeVisible()
})

test('shows products in list view and filters by search', async ({ page }) => {
  await mockProductsList(page)

  await page.goto('/products')
  await page.getByRole('button', { name: 'List View' }).click()

  const list = page.locator('ul.contact-list')
  await expect(list).toContainText('Phone Max')
  await expect(list).toContainText('Desk Lamp')

  await page.getByLabel('Search').fill('lamp')
  await expect(list).toContainText('Desk Lamp')
  await expect(list).not.toContainText('Phone Max')
})

test('renders product data in the table view', async ({ page }) => {
  await mockProductsList(page)

  await page.goto('/products')

  const table = page.locator('.p-datatable')
  await expect(table).toContainText('Title')
  await expect(table).toContainText('Price')
  await expect(table).toContainText('Phone Max')
})

test('adds a product to the cart from the detail page', async ({ page }) => {
  await mockProductDetail(page)
  await mockAddToCart(page)

  await page.goto('/products/1')

  await expect(page.getByRole('heading', { name: 'Phone Max' })).toBeVisible()
  await page.getByRole('button', { name: 'Add to Cart' }).click()
  await expect(page.getByRole('status')).toContainText('Product added to cart')

  await expect(page.getByRole('button', { name: 'Cart (1)' })).toBeVisible()
  await page.getByRole('button', { name: 'Cart (1)' }).click()
  await expect(page.getByRole('complementary', { name: 'Cart' })).toContainText('Phone Max')
})
