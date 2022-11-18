import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AudioAnalyser } from 'three'
import { Sphere } from '@react-three/drei'

function Analyzer({ sound }) {
  const mesh = useRef();
  const analyser = useRef();
  useEffect(
    () => void (analyser.current = new AudioAnalyser(sound.current, 32)),
    []
  );

  useFrame(() => {
    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();
      mesh.current.material.color.setRGB(data / 100, 0, 0);
      mesh.current.scale.x = mesh.current.scale.y = mesh.current.scale.z =
        (data / 100) * 2;
    }
  });

  return (
    <Sphere ref={mesh} args={[1, 64, 64]}>
      <meshBasicMaterial />
    </Sphere>
  );
}

export default Analyzer;