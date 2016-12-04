import Dispatcher from '../dispatcher';
import PopupConstants from '../constants/popup';

const PopupActions = {
    show: function (component) {
        Dispatcher.dispatch({
            actionType: PopupConstants.POPUP_SHOW,
            component: component
        });
    },

    hide: function () {
        Dispatcher.dispatch({
            actionType: PopupConstants.POPUP_HIDE
        });
    }
};

export default PopupActions;