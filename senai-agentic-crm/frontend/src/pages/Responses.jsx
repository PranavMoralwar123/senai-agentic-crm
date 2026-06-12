import { Fragment, useEffect, useState } from "react";
import { getResponses } from "../services/api";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function Responses() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadResponses();
  }, []);

  const loadResponses = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getResponses();
      setResponses(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load generated responses.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((current) => (current === id ? null : id));
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
        <h2 className="mb-0">Generated Responses</h2>
        <span className="badge bg-secondary">{responses.length} total</span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {responses.length === 0 ? (
            <p className="text-muted mb-0 p-4">No generated responses yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Sender</th>
                    <th>Query</th>
                    <th>Action</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((item) => (
                    <Fragment key={item.id}>
                      <tr>
                        <td>{item.id}</td>
                        <td>{item.sender}</td>
                        <td className="text-truncate-cell">{item.query}</td>
                        <td>
                          <span className="badge bg-primary">{item.action}</span>
                        </td>
                        <td className="text-nowrap">{formatDate(item.created_at)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => toggleExpand(item.id)}
                          >
                            {expandedId === item.id ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      {expandedId === item.id && (
                        <tr>
                          <td colSpan={6} className="bg-light">
                            <strong>Response:</strong>
                            <p className="mb-0 mt-2 response-text">{item.response_text}</p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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

export default Responses;
