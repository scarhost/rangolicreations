import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import RangoliTransition from "@/components/RangoliTransition";
import Index from "./pages/Index";
import BedsheetsShop from "./pages/BedsheetsShop";
import ProductDetail from "./pages/ProductDetail";
import JewelryPage from "./pages/JewelryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CurrencyProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RangoliTransition />
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/bedsheets" element={<BedsheetsShop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/jewelry" element={<JewelryPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <ChatWidget />
              </>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
      </CurrencyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
