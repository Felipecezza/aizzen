
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

export const OrderCheckbox = ({ checked, onCheckedChange, indeterminate }: OrderCheckboxProps) => {
  const checkboxStyles = "data-[state=checked]:bg-primary/20 border border-zinc-700 aspect-square h-4 w-4 scale-50 rounded-[1px]";
  
  return (
    <div className="flex items-center justify-center relative">
      <Checkbox 
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={checkboxStyles}
      />
      {indeterminate && (
        <div className="absolute pointer-events-none">
          <Check className="h-2 w-2 text-primary" />
        </div>
      )}
      {checked && !indeterminate && (
        <div className="absolute pointer-events-none">
          <Check className="h-2 w-2 text-primary" />
        </div>
      )}
    </div>
  );
};
