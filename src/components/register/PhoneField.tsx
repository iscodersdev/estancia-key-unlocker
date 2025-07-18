
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

interface PhoneFieldProps {
  phone: string;
  error: string;
  isPhoneReadOnly: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneField = ({
  phone,
  error,
  isPhoneReadOnly,
  onChange,
}: PhoneFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Teléfono</Label>
      <div className="relative">
        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="phone"
          type="tel"
          placeholder="+54 9 11 1234-5678"
          className={`pl-10 ${error ? 'border-red-500' : ''} ${isPhoneReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          value={phone}
          onChange={onChange}
          required
          readOnly={isPhoneReadOnly}
          disabled={isPhoneReadOnly}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isPhoneReadOnly && (
        <p className="text-sm text-green-600">✓ Dato validado</p>
      )}
    </div>
  );
};
