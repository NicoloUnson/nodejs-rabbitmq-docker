const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

const mongoose = require("mongoose")
require('dotenv').config()
const message = require("./message")
const indices = require("./models/indices")
const stockKeys = require("./constants/index");
const stock = require('./models/stock');
const volume = require('./models/volume');
const price = require('./models/price');
const bidandask = require('./models/bidandask');
const streammessages = require('./models/streammessages');



mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
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
        'fiftytwo_week_low': '52 week lowest price'
    }
    let a = JSON.parse(msg.content.toString());
    let b = Object.keys(a);

    try {
        let message = {symbol: a[b[0]]['Code'], data: {...a[b[0]]}};
        await streammessages.create(message);
        if(b.includes('Stock/Instrument Information')) {
            market = a[b[0]];
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
                if(Object.values(v).some(x=> u.includes(x))) {
                    let vol_names = Object.getOwnPropertyNames(v);
                    let vol = {}
                    for(key in vol_names) {
                        if(market[v[vol_names[key]]] !== undefined) {
                            vol[vol_names[key]] = market[v[vol_names[key]]]
                        }else {
                            vol[vol_names[key]] = 'NA'
                        }
                        
                    }
                    vol.stock = findStock[0]._id;
                    let vo = await volume.create(vol);
                }
                

                //prices model
                if(Object.values(p).some(x=> u.includes(x))) {
                    let pri_names = Object.getOwnPropertyNames(p)
                    let pri = {}
                    for(key in pri_names) {
                        if(market[p[pri_names[key]]] !== undefined) {
                            pri[pri_names[key]] = market[p[pri_names[key]]]
                        }else {
                            pri[pri_names[key]] = 'NA'
                        }
                        
                    }
                    pri.stock = findStock[0]._id;
                    let pr = await price.create(pri)
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
                if(bids !== {} || asks !=={}) {
                    let baa = {bids,asks,stock:findStock[0]._id}
                    let ba = await bidandask.create(baa);
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
    channel.prefetch(10);
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
