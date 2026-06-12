import { useState } from "react";
import { Link } from "react-router-dom";
import { analyzeEmail, ingestEmail } from "../services/api";

const emptyForm = {
  sender: "",
  subject: "",
  body: "",
};

function NewInquiry() {
  const [form, setForm] = useState(emptyForm);
  const [runAgent, setRunAgent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);

    const payload = {
      message_id: crypto.randomUUID(),
      thread_id: crypto.randomUUID(),
      sender: form.sender.trim(),
      subject: form.subject.trim(),
      body: form.body.trim(),
    };

    try {
      const ingestRes = await ingestEmail(payload);
      let agentResult = null;

      if (runAgent) {
        const query = `${payload.subject}\n\n${payload.body}`;
        const analyzeRes = await analyzeEmail(payload.sender, query);
        agentResult = analyzeRes.data;
      }

      setResult({
        ingest: ingestRes.data,
        agent: agentResult,
      });
      setForm(emptyForm);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : "Failed to submit inquiry. Check that the backend is running."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="mb-1">New Customer Inquiry</h2>
          <p className="text-muted mb-4">
            Ingest a customer email to create a contact and optionally run the agent.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {result && (
            <div className="alert alert-success" role="alert">
              <strong>Email ingested successfully.</strong>
              {result.agent && (
                <div className="mt-3">
                  <div className="mb-2">
                    <span className="badge bg-primary me-2">
                      {result.agent.recommended_action}
                    </span>
                    <span className="text-muted">
                      Confidence: {(result.agent.confidence ).toFixed(0)}%
                    </span>
                  </div>
                  <p className="mb-2">
                    <strong>Reason:</strong> {result.agent.reason}
                  </p>
                  <p className="mb-0 response-text">
                    <strong>Draft response:</strong>
                    <br />
                    {result.agent.draft_response}
                  </p>
                </div>
              )}
              <div className="mt-3 d-flex gap-2 flex-wrap">
                <Link to="/actions" className="btn btn-sm btn-outline-success">
                  View Actions
                </Link>
                <Link to="/responses" className="btn btn-sm btn-outline-success">
                  View Responses
                </Link>
                <Link to="/contacts" className="btn btn-sm btn-outline-success">
                  View Contacts
                </Link>
              </div>
            </div>
          )}

          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="sender" className="form-label">
                    Sender Email
                  </label>
                  <input
                    id="sender"
                    type="email"
                    className="form-control"
                    value={form.sender}
                    onChange={updateField("sender")}
                    placeholder="customer@example.com"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="form-control"
                    value={form.subject}
                    onChange={updateField("subject")}
                    placeholder="Question about my subscription"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="body" className="form-label">
                    Message
                  </label>
                  <textarea
                    id="body"
                    className="form-control"
                    rows={6}
                    value={form.body}
                    onChange={updateField("body")}
                    placeholder="Write the customer message here..."
                    required
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    id="runAgent"
                    type="checkbox"
                    className="form-check-input"
                    checked={runAgent}
                    onChange={(e) => setRunAgent(e.target.checked)}
                  />
                  <label htmlFor="runAgent" className="form-check-label">
                    Run agent analysis (creates action &amp; response)
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewInquiry;
