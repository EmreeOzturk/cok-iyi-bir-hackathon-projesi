import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        subtle:
          "border-transparent bg-foreground/10 text-foreground dark:bg-foreground/20",
        outline: "border-dashed border-foreground/40 text-foreground",
        success: "border-transparent bg-emerald-500/15 text-emerald-600",
        warning: "border-transparent bg-amber-500/20 text-amber-700",
      },
    },
    defaultVariants: {
      variant: "subtle",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);

export { badgeVariants };

