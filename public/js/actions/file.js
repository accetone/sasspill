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

    compileAuto: function (files, options, cssId, mapId) {
        Api.compile(files, options)
            .then((result) => {
                let cssContent, mapContent;

                if (result.message) {
                    cssContent = result.message;
                    mapContent = '';
                } else {
                    cssContent = result.css ? result.css : '';
                    mapContent = result.map ? result.map : '';
                }

                // TODO: call FileActions.update ???
                Dispatcher.dispatch({
                    actionType: FileConstants.FILE_UPDATE_CONTENT,
                    id: cssId,
                    content: cssContent
                });

                Dispatcher.dispatch({
                    actionType: FileConstants.FILE_UPDATE_CONTENT,
                    id: mapId,
                    content: mapContent
                });
            });
    },

    compileManual: function (files, options, cssId, mapId) {
        Api.compile(files, options)
            .then((result) => {
                let cssContent, mapContent;

                if (result.message) {
                    cssContent = result.message;
                    mapContent = '';
                } else {
                    cssContent = result.css ? result.css : '';
                    mapContent = result.map ? result.map : '';
                }

                Dispatcher.dispatch({
                    actionType: FileConstants.FILE_UPDATE_CONTENT,
                    id: cssId,
                    content: cssContent
                });

                Dispatcher.dispatch({
                    actionType: FileConstants.FILE_UPDATE_CONTENT,
                    id: mapId,
                    content: mapContent
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