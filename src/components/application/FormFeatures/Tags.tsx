import { type KeyboardEvent, useState } from "react"

interface TagsProps {
  form: any
}

const MAX_TAGS = 5

export const Tags = ({ form }: TagsProps) => {
  const [draftTag, setDraftTag] = useState("")

  const normalizeTag = (value: string) => value.trim().toLowerCase()

  return (
    <div className="space-y-3">
      <form.Field name="details.tags">
        {(field: any) => {
          const tags: string[] = field.state.value ?? []

          const addTag = () => {
            const nextTag = normalizeTag(draftTag)
            if (!nextTag || tags.includes(nextTag) || tags.length >= MAX_TAGS) {
              return
            }
            field.handleChange([...tags, nextTag])
            setDraftTag("")
          }

          const removeTag = (tagToRemove: string) => {
            field.handleChange(tags.filter((tag) => tag !== tagToRemove))
          }

          const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== "Enter") return
            event.preventDefault()
            addTag()
          }

          const disableAdd = tags.length >= MAX_TAGS || normalizeTag(draftTag) === ""

          return (
            <>
              <div className="flex gap-2">
                <input
                  value={draftTag}
                  onChange={(e) => setDraftTag(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="e.g. frontend, remote, fintech"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px] text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={disableAdd}
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  Add
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Press Enter or click Add to add a tag ({tags.length}/{MAX_TAGS}).
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700 transition hover:bg-indigo-100"
                    >
                      {tag} x
                    </button>
                  ))}
                </div>
              )}
            </>
          )
        }}
      </form.Field>
    </div>
  )
}
