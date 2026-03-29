import { cn } from "@/lib/utils";
import { getServiceIcon, isLightHex } from "@/lib/service-icons";

interface ServiceIconProps {
  name: string;
  iconColor?: string;
  iconInitial: string;
  className?: string;
  initialClassName?: string;
}

export function ServiceIcon({
  name,
  iconColor,
  iconInitial,
  className,
  initialClassName,
}: ServiceIconProps) {
  const brand = getServiceIcon(name);
  const bg = brand ? `#${brand.hex}` : iconColor;
  const iconFg = brand
    ? isLightHex(brand.hex)
      ? "#000000"
      : "#ffffff"
    : "#ffffff";

  return (
    <div
      className={cn("flex items-center justify-center shrink-0", className)}
      style={{ backgroundColor: bg }}
    >
      {brand ? (
        <svg
          viewBox="0 0 24 24"
          fill={iconFg}
          className="w-1/2 h-1/2"
          aria-hidden
        >
          <path d={brand.path} />
        </svg>
      ) : (
        <span className={cn("text-white font-bold", initialClassName)}>
          {iconInitial}
        </span>
      )}
    </div>
  );
}
