import './PlaceholderPage.css'

// Shown on a route until that screen's pull request is merged
function PlaceholderPage({ title }) {
  return (
    <main className="placeholder-page">
      <h1 className="placeholder-page__title">{title}</h1>

      <p className="placeholder-page__hint">
        This screen is still being built.
      </p>
    </main>
  )
}

export default PlaceholderPage
