import './FloorsAndElevators.css'

function FloorsAndElevators({ floors, elevators }) {
  const sortedFloors = floors
    .slice()
    .sort((first, second) => first.number - second.number)

  function getElevatorNames(floor) {
    if (!Array.isArray(floor.elevatorIds)) {
      return 'Elevator coverage unknown'
    }
    if (floor.elevatorIds.length === 0) {
      return 'No serving elevators listed'
    }
    if (!Array.isArray(elevators)) {
      return 'Elevator coverage unknown'
    }

    const names = []
    for (const elevatorId of floor.elevatorIds) {
      const elevator = elevators.find((item) => item.id === elevatorId)
      if (!elevator) {
        return 'Elevator coverage unknown'
      }
      names.push(elevator.name)
    }

    let description = names.join(', ')
    if (names.length < elevators.length) {
      description += ' only'
    }
    return description
  }

  return (
    <section
      className="floors-elevators"
      aria-labelledby="floors-elevators-heading"
    >
      <h2 className="floors-elevators-heading" id="floors-elevators-heading">
        Floors and elevators
      </h2>
      {floors.length === 0 && <p>No floors have been documented yet.</p>}
      {floors.length > 0 && (
        <div
          className="floors-elevators-scroll"
          role="region"
          aria-label="Documented floor coverage"
          tabIndex={0}
        >
          <table className="floors-elevators-table">
            <caption className="floors-elevators-caption">
              Documented building information
            </caption>
            <thead>
              <tr>
                <th className="floors-elevators-cell" scope="col">
                  Floor
                </th>
                <th className="floors-elevators-cell" scope="col">
                  Description
                </th>
                <th className="floors-elevators-cell" scope="col">
                  Serving elevators
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedFloors.map((floor) => (
                <tr key={floor.locationId}>
                  <th
                    className="floors-elevators-cell floors-elevators-floor"
                    scope="row"
                  >
                    {floor.locationName}
                  </th>
                  <td className="floors-elevators-cell">
                    {floor.description || 'Not documented'}
                  </td>
                  <td className="floors-elevators-cell">
                    {getElevatorNames(floor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="floors-elevators-note">
        Documented floor coverage does not confirm that an elevator is currently
        working.
      </p>
    </section>
  )
}

export default FloorsAndElevators
