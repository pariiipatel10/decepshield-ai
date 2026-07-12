import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Event {
  ip: string;
}

interface Location {
  ip: string;
  lat: number;
  lon: number;
  city: string;
  country: string;
}

interface Props {
  events: Event[];
}

export default function AttackerMap({ events }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const uniqueIPs = [...new Set(events.map((e) => e.ip))];

      const results = [];

      for (const ip of uniqueIPs) {
        // Skip localhost addresses
        if (
          ip.includes("127.0.0.1") ||
          ip.includes("[::1]") ||
          ip.includes("localhost")
        ) {
          results.push({
            ip,
            lat: 20.5937,
            lon: 78.9629,
            city: "Localhost",
            country: "India",
          });
          continue;
        }

        try {
          const res = await fetch(
            `http://ip-api.com/json/${ip}`
          );

          const data = await res.json();

          if (data.status === "success") {
            results.push({
              ip,
              lat: data.lat,
              lon: data.lon,
              city: data.city,
              country: data.country,
            });
          }
        } catch (err) {
          console.error(err);
        }
      }

      setLocations(results);
    };

    fetchLocations();
  }, [events]);

  return (
    <div
      style={{
        marginTop: "30px",
        marginBottom: "30px",
        border: "1px solid white",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        ðŸŒ Attacker Geolocation Map
      </h2>

      <MapContainer
        center={[20, 78]}
        zoom={2}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc, index) => (
          <Marker key={index} position={[loc.lat, loc.lon]}>
            <Popup>
              <strong>{loc.ip}</strong>
              <br />
              {loc.city}, {loc.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
