import React, { Component, PureComponent } from "react";
import { Col, Row, Avatar, Table, Button, Icon, Input } from "antd";
import r2 from "r2";

import "./List.css";
import Wrapper from "@/components/Wrapper";
import { renderSize, renderDatetime, calculateQueryString } from "@/utils";
import ClearCache, { CLEAR_CACHE_TYPE_ALL } from "./ClearCache";

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

    const { data, total } = await r2(`${QUERY_URL}?${queryString}`).json;
    const newPagination = Object.assign({}, this.state.pagination, { total });
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
        render: (noData, record) => <ClearCache {...record} />
      }
    ];

    return (
      <Wrapper>
        <Row gutter={8} style={{ marginBottom: 5 }}>
          <Col span={24} style={{ textAlign: "right" }}>
            <ClearCache type={CLEAR_CACHE_TYPE_ALL}>
              <Button type="danger">
                <Icon type="sync" />
              </Button>
            </ClearCache>
          </Col>
        </Row>

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
