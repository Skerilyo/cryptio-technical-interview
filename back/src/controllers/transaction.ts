

export interface Transaction {
    balanceIn: number;
    balanceOut: number;
    timestamp: number;
  }
  
export interface TransactionsResponse {
    address: string;
    finalBalance: number;
    ntx: number;
    txs: Transaction[];
}

export function getTransactionHistoryBalance(res: any) {
    res.txs = res.txs.sort((a: any, b: any) => (a.time > b.time) ? 1 : -1)
    let response: TransactionsResponse = {address: res.address, finalBalance: 0, ntx: res.finalBalance, txs: []}
    for (let i in res.txs) {
        let transaction: Transaction = {balanceIn: response.finalBalance, balanceOut: 0, timestamp: res.txs[i].time}
        let balanceMod = 0
        for (let j in res.txs[i].inputs) {
            if (res.txs[i].inputs[j].prev_out.addr == response.address)
                balanceMod -= res.txs[i].inputs[j].prev_out.value
        }
        for (let j in res.txs[i].out) {
            if (res.txs[i].out[j].addr == response.address)
                balanceMod += res.txs[i].out[j].value
        }
        transaction.balanceOut = transaction.balanceIn + balanceMod
        response.finalBalance = transaction.balanceOut
        response.txs.push(transaction);
    }
    return response
}