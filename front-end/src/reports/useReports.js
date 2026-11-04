import { useContext } from 'react'
import ReportsContext from './ReportsContext'

function useReports() {
  const context = useContext(ReportsContext)

  if (context === null) {
    throw new Error('useReports must be used inside ReportsProvider.')
  }

  return context
}

export default useReports
