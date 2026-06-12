import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { actionBadgeClass } from "../utils/badges";
import { formatDate, formatRelative, truncate } from "../utils/format";

function RecentDecisionsTable({ decisions, showViewAll = true, limit }) {
  const [expandedId, setExpandedId] = useState(null);
  const rows = limit ? decisions.slice(0, limit) : decisions;

  const toggleExpand = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Recent Agent Decisions</h5>
        {showViewAll && (
          <Link to="/actions" className="btn btn-sm btn-outline-primary">
            View all
          </Link>
        )}
      </div>
      <div className="card-body p-0">
        {rows.length === 0 ? (
          <p className="text-muted mb-0 p-4">No agent decisions recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Sender</th>
                  <th>Action</th>
                  <th>Reasoning</th>
                  <th>When</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((decision) => (
                  <Fragment key={decision.id}>
                    <tr>
                      <td className="text-muted">#{decision.id}</td>
                      <td>
                        <Link to={`/contacts?search=${encodeURIComponent(decision.sender)}`}>
                          {decision.sender}
                        </Link>
                      </td>
                      <td>
                        <span className={`badge ${actionBadgeClass(decision.action_type)}`}>
                          {decision.action_type}
                        </span>
                      </td>
                      <td className="text-truncate-cell" title={decision.reasoning}>
                        {truncate(decision.reasoning, 60)}
                      </td>
                      <td className="text-nowrap" title={formatDate(decision.timestamp)}>
                        {formatRelative(decision.timestamp)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => toggleExpand(decision.id)}
                        >
                          {expandedId === decision.id ? "Hide" : "Details"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === decision.id && (
                      <tr>
                        <td colSpan={6} className="bg-light">
                          <div className="row g-3 py-1">
                            <div className="col-md-4">
                              <strong>Action ID:</strong> {decision.id}
                            </div>
                            <div className="col-md-4">
                              <strong>Timestamp:</strong> {formatDate(decision.timestamp)}
                            </div>
                            <div className="col-md-4">
                              <strong>Sender:</strong> {decision.sender}
                            </div>
                            <div className="col-12">
                              <strong>Full reasoning:</strong>
                              <p className="mb-0 mt-1">{decision.reasoning}</p>
                            </div>
                          </div>
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
  );
}

export default RecentDecisionsTable;
