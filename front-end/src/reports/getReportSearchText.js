// All the words a report can be found by: its category, its description,
// and the names of its building and its entrance or floor
function getReportSearchText(report, locations) {
  let text = report.category + ' ' + report.description

  // Find the entrance or floor this report is about, and add its names
  for (const item of locations) {
    if (
      item.locationId === report.entranceId ||
      item.locationId === report.floorId
    ) {
      text = text + ' ' + item.buildingName + ' ' + item.locationName
    }
  }

  // Small letters, so "Kimmel" and "kimmel" both match
  return text.toLowerCase()
}

export default getReportSearchText
