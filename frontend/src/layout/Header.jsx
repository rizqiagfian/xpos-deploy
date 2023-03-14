import React, { useState } from "react"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button";
import LoginService from "../services/login"
import { BlackoutLoading } from '../component/BlackoutLoading';

const Header = () => {
    const crypto = require('crypto')
    const [displayDialog, setDisplayDialog] = useState(false)
    const [displayDialogRegister, setDisplayDialogRegister] = useState(false)
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [registerModel, setRegisterModel] = useState({
        "NameCustomer": "",
        "NoHp": "",
        "Gender": "",
        "Address": "",
        "Email": "",
        "Password": ""
    })
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState({
        "NameCustomer": "",
        "NoHp": "",
        "Gender": "",
        "Address": "",
        "Email": "",
        "Password": ""
    })
    const [loading, setLoading] = useState(false)
    const [displayDialogSuccess, setDisplayDialogSuccess] = useState(false)
    const [displayDialogFail, setDisplayDialogFail] = useState(false)
    const [dialogMessageSuccess, setDialogMessageSuccess] = useState('')
    const [dialogMessageFail, setDialogMessageFail] = useState('')
    const [displayDialogSuccessRegister, setDisplayDialogSuccessRegister] = useState(false)

    // Change Login
    const changeEmail = (e) => {
        setEmail(e.target.value)
    }

    const changePassword = (e) => {
        setPass(e.target.value)
    }

    const clickLogin = () => {
        setDisplayDialogRegister(false)
        setDisplayDialog(true)
    }

    const clickLogout = () => {
        window.localStorage.clear()
        window.location.href = "/"
    }

    // Change register
    const changeFunction = name => ({ target: { value } }) => {
        setRegisterModel({
            ...registerModel,
            [name]: value
        })

        setError({
            ...error,
            [name]: ""
        })
    }

    const clickRegister = () => {
        setDisplayDialog(false)
        setDisplayDialogRegister(true)
    }

    const validateFunction = async () => {
        let error = {}
        let isValid = false

        if (!registerModel["NameCustomer"]) {
            isValid = false
            error["NameCustomer"] = "Name can not be empty"
        }

        if (!registerModel["NoHp"]) {
            isValid = false
            error["NoHp"] = "No Hp can not be empty"
        }

        if (!registerModel["Email"]) {
            isValid = false
            error["Email"] = "Email can not be empty"
        }

        if (!registerModel["Gender"]) {
            isValid = false
            error["Gender"] = "Gender can not be empty"
        }

        if (!registerModel["Address"]) {
            isValid = false
            error["Address"] = "Address can not be empty"
        }

        if (!registerModel["Password"]) {
            isValid = false
            error["Password"] = "Password can not be empty"
        } else {
            if (registerModel["Password"] !== confirmPassword) {
                isValid = false
                error["Password"] = "Password not match"
            }
        }

        if (registerModel["NameCustomer"] && registerModel["NoHp"] && registerModel["Gender"] && registerModel["Gender"] && registerModel["Address"] && (registerModel["Password"] === confirmPassword)) {

            // CHECK EMAIL
            let data = {
                "Email": registerModel.Email,
            }

            const response = await LoginService.cekEmail(data);

            if (response?.success === true) {
                if (response.result === true) {
                    isValid = true
                } else {
                    isValid = false
                    error["Email"] = "Email already exist"
                }
            } else {
                isValid = false
                error["Email"] = "Email already exist"
            }
        }

        setError(error)

        return isValid
    }

    const goRegister = async () => {
        if (await validateFunction()) {

            let data = {
                "user": {
                    "Email": registerModel.Email,
                    "Password": registerModel.Password
                },
                "customer": {
                    "NameCustomer": registerModel.NameCustomer,
                    "NoHp": registerModel.NoHp,
                    "Gender": registerModel.Gender,
                    "Address": registerModel.Address
                }
            }

            try {
                const response = await LoginService.goRegister(data);
                if (response?.success === true) {
                    setDialogMessageSuccess(response.result)
                    setDisplayDialogSuccessRegister(true)
                }
                setLoading(false)
            } catch (err) {
                setDialogMessageFail(err)
                setDisplayDialogFail(true)
                throw err;
            } finally {
                setLoading(false)
            }
        }
    }

    const clickSuccesRegister = () => {
        setDisplayDialogRegister(false)
        setDisplayDialogSuccessRegister(false)
        setDisplayDialog(true)
    }

    const goLogin = async () => {
        setLoading(true)

        let data = {
            "Email": email,
            "Password": pass,
            // "PasswordEncrypt": encryptedUpassword2
        }

        try {
            const response = await LoginService.goLogin(data);
            if (response?.success === true) {
                await localStorage.setItem('data', JSON.stringify(response.result))
                window.location.href = '/catalog'
                // setDialogMessageSuccess(response.message)
                // setDisplayDialogSuccess(true)
            } else {
                setDisplayDialogFail(true)
                setDialogMessageFail(response.message)
            }
            setLoading(false)
        } catch (err) {
            setDialogMessageFail(err.message)
            setDisplayDialogFail(true)
            throw err;
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <nav class="main-header navbar navbar-expand navbar-white navbar-light" style={{ margin: `${localStorage.getItem("data") ? "" : "0"}` }}>
                {/* <!-- Left navbar links --> */}
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="index3.html" class="nav-link">Home</a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="#" class="nav-link">Contact</a>
                    </li>
                </ul>

                {/* <!-- Right navbar links --> */}
                <ul class="navbar-nav ml-auto">
                    {/* <!-- Navbar Search --> */}
                    <li class="nav-item">
                        <a class="nav-link" data-widget="navbar-search" href="#" role="button">
                            <i class="fas fa-search"></i>
                        </a>
                        <div class="navbar-search-block">
                            <form class="form-inline">
                                <div class="input-group input-group-sm">
                                    <input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
                                    <div class="input-group-append">
                                        <button class="btn btn-navbar" type="submit">
                                            <i class="fas fa-search"></i>
                                        </button>
                                        <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>

                    {/* <!-- Messages Dropdown Menu --> */}
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                            <i class="far fa-comments"></i>
                            <span class="badge badge-danger navbar-badge">3</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <a href="#" class="dropdown-item">
                                {/* <!-- Message Start --> */}
                                <div class="media">
                                    <img src="adminlte/dist/img/user1-128x128.jpg" alt="User Avatar" class="img-size-50 mr-3 img-circle" />
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            Brad Diesel
                                            <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>
                                        </h3>
                                        <p class="text-sm">Call me whenever you can...</p>
                                        <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                    </div>
                                </div>
                                {/* <!-- Message End --> */}
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                {/* <!-- Message Start --> */}
                                <div class="media">
                                    <img src="adminlte/dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3" />
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            John Pierce
                                            <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span>
                                        </h3>
                                        <p class="text-sm">I got your message bro</p>
                                        <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                    </div>
                                </div>
                                {/* <!-- Message End --> */}
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                {/* <!-- Message Start --> */}
                                <div class="media">
                                    <img src="adminlte/dist/img/user3-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3" />
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            Nora Silvester
                                            <span class="float-right text-sm text-warning"><i class="fas fa-star"></i></span>
                                        </h3>
                                        <p class="text-sm">The subject goes here</p>
                                        <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>
                                    </div>
                                </div>
                                {/* <!-- Message End --> */}
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
                        </div>
                    </li>
                    {/* <!-- Notifications Dropdown Menu --> */}
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                            <i class="far fa-bell"></i>
                            <span class="badge badge-warning navbar-badge">15</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <span class="dropdown-item dropdown-header">15 Notifications</span>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <i class="fas fa-envelope mr-2"></i> 4 new messages
                                <span class="float-right text-muted text-sm">3 mins</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <i class="fas fa-users mr-2"></i> 8 friend requests
                                <span class="float-right text-muted text-sm">12 hours</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <i class="fas fa-file mr-2"></i> 3 new reports
                                <span class="float-right text-muted text-sm">2 days</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                            <i class="fas fa-expand-arrows-alt"></i>
                        </a>
                    </li>
                    {
                        localStorage.getItem("data") ?
                            <li class="nav-item" style={{ marginLeft: "1rem" }}>
                                <button type="button" class="btn btn-danger" onClick={() => clickLogout()}>Logout</button>
                            </li> : <li class="nav-item">
                                <button type="button" class="btn btn-primary" onClick={() => clickLogin()}>Login</button>
                            </li>
                    }
                </ul>
            </nav>

            {/* Dialog Login */}
            <Dialog className='form-add-category' blockScroll={true} header={"Login"} visible={displayDialog} onHide={() => setDisplayDialog(false)} breakpoints={{ '960px': '75vw' }} style={{ width: '30vw' }} draggable={false}>
                <div class="login-box">

                    <div class="card card-outline card-primary">
                        <div class="card-header text-center">
                            <a href="#" class="h1"><b>Admin</b>LTE</a>
                        </div>
                        <div class="card-body">
                            <p class="login-box-msg">Sign in to start your session</p>

                            <div class="input-group mb-3">
                                <input type="email" class="form-control" placeholder="Email" value={email} onChange={(e) => changeEmail(e)} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mb-3">
                                <input type="password" class="form-control" placeholder="Password" value={pass} onChange={(e) => changePassword(e)} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-8">
                                    <div class="icheck-primary">
                                        <input type="checkbox" id="remember" />
                                        <label for="remember">
                                            Remember Me
                                        </label>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <button type="button" class="btn btn-primary btn-block" onClick={() => goLogin()}>Sign In</button>
                                </div>

                            </div>

                            <p class="mb-1">
                                <a href="#">I forgot my password</a>
                            </p>
                            <p class="mb-0">
                                <a class="text-center" onClick={() => clickRegister()}>Register a new membership</a>
                            </p>
                        </div>

                    </div>

                </div>
            </Dialog>

            {/* Dialog Register */}
            <Dialog className='form-add-category' blockScroll={true} header={"Registrasi"} visible={displayDialogRegister} onHide={() => setDisplayDialogRegister(false)} breakpoints={{ '960px': '75vw' }} style={{ width: '30vw' }} draggable={false}>
                <div class="register-box">
                    <div class="register-logo">
                        <a href="#"><b>Admin</b>LTE</a>
                    </div>
                    <div class="card">
                        <div class="card-body register-card-body">
                            <p class="login-box-msg">Register a new membership</p>

                            <div class="input-group" style={{ marginBottom: error["NameCustomer"] ? "0" : "1rem" }} >
                                <input type="text" class="form-control" placeholder="Full name" value={registerModel.NameCustomer} onChange={changeFunction("NameCustomer")} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-user"></span>
                                    </div>
                                </div>
                            </div>
                            <small style={{ color: 'red' }}>{error["NameCustomer"] ? error["NameCustomer"] : ""}</small>

                            <div class="input-group" style={{ marginBottom: error["Email"] ? "0" : "1rem" }}>
                                <input type="email" class="form-control" placeholder="Email" value={registerModel.Email} onChange={changeFunction("Email")} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <small style={{ color: 'red' }}>{error["Email"] ? error["Email"] : ""}</small>

                            <div class="input-group" style={{ marginBottom: error["NoHp"] ? "0" : "1rem" }}>
                                <input class="form-control" placeholder="No Hp" value={registerModel.NoHp} onChange={changeFunction("NoHp")} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <small style={{ color: 'red' }}>{error["NoHp"] ? error["NoHp"] : ""}</small>

                            <div class="input-group" style={{ marginBottom: error["Gender"] ? "0" : "1rem" }}>
                                <input class="form-control" placeholder="Gender" value={registerModel.Gender} onChange={changeFunction("Gender")} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <small style={{ color: 'red' }}>{error["Gender"] ? error["Gender"] : ""}</small>

                            <div class="input-group" style={{ marginBottom: error["Address"] ? "0" : "1rem" }}>
                                <input class="form-control" placeholder="Address" value={registerModel.Address} onChange={changeFunction("Address")} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <small style={{ color: 'red' }}>{error["Address"] ? error["Address"] : ""}</small>

                            <div class="input-group" style={{ marginBottom: error["Password"] ? "0" : "1rem" }}>
                                <input type="password" class="form-control" placeholder="Password" value={registerModel.Password} onChange={changeFunction("Password")} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <small style={{ color: 'red' }}>{error["Password"] ? error["Password"] : ""}</small>

                            <div class="input-group" style={{ marginBottom: "1rem" }}>
                                <input type="password" class="form-control" placeholder="Retype password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <div class="input-group-append">
                                    <div class="input-group-text">
                                        <span class="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-8">
                                    <div class="icheck-primary">
                                        <input type="checkbox" id="agreeTerms" name="terms" value="agree" />
                                        <label for="agreeTerms">
                                            I agree to the <a href="#">terms</a>
                                        </label>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <button type="button" class="btn btn-primary btn-block" onClick={() => goRegister()}>Register</button>
                                </div>

                            </div>

                            <a onClick={() => clickLogin()} class="text-center">I already have a membership</a>
                        </div>

                    </div>
                </div>
            </Dialog>

            <BlackoutLoading loading={loading} />

            {/* Dialog success */}
            <Dialog blockScroll={true} className="dialog-response" header={"Informasi"} visible={displayDialogSuccess} onHide={() => window.location.href = '/catalog'} breakpoints={{ '960px': '75vw' }} style={{ width: '40vw' }} draggable={false}>
                <div className="col-12">
                    <p style={{ width: '100%' }}>{dialogMessageSuccess}</p>
                </div>
                <div className="p-col-12" style={{ textAlign: 'end', marginTop: '0.5rem' }}>
                    <Button label="OK" style={{ textAlign: 'center', width: '5rem', backgroundColor: '#607d8b' }} onClick={() => window.location.href = '/catalog'} />
                </div>
            </Dialog>

            {/* Dialog success Register */}
            <Dialog blockScroll={true} className="dialog-response" header={"Informasi"} visible={displayDialogSuccessRegister} onHide={clickSuccesRegister} breakpoints={{ '960px': '75vw' }} style={{ width: '40vw' }} draggable={false}>
                <div className="col-12">
                    <p style={{ width: '100%' }}>{dialogMessageSuccess}</p>
                </div>
                <div className="p-col-12" style={{ textAlign: 'end', marginTop: '0.5rem' }}>
                    <Button label="OK" style={{ textAlign: 'center', width: '5rem', backgroundColor: '#607d8b' }} onClick={clickSuccesRegister} />
                </div>
            </Dialog>

            {/* Dialog Fail */}
            <Dialog blockScroll={true} className="dialog-response-fail" header={"Peringatan"} visible={displayDialogFail} onHide={() => setDisplayDialogFail(false)} breakpoints={{ '960px': '75vw' }} style={{ width: '40vw' }} draggable={false}>
                <div className="p-col-12 p-d-flex">
                    <p style={{ marginLeft: '10px', width: '100%' }}>{dialogMessageFail}</p>
                </div>
                <div className="p-col-12" style={{ textAlign: 'end', marginTop: '0.5rem' }}>
                    <Button label="OK" style={{ textAlign: 'center', width: '5rem', backgroundColor: '#D01224' }} onClick={() => setDisplayDialogFail(false)} />
                </div>
            </Dialog>

        </>
    )
}

export default Header