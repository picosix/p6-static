import React, { PureComponent } from "react";
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";

import LayoutApp from "@/layouts/App";
import LayoutAuth from "@/layouts/Auth";

export default class Router extends PureComponent {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/auth" component={LayoutAuth} />
          <Route exact path="/" render={() => <Redirect to="/dashboard" />} />
          <Route path="/" component={LayoutApp} />

          <Route exact path="*" render={() => <Redirect to="/auth" />} />
        </Switch>
      </BrowserRouter>
    );
  }
}
