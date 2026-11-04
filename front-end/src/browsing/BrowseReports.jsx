import { useState } from "react";
import './BrowseReports.css';

//Temporary mock data
const mockReports = [
    {
        id: 1,
        buildingId: "kimmel-center",
        entranceId: null,
        floorId: null,
        category: "Construction",
        description: "Construction work is being done on the 3rd floor of Bobst Library. Please use alternate routes.",
        observedAt: "2023-06-01T10:00:00Z",
        createdAt: "2023-06-01T10:00:00Z",
        updatedAt: "2023-06-01T10:00:00Z",
        photo: "https://picsum.photos/200/300",
        status: "Active"
    },
    {
        id: 2,
        buildingId: "bobst-library",
        entranceId: null,
        floorId: null,
        category: "Blocked Ramp",
        description: "Blocked ramp at Bobst Library. Please use alternate routes.",
        observedAt: "2023-06-01T10:00:00Z",
        createdAt: "2023-06-01T10:00:00Z",
        updatedAt: "2023-08-01T10:00:00Z",
        photo: "https://picsum.photos/200/300",
        status: "Closed"
    },
    {
        id: 3,
        buildingId: "silver-center",
        entranceId: null,
        floorId: null,
        category: "Door Issue",
        description: "Front door at Silver Center is stuck. Please use alternate routes.",
        observedAt: "2023-06-01T10:00:00Z",
        createdAt: "2023-06-01T10:00:00Z",
        updatedAt: "2023-06-01T10:00:00Z",
        photo: "https://picsum.photos/200/300",
        status: "Active"
    }
];
    
export default function BrowseReports() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const filteredReports = mockReports.filter(report => {
        const searchTerm = search.toLowerCase();
        const matchesSearch = report.category.toLowerCase().includes(searchTerm) || report.buildingId.toLowerCase().includes(searchTerm);
        const matchesStatus = status === "All" || report.status === status;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <main className="browse-reports">
            <h1>Browse Reports</h1>
        
            <input
                className="search-input"
                type="search"
                placeholder="Search by category or building"
                value={search}
                onChange={event => setSearch(event.target.value)}
            />
            <select
                className="status-filter"
                value={status}
                onChange={event => setStatus(event.target.value)}
                aria-label="Filter reports by status"
            >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
            </select>

            <section className="reports-list">
                {filteredReports.length === 0 ? (
                    <p>No reports found.</p>
                ) : (
                    filteredReports.map(report => (
                        <article className="report-card" key={report.id}>
                            {report.photo && <img src={report.photo} alt={`${report.category} report`} />}
                            <div className="report-details">
                                <span className="report-status">{report.status}</span>
                                <h2 className="report-title">{report.category}</h2>
                                <p className="report-buildingId">{report.buildingId}</p>
                                <p className="report-description">{report.description}</p>
                                <p className="report-observedAt">
                                    Observed {new Date(report.observedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </article>
                    ))
                )}
            </section>
        </main>
    );
}