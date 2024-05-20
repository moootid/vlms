import { Kafka } from "kafkajs";
import axios from 'axios';

console.log("Hello via Bun!");

const brokersUri = [Bun.env.DOMAIN + ':9092', Bun.env.DOMAIN + ':9093', Bun.env.DOMAIN + ':9094'];
const clients = new Set();
const uuidGroup = crypto.randomUUID();
async function checkGoogleStatus() {
    try {
        const response = await axios.get('https://www.google.com');
        console.log(response.status);
        if (response.status === 200) {
            console.log("Google is up and running!");
            console.log("Brokers are: ", brokersUri);
        }
    } catch (error) {
        console.error("Error checking Google status:", error);
    }
}

async function runConsumer() {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: brokersUri,
    });

    let vehicleData = [
        {
            id: "one",
            data: [52.504, -0.09]
        }
    ];
    console.log("Consumer ID: ", uuidGroup)
    const consumer = kafka.consumer({ groupId: uuidGroup });

    await consumer.connect();
    await consumer.subscribe({ topics: ['testing-topic'], fromBeginning: false });

    console.log("-------------------------------");

    const messageSerializer = (msg: any) => {
        console.log(vehicleData);
        if (msg.key && msg.value) {
            const coordinates = {
                id: msg.key.toString(),
                data: msg.value.toString().split(',').map(Number)
            };
            console.log(coordinates);

            const index = vehicleData.findIndex(item => item.id === coordinates.id);
            if (index !== -1) {
                vehicleData[index].data = coordinates.data;
            } else {
                vehicleData.push(coordinates);
            }

            console.log(vehicleData);
        }
        return {
            key: msg.key.toString(),
            value: msg.value.toString()
        };
    };

    await consumer.run({
        partitionsConsumedConcurrently: 1,
        eachMessage: async ({ topic, partition, message }: any) => {
            console.log(message.key.toString());
            console.log({
                value: message.value.toString()
            });
            messageSerializer(message);
            clients.forEach((client: any) => {
                if (client.readyState === 1) {  // 1 is the OPEN state
                    client.send(JSON.stringify(vehicleData));
                }
            });
        }
    });
}

function WebSocketServer() {
    // Create WebSocket server using Bun.serve
    console.log(Bun.env.PORT)
    let port = parseInt(Bun.env.PORT || '8080');
    Bun.serve({
        port: port,
        fetch(req, server) {
            if (server.upgrade(req)) {
                return; // the request is a WebSocket upgrade, and we've accepted it
            }

            // Otherwise, respond with a 426 Upgrade Required
            return new Response("Upgrade required", { status: 426 });
        },
        websocket: {
            open(ws) {
                console.log('Client connected');
                clients.add(ws);
            },
            message(ws, message) {
                // Handle incoming messages from clients if needed
                console.log(`Received message from client: ${message}`);
            },
            close(ws) {
                console.log('Client disconnected');
                clients.delete(ws);
            },
        },
    });
    console.log('WebSocket server is running on ws://localhost:' + port);
}

async function main() {
    await checkGoogleStatus();
    await runConsumer();
    WebSocketServer();
}

main().catch(console.error);
