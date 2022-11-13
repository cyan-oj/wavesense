const Box = ( { scale = [1, 1, 1], position = [1, 1, 1] } ) => {

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