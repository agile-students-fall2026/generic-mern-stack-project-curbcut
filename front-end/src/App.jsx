import ReportForm from './reporting/ReportForm.jsx'
import ReportsProvider from './reports/ReportsProvider.jsx'

function App() {
  return (
    <ReportsProvider>
      <ReportForm />
    </ReportsProvider>
  )
}

export default App
