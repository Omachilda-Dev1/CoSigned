import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container grid min-h-[60vh] place-items-center py-16 text-center">
      <div className="space-y-4">
        <p className="font-mono text-sm text-accent-ink">404</p>
        <h1 className="text-3xl font-bold">Nothing signed here</h1>
        <p className="text-fg-muted">That page, bond or address doesn&apos;t exist.</p>
        <div className="flex justify-center gap-2 pt-2">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/explore" variant="secondary">Explore bonds</ButtonLink>
        </div>
      </div>
    </div>
  );
}
