import axios from 'axios';

const Api = {
    compile: function (files, options) {
        const data = Object.assign({ files: {} }, options);

        for (let i = 0; i < files.length; i++) {
            if (files[i].extension !== 'scss') continue;

            data.files[files[i].name] = files[i].content;
        }

        return axios
            .post('/api/scss', data)
            .then(function (result) {
                return result.data;
            })
            .catch(function (error) {
                return error.response.data;
            });
    }
};

export default Api;