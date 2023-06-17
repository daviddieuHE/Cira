import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import Reports from "./pages/reports";
import Advertisements from "./pages/advertisements";
import Login from "./pages/login";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav className="border-b p-2">
            <ul className="flex flex-row gap-4">
              <li className="border rounded p-2">
                <Link to="/">Reports</Link>
              </li>
              <li className="border rounded p-2">
                <Link to="/advertisements">Advertisements</Link>
              </li>
            </ul>
          </nav>
        </div>

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/advertisements">
            <Advertisements />
          </Route>
          <Route path="/">
            <Reports />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
