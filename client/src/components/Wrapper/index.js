import { PureComponent } from "react";

export default class Wrapper extends PureComponent {
  render() {
    return this.props.children;
  }
}
