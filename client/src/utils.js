import React from "react";
import { Tag } from "antd";
const querystring = require("querystring");

export const renderSize = size => {
  if (size < 1024) {
    return <span>{size} KB</span>;
  }

  if (1024 <= size <= 1048576) {
    return <span>{Number(size / 1024).toFixed(2)} MB</span>;
  }

  return <Tag color="red">Too large</Tag>;
};

export const renderDatetime = datetime => {
  return new Date(datetime).toLocaleString();
};

export const toName = name => {
  if (typeof name !== "string") return "";

  return name[0].toUpperCase() + name.slice(1);
};

export const calculateQueryString = (
  { current = 1, pageSize = 10 },
  filters,
  { field, order }
) => {
  let query = {
    page: current,
    limit: pageSize
  };

  const queryFilters = Object.keys(filters).reduce(
    (queryFilters, field) =>
      !!filters[field]
        ? Object.assign(queryFilters, { [field]: filters[field] })
        : queryFilters,
    {}
  );

  if (field) {
    query.sort = `${order === "descend" ? "-" : ""}${field}`;
  }

  return querystring.stringify(Object.assign(query, queryFilters));
};
