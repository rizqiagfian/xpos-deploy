const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../upload"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage })

module.exports = exports = (app, pool) => {

    // Upload File
    app.post(
        "/api/single",
        upload.single('image'),
        (req, res) => {
            const file = req.file.path;
            console.log(req.body)

            if (!file) {
                res.status(400).send({
                    status: false,
                    data: "No File is selected.",
                });
            }
            // menyimpan lokasi upload data contacts pada index yang diinginkan
            //   contacts[req.query.index].photo = req.file.path;
            let path = file.split("\\")
            let newPath = path[path.length - 1]
            res.status(200).send({
                success: true,
                result: newPath
            })
        }
    );

    app.get('/api/allproduct', (req, res) => {
        const query = `SELECT * FROM "TblProduct" WHERE "IsDelete" = false`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: result.rows
                })
            }
        })
    })

    // Find All with parameter
    app.post('/api/allproductbyfilter', (req, res) => {
        const { search, first, rows, sortOrder, sortField } = req.body
        const qFilter = search !== "" ? `AND "NameProduct" ilike '%${search}%' ` : ""

        const query = `SELECT * FROM "TblProduct" WHERE "IsDelete" = false ${qFilter} ORDER BY "${sortField}" ${sortOrder === 1 ? "ASC" : "DESC"} LIMIT ${rows} OFFSET ${first} `

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: result.rows
                })
            }
        })
    })

    // Count Product
    app.post('/api/countproduct', (req, res) => {
        const { search } = req.body
        const qFilter = search !== "" ? `AND "NameProduct" ilike '%${search}%' ` : ""

        const query = `SELECT COUNT("Id") as "Jumlah" FROM "TblProduct" WHERE "IsDelete" = false ${qFilter}`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: result.rows[0].Jumlah ? parseInt(result.rows[0].Jumlah) : 0
                })
            }
        })
    })

    // Find by id
    app.get('/api/productbyid/:id', (req, res) => {
        const id = req.params.id
        const query = `SELECT * FROM "TblProduct" WHERE "IsDelete" = false AND "Id" = ${id}`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: result.rows
                })
            }
        })
    })

    app.post('/api/addproduct', (req, res) => {
        const { NameProduct, Price, Stock, Image, IdVariant, CreateBy } = req.body

        const query = `INSERT INTO public."TblProduct"(
            "NameProduct", "Price", "Stock", "Image", "idVariant", "CreateBy", "CreateDate", "IsDelete")
            VALUES ('${NameProduct}', ${Price}, ${Stock}, '${Image}', ${IdVariant}, ${CreateBy}, now(), false)`

        console.log(query)

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: `Data ${NameProduct} Succesfuly saved`
                })
            }
        })
    })

    app.put('/api/updateproduct/:id', (req, res) => {
        const id = req.params.id
        const { NameProduct, Price, Stock, Image, IdVariant, UpdateBy } = req.body

        const query = `UPDATE public."TblProduct"
        SET "NameProduct"= '${NameProduct}', 
        "Price"=${Price}, 
        "Stock"=${Stock},
        "Image"='${Image}', 
        "idVariant"= ${IdVariant}, 
        "UpdateBy"='${UpdateBy}', 
        "UpdateDate"= now()
        WHERE "Id" = ${id};`

        pool.query(query, (error, result) => {
            if (error) {
                console.log(error)
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: `Data ${NameProduct} Succesfuly updated`
                })
            }
        })
    })

    // Soft delete
    app.put('/api/deleteproduct/:id', (req, res) => {
        const id = req.params.id
        const { NameProduct, UpdateBy } = req.body

        const query = `UPDATE public."TblProduct"
        SET "IsDelete" = true,
        "UpdateBy"='${UpdateBy}', 
        "UpdateDate"= now()
        WHERE "Id" = ${id};`

        console.log(query)

        pool.query(query, (error, result) => {
            if (error) {
                console.log(error)
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: `Data ${NameProduct} Succesfuly soft delete`
                })
            }
        })
    })

    // Hard delete
    app.delete('/api/deleteproduct/:id', (req, res) => {
        const id = req.params.id
        const { NameProduct } = req.body

        const query = `DELETE FROM public."TblProduct"
        WHERE "Id" = ${id};`

        console.log(query)

        pool.query(query, (error, result) => {
            if (error) {
                console.log(error)
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: `Data ${NameProduct} Succesfuly hard delete`
                })
            }
        })
    })

    // Find all product join with variant
    app.get('/api/allproductvariant', (req, res) => {
        const query = `SELECT p."Id" as "idProduct", 
        p."NameProduct" as "NameProduct", 
        p."Price" as "Price",
        p."Stock" as "Stock",
        "TblVariant"."id" as "idVariant",
        "TblVariant"."NameVariant" as "NameVariant",
        "TblVariant"."Description" as "DescriptionVariant"
        FROM "TblProduct" as p
        JOIN "TblVariant" ON (p."idVariant" = "TblVariant".id)
        WHERE p."IsDelete" = false;`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: result.rows
                })
            }
        })
    })

    // Find by id product join with variant
    app.get('/api/productvariantcategorybyid/:id', (req, res) => {
        const id = req.params.id
        const query = `SELECT p."Id" as "Id", 
        p."NameProduct" as "NameProduct", 
        p."Price" as "Price",
        p."Stock" as "Stock",
        p."Image" as "Image",
        "TblVariant"."id" as "IdVariant",
        "TblVariant"."NameVariant" as "NameVariant",
        "TblVariant"."Description" as "DescriptionVariant",
		"TblCategory"."id" as "IdCategory",
        "TblCategory"."NameCategory" as "NameCategory",
		"TblCategory"."Description" as "DescriptionCategory"
        FROM "TblProduct" as p
        JOIN "TblVariant" ON (p."idVariant" = "TblVariant".id)
		JOIN "TblCategory" ON ("TblVariant"."idCategory" = "TblCategory".id)
        WHERE p."IsDelete" = false AND p."Id" = ${id};`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: result.rows
                })
            }
        })
    })

}