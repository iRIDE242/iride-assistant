import React, { useReducer } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {
  initialProducts,
  ProductsProvider,
  productsReducer,
} from './context/products'

function Products({ children }) {
  const [state, dispatch] = useReducer(productsReducer, initialProducts)

  return (
    <ProductsProvider value={[state, dispatch]}>{children}</ProductsProvider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Products>
      <App />
    </Products>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
