import React from 'react';

import TabActions from '../../actions/tab';

const Tab = React.createClass({
    render: function () {
        let className = 'tabs__item';
        let close = '';

        if (this.props.tab.active) {
            className += ' tabs__item_active';
        }

        if (this.props.tab.file.attributes.closable) {
            close = (
                <span className="tabs__close" onClick={this._close}>
            x
            </span>
            );
        }

        return (
            <div className={className} onClick={this._activate}>
                {this.props.tab.name}
                {close}
            </div>
        );
    },

    _close: function (event) {
        TabActions.close(this.props.tab.id);

        event.stopPropagation();
    },

    _activate: function () {
        TabActions.activate(this.props.tab.id);
    }
});

export default Tab;