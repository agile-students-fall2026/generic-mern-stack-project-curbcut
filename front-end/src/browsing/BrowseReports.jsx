import { useState } from "react";
import './BrowseReports.css';

//Temporary mock data
const mockReports = [
    {
        i: 1,
        title: "Construction",
        location: "Bobst Library",
        description: "Construction work is being done on the 3rd floor of Bobst Library. Please use alternate routes.",
        status: "Active",
        image: "https://picsum.photos/200/300"
    },
    {
        i: 1,
        title: "Construction",
        location: "Bobst Library",
        description: "Construction work is being done on the 3rd floor of Bobst Library. Please use alternate routes.",
        status: "Active",
        image: "https://picsum.photos/200/300"
    },
    {
        i: 1,
        title: "Construction",
        location: "Bobst Library",
        description: "Construction work is being done on the 3rd floor of Bobst Library. Please use alternate routes.",
        status: "Active",
        image: "https://picsum.photos/200/300"
    }
];
    
export default function BrowseReports() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const filteredReports = mockReports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase()) || report.location.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "All" || report.status === status;
        
        return matchesSearch && matchesStatus;
    });
}

return (
    <main className = "browse-reports">
        <h1>Browse Reports</h1>
        
        <input className = "search-input"
        type = "search"
        placeholder = "Search by title or location"
        value = {search}
        onChange={(e) => setSearch(e.target.value)}
        />

        <section className = "reports-list">
            {filteredReports.length === 0 ? (
                <p>No reports found.</p>
            ) : (
                filteredReports.map((report, index) => (
                    <article className="report-card" key={report.id}>
                        <img src={report.image} alt="" />
                        <div className = "report-details">
                            <span className = "report-status">{report.status}</span>
                            <h2 className = "report-title">{report.title}</h2>
                            <p className = "report-location">{report.location}</p>
                            <p className = "report-description">{report.description}</p>
                        </div>
                    </article>
                ))
            )}
        </section>
    </main>
)