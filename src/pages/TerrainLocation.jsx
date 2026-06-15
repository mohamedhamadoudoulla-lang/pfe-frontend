import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";
import { getTerrains } from "../services/api";
import API from "../services/api";
import RainbowLines from "../components/RainbowLines";
import "./TerrainLocation.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TUNISIA_CENTER = [34.0, 9.5];
const DEFAULT_ZOOM = 7;

/* =============================================================
   MapEvents — écoute draw:created / edited / deleted
   ============================================================= */
function MapEvents({ featureGroupRef, onCreated, onEdited, onDeleted }) {
  const map = useMap();

  useEffect(() => {
    const handleCreated = (e) => {
      const layer = e.layer;
      if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
        featureGroupRef.current.addLayer(layer);
      }
      const latlngs = layer.getLatLngs()[0];
      const coords = latlngs.map((ll) => [ll.lng, ll.lat]);
      coords.push(coords[0]);
      const polyGeo = { type: "Polygon", coordinates: [coords] };
      const lats = latlngs.map((p) => p.lat);
      const lngs = latlngs.map((p) => p.lng);
      onCreated?.(polyGeo, {
        points: latlngs.map((p) => ({ lat: p.lat, lng: p.lng })),
        centre: {
          lat: lats.reduce((a, b) => a + b, 0) / lats.length,
          lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
        },
      });
    };

    const handleEdited = (e) => {
      e.layers.eachLayer((layer) => {
        const latlngs = layer.getLatLngs()[0];
        const coords = latlngs.map((ll) => [ll.lng, ll.lat]);
        coords.push(coords[0]);
        const polyGeo = { type: "Polygon", coordinates: [coords] };
        const lats = latlngs.map((p) => p.lat);
        const lngs = latlngs.map((p) => p.lng);
        onEdited?.(polyGeo, {
          points: latlngs.map((p) => ({ lat: p.lat, lng: p.lng })),
          centre: {
            lat: lats.reduce((a, b) => a + b, 0) / lats.length,
            lng: lngs.reduce((a, b) => a + b, 0) / lngs.length,
          },
        });
      });
    };

    const handleDeleted = () => onDeleted?.();

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);
    map.on(L.Draw.Event.DELETED, handleDeleted);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.off(L.Draw.Event.DELETED, handleDeleted);
    };
  }, [map, featureGroupRef, onCreated, onEdited, onDeleted]);

  return null;
}

/* =============================================================
   MapToolbar — boutons personnalisés dans le panneau droit
   ============================================================= */
function MapToolbar({ polygon, onDelete, featureGroupRef, zoneInfo }) {
  const map = useMap();

  const startDraw = () => {
    if (map._smartBuildEditHandler) {
      map._smartBuildEditHandler.disable();
      map._smartBuildEditHandler = null;
    }
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
    const handler = new L.Draw.Polygon(map, {
      allowIntersection: false,
      shapeOptions: {
        color: "#0ea5e9",
        weight: 2,
        opacity: 0.8,
        fillColor: "#0ea5e9",
        fillOpacity: 0.15,
      },
    });
    handler.enable();
  };

  const toggleEdit = () => {
    if (map._smartBuildEditHandler) {
      map._smartBuildEditHandler.disable();
      map._smartBuildEditHandler = null;
      return;
    }
    const fg = featureGroupRef.current;
    if (!fg || fg.getLayers().length === 0) return;
    const editHandler = new L.EditToolbar.Edit(map, {
      featureGroup: fg,
      selectedPathOptions: {
        color: "#0ea5e9",
        weight: 3,
        opacity: 1,
        fillColor: "#0ea5e9",
        fillOpacity: 0.1,
      },
    });
    editHandler.enable();
    map._smartBuildEditHandler = editHandler;
  };

  const deletePolygon = () => {
    if (map._smartBuildEditHandler) {
      map._smartBuildEditHandler.disable();
      map._smartBuildEditHandler = null;
    }
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
    onDelete?.();
  };

  const locateMe = () => {
    if (!navigator.geolocation) return alert("Géolocalisation non supportée");
    navigator.geolocation.getCurrentPosition(
      (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 13),
      () => alert("Impossible d'obtenir votre position")
    );
  };

  return (
    <div className="tl-controls">
      <h3>🛠️ Outils</h3>
      <button className="tl-ctrl-btn" onClick={startDraw}>
        <span>✏️</span> Dessiner une zone
      </button>
      <button className="tl-ctrl-btn" disabled={!polygon} onClick={toggleEdit}>
        <span>✋</span> Déplacer la zone
      </button>
      <button className="tl-ctrl-btn tl-ctrl-danger" disabled={!polygon} onClick={deletePolygon}>
        <span>🗑️</span> Supprimer la zone
      </button>
      <button className="tl-ctrl-btn" onClick={locateMe}>
        <span>🧭</span> Votre position
      </button>

      {zoneInfo && (
        <div className="tl-zone-info">
          <p className="tl-zone-info-title">📍 Zone sélectionnée</p>
          <p className="tl-zone-info-line">
            Centre : {zoneInfo.centre.lat.toFixed(5)}, {zoneInfo.centre.lng.toFixed(5)}
          </p>
          <p className="tl-zone-info-line">Points : {zoneInfo.points.length}</p>
        </div>
      )}
    </div>
  );
}

/* =============================================================
   ZoomControls — boutons + / - dans la carte
   ============================================================= */
function ZoomControls() {
  const map = useMap();
  return (
    <div className="map-zoom-inline">
      <button className="map-btn" onClick={() => map.zoomIn()}>+</button>
      <button className="map-btn" onClick={() => map.zoomOut()}>−</button>
    </div>
  );
}

/* =============================================================
   TerrainLocation — page principale
   ============================================================= */
export default function TerrainLocation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fromWizard = state?.fromWizard || false;
  const wizardAnswers = state?.answers || {};

  const [terrains, setTerrains] = useState([]);
  const [polygon, setPolygon] = useState(null);
  const [zoneResults, setZoneResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [zoneInfo, setZoneInfo] = useState(null);
  const featureGroupRef = useRef(null);

  useEffect(() => {
    getTerrains()
      .then((res) => setTerrains(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = useCallback((polyGeo, info) => {
    setPolygon(polyGeo);
    setZoneResults([]);
    setZoneInfo(info);
  }, []);

  const handleEdited = useCallback((polyGeo, info) => {
    setPolygon(polyGeo);
    setZoneResults([]);
    setZoneInfo(info);
  }, []);

  const handleDeleted = useCallback(() => {
    setPolygon(null);
    setZoneResults([]);
    setZoneInfo(null);
  }, []);

  const handleSearchZone = async () => {
    if (!polygon) return;
    setSearching(true);
    try {
      const res = await API.post("/terrains/in-zone", { polygon });
      setZoneResults(res.data);
    } catch {
      alert("Erreur lors de la recherche");
    } finally {
      setSearching(false);
    }
  };

  const handleSelectTerrain = (terrain) => {
    navigate("/terrain/estimation", {
      state: {
        region: terrain.region,
        surface: terrain.surface,
        lat: terrain.location?.coordinates?.[1],
        lng: terrain.location?.coordinates?.[0],
        address: terrain.city || "",
        fromWizard,
        wizardAnswers,
      },
    });
  };

  return (
    <div className="terrain-location-page">
      <RainbowLines variant="terrainLocation" />

      <section className="tl-browse-section">
        <h2>🏗️ Parcourir les terrains disponibles</h2>
        <p>Consultez les annonces de terrains à vendre par région</p>
        <button className="tl-browse-btn" onClick={() => navigate("/terrains/marketplace")}>
          Voir les terrains →
        </button>
      </section>

      <section className="tl-map-section">
        <h3>🗺️ Dessinez une zone sur la carte</h3>
        <p className="tl-map-sub">Sélectionnez une zone géographique pour trouver des terrains à l'intérieur</p>
        <div className="tl-map-wrapper">
          {loading && <div className="tl-loading">Chargement de la carte...</div>}
          <MapContainer center={TUNISIA_CENTER} zoom={DEFAULT_ZOOM} className="tl-map" zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <ZoomControls />
            <FeatureGroup ref={featureGroupRef}>
              <MapEvents
                featureGroupRef={featureGroupRef}
                onCreated={handleCreated}
                onEdited={handleEdited}
                onDeleted={handleDeleted}
              />
            </FeatureGroup>
            <MapToolbar
              polygon={polygon}
              onDelete={handleDeleted}
              featureGroupRef={featureGroupRef}
              zoneInfo={zoneInfo}
            />

            <MarkerClusterGroup chunkedLoading maxClusterRadius={50} spiderfyOnMaxZoom disableClusteringAtZoom={15}>
              {terrains.filter((t) => t.location?.coordinates).map((t) => (
                <Marker
                  key={t._id}
                  position={[t.location.coordinates[1], t.location.coordinates[0]]}
                >
                  <Popup>
                    <div className="tl-popup">
                      <h4>{t.title}</h4>
                      <p>📍 {t.region}{t.city ? `, ${t.city}` : ""}</p>
                      <p>📐 {t.surface} m²</p>
                      <p>💰 {t.pricePerM2} DT/m² — 🏷️ {t.totalPrice?.toLocaleString()} DT</p>
                      <button className="tl-popup-btn" onClick={() => handleSelectTerrain(t)}>
                        Choisir →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>

          {polygon && (
            <div className="tl-bottom-bar">
              {zoneResults.length > 0 ? (
                <div className="tl-zone-results">
                  <span className="tl-zone-count">{zoneResults.length} terrain(s) trouvé(s)</span>
                  <div className="tl-zone-list">
                    {zoneResults.map((t) => (
                      <button key={t._id} className="tl-zone-item" onClick={() => handleSelectTerrain(t)}>
                        {t.title} — {t.surface} m² — {t.totalPrice?.toLocaleString()} DT
                      </button>
                    ))}
                  </div>
                  <button className="tl-action-btn" onClick={() => setZoneResults([])}>✕ Effacer</button>
                </div>
              ) : (
                <button className="tl-action-btn tl-action-btn-primary" onClick={handleSearchZone} disabled={searching}>
                  {searching ? "🔍 Recherche..." : "🔍 Afficher tous les biens du périmètre"}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
