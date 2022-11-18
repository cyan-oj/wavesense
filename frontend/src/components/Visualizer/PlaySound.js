import { Suspense, useRef } from 'react'
import { PositionalAudio } from '@react-three/drei';
import Analyzer from './Analyzer';

function PlaySound({ url }) {
  const sound = useRef();
  return (
    <Suspense fallback={null}>
      <PositionalAudio autoplay url={url} ref={sound} />
      <Analyzer sound={sound} />
    </Suspense>
  );
}

export default PlaySound;