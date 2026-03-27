import { createFileRoute } from "@tanstack/react-router"
import { LegalPageShell } from "@/components/legal/LegalPageShell"
import { TermsOfServiceContent } from "@/content/legal/TermsOfServiceContent"

export const Route = createFileRoute("/terms")({
  component: TermsPage,
})

function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service">
      <TermsOfServiceContent />
    </LegalPageShell>
  )
}
