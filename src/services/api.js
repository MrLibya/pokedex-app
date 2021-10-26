import axios from 'axios';
import { API_URL } from './constants';

const API = axios.create({
    baseURL: API_URL,
    //timeout: 5000,
    headers: {
        //'X-Custom-Header': 'foobar'
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
    },
});

/*API.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
        return response;
    }, async function (error) 
    {
        const originalRequest = error.config;
        if(error == "Error: Network Error")
            Toast.show({
                type:'error',
                text1: 'حصل خطا',
                text2: 'توجد مشكله في الإتصال بالخادم , تحقق من الانترنت لديك',
            });
        else if (error && error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const token = await getNewTokenByRefresh();   
            if(token) {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return API(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);
*/
export default API;