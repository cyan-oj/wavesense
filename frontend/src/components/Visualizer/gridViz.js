import { useRef, useState } from "react"
import { useFrame } from '@react-three/fiber'
import Box from "./Box";

const GridViz = ( { scale, rotation, position } ) => {

  const numBars = 3;

  const ref = useRef();

  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  const makeBars = ( numBars ) => {
    const barProps = []
    for(let i = 0; i < numBars; i++ ) {
      barProps.push([{scale: [i+.05, 1, 1], position: [i+.05, 1, 1]}])
    }

    return barProps;
  }

  //const barProps = 
  


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
    <Box ref={ref} scale={clicked ? 1.5 : 1 } onClick={(event) => click(!clicked)} />
  )
}

export default GridViz;