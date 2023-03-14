const jwt = require("jsonwebtoken")

module.exports = exports = (app, pool) => {

    app.get('/api/allcategory', (req, res) => {
        const query = `SELECT * FROM "TblCategory" WHERE "IsDelete" = false ORDER BY "TblCategory"."id"`

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
    app.post('/api/allcategorybyfilter', (req, res) => {

        // Validasi header token
        try {
            let tokenHeader = req.headers['x-access-token'];

            if (!tokenHeader) {
                return res.status(401).send({
                    response_message: "Token tidak ditemukan"
                });
            }

            if (tokenHeader.split(' ')[0] !== 'Bearer') {
                return res.status(401).send({
                    response_message: "Format token salah"
                });
            }

            let token = tokenHeader.split(' ')[1];

            if (!token) {
                return res.status(401).send({
                    response_message: "Token tidak tersedia"
                });
            }

            // Verify access token
            jwt.verify(token, "xpos_secret_key", (err, decoded) => {
                if (err) {
                    return res.status(401).send({
                        response_message: "Token yang anda masukan tidak dikenali"
                    });
                }

                const date = new Date((decoded.exp) * 1000).toISOString()

                // Jika token ada data email dan masih aktif baru proses get data
                if (decoded.Email && (new Date(date) > new Date())) {

                    const { search, first, rows, sortOrder, sortField } = req.body
                    const qFilter = search !== "" ? `AND "NameCategory" ilike '%${search}%' ` : ""

                    const query = `SELECT * FROM "TblCategory" WHERE "IsDelete" = false ${qFilter} ORDER BY "${sortField}" ${sortOrder === 1 ? "ASC" : "DESC"} LIMIT ${rows} OFFSET ${first} `

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
                } else {
                    res.status(200).send({
                        success: true,
                        result: [],
                        message: "Token sudah expired"
                    })
                }
            })

        } catch (e) {
            return res.send({
                response_error: e.message
            });
        }

    })

    // Count Category
    app.post('/api/countcategory', (req, res) => {

        // Validasi header token
        try {
            let tokenHeader = req.headers['x-access-token'];

            if (!tokenHeader) {
                return res.status(401).send({
                    response_message: "Token tidak ditemukan"
                });
            }

            if (tokenHeader.split(' ')[0] !== 'Bearer') {
                return res.status(401).send({
                    response_message: "Format token salah"
                });
            }

            let token = tokenHeader.split(' ')[1];

            if (!token) {
                return res.status(401).send({
                    response_message: "Token tidak tersedia"
                });
            }

            // Verify access token
            jwt.verify(token, "xpos_secret_key", (err, decoded) => {

                // kalau format token salah dan sudah expired masuk err
                if (err) {
                    return res.status(401).send({
                        response_message: "Token yang anda masukan tidak dikenali"
                    });
                }

                // Jika token ada data email
                if (decoded.Email) {

                    const { search } = req.body
                    const qFilter = search !== "" ? `AND "NameCategory" ilike '%${search}%' ` : ""

                    const query = `SELECT COUNT("id") as "Jumlah" FROM "TblCategory" WHERE "IsDelete" = false ${qFilter}`

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
                }
            })

        } catch (e) {
            return res.send({
                response_error: e.message
            });
        }

    })

    // Find by id
    app.get('/api/categorybyid/:id', (req, res) => {
        const id = req.params.id
        const query = `SELECT * FROM "TblCategory" WHERE "IsDelete" = false AND id = ${id}`

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

    app.post('/api/addcategory', (req, res) => {
        const { NameCategory, Description, CreateBy } = req.body

        const query = `INSERT INTO public."TblCategory"(
            "NameCategory", "Description", "CreateBy", "CreateDate", "IsDelete")
            VALUES ('${NameCategory}', '${Description}', '${CreateBy}', now(), false)`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: `Data ${NameCategory} Succesfuly saved`
                })
            }
        })
    })

    app.put('/api/updatecategory/:id', (req, res) => {
        const id = req.params.id
        const { NameCategory, Description, UpdateBy } = req.body

        const query = `UPDATE public."TblCategory"
        SET "NameCategory"= '${NameCategory}', 
        "Description"='${Description}', 
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
                    result: `Data ${NameCategory} Succesfuly updated`
                })
            }
        })
    })

    // Soft delete
    app.put('/api/deletecategory/:id', (req, res) => {
        const id = req.params.id
        const { NameCategory, UpdateBy } = req.body

        const query = `UPDATE public."TblCategory"
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
                    result: `Data ${NameCategory} Succesfuly soft delete`
                })
            }
        })
    })

    // Hard delete
    app.delete('/api/deletecategory/:id', (req, res) => {
        const id = req.params.id
        const { NameCategory } = req.body

        const query = `DELETE FROM public."TblCategory"
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
                    result: `Data ${NameCategory} Succesfuly hard delete`
                })
            }
        })
    })

    // Find all category join with variant
    app.get('/api/allcategoryvariant', (req, res) => {
        const query = `SELECT cat."id" as "idCategory",
        cat."NameCategory" as "NameCategory",
        cat."Description" as "DescriptionCategory",
        "TblVariant"."id" as "idVariant",
        "TblVariant"."NameVariant" as "NameVariant",
        "TblVariant"."Description" as "DescriptionVariant"
        FROM "TblCategory" as cat
        JOIN "TblVariant" ON (cat."id" = "TblVariant"."idCategory")
        WHERE cat."IsDelete" = false;`

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

    // Find by id category join with variant
    app.get('/api/categoryvariantbyid/:id', (req, res) => {
        const id = req.params.id
        const query = `SELECT cat."id" as "idCategory",
        cat."NameCategory" as "NameCategory",
        cat."Description" as "DescriptionCategory",
        "TblVariant"."id" as "id",
        "TblVariant"."NameVariant" as "NameVariant",
        "TblVariant"."Description" as "DescriptionVariant"
        FROM "TblCategory" as cat
        JOIN "TblVariant" ON (cat."id" = "TblVariant"."idCategory")
        WHERE cat."IsDelete" = false AND cat."id" = ${id};`

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