// TODO:
// - process tab key in input - paste two spaces
// - localstorage
// - highlight
// - options

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import FileActions from './actions/file';

import FileStore from './stores/file';
import TabStore from './stores/tab';

import Tabs from './views/tabs';
import Textbox from './views/textbox';
import Button from './views/button';

FileActions.add('main', 'scss', { closable: false, editable: true });
FileActions.add('main', 'css', { closable: false, editable: false });
FileActions.add('main', 'css.map', { closable: false, editable: false });

const main = FileStore.find('main', 'scss');
FileActions.updateContent(main.id, '$black: #fff;\n\nbody { color: $black; }');

const App = React.createClass({
    render: function () {
        console.log(this.state);

        return (
            <div>
                <Tabs tabs={this.state.tabs}/>
                <Textbox file={this.state.currentFile} compile={this._autoCompile}/>
                <Button onClick={this._manualCompile} className="btn__compile" text="Compile"/>
            </div>
        );
    },

    componentDidMount: function() {
        TabStore.subscribe(this._onChange);
        FileStore.subscribe(this._onChange);
    },

    componentWillUnmount: function() {
        TabStore.unsubscribe(this._onChange);
        FileStore.unsubscribe(this._onChange);
    },

    getInitialState: function () {
        let initialState = this._getState();

        return Object.assign(initialState, {
            cssId: FileStore.find('main', 'css').id,
            mapId: FileStore.find('main', 'css.map').id
        });
    },

    _onChange: function () {
        const state = this._getState();
        this.setState(state);
    },

    _autoCompile: function () {
        FileActions.compileAuto(
            this.state.files,
            { libs: { bourbon: true }, transform: { sourcemap: true } },
            this.state.cssId,
            this.state.mapId
        );
    },

    _manualCompile: function () {
        FileActions.compileManual(
            this.state.files,
            { libs: { bourbon: true }, transform: { sourcemap: true } },
            this.state.cssId,
            this.state.mapId
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