import { Truck } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground py-8 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold">Momentum Fleet © 2024</span>
          </div>
          
          <div className="text-center text-footer-muted">
            <p>All rights reserved • Transport License #12345</p>
            <p className="mt-1 text-sm">Proyecto A11Y - Experiencias digitales accesibles e inclusivas</p>
          </div>
        </div>
      </div>
    </footer>
  );
};