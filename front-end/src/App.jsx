import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import PlaceholderPage from './components/PlaceholderPage'

import Home from './home/Home'
import Search from './search/Search'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Home and search */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />

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
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
