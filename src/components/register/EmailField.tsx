
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

interface EmailFieldProps {
  email: string;
  error: string;
  isEmailReadOnly: boolean;
  isEmailEditable: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const EmailField = ({
  email,
  error,
  isEmailReadOnly,
  isEmailEditable,
  onChange,
}: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          className={`pl-10 ${error ? 'border-red-500' : ''} ${isEmailReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          value={email}
          onChange={onChange}
          required
          readOnly={isEmailReadOnly}
          disabled={isEmailReadOnly}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {isEmailReadOnly && (
        <p className="text-sm text-green-600">✓ Dato validado</p>
      )}
      {isEmailEditable && (
        <p className="text-sm text-orange-600">⚠️ Email heredado no válido - por favor actualízalo</p>
      )}
    </div>
  );
};
