import React from "react";

export default class ChildStatefull extends React.Component {
    render() {
        const { angka1, angka2, incrementFunction } = this.props
        return (
            <div>
                <h1>kiriman dari props</h1>
                <p>Angka 1 = {angka1}</p>
                <p>Angka 2 = {angka2}</p>
                <button onClick={() => incrementFunction()}>increment</button>
            </div>
        )
    }
}