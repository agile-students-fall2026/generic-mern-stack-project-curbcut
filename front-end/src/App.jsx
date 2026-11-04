import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import PlaceholderPage from './components/PlaceholderPage'

import Home from './home/Home'
import Search from './search/Search'
import ReportRoute from './reporting/ReportRoute.jsx'
import ReportsProvider from './reports/ReportsProvider.jsx'

import {
  SupportedBuildingsRoute,
  BuildingDetailsRoute,
  EntranceDetailsRoute,
} from './buildings/BuildingRoutes'

function App() {
  return (
    <BrowserRouter>
      <ReportsProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />

          <Route path="/report" element={<ReportRoute />} />

          <Route path="/buildings" element={<SupportedBuildingsRoute />} />
          <Route
            path="/buildings/:buildingId"
            element={<BuildingDetailsRoute />}
          />
          <Route
            path="/buildings/:buildingId/entrances/:entranceId"
            element={<EntranceDetailsRoute />}
          />

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
      </ReportsProvider>
    </BrowserRouter>
  )
}

export default App
