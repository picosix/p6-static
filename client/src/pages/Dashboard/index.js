import React, { Component } from "react";
import { Card, Col, Row } from "antd";
import axios from "axios";

const QUERY_URL = `${process.env.REACT_APP_API_URL}/statictis`;
const statictisCardStyles = {
  width: "100%",
  textAlign: "center",
  height: 120,
  fontWeight: 800,
  fontSize: 16,
  color: 'white'
};
const statictisCardBodyStyles = { height: "100%" };
const statictisCardRowStyles = {
  height: "100%",
  display: "flex",
  "align-items": "center",
  "justify-content": "center"
};

export default class PageDashboard extends Component {
  state = {
    images: 0,
    cache: 0,
    storage: {
      total: "0 GB",
      used: "0 GB",
      available: "0 GB",
      usedPercent: 0,
      availablePercent: 0
    }
  };

  async componentDidMount() {
    const { data } = (await axios.get(QUERY_URL)).data;
    this.setState(data);
  }

  render() {
    return (
      <Row gutter={8}>
        <Col span={8}>
          <Card
            hoverable
            style={Object.assign({ background: "#108ee9" }, statictisCardStyles)}
            bodyStyle={statictisCardBodyStyles}
          >
            <Row gutter={8} style={statictisCardRowStyles}>
              <Col span={12}>Total Images</Col>
              <Col span={12}>{this.state.images}</Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            style={Object.assign({ background: "#87d068" }, statictisCardStyles)}
            bodyStyle={statictisCardBodyStyles}
          >
            <Row gutter={8} style={statictisCardRowStyles}>
              <Col span={12}>Total Cache Images</Col>
              <Col span={12}>{this.state.cache}</Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            style={Object.assign({ background: "#f50" }, statictisCardStyles)}
            bodyStyle={statictisCardBodyStyles}
          >
            <Row gutter={8} style={statictisCardRowStyles}>
              <Col span={8}>Storage</Col>
              <Col span={16} style={{ textAlign: "left" }}>
                <p>Total: {this.state.storage.total}</p>
                <p>
                  Free space: {this.state.storage.available} /{" "}
                  {this.state.storage.availablePercent} %
                </p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
