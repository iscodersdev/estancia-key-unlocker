
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface MapboxApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const MapboxApiKeyInput: React.FC<MapboxApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="font-bold text-blue-800 mb-2">Configurar Mapa</h3>
      <p className="text-blue-700 text-sm mb-3">
        Para ver las ubicaciones en el mapa, ingresa tu token público de Mapbox.
        Puedes obtenerlo en <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Input
            type={showApiKey ? "text" : "password"}
            placeholder="pk.eyJ1IjoibXl1c2VybmFtZSIsImEiOiJja..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={!apiKey.trim()}>
          Mostrar Mapa
        </Button>
      </form>
    </div>
  );
};

export default MapboxApiKeyInput;
