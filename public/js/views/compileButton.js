import React from 'react';

const CompileButton = React.createClass({
    render: function () {
        return (
            <div className="btn btn__compile" onClick={this.props.compile}>
                Compile
            </div>
        );
    },


});

export default CompileButton;