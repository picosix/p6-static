import React, { Component } from "react";
import { Layout } from "antd";

const { Footer } = Layout;

export default class AppFooter extends Component {
  render() {
    return (
      <Footer style={{ textAlign: "center" }}>
        PicoSix Static ©2018 Created by PicoSix Team
      </Footer>
    );
  }
}
