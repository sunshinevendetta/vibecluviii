import React from 'react';

const LogoScene: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <model-viewer
        src="/images/logo.glb"  // Correct path to your 3D model
        alt="vibecluv"
        auto-rotate
        camera-controls
        style={{ width: '100%', height: '100%' }}
        shadow-intensity="1"
        ar
      ></model-viewer>
    </div>
  );
};

export default LogoScene;
