import React, {Component} from 'react';
import "./index.css"

class LogBtn extends Component {

    render() {
        const {onClick} = this.props;
        return (
            <button className="cta" onClick={onClick}>
                <span>进&nbsp;&nbsp;入</span>
                <svg viewBox="0 0 13 10" height="10px" width="15px">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
            </button>
        );
    }
}

export default LogBtn;

