import axios from 'axios'
import { config } from '../../configure'

const VariantService = {
    getAll: () => {
        const result = axios.get(config.apiUrl + '/allvariant')
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
    getAllFilter: (data) => {
        const result = axios.post(config.apiUrl + '/allvariantbyfilter', data)
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
        const result = axios.post(config.apiUrl + '/countvariant', data)
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


    addData: (data) => {
        const result = axios.post(config.apiUrl + '/addvariant', data)
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

    getById: (id) => {
        const result = axios.get(config.apiUrl + '/variantbyid/' + id)
            .then(respon => {
                return {
                    success: respon.data.success,
                    result: respon.data.result[0]
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
    EditData: (id, data) => {
        const result = axios.put(config.apiUrl + '/updatevariant/' + id, data)
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
    SoftDeleteData: (id, data) => {
        const result = axios.put(config.apiUrl + '/deletevariant/' + id, data)
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
    HardDeleteData: (id, data) => {
        const result = axios.delete(config.apiUrl + '/deletevariant/' + id, data)
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
    getVariantByCategory: (idCategory) => {
        const result = axios.get(config.apiUrl + '/categoryvariantbyid/' + idCategory)
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


export default VariantService