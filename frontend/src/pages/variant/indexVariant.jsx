import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from 'primereact/dialog';
import VariantService from '../../services/variant'
import CategoryService from '../../services/category';
import FormVariant from './formVariant';

export const IndexVariant = () => {
    const history = useHistory()
    const [dataList, setDataList] = useState([])
    const [totalRecords, setTotalRecords] = useState(10)
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 5,
        sortOrder: 1,
        sortField: 'id'
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
    const [variantModel, setVariantModel] = useState({
        NameVariant: "",
        Description: "",
        idCategory: "",
        CreateBy: 1,
        UpdateBy: null,
        IsDelete: false
    })
    const [from, setFrom] = useState("")
    const [errors, setErrors] = useState({
        "NameVariant": "",
        "Description": "",
        "idCategory": ""
    })
    const [category, setCategory] = useState([])

    const changeFunction = name => (e) => {
        if (name === "idCategory") {
            setVariantModel({
                ...variantModel,
                [name]: e.value
            })
        } else {
            setVariantModel({
                ...variantModel,
                [name]: e.target.value
            })
        }
        setErrors({
            ...errors,
            [name]: ""
        })
    }

    const nameBodyTemplate = (data) => {
        return (
            <>
                <span>{data.NameVariant}</span>
            </>
        )
    }

    const descriptionBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Description}</span>
            </>
        )
    }

    const categoryBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Category}</span>
            </>
        )
    }

    const idBodyTemplate = (data) => {
        return (
            <>
                <span>{data.id}</span>
            </>
        )
    }

    const aksiBodyTemplate = (data) => {
        return (
            <>
                <div className='grid block'>
                    <Button className="p-button-success" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="edit variant" onClick={() => clickEdit(data)} ><i className="pi pi-pencil mr-2" style={{ fontSize: '14px' }} />Edit</Button><br />
                    <Button className="p-button-warning" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="detail variant" onClick={() => clickDetail(data)} ><i className='pi pi-folder mr-2' style={{ fontSize: '14px' }} />Detail</Button><br />
                    <Button className="p-button-danger" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="delete variant" onClick={() => clickDelete(data)}><i className='pi pi-trash mr-2' style={{ fontSize: '14px' }} />Delete</Button><br />
                </div>
            </>
        )
    }

    const headerTemplate = (<>
        <div className='col-12' style={{ textAlign: 'left', padding: '0' }}>
            <div class="card-header" style={{ padding: '0', border: 'none' }}>
                <Button onClick={() => clickAdd()} tooltip="add variant" className="p-button-primary" style={{ padding: '2px 10px' }}><span><i className='pi pi-plus' style={{ marginRight: '5px' }}></i></span>Add</Button>
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
            const response = await VariantService.getAllFilter(data);
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
            const response = await VariantService.countData(data);
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

    const addVariant = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        try {
            const response = await VariantService.addData(variantModel);
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
            setVariantModel({
                NameVariant: "",
                Description: "",
                idCategory: "",
                CreateBy: 1,
                UpdateBy: null,
                IsDelete: false
            })
        }
    };

    const editVariant = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        let data = {
            "NameVariant": variantModel.NameVariant,
            "Description": variantModel.Description,
            "UpdateBy": 1,
            "idCategory": parseInt(variantModel.idCategory)
        }

        try {
            const response = await VariantService.EditData(variantModel.id, data);
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
    };

    const deleteVariant = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        let data = {
            "NameVariant": variantModel.NameVariant,
            "UpdateBy": 1
        }

        // Soft delete
        try {
            const response = await VariantService.SoftDeleteData(variantModel.id, data);
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
        //     const response = await VariantService.HardDeleteData(variantModel.id, { "NameVariant": data.NameVariant })
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

    const submitVariant = async () => {
        if (validateFunction()) {
            if (from === 'add') {
                addVariant()
            } else if (from === 'edit') {
                editVariant()
            } else if (from === 'delete') {
                deleteVariant()
            }
        }
    }

    const closeForm = () => {
        setDisplayDialogAdd(false)
        setVariantModel({
            ...variantModel,
            NameVariant: "",
            Description: "",
            idCategory: "",
            CreateBy: 1,
            UpdateBy: null,
            IsDelete: false
        })
        setErrors({ "NameVariant": "", "Description": "" })
    }

    const clickAdd = () => {
        setFrom("add")
        setDisplayDialogAdd(true)
    }

    const clickEdit = async (data) => {
        setLoading(true)
        try {
            const response = await VariantService.getById(data.id);
            if (response?.success === true) {
                // setVariantModel({
                //     ...variantModel,
                //     NameVariant: response.result.NameVariant,
                //     Description: response.result.Description,
                //     CreateBy: response.result.CreateBy,
                //     UpdateBy: response.result.UpdateBy,
                //     IsDelete: response.result.IsDelete
                // })
                setVariantModel(response.result)
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
        try {
            const response = await VariantService.getById(data.id);
            if (response?.success === true) {
                setVariantModel(response.result)
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
        setFrom("delete")
        setVariantModel({
            id: data.id,
            NameVariant: data.NameVariant,
            Description: data.Description,
            idCategory: data.idCategory,
            CreateBy: data.CreateBy,
            UpdateBy: data.UpdateBy,
            IsDelete: data.IsDelete
        })
        setDisplayDialogAdd(true)
    }

    const validateFunction = () => {
        let errors = {}
        let isValid = false

        if (!variantModel["NameVariant"]) {
            isValid = false
            errors["NameVariant"] = "Name Variant can not be empty"
        }

        if (!variantModel["Description"]) {
            isValid = false
            errors["Description"] = "Description can not be empty"
        }

        if (!variantModel["idCategory"]) {
            isValid = false
            errors["idCategory"] = "Category can not be empty"
        }

        if (variantModel["NameVariant"] && variantModel["Description"] && variantModel["idCategory"]) {
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
            await getCategory()
        }
        fetchData();
    }, [lazyParams])

    return (

        <>
            <div className='main-layout'>

                <Accordion activeIndex={0}>
                    <AccordionTab header={"TABLE VARIANT"}>
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
                                    field="id"
                                    header="Id"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "10%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={idBodyTemplate}
                                    sortable
                                />
                                <Column
                                    field="NameVariant"
                                    header="Name Variant"
                                    headerStyle={{ width: "25%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={nameBodyTemplate}
                                    style={{ wordBreak: 'break-word', textAlign: "center" }}
                                    sortable
                                />
                                <Column
                                    field="description"
                                    header="Description"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "25%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={descriptionBodyTemplate}
                                />
                                <Column
                                    field="category"
                                    header="Category"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "20%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={categoryBodyTemplate}
                                />
                                <Column
                                    field="action"
                                    header="Action"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "20%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
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

            {/* Dialog Form Variant */}
            <Dialog className='form-add-category' blockScroll={true} header={from === "edit" ? "Edit Variant" : from === "add" ? "Add Variant" : from === 'detail' ? "Detail" : "Delete"} visible={displayDialogAdd} onHide={() => closeForm()} breakpoints={{ '960px': '75vw' }} style={{ width: '40vw' }} draggable={false}>
                <FormVariant variantModel={variantModel} from={from} changeFunction={changeFunction} clickSubmit={submitVariant} clickCancel={() => closeForm()} error={errors} listCategory={category} />
            </Dialog>

        </>

    )
}