import React from 'react';

const Button = React.createClass({
    render: function () {
        return (
            <div className={'btn ' + this.props.className} onClick={this.props.onClick}>
                {this.props.text}
            </div>
        );
    },


});

export default Button;