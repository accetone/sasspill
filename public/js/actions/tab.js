import Dispatcher from '../dispatcher';
import TabConstants from '../constants/tab';

const TabActions = {
    add: function (name, file) {
        Dispatcher.dispatch({
            actionType: TabConstants.TAB_ADD,
            name: name,
            file: file
        });
    },

    rename: function (id, name) {
        Dispatcher.dispatch({
            actionType: TabConstants.TAB_RENAME,
            id: id,
            name: name
        });
    },

    close: function (id) {
        Dispatcher.dispatch({
            actionType: TabConstants.TAB_CLOSE,
            id: id
        });
    },

    activate: function (id) {
        Dispatcher.dispatch({
            actionType: TabConstants.TAB_ACTIVATE,
            id: id
        });
    },

    restore: function (tabs) {
        Dispatcher.dispatch({
            actionType: TabConstants.TABS_RESTORE,
            tabs: tabs
        });
    }
};

export default TabActions;