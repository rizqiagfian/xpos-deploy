module.exports = exports = (app, pool) => {

    const jwt = require('jsonwebtoken');
    // function decrypt password
    const crypto = require("crypto")
    const doubleDecrypt = (str) => {
        let decipher2 = crypto.createDecipheriv('aes-128-cbc', '0123456789101213', '0123456789101112');
        let decryptedString2 = decipher2.update(str, 'hex', 'utf-8');
        decryptedString2 += decipher2.final('utf-8');

        let decipher = crypto.createDecipheriv('aes-256-cbc', '12345678112233445566778887654321', '0123456789101112');
        var decryptedString = decipher.update(decryptedString2, 'hex', 'utf-8');
        decryptedString += decipher.final('utf-8');

        return decryptedString;
    }

    app.post('/api/register', (req, res) => {
        const { user, customer } = req.body

        const passwordPlainText = doubleDecrypt(user.Password)
        const passwordHashPlaintext = crypto.createHash('md5').update(passwordPlainText).digest('hex')

        const query = `WITH "InsertUser" AS (
            INSERT INTO "TblUser" ("Email", "Password", "IsDelete", 
                                   "CreateBy", "CreateDate")
            VALUES ('${user.Email}', '${passwordHashPlaintext}', false, '1', now())
            RETURNING "IdUser"
            ),

            "InsertCustomer" AS (
            INSERT INTO "TblCustomer" ("IdUser", "NameCustomer", "NoHp", "Gender", "Address",
                                      "IsDelete", "CreateBy", "CreateDate")
            VALUES ((select "IdUser" from "InsertUser"),'${customer.NameCustomer}', 
                    '${customer.NoHp}', '${customer.Gender}', '${customer.Address}', false, '1', now())
            )
            SELECT * FROM "InsertUser";`

        // console.log(query)

        pool.query(query, (error, result) => {
            console.log(error)
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
        const { Email, PasswordEncrypt } = req.body

        const passwordPlainText = doubleDecrypt(PasswordEncrypt)
        const passwordHashPlaintext = crypto.createHash('md5').update(passwordPlainText).digest('hex')

        const query = `SELECT c."IdCutomer" as "IdCustomer",
        c."IdUser" as "IdUser",
        c."NameCustomer" as "NameCustomer",
        c."NoHp" as "NoHp",
        c."Gender" as "Gender",
        c."Address" as "Address",
        "TblUser"."Email" as "Email"
        FROM "TblCustomer" as c
        JOIN "TblUser" ON (c."IdUser" = "TblUser"."IdUser")
        WHERE "TblUser"."Email" = '${Email}'
        AND "TblUser"."Password" = '${passwordHashPlaintext}'
        AND "TblUser"."IsDelete" = false;`

        // console.log(query)

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
                    const expired = "60"
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