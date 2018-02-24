import React, { Component, PureComponent } from "react";
import {
  Col,
  Row,
  Avatar,
  Table,
  Button,
  Icon,
  Input,
  Popconfirm,
  Modal
} from "antd";
import axios from "axios";

import "./List.css";
import Wrapper from "@/components/Wrapper";
import { renderSize, renderDatetime, calculateQueryString } from "@/utils";

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

const QUERY_URL = "http://localhost:9999/images";

export default class PageImagesList extends Component {
  state = {
    dataSource: [],
    loading: true,
    pagination: {
      total: 500,
      hideOnSinglePage: true
    },
    filters: {},
    sorter: {},
    filterVisible: false
  };

  async componentDidMount() {
    await this.query();
  }

  query = async (pagination = {}, filters = {}, sorter = {}) => {
    this.setState({ loading: true });
    const queryString = calculateQueryString(pagination, filters, sorter);

    const { data, total } = (await axios.get(
      `${QUERY_URL}?${queryString}`
    )).data;

    if (data.length < 1) {
      return await this.query(
        Object.assign({}, this.state.pagination, {
          current: pagination.current - 1
        }),
        this.state.filters,
        this.state.sorter
      );
    }

    const newPagination = Object.assign({}, this.state.pagination, pagination, {
      total
    });
    this.setState({
      dataSource: data,
      pagination: newPagination,
      loading: false
    });
  };

  onFilterChange = field => e => {
    const filters = Object.assign({}, this.state.filters, {
      [field]: e.target.value
    });
    this.setState({ filters });
  };

  clearCache = _id => async () => {
    const url = !!_id ? `${QUERY_URL}/${_id}/cache` : `${QUERY_URL}/cache`;
    await axios.delete(url);

    Modal.success({
      title: "Success",
      content: "All cache images has been deleted"
    });
  };

  deleteImage = _id => async () => {
    const url = !!_id ? `${QUERY_URL}/${_id}` : `${QUERY_URL}`;
    await axios.delete(url);

    await this.query(
      this.state.pagination,
      this.state.filters,
      this.state.sorter
    );

    Modal.success({
      title: "Success",
      content: "Selected image(s) has been deleted successfully"
    });
  };

  onFilter = async () => {
    await this.query(
      this.state.pagination,
      this.state.filters,
      this.state.sorter
    );
  };

  render() {
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
        sorter: true,
        render: (name, record) => (
          <DetailLinkWrapper record={record}>{name}</DetailLinkWrapper>
        ),
        filterDropdown: (
          <div className="static-filter-dropdown">
            <Input
              ref={ele => (this.searchInput = ele)}
              placeholder="Search name"
              value={this.state.filters.name}
              onChange={this.onFilterChange("name")}
              onPressEnter={this.onFilter}
            />
            <Button type="primary" onClick={this.onFilter}>
              <Icon type="search" />
            </Button>
          </div>
        ),
        filterIcon: <Icon type="search" />,
        filterDropdownVisible: this.state.filterVisible,
        onFilterDropdownVisibleChange: visible => {
          this.setState(
            {
              filterVisible: visible
            },
            () => this.searchInput && this.searchInput.focus()
          );
        }
      },
      {
        title: "Size",
        dataIndex: "size",
        key: "size",
        sorter: true,
        render: renderSize
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        sorter: true,
        render: renderDatetime
      },
      {
        title: "Action",
        dataIndex: "",
        key: "action",
        className: "static-action",
        render: (noData, record) => [
          <Popconfirm
            title="Do you want to clear all cache of this image?"
            key="clear-cache"
            onConfirm={this.clearCache(record._id)}
          >
            <Icon style={{ cursor: "pointer" }} type="sync" />
          </Popconfirm>,
          <Popconfirm
            title="Do you want to delete this image?"
            key="delete-image"
            onConfirm={this.deleteImage(record._id)}
          >
            <Icon
              type="delete"
              style={{ color: "#f50", marginLeft: 5, cursor: "pointer" }}
            />
          </Popconfirm>
        ]
      }
    ];

    return (
      <Wrapper>
        <Row gutter={8}>
          <Col span={24}>
            <Table
              dataSource={this.state.dataSource}
              columns={columns}
              pagination={this.state.pagination}
              rowKey="_id"
              loading={this.state.loading}
              onChange={this.query}
            />
          </Col>
        </Row>
      </Wrapper>
    );
  }
}
