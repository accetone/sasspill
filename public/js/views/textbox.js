import React from 'react';
import Rx from 'rxjs';

import FileActions from '../actions/file';

const Textbox = React.createClass({
    render: function () {
        return (
            <div>
            <textarea className="code"
                      disabled={!this.props.file.attributes.editable}
                      value={this.props.file.content}
                      onChange={this._change}></textarea>
            </div>
        );
    },

    componentDidMount: function () {
        this._compileObservable
            .distinctUntilChanged()
            .debounce(() => Rx.Observable.interval(750))
            .subscribe((value) => {
                this.props.compile();
            });
    },

    _compileObservable: new Rx.Subject(),

    _change: function (event) {
        FileActions.updateContent(this.props.file.id, event.target.value);
        this._compileObservable.next(event.target.value);
    }
});

export default Textbox;