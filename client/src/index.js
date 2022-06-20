import React, { useReducer } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ProductsProvider, productsReducer } from './context/products'
import { hasHidden } from './utils/filterFunctions'

const intialProducts = {
  products: [],
  filters: {
    hiddenVariants: {
      status: false,
      filter: hasHidden,
    },
  },
}

function Products({ children }) {
  const [state, dispatch] = useReducer(productsReducer, intialProducts)

  return (
    <ProductsProvider value={[state, dispatch]}>{children}</ProductsProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Products>
      <App />
    </Products>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
