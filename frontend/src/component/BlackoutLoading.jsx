import React from "react";

export const BlackoutLoading = ({loading = false}) => {
    if (!loading) {
        return null
    }


    return (<div style={{
        position: 'fixed',
        right: '0',
        top: '0',
        left: '0',
        bottom: '0',
        zIndex: 9999999,
        backgroundColor: 'rgba(10, 10, 10, 0.76)'
    }}>
        <div style={{position: 'absolute', top: '50%', right: '50%', bottom: '50%', left: '45%'}}>
            <i className="p-mt-4 pi pi-spin pi-spinner" style={{fontSize: '3rem', color: 'yellow'}}></i>
        </div>
    </div>)
}
