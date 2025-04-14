
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressProps {
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    complement: string;
  };
  onChange: (field: string, value: string) => void;
}

const AccountAddress = ({ address, onChange }: AddressProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div className="md:col-span-6 space-y-2">
        <Label htmlFor="street" className="text-label">Endereço (Rua, Avenida, etc)</Label>
        <Input
          id="street"
          value={address.street}
          onChange={(e) => onChange("street", e.target.value)}
          className="bg-dark-700 border-zinc-700 text-white"
        />
      </div>
      
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="number" className="text-label">Número</Label>
        <Input
          id="number"
          value={address.number}
          onChange={(e) => onChange("number", e.target.value)}
          className="bg-dark-700 border-zinc-700 text-white"
        />
      </div>

      <div className="md:col-span-4 space-y-2">
        <Label htmlFor="neighborhood" className="text-label">Bairro</Label>
        <Input
          id="neighborhood"
          value={address.neighborhood}
          onChange={(e) => onChange("neighborhood", e.target.value)}
          className="bg-dark-700 border-zinc-700 text-white"
        />
      </div>

      <div className="md:col-span-4 space-y-2">
        <Label htmlFor="city" className="text-label">Cidade</Label>
        <Input
          id="city"
          value={address.city}
          onChange={(e) => onChange("city", e.target.value)}
          className="bg-dark-700 border-zinc-700 text-white"
        />
      </div>

      <div className="md:col-span-4 space-y-2">
        <Label htmlFor="state" className="text-label">Estado</Label>
        <Input
          id="state"
          value={address.state}
          onChange={(e) => onChange("state", e.target.value)}
          className="bg-dark-700 border-zinc-700 text-white"
        />
      </div>

      <div className="md:col-span-4 space-y-2">
        <Label htmlFor="complement" className="text-label">Complemento (Opcional)</Label>
        <Input
          id="complement"
          value={address.complement}
          onChange={(e) => onChange("complement", e.target.value)}
          className="bg-dark-700 border-zinc-700 text-white"
        />
      </div>
    </div>
  );
};

export default AccountAddress;
