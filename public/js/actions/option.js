import Dispatcher from '../dispatcher';
import OptionContants from '../constants/option';

const OptionActions = {
    update: function (name, value) {
        Dispatcher.dispatch({
            actionType: OptionContants.OPTION_UPDATE,
            name: name,
            value: value
        });
    }
};

export default OptionActions;