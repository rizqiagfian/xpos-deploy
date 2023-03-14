module.exports = exports = (app, pool) => {

    const jwt = require('jsonwebtoken');

    app.post('/api/register', (req, res) => {
        const { user, customer } = req.body

        const query = `WITH "InsertUser" AS (
            INSERT INTO "TblUser" ("Email", "Password", "IsDelete", 
                                   "CreateBy", "CreateDate")
            VALUES ('${user.Email}', '${user.Password}', false, '1', now())
            RETURNING "IdUser"
            ),

            "InsertCustomer" AS (
            INSERT INTO "TblCustomer" ("IdUser", "NameCutomer", "NoHp", "Gender", "Address",
                                      "IsDelete", "CreateBy", "CreateDate")
            VALUES ((select "IdUser" from "InsertUser"),'${customer.NameCustomer}', 
                    '${customer.NoHp}', '${customer.Gender}', '${customer.Address}', false, '1', now())
            )
            SELECT * FROM "InsertUser";`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {
                res.status(200).send({
                    success: true,
                    result: `Data User & Customer Succesfuly saved`
                })
            }
        })
    })

    app.post('/api/login', (req, res) => {
        const { Email, Password} = req.body

        const query = `SELECT c."IdCutomer" as "IdCustomer",
        c."IdUser" as "IdUser",
        c."NameCutomer" as "NameCustomer",
        c."NoHp" as "NoHp",
        c."Gender" as "Gender",
        c."Address" as "Address",
        "TblUser"."Email" as "Email"
        FROM "TblCustomer" as c
        JOIN "TblUser" ON (c."IdUser" = "TblUser"."IdUser")
        WHERE "TblUser"."Email" = '${Email}'
        AND "TblUser"."Password" = '${Password}'
        AND "TblUser"."IsDelete" = false;`

        pool.query(query, (error, result) => {
            if (error) {
                res.status(500).send({
                    success: false,
                    result: error
                })
            } else {

                // Create token
                let accessToken = ""
                if (result.rows.length > 0) {
                    const expired = "1"
                    accessToken = 'Bearer ' + jwt.sign({
                        Email: result.rows[0].Email
                    }, 'xpos_secret_key', {
                        expiresIn: `${expired}m`.toString()
                    });
                }

                res.status(200).send({
                    success: result.rows.length > 0 ? true : false,
                    result: result.rows.length > 0 ?
                        {
                            ...result.rows[0],
                            "token": accessToken
                        } : "",
                    message: result.rows.length > 0 ? `Login Successfuly` : "Email or Password Not Correct"
                })
            }
        })
    })

    app.post('/api/cekemail', (req, res) => {
        const { Email } = req.body

        const query = `SELECT * FROM "TblUser"
        WHERE "TblUser"."Email" = '${Email}'
        AND "TblUser"."IsDelete" = false;`

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
                    result: result.rows.length > 0 ? false : true
                })
            }
        })
    })

}