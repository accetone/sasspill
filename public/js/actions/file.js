import Dispatcher from '../dispatcher';
import FileConstants from '../constants/file';
import TabConstants from '../constants/tab';
import Api from '../api';

const FileActions = {
    add: function (name, extension, attributes) {
        Dispatcher.dispatch({
            actionType: FileConstants.FILE_ADD,
            name: name,
            extension: extension,
            attributes: attributes
        });
    },

    updateContent: function (id, content) {
        Dispatcher.dispatch({
            actionType: FileConstants.FILE_UPDATE_CONTENT,
            id: id,
            content: content
        });
    },

    updateName: function (id, name) {
        Dispatcher.dispatch({
            actionType: FileConstants.FILE_UPDATE_NAME,
            id: id,
            name: name
        });
    },

    delete: function (id) {
        Dispatcher.dispatch({
            actionType: FileConstants.FILE_DELETE,
            id: id
        });
    },

    restore: function () {
        Dispatcher.dispatch({
            actionType: FileConstants.FILES_RESTORE
        });
    },

    compileAuto: function (files, options, cssId) {
        Api.compile(files, options)
            .then((result) => {
                let cssContent;

                if (result.message) {
                    cssContent = result.message;
                } else {
                    cssContent = result.css ? result.css : '';
                }

                // TODO: call FileActions.update ???
                Dispatcher.dispatch({
                    actionType: FileConstants.FILE_UPDATE_CONTENT,
                    id: cssId,
                    content: cssContent
                });
            });
    },

    compileManual: function (files, options, cssId) {
        Api.compile(files, options)
            .then((result) => {
                let cssContent;

                if (result.message) {
                    cssContent = result.message;
                } else {
                    cssContent = result.css ? result.css : '';
                }

                Dispatcher.dispatch({
                    actionType: FileConstants.FILE_UPDATE_CONTENT,
                    id: cssId,
                    content: cssContent
                });

                // TODO: call TabActions.activate ???
                Dispatcher.dispatch({
                    actionType: TabConstants.TAB_ACTIVATE,
                    id: cssId
                });
            });
    }
};

export default FileActions;