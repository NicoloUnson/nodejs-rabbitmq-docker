const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

const mongoose = require("mongoose")
require('dotenv').config()
const message = require("./message")
const indices = require("./indices")
const streammessage = require("./streamMessage")
mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => {
    console.log("Could not connect to database:", err);
  });
async function processMessage(msg) {
    let a = JSON.parse(msg.content.toString());

    let b = Object.keys(a);

    try {

        if(b.includes('Stock/Instrument Information')) {
            market = a[b[0]];
            
            let price_change = (market['Open Price'] - market['Price VWAP']) / (market['Open Price'] * 100)
            let o = {}

            let u = Object.keys(market);
            for(key in u) {
                o[u[key]] = market[u[key]];
            }
            let findStock = await streammessage.find({symbol: market['Code']})
            if(findStock.length > 0) {
                let newData = findStock[0].data;
                for(key in u) {
                    newData[u[key]] = market[u[key]];
                }
                let updateStock = await streammessage.findOneAndUpdate({symbol: market['Code']}, {data:{...newData}}, {new:true, upsert: true} )

            } else{
            let updateStock = await streammessage.findOneAndUpdate({symbol: market['Code']}, {data:{...o}}, {new:true, upsert: true} )

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
