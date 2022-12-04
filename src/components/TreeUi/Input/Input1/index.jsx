import React, {Component} from 'react';
import "./index.css"

class Input1 extends Component {

    handleData = (e) => {
        const {collectData} = this.props
        const a={}
        a[this.props.name]=e.target.value
        collectData(a)
    }

    render() {
        return (
            <div>
                <input onBlur={this.handleData} type="text" name={this.props.name} className="input" placeholder={this.props.placeholder}/>
            </div>
        );
    }
}

export default Input1;