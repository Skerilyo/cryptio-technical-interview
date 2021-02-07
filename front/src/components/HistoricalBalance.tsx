import React, { Component } from 'react'
import TransactionC from './Transaction'

import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';

import { Animation } from '@devexpress/dx-react-chart';

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

    getChartTab() : any[] {
        let data: any[] = []
        if (this.state.transactions != undefined) {
            for (let i = 0; i < this.state.transactions.txs.length; i++) {
                data.push({balance: this.state.transactions.txs[i].balanceOut, timestamp: (new Date(this.state.transactions.txs[i].timestamp * 1000)).toLocaleString('fr-FR').split(' ')[0]})
            }
        }
        return data
    }

    render() {
        const { addr, page, transactions } = this.state;
     
        return (
            <div>
                <div>Historical Balance for address: {addr}</div>
                <div>Final Balance: {transactions?.finalBalance}</div>

                {/* <ul>
                    {transactions?.txs.map(item => (
                        <li key={item.timestamp}><TransactionC balanceIn={item.balanceIn} balanceOut={item.balanceOut} timestamp={item.timestamp}/></li>
                    ))}
                </ul> */}
                <Paper>
                    <Chart
                        data={this.getChartTab()}
                    >
                    <ArgumentAxis />
                    <ValueAxis />

                    <BarSeries
                        valueField="balance"
                        argumentField="timestamp"
                    />
                    <Title text="Historical Balance" />
                    <Animation />
                    </Chart>
                </Paper>
            </div>
        );
    }
}
export default HistoricalBalanceC;