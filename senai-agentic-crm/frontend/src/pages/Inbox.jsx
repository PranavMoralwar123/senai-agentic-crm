import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ListToolbar from "../components/ListToolbar";
import { getEmails, getThread } from "../services/api";
import { categoryBadgeClass, urgencyBadgeClass } from "../utils/badges";
import { filterBySearch, sortByField, uniqueValues } from "../utils/filters";
import { formatDate, formatRelative, truncate } from "../utils/format";

const SORT_OPTIONS = [
  { value: "id-desc", label: "Newest first" },
  { value: "id-asc", label: "Oldest first" },
  { value: "sender-asc", label: "Sender A–Z" },
];

function Inbox() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [sort, setSort] = useState("id-desc");
  const [selectedId, setSelectedId] = useState(null);
  const [threadEmails, setThreadEmails] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);

  useEffect(() => {
    loadEmails();
  }, []);

  useEffect(() => {
    const param = searchParams.get("search") || "";
    if (param) setSearch(param);
  }, [searchParams]);

  const loadEmails = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getEmails();
      setEmails(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load inbox emails.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const categories = useMemo(() => uniqueValues(emails, "category"), [emails]);
  const urgencies = useMemo(() => uniqueValues(emails, "urgency"), [emails]);

  const filtered = useMemo(() => {
    let result = filterBySearch(emails, search, ["sender", "subject", "body", "category"]);
    if (categoryFilter) {
      result = result.filter((e) => e.category === categoryFilter);
    }
    if (urgencyFilter) {
      result = result.filter((e) => e.urgency === urgencyFilter);
    }
    const [field, direction] = sort.split("-");
    return sortByField(result, field, direction);
  }, [emails, search, categoryFilter, urgencyFilter, sort]);

  const selectedEmail = filtered.find((e) => e.id === selectedId) || emails.find((e) => e.id === selectedId);

  const openEmail = async (email) => {
    setSelectedId(email.id);
    setThreadEmails([]);
    setThreadLoading(true);

    try {
      if (email.thread_id) {
        const { data } = await getThread(email.thread_id);
        setThreadEmails(data);
      }
    } catch {
      setThreadEmails([email]);
    } finally {
      setThreadLoading(false);
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
        <h2 className="mb-0">Email Inbox</h2>
        <div className="d-flex gap-2">
          <Link to="/new" className="btn btn-primary btn-sm">
            + New Inquiry
          </Link>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={loadEmails}>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <ListToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search sender, subject, or body…"
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterOptions={categories}
        filterLabel="Category"
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        count={filtered.length}
      />

      <div className="mb-3">
        <select
          className="form-select form-select-sm w-auto d-inline-block"
          value={urgencyFilter}
          onChange={(e) => setUrgencyFilter(e.target.value)}
        >
          <option value="">Urgency: All</option>
          {urgencies.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="row g-3">
        <div className={selectedId ? "col-lg-5" : "col-12"}>
          <div className="card shadow-sm inbox-list">
            <div className="card-body p-0">
              {filtered.length === 0 ? (
                <p className="text-muted mb-0 p-4">
                  {emails.length === 0 ? (
                    <>
                      Inbox is empty.{" "}
                      <Link to="/new">Submit a customer inquiry</Link> to get started.
                    </>
                  ) : (
                    "No emails match your filters."
                  )}
                </p>
              ) : (
                <div className="list-group list-group-flush">
                  {filtered.map((email) => (
                    <button
                      key={email.id}
                      type="button"
                      className={`list-group-item list-group-item-action inbox-item text-start${
                        selectedId === email.id ? " active" : ""
                      }`}
                      onClick={() => openEmail(email)}
                    >
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <strong className="inbox-sender">{email.sender}</strong>
                        <small className="text-nowrap opacity-75">
                          {formatRelative(email.timestamp || email.id)}
                        </small>
                      </div>
                      <div className="inbox-subject fw-medium">{email.subject || "(No subject)"}</div>
                      <div className="inbox-preview text-muted small">
                        {truncate(email.body, 90)}
                      </div>
                      <div className="mt-2 d-flex gap-1 flex-wrap">
                        <span className={`badge ${categoryBadgeClass(email.category)}`}>
                          {email.category}
                        </span>
                        <span className={`badge ${urgencyBadgeClass(email.urgency)}`}>
                          {email.urgency}
                        </span>
                        {email.requires_human && (
                          <span className="badge bg-danger">Needs human</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedId && selectedEmail && (
          <div className="col-lg-7">
            <div className="card shadow-sm inbox-detail">
              <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">{selectedEmail.subject || "(No subject)"}</h5>
                    <div className="text-muted small">
                      From{" "}
                      <Link to={`/contacts?search=${encodeURIComponent(selectedEmail.sender)}`}>
                        {selectedEmail.sender}
                      </Link>
                      {" · "}
                      {formatDate(selectedEmail.timestamp)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedId(null)}
                  />
                </div>
              </div>
              <div className="card-body">
                <div className="mb-3 d-flex gap-2 flex-wrap">
                  <span className={`badge ${categoryBadgeClass(selectedEmail.category)}`}>
                    {selectedEmail.category}
                  </span>
                  <span className={`badge ${urgencyBadgeClass(selectedEmail.urgency)}`}>
                    {selectedEmail.urgency}
                  </span>
                  {selectedEmail.requires_human && (
                    <span className="badge bg-danger">Requires human review</span>
                  )}
                  <span className="badge bg-light text-dark border">
                    {selectedEmail.status || "Received"}
                  </span>
                </div>

                <div className="email-body response-text mb-4">{selectedEmail.body}</div>

                {threadLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </div>
                ) : threadEmails.length > 1 ? (
                  <div className="thread-section">
                    <h6>Thread ({threadEmails.length} messages)</h6>
                    {threadEmails.map((msg) => (
                      <div key={msg.id} className="thread-message border rounded p-3 mb-2 bg-light">
                        <div className="small text-muted mb-1">
                          {msg.sender} · {formatDate(msg.timestamp)}
                        </div>
                        <strong>{msg.subject}</strong>
                        <p className="mb-0 mt-2 small response-text">{msg.body}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="d-flex gap-2 flex-wrap">
                  <Link
                    to={`/responses?search=${encodeURIComponent(selectedEmail.sender)}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Responses
                  </Link>
                  <Link
                    to={`/actions?search=${encodeURIComponent(selectedEmail.sender)}`}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    View Actions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inbox;
