import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import AppHeader from "@/components/Header";
import AppContent from "@/components/Content";
import AppFooter from "@/components/Footer";

import PageDashboard from "@/pages/Dashboard";
import PageImages from "@/pages/Images";

export default class LayoutApp extends Component {
  render() {
    return (
      <Layout className="layout">
        <AppHeader />

        <AppContent>
          <Switch>
            <Route exact path="/images/list" component={PageImages.List} />
            <Route path="/images/:id" component={PageImages.Detail} />
            <Route path="/images" component={PageImages.List} />
            <Route path="/dashboard" component={PageDashboard} />
          </Switch>
        </AppContent>

        <AppFooter />
      </Layout>
    );
  }
}
