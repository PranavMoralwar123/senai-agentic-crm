import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ListToolbar from "../components/ListToolbar";
import { getResponses } from "../services/api";
import { actionBadgeClass } from "../utils/badges";
import { filterBySearch, sortByField, uniqueValues } from "../utils/filters";
import { formatDate, formatRelative, truncate } from "../utils/format";

const SORT_OPTIONS = [
  { value: "created_at-desc", label: "Newest first" },
  { value: "created_at-asc", label: "Oldest first" },
  { value: "sender-asc", label: "Sender A–Z" },
];

function Responses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [actionFilter, setActionFilter] = useState("");
  const [sort, setSort] = useState("created_at-desc");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadResponses();
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

  const actionTypes = useMemo(() => uniqueValues(responses, "action"), [responses]);

  const filtered = useMemo(() => {
    let result = filterBySearch(responses, search, [
      "sender",
      "query",
      "action",
      "response_text",
    ]);
    if (actionFilter) {
      result = result.filter((r) => r.action === actionFilter);
    }
    const [field, direction] = sort.split("-");
    return sortByField(result, field, direction);
  }, [responses, search, actionFilter, sort]);

  const copyResponse = async (item) => {
    try {
      await navigator.clipboard.writeText(item.response_text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* clipboard unavailable */
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Generated Responses</h2>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={loadResponses}>
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
        searchPlaceholder="Search sender, query, or response…"
        filterValue={actionFilter}
        onFilterChange={setActionFilter}
        filterOptions={actionTypes}
        filterLabel="Action"
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        count={filtered.length}
      />

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {filtered.length === 0 ? (
            <p className="text-muted mb-0 p-4">
              {responses.length === 0
                ? "No generated responses yet."
                : "No responses match your filters."}
            </p>
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
                  {filtered.map((item) => (
                    <Fragment key={item.id}>
                      <tr>
                        <td className="text-muted">#{item.id}</td>
                        <td>
                          <Link to={`/contacts?search=${encodeURIComponent(item.sender)}`}>
                            {item.sender}
                          </Link>
                        </td>
                        <td className="text-truncate-cell" title={item.query}>
                          {truncate(item.query, 60)}
                        </td>
                        <td>
                          <span className={`badge ${actionBadgeClass(item.action)}`}>
                            {item.action}
                          </span>
                        </td>
                        <td className="text-nowrap" title={formatDate(item.created_at)}>
                          {formatRelative(item.created_at)}
                        </td>
                        <td className="text-nowrap">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary me-1"
                            onClick={() =>
                              setExpandedId((id) => (id === item.id ? null : item.id))
                            }
                          >
                            {expandedId === item.id ? "Hide" : "View"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => copyResponse(item)}
                          >
                            {copiedId === item.id ? "Copied!" : "Copy"}
                          </button>
                        </td>
                      </tr>
                      {expandedId === item.id && (
                        <tr>
                          <td colSpan={6} className="bg-light">
                            <div className="mb-3">
                              <strong>Customer query:</strong>
                              <p className="mb-0 mt-1 response-text">{item.query}</p>
                            </div>
                            <div>
                              <strong>Generated response:</strong>
                              <p className="mb-0 mt-1 response-text">{item.response_text}</p>
                            </div>
                            <small className="text-muted d-block mt-2">
                              Created {formatDate(item.created_at)}
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

export default Responses;
