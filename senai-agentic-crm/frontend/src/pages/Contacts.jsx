import { useEffect, useState } from "react";
import { getContacts } from "../services/api";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

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
        <h2 className="mb-0">Contacts</h2>
        <span className="badge bg-secondary">{contacts.length} total</span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {contacts.length === 0 ? (
            <p className="text-muted mb-0 p-4">No contacts found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Account Value</th>
                    <th>Churn Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
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
                      <td>
                        {contact.churn_risk_score != null
                          ? `${(contact.churn_risk_score * 100).toFixed(0)}%`
                          : "—"}
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
  );
}

export default Contacts;
