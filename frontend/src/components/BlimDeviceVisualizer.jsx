import React, { Suspense, useMemo, memo, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls, Stage, Html } from '@react-three/drei';
import { Box, RotateCw, ZoomIn, Move, Map as MapIcon, Eye, EyeOff } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import Map from './Map';

function Model({ url }) {
  const geometry = useLoader(STLLoader, url);
  return (
    <mesh geometry={geometry} castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
      <meshStandardMaterial color="#dfdfdfff" roughness={0.5} metalness={0.5} />
    </mesh>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-blue-600 bg-white/0 p-4 rounded-lg backdrop-blur-sm">
        <div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium whitespace-nowrap">Loading 3D Model...</span>
      </div>
    </Html>
  );
}

function ErrorFallback({ error }) {
  React.useEffect(() => {
    console.error("BlimDeviceVisualizer 3D Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-red-500 bg-red-50/50 p-6">
      <Box className="w-12 h-12 mb-2 opacity-50" />
      <h3 className="font-medium text-lg">Failed to load 3D Model</h3>
      <p className="text-sm opacity-80 mt-1">{error.message}</p>
      <p className="text-xs text-gray-500 mt-4">Please check if /makasih_rio.stl exists in the public folder.</p>
    </div>
  );
}

function DeviceDiagnostics() {
  const data = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    lastMaintenance: "2025-12-15",
    nextMaintenance: "2026-06-15",
    health: "Running",
    sensors: {
      ultrasonic: "Active",
      soilMoisture: "Active",
      tilt: "Active"
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'running': return 'text-green-600 bg-green-50 border-green-200';
      case 'maintenance': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      case 'active': return 'text-green-600';
      case 'non-active': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white backdrop-blur-sm border-t border-stone-100 p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Device ID</p>
          <p className="font-mono text-xs text-gray-600 truncate" title={data.id}>{data.id}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Maintenance</p>
          <div className="flex flex-col text-xs text-gray-600 space-y-0.5">
             <div className="flex justify-between gap-2">
                <span>Last:</span>
                <span className="font-medium text-gray-800">{data.lastMaintenance}</span>
             </div>
             <div className="flex justify-between gap-2">
                <span>Next:</span>
                <span className="font-medium text-gray-800">{data.nextMaintenance}</span>
             </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">System Health</p>
          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(data.health)}`}>
            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${data.health === 'Running' ? 'bg-green-500 animate-pulse' : 'bg-current'}`} />
            {data.health}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Sensor Status</p>
          <div className="space-y-0.5 text-xs">
            <div className="flex justify-between items-center gap-2">
               <span className="text-gray-500">Ultrasonic</span>
               <span className={`font-medium ${getStatusColor(data.sensors.ultrasonic)}`}>{data.sensors.ultrasonic}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
               <span className="text-gray-500">Soil Moisture</span>
               <span className={`font-medium ${getStatusColor(data.sensors.soilMoisture)}`}>{data.sensors.soilMoisture}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
               <span className="text-gray-500">Tilt</span>
               <span className={`font-medium ${getStatusColor(data.sensors.tilt)}`}>{data.sensors.tilt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceLocation() {
  const [showMap, setShowMap] = useState(true);
  const position = [13.669656, 100.609722];
  const address = "88 Debaratna Rd, Bang Na Tai, Bang Na, Bangkok 10260, Thailand";

  return (
    <div className="bg-white backdrop-blur-sm border-t border-stone-100 p-4 relative">
       {/* Map Toggle Button */}
       <button 
          onClick={() => setShowMap(!showMap)}
          className="absolute top-4 right-4 p-1.5 bg-white border border-stone-200 rounded-md shadow-sm hover:bg-stone-50 transition-colors z-10"
          title={showMap ? "Hide Map" : "Show Map"}
       >
          {showMap ? <EyeOff size={14} className="text-gray-500" /> : <MapIcon size={14} className="text-gray-500" />}
       </button>

      <div className="flex flex-col md:flex-row gap-4">
        <div className={`w-full ${showMap ? 'md:w-1/3' : 'md:w-full'} space-y-4 transition-all duration-300`}>
            <div>
                <h3 className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Device Location</h3>
                 <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                        Live Signal
                    </span>
                 </div>
                <p className="text-sm tracking-tight text-gray-700 font-medium leading-relaxed mb-1">{address}</p>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/50 px-2 py-1 rounded w-fit border border-gray-100">
                    <span>LAT: {position[0].toFixed(6)}</span>
                    <span className="text-gray-300">|</span>
                    <span>LNG: {position[1].toFixed(6)}</span>
                </div>
            </div>
        </div>
        
        {showMap && (
          <div className="w-full md:w-2/3 min-h-[200px] rounded-lg overflow-hidden border border-stone-200 shadow-sm animate-in fade-in duration-300">
             <Map center={position} zoom={15} />
          </div>
        )}
      </div>
    </div>
  );
}

const BlimDeviceVisualizer = memo(function BlimDeviceVisualizer() {
  // Memoize stable props to prevent Canvas re-renders
  const cameraSettings = useMemo(() => ({ position: [0, 0, 150], fov: 45 }), []);
  const dprSettings = useMemo(() => [1, 2], []);

  const handleCreated = ({ gl }) => {
    console.log("BlimDeviceVisualizer: Canvas initialized", {
      render: gl.info.render,
      memory: gl.info.memory
    });
  };

  return (
    <div className="w-full bg-white/0 rounded-xl border border-stone-300 overflow-hidden mb-8 relative group transition-all duration-300">
      {/* Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-300 border-x-0">
        <Box className="w-5 h-5 text-blue-600" />
        <h2 className="text-sm font-medium text-gray-800 tracking-wide">YOUR DEVICE</h2>
      </div>

      {/* Controls Help 
      <div className="absolute bottom-50 left-4 right-4 z-10 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
         <div className="flex gap-4 bg-gray-900/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg border border-b-stone-800/50 border-t-stone-300/50 border-x-0">
            <span className="flex items-center gap-1.5"><RotateCw className="w-3 h-3" /> Rotate</span>
            <span className="flex items-center gap-1.5"><Move className="w-3 h-3" /> Pan</span>
            <span className="flex items-center gap-1.5"><ZoomIn className="w-3 h-3" /> Zoom</span>
         </div>
      </div>*/}

      <div className="h-[400px] w-full bg-gradient-to-b from-gray-50 to-gray-100 cursor-move">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Canvas 
            shadows 
            dpr={dprSettings} 
            camera={cameraSettings}
            onCreated={handleCreated}
          >
            <Suspense fallback={<Loader />}>
              <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.4, blur: 2 }}>
                <Model url="/makasih_rio.stl" />
              </Stage>
            </Suspense>
            <OrbitControls 
              makeDefault 
              autoRotate 
              autoRotateSpeed={1}
              minPolarAngle={0} 
              maxPolarAngle={Math.PI}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Canvas>
        </ErrorBoundary>
      </div>
      <DeviceDiagnostics />
      <DeviceLocation />
    </div>
  );
});

export default BlimDeviceVisualizer;
