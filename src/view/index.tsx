import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
    Link, Routes, useNavigate, Navigate,
} from 'react-router-dom'
import './index.css';
import {Layout} from "./components/layout";
import {MetricsForm} from "./components/metrics_form";
import {NewBornDiagnose} from "./components/diagnose";
import {Login} from "./components/login";
import * as routes from "../api/routes";

function App() {
    const [userID, setUserID] = useState('')

    return (
      <BrowserRouter>
          <Routes>
              <Route
                  path={routes.RouteHome}
                  element={
                  <Layout
                      userID={userID}
                      setUserID={setUserID}
                  />
              }
              >
                  {/*<Route index element={<MetricsForm />} />*/}
                  <Route path={routes.RouteHomeMetricsForm} element={<MetricsForm />} />
                  <Route path={routes.RouteHomeNewBornDiagnose} element={<NewBornDiagnose />} />
              </Route>
              <Route
                  path={'/login'}
                  element={
                  <Login
                      userID={userID}
                      setUserID={setUserID}
                  />
              }>

              </Route>
              <Route path='*' element={<Navigate to={'/login'} />} />
          </Routes>
      </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
