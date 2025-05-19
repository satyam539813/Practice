// App.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Tween, Easing, update as tweenUpdate } from '@tweenjs/tween.js'
import * as dat from 'dat.gui'
import Home from './assets/Home'
import About from './assets/About'
import Products from './assets/Products'

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
                if (modelRef.current) {
                    modelRef.current.position.y = val.y
                }
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

function App() {
    const [currentPage, setCurrentPage] = useState('home')
    const [lightPosition, setLightPosition] = useState([0, 0, 0])
    const lightRef = useRef()
    const [modelPosition, setModelPosition] = useState([0, 0, 0])
    const [modelRotation, setModelRotation] = useState([0, 0, 0])
    const [modelScale, setModelScale] = useState([1, 1, 1])

    const handleMouseMove = (event) => {
        const x = (event.clientX / window.innerWidth) * 2 - 1
        const y = -(event.clientY / window.innerHeight) * 2 + 1
        setLightPosition([x * 5, y * 5, 5])
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    useEffect(() => {
        const gui = new dat.GUI()
        const folder = gui.addFolder('Model Controls')

        folder.add(modelPosition, '0', -5, 5).name('Position X').onChange((v) => setModelPosition([v, modelPosition[1], modelPosition[2]]))
        folder.add(modelPosition, '1', -5, 5).name('Position Y').onChange((v) => setModelPosition([modelPosition[0], v, modelPosition[2]]))
        folder.add(modelPosition, '2', -5, 5).name('Position Z').onChange((v) => setModelPosition([modelPosition[0], modelPosition[1], v]))

        folder.add(modelRotation, '0', 0, Math.PI * 2).name('Rotation X').onChange((v) => setModelRotation([v, modelRotation[1], modelRotation[2]]))
        folder.add(modelRotation, '1', 0, Math.PI * 2).name('Rotation Y').onChange((v) => setModelRotation([modelRotation[0], v, modelRotation[2]]))
        folder.add(modelRotation, '2', 0, Math.PI * 2).name('Rotation Z').onChange((v) => setModelRotation([modelRotation[0], modelRotation[1], v]))

        folder.add(modelScale, '0', 0, 5).name('Scale X').onChange((v) => setModelScale([v, modelScale[1], modelScale[2]]))
        folder.add(modelScale, '1', 0, 5).name('Scale Y').onChange((v) => setModelScale([modelScale[0], v, modelScale[2]]))
        folder.add(modelScale, '2', 0, 5).name('Scale Z').onChange((v) => setModelScale([modelScale[0], modelScale[1], v]))

        folder.open()
        return () => gui.destroy()
    }, [modelPosition, modelRotation, modelScale])

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home />
            case 'about':
                return <About />
            case 'products':
                return <Products />
            default:
                return null
        }
    }

    return (
        <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
            <div className="nav-buttons">
                <button 
                    className={`nav-button ${currentPage === 'home' ? 'active' : ''}`}
                    onClick={() => setCurrentPage('home')}
                >
                    Home
                </button>
                <button 
                    className={`nav-button ${currentPage === 'about' ? 'active' : ''}`}
                    onClick={() => setCurrentPage('about')}
                >
                    About
                </button>
                <button 
                    className={`nav-button ${currentPage === 'products' ? 'active' : ''}`}
                    onClick={() => setCurrentPage('products')}
                >
                    Products
                </button>
            </div>

            <Canvas
                camera={{ position: [0, 0, 4] }}
                style={{ width: '100%', height: '100%', backgroundColor: 'black' }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x000000)
                }}
            >
                <ambientLight intensity={0.1} />
                <pointLight ref={lightRef} position={lightPosition} intensity={50} color="#ffffff" />
                <Model position={modelPosition} rotation={modelRotation} scale={modelScale} />
                <OrbitControls />
            </Canvas>

            {renderPage()}

            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '10rem',
                    color: '#000000',
                    mixBlendMode: 'difference',
                    zIndex: 1,
                    textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)',
                    filter: 'invert(1)',
                    whiteSpace: 'nowrap',
                }}
            >
                AR Shopsy
            </div>
        </div>
    )
}

export default App