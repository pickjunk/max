import { PureComponent, ReactNode } from 'react';

export default class Timeout extends PureComponent {
  status: boolean;
  timer: any;

  props: {
    status: boolean;
    duration: number;
    onExpire: (status: boolean) => void;
    children: (status: boolean) => ReactNode;
  };

  componentDidUpdate() {
    const { status, duration = 2000, onExpire } = this.props;

    if (status === this.status) {
      return;
    }
    this.status = status;

    if (status) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(function() {
        this.timer = null;
        onExpire(false);
      }, duration);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render() {
    const { status, children } = this.props;

    return children(status);
  }
}
