import React from "react";
import { getAuthentication } from "./components/login/functions";
import { useEffect } from "react";
import { propagate, sessionTrigger as t } from "./atoms";
import conf from "./util/config";
import { useRecoilState, useRecoilValue } from "recoil";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import { v4 } from "uuid";
import SdkDemo from "./pages/Documentation";
import DemoPage from "./pages/DemoPage";
import Enrichment from "./pages/Enrichment";
import { Store } from "n3";

export const StoreContext = React.createContext(new Store());

function App() {
  const [trigger, setTrigger] = useRecoilState(t);
  const config = useRecoilValue(conf);
  const [update, setUpdate] = useRecoilState(propagate);

  const pages = [
    { label: "home", path: "/demo", component: Home, props: {} },
    { label: "demo", path: "/demoJeroen", component: DemoPage, props: {} },
    {
      label: "documentation",
      path: "/documentation",
      component: SdkDemo,
      props: {},
    },
    {
      label: "enrichment",
      path: "/enrichment",
      component: Enrichment,
      props: {},
    },
  ];

  useEffect(() => {
    getAuthentication()
      .then(() => {
        setUpdate(v4());
      })
      .catch((error) => {
        console.log("error", error);
        // window.location = window.location.pathname
      });
  }, [trigger]);

  return (
    <div id={update}>
      <StoreContext.Provider value={new Store()}>
        <Header pages={pages} />
        <Routes>
          {pages.map((page) => {
            const Element = page.component;
            return (
              <Route
                key={page.label}
                exact
                path={page.path}
                element={<Element {...page.props} />}
              />
            );
          })}
        </Routes>
      </StoreContext.Provider>
    </div>
  );
}

export default App;
