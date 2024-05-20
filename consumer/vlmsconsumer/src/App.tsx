import { useEffect, useState, useCallback } from 'react';
import './App.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import icon from "./assets/car.png";
import L from 'leaflet';

function App() {
  const [positions, setPositions] = useState([{ id: 'one', data: [52.014, -0.025] }]);
  const ws_port = process.env.WS_PORT || 8080;
  console.log("WebSocket Port: ", ws_port);
  const ws_host = process.env.WS_HOST || 'localhost';
  const socketUrl = 'ws://localhost:' + ws_port;
  console.log("WebSocket URL: ", socketUrl);

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true, // Automatically reconnect on close
    reconnectAttempts: 10, // Limit number of reconnect attempts
    reconnectInterval: 3000, // Retry connection every 3 seconds
  });


  useEffect(() => {
    if (lastMessage !== null) {

      try {
        const data = JSON.parse(lastMessage.data);
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
  const renderMarkers = useCallback(() => {

    return positions.map((position) => (
      <Marker key={position.id} position={[position.data[0], position.data[1]]} icon={customIcon} >
        <Popup>{position.id}</Popup>
      </Marker>
    ));
  }, [positions]);

  return (
    <MapContainer center={[positions[0].data[0], positions[0].data[1]]} zoom={8} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {renderMarkers()}
    </MapContainer>
  );
}

export default App;
