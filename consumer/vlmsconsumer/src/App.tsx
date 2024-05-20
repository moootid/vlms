import { useEffect, useState, useCallback } from 'react';
import './App.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import icon from "./assets/car.png";
import L from 'leaflet';

function App() {
  const [positions, setPositions] = useState<any>([]);
  const defaultPosition = [52.014, -0.025];
  const ws_port = process.env.WS_PORT || 8080;
  const socketUrl = 'ws://localhost:' + ws_port;
  const map_zoom = 4;
  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true, // Automatically reconnect on close
    reconnectAttempts: 10, // Limit number of reconnect attempts
    reconnectInterval: 3000, // Retry connection every 3 seconds
  });
  const [avgLatency, setAvgLatency] = useState<number>(0);
  const MINUTE_MS = 50000;
  const [map, setMap] = useState<boolean>(true);
  useEffect(() => {
    console.log(socketUrl);
    const interval = setInterval(() => {
      calculateAverageLatency();
    }, MINUTE_MS);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (lastMessage !== null) {

      try {
        const data = JSON.parse(lastMessage.data);
        // console.log(data);
        setPositions(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message data:', error);
      }
    }
  }, [lastMessage]);

  // Handle connection retry on error
  useEffect(() => {
    if (readyState === ReadyState?.CLOSED) {
      const retryInterval = setInterval(() => {
        // @ts-ignore
        if (readyState !== ReadyState?.OPEN && readyState !== ReadyState?.CONNECTING) {
          useWebSocket(socketUrl); // Attempt to reconnect
        } else {
          clearInterval(retryInterval); // Clear interval if connected
        }
      }, 3000); // Retry every 3 seconds

      return () => clearInterval(retryInterval); // Cleanup interval on component unmount
    }
  }, [readyState, socketUrl]);

  const customIcon = new L.Icon({
    iconUrl: icon,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });
  const calculateAverageLatency = () => {
    let data = positions
    if (data.length === 0) {
      // setAvgLatency(0);
      return;
    }
    console.log("Data: ", data);
    console.log("calculating average latency")
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].latency;
    }
    console.log("Sum: ", sum);
    console.log("Length: ", data.length);
    let avg = sum / data.length;
    setAvgLatency(parseFloat(avg.toFixed(3)));
    console.log("Average Latency: ", avg);
    // return 0;
  };
  const renderMarkers = useCallback(() => {

    return positions.map((position: any) => (
      <Marker key={position.id} position={[position.data[0], position.data[1]]} icon={customIcon} >
        <Popup>{position.id}</Popup>
      </Marker>
    ));
  }, [positions]);

  return (
    <>
      <h1>Vehicle Location Monitoring System</h1>
      <h2>Number of Vehicles: {positions.length}</h2>
      <h2>Average Latency: {avgLatency} Milliseconds</h2>
      <button className='button-9' onClick={calculateAverageLatency} >Recalculate latency</button>
      <p>For faster calcualtion in chios mode disable the map</p>
      {map ?
        <button className='button-9' onClick={() => setMap(!map)} >Disable Map</button>
        :
        <button className='button-9' onClick={() => setMap(!map)} >Enable Map</button>
      }
      {map ?
        <MapContainer center={[defaultPosition[0], defaultPosition[1]]} zoom={map_zoom} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {renderMarkers()}
        </MapContainer>
        : ""}
    </>
  );
}

export default App;
