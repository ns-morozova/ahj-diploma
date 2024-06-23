export default class Connection {
    // static URL = 'http://127.0.0.1:7070';
    static URL = 'https://ahj-diploma-backend-71ss.onrender.com';

    static async query(type, param, objData = null) {
        let strParam = '';

        for (let key in param) {
            if (strParam == '') {
                strParam = key + '=' + param[key];
            } else {
                strParam = strParam + '&' + key + '=' + param[key];
            }
        }

        strParam = '?' + strParam;
        try {
            const options = {
                method: type
            }
            if (type == 'POST') {
                options.body = JSON.stringify(objData);
                options.headers = { 'Content-Type': 'application/json' };
            }
            const response = await fetch(this.URL + strParam, options);
            let json = undefined;
            if (response.ok) {
                if (type == 'GET') {
                    json = await response.json();
                }
                return { 'status': response.status, 'data': json };
            }
            
            throw new Error('Ошибка запроса: код: ' + response.status);
            
        } catch (err) {
            throw new Error(err);
        }

    }

}