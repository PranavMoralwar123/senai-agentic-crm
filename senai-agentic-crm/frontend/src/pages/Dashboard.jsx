import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import api from "../services/api";

function Dashboard() {

  const [contacts, setContacts] = useState(0);
  const [actions, setActions] = useState(0);
  const [responses, setResponses] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const contactsRes = await api.get("/contacts/");
      const actionsRes = await api.get("/actions/");
      const responsesRes = await api.get("/responses/");

      setContacts(contactsRes.data.length);
      setActions(actionsRes.data.length);
      setResponses(responsesRes.data.length);

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Agentic CRM Dashboard
      </h2>

      <div className="row">

        <div className="col-md-4 mb-3">
          <StatCard
            title="Contacts"
            value={contacts}
          />
        </div>

        <div className="col-md-4 mb-3">
          <StatCard
            title="Actions"
            value={actions}
          />
        </div>

        <div className="col-md-4 mb-3">
          <StatCard
            title="Responses"
            value={responses}
          />
        </div>

      </div>

    </div>
  );
}

export default Dashboard;