import { Button } from "@/components/ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-12">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="inverted">Inverted</Button>
        <Button variant="outlined">Outlined</Button>
        <Button variant="tertiary" size="icon" aria-label="Edit">
          ✏
        </Button>
        <Button variant="primary" size="pill" icon={<span>✏</span>}>
          Label
        </Button>
      </div>
    </main>
  );
}
