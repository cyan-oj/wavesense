import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { AudioAnalyser, Matrix4, Object3D, BoxGeometry, MeshStandardMaterial } from 'three'
import { Sphere } from '@react-three/drei'

const tempBar = new Object3D();

const Analyzer = ({ audio }) => {
  const numBars = 4
  const barWidth = 1.2

  const barGeo = new BoxGeometry(barWidth, 1, barWidth);
  const material = new MeshStandardMaterial({ color: "orange" });

  const grid = useRef();
  const [hovered, hover] = useState(false);

  // const data = new Uint8Array(16);
  const analyser = useRef();

  useEffect(() => {
    console.log( "analyzer update:", audio.current )
    if ( audio.current ) {
      analyser.current = new AudioAnalyser( audio.current, 32 );
    }
  }, [ audio.current ]);

  useFrame(() => {
    if ( analyser.current ) {
      const data = analyser.current.getFrequencyData();
      console.log(data)
      // mesh.current.material.color.setRGB(data / 100, 0, 0);

      for ( let x = 0; x < numBars; x++) {
        tempBar.position.set((barWidth * (numBars/2 - x - 1/2 )), 0, 1 )
        tempBar.rotation.y += .01
        tempBar.updateMatrix();
        grid.current.setMatrixAt( x, tempBar.matrix )
      }

      grid.current.instanceMatrix.needsUpdate = true;
      grid.current.scale.y = data[2]/100 * 2 + 0.1
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

export default Analyzer;