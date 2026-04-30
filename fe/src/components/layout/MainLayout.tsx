import { Outlet, ScrollRestoration } from 'react-router-dom';
import ChatbotWidget from '@/components/ui/ChatbotWidget';
import Footer from './Footer';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[88px]">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
      <ScrollRestoration />
    </div>
  );
}

