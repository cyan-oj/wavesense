import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { AudioAnalyser, Matrix4, Object3D, BoxGeometry, MeshStandardMaterial } from 'three'
import { Sphere } from '@react-three/drei'

const tempBoxes = new Object3D();

const Analyzer = ({ audio }) => {
  const boxesGeometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: "orange" });

  const grid = useRef();
  const [hovered, hover] = useState(false);

  const analyser = useRef();

  // useLayoutEffect(() => {
  //   grid.current.setMatrixAt(0, new Matrix4())
  // }, [])

  useEffect(() => {
    console.log("analyzer update:", audio)
    if (audio.current) {
      analyser.current = new AudioAnalyser(audio.current, 32);
    }
  }, [audio.current]);

  useFrame(() => {
    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();
      // mesh.current.material.color.setRGB(data / 100, 0, 0);
      
      for ( let x = 0; x < 3; x++) {
        tempBoxes.position.set(3/2 - x, 1, 1)
        tempBoxes.rotation.y += .01
        tempBoxes.updateMatrix();
        grid.current.setMatrixAt(x, tempBoxes.matrix)
      }

      grid.current.instanceMatrix.needsUpdate = true;

      grid.current.scale.y = data/100 * 2 + 0.1
    }
  });

  return (
    <instancedMesh
      castShadow
      ref={grid}
      args={[ boxesGeometry, material, 3]}
    />
  );
}

export default Analyzer;

      {/* <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={ 'orange' }/>
    </instancedMesh> */}