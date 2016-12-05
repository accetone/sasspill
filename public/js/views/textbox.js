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
                      onChange={this._change}
                      onKeyDown={this._specialKeys}></textarea>
            </div>
        );
    },

    componentDidMount: function () {
        this._compileObservable
            .distinctUntilChanged()
            .debounce(() => Rx.Observable.interval(750))
            .subscribe(() => this.props.compile());
    },

    _compileObservable: new Rx.Subject(),

    _change: function (event) {
        this._updateContent(this.props.file.id, event.target.value);
    },

    _updateContent: function (id, content) {
        FileActions.updateContent(id, content);
        this._compileObservable.next(content);
    },

    _specialKeys: function (event) {
        if (event.keyCode === 9) {
            event.preventDefault();

            const input = event.target;
            const selection = {
                start: input.selectionStart,
                end: input.selectionEnd
            };

            let content = this.props.file.content;

            content = content.substring(0, selection.start)
                + '  '
                + content.substring(selection.end);

            input.value = content;
            input.selectionStart = selection.start + 2;
            input.selectionEnd = selection.start + 2;

            this._updateContent(this.props.file.id, content);
        }
    }
});

export default Textbox;