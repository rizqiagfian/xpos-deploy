import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';

export const FormCatalog = (props) => {
    const [dataList, setDataList] = useState(props.dataList)
    const [showCount, setShowCount] = useState(false)
    const [counter, setCounter] = useState(0)
    const [stock, setStock] = useState(props.dataList.Stock)
    const [objProduct, setObjProduct] = useState({
        "Id": props.dataList.Id,
        "NameProduct": props.dataList.NameProduct,
        "Price": props.dataList.Price,
        "Qty": 0,
        "Amount": 0
    })

    const clickAdd = (price) => {
        if (counter === 0) {
            setCounter(counter + 1)
            props.incrementProduct()
            props.incrementPrice(parseInt(price))
            setStock(stock - 1)

            setObjProduct({
                ...objProduct,
                "Qty": counter + 1,
                "Amount": parseInt(props.dataList.Price) * (counter + 1)
            })

        }
        setShowCount(true)
    }

    const clickPlus = (price) => {
        if (counter < parseInt(dataList.Stock)) {
            setCounter(counter + 1)
            props.incrementProduct()
            props.incrementPrice(parseInt(price))
            setStock(stock - 1)

            setObjProduct({
                ...objProduct,
                "Qty": counter + 1,
                "Amount": parseInt(props.dataList.Price) * (counter + 1)
            })
        }
    }

    const clickMinus = (price) => {
        if (counter > 1) {
            setCounter(counter - 1)
            setStock(stock + 1)

            setObjProduct({
                ...objProduct,
                "Qty": counter - 1,
                "Amount": parseInt(props.dataList.Price) * (counter - 1)
            })

        } else if (counter === 1) {
            setCounter(0)
            setShowCount(false)
            setStock(props.dataList.Stock)

            // Set Obj Product as default
            setObjProduct({
                ...objProduct,
                "Qty": 0,
                "Amount": 0
            })

            // remove product from list cart
            let arr = props.listCart
            let index = arr.findIndex((data) => data.Id === objProduct.Id)
            props.listCart.splice(index, 1)

        }
        props.decrementProduct()
        props.decrementPrice(parseInt(price))
    }

    useEffect(() => {
        setDataList(props.dataList)
    }, [props])

    useEffect(() => {
        if (objProduct.Qty !== 0) {
            let arr = props.listCart

            if (arr.findIndex((data) => data.Id === objProduct.Id) !== -1) {
                let index = arr.findIndex((data) => data.Id === objProduct.Id)
                props.listCart.splice(index, 1)
                props.listCart.push(objProduct)
            } else {
                props.listCart.push(objProduct)
            }

            console.log(props.listCart)

        }
    }, [showCount, objProduct])

    useEffect(() => {
        setCounter(0)
        setShowCount(false)
        setStock(props.dataList.Stock)
        setObjProduct({
            "Id": props.dataList.Id,
            "NameProduct": props.dataList.NameProduct,
            "Price": props.dataList.Price,
            "Qty": 0,
            "Amount": 0
        })
    }, [props.resetCatalog])

    return (
        <>
            <div class="col-md-4">

                <div class="card card-primary card-outline">
                    <div class="card-body box-profile">
                        <div class="text-center">
                            <img class="profile-user-img img-fluid img-circle" src={"http://localhost:8088/" + dataList.Image} style={{ height: '7rem', width: '7rem' }} alt="pict" />
                        </div>
                        <h3 class="profile-username text-center">{dataList.NameProduct}</h3>
                        <p class="text-muted text-center">{dataList.NameCategory}</p>
                        <ul class="list-group list-group-unbordered mb-3">
                            <li class="list-group-item">
                                <b>Price</b> <a class="float-right">{dataList.Price}</a>
                            </li>
                            <li class="list-group-item">
                                <b>Stock</b> <a class="float-right">{stock}</a>
                            </li>
                        </ul>
                        <a class="btn btn-primary btn-block" onClick={() => clickAdd(dataList.Price)}><b>Add to cart</b></a>
                        {
                            showCount &&
                            <div className='col-12 grid fluid' style={{ margin: '1rem 0 0 0' }} key={showCount}>
                                <div className='col-4' style={{ textAlign: 'left' }}><Button className='btn-danger' onClick={() => clickMinus(dataList.Price)}>-</Button></div>
                                <p className='col-4' style={{ textAlign: 'center' }}>{counter}</p>
                                <div className='col-4' style={{ textAlign: 'end' }}><Button className='btn-success' onClick={() => clickPlus(dataList.Price)}>+</Button></div>
                            </div>
                        }
                    </div>

                </div>

            </div>
        </>

    )
}