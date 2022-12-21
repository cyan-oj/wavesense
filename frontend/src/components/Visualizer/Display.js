import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { AudioAnalyser, Object3D, BoxGeometry, MeshStandardMaterial } from 'three'
import { Plane, Box, RoundedBox } from '@react-three/drei'

const tempBar = new Object3D();

const Display = ({ audio }) => {
  const [radius, setRadius] = useState(0.005);

  const numBars = 256
  const barWidth = 0.021

  const barGeo = new BoxGeometry(barWidth, 1, barWidth);
  const material = new MeshStandardMaterial({ color: "orange" });

  const grid = useRef();
  const analyser = useRef();

  const box = useRef();
  const boxColor = useRef();

  useEffect(() => {
    if ( audio.current ) {
      analyser.current = new AudioAnalyser( audio.current, numBars * 2 );
    }
  }, [audio.current]);

  useFrame(() => {
    if ( analyser.current ) {
      const data = analyser.current.getFrequencyData();
      const average = analyser.current.getAverageFrequency();
      
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

      const scaleMod = average/50 + 0.5

      box.current.scale.x = box.current.scale.y = box.current.scale.z = scaleMod
      box.current.rotation.x += average/2000
      box.current.rotation.y += average/2000
      box.current.rotation.z += average/2000
      boxColor.current.opacity = 1 - average/95
      setRadius(0.045 - average/(scaleMod * 850))

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
    <Plane args={[999, 999]} rotation={[0, 0, 0]} position={[0, 0, -9]}>
      <meshLambertMaterial color={"blue"} />
    </Plane>

    <Plane args={[100, 100]} rotation={[-1.5, 0, 0]} position={[0, 0.08, 0]}>
      <meshLambertMaterial color={"magenta"} transparent={true} opacity={0.5}/>
    </Plane>
    
    <RoundedBox ref={box} args={[0.1, 0.1, 0.1]} radius={radius} position={[0, 0, 3]}>
      <meshLambertMaterial ref={boxColor} color={"blue"} transparent={true} opacity={0.5}/>
    </RoundedBox>
    

    <pointLight args={[0xfff352, 1, 400, 3]} position={[2, 2, -2]} />
  </>
  );
}

export default Display;