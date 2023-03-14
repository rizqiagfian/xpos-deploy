import axios from 'axios'
import { config } from '../../configure'

const LoginService = {
    goLogin: (data) => {
        const result = axios.post(config.apiUrl + '/login', data)
            .then(respon => {
                return {
                    success: respon.data.success,
                    result: respon.data.result,
                    message: respon.data.message
                }
            })
            .catch(error => {
                return {
                    success: false,
                    error: error
                }
            })
        return result
    },
    goRegister: (data) => {
        const result = axios.post(config.apiUrl + '/register', data)
            .then(respon => {
                return {
                    success: respon.data.success,
                    result: respon.data.result
                }
            })
            .catch(error => {
                return {
                    success: false,
                    error: error
                }
            })
        return result
    },
    cekEmail: (data) => {
        const result = axios.post(config.apiUrl + '/cekemail', data)
            .then(respon => {
                return {
                    success: respon.data.success,
                    result: respon.data.result
                }
            })
            .catch(error => {
                return {
                    success: false,
                    error: error
                }
            })
        return result
    }

}


export default LoginService