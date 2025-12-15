import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import Orders from './pages/Orders';

const { Content, Footer } = Layout;

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Navbar />
            <Content>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<ProductList />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Content>
        </Layout>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;