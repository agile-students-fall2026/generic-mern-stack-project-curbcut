import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import PlaceholderPage from './components/PlaceholderPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home and search */}
        <Route path="/" element={<PlaceholderPage title="Home" />} />
        <Route path="/search" element={<PlaceholderPage title="Search" />} />

        {/* Reporting */}
        <Route
          path="/report"
          element={<PlaceholderPage title="Report a barrier" />}
        />

        {/* Buildings and entrances */}
        <Route
          path="/buildings"
          element={<PlaceholderPage title="Supported buildings" />}
        />
        <Route
          path="/buildings/:buildingId"
          element={<PlaceholderPage title="Building details" />}
        />
        <Route
          path="/buildings/:buildingId/entrances/:entranceId"
          element={<PlaceholderPage title="Entrance details" />}
        />

        {/* Reports and about */}
        <Route
          path="/browse"
          element={<PlaceholderPage title="Browse reports" />}
        />
        <Route
          path="/reports/:reportId"
          element={<PlaceholderPage title="Report details" />}
        />
        <Route
          path="/about"
          element={<PlaceholderPage title="About CurbCut" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
