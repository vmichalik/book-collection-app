import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40',
          {
            'bg-foreground text-background hover:bg-foreground/90': variant === 'default',
            'border border-border bg-transparent hover:bg-muted': variant === 'outline',
            'bg-transparent hover:bg-muted': variant === 'ghost',
            'bg-destructive text-white hover:bg-destructive/90': variant === 'destructive',
          },
          {
            'h-9 px-4 text-xs rounded-md': size === 'default',
            'h-7 px-3 text-[11px] rounded-md': size === 'sm',
            'h-8 w-8 rounded-md': size === 'icon',
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
