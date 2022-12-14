import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AudioAnalyser, Object3D, BoxGeometry, MeshStandardMaterial, Color } from 'three'

const tempBar = new Object3D();
const tempColor = new Color();

const Display = ({ audio }) => {
  const numBars = 64
  const barWidth = 0.2

  const barGeo = new BoxGeometry(barWidth, 1, barWidth);
  const material = new MeshStandardMaterial({ color: "orange" });

  const grid = useRef();
  const analyser = useRef();
  const gain = useRef();

  useEffect(() => {
    if ( audio.current ) {
      analyser.current = new AudioAnalyser( audio.current, numBars * 2 );
    }
  }, [audio.current]);

  useFrame(() => {
    if ( analyser.current ) {
      const data = analyser.current.getFrequencyData();

      // console.log("gain?", audio.current.gain)
      
      tempBar.position.set(0, 0, 1 )
      tempBar.scale.y = data[0]/50 + .001
      
      tempBar.updateMatrix();
      grid.current.setMatrixAt( 0, tempBar.matrix )
      
      for ( let x = 1; x < numBars; x++ ) {
        tempBar.position.set((barWidth * (x)), 0, 1 )
        tempBar.updateMatrix();
        grid.current.setMatrixAt( x, tempBar.matrix )
        
        tempBar.position.set((-barWidth * (x)), 0, 1 )
        tempBar.updateMatrix();
        grid.current.setMatrixAt( x+numBars, tempBar.matrix )
        
        tempBar.scale.y = data[x]/50 + .001
        tempBar.rotation.y += .0001
      }

      grid.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      castShadow
      ref={grid}
      args={[ barGeo, material, numBars * 3 + 1]}
    />
  );
}

export default Display;