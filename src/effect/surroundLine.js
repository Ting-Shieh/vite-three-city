import * as THREE from 'three'
import {color} from '../config/constants.js'
export class SurroundLine {
  constructor(scene, child, height, time) {
    this.height = height
    this.time = time
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
        // 當前掃描高度
        u_height: this.height,
        // 掃描線條的顏色
        u_up_color: {
          value: new THREE.Color(color.risingColor)
        },
        u_city_color: {
          value: new THREE.Color(this.meshColor)
        },
        u_head_color: {
          value: new THREE.Color(this.headColor)
        },
        u_size: {
          value: size //this.size
        },
        u_time: this.time
      },
      vertexShader: `
        uniform float u_time;
        varying vec3 v_position;
        void main () {
          v_position = position;
          float uMax = 4.0;
          
          // 建築物生長
          // position.y += u_time; // 無效
          float rate = u_time / uMax * 2.0; // 變化的比例
          // 邊界條件
          if (rate>1.0) {
            rate = 1.0;
          }
          float z = position.z * rate;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_position;
        uniform vec3 u_city_color;
        uniform vec3 u_head_color;
        uniform float u_size;
        uniform float u_height;
        uniform vec3 u_up_color;
        void main () {
          vec3 base_color = u_city_color;
          base_color = mix(base_color, u_head_color, v_position.z / u_size); // 混合好的顏色數據
          // 上升線條的高度是多少
          if(u_height > v_position.z && u_height < v_position.z + 6.0){
            // 掃瞄線條模糊顏色
            float f_index = (u_height - v_position.z) / 3.0;
            // base_color = u_up_color;
            base_color = mix(u_up_color, base_color, abs(f_index - 1.0));
          }
          
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
    // 獲取掃描位置
    const {max, min} = this.child.geometry.boundingBox
    // // api創建
    // const material = new THREE.LineBasicMaterial({ color: color.soundLine})
    // 自定義線條渲染
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_line_color: {
          value: new THREE.Color({ color: color.soundLine})
        },
        // 一個不斷變化的值 ex: u_height u_time
        u_time: this.time,
        // 掃描的位置
        u_max: {
          value: max
        },
        u_min: {
          value: min
        },
        // 掃描的顏色
        u_live_color: {
          value: new THREE.Color({ color: color.liveColor})
        }
      },
      vertexShader: `
        uniform float u_time;
        uniform vec3 u_line_color;
        uniform vec3 u_live_color;
        uniform vec3 u_max;
        uniform vec3 u_min;
        
        // varying 變量要放到片元著色器
        varying vec3 v_color;
        void main () {
          // 建築物生長
          float uMax = 4.0; // 變化的時間
          float rate = u_time / uMax * 2.0; // 變化的比例
          // 建築物生長邊界條件
          if (rate>1.0) {
            rate = 1.0;
          }
          float z = position.z * rate;
          float new_time = mod(u_time * 0.1, 1.0);
          // 掃描的位置
          float rangeY = mix(u_min.y, u_max.y, new_time);
          // 該區間內顯示掃描光帶
          if(rangeY < position.y && rangeY > position.y - 100.0){
            float f_index = 1.0 - sin((position.y - rangeY) / 100.0 * 3.14);
            float r = mix(u_live_color.r, u_line_color.r, f_index);
            float g = mix(u_live_color.g, u_line_color.g, f_index);
            float b = mix(u_live_color.b, u_line_color.b, f_index);
          
            v_color = vec3(r, g, b);
          } else {
            v_color = u_line_color;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vec2(position), z, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_color;
        // uniform vec3 u_line_color;
        void main () {
          // gl_FragColor = vec4(u_line_color, 1.0);
          gl_FragColor = vec4(v_color, 1.0);
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