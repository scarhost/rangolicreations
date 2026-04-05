import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, MessageSquare, ShoppingCart, Star, Mail, Users, ArrowLeft, Newspaper } from 'lucide-react';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminContent from '@/components/admin/AdminContent';
import AdminTestimonials from '@/components/admin/AdminTestimonials';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminChat from '@/components/admin/AdminChat';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminNewsletter from '@/components/admin/AdminNewsletter';

const tabs = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'content', label: 'Site Content', icon: FileText },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'chat', label: 'Chat', icon: MessageSquare },
  { id: 'contacts', label: 'Contact Messages', icon: Mail },
  { id: 'newsletter', label: 'Newsletter', icon: Newspaper },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground font-body mb-2 hover:text-primary transition-colors">
                <ArrowLeft size={14} /> Back to Store
              </Link>
              <h1 className="font-heading text-2xl font-semibold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground font-body mt-1">Manage your store content, products, and orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-sm font-body px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-secondary'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'content' && <AdminContent />}
          {activeTab === 'testimonials' && <AdminTestimonials />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'chat' && <AdminChat />}
          {activeTab === 'contacts' && <AdminContacts />}
          {activeTab === 'newsletter' && <AdminNewsletter />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
