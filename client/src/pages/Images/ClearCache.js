import React, { Component } from "react";
import { Modal, Icon } from "antd";
import r2 from "r2";

const confirm = Modal.confirm;

export const CLEAR_CACHE_TYPE_ONE = 1;
export const CLEAR_CACHE_TYPE_ALL = 2;

const getClearCacheUrl = (type, _id) => {
  if (type === CLEAR_CACHE_TYPE_ONE) {
    return `http://localhost:9999/images/${_id}/cache`;
  }
  if (type === CLEAR_CACHE_TYPE_ALL) {
    return "http://localhost:9999/images/cache";
  }
  return "";
};

export default class ClearCache extends Component {
  showConfirm = () => {
    const { _id, type = CLEAR_CACHE_TYPE_ONE } = this.props;
    if (!_id && type === CLEAR_CACHE_TYPE_ONE) {
      return Modal.error({
        title: "Error",
        content: `Image with id #${_id} is not found. Please refresh page and try again later.`
      });
    }

    confirm({
      title: "Confirm your action",
      content:
        "Do you want to clear all cache of image(s)? Be careful!!! This action may be cause of performance issue.",
      async onOk() {
        try {
          await r2.delete(getClearCacheUrl(type, _id)).json;

          Modal.success({
            title: "Success",
            content: "All cache images has been deleted"
          });
        } catch (error) {
          Modal.error({
            title: "Error",
            content:
              "We cannot perform clear cache action now. Please try again later."
          });
        }
      },
      onCancel() {}
    });
  };

  render() {
    const elment = this.props.children ? (
      React.cloneElement(this.props.children, { onClick: this.showConfirm })
    ) : (
      <Icon
        style={{ cursor: "pointer", color: "#f50" }}
        type="sync"
        onClick={this.showConfirm}
      />
    );

    return elment;
  }
}
