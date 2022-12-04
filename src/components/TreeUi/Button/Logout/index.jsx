import './index.css'
import React, {Component} from 'react';

class Index extends Component {

    render() {
        const {doLogout} = this.props;
        return (
            <button onClick={doLogout}>&nbsp;&nbsp;退&nbsp;&nbsp;&nbsp;出
                <svg viewBox="0 0 13 10" height="10px" width="15px">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
            </button>
        );
    }
}

export default Index;