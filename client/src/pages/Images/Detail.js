import React, { Component, PureComponent } from "react";
import { Card, Col, Row, Tag, Popconfirm, Modal, Icon } from "antd";
import axios from "axios";
import Lazyload from "react-lazyload";

import "./Detail.css";
import Wrapper from "@/components/Wrapper";
import { renderSize, renderDatetime, toName } from "@/utils";

const QUERY_URL = `${process.env.REACT_APP_API_URL}/images`;

class ImageCache extends PureComponent {
  render() {
    let cacheRecords = [];
    const { type, sizes, defaultSize } = this.props;
    const sizeNames = Object.keys(sizes);

    // Break to chunks
    for (let i = 0, j = sizeNames.length; i < j; i += 4) {
      const nameChunk = sizeNames.slice(i, i + 4);

      const records = nameChunk.map(size => {
        const bodyStyle =
          defaultSize.type === type && defaultSize.size === size
            ? {
                background: "#f50",
                color: "white"
              }
            : {};

        return (
          <Col span={6} key={`${type} - ${size}`}>
            <Card
              hoverable
              style={{ width: "100%", textAlign: "center" }}
              cover={
                <Lazyload>
                  <img
                    alt={`${type} - ${size}`}
                    src={sizes[size]}
                    style={{ height: 150 }}
                  />
                </Lazyload>
              }
              bodyStyle={bodyStyle}
            >
              {size}
            </Card>
          </Col>
        );
      });

      cacheRecords.push(records);
    }

    return (
      <Card
        title={
          <Wrapper>
            Cache Type:{" "}
            <Tag color="#108ee9" style={{ fontSize: 14 }}>
              {toName(type)}
            </Tag>
          </Wrapper>
        }
        style={{ marginBottom: 5 }}
      >
        {cacheRecords.map((record, idx) => (
          <Row
            gutter={8}
            key={`${type}-${idx}`}
            style={{ marginTop: 5, display: "flex" }}
          >
            {record}
          </Row>
        ))}
      </Card>
    );
  }
}

export default class PageImagesDetail extends Component {
  state = {
    image: {
      _id: "",
      name: "",
      mimetype: "",
      size: 0,
      createdAt: "",
      defaultSize: {
        type: "",
        size: "",
        cacheUrl: ""
      },
      cacheUrls: {}
    }
  };

  async componentDidMount() {
    const { match } = this.props;
    const { data } = (await axios.get(`${QUERY_URL}/${match.params.id}`)).data;
    this.setState({ image: data });
  }

  clearCache = _id => async () => {
    await axios.delete(`${QUERY_URL}/${_id}/cache`);

    Modal.success({
      title: "Success",
      content: "All cache images has been deleted"
    });
  };

  render() {
    const {
      _id,
      name,
      mimetype,
      size,
      createdAt,
      defaultSize,
      cacheUrls
    } = this.state.image;
    const types = Object.keys(cacheUrls);

    return (
      <Wrapper>
        <Row gutter={8}>
          <Col span={6}>
            <Card
              hoverable
              style={{ width: "100%" }}
              cover={<img alt={name} src={defaultSize.cacheUrl} />}
              title="Image detail"
              bodyStyle={{ lineHeight: 2 }}
              actions={[
                <Popconfirm
                  title="Do you want to clear all cache of this image?"
                  key="clear-cache"
                  onConfirm={this.clearCache(_id)}
                >
                  <Icon style={{ cursor: "pointer" }} type="sync" />
                </Popconfirm>
              ]}
            >
              <div>Name: {name}</div>
              <div>Mimetype: {mimetype}</div>
              <div>Size: {renderSize(size)}</div>
              <div>Created At: {renderDatetime(createdAt)}</div>
              <div>
                Default Size: <Tag color="#108ee9">{defaultSize.type}</Tag>
                <Tag color="#f50">{defaultSize.size}</Tag>
              </div>
            </Card>
          </Col>
          <Col span={18}>
            {types.map(type => (
              <ImageCache
                key={type}
                type={type}
                sizes={cacheUrls[type]}
                defaultSize={defaultSize}
              />
            ))}
          </Col>
        </Row>
      </Wrapper>
    );
  }
}
