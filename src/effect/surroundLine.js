import * as THREE from 'three'
import {color} from '../config/constants.js'
export class SurroundLine {
  constructor(scene, child) {
    this.scene = scene
    this.child = child
    // 需要一個模型顏色  最底部顯示的顏色
    this.meshColor = color.mesh
    // 需要一個頭部顏色  最頂部顯示顏色
    this.headColor = color.head
    // // 高度差 ＝ 最底部 - 最頂部
    // this.size = 180

    this.createMesh() // 不執行此函數會得到純線框模型
    // 創建外圍線條
    this.createLine()
  }

  computedMesh(){
    // 動態獲取高度差
    this.child.geometry.computeBoundingBox()
    this.child.geometry.computeBoundingSphere()
  }
  createMesh() {
    this.computedMesh()

    const {min, max} = this.child.geometry.boundingBox
    
    // 高度差
    const size = max.z - min.z
    
    const material = new THREE.ShaderMaterial({ 
      uniforms: {
        u_city_color: {
          value: new THREE.Color(this.meshColor)
        },
        u_head_color: {
          value: new THREE.Color(this.headColor)
        },
        u_size: {
          value: size //this.size
        }
      },
      vertexShader: `
        varying vec3 v_position;
        void main () {
          v_position = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_position;
        uniform vec3 u_city_color;
        uniform vec3 u_head_color;
        uniform float u_size;
        void main () {
          vec3 base_color = u_city_color;
          base_color = mix(base_color, u_head_color, v_position.z / u_size); // 混合好的顏色數據
          gl_FragColor = vec4(base_color, 1.0); // vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,
     })

    const mesh =  new THREE.Mesh(this.child.geometry, material)
    // 讓 mesh 繼承 child 的旋轉 縮放 平移
    mesh.position.copy(this.child.position)
    mesh.rotation.copy(this.child.rotation)
    mesh.scale.copy(this.child.scale)

    this.scene.add(mesh)
  }
  createLine() {
    // 獲取建築物的外圍
    const geometry = new THREE.EdgesGeometry(this.child.geometry)
    // // api創建
    // const material = new THREE.LineBasicMaterial({ color: color.soundLine})
    // 自定義線條渲染
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_line_color: {
          value: new THREE.Color({ color: color.soundLine})
        }
      },
      vertexShader: `
        void main () {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 u_line_color;
        void main () {
          gl_FragColor = vec4(u_line_color, 1.0);
        }
      `,
    })
    // 創建線條
    const line = new THREE.LineSegments(geometry, material)
    // 繼承建築物的偏移量和旋轉
    line.scale.copy(this.child.scale)
    line.rotation.copy(this.child.rotation)
    line.position.copy(this.child.position)
    this.scene.add(line)
  }
}