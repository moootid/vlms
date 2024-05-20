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

    let vehicleData:any = [
    ];
    // console.log("Consumer ID: ", uuidGroup)
    const consumer = kafka.consumer({ groupId: uuidGroup });

    await consumer.connect();
    await consumer.subscribe({ topics: ['testing-topic'], fromBeginning: false });

    // console.log("-------------------------------");
    function calculateTimeDelta(dateString: string): number {
        // console.log(dateString);
        // Create a Date object for the given date
        const givenDate = new Date(dateString);
    
        // Create a Date object for the current date
        const now = new Date();
    
        // Calculate the difference in milliseconds
        const differenceInMilliseconds = now.getTime() - givenDate.getTime();
    
        // Return the difference in milliseconds
        return differenceInMilliseconds;
    }
    const messageSerializer = (msg: any) => {
        // console.log(vehicleData);
        if (msg.key && msg.value) {
            let arr_msg = msg.value.toString().split(',');
            // console.log(arr_msg);
            const coordinates = {
                id: msg.key.toString(),
                data: [Number(arr_msg[0]), Number(arr_msg[1])],
                latency: calculateTimeDelta(arr_msg[2])
            };
            // console.log(coordinates);

            const index = vehicleData.findIndex((item:any) => item.id === coordinates.id);
            if (index !== -1) {
                vehicleData[index].data = coordinates.data;
            } else {
                vehicleData.push(coordinates);
            }

            // console.log(vehicleData);
        }
        return {
            key: msg.key.toString(),
            value: msg.value.toString()
        };
    };

    await consumer.run({
        partitionsConsumedConcurrently: 1,
        eachMessage: async ({ topic, partition, message }: any) => {
            // console.log(message.key.toString());
            // console.log({
            //     value: message.value.toString()
            // });
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
    // console.log(Bun.env.PORT)
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
