import React from "react";
import { Tag } from "antd";

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
