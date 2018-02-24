import React, { Component } from "react";
import { Layout, Breadcrumb, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";

import { toName } from "@/utils";

const { Content } = Layout;

class AppContent extends Component {
  state = {
    breadcrumbs: [
      <Breadcrumb.Item key="home">
        <Link to="/">
          <Icon type="home" /> Home
        </Link>
      </Breadcrumb.Item>
    ]
  };
  componentWillMount() {
    const { path, params } = this.props.match;
    const segments = path.split("/");

    const breadcrumbSegments = segments
      .map(segment => {
        if (!segment) return segment;

        const bread = segment.match(/:([\w+]+)/);
        const name = bread && bread[1] ? params[bread[1]] : segment;
        return { name: toName(name), url: `${name}` };
      })
      .filter(breadcrumb => !!breadcrumb);

    const breadcrumbs = breadcrumbSegments.map(({ name }, idx) => {
      const index = idx + 1;
      const fullUrl = breadcrumbSegments
        .slice(0, index)
        .map(({url}) => url)
        .join("/");

      if (index === breadcrumbSegments.length) {
        return <Breadcrumb.Item key={name}>{name}</Breadcrumb.Item>;
      }

      return (
        <Breadcrumb.Item key={name}>
          <Link to={`/${fullUrl}`}> {name}</Link>
        </Breadcrumb.Item>
      );
    });

    this.setState({ breadcrumbs: [...this.state.breadcrumbs, ...breadcrumbs] });
  }

  render() {
    return (
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          {this.state.breadcrumbs}
        </Breadcrumb>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          {this.props.children}
        </div>
      </Content>
    );
  }
}

export default withRouter(AppContent);
