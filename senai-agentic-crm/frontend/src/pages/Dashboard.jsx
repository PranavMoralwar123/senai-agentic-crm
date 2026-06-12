import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { getContacts, getActions, getResponses } from "../services/api";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function actionBadgeClass(actionType) {
  const type = (actionType || "").toLowerCase();
  if (type.includes("escalat")) return "bg-danger";
  if (type.includes("reply") || type.includes("respond")) return "bg-success";
  if (type.includes("follow")) return "bg-info text-dark";
  return "bg-secondary";
}

function Dashboard() {
  const [contacts, setContacts] = useState(0);
  const [actions, setActions] = useState(0);
  const [responses, setResponses] = useState(0);
  const [recentDecisions, setRecentDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [contactsRes, actionsRes, responsesRes] = await Promise.all([
        getContacts(),
        getActions(),
        getResponses(),
      ]);

      setContacts(contactsRes.data.length);
      setActions(actionsRes.data.length);
      setResponses(responsesRes.data.length);
      setRecentDecisions(actionsRes.data.slice(0, 8));
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard data. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Dashboard</h2>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={loadDashboard}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <StatCard title="Total Contacts" value={contacts} />
        </div>
        <div className="col-md-4">
          <StatCard title="Total Actions" value={actions} />
        </div>
        <div className="col-md-4">
          <StatCard title="Total Responses" value={responses} />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Recent Agent Decisions</h5>
        </div>
        <div className="card-body p-0">
          {recentDecisions.length === 0 ? (
            <p className="text-muted mb-0 p-4">No agent decisions recorded yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Sender</th>
                    <th>Action</th>
                    <th>Reasoning</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDecisions.map((decision) => (
                    <tr key={decision.id}>
                      <td>{decision.sender}</td>
                      <td>
                        <span className={`badge ${actionBadgeClass(decision.action_type)}`}>
                          {decision.action_type}
                        </span>
                      </td>
                      <td className="text-truncate-cell">{decision.reasoning}</td>
                      <td className="text-nowrap">{formatDate(decision.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
