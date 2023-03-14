module.exports = exports = (app, pool) => {


    function getCodeTransaction(callback) {
        // XPOS-01032023-00001
        let code = "XPOS-"

        let date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'short' }).format(new Date()).split('/').join('')

        const query = `SELECT "CodeTransaction" FROM "TblOrderHeader" ORDER BY "CodeTransaction" DESC LIMIT 1`

        pool.query(query, (error, result) => {
            if (error) {
                return {
                    success: false,
                    result: error
                }
            } else {
                if (result.rows.length === 0) {
                    return callback(code + date + "-00001")
                } else {
                    let lastCode = result.rows[0].CodeTransaction
                    let arrayCode = lastCode.split('-')
                    let digitInc = parseInt(arrayCode[2]) + 1

                    let newDigit = ("0000" + (digitInc.toString()).slice(-5))
                    return callback(code + date + "-" + newDigit)
                }
            }
        })
    }

    // Find All with parameter
    app.post('/api/allcatalogbyfilter', (req, res) => {
        const { search, first, rows, sortOrder, sortField } = req.body
        const qFilter = search !== "" ? `AND "NameProduct" ilike '%${search}%' ` : ""

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
        JOIN "TblVariant" ON (p."IdVariant" = "TblVariant".id)
		JOIN "TblCategory" ON ("TblVariant"."idCategory" = "TblCategory".id)
        WHERE p."IsDelete" = false ${qFilter} 
        ORDER BY "${sortField}" ${sortOrder === 1 ? "ASC" : "DESC"} 
        LIMIT ${rows} OFFSET ${first} `

        // console.log(query)

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

    // Submit order
    app.post('/api/submitorder', (req, res) => {
        const { header, listdetail } = req.body

        // console.log(header, listdetail)

        getCodeTransaction((code) => {
            console.log(code)

            let queryDetails = ''
            let queryProduct = ''

            listdetail.forEach(element => {
                queryDetails += queryDetails.length > 0 ? "," : ""
                queryDetails += `(
                    (SELECT "IdOrderHeader" FROM "InsertHeader"), 
                    ${element.Qty}, ${element.Amount}, ${element.Id}, false, 1, now()
                    )`

                queryProduct += queryProduct.length > 0 ? "," : ""
                queryProduct += `UpdateProduct${element.Id} AS (
                Update "TblProduct" Set "Stock" = "Stock" - ${element.Qty} WHERE "Id" = ${element.Id}
            )`
            });

            // console.log(queryDetails)

            const query = `WITH "InsertHeader" AS (
                INSERT INTO "TblOrderHeader" ("CodeTransaction", "IdCustomer", "TotalQty", "TotalAmount", "IsCheckout", "IsDelete", "CreateBy", "CreateDate") 
                VALUES ('${code}', 1, ${header.TotalProducts}, ${header.EstimatePrice}, true, false, 1, now())
                RETURNING "IdOrderHeader"),

                "InsertDetail" AS (
                    INSERT INTO "TblOrderDetail" 
                    ("IdOrderHeader", "Qty", "Amount", "IdProduct", "IsDelete", "CreateBy", "CreateDate") 
                    VALUES ${queryDetails}
                    ),

                    ${queryProduct}
                    SELECT * FROM "InsertHeader"`

            // console.log(query)

            pool.query(query, (error, result) => {
                if (error) {
                    res.status(500).send({
                        success: false,
                        result: error
                    })
                } else {
                    res.status(200).send({
                        success: true,
                        result: `Data Order Succesfuly saved`
                    })
                }
            })
        })

    })

    // Update order
    app.put('/api/submitorder', (req, res) => {
        const { header, listdetail } = req.body

        let queryDetails = ''
        let queryProduct = ''

        listdetail.forEach(element => {
            queryDetails += queryDetails.length > 0 ? "," : ""

            queryDetails += `(
                (SELECT "IdOrderHeader" FROM "InsertHeader"), 
                ${element.Qty}, ${element.Amount}, ${element.Id}, false, 1, now()
                )`

            queryProduct += queryProduct.length > 0 ? "," : ""
            queryProduct += `UpdateProduct${element.Id} AS (
                Update "TblProduct" Set "Stock" = "Stock" - ${element.Qty} WHERE "Id" = ${data.Id}
            )`
        });


        query = `WITH "InsertHeader" AS (
            INSERT INTO "TblOrderHeader" ("CodeTransaction", "IdCustomer", "TotalQty", "TotalAmount", "IsCheckout", "IsDelete", "CreateBy", "CreateDate") 
            VALUES ('${code}', 1, ${header.TotalProducts}, ${header.EstimatePrice}, true, false, 1, now())
            RETURNING "IdOrderHeader"),

            "InsertDetail" AS (
                INSERT INTO "TblOrderDetail" 
                ("IdOrderHeader", "Qty", "Amount", "IdProduct", "IsDelete", "CreateBy", "CreateDate") 
                VALUES ${queryDetails}
                ) 
                SELECT * FROM "InsertHeader"`

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
                    result: `Data Order Succesfuly saved`
                })
            }
        })

    })

}