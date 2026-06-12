import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import NewInquiry from "./pages/NewInquiry";
import Inbox from "./pages/Inbox";
import Contacts from "./pages/Contacts";
import Actions from "./pages/Actions";
import Responses from "./pages/Responses";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewInquiry />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/actions" element={<Actions />} />
          <Route path="/responses" element={<Responses />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
