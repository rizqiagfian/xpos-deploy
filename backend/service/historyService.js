module.exports = exports = (app, pool) => {

    // Find All with parameter
    app.post('/api/allhistorybyfilter', (req, res) => {
        const { search, first, rows, sortOrder, sortField } = req.body
        const qFilter = search !== "" ? `AND "CodeTransaction" ilike '%${search}%' ` : ""

        const query = `SELECT * FROM "TblOrderHeader" WHERE "IsDelete" = false ${qFilter} ORDER BY "${sortField}" ${sortOrder === 1 ? "ASC" : "DESC"} LIMIT ${rows} OFFSET ${first} `

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

    // Count Category
    app.post('/api/counthistory', (req, res) => {
        const { search } = req.body
        const qFilter = search !== "" ? `AND "CodeTransaction" ilike '%${search}%' ` : ""

        const query = `SELECT COUNT("IdOrderHeader") as "Jumlah" FROM "TblOrderHeader" WHERE "IsDelete" = false ${qFilter}`

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

    // find order detail join all tables
    app.get('/api/historydetail/:id', (req, res) => {
        const id = req.params.id
        const query = `SELECT d."IdOrderDetail" as "IdOrderDetail",
        d."Amount" as "Amount",
        d."Qty" as "Qty",
        d."IdProduct" as "IdProduct",
        "TblOrderHeader"."IdOrderHeader" as "IdOrderHeader",
        "TblProduct"."NameProduct" as "NameProduct",
        "TblProduct"."Price" as "Price",
        "TblVariant"."NameVariant" as "NameVariant",
        "TblCategory"."NameCategory" as "NameCategory"
        FROM "TblOrderDetail" as d
        JOIN "TblOrderHeader" ON (d."IdOrderHeader" = "TblOrderHeader"."IdOrderHeader")
        JOIN "TblProduct" ON (d."IdProduct" = "TblProduct"."Id")
        JOIN "TblVariant" ON ("TblProduct"."idVariant" = "TblVariant"."id")
        JOIN "TblCategory" ON ("TblCategory"."id" = "TblVariant"."idCategory")
        WHERE "TblOrderHeader"."IdOrderHeader" = ${id}
        AND d."IsDelete" = false;`

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