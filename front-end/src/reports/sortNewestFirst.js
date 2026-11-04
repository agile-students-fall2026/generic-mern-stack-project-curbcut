// Gives back a copy of the reports with the most recently updated one first.
// The original list is not changed.
function sortNewestFirst(reports) {
  const sortedReports = [...reports]

  // Compare two reports at a time: the one updated later goes first
  sortedReports.sort(
    (first, second) => new Date(second.updatedAt) - new Date(first.updatedAt),
  )

  return sortedReports
}

export default sortNewestFirst
