import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from 'primereact/dialog';
import CategoryService from '../../services/category';
import FormCategory from './FormCategory';

export const IndexCategory = () => {
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
    const [categoryModel, setCategoryModel] = useState({
        NameCategory: "",
        Description: "",
        CreateBy: 1,
        UpdateBy: null,
        IsDelete: false
    })
    const [from, setFrom] = useState("")
    const [errors, setErrors] = useState({
        "NameCategory": "",
        "Description": ""
    })

    const changeFunction = name => ({ target: { value } }) => {
        setCategoryModel({
            ...categoryModel,
            [name]: value
        })
        setErrors({
            ...errors,
            [name]: ""
        })
    }

    const nameBodyTemplate = (data) => {
        return (
            <>
                <span>{data.NameCategory}</span>
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
                    <Button className="p-button-success" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="edit category" onClick={() => clickEdit(data)} ><i className="pi pi-pencil mr-2" style={{ fontSize: '14px' }} />Edit</Button><br />
                    <Button className="p-button-warning" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="detail category" onClick={() => clickDetail(data)} ><i className='pi pi-folder mr-2' style={{ fontSize: '14px' }} />Detail</Button><br />
                    <Button className="p-button-danger" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="delete category" onClick={() => clickDelete(data)}><i className='pi pi-trash mr-2' style={{ fontSize: '14px' }} />Delete</Button><br />
                </div>
            </>
        )
    }

    const headerTemplate = (<>
        <div className='col-12' style={{ textAlign: 'left', padding: '0' }}>
            <div class="card-header" style={{ padding: '0', border: 'none' }}>
                <Button onClick={() => clickAdd()} tooltip="add category" className="p-button-primary" style={{ padding: '2px 10px' }}><span><i className='pi pi-plus' style={{ marginRight: '5px' }}></i></span>Add</Button>
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

    const getList = async () => {
        setLoading(true)
        try {
            const response = await CategoryService.getAll();
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
            const response = await CategoryService.getAllFilter(data);
            if (response?.success === true) {
                setDataList(response.result)
                // setTotalRecords(response?.jumlah)
            } else {
                setDataList([])
                setDialogMessageFail(response?.error?.response?.data?.response_message)
                setDisplayDialogFail(true)
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
            const response = await CategoryService.countData(data);
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

    const addCategory = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        try {
            const response = await CategoryService.addData(categoryModel);
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

    const editCategory = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        let data = {
            "NameCategory": categoryModel.NameCategory,
            "Description": categoryModel.Description,
            "UpdateBy": 1
        }

        try {
            const response = await CategoryService.EditData(categoryModel.id, data);
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

    const deleteCategory = async () => {
        setDisplayDialogAdd(false)
        setLoading(true)

        let data = {
            "NameCategory": categoryModel.NameCategory,
            "UpdateBy": 1
        }

        // Soft delete
        try {
            const response = await CategoryService.SoftDeleteData(categoryModel.id, data);
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
        //     const response = await CategoryService.HardDeleteData(categoryModel.id, { "NameCategory": data.NameCategory })
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

    const submitCategory = async () => {
        if (validateFunction()) {
            if (from === 'add') {
                addCategory()
            } else if (from === 'edit') {
                editCategory()
            } else if (from === 'delete') {
                deleteCategory()
            }
        }
    }

    const closeForm = () => {
        setDisplayDialogAdd(false)
        setCategoryModel({
            ...categoryModel,
            NameCategory: "",
            Description: "",
            CreateBy: 1,
            UpdateBy: null,
            IsDelete: false
        })
        setErrors({ "NameCategory": "", "Description": "" })
    }

    const clickAdd = () => {
        setFrom("add")
        setDisplayDialogAdd(true)
    }

    const clickEdit = async (data) => {
        setLoading(true)
        try {
            const response = await CategoryService.getById(data.id);
            if (response?.success === true) {
                // setCategoryModel({
                //     ...categoryModel,
                //     NameCategory: response.result.NameCategory,
                //     Description: response.result.Description,
                //     CreateBy: response.result.CreateBy,
                //     UpdateBy: response.result.UpdateBy,
                //     IsDelete: response.result.IsDelete
                // })
                setCategoryModel(response.result)
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
            const response = await CategoryService.getById(data.id);
            if (response?.success === true) {
                setCategoryModel(response.result)
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
        setCategoryModel({
            id: data.id,
            NameCategory: data.NameCategory,
            Description: data.Description,
            CreateBy: data.CreateBy,
            UpdateBy: data.UpdateBy,
            IsDelete: data.IsDelete
        })
        setDisplayDialogAdd(true)
    }

    const validateFunction = () => {
        let errors = {}
        let isValid = false

        if (!categoryModel["NameCategory"]) {
            isValid = false
            errors["NameCategory"] = "Name Category can not be empty"
        }

        if (!categoryModel["Description"]) {
            isValid = false
            errors["Description"] = "Description can not be empty"
        }

        if (categoryModel["NameCategory"] && categoryModel["Description"]) {
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
        }
        fetchData();
    }, [lazyParams])

    return (

        <>
            <div className='main-layout'>

                <Accordion activeIndex={0}>
                    <AccordionTab header={"TABLE CATEGORY"}>
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
                                    field="NameCategory"
                                    header="Name Category"
                                    headerStyle={{ width: "30%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={nameBodyTemplate}
                                    style={{ wordBreak: 'break-word', textAlign: "center" }}
                                    sortable
                                />
                                <Column
                                    field="description"
                                    header="Description"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "35%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={descriptionBodyTemplate}
                                />
                                <Column
                                    field="action"
                                    header="Action"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "25%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
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

            {/* Dialog Form Category */}
            <Dialog className='form-add-category' blockScroll={true} header={from === "edit" ? "Edit Category" : from === "add" ? "Add Category" : from === 'detail' ? "Detail" : "Delete"} visible={displayDialogAdd} onHide={() => closeForm()} breakpoints={{ '960px': '75vw' }} style={{ width: '40vw' }} draggable={false}>
                <FormCategory categoryModel={categoryModel} from={from} changeFunction={changeFunction} clickSubmit={submitCategory} clickCancel={() => closeForm()} error={errors} />
            </Dialog>

        </>

    )
}