
import React from 'react';

export const TransferDataCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 text-center mb-4">
        Datos para realizar la transferencia
      </h3>

      <div className="space-y-4 text-center">
        <div>
          <p className="text-xs text-gray-600 mb-1">CVU</p>
          <p className="text-sm font-mono font-semibold text-gray-800 break-all">
            0110699820069900253183
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-1">Alias</p>
          <p className="text-sm font-semibold text-gray-800">
            ENCASA.CON.ESTANCIAS
          </p>
        </div>
      </div>
    </div>
  );
};
