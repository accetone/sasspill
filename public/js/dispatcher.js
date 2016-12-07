const Dispatcher = {
    subscribers: [],

    subscribe: function (handler) {
        this.subscribers.push(handler);
    },

    dispatch: function (action) {
        for (let i = 0; i < this.subscribers.length; i++)
            this.subscribers[i](action);
    }
};

export default Dispatcher;