import React from "react"

const FormCategory = (props) => {
    const categoryModel = props.categoryModel
    return (
        <>
            <div class="card-body">
                <div class="form-group">
                    <label for="nameCategory">Name Category</label>
                    <input value={categoryModel.NameCategory} onChange={props.changeFunction("NameCategory")} type="text" class="form-control" id="nameCategory" placeholder="Enter name category" readOnly={props.from === "detail" || props.from === 'delete' ? true : false} />
                    <small style={{ color: 'red' }}>{props.error["NameCategory"] ? props.error["NameCategory"] : "" }</small>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input value={categoryModel.Description} onChange={props.changeFunction("Description")} type="text" class="form-control" id="description" placeholder="Enter description" readOnly={props.from === "detail" || props.from === 'delete' ? true : false} />
                    <small style={{ color: 'red' }}>{props.error["Description"] ? props.error["Description"] : ""}</small>
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

export default FormCategory