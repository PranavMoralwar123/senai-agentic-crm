import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ListToolbar from "../components/ListToolbar";
import { createContact, getContact, getContacts } from "../services/api";
import { churnRiskClass } from "../utils/badges";
import { filterBySearch, sortByField } from "../utils/filters";

const emptyContact = {
  email: "",
  name: "",
  company: "",
  status: "Active",
  account_value: "",
  churn_risk_score: "",
};

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "account_value-desc", label: "Highest value" },
  { value: "churn_risk_score-desc", label: "Highest churn risk" },
  { value: "email-asc", label: "Email A–Z" },
];

function Contacts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyContact);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("name-asc");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const param = searchParams.get("search") || "";
    if (param) setSearch(param);
  }, [searchParams]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getContacts();
      setContacts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const payload = {
      email: form.email.trim(),
      name: form.name.trim() || null,
      company: form.company.trim() || null,
      status: form.status,
      account_value: form.account_value === "" ? 0 : Number(form.account_value),
      churn_risk_score:
        form.churn_risk_score === "" ? 0 : Number(form.churn_risk_score),
    };

    try {
      await createContact(payload);
      setForm(emptyContact);
      setShowForm(false);
      await loadContacts();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === "string" ? detail : "Failed to create contact.");
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = async (email) => {
    if (selectedEmail === email) {
      setSelectedEmail(null);
      setSelectedContact(null);
      return;
    }

    setSelectedEmail(email);
    setDetailLoading(true);

    try {
      const { data } = await getContact(email);
      setSelectedContact(data);
    } catch {
      setSelectedContact(contacts.find((c) => c.email === email) || null);
    } finally {
      setDetailLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = filterBySearch(contacts, search, ["name", "email", "company"]);
    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }
    const [field, direction] = sort.split("-");
    return sortByField(result, field, direction);
  }, [contacts, search, statusFilter, sort]);

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
        <h2 className="mb-0">Contacts</h2>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setShowForm((v) => !v);
            setFormError(null);
          }}
        >
          {showForm ? "Cancel" : "+ Add Contact"}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card shadow-sm mb-3">
          <div className="card-header bg-white">
            <h5 className="mb-0">New Contact</h5>
          </div>
          <div className="card-body">
            {formError && (
              <div className="alert alert-danger py-2" role="alert">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={updateField("email")}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={updateField("name")}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="company" className="form-label">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    className="form-control"
                    value={form.company}
                    onChange={updateField("company")}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    className="form-select"
                    value={form.status}
                    onChange={updateField("status")}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="account_value" className="form-label">
                    Account Value ($)
                  </label>
                  <input
                    id="account_value"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    value={form.account_value}
                    onChange={updateField("account_value")}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="churn_risk_score" className="form-label">
                    Churn Risk (0–1)
                  </label>
                  <input
                    id="churn_risk_score"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    className="form-control"
                    value={form.churn_risk_score}
                    onChange={updateField("churn_risk_score")}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={submitting}>
                {submitting ? "Saving..." : "Save Contact"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ListToolbar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search name, email, or company…"
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={["Active", "Inactive"]}
        filterLabel="Status"
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        count={filtered.length}
      />

      <div className="row g-3">
        <div className={selectedEmail ? "col-lg-7" : "col-12"}>
          <div className="card shadow-sm">
            <div className="card-body p-0">
              {filtered.length === 0 ? (
                <p className="text-muted mb-0 p-4">
                  No contacts found. Add one manually or submit a{" "}
                  <Link to="/new">customer inquiry</Link>.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Value</th>
                        <th>Churn Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((contact) => (
                        <tr
                          key={contact.id}
                          className={selectedEmail === contact.email ? "table-active" : ""}
                          style={{ cursor: "pointer" }}
                          onClick={() => openDetail(contact.email)}
                        >
                          <td>{contact.name || "—"}</td>
                          <td>{contact.email}</td>
                          <td>{contact.company || "—"}</td>
                          <td>
                            <span
                              className={`badge ${
                                contact.status === "Active" ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {contact.status}
                            </span>
                          </td>
                          <td>
                            {contact.account_value != null
                              ? `$${Number(contact.account_value).toLocaleString()}`
                              : "—"}
                          </td>
                          <td style={{ minWidth: 120 }}>
                            {contact.churn_risk_score != null ? (
                              <div>
                                <div className="progress progress-thin">
                                  <div
                                    className={`progress-bar ${churnRiskClass(contact.churn_risk_score)}`}
                                    style={{
                                      width: `${Math.min(contact.churn_risk_score * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                                <small className="text-muted">
                                  {(contact.churn_risk_score * 100).toFixed(0)}%
                                </small>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedEmail && (
          <div className="col-lg-5">
            <div className="card shadow-sm contact-detail-card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Contact Detail</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => {
                    setSelectedEmail(null);
                    setSelectedContact(null);
                  }}
                />
              </div>
              <div className="card-body">
                {detailLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" />
                  </div>
                ) : selectedContact ? (
                  <>
                    <h5>{selectedContact.name || selectedContact.email}</h5>
                    <p className="text-muted mb-3">{selectedContact.email}</p>
                    <dl className="row mb-0">
                      <dt className="col-sm-5">Company</dt>
                      <dd className="col-sm-7">{selectedContact.company || "—"}</dd>
                      <dt className="col-sm-5">Status</dt>
                      <dd className="col-sm-7">
                        <span
                          className={`badge ${
                            selectedContact.status === "Active" ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {selectedContact.status}
                        </span>
                      </dd>
                      <dt className="col-sm-5">Account Value</dt>
                      <dd className="col-sm-7">
                        ${Number(selectedContact.account_value || 0).toLocaleString()}
                      </dd>
                      <dt className="col-sm-5">Churn Risk</dt>
                      <dd className="col-sm-7">
                        {((selectedContact.churn_risk_score || 0) * 100).toFixed(0)}%
                      </dd>
                    </dl>
                    <div className="mt-3 d-flex gap-2 flex-wrap">
                      <Link
                        to={`/inbox?search=${encodeURIComponent(selectedContact.email)}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Inbox
                      </Link>
                      <Link
                        to={`/actions?search=${encodeURIComponent(selectedContact.email)}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        View Actions
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="text-muted mb-0">Contact not found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contacts;
