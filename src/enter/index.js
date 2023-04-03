import '@/base/index.scss'
import * as THREE from 'three'
export const initCity = () => {
  // 獲取canvas 元素
  const canvas = document.getElementById('webgl')
  // 創建場景
  const scene = new THREE.Scene()
  // 創建相機
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000)
  camera.position.set(0, 0, 50)
  scene.add(camera)

  // 添加燈光
  // 環境光
  scene.add(new THREE.AmbientLight(0xadadad))
  // 平行光
  const directionLight = new THREE.DirectionalLight(0xffffff)
  directionLight.position.set(0,0,0)
  scene.add(directionLight)

  // 添加立方體
  const box = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshLambertMaterial({ color: 0xff0000})
  scene.add(new THREE.Mesh(box, material))

  // 創建渲染器
  const renderer = new THREE.WebGLRenderer({ canvas })
  // 設定渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 設定場景像素比 => 為了渲染器能使用湯前瀏覽器一樣的像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 設置場景顏色 setClearColor ( color : Color, alpha : Float ) 
  renderer.setClearColor(new THREE.Color(0x000000), 1)
  // 渲染場景
  renderer.render(scene, camera)

  // 監聽畫布縮放
  window.addEventListener('resize', () => {
    // 更新寬高比
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新相機投影矩陣
    camera.updateProjectionMatrix()
    // 設定渲染器尺寸
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 設定場景像素比 => 為了渲染器能使用湯前瀏覽器一樣的像素比
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}