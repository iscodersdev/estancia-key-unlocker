
import React from 'react';
import Header from '@/components/Header';
import PromocionesContent from '@/components/PromocionesContent';

const PromocionesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <PromocionesContent />
    </div>
  );
};

export default PromocionesPage;
