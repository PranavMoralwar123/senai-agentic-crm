import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ListToolbar from "../components/ListToolbar";
import { getActions } from "../services/api";
import { actionBadgeClass } from "../utils/badges";
import { filterBySearch, sortByField, uniqueValues } from "../utils/filters";
import { formatDate, formatRelative, truncate } from "../utils/format";

const SORT_OPTIONS = [
  { value: "timestamp-desc", label: "Newest first" },
  { value: "timestamp-asc", label: "Oldest first" },
  { value: "sender-asc", label: "Sender A–Z" },
  { value: "action_type-asc", label: "Action type" },
];

function Actions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [typeFilter, setTypeFilter] = useState("");
  const [sort, setSort] = useState("timestamp-desc");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadActions();
  }, []);

  useEffect(() => {
    const param = searchParams.get("search") || "";
    if (param) setSearch(param);
  }, [searchParams]);

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

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

  const actionTypes = useMemo(() => uniqueValues(actions, "action_type"), [actions]);

  const filtered = useMemo(() => {
    let result = filterBySearch(actions, search, ["sender", "action_type", "reasoning"]);
    if (typeFilter) {
      result = result.filter((a) => a.action_type === typeFilter);
    }
    const [field, direction] = sort.split("-");
    return sortByField(result, field, direction);
  }, [actions, search, typeFilter, sort]);

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Agent Actions</h2>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={loadActions}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <ListToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search sender, action, or reasoning…"
        filterValue={typeFilter}
        onFilterChange={setTypeFilter}
        filterOptions={actionTypes}
        filterLabel="Action type"
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        count={filtered.length}
      />

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {filtered.length === 0 ? (
            <p className="text-muted mb-0 p-4">
              {actions.length === 0
                ? "No agent actions recorded yet."
                : "No actions match your filters."}
            </p>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((action) => (
                    <Fragment key={action.id}>
                      <tr>
                        <td className="text-muted">#{action.id}</td>
                        <td>
                          <Link to={`/contacts?search=${encodeURIComponent(action.sender)}`}>
                            {action.sender}
                          </Link>
                        </td>
                        <td>
                          <span className={`badge ${actionBadgeClass(action.action_type)}`}>
                            {action.action_type}
                          </span>
                        </td>
                        <td className="text-truncate-cell" title={action.reasoning}>
                          {truncate(action.reasoning, 70)}
                        </td>
                        <td className="text-nowrap" title={formatDate(action.timestamp)}>
                          {formatRelative(action.timestamp)}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              setExpandedId((id) => (id === action.id ? null : action.id))
                            }
                          >
                            {expandedId === action.id ? "Hide" : "Details"}
                          </button>
                        </td>
                      </tr>
                      {expandedId === action.id && (
                        <tr>
                          <td colSpan={6} className="bg-light">
                            <strong>Full reasoning:</strong>
                            <p className="mb-1 mt-2">{action.reasoning}</p>
                            <small className="text-muted">
                              Recorded {formatDate(action.timestamp)}
                            </small>
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

export default Actions;
