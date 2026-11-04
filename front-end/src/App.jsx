import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import PlaceholderPage from './components/PlaceholderPage'

import Home from './home/Home'
import Search from './search/Search'

import ReportRoute from './reporting/ReportRoute'
import ReportsProvider from './reports/ReportsProvider'

import SupportedBuildingsPage from './pages/SupportedBuildingsPage'
import BuildingDetailsPage from './pages/BuildingDetailsPage'
import EntranceDetailsPage from './pages/EntranceDetailsPage'

function App() {
  return (
    // Shares Abdullah's report list with every screen (#65)
    <ReportsProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Home and search */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />

          {/* Reporting */}
          <Route path="/report" element={<ReportRoute />} />

          {/* Buildings and entrances */}
          <Route path="/buildings" element={<SupportedBuildingsPage />} />
          <Route
            path="/buildings/:buildingId"
            element={<BuildingDetailsPage />}
          />
          <Route
            path="/buildings/:buildingId/entrances/:entranceId"
            element={<EntranceDetailsPage />}
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
    </ReportsProvider>
  )
}

export default App
