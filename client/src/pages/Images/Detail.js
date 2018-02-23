import React, { Component, PureComponent } from "react";
import { Card, Col, Row, Tag } from "antd";
import r2 from "r2";

import "./Detail.css";
import Wrapper from "@/components/Wrapper";
import { renderSize, renderDatetime, toName } from "@/utils";

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
                <img
                  alt={`${type} - ${size}`}
                  src={sizes[size]}
                  style={{ height: 150 }}
                />
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

export default class PageImages extends Component {
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
    const { data } = await r2(`http://localhost:9999/images/${match.params.id}`)
      .json;
    this.setState({ image: data });
  }

  render() {
    const {
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
