import Store from './store';
import Dispatcher from '../dispatcher';
import TabConstants from '../constants/tab';
import FileActions from '../actions/file';

class TabStore extends Store {
    add(tab) {
        tab.id = tab.file.id;

        if(this.data.length === 0) {
            tab.active = true;
            this.current = tab;
        }

        if (this.data.length > 1) {
            this.data.splice(this.data.length - 1, 0, tab);
        } else {
            this.data.push(tab);
        }
    }

    activate(id) {
        this.current.active = false;

        this.current = this.getOne(id);
        this.current.active = true;
    }

    getCurrent() {
        return this.current;
    }

    remove(id) {
        if (this.current.id === id) {
            this.current = this.data[0];
            this.current.active = true;
        }

        super.remove(id);
    }
}

const tabStore = new TabStore();

Dispatcher.subscribe((action) => {
    switch (action.actionType) {
        case TabConstants.TAB_ADD: {
            const tab = Object.assign({
                name: action.name,
                file: action.file
            });

            tabStore.add(tab);

            break;
        }

        case TabConstants.TAB_RENAME: {

            break;
        }

        case TabConstants.TAB_ACTIVATE: {
            tabStore.activate(action.id);

            break;
        }

        case TabConstants.TAB_CLOSE: {
            tabStore.remove(action.id);
            FileActions.delete(action.id);

            break;
        }

        default: return;
    }

    tabStore.emit();
});

export default tabStore;