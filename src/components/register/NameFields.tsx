
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface NameFieldsProps {
  firstName: string;
  lastName: string;
  isFirstNameReadOnly: boolean;
  isLastNameReadOnly: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export const NameFields = ({
  firstName,
  lastName,
  isFirstNameReadOnly,
  isLastNameReadOnly,
  onFirstNameChange,
  onLastNameChange,
}: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Nombre</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="firstName"
            placeholder="Juan"
            className={`pl-10 ${isFirstNameReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            value={firstName}
            onChange={(e) => !isFirstNameReadOnly && onFirstNameChange(e.target.value)}
            required
            readOnly={isFirstNameReadOnly}
            disabled={isFirstNameReadOnly}
          />
        </div>
        {isFirstNameReadOnly && (
          <p className="text-sm text-green-600">✓ Dato validado</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="lastName">Apellido</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="lastName"
            placeholder="Pérez"
            className={`pl-10 ${isLastNameReadOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            value={lastName}
            onChange={(e) => !isLastNameReadOnly && onLastNameChange(e.target.value)}
            required
            readOnly={isLastNameReadOnly}
            disabled={isLastNameReadOnly}
          />
        </div>
        {isLastNameReadOnly && (
          <p className="text-sm text-green-600">✓ Dato validado</p>
        )}
      </div>
    </div>
  );
};
