
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";

interface CardNumberFieldProps {
  nroTarjeta: string;
  error: string;
  isCardNumberReadOnly: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CardNumberField = ({
  nroTarjeta,
  error,
  isCardNumberReadOnly,
  onChange,
}: CardNumberFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="nroTarjeta">Número de Tarjeta</Label>
      <div className="relative">
        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="nroTarjeta"
          type="text"
          placeholder="0000000500022911"
          className={`pl-10 ${error ? 'border-red-500' : ''} ${isCardNumberReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          value={nroTarjeta}
          onChange={onChange}
          required
          readOnly={isCardNumberReadOnly}
          disabled={isCardNumberReadOnly}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isCardNumberReadOnly && (
        <p className="text-sm text-green-600">✓ Tarjeta validada</p>
      )}
    </div>
  );
};
