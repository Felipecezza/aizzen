import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "@/lib/utils";

export const AccountForm = ({ userData, setUserData, loading, setLoading }: {
  userData: any;
  setUserData: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>
          Email
        </Label>
        <Input
          value={userData.email}
          disabled
          className="bg-dark-700 border-zinc-700 text-white opacity-60"
        />
      </div>

      <div className="space-y-2">
        <Label>
          Nome Completo
        </Label>
        <Input
          value={userData.full_name}
          onChange={(e) =>
            setUserData({ ...userData, full_name: e.target.value })
          }
          className="bg-dark-700 border-zinc-700 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label>
          Telefone
        </Label>
        <PhoneInput
          country="br"
          value={userData.phone}
          onChange={(phone) => setUserData({ ...userData, phone })}
          inputClass="!w-full !bg-dark-700 !border-zinc-700 !text-white !h-10"
          containerClass="!bg-dark-700"
          buttonClass="!bg-dark-700 !h-10"
          dropdownClass="!bg-dark-700 !text-white"
          preferredCountries={['br']}
          enableSearch={false}
          placeholder="(99) 9 9999-9999"
          autoFormat={true}
          masks={{br: '(..) . ....-....'}}
          preserveOrder={['preferredCountries']}
        />
      </div>

      <div className="space-y-2">
        <Label>
          CPF
        </Label>
        <Input
          value={userData.cpf}
          onChange={(e) =>
            setUserData({ ...userData, cpf: formatCPF(e.target.value) })
          }
          maxLength={14}
          className="bg-dark-700 border-zinc-700 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label>
          Data de Nascimento
        </Label>
        <div className="relative">
          <Input
            type="date"
            value={userData.birth_date}
            onChange={(e) =>
              setUserData({ ...userData, birth_date: e.target.value })
            }
            className={cn(
              "bg-dark-700 border-zinc-700 text-white",
              "[color-scheme:dark]",
              "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2"
            )}
          />
        </div>
      </div>
    </div>
  );
};
