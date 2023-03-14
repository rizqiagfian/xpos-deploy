import axios from 'axios'
import { config } from '../../configure'

const HistoryService = {

    getAllFilter: (data) => {
        const result = axios.post(config.apiUrl + '/allhistorybyfilter', data)
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
    countData: (data) => {
        const result = axios.post(config.apiUrl + '/counthistory', data)
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
    getDetailById: (id) => {
        const result = axios.get(config.apiUrl + '/historydetail/' + id)
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

}


export default HistoryService