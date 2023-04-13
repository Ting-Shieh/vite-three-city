import * as THREE from 'three'

export class Background {
  constructor(scene) {
    // this.url='../../src/assets/white-bg.png'
    this.url='../../src/assets/black-bg.png'
    this.scene = scene
    this.init()
  }
  // 創建天空盒
  init(){
    // 創建球體
    const geometry = new THREE.SphereGeometry(10000, 32, 32)
    const loader = new THREE.TextureLoader()
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: loader.load(this.url)
    })
    const shpere = new THREE.Mesh(geometry, material)

    // 設置座標與旋轉
    shpere.position.copy({
      x: 0,
      y: 0,
      z: 0
    })

    this.scene.add(shpere)
  }
}