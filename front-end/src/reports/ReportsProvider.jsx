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
  const reportVersionRef = useRef(0)
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
      const versionAtStart = reportVersionRef.current
      try {
        const response = await fetch('/api/reports', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Could not load sample reports.')
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('The sample report data is invalid.')
        }

        if (!controller.signal.aborted) {
          if (reportVersionRef.current === versionAtStart) {
            setReports(data)
          }
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
      const validationError = new Error('Check the highlighted fields.')
      validationError.fieldErrors = validationErrors
      throw validationError
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
      if (import.meta.env.DEV && forceFailure) {
        throw new Error('Simulated submission failure. Please try again.')
      }

      const fields = {
        buildingId,
        [locationType === 'entrance' ? 'entranceId' : 'floorId']: locationId,
        category,
        description,
        observedAt,
      }

      const options = { method: 'POST' }

      if (photoFile) {
        const body = new FormData()
        for (const [name, value] of Object.entries(fields)) {
          body.append(name, value)
        }
        body.append('photo', photoFile)
        options.body = body
      } else {
        options.headers = { 'Content-Type': 'application/json' }
        options.body = JSON.stringify(fields)
      }

      const response = await fetch('/api/reports', options)

      if (response.status !== 201) {
        const data = await response.json().catch(() => null)
        const submitError = new Error(
          'Could not submit the report. Please try again.',
        )
        if (data?.errors) {
          submitError.fieldErrors = data.errors
        }
        throw submitError
      }

      const report = await response.json()

      if (!mountedRef.current) {
        throw new Error('The reporting session has ended.')
      }

      reportVersionRef.current += 1
      setReports((previous) => [
        report,
        ...previous.filter((item) => item.id !== report.id),
      ])

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
      reportVersionRef.current += 1
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
        refreshReports: retryLoad,
        submitReport,
        submitUpdate,
      }}
    >
      {children}
    </ReportsContext.Provider>
  )
}

export default ReportsProvider
