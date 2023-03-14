import React from "react"
import StatelessComponent from "../latihan"
import StatefullComponent from "../latihan/indexStateFull"
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { IndexCategory } from "../pages/category/indexCategory";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { IndexVariant } from "../pages/variant/indexVariant";
import { IndexProduct } from "../pages/product/indexProduct";
import { IndexCatalog } from "../pages/catalog/indexCatalog";
import { IndexHistory } from "../pages/history/indexHistory";

const Content = () => {
    return (
        <>
            <Header />
            {
                JSON.parse(localStorage.getItem("data"))?.token ?
                    <>
                        <Sidebar />
                        <div class="wrapperr">

                            <div class="content-wrapper" style={{ padding: '2rem' }}>
                                <section class="content">
                                    <div class="container-fluid">

                                        <Router>
                                            <Switch>
                                                <Route exact path="/stateless">
                                                    <StatelessComponent text="halo" />
                                                </Route>
                                                <Route exact path="/statefull">
                                                    <StatefullComponent />
                                                </Route>
                                                <Route exact path="/category">
                                                    <IndexCategory />
                                                </Route>
                                                <Route exact path="/variant">
                                                    <IndexVariant />
                                                </Route>
                                                <Route exact path="/product">
                                                    <IndexProduct />
                                                </Route>
                                                <Route exact path="/catalog">
                                                    <IndexCatalog />
                                                </Route>
                                                <Route exact path="/history-order">
                                                    <IndexHistory />
                                                </Route>
                                            </Switch>
                                        </Router>

                                    </div>
                                </section>
                            </div>
                        </div>
                        <Footer />
                    </> :
                    <div style={{ width: '100vw', height: '90vh', display: 'table-cell', textAlign: 'center', verticalAlign: 'middle' }}>
                        <h1>Welcome to XPOS (Xsis Point of Sale)</h1>
                        <h2>Please Sign in or Register to access the application</h2>
                    </div>

            }
        </>
    )

}

export default Content