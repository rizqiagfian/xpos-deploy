import React from "react"
import { Dropdown } from 'primereact/dropdown';

const FormVariant = (props) => {
    const variantModel = props.variantModel
    return (
        <>
            <div class="card-body">
                <div class="form-group">
                    <label for="nameVariant">Name Variant</label>
                    <input value={variantModel.NameVariant} onChange={props.changeFunction("NameVariant")} type="text" className="form-control" id="nameVariant" placeholder="Enter name Variant" readOnly={props.from === "detail" || props.from === 'delete' ? true : false} />
                    <small style={{ color: 'red' }}>{props.error["NameVariant"] ? props.error["NameVariant"] : ""}</small>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input value={variantModel.Description} onChange={props.changeFunction("Description")} type="text" className="form-control" id="description" placeholder="Enter description" readOnly={props.from === "detail" || props.from === 'delete' ? true : false} />
                    <small style={{ color: 'red' }}>{props.error["Description"] ? props.error["Description"] : ""}</small>
                </div>
                <div class="form-group">
                    <label for="category">Category</label><br />
                    <Dropdown id="category" optionLabel="NameCategory" placeholder="Choose Category" style={{ width: '100%' }} value={variantModel.idCategory} options={props.listCategory} optionValue="id" onChange={props.changeFunction("idCategory")} disabled={props.from === "detail" || props.from === 'delete' ? true : false} />
                    <small style={{ color: 'red' }}>{props.error["idCategory"] ? props.error["idCategory"] : ""}</small>
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

export default FormVariant