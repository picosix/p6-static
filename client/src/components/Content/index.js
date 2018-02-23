import React, { Component } from "react";
import { Layout, Breadcrumb, Icon } from "antd";

const { Content } = Layout;

export default class AppContent extends Component {
  render() {
    return (
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Icon type="dashboard" /> Dashboard
          </Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          {this.props.children}
        </div>
      </Content>
    );
  }
}
