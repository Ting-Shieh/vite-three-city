import { City } from './city.js'
import '@/base/index.scss'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export const initCity = () => {
  // 獲取canvas 元素
  const canvas = document.getElementById('webgl')
  // 創建場景
  const scene = new THREE.Scene()
  // 創建相機
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000)
  camera.position.set(0, 7200, 10000)
  camera.lookAt(new THREE.Vector3(0,0,0))
  scene.add(camera)
  
  // 添加相機控件 canvas不是由three.js生成，所以也要傳遞過去
  const controls = new OrbitControls(camera, canvas)
  // 是否有慣性（拖動場景時，是否立即停下或是緩慢停下）
  controls.enableDamping = true
  // 是否可以縮放
  controls.enableZoom = true
  // 最近和最遠的距離
  controls.minDistance = 100
  controls.maxDistance = 9500 // 2000 // 10000

  // 添加燈光
  // 環境光
  scene.add(new THREE.AmbientLight(0xadadad))
  // 平行光
  const directionLight = new THREE.DirectionalLight(0xffffff)
  directionLight.position.set(0,0,0)
  scene.add(directionLight)

  // // 添加立方體
  // const box = new THREE.BoxGeometry(2, 2, 2)
  // const material = new THREE.MeshLambertMaterial({ color: 0xff0000})
  // scene.add(new THREE.Mesh(box, material))

  // 創建渲染器
  const renderer = new THREE.WebGLRenderer({ canvas })
  // 設定渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 設定場景像素比 => 為了渲染器能使用湯前瀏覽器一樣的像素比
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  // 設置場景顏色 setClearColor ( color : Color, alpha : Float ) 
  renderer.setClearColor(new THREE.Color(0x000000), 1)

  // 導入城市(外部模型)
  const city = new City(scene, camera)
  // 計時
  const clock = new THREE.Clock()
  // 動畫
  const start = () => {

    city.start(clock.getDelta())
    // 控件要在動畫內update
    controls.update()
    // 渲染場景
    renderer.render(scene, camera)
    // 生成動畫
    requestAnimationFrame(start)
  }
  // // 渲染場景(不需等待加載完成，即可直接使用renderer)
  // renderer.render(scene, camera)

  // 動畫
  start()

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