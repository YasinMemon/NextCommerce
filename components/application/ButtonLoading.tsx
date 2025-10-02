import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ButtonLoading({ type, text, isLoading, onClick, className, ...rest }: { type?: "button" | "submit" | "reset" | undefined, text?: string, isLoading: boolean, className?: string, onClick?: () => void }) {
  return (
    <Button 
    size="sm"
    disabled={isLoading} 
    type={type} 
    className={cn("", className)}
    onClick={onClick}
    {...rest}
    >
      {isLoading && <Loader2Icon className="animate-spin" />}
      {text}
    </Button>
  )
}
