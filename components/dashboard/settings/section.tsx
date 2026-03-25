"use client";

export function Section({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={15} color="var(--color-primary)" variant="Bold" />
          <p className="text-xs font-bold tracking-widest uppercase text-foreground">
            {title}
          </p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
