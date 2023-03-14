import axios from 'axios'
import { config } from '../../configure'

const CategoryService = {
    getAll: () => {
        const result = axios.get(config.apiUrl + '/allcategory')
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
        let configure = {
            method: "POST",
            data: data,
            url: config.apiUrl + "/allcategorybyfilter",
            headers: {
                "content-type": "application/json",
                'x-access-token': localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data"))?.token : ""
            }
        }
        const result = axios(configure)
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
        let configure = {
            method: "POST",
            data: data,
            url: config.apiUrl + "/countcategory",
            headers: {
                "content-type": "application/json",
                'x-access-token': localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data"))?.token : ""
            }
        }
        const result = axios(configure)
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
        const result = axios.post(config.apiUrl + '/addcategory', data)
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
        const result = axios.get(config.apiUrl + '/categorybyid/' + id)
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
        const result = axios.put(config.apiUrl + '/updatecategory/' + id, data)
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
        const result = axios.put(config.apiUrl + '/deletecategory/' + id, data)
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
        const result = axios.delete(config.apiUrl + '/deletecategory/' + id, data)
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


export default CategoryService