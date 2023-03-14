import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from 'primereact/dialog';
import CategoryService from '../../services/category';
import HistoryService from '../../services/history';

export const IndexHistory = () => {
    const history = useHistory()
    const [dataList, setDataList] = useState([])
    const [totalRecords, setTotalRecords] = useState(10)
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 5,
        sortOrder: -1,
        sortField: 'CreateDate'
    })
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }
    const [displayDialogAdd, setDisplayDialogAdd] = useState(false)
    const [displayDialog, setDisplayDialog] = useState(false)
    const [dialogMessage, setDialogMessage] = useState("")
    const [displayDialogFail, setDisplayDialogFail] = useState(false)
    const [dialogMessageFail, setDialogMessageFail] = useState("")
    const [historyModel, setHistoryModel] = useState(
        {
            "IdOrderDetail": "",
            "Amount": 0,
            "Qty": 0,
            "IdProduct": "",
            "IdOrderHeader": "",
            "NameProduct": "",
            "Price": 0,
            "NameVariant": "",
            "NameCategory": ""
        }
    )

    // row expansion
    const [orderDetail, setOrderDetail] = useState([])
    const [expandedRows, setExpandedRows] = useState({});

    // FUNCT UBAH FORMAT TGL
    const ubahTanggal = (e) => {
        const tglAkhir = new Date(e)
        const tglAkhir2 = new Intl.DateTimeFormat('id', { year: 'numeric', month: '2-digit', day: '2-digit' }).format((tglAkhir))

        return tglAkhir2.split('/').join('-')
    }

    const ubahJam = (e) => {
        const jAkhir = new Date(e)
        const jAkhir2 = new Intl.DateTimeFormat('id', { timeStyle: 'short' }).format(jAkhir)
        const jAkhir3 = jAkhir2.split(" ")

        return jAkhir3[0].split('.').join(':')
    }

    const dateBodyTemplate = (data) => {
        return (
            <>
                <span>{data.CreateDate ? ubahTanggal(data.CreateDate) : ""}</span>
            </>
        )
    }

    const codeBodyTemplate = (data) => {
        return (
            <>
                <span>{data.CodeTransaction}</span>
            </>
        )
    }

    const qtyBodyTemplate = (data) => {
        return (
            <>
                <span>{data.TotalQty}</span>
            </>
        )
    }

    const amountBodyTemplate = (data) => {
        return (
            <>
                <span>{data.TotalAmount}</span>
            </>
        )
    }

    const aksiBodyTemplate = (data) => {
        return (
            <>
                <div className='grid block'>
                    {/* <Button className="p-button-success" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="edit category" onClick={() => clickEdit(data)} ><i className="pi pi-pencil mr-2" style={{ fontSize: '14px' }} />Edit</Button><br /> */}
                    <Button className="p-button-warning" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="detail order" onClick={() => clickDetail(data)} ><i className='pi pi-folder mr-2' style={{ fontSize: '14px' }} />Detail</Button><br />
                    {/* <Button className="p-button-danger" style={{ margin: '2px', padding: '2px 5px', minWidth: '5rem', justifyContent: 'center', fontSize: '14px' }} tooltip="delete category" onClick={() => clickDelete(data)}><i className='pi pi-trash mr-2' style={{ fontSize: '14px' }} />Delete</Button><br /> */}
                </div>
            </>
        )
    }

    const headerTemplate = (<>
        <div className='col-12' style={{ textAlign: 'left', padding: '0' }}>
            <div class="card-header" style={{ padding: '0', border: 'none' }}>
                {/* <Button onClick={() => clickAdd()} tooltip="add category" className="p-button-primary" style={{ padding: '2px 10px' }}><span><i className='pi pi-plus' style={{ marginRight: '5px' }}></i></span>Add</Button> */}
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
            const response = await HistoryService.getAllFilter(data);
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
            const response = await HistoryService.countData(data);
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

    const clickDetail = async (data) => {
        setLoadingDetail(true)
        try {
            const response = await HistoryService.getDetailById(data.IdOrderHeader);
            if (response?.success === true) {
                setOrderDetail(response.result)
            }
            setLoadingDetail(false)
        } catch (err) {
            throw err;
        } finally {
            setLoadingDetail(false)
            expandClickDetail(data)
        }
    }

    const clickSearch = () => {
        getListByFilter()
        getCount()
    }

    const rowExpansionTemplate = (data) => {
        if (loadingDetail) {
            return (
                <div className="p-ml-3 p-mt-2">
                    <i className="p-ml-3 pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                </div>
            )
        } else {
            return (
                <div className='datatable-responsive-demo'>
                    <DataTable className="p-datatable-responsive-demo" responsive={true} rowHover emptyMessage="Tidak ada data." value={orderDetail} >
                        <Column field="NameProduct" header="Name Product" body={ProductBodyTemplate} />
                        <Column field="Price" header="Price" body={PriceBodyTemplate} />
                        <Column field="Quantitiy" header='Quantity' body={QtyBodyTemplate} />
                        <Column field="Amount" header="Sub Total" body={TotalBodyTemplate} />
                    </DataTable>
                </div>
            )
        }
    }

    const ProductBodyTemplate = (data) => {
        return (
            <>
                <span>{data.NameProduct} {" "} {`(${data.NameCategory}, ${data.NameVariant})`}</span>
            </>
        )
    }

    const PriceBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Price}</span>
            </>
        )
    }

    const QtyBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Qty}</span>
            </>
        )
    }

    const TotalBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Amount}</span>
            </>
        )
    }

    const expandClickDetail = (data) => {
        let temp = Object.keys(expandedRows)
        if (temp[0] === data.IdOrderHeader) {
            setExpandedRows({})
        } else {
            setExpandedRows({ [`${data.IdOrderHeader}`]: true })
        }
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
                    <AccordionTab header={"TABLE HISTORY"}>
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
                                dataKey="IdOrderHeader"
                                header={headerTemplate}
                                onSort={onSort}
                                sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                                expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} rowExpansionTemplate={rowExpansionTemplate}
                            >
                                <Column
                                    field="CreateDate"
                                    header="Date Transaction"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "20%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={dateBodyTemplate}
                                // sortable
                                />
                                <Column
                                    field="CodeTransaction"
                                    header="Code Transaction"
                                    headerStyle={{ width: "25%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={codeBodyTemplate}
                                    style={{ wordBreak: 'break-word', textAlign: "center" }}
                                // sortable
                                />
                                <Column
                                    field="TotalQty"
                                    header="Total Product"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "20%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={qtyBodyTemplate}
                                />
                                <Column
                                    field="TotalAmount"
                                    header="Total Amount"
                                    style={{ textAlign: "center", wordBreak: 'break-word' }}
                                    headerStyle={{ width: "20%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                    body={amountBodyTemplate}
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

        </>

    )
}