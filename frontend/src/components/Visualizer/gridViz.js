import { useRef, useState, useLayoutEffect, useEffect } from "react"
import { useSelector } from "react-redux";
import { useFrame } from '@react-three/fiber'
import Box from "./Box";
import * as THREE from "three";

const GridViz = ( { scale, rotation, position} ) => {

  const data = useSelector(state => state.data)

  const numBars = 16;
  const width = 8;
  const start = width * -0.5;
  const interval = width/(numBars+1)

  const grid = useRef(null);

  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  useLayoutEffect(() => {
    grid.current.setMatrixAt(0, new THREE.Matrix4())
  }, [])

  useEffect(() => {
    console.log("data", data)
  }, [data])

  const average = array => array.reduce((a, b) => a + b)/array.length

  useFrame((state, delta) => {
    if(data) grid.current.scale.y = average(data)/10;
    grid.current.rotation.x += 0.001
    grid.current.rotation.y += 0.001
  })

  return (
    <instancedMesh
      castShadow
      ref={grid}
      args={[ null, null, 1]}
      scale={clicked ? .5 : 1 }
      onClick={(event) => click(!clicked)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={ 'orange' }/>
    </instancedMesh>
  )
}

export default GridViz;