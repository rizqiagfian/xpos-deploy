import axios from 'axios'
import { config } from '../../configure'

const ProductService = {
    getAll: () => {
        const result = axios.get(config.apiUrl + '/allproduct')
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
        const result = axios.post(config.apiUrl + '/allproductbyfilter', data)
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
        const result = axios.post(config.apiUrl + '/countproduct', data)
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
        const result = axios.post(config.apiUrl + '/addproduct', data)
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
        const result = axios.get(config.apiUrl + '/productvariantcategorybyid/' + id)
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
        const result = axios.put(config.apiUrl + '/updateproduct/' + id, data)
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
        const result = axios.put(config.apiUrl + '/deleteproduct/' + id, data)
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
        const result = axios.delete(config.apiUrl + '/deleteproduct/' + id, data)
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

    uploadImg: (data) => {
        const result = axios.post(config.apiUrl + '/single', data, {
            headers: {
                "Content-type": "multipart/form-data",
            },
        })
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


export default ProductService