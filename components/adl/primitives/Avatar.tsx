import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { User as UserIcon } from "lucide-react";
import { cn } from "@/utils/cn";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-[var(--radius-full)] bg-surface items-center justify-center border border-border-subtle shadow-sm",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14",
        xl: "h-20 w-20",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
}

export function Avatar({ className, size, src, alt = "Avatar", fallback, ...props }: AvatarProps) {
  const [error, setError] = React.useState(false);

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {src && !error ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 40px, 80px"
          onError={() => setError(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-medium text-secondary">
          {fallback ? (
            fallback.substring(0, 2).toUpperCase()
          ) : (
            <UserIcon className="h-1/2 w-1/2 opacity-70" />
          )}
        </span>
      )}
    </div>
  );
}
