import React, { Component } from 'react'
import TransactionC from './Transaction'

interface Input {
    addr: string,
    page: number
}

interface HistoricalBalance {
    addr: string;
    page: number;
    transactions: TransactionsResponse | undefined;
}

interface Transaction {
    balanceIn: number;
    balanceOut: number;
    timestamp: number;
}
  
interface TransactionsResponse {
    address: string;
    finalBalance: number;
    ntx: number;
    txs: Transaction[];
}

class HistoricalBalanceC extends Component<Input, HistoricalBalance> {
    constructor(props: Input) {
        super(props);

        this.state = {
            addr: props.addr,
            page: props.page,
            transactions: undefined
        }
    } 

    componentDidMount() {
        fetch(`http://localhost:8080/getBalance?addr=${this.state.addr}&page=${this.state.page}`)
          .then(response => response.json())
          .then(data => this.setState({ transactions: data }));
      }

    render() {
        const { addr, page, transactions } = this.state;
     
        return (
            <div>
                <div>Historical Balance for address: {addr}</div>
                <div>Final Balance: {transactions?.finalBalance}</div>
                <ul>
                    {transactions?.txs.map(item => (
                        <li key={item.timestamp}><TransactionC balanceIn={item.balanceIn} balanceOut={item.balanceOut} timestamp={item.timestamp}/></li>
                    ))}
                </ul>
            </div>
        );
    }
}
export default HistoricalBalanceC;