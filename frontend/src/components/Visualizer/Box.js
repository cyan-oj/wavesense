const Box = ( { scale = [1, 1, 1], position = [1, 1, 1], name } ) => {
console.log("scale", scale)
console.log("position", position)
console.log("name", name)

  return(
    <mesh 
      scale={scale}
      position={position}
    >
      <boxGeometry args={[1, 1, 1]}/>
      <meshStandardMaterial color={ 'orange' }/>
    </mesh>
  )
}

export default Box;