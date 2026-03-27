import { createFileRoute } from "@tanstack/react-router"
import { LegalPageShell } from "@/components/legal/LegalPageShell"
import { PrivacyPolicyContent } from "@/content/legal/PrivacyPolicyContent"

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <PrivacyPolicyContent />
    </LegalPageShell>
  )
}
