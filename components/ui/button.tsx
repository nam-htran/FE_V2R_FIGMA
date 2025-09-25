import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// --- ĐÃ SỬA: Cập nhật style nền để đồng bộ với landing page ---
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-base font-semibold font-be-vietnam-pro ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // --- ĐÃ SỬA: Đổi `bg-primary` thành `bg-blue-900` để khớp chính xác ---
        default: "bg-blue-900 text-white hover:bg-blue-900/90",
        highlight: "bg-yellow-400 text-neutral-900 hover:bg-yellow-400/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        // --- ĐÃ SỬA: Đổi `bg-neutral-900` text-neutral-100 để khớp chính xác ---
        secondary: "bg-neutral-900 text-neutral-100 hover:bg-neutral-900/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // --- ĐÃ SỬA: Đặt padding mặc định giống hệt landing page ---
        default: 'h-auto px-8 py-4',
        sm: 'h-9 rounded-full px-4', // Giữ bo tròn cho size nhỏ
        lg: 'h-12 rounded-full px-8', // Giữ bo tròn cho size lớn
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }