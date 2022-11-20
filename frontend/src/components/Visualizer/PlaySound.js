import { Suspense, useRef } from 'react'
import { PositionalAudio } from '@react-three/drei';
import Analyzer from './Analyzer';
import { useEffect } from 'react';

function PlaySound({ url }) {
  console.log(url)
  const sound = useRef();
////
  // useEffect(() => {
  //   if(sound.current && url) {
  //     sound.current.url = url
  //     console.log("sound in PlaySound", sound.current)
  //   }
  // }, [url])

  return (
    <Suspense fallback={null}>
      {url &&
        <PositionalAudio autoplay url={url} ref={sound} />
      }
      <Analyzer sound={sound} />
    </Suspense>
  );
}

export default PlaySound;