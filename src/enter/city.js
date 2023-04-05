
import { loadFBX } from '@/utils/index.js'
import { SurroundLine } from '@/effect/surroundLine.js'
// import * as THREE from 'three'
export class City {
  constructor(scene) {
    this.scene = scene
    this.loadCity()
  }

  loadCity(){
    //加載模型並渲染到畫布 // beijing kaoshiung-small
    loadFBX('/src/model/kaoshiung-xs.fbx').then(object => {
      object.traverse((child) => {
        if(child.isMesh){
          // console.log(child)
          // const material = new THREE.MeshLambertMaterial({ color:'#ff0000' })
          // const material = new THREE.ShaderMaterial({ 
          //   uniforms: {
          //     city_color: {
          //       value: new THREE.Color('#1B3045')
          //     }
          //   },
          //   vertexShader: `
          //     void main () {
          //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          //     }
          //   `,
          //   fragmentShader: `
          //     uniform vec3 city_color;
          //     void main () {
          //       gl_FragColor = vec4(city_color, 1.0); // vec4(1.0, 0.0, 0.0, 1.0);
          //     }
          //   `,
          //  })

          // const mesh =  new THREE.Mesh(child.geometry, material)
          // // 讓 mesh 繼承 child 的旋轉 縮放 平移
          // mesh.position.copy(child.position)
          // mesh.rotation.copy(child.rotation)
          // mesh.scale.copy(child.scale)
          
          // this.scene.add(mesh)

          new SurroundLine(this.scene, child)
        }
      })
      // console.log(object)
      // this.scene.add(object)
    })
  }
  start(){}
}