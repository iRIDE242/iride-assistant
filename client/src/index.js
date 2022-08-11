import React, { useReducer } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {
  initialProducts,
  productsContext,
  productsReducer,
} from './context/products.context'

function ProductsProvider({ children }) {
  const [state, dispatch] = useReducer(productsReducer, initialProducts)

  return (
    <productsContext.Provider value={[state, dispatch]}>
      {children}
    </productsContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ProductsProvider>
      <App />
    </ProductsProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
