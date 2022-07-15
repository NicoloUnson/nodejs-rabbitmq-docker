const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

const mongoose = require("mongoose")
require('dotenv').config()

const indices = require("./models/indices")
const stock = require('./models/stock');
const volume = require('./models/volume');
const price = require('./models/price');
const bidandask = require('./models/bidandask');
const newmessage = require("./models/newmessage");
const transactions = require("./models/transaction");
const kline = require("./models/klines");


mongoose.connect(`mongodb://localhost:27017/my_trade`, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => {
    console.log("Could not connect to database:", err);
  });

async function processMessage(msg) {
    const s = 
        {'short_name': 'Short name',
        'full_name': 'Full name',
        'symbol': 'Code',
        'isin': 'ISIN'}

    const v = {
        'last_transacted_volume': 'Last Transacted Volume',
        'total_traded_volume': 'Total Traded Volume',
        'total_sell_transaction_volume': 'Total Sell Transaction Volume',
        'total_buy_transaction_volume': 'Total Buy Transaction Volume'
    }
    
    const p = {
        'previous_day_closing_price': 'Previous Day Closing Price',
        'adjusted_previous_day_closing_price': 'Adjusted Previous Day Closing Price',
        'open_price': 'Open Price',
        'highest_price': 'Highest Price',
        'lowest_price': 'Lowest Price',
        'last_transacted_price': 'Last Transacted Price',
        'price_vwap': 'Price VWAP',
        'floor_price': 'Floor Price',
        'ceiling_price': 'Ceiling Price',
        'strike_price': 'Strike Price',
        'fiftytwo_week_high': '52 week highest price',
        'fiftytwo_week_low': '52 week lowest price',
        'value': 'Total Traded Value',
        'time_server': 'time_server'
    }

    const mes = {
        symbol: 'Code',
        short_name: 'Short name',
        full_name: 'Full name',
        share_per_lot: 'Share per lot',
        total_shares_issued: "Total Shares Issued",
        previous_day_closing_price: "Previous Day Closing Price",
        adjusted_previous_day_closing_price: "Adjusted Previous Day Closing Price",
        open_price: "Open Price",
        open_interest: "Open Interest",
        highest_price: "Highest Price",
        lowest_price: "Lowest Price",
        bid_qty_1st_level: "Bid Qty 1st Level",
        bid_qty_2nd_level: "Bid Qty 2nd Level",
        bid_qty_3rd_level: "Bid Qty 3rd Level",
        bid_qty_4th_level: "Bid Qty 4th Level",
        bid_qty_5th_level: "Bid Qty 5th Level",
        bid_qty_6th_level: "Bid Qty 6th Level",
        bid_qty_7th_level: "Bid Qty 7th Level",
        bid_qty_8th_level: "Bid Qty 8th Level",
        bid_qty_9th_level: "Bid Qty 9th Level",
        bid_qty_10th_level: "Bid Qty 10th Level",
        bid_price_1st_level: "Bid Price 1st Level",
        bid_price_2nd_level: "Bid Price 2nd Level",
        bid_price_3rd_level: "Bid Price 3rd Level",
        bid_price_4th_level: "Bid Price 4th Level",
        bid_price_5th_level: "Bid Price 5th Level"        ,
        bid_price_6th_level: "Bid Price 6th Level",
        bid_price_7th_level: "Bid Price 7th Level",
        bid_price_8th_level: "Bid Price 8th Level",
        bid_price_9th_level: "Bid Price 9th Level",
        bid_price_10th_level: "Bid Price 10th Level",
        ask_qty_1st_level: "Ask Qty 1st Level",
        ask_qty_2nd_level: "Ask Qty 2nd Level",
        ask_qty_3rd_level: "Ask Qty 3rd Level",
        ask_qty_4th_level: "Ask Qty 4th Level",
        ask_qty_5th_level: "Ask Qty 5th Level",
        ask_qty_6th_level: "Ask Qty 6th Level",
        ask_qty_7th_level: "Ask Qty 7th Level",
        ask_qty_8th_level: "Ask Qty 8th Level",
        ask_qty_9th_level: "Ask Qty 9th Level",
        ask_qty_10th_level: "Ask Qty 10th Level",
        ask_price_1st_level: "Ask Price 1st Level",
        ask_price_2nd_level: "Ask Price 2nd Level",
        ask_price_3rd_level: "Ask Price 3rd Level",
        ask_price_4th_level: "Ask Price 4th Level",
        ask_price_5th_level: "Ask Price 5th Level",
        ask_price_6th_level: "Ask Price 6th Level",
        ask_price_7th_level: "Ask Price 7th Level",
        ask_price_8th_level: "Ask Price 8th Level",
        ask_price_9th_level: "Ask Price 9th Level",
        ask_price_10th_level: "Ask Price 10th Level",
        last_transacted_price: "Last Transacted Price",
        last_transacted_volume: "Last Transacted Volume",
        last_transacted_value: "Last Transacted Value",
        total_traded_volume: "Total Traded Volume",
        total_traded_value: "Total Traded Value",
        transaction_number: "Transaction number",
        price_vwap: "Price VWAP",
        first_session_closing: "1st session closing price",
        bid_split_1: "Bid Split 1",
        bid_split_2: "Bid Split 2",
        bid_split_3: "Bid Split 3",
        bid_split_4: "Bid Split 4",
        bid_split_5: "Bid Split 5",
        bid_split_6: "Bid Split 6",
        bid_split_7: "Bid Split 7",
        bid_split_8: "Bid Split 8",
        bid_split_9: "Bid Split 9",
        bid_split_10: "Bid Split 10",
        ask_split_1: "Ask Split 1",
        ask_split_2: "Ask Split 2",
        ask_split_3: "Ask Split 3",
        ask_split_4: "Ask Split 4",
        ask_split_5: "Ask Split 5",
        ask_split_6: "Ask Split 6",
        ask_split_7: "Ask Split 7",
        ask_split_8: "Ask Split 8",
        ask_split_9: "Ask Split 9",
        ask_split_10: "Ask Split 10",
        floor_price: "Floor Price",
        ceiling_price: "Ceiling Price",
        total_sell_transaction_volume: "Total Sell Transaction Volume",
        total_buy_transaction_volume: "Total Buy Transaction Volume",
        total_number_of_buy_transaction_trades: "Total number of buy transaction trades",
        total_number_of_sell_transaction_trades:  "Total number of sell transaction trades",
        strike_price: "Strike Price",
        market_data_time:  "Market Data Time",
        market_data_date: "Market Data Date",
        fiftytwo_week_high: "52 week highest price",
        fiftytwo_week_low: "52 week lowest price",
        time_server: "time_server"
    }

    const transactionSchema = {
        transaction_number: 'Transaction number',
        last_transacted_price: 'Last Transacted Price',
        last_transacted_volume: 'Last Transacted Volum',
        last_transacted_value: 'Last Transacted Value',
        total_traded_volume: 'Total Traded Volume',
        total_traded_value: 'Total Traded Value',
        price_vwap: 'Price VWAP',
        total_buy_transaction_volume: 'Total Buy Transaction Volume',
        total_sell_transaction_volume: 'Total Sell Transaction Volume',
    }
    let a = JSON.parse(msg.content.toString());
    let b = Object.keys(a);

    try {
        
        if(b.includes('Stock/Instrument Information')) {
            let market = a[b[0]];
            // let message = {symbol: a[b[0]]['Code'], data: {...a[b[0]]}};
            // await streammessages.create(message);

            let mePNames = Object.keys(mes)
            let me = {}
            mePNames.map(x => {
                me[x] = market[mes[x]];
            })
            
            await newmessage.create(me);
            
            let u = Object.keys(market);
            
        
            let findStock = await stock.find({symbol: market['Code']})
            let o = {}
            let propert_names = Object.getOwnPropertyNames(s);
            for(key in propert_names) {
                o[propert_names[key]] = market[s[propert_names[key]]]
            }
            let st = await stock.findOneAndUpdate({symbol: market['Code']},o,{ upsert: true, new: true, setDefaultsOnInsert: true });
            if(findStock.length === 0) {
            } else {
                //volume model
                if(Object.values(v).every(x=> u.includes(x))) {
                    let vol_names = Object.getOwnPropertyNames(v);
                    let vol = {}
                    for(key in vol_names) {
                        if(market[v[vol_names[key]]] !== undefined) {
                            vol[vol_names[key]] = market[v[vol_names[key]]]
                        }else {
                            vol[vol_names[key]] = 0
                        }
                        
                    }
                    vol.stock = findStock[0]._id;
                    let vo = await volume.create(vol);
                    let updateStockValues = {
                        'volume': market['Last Transacted Volume'],
                        'trades': market['Total Traded Volume']
                    }
                    await stock.findByIdAndUpdate({_id:findStock[0]._id }, updateStockValues)

                }
                

                //prices model
                if(Object.values(p).every(x=> u.includes(x))) {
                    let pri_names = Object.getOwnPropertyNames(p)
                    let pri = {}
                    for(key in pri_names) {
                        if(market[p[pri_names[key]]] !== undefined) {
                            pri[pri_names[key]] = market[p[pri_names[key]]]
                        }else {
                            pri[pri_names[key]] = 0
                        }
                        
                    }
                    pri.stock = findStock[0]._id;
                    let pr = await price.create(pri)
                    
                    let price_change =  ((market['Last Transacted Price'] -  market['Open Price'])/market['Open Price']) * 100;

                    let updateStockValues = {
                        'open_price': market['Open Price'] ? market['Open Price'] : 0,
                        'high_price': market['Highest Price'] ? market['Highest Price'] : 0,
                        'low_price': market['Lowest Price'] ? market['Lowest Price']: 0,
                        'curr_price': market['Last Transacted Price'] ? market['Last Transacted Price']: 0,
                        'fiftytwo_week_high': market['52 week highest price']? market['52 week highest price']: 0,
                        'fiftytwo_week_low': market['52 week lowest price'] ? market['52 week lowest price'] : 0,
                        'volume': market['Total Traded Volume'] ? market['Total Traded Volume']:0,
                        'market_cap': market['Total Traded Value'] ? market['Total Traded Value'] :0,
                        'price_change': price_change ? price_change : 0,
                        'value':price_change
                    }

                    await stock.findByIdAndUpdate({_id:findStock[0]._id }, updateStockValues, {upsert: true, new: true, setDefaultsOnInsert: true})
                }
                
                //bid and ask model 

                let bids = {}
                let asks = {}
                u.forEach(function(x) {
                    if(x.includes('Bid'))  {
                        bids[x] = market[x]
                    }else if (x.includes('Ask')) {
                        asks[x] = market[x]
                    } 
                })
                if(bids !== {} || asks !== {}) {
                    let ba = await bidandask.findOneAndUpdate({symbol:market['Code']},{bids,asks,time:market['Market Data Time']},{new:true,upsert: true });
                }

                if(Object.values(transactionSchema).some(x => u.includes(x))) {
                    let newTransaction = {}
                    Object.keys(transactionSchema).map( x => {
                        newTransaction[x] = market[transactionSchema[x]];
                    })
                    newTransaction['symbol'] = market['Code'];
                    newTransaction['time_server']= market['time_server'];
                    newTransaction['market_data_time'] = market['Market Data Time']
                    if(newTransaction.transaction_number !== 0 && newTransaction.transaction_number !== null) {
                        await transactions.create(newTransaction);
                    }

                    await stock.findByIdAndUpdate({_id:findStock[0]._id }, {curr_price:market['Last Transacted Price']}, {upsert: true, new: true, setDefaultsOnInsert: true})
                    
                }

                if(u.includes('Last Transacted Price')) {
                    let klineObject = {}
                    
                    let updatedStock = {curr_price:market['Last Transacted Price'] }

                    let s1 = await stock.findOne({symbol: market['Code']})
                    if(market['Last Transacted Price'] > s1.high_price) {
                        updatedStock['high_price'] =  market['Last Transacted Price'];
                    } else if (market['Last Transacted Price'] < s1.low_price) {
                        updatedStock['low_price'] = market['Last Transacted Price'];
                    }

                    let s2 = await stock.findOneAndUpdate({symbol:market['Code']}, updatedStock, {upsert: true});
                    
                    klineObject['close_price'] = market['Last Transacted Price'];
                    klineObject['symbol'] = market['Code']
                    klineObject['high_price'] = market['Highest Price'] ? market['Highest Price'] : s2.high_price;
                    klineObject['low_price'] = market['Lowest Price'] ? market['Lowest Price'] : s2.low_price;
                    klineObject['open_price'] = market['Open Price'] ? market['Open Price'] : s2.open_price;
                    klineObject['time'] = market['time_server'];
                    await kline.create(klineObject);
                }
                
            }
           
        }

        if(b.includes('Indices Information')) {
            market = a[b[0]]
            let indicesInfo = await indices.create({
                symbol: market['Code'],
                name:  market['Name'],
                close_price:  market['Previous Closing Value'],
                open_price:  market['Open Value'],
                high_price: market['Highest Value'],
                low_price:  market['Lowest Value'],
                price: market['Current Value'],
                datetime: new Date()
            })
        }
    } catch (error) {
        throw error
    }
}

(async () => {
    const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
    const channel = await connection.createChannel();
    channel.prefetch(50);
    const queue = 'pse.stream_messages';
    process.once('SIGINT', async () => {
        console.log('got sigint, closing connection');
        await channel.close();
        await connection.close();
        process.exit(0);
    });

    await channel.assertQueue(queue, { durable: true });
    await channel.consume(
        queue,
        async (msg) => {
            console.log('processing messages');
            await processMessage(msg);
            //save stock info to database
            await channel.ack(msg);
        },
        {
            noAck: false,
            consumerTag: 'saving_to_db'
        }
    );
    console.log(' [*] Waiting for messages. To exit press CTRL+C');
})();
