import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { Layout } from "antd";

import Wrapper from "@/components/Wrapper";
import AppHeader from "@/components/Header";
import AppContent from "@/components/Content";
import AppFooter from "@/components/Footer";

import PageDashboard from "@/pages/Dashboard";
import PageImages from "@/pages/Images";

const renderPageContent = comp => () => {
  const Page = withRouter(comp);
  return (
    <Wrapper>
      <AppHeader />
      <AppContent>
        <Page />
      </AppContent>
      <AppFooter />
    </Wrapper>
  );
};

export default class LayoutApp extends Component {
  render() {
    return (
      <Layout className="layout">
        <Switch>
          <Route
            exact
            path="/images/list"
            component={renderPageContent(PageImages.List)}
          />
          <Route
            path="/images/:id"
            component={renderPageContent(PageImages.Detail)}
          />
          <Route
            path="/images"
            component={renderPageContent(PageImages.List)}
          />
          <Route
            path="/dashboard"
            component={renderPageContent(PageDashboard)}
          />
        </Switch>
      </Layout>
    );
  }
}
