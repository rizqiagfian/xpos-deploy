import React from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

const Sidebar = () => {
    const history = useHistory()
    const [menuActive, setMenuActive] = useState('')
    const [subMenuActive, setSubmenuActive] = useState('')

    const clickMenu = (from) => {
        const menu1 = ['/stateless', '/statefull']
        const menu2 = ['/category', '/variant', '/product']
        const menu3 = ['/catalog', '/history-order']
        // cek menu
        if (menu1.includes(from)) {
            setMenuActive('menu1')
        } else if (menu2.includes(from)) {
            setMenuActive('menu2')
        } else if (menu3.includes(from)) {
            setMenuActive('menu3')
        }

        // Cek submenu
        if (from === 'submenu1' || from === '/stateless') {
            setSubmenuActive('submenu1')
        } else if (from === 'submenu2' || from === '/statefull') {
            setSubmenuActive('submenu2')
        } else if (from === 'submenu3' || from === '/category') {
            setSubmenuActive('submenu3')
        } else if (from === 'submenu4' || from === '/variant') {
            setSubmenuActive('submenu4')
        } else if (from === 'submenu5' || from === '/product') {
            setSubmenuActive('submenu5')
        } else if (from === 'submenu6' || from === '/catalog') {
            setSubmenuActive('submenu6')
        } else if (from === 'submenu7' || from === '/history-order') {
            setSubmenuActive('submenu7')
        }
    }

    useEffect(() => {
        const url = history.location.pathname
        clickMenu(url)
    }, [])

    return (
        <>
            {/* <!-- Main Sidebar Container --> */}
            <aside class="main-sidebar sidebar-dark-primary elevation-4">
                {/* <!-- Brand Logo --> */}
                <a href="index3.html" class="brand-link">
                    <img src="./adminlte/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{ opacity: ".8" }} />
                    <span class="brand-text font-weight-light">XPOS</span>
                </a>

                {/* <!-- Sidebar --> */}
                <div class="sidebar">
                    {/* <!-- Sidebar user panel (optional) --> */}
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                            <img src="./adminlte/dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div class="info">
                            <a href="#" class="d-block">Welcome {JSON.parse(window.localStorage.getItem("data")).NameCustomer}!</a>
                        </div>
                    </div>

                    {/* <!-- SidebarSearch Form --> */}
                    <div class="form-inline">
                        <div class="input-group" data-widget="sidebar-search">
                            <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div class="input-group-append">
                                <button class="btn btn-sidebar">
                                    <i class="fas fa-search fa-fw"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Sidebar Menu --> */}
                    <nav class="mt-2">
                        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {/* <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library --> */}
                            <li class={`nav-item ${menuActive === "menu1" ? "menu-open" : ""}`}>
                                <a href="#" class={`nav-link ${menuActive === "menu1" ? "active" : ""} `}>
                                    <i class="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                        Latihan
                                        <i class="right fas fa-angle-left"></i>
                                    </p>
                                </a>
                                <ul class="nav nav-treeview">
                                    <li class="nav-item">
                                        <a href="/stateless" className={`nav-link ${subMenuActive === 'submenu1' ? 'active' : ''}`} onClick={() => clickMenu("submenu1")}>
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Stateless</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="/statefull" className={`nav-link ${subMenuActive === 'submenu2' ? 'active' : ''}`} onClick={() => clickMenu("submenu2")}>
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Statefull</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class={`nav-item ${menuActive === "menu2" ? "menu-open" : ""}`}>
                                <a href="#" class={`nav-link ${menuActive === "menu2" ? "active" : ""} `}>
                                    <i class="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                        Master
                                        <i class="right fas fa-angle-left"></i>
                                    </p>
                                </a>
                                <ul class="nav nav-treeview">
                                    <li class="nav-item">
                                        <a href="/category" className={`nav-link ${subMenuActive === 'submenu3' ? 'active' : ''}`} onClick={() => clickMenu("submenu3")}>
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Category</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="/variant" className={`nav-link ${subMenuActive === 'submenu4' ? 'active' : ''}`} onClick={() => clickMenu("submenu4")} >
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Variant</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="/product" className={`nav-link ${subMenuActive === 'submenu5' ? 'active' : ''}`} onClick={() => clickMenu("submenu5")} >
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Product</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class={`nav-item ${menuActive === "menu3" ? "menu-open" : ""}`}>
                                <a href="#" class={`nav-link ${menuActive === "menu3" ? "active" : ""} `}>
                                    <i class="nav-icon pi pi-shopping-cart"></i>
                                    <p>
                                        Transaction
                                        <i class="right fas fa-angle-left"></i>
                                    </p>
                                </a>
                                <ul class="nav nav-treeview">
                                    <li class="nav-item">
                                        <a href="/catalog" className={`nav-link ${subMenuActive === 'submenu6' ? 'active' : ''}`} onClick={() => clickMenu("submenu6")}>
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Catalog</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="/history-order" className={`nav-link ${subMenuActive === 'submenu7' ? 'active' : ''}`} onClick={() => clickMenu("submenu7")}>
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>History Order</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                    {/* <!-- /.sidebar-menu --> */}
                </div>
                {/* <!-- /.sidebar --> */}
            </aside>
        </>
    )
}

export default Sidebar