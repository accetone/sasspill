import React from 'react';

import FileActions from '../../actions/file';
import Tab from './tab';

const Tabs = React.createClass({
    render: function () {
        const tabs = this.props.tabs
            .map((tab) => <Tab key={tab.id} tab={tab} />);

        return (
            <div className="tabs">
                {tabs}

                <div className="tabs__add" onClick={this._add}>+</div>
            </div>
        );
    },

    _add: function () {
        const name = prompt('Please enter the filename');

        if (name == undefined || name === '') return;

        FileActions.add(name, 'scss', { closable: true, editable: true });
    }
});

export default Tabs;