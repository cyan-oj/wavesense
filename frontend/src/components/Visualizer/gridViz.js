import { useRef, useState } from "react"
import { useFrame } from '@react-three/fiber'
import Box from "./Box";
import * as THREE from "three";

const GridViz = ( { scale, rotation, position } ) => {

  const numBars = 9;

  const ref = useRef();

  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  const makeBars = ( numBars ) => {
    const bars = []

    for(let i = 0; i < numBars; i++ ) {
      const start = -4;
      const interval = i * 9/numBars;

      bars.push({
        name: `bar${i}`,
        position: [start+interval, -1, 1], 
        scale: [.9, .5, .9]
      })
    }

    return bars
  }

  const barProps = makeBars( numBars );
  console.log("outbars", barProps)

  const barsList = barProps.map((bar) => {
    return <Box name={bar.name} scale={bar.scale} position={bar.position} />
  })


  // const material = <meshStandardMaterial color={ 'orange' }/>

  //useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  return (
    // <mesh
    //   {...props}
    //   ref={ref}
    //   scale={clicked ? 1.5 : 1 }
    //   onClick={(event) => click(!clicked)}
    //   onPointerOver={(event) => hover(true)}
    //   onPointerOut={(event) => hover(false)}
    // >
    //   <boxGeometry args={[1, 1, 1]} />
    //   <meshStandardMaterial color={ hovered ? 'hotpink' : 'orange' }/>
    // </mesh>
    <group>
      { barsList }
    </group>
  )
}

export default GridViz;