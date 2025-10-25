import React, { useState, useEffect } from 'react';
import BackgroundGlow from './components/BackgroundGlow.tsx';
import { Button } from './components/ui/button.tsx'


function App() {
  return (
    <BackgroundGlow>
        <h1 className="text-3xl font-bold">Hello world!</h1>
        <Button size="sm" className='bg-white text-black'> 
            Hi
        </Button>
    </BackgroundGlow>
  );

}

export default App;
