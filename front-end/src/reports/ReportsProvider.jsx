import { useEffect, useRef, useState } from 'react'
import ReportsContext from './ReportsContext'
import validateReport from '../reporting/validateReport'
import validateUpdate from './validateUpdate'

function ReportsProvider({ children }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

  const mountedRef = useRef(false)
  const submittingRef = useRef(false)
  const photoUrlsRef = useRef([])

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false

      for (const url of photoUrlsRef.current) {
        URL.revokeObjectURL(url)
      }

      photoUrlsRef.current = []
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    async function loadReports() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/reports.json`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Could not load sample reports.')
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('The sample report data is invalid.')
        }

        if (!controller.signal.aborted) {
          setReports(data)
          setError('')
          setLoading(false)
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message)
          setLoading(false)
        }
      }
    }

    loadReports()

    return () => controller.abort()
  }, [loadAttempt])

  function retryLoad() {
    setLoading(true)
    setError('')
    setLoadAttempt((previous) => previous + 1)
  }

  async function submitReport(values, { forceFailure = false } = {}) {
    if (loading || error) {
      throw new Error('Reports are unavailable. Load the sample reports first.')
    }

    if (submittingRef.current) {
      throw new Error('A report submission is already in progress.')
    }

    const validationErrors = validateReport(values)

    if (Object.keys(validationErrors).length > 0) {
      throw new Error('Correct the report fields before submitting.')
    }

    if (
      values.location.locationType !== 'entrance' &&
      values.location.locationType !== 'floor'
    ) {
      throw new Error('Choose a valid entrance or floor.')
    }

    const buildingId = values.location.buildingId
    const locationId = values.location.locationId
    const locationType = values.location.locationType
    const category = values.category
    const description = values.description.trim()
    const observedAt = values.observedAt.toISOString()
    const photoFile = values.photo?.file ?? null

    submittingRef.current = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 700))

      if (!mountedRef.current) {
        throw new Error('The reporting session has ended.')
      }

      if (import.meta.env.DEV && forceFailure) {
        throw new Error('Simulated submission failure. Please try again.')
      }

      const id = crypto.randomUUID()
      const createdAt = new Date().toISOString()
      let photo = null

      if (photoFile) {
        const url = URL.createObjectURL(photoFile)
        photoUrlsRef.current.push(url)

        photo = {
          url,
          alt: 'Submitted barrier photo',
        }
      }

      const report = {
        id,
        buildingId,
        entranceId: locationType === 'entrance' ? locationId : null,
        floorId: locationType === 'floor' ? locationId : null,
        category,
        description,
        observedAt,
        createdAt,
        updatedAt: createdAt,
        photo,
        status: 'Active',
      }

      setReports((previous) => [report, ...previous])

      return report
    } finally {
      submittingRef.current = false
    }
  }

  async function submitUpdate(reportId, values, { forceFailure = false } = {}) {
    if (loading || error) {
      throw new Error('Reports are unavailable. Load the sample reports first.')
    }

    if (submittingRef.current) {
      throw new Error('A submission is already in progress.')
    }

    if (!reports.some((report) => report.id === reportId)) {
      throw new Error('This report is no longer available.')
    }

    const validationErrors = validateUpdate(values)

    if (Object.keys(validationErrors).length > 0) {
      throw new Error('Correct the update fields before posting.')
    }

    const choice = values.choice
    const note = values.note.trim()
    const photoFile = values.photo?.file
    submittingRef.current = true

    try {
      await new Promise((resolve) => setTimeout(resolve, 700))

      if (!mountedRef.current) {
        throw new Error('The reporting session has ended.')
      }

      if (import.meta.env.DEV && forceFailure) {
        throw new Error('Simulated update failure. Please try again.')
      }

      let photo = null

      if (photoFile) {
        const url = URL.createObjectURL(photoFile)
        photoUrlsRef.current.push(url)
        photo = { url, alt: 'Evidence attached to this update' }
      }

      const update = {
        id: crypto.randomUUID(),
        reportId,
        choice,
        note,
        createdAt: new Date().toISOString(),
        photo,
      }

      setReports((previous) =>
        previous.map((report) => {
          if (report.id === reportId) {
            let status = 'Active'

            if (choice === "It's cleared") {
              status = 'Resolved'
            }

            return {
              ...report,
              status,
              updatedAt: update.createdAt,
              updates: [...(report.updates || []), update],
            }
          }

          return report
        }),
      )

      return update
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <ReportsContext.Provider
      value={{
        reports,
        loading,
        error,
        retryLoad,
        submitReport,
        submitUpdate,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export default ReportsProvider
