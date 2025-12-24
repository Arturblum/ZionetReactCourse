import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    common: {
      header: {
        title: 'Contact info',
        home: 'Home',
        about: 'About',
        products: 'Products',
        cart: 'Cart ({{count}})',
        theme: 'Theme: {{theme}}',
      },
      button: {
        viewDetails: 'View Details',
        addToCart: 'Add to Cart',
        close: 'Close',
        checkout: 'Checkout',
      },
      loading: 'Loading...',
      error: 'An error occurred',
      emptyState: 'No items found',
    },
    products: {
      title: 'Products',
      testErrorToast: 'Test error toast: <0>Open a fake product</0>',
      simulateError: 'Simulate products API error',
      stopSimulateError: 'Stop products error mode',
      loadingList: 'Loading products...',
      listError: 'Something went wrong while loading products.',
      loadMore: 'Load more',
      loadingMore: 'Loading...',
      noMoreProducts: 'No more products',
      backToProducts: 'Back to products',
      missingId: 'Missing product id.',
      loadingDetail: 'Loading product...',
      detailError: 'Something went wrong while loading this product.',
      addToCartSuccess: 'Product added to cart',
      addToCartFailed: 'Failed to add product to cart.',
      addingToCart: 'Adding...',
      missingProduct: 'Missing product.',
      showingCount: 'Showing {{count}} product',
      showingCount_other: 'Showing {{count}} products',
      searchLabel: 'Search',
      searchPlaceholder: 'Search products...',
      noSearchResults: 'No products match your search.',
      productCount: '{{count}} product',
      productCount_other: '{{count}} products',
      details: {
        title: 'Product Details',
        price: 'Price',
        category: 'Category',
        description: 'Description',
        notFound: 'Product not found',
      },
      errors: {
        loadFailed: 'Failed to load products. Please try again.',
        detailLoadFailed: 'Failed to load product details.',
      },
      emptyList: 'No products available at the moment.',
    },
  },
  he: {
    common: {
      header: {
        title: 'פרטי קשר',
        home: 'דף הבית',
        about: 'אודות',
        products: 'מוצרים',
        cart: 'עגלה ({{count}})',
        theme: 'ערכת נושא: {{theme}}',
      },
      button: {
        viewDetails: 'צפה בפרטים',
        addToCart: 'הוסף לעגלה',
        close: 'סגור',
        checkout: 'לתשלום',
      },
      loading: 'טוען...',
      error: 'אירעה שגיאה',
      emptyState: 'לא נמצאו פריטים',
    },
    products: {
      title: 'מוצרים',
      testErrorToast: 'בדיקת הודעת שגיאה: <0>פתח מוצר מזויף</0>',
      simulateError: 'הדמיית שגיאת API במוצרים',
      stopSimulateError: 'עצור מצב שגיאת מוצרים',
      loadingList: 'טוען מוצרים...',
      listError: 'משהו השתבש בזמן טעינת המוצרים.',
      loadMore: 'טען עוד',
      loadingMore: 'טוען...',
      noMoreProducts: 'אין עוד מוצרים',
      backToProducts: 'חזרה למוצרים',
      missingId: 'מזהה מוצר חסר.',
      loadingDetail: 'טוען מוצר...',
      detailError: 'משהו השתבש בזמן טעינת מוצר זה.',
      addToCartSuccess: 'המוצר נוסף לעגלה',
      addToCartFailed: 'הוספת המוצר לעגלה נכשלה.',
      addingToCart: 'מוסיף...',
      missingProduct: 'מוצר חסר.',
      showingCount: 'מציג מוצר אחד',
      showingCount_other: 'מציג {{count}} מוצרים',
      searchLabel: 'חיפוש',
      searchPlaceholder: 'חיפוש מוצרים...',
      noSearchResults: 'לא נמצאו מוצרים המתאימים לחיפוש.',
      productCount: 'מוצר אחד',
      productCount_other: '{{count}} מוצרים',
      details: {
        title: 'פרטי מוצר',
        price: 'מחיר',
        category: 'קטגוריה',
        description: 'תיאור',
        notFound: 'המוצר לא נמצא',
      },
      errors: {
        loadFailed: 'טעינת המוצרים נכשלה. אנא נסה שוב.',
        detailLoadFailed: 'טעינת פרטי המוצר נכשלה.',
      },
      emptyList: 'אין מוצרים זמינים כרגע.',
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    ns: ['common', 'products'], // namespaces
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
