
import React from 'react';
import Header from "@/components/Header";
import NotificationsContent from "../components/NotificationsContent";

const Notificaciones: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <NotificationsContent />
    </div>
  );
};

export default Notificaciones;
