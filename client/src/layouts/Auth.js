import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Layout, Col, Row, Card, Input, Icon, Button, Modal } from "antd";
import axios from "axios";

const QUERY_URL = `${process.env.REACT_APP_API_URL}/login`;

export default class LayoutApp extends Component {
  state = {
    username: "picosix",
    password: "static.picosix",
    token: ""
  };

  login = async () => {
    try {
      const { token } = (await axios.post(QUERY_URL, {
        username: this.state.username,
        password: this.state.password
      })).data;
      this.setState({ token });
    } catch (error) {
      Modal.error({
        title: "Error",
        content: "Invalid username or password."
      });
    }
  };

  render() {
    if (this.state.token || localStorage.getItem("token")) {
      if (this.state.token) localStorage.setItem("token", this.state.token);
      return <Redirect to="/" />;
    }

    return (
      <Layout style={{ height: "100%" }}>
        <Row
          style={{ height: "100%" }}
          type="flex"
          justify="space-around"
          align="middle"
        >
          <Col span={4}>
            <Card title="Login" style={{ width: 300, textAlign: "center" }}>
              <Input
                addonBefore={<Icon type="user" />}
                placeholder="Username"
                value={this.state.username}
                onPressEnter={this.login}
                style={{ marginBottom: 5 }}
                onChange={e => this.setState({ username: e.target.value })}
              />{" "}
              <Input
                type="password"
                addonBefore={<Icon type="unlock" />}
                placeholder="******"
                value={this.state.password}
                onPressEnter={this.login}
                style={{ marginBottom: 5 }}
                onChange={e => this.setState({ password: e.target.value })}
              />
              <Button type="primary" onClick={this.login}>
                Login
              </Button>
            </Card>
          </Col>
        </Row>
      </Layout>
    );
  }
}
