import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import AnalyticsCharts from "../components/AnalyticsCharts";
import RecentDecisionsTable from "../components/RecentDecisionsTable";
import { getContacts, getActions, getResponses, getEmails } from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({ contacts: 0, actions: 0, responses: 0, emails: 0 });
  const [actions, setActions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const [contactsRes, actionsRes, responsesRes, emailsRes] = await Promise.all([
        getContacts(),
        getActions(),
        getResponses(),
        getEmails(),
      ]);

      setContacts(contactsRes.data);
      setActions(actionsRes.data);
      setResponses(responsesRes.data);
      setEmails(emailsRes.data);
      setStats({
        contacts: contactsRes.data.length,
        actions: actionsRes.data.length,
        responses: responsesRes.data.length,
        emails: emailsRes.data.length,
      });
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
        <div className="d-flex gap-2">
          <Link to="/new" className="btn btn-primary btn-sm">
            + New Inquiry
          </Link>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={loadDashboard}>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard title="Total Contacts" value={stats.contacts} />
        </div>
        <div className="col-md-3">
          <StatCard title="Total Actions" value={stats.actions} />
        </div>
        <div className="col-md-3">
          <StatCard title="Total Responses" value={stats.responses} />
        </div>
        <div className="col-md-3">
          <StatCard title="Inbox Emails" value={stats.emails} />
        </div>
      </div>

      <AnalyticsCharts
        actions={actions}
        responses={responses}
        contacts={contacts}
        emails={emails}
      />

      <RecentDecisionsTable decisions={actions} limit={10} />
    </div>
  );
}

export default Dashboard;
