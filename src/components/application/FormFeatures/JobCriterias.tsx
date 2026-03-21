import { useState } from "react"

interface JobCriteria {
  title: string
  track: boolean
}

interface JobCriteriasProps {
  form: any
}

const MAX_CRITERIAS = 5

export const JobCriterias = ({ form }: JobCriteriasProps) => {
  const [draftCriteria, setDraftCriteria] = useState("")

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Add requirements from the job listing. Enable "Track" for skills you want
        to practice.
      </p>

      <form.Field name="details.job_criterias">
        {(field: any) => {
          const criterias: JobCriteria[] = field.state.value ?? []

          const addCriteria = () => {
            const nextTitle = draftCriteria.trim()
            if (
              !nextTitle ||
              criterias.length >= MAX_CRITERIAS ||
              criterias.some(
                (criterion) =>
                  criterion.title.toLowerCase() === nextTitle.toLowerCase(),
              )
            ) {
              return
            }

            field.handleChange([...criterias, { title: nextTitle, track: false }])
            setDraftCriteria("")
          }

          const toggleTrack = (index: number) => {
            field.handleChange(
              criterias.map((criterion, currentIndex) =>
                currentIndex === index
                  ? { ...criterion, track: !criterion.track }
                  : criterion,
              ),
            )
          }

          const removeCriteria = (index: number) => {
            field.handleChange(
              criterias.filter((_, currentIndex) => currentIndex !== index),
            )
          }

          const canAdd = draftCriteria.trim() !== "" && criterias.length < MAX_CRITERIAS

          return (
            <>
              <div className="space-y-2">
                {criterias.map((criterion, index) => (
                  <div
                    key={`${criterion.title}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <input
                        type="checkbox"
                        checked={criterion.track}
                        onChange={() => toggleTrack(index)}
                        className="h-4 w-4 accent-emerald-600"
                      />
                      Track
                    </label>
                    <p className="flex-1 text-sm text-slate-700">{criterion.title}</p>
                    <button
                      type="button"
                      onClick={() => removeCriteria(index)}
                      className="rounded-lg px-2 py-1 text-slate-400 transition hover:text-slate-600"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={draftCriteria}
                  onChange={(e) => setDraftCriteria(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return
                    e.preventDefault()
                    addCriteria()
                  }}
                  placeholder="Add criteria..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
                <button
                  type="button"
                  onClick={addCriteria}
                  disabled={!canAdd}
                  className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  Add
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Up to {MAX_CRITERIAS} criteria ({criterias.length}/{MAX_CRITERIAS}).
              </p>
            </>
          )
        }}
      </form.Field>
    </div>
  )
}
