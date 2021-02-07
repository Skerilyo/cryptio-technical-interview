import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { nextTick } from 'process';
import {Transaction, TransactionsResponse, getTransactionHistoryBalance} from './controllers/transaction'
import fetch from 'node-fetch'
import axios from 'axios'
import { waitForDebugger } from 'inspector';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const app = express()
app.use(bodyParser.json({
  limit: '50mb',
  verify(req: any, res, buf, encoding) {
      req.rawBody = buf;
  }
}));
// Enable CORS for *
app.use(cors())

app.get('/ping', (_, res) => {
  res.send('pong')
})

app.get('/getBalance',  (req, res) => {
  let page: number = 0
  let addr: string = ''
  let toSend: Transaction;
  try {
    if (req.query && req.query.addr) {
      addr = req.query.addr as string
    }
    axios.get(`https://blockchain.info/rawaddr/${addr}?offset=0`).then((result) => result.data).then(async (result) => {
      if (result.n_tx > 50) {
        page += 1  
        while (result.n_tx - 50 * (page) > 0) {
          delay(2000)
          let tmp = await axios.get(`https://blockchain.info/rawaddr/${addr}?offset=${50 * page}`).then((resultp) => resultp.data).then((resultp) => {
            return resultp.txs
          }).catch((e)=> {
            console.error(e)
            return []
          })
          console.log(tmp.length)
          for (let i in tmp) {
            result.txs.push(tmp[i])
          }
          console.log(result.txs.length)
          page += 1
        }
      }
      res.send(getTransactionHistoryBalance(result))
    }).catch((e) => {console.error(e)})
  } catch (e) {
    console.error(e)
  }
})

const port = 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port} (${process.env.NODE_ENV ?? 'unknown environment'})`)
})
