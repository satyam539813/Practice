// ModelScene.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js'

function Model({ position, rotation, scale }) {
    const { scene } = useGLTF('/scene.glb')
    const modelRef = useRef()

    useEffect(() => {
        if (!modelRef.current) return
        const start = { y: -5 }
        const end = { y: position[1] }
        const tween = new Tween(start)
            .to(end, 2000)
            .easing(Easing.Quadratic.Out)
            .onUpdate((val) => {
                if (modelRef.current) modelRef.current.position.y = val.y
            })
            .start()
    }, [position])

    useFrame(() => {
        tweenUpdate()
        if (modelRef.current) {
            modelRef.current.position.x = position[0]
            modelRef.current.position.z = position[2]
            modelRef.current.rotation.set(...rotation)
            modelRef.current.scale.set(...scale)
        }
    })

    return <primitive ref={modelRef} object={scene} />
}

export default function ModelScene() {
    const [lightPosition, setLightPosition] = useState([0, 0, 5])
    const [modelPosition] = useState([0, 0, 0])
    const [modelRotation] = useState([0, 0, 0])
    const [modelScale] = useState([1, 1, 1])
    const lightRef = useRef()

    const handleMouseMove = (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1
        const y = -(event.clientY / window.innerHeight) * 2 + 1
        setLightPosition([x * 5, y * 5, 5])
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <Canvas camera={{ position: [0, 0, 4] }} style={{ position: 'fixed', width: '100vw', height: '100vh', zIndex: -1 }}>
            <ambientLight intensity={0.1} />
            <pointLight ref={lightRef} position={lightPosition} intensity={50} />
            <Model position={modelPosition} rotation={modelRotation} scale={modelScale} />
            <OrbitControls />
        </Canvas>
    )
}
