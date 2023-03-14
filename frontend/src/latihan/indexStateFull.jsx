import React from "react";
import ChildStatefull from "./childStatefull";

export default class StatefullComponent extends React.Component {

    constructor() {
        super()
        this.state = {
            angka1: 20,
            angka2: 10,
            hasil: 0
        }
    }

    buttonFunction = (from) => {
        let { angka1, angka2 } = this.state;
        if (from === 'tambah') {
            let total = angka1 + angka2
            this.setState({
                hasil: total
            })
        } else if (from === 'kurang') {
            let total = angka1 - angka2
            this.setState({
                hasil: total
            })
        } else if (from === 'kali') {
            let total = angka1 * angka2
            this.setState({
                hasil: total
            })
        } else if (from === 'bagi') {
            let total = angka1 / angka2
            this.setState({
                hasil: total
            })
        }
    }

    incrementFunction = () => {
        let {angka1, angka2 } = this.state
        this.setState({
            angka1: angka1 + 1,
            angka2: angka2 + 1
        })
    }

    render() {
        const { angka1, angka2, hasil } = this.state
        return (
            <div>
                <p>ini adalah komponen StateFull Component</p>

                <h1>Pertambahan</h1>
                <p>Angka 1 = {angka1}</p>
                <p>Angka 2 = {angka2}</p>
                <p>Hasil = {hasil}</p>
                <button onClick={() => this.buttonFunction("tambah")}>+</button>
                <button onClick={() => this.buttonFunction("kurang")}>-</button>
                <button onClick={() => this.buttonFunction("kali")}>x</button>
                <button onClick={() => this.buttonFunction("bagi")}>/</button>

                <ChildStatefull angka1={angka1} angka2={angka2} incrementFunction={this.incrementFunction} />
            </div>
        )
    }
}