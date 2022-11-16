import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

const Box = ( { scale = [1, 1, 1], position = [1, 1, 1], name } ) => {
console.log("scale", scale)
console.log("position", position)
console.log("name", name)

  const box = useRef();

  useFrame(() => (
    box.current.rotation.z += 0.01
  ))

  return(
    <mesh 
      ref={box}
      scale={scale}
      position={position}
    >
      <boxGeometry args={[1, 1, 1]}/>
      <meshStandardMaterial color={ 'orange' }/>
    </mesh>
  )
}

export default Box;