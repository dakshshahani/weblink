import React, { useState, useEffect } from 'react';
import BackgroundGlow from './components/BackgroundGlow.tsx';

function App() {
  return (
    <BackgroundGlow>
        <h1 className="text-3xl font-bold">Hello world!</h1>
        <p>This is a React Chrome Extension</p>
    </BackgroundGlow>
  );
}

export default App;
