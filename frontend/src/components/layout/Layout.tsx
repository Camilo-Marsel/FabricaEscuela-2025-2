import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
  showLogin?: boolean;
}

export const Layout = ({ children, showLogin = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showLogin={showLogin} />
      <main className="flex-1 px-6 py-8" role="main">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};