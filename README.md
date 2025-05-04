<!-- # React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
``` -->

toagro-frontend/
├── .eslintrc.json
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── assets/
│       └── images/
│           ├── category-icons/
│           ├── hero-banner.jpg
│           └── placeholder.jpg
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── vite-env.d.ts
│   ├── api/
│   │   ├── index.ts
│   │   ├── apiClient.ts
│   │   ├── authApi.ts
│   │   ├── listingsApi.ts
│   │   ├── categoriesApi.ts
│   │   ├── chatApi.ts
│   │   ├── paymentsApi.ts
│   │   └── notificationsApi.ts
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── variables.css
│   │   │   └── themes.css
│   │   └── images/
│   │       └── logo.svg
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Rating.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── ResetPasswordForm.tsx
│   │   ├── listings/
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingsList.tsx
│   │   │   ├── ListingForm.tsx
│   │   │   ├── ListingFilters.tsx
│   │   │   ├── ListingDetails.tsx
│   │   │   └── ImageUploader.tsx
│   │   ├── categories/
│   │   │   ├── CategoryList.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   └── CategoryTree.tsx
│   │   ├── chat/
│   │   │   ├── ChatList.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   └── MessageForm.tsx
│   │   ├── user/
│   │   │   ├── UserProfile.tsx
│   │   │   ├── UserSettings.tsx
│   │   │   └── UserListings.tsx
│   │   ├── payments/
│   │   │   ├── PaymentForm.tsx
│   │   │   ├── PaymentsList.tsx
│   │   │   └── PaymentDetails.tsx
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── UsersList.tsx
│   │   │   ├── AdminListings.tsx
│   │   │   ├── AdminCategories.tsx
│   │   │   ├── AdminPayments.tsx
│   │   │   └── charts/
│   │   │       ├── SalesChart.tsx
│   │   │       ├── UsersChart.tsx
│   │   │       └── ListingsChart.tsx
│   │   └── notifications/
│   │       ├── NotificationsList.tsx
│   │       ├── NotificationItem.tsx
│   │       └── NotificationBell.tsx
│   ├── store/
│   │   ├── index.ts
│   │   ├── rootReducer.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── listingsSlice.ts
│   │   │   ├── categoriesSlice.ts
│   │   │   ├── chatSlice.ts
│   │   │   ├── paymentsSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── notificationsSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── hooks.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── ListingsPage.tsx
│   │   ├── ListingDetailsPage.tsx
│   │   ├── CreateListingPage.tsx
│   │   ├── EditListingPage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── UserListingsPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── PaymentsPage.tsx
│   │   ├── PaymentResultPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminUsersPage.tsx
│   │       ├── AdminListingsPage.tsx
│   │       ├── AdminCategoriesPage.tsx
│   │       ├── AdminPaymentsPage.tsx
│   │       └── AdminSettingsPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useForm.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useApi.ts
│   │   ├── useSocket.ts
│   │   └── useOutsideClick.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.types.ts
│   │   ├── listing.types.ts
│   │   ├── category.types.ts
│   │   ├── user.types.ts
│   │   ├── chat.types.ts
│   │   ├── payment.types.ts
│   │   └── notification.types.ts
│   └── routes/
│       ├── index.tsx
│       ├── ProtectedRoute.tsx
│       ├── AdminRoute.tsx
│       └── PublicRoute.tsx
└── README.md