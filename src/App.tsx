import { Switch, BrowserRouter, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/:id" exact component={Room} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
