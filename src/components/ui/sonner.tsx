
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-dark-700 group-[.toaster]:text-white group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-dark-700",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          success: 
            "group-[.toaster]:bg-success-background group-[.toaster]:border-success-dark group-[.toaster]:text-success-DEFAULT",
          error: 
            "group-[.toaster]:bg-danger-background group-[.toaster]:border-danger-dark group-[.toaster]:text-danger-DEFAULT",
          warning: 
            "group-[.toaster]:bg-warning-background group-[.toaster]:border-warning-dark group-[.toaster]:text-warning-DEFAULT",
          info: 
            "group-[.toaster]:bg-info-background group-[.toaster]:border-info-dark group-[.toaster]:text-info-DEFAULT",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
