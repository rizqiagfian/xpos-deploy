import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import ProductService from '../../services/product';
import { Paginator } from 'primereact/paginator';
import { BlackoutLoading } from '../../component/BlackoutLoading';
import CatalogService from '../../services/catalog';
import { FormCatalog } from './formCatalog';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

export const IndexCatalog = () => {
    const history = useHistory()
    const [dataList, setDataList] = useState([])
    const [totalRecords, setTotalRecords] = useState(10)
    const [loading, setLoading] = useState(false)
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 3,
        sortOrder: 1,
        sortField: 'Id'
    })
    const [search, setSearch] = useState("")
    const [totalProducts, setTotalProducts] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [listCart, setListCart] = useState([])
    const [displayDialog, setDisplayDialog] = useState(false)
    const [displayDialogSuccess, setDisplayDialogSuccess] = useState(false)
    const [dialogMessageSuccess, setDialogMessageSuccess] = useState("")
    const [displayDialogFail, setDisplayDialogFail] = useState(false)
    const [dialogMessageFail, setDialogMessageFail] = useState("")
    const [resetCatalog, setResetCatalog] = useState(false)
    const onBasicPageChange = (event) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            rows: event.rows
        })
    }

    const getListByFilter = async () => {
        setLoading(true)

        let data = {
            "search": search,
            "first": lazyParams.first,
            // "rows": lazyParams.rows,
            "rows": 999999,
            "sortOrder": lazyParams.sortOrder,
            "sortField": lazyParams.sortField
        }

        try {
            const response = await CatalogService.getAllFilter(data);
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

    const incrementProduct = () => {
        setTotalProducts(totalProducts + 1)
    }

    const decrementProduct = () => {
        if (totalProducts > 0) {
            setTotalProducts(totalProducts - 1)
        }
    }

    const incrementPrice = (e) => {
        setTotalPrice(totalPrice + e)
    }

    const decrementPrice = (e) => {
        setTotalPrice(totalPrice - e)
    }

    const clickCheckout = () => {
        setDisplayDialog(true)
    }

    const idBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Id}</span>
            </>
        )
    }

    const nameBodyTemplate = (data) => {
        return (
            <>
                <span>{data.NameProduct}</span>
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

    const qtyBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Qty}</span>
            </>
        )
    }

    const amountBodyTemplate = (data) => {
        return (
            <>
                <span>{data.Amount}</span>
            </>
        )
    }

    let footerGroup = <ColumnGroup>
        <Row>
            <Column footer="Totals:" colSpan={3} footerStyle={{ textAlign: 'right' }} />
            <Column footer={totalProducts} style={{ textAlign: 'center' }} />
            <Column footer={totalPrice} style={{ textAlign: 'center' }} />
        </Row>
    </ColumnGroup>;

    const clickOrder = async () => {
        setDisplayDialog(false)
        setLoading(true)

        let data = {
            "listdetail": listCart,
            "header": {
                "TotalProducts": totalProducts,
                "EstimatePrice": totalPrice,
            }
        }

        try {
            const response = await CatalogService.submitOrder(data);
            if (response?.success === true) {
                setDialogMessageSuccess(response.result)
                setDisplayDialogSuccess(true)

                await getListByFilter()
            } else {
                setDialogMessageFail(response.result)
                setDisplayDialogFail(true)
            }
            setListCart([])
            setLoading(false)
        } catch (err) {
            setDialogMessageFail(err)
            setDisplayDialogFail(true)
            setListCart([])
            throw err;
        } finally {
            setLoading(false)
            setTotalPrice(0)
            setTotalProducts(0)
            setResetCatalog(!resetCatalog)
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

                <div className='col-12 grid'>

                    <div class="col-lg-4 col-12" style={{ minHeight: "4rem" }}>
                        <div class="small-box bg-info" style={{ height: "100%" }}>
                            <div class="inner">
                                <h3>{totalProducts}</h3>
                                <p>New Orders</p>
                            </div>
                            <div class="icon">
                                <i class="ion ion-bag"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 col-12" style={{ minHeight: "4rem" }}>

                        <div class="small-box bg-success" style={{ height: "100%" }}>
                            <div class="inner">
                                <h3>Rp. {totalPrice}</h3>
                                <p>Estimate Price</p>
                            </div>
                            <div class="icon">
                                <i class="ion ion-stats-bars"></i>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4 col-12" style={{ minHeight: "4rem" }}>

                        <div class="small-box bg-danger" style={{ height: "100%" }} onClick={() => clickCheckout()}>
                            <div class="inner">
                                <h4>Ready to Checkout?</h4>
                                <p>Checkout</p>
                            </div>
                            <div class="icon">
                                <i class="ion ion-pie-graph"></i>
                            </div>
                        </div>
                    </div>

                </div>

                <Accordion activeIndex={0}>
                    <AccordionTab header={"Catalog"}>
                        <div className='grid fluid col-12'>
                            {
                                dataList.length > 0 && dataList.map((item) => {
                                    return (
                                        <FormCatalog dataList={item} incrementProduct={incrementProduct} decrementProduct={decrementProduct} incrementPrice={incrementPrice} decrementPrice={decrementPrice} listCart={listCart} resetCatalog={resetCatalog} />
                                    )
                                })
                            }

                            {/* {
                                dataList.length > 0 &&
                                <>
                                    <div className='col-12' style={{ justifyContent: 'center' }}>
                                        <Paginator first={lazyParams.first} rows={lazyParams.rows} totalRecords={totalRecords} rowsPerPageOptions={[3, 6, 9]} onPageChange={onBasicPageChange} />
                                    </div>

                                </>
                            } */}

                        </div>

                    </AccordionTab>
                </Accordion>

            </div>

            <BlackoutLoading loading={loading} />

            {/* Dialog Summary Order */}
            <Dialog blockScroll={true} className="dialog-response" header={"Summary Order"} visible={displayDialog} onHide={() => setDisplayDialog(false)} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} draggable={false}>
                <div className="col-12">
                    <div className='datatable-responsive-demo'>
                        <DataTable
                            value={listCart}
                            className="p-datatable-responsive-demo"
                            rowHover
                            emptyMessage="Data Tidak Ditemukan."
                            // loading={loading}
                            showGridlines
                            footerColumnGroup={footerGroup}
                            // lazy
                            // paginator
                            // totalRecords={totalRecords}
                            // onPage={onPage}
                            // rowsPerPageOptions={[5, 10, 15]}
                            // first={lazyParams?.first}
                            // rows={lazyParams?.rows}
                            dataKey="id"
                        // header={headerTemplate}
                        // onSort={onSort}
                        // sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                        >
                            <Column
                                field="Id"
                                header="Id"
                                style={{ textAlign: "center", wordBreak: 'break-word' }}
                                headerStyle={{ width: "10%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                body={idBodyTemplate}
                            />
                            <Column
                                field="NameProduct"
                                header="Name Product"
                                headerStyle={{ width: "25%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                body={nameBodyTemplate}
                                style={{ wordBreak: 'break-word', textAlign: "center" }}
                            />
                            <Column
                                field="Price"
                                header="Price"
                                style={{ textAlign: "center", wordBreak: 'break-word' }}
                                headerStyle={{ width: "25%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                body={priceBodyTemplate}
                            />
                            <Column
                                field="Qty"
                                header="Quantity"
                                style={{ textAlign: "center", wordBreak: 'break-word' }}
                                headerStyle={{ width: "20%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                body={qtyBodyTemplate}
                            />
                            <Column
                                field="amount"
                                header="Amount"
                                style={{ textAlign: "center", wordBreak: 'break-word' }}
                                headerStyle={{ width: "20%", backgroundColor: "#3a526a", color: "#ffff", textAlign: 'center', wordBreak: 'break-word' }}
                                body={amountBodyTemplate}
                            />
                        </DataTable>
                    </div>
                </div>
                <div className="p-col-12" style={{ textAlign: 'end', marginTop: '0.5rem' }}>
                    <Button label="Order" style={{ textAlign: 'center', width: '5rem', backgroundColor: '#607d8b' }} onClick={() => clickOrder()} />
                </div>
            </Dialog>

            {/* Dialog success */}
            <Dialog blockScroll={true} className="dialog-response" header={"Informasi"} visible={displayDialogSuccess} onHide={() => window.location.href = '/history-order'} breakpoints={{ '960px': '75vw' }} style={{ width: '40vw' }} draggable={false}>
                <div className="col-12">
                    <p style={{ width: '100%' }}>{dialogMessageSuccess}</p>
                </div>
                <div className="p-col-12" style={{ textAlign: 'end', marginTop: '0.5rem' }}>
                    <Button label="OK" style={{ textAlign: 'center', width: '5rem', backgroundColor: '#607d8b' }} onClick={() => window.location.href = '/history-order'} />
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