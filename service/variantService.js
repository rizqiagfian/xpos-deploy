module.exports = exports = (app, pool) => {

    app.get('/api/allvariant', (req, res) => {
        const query = `SELECT * FROM "TblVariant" WHERE "IsDelete" = false`

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
    app.post('/api/allvariantbyfilter', (req, res) => {
        const { search, first, rows, sortOrder, sortField } = req.body
        const qFilter = search !== "" ? `AND "NameVariant" ilike '%${search}%' ` : ""

        // const query = `SELECT * FROM "TblVariant" WHERE "IsDelete" = false ${qFilter} ORDER BY "${sortField}" ${sortOrder === 1 ? "ASC" : "DESC"} LIMIT ${rows} OFFSET ${first} `

        const query = `SELECT v."id" as "id", 
        v."NameVariant" as "NameVariant", 
        v."Description" as "Description",
        "TblCategory"."id" as "idCategory",
        "TblCategory"."NameCategory" as "Category",
        "TblCategory"."Description" as "DescriptionCategory"
        FROM "TblVariant" as v
        JOIN "TblCategory" ON (v."idCategory" = "TblCategory".id)
        WHERE v."IsDelete" = false
        ${qFilter} ORDER BY "${sortField}" ${sortOrder === 1 ? "ASC" : "DESC"} LIMIT ${rows} OFFSET ${first} `

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

    // Count Variant
    app.post('/api/countvariant', (req, res) => {
        const { search } = req.body
        const qFilter = search !== "" ? `AND "NameVariant" ilike '%${search}%' ` : ""

        const query = `SELECT COUNT("id") as "Jumlah" FROM "TblVariant" WHERE "IsDelete" = false ${qFilter}`

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
    app.get('/api/variantbyid/:id', (req, res) => {
        const id = req.params.id
        const query = `SELECT * FROM "TblVariant" WHERE "IsDelete" = false AND id = ${id}`

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

    app.post('/api/addvariant', (req, res) => {
        const { NameVariant, Description, idCategory, CreateBy } = req.body

        const query = `INSERT INTO public."TblVariant"(
            "NameVariant", "Description", "idCategory", "CreateBy", "CreateDate", "IsDelete")
            VALUES ('${NameVariant}', '${Description}', '${idCategory}', '${CreateBy}', now(), false)`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: `Data ${NameVariant} Succesfuly saved`
                })
            }
        })
    })

    app.put('/api/updatevariant/:id', (req, res) => {
        const id = req.params.id
        const { NameVariant, Description, idCategory, UpdateBy } = req.body

        const query = `UPDATE public."TblVariant"
        SET "NameVariant"= '${NameVariant}', 
        "Description"='${Description}', 
        "idCategory"= ${idCategory}, 
        "UpdateBy"='${UpdateBy}', 
        "UpdateDate"= now()
        WHERE "id" = ${id};`

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
                    result: `Data ${NameVariant} Succesfuly updated`
                })
            }
        })
    })

    // Soft delete
    app.put('/api/deletevariant/:id', (req, res) => {
        const id = req.params.id
        const { NameVariant, UpdateBy } = req.body

        const query = `UPDATE public."TblVariant"
        SET "IsDelete" = true,
        "UpdateBy"='${UpdateBy}', 
        "UpdateDate"= now()
        WHERE "id" = ${id};`

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
                    result: `Data ${NameVariant} Succesfuly soft delete`
                })
            }
        })
    })

    // Hard delete
    app.delete('/api/deletevariant/:id', (req, res) => {
        const id = req.params.id
        const { NameVariant } = req.body

        const query = `DELETE FROM public."TblVariant"
        WHERE "id" = ${id};`

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
                    result: `Data ${NameVariant} Succesfuly hard delete`
                })
            }
        })
    })

    // Find all variant join with category
    app.get('/api/allvariantcategory', (req, res) => {
        const query = `SELECT v."id" as "idVariant", 
        v."NameVariant" as "NameVariant", 
        v."Description" as "DescriptionVariant",
        "TblCategory"."id" as "idCategory",
        "TblCategory"."NameCategory" as "NameCategory",
        "TblCategory"."Description" as "DescriptionCategory"
        FROM "TblVariant" as v
        JOIN "TblCategory" ON (v."idCategory" = "TblCategory".id)
        WHERE v."IsDelete" = false;`

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

    // Find by id variant join with category
    app.get('/api/variantcategorybyid/:id', (req, res) => {
        const id = req.params.id
        const query = `SELECT v."id" as "idVariant", 
        v."NameVariant" as "NameVariant", 
        v."Description" as "DescriptionVariant",
        "TblCategory"."id" as "idCategory",
        "TblCategory"."NameCategory" as "NameCategory",
        "TblCategory"."Description" as "DescriptionCategory"
        FROM "TblVariant" as v
        JOIN "TblCategory" ON (v."idCategory" = "TblCategory".id)
        WHERE v."IsDelete" = false AND v."id" = ${id};`

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