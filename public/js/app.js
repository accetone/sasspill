import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import FileActions from './actions/file';

import FileStore from './stores/file';
import TabStore from './stores/tab';

import Tabs from './views/tabs';
import Textbox from './views/textbox';

FileActions.add('main', 'scss', { closable: false, editable: true });
FileActions.add('main', 'css', { closable: false, editable: true });

const mainSassFile = FileStore.find('main', 'scss');
TabStore.activate(mainSassFile.id);

const App = React.createClass({
    render: function () {
        return (
            <div className="app-root">
                <Tabs tabs={this.state.tabs}/>
                <Textbox ref="textbox" file={this.state.currentFile} compile={this._autoCompile}/>
            </div>
        );
    },

    componentDidMount: function() {
        TabStore.subscribe(this._onChange);
        FileStore.subscribe(this._onChange);

        this.componentDidUpdate();
    },

    componentWillUnmount: function() {
        TabStore.unsubscribe(this._onChange);
        FileStore.unsubscribe(this._onChange);
    },

    componentDidUpdate: function () {
        ReactDOM.findDOMNode(this.refs.textbox).focus();
    },

    getInitialState: function () {
        let initialState = this._getState();

        return Object.assign(initialState, {
            cssId: FileStore.find('main', 'css').id
        });
    },

    _onChange: function () {
        const state = this._getState();
        this.setState(state);
    },

    _autoCompile: function () {
        FileActions.compileAuto(
            this.state.files,
            { libs: { bourbon: true } },
            this.state.cssId
        );
    },

    _manualCompile: function () {
        FileActions.compileManual(
            this.state.files,
            { libs: { bourbon: true } },
            this.state.cssId
        );
    },

    _getState: function () {
        return {
            tabs: TabStore.getAll(),
            files: FileStore.getAll(),
            currentFile: FileStore.getOne(TabStore.getCurrent().id),
        };
    }
});

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);