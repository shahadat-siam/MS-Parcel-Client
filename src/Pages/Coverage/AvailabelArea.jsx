import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Map fly helper
const FlyTo = ({ position }) => {
  const map = useMap();

  if (position) {
    map.flyTo(position, 12, { duration: 1.5 });
  }

  return null;
};

const AvailableArea = ({ serviceCenter }) => {
  const [search, setSearch] = useState("");
  const [targetPos, setTargetPos] = useState(null);
  const markerRefs = useRef({});

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    const found = serviceCenter.find((d) =>
      d.district.toLowerCase().includes(value.toLowerCase())
    );

    if (found) {
      setTargetPos([found.latitude, found.longitude]);
      markerRefs.current[found.district]?.openPopup();
    }
  };

  return (
    <div className="mx-auto relative my-8" style={{ width: "90%" }}>
      
      {/* 🔍 Search Box */}
     <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] w-[70%] md:w-[30%]">
 

    {/* Search Input */}
    <input
      type="text"
      placeholder="Search district (e.g. Dhaka)"
      value={search}
      onChange={handleSearch}
      className="
        w-full
        pl-12 pr-4 py-3
        rounded-xl
        bg-transparent
        backdrop-blur-md
        border border-white/40
        shadow-lg
        text-gray-800
        placeholder-gray-500
        focus:outline-none 
      "
    />
</div>


      {/* 🗺️ Map */}
      <div style={{ height: "80vh" }}>
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyTo position={targetPos} />

          {serviceCenter.map((district, index) => {
            const isServiceAvailable =
              district.status === "active" &&
              Array.isArray(district.covered_area) &&
              district.covered_area.length > 0;

            return (
              <Marker
                key={index}
                position={[district.latitude, district.longitude]}
                ref={(ref) =>
                  (markerRefs.current[district.district] = ref)
                }
              >
                <Popup>
                  <strong>
                    {district.city}, {district.region}
                  </strong>
                  <br />
                  Service Available:{" "}
                  <span
                    style={{
                      color: isServiceAvailable ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {isServiceAvailable ? "Yes" : "No"}
                  </span>

                  {isServiceAvailable && (
                    <>
                      <hr />
                      <strong>Covered Areas:</strong>
                      <ul>
                        {district.covered_area.map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default AvailableArea;
