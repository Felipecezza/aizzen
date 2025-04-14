
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import ProductImageUploader from "@/components/admin/ProductImageUploader";

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  description?: string;
}

interface ProductFormProps {
  product: Product | null;
  isSaving: boolean;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, isSaving, onSave, onCancel }: ProductFormProps) => {
  const form = useForm({
    defaultValues: {
      name: product?.name || "",
      image_url: product?.image_url || "",
      description: product?.description || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ProductImageUploader
                      imageUrl={field.value}
                      onImageUpload={(url) => field.onChange(url)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">
                    Nome do produto <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nome do produto"
                      className="bg-dark-700 border-zinc-800 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-400">Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição do produto"
                      className="bg-dark-700 border-zinc-800 text-white min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-zinc-700 text-white hover:bg-zinc-700"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-dark-700"
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-t-2 border-dark-700 rounded-full mr-2"></div>
                {product ? "Atualizando..." : "Salvando..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {product ? "Atualizar" : "Cadastrar Produto"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
