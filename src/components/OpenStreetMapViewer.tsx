/**
 * KOMPAS - OpenStreetMap Spatial Viewer
 * Integrasi Peta OpenStreetMap berbasis Leaflet untuk memetakan geometri aktual dan bounding box metadata.
 * Menegakkan prinsip integritas audit: Tidak membuat lokasi peta fiktif jika informasi spasial tidak memadai.
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  AlertTriangle,
  Layers,
  Maximize2,
  Minimize2,
  Compass,
  CheckCircle2,
  ExternalLink,
  Info,
  RotateCcw,
} from 'lucide-react';

export interface SpatialExtentData {
  hasAdequateSpatial: boolean;
  bounds: [number, number, number, number] | null; // [west, south, east, north]
  sourceType: 'spatial_vector' | 'metadata_bbox' | 'none';
  reasonIfNotAdequate?: string;
  crsName?: string;
  geoJsonData?: any | null;
}

interface OpenStreetMapViewerProps {
  spatialData: SpatialExtentData;
  datasetTitle: string;
  heightClass?: string;
  interactive?: boolean;
}

export const OpenStreetMapViewer: React.FC<OpenStreetMapViewerProps> = ({
  spatialData,
  datasetTitle,
  heightClass = 'h-[440px]',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<'osm' | 'carto_dark' | 'esri_sat'>('osm');
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  const { hasAdequateSpatial, bounds, sourceType, reasonIfNotAdequate, crsName, geoJsonData } = spatialData;

  useEffect(() => {
    if (!hasAdequateSpatial || !bounds || !mapContainerRef.current) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    const [west, south, east, north] = bounds;

    // Fix leaflet default icons for bundler environments
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Create or reuse map instance
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        attributionControl: true,
        zoomControl: interactive,
        scrollWheelZoom: interactive,
      });

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      map.removeLayer(layer);
    });

    // Tile URLs
    const tileUrls = {
      osm: {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> kontributor',
        maxZoom: 19,
      },
      carto_dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 19,
      },
      esri_sat: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri, Maxar, Earthstar Geographics',
        maxZoom: 18,
      },
    };

    const currentTile = tileUrls[activeTileLayer];
    const tileLayer = L.tileLayer(currentTile.url, {
      attribution: currentTile.attribution,
      maxZoom: currentTile.maxZoom,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Define geographical bounds
    const southWest = L.latLng(south, west);
    const northEast = L.latLng(north, east);
    const latLngBounds = L.latLngBounds(southWest, northEast);

    // If GeoJSON vector features exist, render actual geometry
    let featureLayer: L.GeoJSON | null = null;
    if (geoJsonData) {
      try {
        featureLayer = L.geoJSON(geoJsonData, {
          style: {
            color: '#06b6d4', // Cyan
            weight: 2.5,
            opacity: 0.9,
            fillColor: '#0891b2',
            fillOpacity: 0.35,
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties || {};
            const keys = Object.keys(props).slice(0, 5);
            const content = `
              <div style="font-family: sans-serif; font-size: 11px; color: #0f172a;">
                <strong style="color: #0284c7;">${props.name || props.NAMA_OBJEK || datasetTitle}</strong>
                <hr style="margin: 4px 0; border: none; border-top: 1px solid #e2e8f0;"/>
                ${keys.map((k) => `<div><strong>${k}:</strong> ${props[k]}</div>`).join('')}
              </div>
            `;
            layer.bindPopup(content);
          },
        }).addTo(map);
      } catch (err) {
        console.warn('Gagal merender GeoJSON ke peta:', err);
      }
    }

    // Render Bounding Box Rectangle
    const rectangle = L.rectangle(latLngBounds, {
      color: '#06b6d4',
      weight: 2,
      dashArray: '5, 5',
      fillColor: '#0891b2',
      fillOpacity: geoJsonData ? 0.08 : 0.22,
    }).addTo(map);

    // Popup content on Bounding Box
    const centerLat = (south + north) / 2;
    const centerLng = (west + east) / 2;

    const popupHtml = `
      <div style="font-family: system-ui, sans-serif; font-size: 11px; line-height: 1.4; color: #0f172a; min-width: 200px;">
        <div style="font-weight: 700; color: #0891b2; font-size: 12px; margin-bottom: 4px;">
          ${datasetTitle}
        </div>
        <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">
          Sumber: ${sourceType === 'spatial_vector' ? 'Geometri Vektor Aktual' : 'Bounding Box ISO 19115'}
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px; font-family: monospace; font-size: 10px;">
          <div><strong>Utara (N):</strong> ${north.toFixed(4)}°</div>
          <div><strong>Selatan (S):</strong> ${south.toFixed(4)}°</div>
          <div><strong>Barat (W):</strong> ${west.toFixed(4)}°</div>
          <div><strong>Timur (E):</strong> ${east.toFixed(4)}°</div>
        </div>
      </div>
    `;

    rectangle.bindPopup(popupHtml);

    // Center marker pin
    const centerMarker = L.circleMarker([centerLat, centerLng], {
      radius: 6,
      color: '#ffffff',
      weight: 2,
      fillColor: '#06b6d4',
      fillOpacity: 1,
    }).addTo(map);

    centerMarker.bindPopup(popupHtml);

    // Fit map view to dataset extent with safety padding
    map.fitBounds(latLngBounds, {
      padding: [40, 40],
      maxZoom: 14,
    });

    // Invalidate size after layout settles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [hasAdequateSpatial, bounds, sourceType, activeTileLayer, geoJsonData, datasetTitle, interactive]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleResetView = () => {
    if (mapInstanceRef.current && bounds) {
      const [west, south, east, north] = bounds;
      mapInstanceRef.current.fitBounds(
        L.latLngBounds(L.latLng(south, west), L.latLng(north, east)),
        { padding: [40, 40], maxZoom: 14 }
      );
    }
  };

  // If spatial information is NOT adequate, render strict evidence-based notice
  if (!hasAdequateSpatial || !bounds) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/50 border border-amber-800/80 flex items-center justify-center text-amber-400 mx-auto">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-base font-bold text-white">
            Informasi Geospasial Tidak Memadai
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {reasonIfNotAdequate ||
              'Dokumen metadata ini tidak memuat batas koordinat geografis (Bounding Box) atau geometri yang sah.'}
          </p>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-left text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Integritas Audit Berbasis Bukti Nyata:</span>
            </div>
            <p className="leading-relaxed">
              Sesuai kaidah SNI ISO 19115 dan Peraturan BIG No. 3 Tahun 2023, sistem KOMPAS <strong>tidak akan membuat titik atau poligon peta secara fiktif</strong> jika dokumen tidak memiliki koordinat memadai.
            </p>
            <p className="text-cyan-400/90 pt-1">
              Rekomendasi: Lengkapi elemen <code>&lt;gmd:EX_GeographicBoundingBox&gt;</code> (ISO 19139) atau unggah layer data spasial pendukung (.geojson / shapefile .zip).
            </p>
          </div>
        </div>
      </div>
    );
  }

  const [west, south, east, north] = bounds;
  const lonSpan = Math.abs(east - west).toFixed(4);
  const latSpan = Math.abs(north - south).toFixed(4);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Map Header Toolbar */}
      <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Integrasi Peta OpenStreetMap</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                {sourceType === 'spatial_vector' ? 'Geometri Vektor Aktual' : 'Bounding Box SNI ISO 19115'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Proyeksi: {crsName || 'WGS 84 (EPSG:4326)'}
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Base Layer Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTileLayer('osm')}
              className={`px-2 py-1 rounded transition-colors ${
                activeTileLayer === 'osm'
                  ? 'bg-cyan-400 text-slate-900 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OSM Standar
            </button>
            <button
              type="button"
              onClick={() => setActiveTileLayer('carto_dark')}
              className={`px-2 py-1 rounded transition-colors ${
                activeTileLayer === 'carto_dark'
                  ? 'bg-cyan-400 text-slate-900 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gelap (CARTO)
            </button>
            <button
              type="button"
              onClick={() => setActiveTileLayer('esri_sat')}
              className={`px-2 py-1 rounded transition-colors ${
                activeTileLayer === 'esri_sat'
                  ? 'bg-cyan-400 text-slate-900 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Satelit
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 text-slate-400 hover:text-cyan-300 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
            title="Reset tampilan ke batas cakupan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className={`relative w-full ${heightClass} bg-slate-950 z-0`}>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Map Footer: Actual Coordinate Proof */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-slate-300">
          <div>
            <span className="text-slate-500">Barat (W):</span>{' '}
            <strong className="text-cyan-400">{west.toFixed(4)}°</strong>
          </div>
          <div>
            <span className="text-slate-500">Timur (E):</span>{' '}
            <strong className="text-cyan-400">{east.toFixed(4)}°</strong>
          </div>
          <div>
            <span className="text-slate-500">Selatan (S):</span>{' '}
            <strong className="text-cyan-400">{south.toFixed(4)}°</strong>
          </div>
          <div>
            <span className="text-slate-500">Utara (N):</span>{' '}
            <strong className="text-cyan-400">{north.toFixed(4)}°</strong>
          </div>
          <div className="text-slate-500">
            Rentang: {lonSpan}° x {latSpan}°
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Geometri terverifikasi dari metadata sumber</span>
        </div>
      </div>
    </div>
  );
};
