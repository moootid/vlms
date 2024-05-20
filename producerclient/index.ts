import { Kafka } from 'kafkajs';

console.log('App started!');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [Bun.env.DOMAIN + ':9092', Bun.env.DOMAIN + ':9093', Bun.env.DOMAIN + ':9094'],
});

const TOPIC = 'testing-topic';
const INTERVAL_MS:number =  Number(Bun.env.INTERVAL) || 1000;
const systemId = crypto.randomUUID();
const COORDINATE_RANGE = {
  latMin: Number(Bun.env.MIN_LAT) || 0.00,
  latMax: Number(Bun.env.MAX_LAT) || 1.00,
  longMin: Number(Bun.env.MIN_LONG) || 53.20,
  longMax: Number(Bun.env.MAX_LONG) || 51.01,
};
let KEYS = [];
let numberOfKeys = Number(Bun.env.NUMBER_OF_KEYS) || 1;

for (let i = 1; i <= numberOfKeys; i++) {
  KEYS.push(`key-${systemId}-${i}`);
}


const createProducer = () => {
  return kafka.producer({
    allowAutoTopicCreation: true,
  });
};

const generateRandomCoordinate = (min:any, max:any) => {
  return (Math.random() * (max - min) + min).toFixed(3);
};

const generateMessage = () => {
  const lat = generateRandomCoordinate(COORDINATE_RANGE.latMin, COORDINATE_RANGE.latMax);
  const long = generateRandomCoordinate(COORDINATE_RANGE.longMin, COORDINATE_RANGE.longMax);
  const id = Math.floor(Math.random() * KEYS.length);
  const now = new Date().toISOString();
  return {
    key: KEYS[id],
    value: `${lat},${long},${now}`,
  };
};

const sendMessage = async (producer:any, message:any) => {
  try {
    await producer.connect();
    await producer.send({
      topic: TOPIC,
      messages: [message],
    });
  } catch (error) {
    console.error('Error sending message:', error);
  } finally {
    await producer.disconnect();
  }
};

const locator = async () => {
  const producer = createProducer();
  const message = generateMessage();
  // console.log('Generated message:', message);
  await sendMessage(producer, message);
};

setInterval(locator, INTERVAL_MS);
