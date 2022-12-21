import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AudioAnalyser, Object3D, BoxGeometry, MeshStandardMaterial, Color } from 'three'
import { CubeCamera, Plane } from '@react-three/drei'

const tempBar = new Object3D();
const tempColor = new Color();

const Display = ({ audio }) => {
  const numBars = 256
  const barWidth = 0.021

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
      
      tempBar.position.set(0, 0, 1 )
      tempBar.scale.y = data[0]/40 + .001
      
      tempBar.updateMatrix();
      grid.current.setMatrixAt( 0, tempBar.matrix )
      
      for ( let x = 0; x < numBars; x++ ) {
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
  <>
    <instancedMesh
      castShadow
      ref={grid}
      args={[ barGeo, material, numBars * 3 + 1]}
      />
    <Plane args={[100, 100]} rotation={[-1.5, 0, 0]} position={[0, 0, 0]}>
      <meshLambertMaterial color={"magenta"} transparent={true} opacity={0.5}/>
    </Plane>
    <Plane args={[999, 999]} rotation={[0, 0, 0]} position={[0, 0, -9]}>
      <meshLambertMaterial color={"blue"} />
    </Plane>
  </>
  );
}

export default Display;