import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { AudioAnalyser, Matrix4 } from 'three'
import { Sphere } from '@react-three/drei'

const Analyzer = ({ audio }) => {
  const grid = useRef();
  const [hovered, hover] = useState(false);

  const analyser = useRef();

  useLayoutEffect(() => {
    grid.current.setMatrixAt(0, new Matrix4())
  }, [])

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

      // grid.current.rotation.x += 0.001
      // grid.current.rotation.y += 0.001
      grid.current.scale.y = data/100 * 2 + 0.1
    }
  });

  return (
    <instancedMesh
      castShadow
      ref={grid}
      args={[ null, null, 1]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={ 'orange' }/>
    </instancedMesh>
  );
}

export default Analyzer;