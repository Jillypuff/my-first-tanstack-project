import { createFileRoute } from "@tanstack/react-router"
import { useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute("/facts")({
  validateSearch: (value) => ({
    maxFactLength: Number(value.maxFactLength) || 30,
  }),
  loaderDeps: ({ search: { maxFactLength } }) => ({ maxFactLength }),
  loader: async ({ deps: { maxFactLength } }) => {
    const res = await fetch(
      `https://catfact.ninja/fact?max_length=${maxFactLength}`,
    )
    return res.json()
  },
  component: facts,
})

export function facts() {
  const { fullPath, useLoaderData } = Route
  const navigate = useNavigate({ from: fullPath })
  const data = useLoaderData()

  const handleOnClick = (isLong: boolean = false) => {
    navigate({
      search: () => ({
        maxFactLength: isLong ? 500 : 30,
      }),
    })
  }

  return (
    <main>
      <div className="fact-container">
        <h1>Random Cat Fact</h1>
        <p>{data.fact}</p>

        <div className="button-wrapper">
          <button type="button" onClick={() => handleOnClick()}>
            Another Fact
          </button>
          <button type="button" onClick={() => handleOnClick(true)}>
            Long Fact
          </button>
        </div>
      </div>
    </main>
  )
}
