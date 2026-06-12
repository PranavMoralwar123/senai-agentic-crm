import { useEffect, useState } from "react";
import { getActions } from "../services/api";

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

function Actions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getActions();
      setActions(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load agent actions.");
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
        <h2 className="mb-0">Agent Actions</h2>
        <span className="badge bg-secondary">{actions.length} total</span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {actions.length === 0 ? (
            <p className="text-muted mb-0 p-4">No agent actions recorded yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Sender</th>
                    <th>Action Type</th>
                    <th>Reasoning</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {actions.map((action) => (
                    <tr key={action.id}>
                      <td>{action.id}</td>
                      <td>{action.sender}</td>
                      <td>
                        <span className={`badge ${actionBadgeClass(action.action_type)}`}>
                          {action.action_type}
                        </span>
                      </td>
                      <td className="text-truncate-cell">{action.reasoning}</td>
                      <td className="text-nowrap">{formatDate(action.timestamp)}</td>
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

export default Actions;
