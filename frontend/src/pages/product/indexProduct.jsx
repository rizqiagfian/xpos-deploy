import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from 'primereact/dialog';
import VariantService from '../../services/variant'
import CategoryService from '../../services/category';
import ProductService from '../../services/product';
import FormProduct from './formProduct';

export const IndexProduct = () => {
    const history = useHistory()
    const [dataList, setDataList] = useState([])
    const [totalRecords, setTotalRecords] = useState(10)
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 5,
        sortOrder: 1,
        sortField: 'Id'
    })
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }
    const [displayDialogAdd, setDisplayDialogAdd] = useState(false)
    const [displayDialog, setDisplayDialog] = useState(false)
    const [dialogMessage, setDialogMessage] = useState("")
    const [displayDialogFail, setDisplayDialogFail] = useState(false)
    const [dialogMessageFail, setDialogMessageFail] = useState("")
    const [productModel, setProductModel] = useState({
        Id: "",
        NameProduct: "",
        Price: "",
        Stock: "",
        Image: "",
        IdCategory: "",
        IdVariant: "",
        CreateBy: 1,
        UpdateBy: null,
        IsDelete: false
    })
    const [from, setFrom] = useState("")
    const [errors, setErrors] = useState({
        "NameProduct": "",
        "Price": "",
        "Stock": "",
        "Image": "",
        "IdVariant": "",
        "IdCategory": ""
    })
    const [category, setCategory] = useState([])
    const [variant, setVariant] = useState([])

    console.log(productModel)

    const changeFunction = (name) => async (e) => {
        if (name === "IdCategory") {
            setProductModel({
                ...productModel,
                [name]: e.value
            })
            await getVariant(e.value)
        }
        else if (name === "IdVariant") {
            setProductModel({
                ...productModel,
                [name]: e.value
            })
        } else if (name === "Image") {
            setProductModel({
                ...productModel,
                [name]: e.value
            })
        } else {
            setProductModel({
                ...productModel,
                [name]: e.target.value
            })
        }
        setErrors({
            ...errors,
            [name]: ""
        })
    }

    const changeImage = (e) => {
        setProductModel({
            ...productModel,
            ["Image"]: e
        })
        setErrors({
            ...errors,
            ["Image"]: ""
        })
    }

    const nameBodyTemplate = (data) => {
        return (
            <>
                <span>{data.NameProduct}</span>
            </>
        )
    }

    const imageBodyTemplate = (data) => {
        return (
            <>
                <img style={{ width: '5rem', height: '5rem' }} src={"http://localhost:8088/" + data.Image} />
            </>
        )
    }

    const priceBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Price}</span>
            </>
        )
    }

    const stockBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Stock}</span>
            </>
        )
    }

    const idBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Id}</span>
            </>
        )
    }

    const aksiBodyTemplate = (data) => {
        return (
            <>
                <div className='grid block'>
                    <Button className="p-button-success" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="edit product" onClick={() => clickEdit(data)} ><i className="pi pi-pencil mr-2" style={{ fontSize: '14px' }} />Edit</Button><br />
                    <Button className="p-button-warning" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="detail product" onClick={() => clickDetail(data)} ><i className='pi pi-folder mr-2' style={{ fontSize: '14px' }} />Detail</Button><br />
                    <Button className="p-button-danger" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="delete product" onClick={() => clickDelete(data)}><i className='pi pi-trash mr-2' style={{ fontSize: '14px' }} />Delete</Button><br />
                </div>
            </>
        )
    }

    const headerTemplate = (<>
        <div className='col-12' style={{ textAlign: 'left', padding: '0' }}>
            <div class="card-header" style={{ padding: '0', border: 'none' }}>
                <Button onClick={() => clickAdd()} tooltip="add product" className="p-button-primary" style={{ padding: '2px 10px' }}><span><i className='pi pi-plus' style={{ marginRight: '5px' }}></i></span>Add</Button>
                <div class="card-tools" style={{ padding: '5px 0' }}>
                    <div class="input-group input-group-sm" style={{ width: "15vw" }}>
                        <input type="text" name="table_search" className="form-control float-right" placeholder="Search" onChange={(e) => onSearch(e)} />
                        <div class="input-group-append">
                            <button type="button" class="btn btn-default" onClick={() => clickSearch()}>
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </>)

    const onSort = (event) => {
        let _lazyParams = { ...lazyParams, ...event }
        setLazyParams({ ..._lazyParams, first: 0 })
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
    }

    const getListByFilter = async () => {
        setLoading(true)

        let data = {
            "search": search,
            "first": lazyParams.first,
            "rows": lazyParams.rows,
            "sortOrder": lazyParams.sortOrder,
            "sortField": lazyParams.sortField
        }

        try {
            const response = await ProductService.getAllFilter(data);
            if (response?.success === true) {
                setDataList(response.result)
                // setTotalRecords(response?.jumlah)
            } else {
                setDataList([])
            }
            setLoading(false)
        } catch (err) {
            throw err;
        } finally {
            setLoading(false)
        }
    };

    const getCount = async () => {
        setLoading(true)

        let data = {
            "search": search,
        }

        try {
            const response = await ProductService.countData(data);
            if (response?.success === true) {
                setTotalRecords(response?.result)
            } else {
                setTotalRecords(0)
            }
            setLoading(false)
        } catch (err) {
            throw err;
        } finally {
            setLoading(false)
        }
    };

    const getCategory = async () => {
        setLoading(true)
        try {
            const response = await CategoryService.getAll();
            if (response?.success === true) {
                setCategory(response.result)
            } else {
                setCategory([])
            }
            setLoading(false)
        } catch (err) {
            throw err;
        } finally {
            setLoading(false)
        }
    };

    const getVariant = async (idCategory) => {
        setLoading(true)
        if (idCategory) {
            try {
                const response = await VariantService.getVariantByCategory(idCategory);
                if (response?.success === true) {
                    setVariant(response.result)
                } else {
                    setVariant([])
                }
                setLoading(false)
            } catch (err) {
                throw err;
            } finally {
                setLoading(false)
            }
        } else {
            try {
                const response = await VariantService.getAll();
                if (response?.success === true) {
                    setVariant(response.result)
                } else {
                    setVariant([])
                }
                setLoading(false)
            } catch (err) {
                throw err;
            } finally {
                setLoading(false)
            }
        }
    };

    const addProduct = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        try {
            const response = await ProductService.addData(productModel);
            if (response?.success === true) {
                await getListByFilter()
                await getCount()
                setDialogMessage(response.result)
                setDisplayDialog(true)
            } else {
                setDialogMessageFail(response.result)
                setDisplayDialogFail(true)
            }
            setLoading(false)
        } catch (err) {
            setDialogMessageFail(err)
            setDisplayDialogFail(true)
            throw err;
        } finally {
            setLoading(false)
            setProductModel({
                Id: "",
                NameProduct: "",
                Price: "",
                Stock: "",
                Image: "",
                IdVariant: "",
                IdCategory: "",
                CreateBy: 1,
                UpdateBy: null,
                IsDelete: false
            })
        }
    };

    const editProduct = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        let data = {
            "NameProduct": productModel.NameProduct,
            "Price": productModel.Price,
            "Stock": productModel.Stock,
            "Image": productModel.Image,
            "UpdateBy": 1,
            "IdVariant": parseInt(productModel.IdVariant)
        }

        try {
            const response = await ProductService.EditData(productModel.Id, data);
            if (response?.success === true) {
                await getListByFilter()
                await getCount()
                setDialogMessage(response.result)
                setDisplayDialog(true)
            } else {
                setDialogMessageFail(response.result)
                setDisplayDialogFail(true)
            }
            setLoading(false)
        } catch (err) {
            setDialogMessageFail(err)
            setDisplayDialogFail(true)
            throw err;
        } finally {
            setLoading(false)
            setProductModel({
                Id: "",
                NameProduct: "",
                Price: "",
                Stock: "",
                Image: "",
                IdVariant: "",
                IdCategory: "",
                CreateBy: 1,
                UpdateBy: null,
                IsDelete: false
            })
        }
    };

    const deleteProduct = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        let data = {
            "NameProduct": productModel.NameProduct,
            "UpdateBy": 1
        }

        // Soft delete
        try {
            const response = await ProductService.SoftDeleteData(productModel.id, data);
            if (response?.success === true) {
                await getListByFilter()
                await getCount()
                setDialogMessage(response.result)
                setDisplayDialog(true)
            } else {
                setDialogMessageFail(response.result)
                setDisplayDialogFail(true)
            }
            setLoading(false)
        } catch (err) {
            setDialogMessageFail(err)
            setDisplayDialogFail(true)
            throw err;
        } finally {
            setLoading(false)
        }

        // Hard delete
        // try {
        //     const response = await ProductService.HardDeleteData(productModel.id, { "NameProduct": data.NameProduct })
        //     if (response?.success === true) {
        //         await getListByFilter()
        //         setDialogMessage(response.result)
        //         setDisplayDialog(true)
        //     } else {
        //         setDialogMessageFail(response.result)
        //         setDisplayDialogFail(true)
        //     }
        //     setLoading(false)
        // } catch (err) {
        //     setDialogMessageFail(err)
        //     setDisplayDialogFail(true)
        //     throw err;
        // } finally {
        //     setLoading(false)
        // }

    };

    const submitProduct = async () => {
        if (validateFunction()) {
            if (from === 'add') {
                addProduct()
            } else if (from === 'edit') {
                editProduct()
            } else if (from === 'delete') {
                deleteProduct()
            }
        }
    }

    const closeForm = () => {
        setDisplayDialogAdd(false)
        setProductModel({
            ...productModel,
            Id: "",
            NameProduct: "",
            Price: "",
            Stock: "",
            Image: "",
            IdVariant: "",
            IdCategory: "",
            DescriptionCategory: "",
            DescriptionVariant: "",
            NameCategory: "",
            NameVariant: "",
            CreateBy: 1,
            UpdateBy: null,
            IsDelete: false
        })
        setErrors({ "NameProduct": "", "Price": "", "Stock": "", "Image": "", "IdVariant": "" })
    }

    const clickAdd = () => {
        setFrom("add")
        setDisplayDialogAdd(true)
    }

    const clickEdit = async (data) => {
        setLoading(true)
        await getVariant()
        await getCategory()

        try {
            const response = await ProductService.getById(data.Id);
            if (response?.success === true) {
                // setProductModel({
                //     ...productModel,
                //     NameProduct: response.result.NameProduct,
                //     Description: response.result.Description,
                //     CreateBy: response.result.CreateBy,
                //     UpdateBy: response.result.UpdateBy,
                //     IsDelete: response.result.IsDelete
                // })
                setProductModel(response.result)
                setFrom('edit')
                setDisplayDialogAdd(true)
            }
            setLoading(false)
        } catch (err) {
            throw err;
        } finally {
            setLoading(false)
        }
    }

    const clickDetail = async (data) => {
        setLoading(true)
        await getVariant()
        await getCategory()
        try {
            const response = await ProductService.getById(data.Id);
            if (response?.success === true) {
                setProductModel(response.result)
                setFrom('detail')
                setDisplayDialogAdd(true)
            }
            setLoading(false)
        } catch (err) {
            throw err;
        } finally {
            setLoading(false)
        }
    }

    const clickDelete = async (data) => {
        setLoading(true)
        await getVariant()
        await getCategory()
        try {
            const response = await ProductService.getById(data.Id);
            if (response?.success === true) {
                setProductModel(response.result)
                setFrom('delete')
                setDisplayDialogAdd(true)
            }
            setLoading(false)
        } catch (err) {
            throw err;
        } finally {
            setLoading(false)
        }
    }

    const validateFunction = () => {
        let errors = {}
        let isValid = false

        if (!productModel["NameProduct"]) {
            isValid = false
            errors["NameProduct"] = "Name Product can not be empty"
        }

        if (!productModel["Price"]) {
            isValid = false
            errors["Price"] = "Price can not be empty"
        }

        if (!productModel["Stock"]) {
            isValid = false
            errors["Stock"] = "Stock can not be empty"
        }

        if (!productModel["Image"]) {
            isValid = false
            errors["Image"] = "Image can not be empty"
        }

        if (!productModel["IdVariant"]) {
            isValid = false
            errors["IdVariant"] = "Variant can not be empty"
        }

        if (!productModel["IdCategory"]) {
            isValid = false
            errors["IdCategory"] = "Category can not be empty"
        }

        if (productModel["NameProduct"] && productModel["Price"] && productModel["Stock"] && productModel["IdVariant"] && productModel["IdCategory"]
            && productModel["Image"]
        ) {
            isValid = true
        }

        setErrors(errors)

        return isValid
    }

    const clickSearch = () => {
        getListByFilter()
        getCount()
    }

    useEffect(() => {
        async function fetchData() {
            await getListByFilter()
            await getCount()
            await getVariant()
            await getCategory()
        }
        fetchData();
    }, [lazyParams])

    return (

        <>
            <div className='main-layout'>

                <Accordion activeIndex={0}>
                    <AccordionTab header={"TABLE PRODUCT"}>
                        <div className='datatable-responsive-demo'>
                            <DataTable
                                value={dataList}
                                className="p-datatable-responsive-demo"
                                rowHover
                                emptyMessage="Data Tidak Ditemukan."
                                loading={loading}
                                showGridlines
                                lazy
                                paginator
                                totalRecords={totalRecords}
                                onPage={onPage}
                                rowsPerPageOptions={[5, 10, 15]}
                                first={lazyParams?.first}
                                rows={lazyParams?.rows}
                                dataKey="id"
                                header={headerTemplate}
                                onSort={onSort}
                                sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                            >
                                <Column
                                    field="Id"
                                    header="Id"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "10%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={idBodyTemplate}
                                    sortable
                                />
                                <Column
                                    field="NameProduct"
                                    header="Name Product"
                                    headerStyle={{ width: "25%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={nameBodyTemplate}
                                    style={{ wordBreak: 'break-word', textAlign: "center" }}
                                    sortable
                                />
                                <Column
                                    field="Image"
                                    header="Image"
                                    headerStyle={{ width: "20%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={imageBodyTemplate}
                                    style={{ wordBreak: 'break-word', textAlign: "center" }}
                                />
                                <Column
                                    field="Price"
                                    header="Price"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "15%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={priceBodyTemplate}
                                />
                                <Column
                                    field="Stock"
                                    header="Stock"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "15%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={stockBodyTemplate}
                                />
                                <Column
                                    field="action"
                                    header="Action"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "15%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={aksiBodyTemplate}
                                />
                            </DataTable>
                        </div>

                    </AccordionTab>
                </Accordion>

            </div>

            {/* Dialog success */}
            <Dialog blockScroll={true} className="dialog-response" header={"Informasi"} visible={displayDialog} onHide={() => setDisplayDialog(false)} breakpoints={{ '960px': '75vw' }} style={{ width: '40vw' }} draggable={false}>
                <div className="col-12">
                    <p style={{ width: '100%' }}>{dialogMessage}</p>
                </div>
                <div className="p-col-12" style={{ textAlign: 'end', marginTop: '0.5rem' }}>
                    <Button label="OK" style={{ textAlign: 'center', width: '5rem', backgroundColor: '#607d8b' }} onClick={() => setDisplayDialog(false)} />
                </div>
            </Dialog>

            {/* Dialog Fail */}
            <Dialog blockScroll={true} className="dialog-response-fail" header={"Peringatan"} visible={displayDialogFail} onHide={() => setDisplayDialogFail(false)} breakpoints={{ '960px': '75vw' }} style={{ width: '40vw' }} draggable={false}>
                <div className="p-col-12 p-d-flex">
                    <p style={{ marginLeft: '10px', width: '100%' }}>{dialogMessageFail}</p>
                </div>
                <div className="p-col-12" style={{ textAlign: 'end', marginTop: '0.5rem' }}>
                    <Button label="OK" style={{ textAlign: 'center', width: '5rem', backgroundColor: '#D01224' }} onClick={() => setDisplayDialogFail(false)} />
                </div>
            </Dialog>

            {/* Dialog Form Product */}
            <Dialog className='form-add-category' blockScroll={true} header={from === "edit" ? "Edit Product" : from === "add" ? "Add Product" : from === 'detail' ? "Detail" : "Delete"} visible={displayDialogAdd} onHide={() => closeForm()} breakpoints={{ '960px': '75vw' }} style={{ width: '55vw' }} draggable={false}>
                <FormProduct productModel={productModel} from={from} changeFunction={changeFunction} clickSubmit={submitProduct} clickCancel={() => closeForm()} error={errors} listVariant={variant} listCategory={category} changeImage={changeImage} />
            </Dialog>

        </>

    )
}