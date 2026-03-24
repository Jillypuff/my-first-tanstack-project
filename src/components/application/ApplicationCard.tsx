import { ChevronDown } from "lucide-react"
import ApplicationStatusBadge from "@/components/application/ApplicationStatusBadge"
import SectionLabel from "@/components/ui/SectionLabel"
import Tag from "@/components/ui/Tag"
import type { Application } from "@/schemas/application"

type ApplicationCardProps = {
  application: Application
  expanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDelete: () => void
}

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default function ApplicationCard({
  application,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
}: ApplicationCardProps) {
  const { details } = application
  const tagsPreview = details.tags.slice(0, 3)
  const hasMoreTags = details.tags.length > 3
  const visibleContacts = details.contacts.filter(
    (contact) => contact.name || contact.email || contact.phone || contact.note,
  )

  return (
    <article className="overflow-hidden bg-white">
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={onToggleExpand}
          className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
        >
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
          <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:items-center lg:gap-4">
            <div className="min-w-0 lg:col-span-1">
              <p className="truncate text-sm font-medium text-slate-900">{application.company_name}</p>
            </div>
            <div className="min-w-0 lg:col-span-1">
              <p className="truncate text-sm text-slate-700">{application.job_title}</p>
            </div>
            <div>
              <ApplicationStatusBadge status={application.status} />
            </div>
            <div className="min-w-0 lg:col-span-1">
              <div className="flex flex-wrap gap-1.5">
                {details.tags.length === 0 ? (
                  <span className="text-xs text-slate-400">No tags</span>
                ) : (
                  <>
                    {tagsPreview.map((tag) => (
                      <Tag key={`${application.id}-${tag}`} size="sm">
                        {tag}
                      </Tag>
                    ))}
                    {hasMoreTags && (
                      <span className="text-xs text-slate-500">+{details.tags.length - 3}</span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </button>
        <div className="flex shrink-0 items-center gap-2 border-l border-slate-100 px-3 py-3">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onEdit()
            }}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onDelete()
            }}
            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4 text-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <SectionLabel>Application</SectionLabel>
                <dl className="mt-2 space-y-1 text-slate-700">
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-slate-500">Status</dt>
                    <dd>
                      <ApplicationStatusBadge status={application.status} />
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-slate-500">Date applied</dt>
                    <dd>{new Date(application.date_applied).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              {details.notes.trim() ? (
                <div>
                  <SectionLabel>Notes</SectionLabel>
                  <p className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap text-slate-700">
                    {details.notes}
                  </p>
                </div>
              ) : null}

              {details.tags.length > 0 && (
                <div>
                  <SectionLabel>Tags</SectionLabel>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {details.tags.map((tag) => (
                      <Tag key={`${application.id}-full-${tag}`}>{tag}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {(details.company.info || details.company.location || details.company.homepage) && (
                <div>
                  <SectionLabel>Company</SectionLabel>
                  <dl className="mt-2 space-y-2 text-slate-700">
                    {details.company.location ? (
                      <div>
                        <dt className="text-slate-500">Location</dt>
                        <dd className="mt-0.5 whitespace-pre-wrap">{details.company.location}</dd>
                      </div>
                    ) : null}
                    {details.company.homepage ? (
                      <div>
                        <dt className="text-slate-500">Homepage</dt>
                        <dd className="mt-0.5">
                          <a
                            href={
                              details.company.homepage.startsWith("http")
                                ? details.company.homepage
                                : `https://${details.company.homepage}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-500"
                          >
                            {details.company.homepage}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                    {details.company.info ? (
                      <div>
                        <dt className="text-slate-500">Notes</dt>
                        <dd className="mt-0.5 whitespace-pre-wrap">{details.company.info}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {visibleContacts.length > 0 && (
                <div>
                  <SectionLabel>Contacts</SectionLabel>
                  <ul className="mt-2 space-y-3">
                    {visibleContacts.map((contact, index) => (
                      <li
                        key={`${application.id}-contact-${index}`}
                        className="rounded-lg border border-slate-200 bg-white p-3 text-slate-700"
                      >
                        {contact.name ? (
                          <p className="font-medium text-slate-900">{contact.name}</p>
                        ) : null}
                        <dl className="mt-1 space-y-0.5 text-xs sm:text-sm">
                          {contact.email ? (
                            <div>
                              <dt className="inline text-slate-500">Email: </dt>
                              <dd className="inline">
                                <a
                                  href={`mailto:${contact.email}`}
                                  className="text-indigo-600 hover:text-indigo-500"
                                >
                                  {contact.email}
                                </a>
                              </dd>
                            </div>
                          ) : null}
                          {contact.phone ? (
                            <div>
                              <dt className="inline text-slate-500">Phone: </dt>
                              <dd className="inline">{contact.phone}</dd>
                            </div>
                          ) : null}
                          {contact.note ? (
                            <div className="mt-1 whitespace-pre-wrap text-slate-600">{contact.note}</div>
                          ) : null}
                        </dl>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {details.job_criterias.length > 0 && (
                <div>
                  <SectionLabel>Job criteria</SectionLabel>
                  <ul className="mt-2 space-y-2">
                    {details.job_criterias.map((criteria, index) => (
                      <li
                        key={`${application.id}-criteria-${index}`}
                        className="flex items-start justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
                      >
                        <span className="text-slate-800">{criteria.title}</span>
                        <span className="shrink-0 text-xs text-slate-500">
                          {criteria.track ? "Tracking" : "Not tracking"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3 text-xs text-slate-500">
            <p>Created {formatDateTime(application.created_at)}</p>
            <p className="mt-0.5">Updated {formatDateTime(application.updated_at)}</p>
            <p className="mt-0.5">Last activity {formatDateTime(application.last_activity_at)}</p>
          </div>
        </div>
      )}
    </article>
  )
}
