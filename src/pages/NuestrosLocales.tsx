
import React, { useState, useRef } from 'react';
import Header from "@/components/Header";
import Map, { MapRef } from "@/components/Map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Clock, MessageCircle, Search, Navigation, Loader2 } from "lucide-react";
import { useSucursales } from "@/hooks/useSucursales";

const NuestrosLocales = () => {
  const [mapboxApiKey] = useState<string>('pk.eyJ1IjoiaXNjb2RlcnMiLCJhIjoiY21iZ2szbjdmMjZrcTJsb2s0OHd6dG9qeiJ9.fY5AVF1Z7sQqtaxa04Q6Tw');
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredSucursales, setFilteredSucursales] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const mapRef = useRef<MapRef>(null);

  const { sucursales, loading, error } = useSucursales();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredSucursales([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = sucursales.filter(sucursal =>
      sucursal.name.toLowerCase().includes(value.toLowerCase()) ||
      sucursal.address.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSucursales(filtered);
    setShowSearchResults(true);
  };

  const handleSelectLocal = (index: number) => {
    console.log('Selecting local at index:', index, 'Location:', sucursales[index]);
    setSelectedLocationIndex(index);
    setShowSearchResults(false);
    
    // Mantener el searchTerm del local seleccionado para que filtre la lista
    const selectedLocal = sucursales[index];
    setSearchTerm(selectedLocal.name);
    
    // Actualizar filteredSucursales con el local seleccionado para que se muestre en la lista
    const filtered = sucursales.filter(sucursal =>
      sucursal.name.toLowerCase().includes(selectedLocal.name.toLowerCase()) ||
      sucursal.address.toLowerCase().includes(selectedLocal.name.toLowerCase())
    );
    setFilteredSucursales(filtered);
    
    // Animate to location with a slight delay to ensure state is updated
    setTimeout(() => {
      if (mapRef.current && sucursales[index]) {
        console.log('Animating to coordinates:', sucursales[index].coordinates);
        mapRef.current.animateToLocation(sucursales[index].coordinates);
      }
    }, 100);
  };

  const handleNearbySearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Calcular distancias y ordenar por cercanía
          const sucursalesWithDistance = sucursales.map((sucursal, index) => ({
            ...sucursal,
            index,
            distance: calculateDistance(latitude, longitude, sucursal.coordinates[1], sucursal.coordinates[0])
          }));

          sucursalesWithDistance.sort((a, b) => a.distance - b.distance);
          
          // Seleccionar el más cercano
          const closest = sucursalesWithDistance[0];
          console.log('Closest location found:', closest);
          setSelectedLocationIndex(closest.index);
          
          if (mapRef.current) {
            mapRef.current.animateToLocation(closest.coordinates);
          }

          alert(`Local más cercano: ${closest.name} (${closest.distance.toFixed(1)} km)`);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación.');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  const handleWhatsAppContact = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleLocationClick = (originalIndex: number) => {
    console.log('Location card clicked, originalIndex:', originalIndex);
    setSelectedLocationIndex(originalIndex);
    
    const sucursal = sucursales[originalIndex];
    if (mapRef.current && sucursal) {
      console.log('Animating to coordinates:', sucursal.coordinates);
      mapRef.current.animateToLocation(sucursal.coordinates);
      
      // Abrir la app de mapas del dispositivo
      openDeviceMaps(sucursal.coordinates[1], sucursal.coordinates[0], sucursal.name);
    }
  };

  const openDeviceMaps = (lat: number, lng: number, placeName: string) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // Para iOS, usar Apple Maps
      const appleMapsUrl = `maps://maps.apple.com/?q=${encodeURIComponent(placeName)}&ll=${lat},${lng}`;
      window.open(appleMapsUrl, '_blank');
    } else if (isAndroid) {
      // Para Android, usar Google Maps
      const googleMapsUrl = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(placeName)})`;
      window.open(googleMapsUrl, '_blank');
    } else {
      // Para desktop o otros dispositivos, usar Google Maps web
      const googleMapsWebUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(googleMapsWebUrl, '_blank');
    }
  };

  // Determinar qué locales mostrar: si hay búsqueda activa, mostrar filtrados, sino todos
  const displayedSucursales = searchTerm.trim() !== '' ? filteredSucursales : sucursales;

  return (
    <div className="flex-1 bg-gray-50 pb-20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-estancias-charcoal" />
              <span className="text-estancias-charcoal">Cargando sucursales...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">{error}</div>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-estancias-charcoal hover:bg-estancias-charcoal/90 text-white"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && sucursales.length > 0 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-estancias-charcoal mb-4">
                Nuestros Locales
              </h1>
              
              {/* Buscador con autocompletado */}
              <div className="max-w-md mx-auto mb-4 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar local por nombre o ciudad..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full"
                  />
                </div>
                
                {/* Resultados del autocompletado */}
                {showSearchResults && filteredSucursales.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-50">
                    {filteredSucursales.map((sucursal, filteredIndex) => {
                      const originalIndex = sucursales.findIndex(s => s.id === sucursal.id);
                      return (
                        <div
                          key={sucursal.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleSelectLocal(originalIndex)}
                        >
                          <div className="font-medium text-sm">{sucursal.name}</div>
                          <div className="text-xs text-gray-500">{sucursal.address}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {showSearchResults && filteredSucursales.length === 0 && searchTerm.trim() !== '' && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50">
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No se encontraron locales que coincidan con "{searchTerm}"
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de búsqueda por ubicación */}
              <Button
                onClick={handleNearbySearch}
                className="bg-estancias-charcoal hover:bg-estancias-charcoal/90 text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Buscar más cercano
              </Button>
            </div>

            {/* Mapa */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-md p-4">
                <Map 
                  ref={mapRef} 
                  apiKey={mapboxApiKey} 
                  locales={sucursales} 
                  selectedLocationIndex={selectedLocationIndex}
                />
              </div>
            </div>

            {/* Lista de locales */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSucursales.map((sucursal, displayIndex) => {
                // Calcular el índice original en el array de sucursales
                const originalIndex = sucursales.findIndex(s => s.id === sucursal.id);
                
                return (
                  <Card 
                    key={sucursal.id} 
                    className={`hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col ${
                      selectedLocationIndex === originalIndex ? 'ring-2 ring-estancias-charcoal' : ''
                    }`}
                    onClick={() => handleLocationClick(originalIndex)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-estancias-charcoal text-lg leading-tight min-h-[3rem] flex items-center">
                        {sucursal.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-5 h-5 text-estancias-charcoal mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm leading-relaxed">{sucursal.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-5 h-5 text-estancias-charcoal flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{sucursal.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="w-5 h-5 text-estancias-charcoal mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm leading-relaxed">{sucursal.hours}</span>
                        </div>
                      </div>
                      <div className="mt-auto pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppContact(sucursal.phone);
                          }}
                          className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">Contactar por WhatsApp</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NuestrosLocales;
