import React, { useEffect, useState } from "react"
import { Dropdown } from 'primereact/dropdown';
import ProductService from "../../services/product";

const FormProduct = (props) => {
    const productModel = props.productModel
    const [imageName, setImageName] = useState(productModel.Image ? productModel.Image : "")
    const [fileImage, setFileImage] = useState(null)

    const upload = async (e) => {
        let file = e.target.files[0]
        setImageName(file.name)
        props.changeImage(file.name)

        let url = URL.createObjectURL(file)

        const formData = new FormData();
        formData.append('image', file, file.name)

        try {
            const response = await ProductService.uploadImg(formData);
            setFileImage(url)
            if (response?.success === true) {
                // setCategory(response.result)
                console.log(response)
            } else {
                // setCategory([])
            }
            // setLoading(false)
        } catch (err) {
            throw err;
        } finally {
            // setLoading(false)
        }

    }

    useEffect(() => {
        if(productModel.Image){
            setFileImage("http://localhost:8088/" + productModel.Image)
        }
    }, [productModel])

    return (
        <>
            <div class="card-body col-12 flex">
                <div className="col-6">
                    <div class="form-group">
                        <label for="NameProduct">Name Product</label>
                        <input value={productModel.NameProduct} onChange={props.changeFunction("NameProduct")} type="text" className="form-control" id="NameProduct" placeholder="Enter name Product" readOnly={props.from === "detail" || props.from === 'delete' ? true : false} />
                        <small style={{ color: 'red' }}>{props.error["NameProduct"] ? props.error["NameProduct"] : ""}</small>
                    </div>
                    <div class="form-group">
                        <label for="Price">Price</label>
                        <input value={productModel.Price} onChange={props.changeFunction("Price")} type="text" className="form-control" id="Price" placeholder="Enter Price" readOnly={props.from === "detail" || props.from === 'delete' ? true : false} />
                        <small style={{ color: 'red' }}>{props.error["Price"] ? props.error["Price"] : ""}</small>
                    </div>
                    <div class="form-group">
                        <label for="Stock">Stock</label>
                        <input value={productModel.Stock} onChange={props.changeFunction("Stock")} type="text" className="form-control" id="Stock" placeholder="Enter Stock" readOnly={props.from === "detail" || props.from === 'delete' ? true : false} />
                        <small style={{ color: 'red' }}>{props.error["Stock"] ? props.error["Stock"] : ""}</small>
                    </div>
                </div>
                <div className="col-6">
                    <div class="form-group">
                        <label for="category">Category</label><br />
                        <Dropdown id="category" optionLabel="NameCategory" placeholder="Choose Category" style={{ width: '100%' }} value={productModel.IdCategory} options={props.listCategory} optionValue="id" onChange={props.changeFunction("IdCategory")} disabled={props.from === "detail" || props.from === 'delete' ? true : false} />
                        <small style={{ color: 'red' }}>{props.error["IdCategory"] ? props.error["IdCategory"] : ""}</small>
                    </div>
                    <div class="form-group">
                        <label for="variant">Variant</label><br />
                        <Dropdown id="variant" optionLabel="NameVariant" placeholder="Choose Variant" style={{ width: '100%' }} value={productModel.IdVariant} options={props.listVariant} optionValue="id" onChange={props.changeFunction("IdVariant")} disabled={props.from === "detail" || props.from === 'delete' ? true : false} />
                        <small style={{ color: 'red' }}>{props.error["IdVariant"] ? props.error["IdVariant"] : ""}</small>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputFile">Input Image</label>
                        <div class="input-group">
                            <div class="custom-file">
                                {
                                    props.from === "detail" || props.from === 'delete' ?
                                        <>
                                            <input type="text" className="custom-file-input" />
                                            <label class="custom-file-label" for="exampleInputFile">{imageName ? imageName : "Choose Image"}</label>
                                        </>
                                        :
                                        <>
                                            <input type="file" accept="image/*" className="custom-file-input" id="image_uploads" name="image_url" onChange={(e) => upload(e)} />
                                            <label readOnly={props.from === "detail" || props.from === 'delete' ? true : false} class="custom-file-label" for="exampleInputFile">{imageName ? imageName : "Choose Image"}</label>
                                        </>
                                }
                            </div>
                        </div>
                        <small style={{ color: 'red' }}>{props.error["Image"] ? props.error["Image"] : ""}</small>
                        {console.log(fileImage)}
                        {
                            fileImage && <div style={{ width: "100%", marginTop: '1rem', textAlign: "center" }}>
                                <img src={fileImage} style={{ width: "50%", height: "50%" }} alt="pict" />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div style={{ textAlign: 'end' }}>
                {
                    props.from !== "detail" && props.from !== 'delete' &&
                    <>
                        <button onClick={() => props.clickCancel()} class="btn btn-danger" style={{ marginRight: "0.5rem" }}>Cancel</button>
                        <button onClick={() => props.clickSubmit()} class="btn btn-primary">Submit</button>
                    </>
                }
                {
                    props.from === "delete" &&
                    <>
                        <button onClick={() => props.clickCancel()} class="btn btn-success" style={{ marginRight: "0.5rem" }}>Cancel</button>
                        <button onClick={() => props.clickSubmit()} class="btn btn-danger">Delete</button>
                    </>
                }
            </div>

        </>
    )
}

export default FormProduct