import {Route,Switch} from 'react-router-dom'
import './App.less';
import 'antd/dist/antd.css';

import './App.css'
import Login from "./containers/Login/Login";
import Dashboard from "@/containers/Dashboard/Dashboard";

function App() {
  return (
    <div className="App">
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/admin" component={Dashboard}/>
            <Route path="/customer" component={Dashboard}/>
            {/*<Route path="/404" component={Dashboard}/>*/}
            {/*<Route path="/error" component={Dashboard}/>*/}
            <Route component={Login}/>
        </Switch>
    </div>
  );
}

export default App;
