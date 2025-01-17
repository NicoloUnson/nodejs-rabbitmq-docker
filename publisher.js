const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

const publishMessage = async (message) => {
    const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
    const channel = await connection.createChannel();
    try {
        const exchange = 'pse.stream';
        const queue = 'pse.stream_messages';
        const routingKey = 'stream_messages';

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        await channel.publish(
            exchange,
            routingKey,
            Buffer.from(message)
        );
    } catch (e) {
        console.error('Error in publishing message', e);
    } finally {
        await channel.close();
        await connection.close();
    }
}

module.exports = {
    publishMessage
}