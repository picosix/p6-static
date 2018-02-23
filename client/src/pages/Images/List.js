import React, { Component, PureComponent } from "react";
import { Avatar, Table } from "antd";
import r2 from "r2";

import { renderSize, renderDatetime } from "@/utils";

class DetailLinkWrapper extends PureComponent {
  render() {
    return (
      <a
        href={`/images/${this.props.record._id}`}
        title={this.props.record.name}
      >
        {this.props.children}
      </a>
    );
  }
}

const columns = [
  {
    title: "Thumbnail",
    dataIndex: "src",
    key: "thumbnail",
    render: (src, record) => (
      <DetailLinkWrapper record={record}>
        <Avatar size="large" src={src} />
      </DetailLinkWrapper>
    )
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name, record) => (
      <DetailLinkWrapper record={record}>{name}</DetailLinkWrapper>
    )
  },
  {
    title: "Size",
    dataIndex: "size",
    key: "size",
    render: renderSize
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: renderDatetime
  }
];

export default class PageImages extends Component {
  state = {
    dataSource: []
  };
  async componentDidMount() {
    const { data } = await r2("http://localhost:9999/images").json;
    this.setState({ dataSource: data });
  }
  render() {
    return (
      <Table
        dataSource={this.state.dataSource}
        columns={columns}
        rowKey="_id"
      />
    );
  }
}
