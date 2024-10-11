import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const RotatingSphere = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        //创建场景、摄像机和渲染器
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        const light = new THREE.PointLight(0xffffff, 1, 100);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);
        mountRef.current.appendChild(renderer.domElement);

        //创建一个球体几何体和材质，并将其添加到场景中
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0x888888, wireframe: false });
        const sphere = new THREE.Mesh(geometry, material);
        light.position.set(10, 10, 10);
        scene.add(light)
        scene.add(sphere);

        //设置摄像机位置
        camera.position.z = 3;


        //创建一个动画循环旋转球体
        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.1;
            sphere.rotation.y += 0.11;
            renderer.render(scene, camera);
        }
        animate();

        //清理函数，用于卸载组件时移除事件监听和清理资源
        return () => {
            if (mountRef.current && renderer.domElement.parentNode) {
                mountRef.current.removeChild(renderer.domElement);
            }
        }

    }, [])

    return <div ref={mountRef}></div>
}

export default RotatingSphere