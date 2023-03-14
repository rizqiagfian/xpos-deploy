import axios from 'axios'
import { config } from '../../configure'

const CatalogService = {
    getAllFilter: (data) => {
        const result = axios.post(config.apiUrl + '/allcatalogbyfilter', data)
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

    submitOrder: (data) => {
        const result = axios.post(config.apiUrl + '/submitorder', data)
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


export default CatalogService