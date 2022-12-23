import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { AudioAnalyser, Object3D, BoxGeometry, MeshStandardMaterial } from 'three'
import { Plane, Box, RoundedBox } from '@react-three/drei'

const tempBar = new Object3D();

const Display = ({ audio }) => {
  const [radius, setRadius] = useState(0.005);

  const numBars = 32
  const barWidth = 0.022

  const barGeo = new BoxGeometry(barWidth, 1, barWidth);
  const material = new MeshStandardMaterial({ color: "orange" });

  const grid = useRef();
  const analyser = useRef();

  const box = useRef();
  const boxMesh = useRef();
  const boxColor = useRef();
  const boxMirror = useRef();

  const point = useRef();

  useEffect(() => {
    if ( audio.current ) {
      analyser.current = new AudioAnalyser( audio.current, numBars * 2 );
    }
  }, [audio.current]);

  useFrame(() => {
    if ( analyser.current ) {
      const data = analyser.current.getFrequencyData();
      const average = analyser.current.getAverageFrequency();
      
      tempBar.position.set(0, 0, 1)
      tempBar.scale.y = data[0]/40
      
      tempBar.updateMatrix();
      grid.current.setMatrixAt( 0, tempBar.matrix )
      
      for ( let x = 0; x < numBars; x++ ) {
        tempBar.position.set((128/numBars * barWidth * (x)), 0, 1 )
        tempBar.updateMatrix();
        grid.current.setMatrixAt( x, tempBar.matrix )
        
        tempBar.position.set((-128/numBars * barWidth * (x)), 0, 1 )
        tempBar.updateMatrix();
        grid.current.setMatrixAt( x+numBars, tempBar.matrix )
        
        tempBar.scale.y = data[x]/50
        tempBar.rotation.y += .0001
      }

      const scaleMod = average/80 + 0.5

      box.current.scale.x = box.current.scale.y = box.current.scale.z = boxMirror.current.scale.x = boxMirror.current.scale.y = boxMirror.current.scale.z = scaleMod
      box.current.rotation.x += average/2000
      box.current.rotation.y += average/2000
      box.current.rotation.z += average/2000

      boxColor.current.opacity = 1 - average/500

      setRadius(0.08 - average/(scaleMod * 700))

      boxMirror.current.rotation.x = - box.current.rotation.x
      boxMirror.current.rotation.y = box.current.rotation.y 
      boxMirror.current.rotation.z = - box.current.rotation.z 

      point.current.intensity = average/12

      grid.current.instanceMatrix.needsUpdate = true;
    }
  });

  const boxScale = 0.08

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
    <Plane args={[100, 100]} rotation={[-1.5, 0, 0]} position={[0, 0.08, 0]} castShadow={true}>
      <meshLambertMaterial color={"magenta"} transparent={true} opacity={0.5}/>
    </Plane>
    
    <RoundedBox ref={box} args={[boxScale, boxScale, boxScale]} radius={Math.min(Math.max(radius, .001), .04)} position={[0, .04, 2.8]} rotation={[0, 0, 0]}>
      <meshLambertMaterial ref={boxColor} color={"blue"} transparent={true} opacity={0.5}/>
    </RoundedBox>

    <RoundedBox ref={boxMirror} args={[boxScale, boxScale, boxScale]} radius={ Math.min(Math.max(radius, .001), .04)} position={[0, -.3, 2.8]} rotation={[0, 0, 0]}>
      <meshLambertMaterial color={"blue"} />
    </RoundedBox>

    <pointLight ref={point} distance={3} decay={1} intensity={1} position={[0, -.1, 2.9]} />
    <spotLight position={[0, 1, 10]} intensity={0.3} decay={2} angle={0.52} />
    <hemisphereLight args={[0x000000, 0xed289b, 0.4]}/>
  </>
  );
}

export default Display;