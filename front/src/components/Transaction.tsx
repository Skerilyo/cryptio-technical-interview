import React, { Component } from 'react'

interface Transaction {
    balanceIn: number;
    balanceOut: number;
    timestamp: number;
}

export class TransactionC extends Component<Transaction, Transaction> {
    constructor(props: Transaction) {
        super(props);

        this.state = {
            balanceIn: props.balanceIn,
            balanceOut: props.balanceOut,
            timestamp: props.timestamp
        }
    }   

    render() {
        const { balanceIn, balanceOut, timestamp } = this.state;
     
        return (
            <li style={{padding: 20}}>
                {balanceOut} at date: {new Date(timestamp*1000).toString()}
            </li>
        );
    }
}
export default TransactionC;