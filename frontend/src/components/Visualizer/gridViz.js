import { useRef, useState, useLayoutEffect } from "react"
import { useFrame } from '@react-three/fiber'
import Box from "./Box";
import * as THREE from "three";

const GridViz = ( { scale, rotation, position, analyser, dataArray } ) => {

  const numBars = 16;
  const width = 8;
  const start = width * -0.5;
  const interval = width/(numBars+1)

  const grid = useRef();

  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useLayoutEffect(() => {
    grid.current.setMatrixAt(0, new THREE.Matrix4())
  }, [])

  const makeRow = ( numBars ) => {
    const bars = []

    for(let i = 0; i < numBars; i++ ) {
      const interval = i * 8/numBars;
      bars.push({
        name: `bar${i}`,
        position: [start+interval, -1, 1], 
        scale: [.2, .2, .2]
      })
    }

    return bars
  }

  const makeRows = ( numBars ) => {
    const rows = []
    for(let i = 0; i < numBars; i++ ) {
      

    }

  }

  const barProps = makeRow( numBars );
  console.log("outbars", barProps)

  const barsList = barProps.map((bar, i) => {
    return <Box key={i} name={bar.name} scale={bar.scale} position={bar.position} />
  })

  const average = array => array.reduce((a, b) => a + b)/array.length

  useFrame((state, delta) => {
    // if(analyser){
    //   analyser.getByteFrequencyData(dataArray);
    //   let avg = average(dataArray);
    //   grid.current.scale.y = avg/100;
    // }
    grid.current.rotation.x += 0.001
    grid.current.rotation.y += 0.001
  })

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
    <instancedMesh
      castShadow
      ref={grid}
      args={[ null, null, 4]}
      scale={clicked ? .5 : 1 }
      onClick={(event) => click(!clicked)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={ 'orange' }/>
    </instancedMesh>
  )
}

export default GridViz;