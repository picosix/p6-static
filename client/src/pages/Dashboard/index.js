import React, { Component } from "react";
import { Card, Col, Row, Modal, Upload, Icon } from "antd";
import axios from "axios";

import "./index.css";
import Wrapper from "@/components/Wrapper";

const statictisCardStyles = {
  width: "100%",
  textAlign: "center",
  height: 120,
  fontWeight: 800,
  fontSize: 16,
  color: "white"
};
const statictisCardBodyStyles = { height: "100%" };
const statictisCardRowStyles = {
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
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
    },

    previewVisible: false,
    previewImage: "",
    fileList: []
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = ({ response }) => {
    const [{ url }] = response;
    this.setState({
      previewImage: url,
      previewVisible: true
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  async componentDidMount() {
    try {
      const { data } = (await axios.get(
        `${process.env.REACT_APP_API_URL}/statictis`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )).data;
      this.setState(data);
    } catch (error) {
      Modal.error({
        title: "Unauthorized",
        content: "Please login before perform this action",
        onOk: () => {
          localStorage.removeItem("token");
          const { history } = this.props;
          history.push("/auth");
        }
      });
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="static-upload-text">Upload</div>
      </div>
    );

    return (
      <Wrapper>
        <Row gutter={8}>
          <Col span={8}>
            <Card
              hoverable
              style={Object.assign(
                { background: "#108ee9" },
                statictisCardStyles
              )}
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
              style={Object.assign(
                { background: "#87d068" },
                statictisCardStyles
              )}
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

        <Row gutter={8} style={{ marginTop: 10 }}>
          <Col span={24}>
            <div className="clearfix">
              <Upload
                className="static-upload"
                name="images"
                action={`${process.env.REACT_APP_API_URL}/upload`}
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                multiple
              >
                {uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancel}
              >
                <a target="_blank" href={previewImage} title="Priview image">
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </a>
              </Modal>
            </div>
          </Col>
        </Row>
      </Wrapper>
    );
  }
}
