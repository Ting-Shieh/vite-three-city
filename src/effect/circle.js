import * as THREE from 'three'
import {color} from '../config/constants.js'
import { Cylinder } from './cylinder.js'

export class Circle {
  constructor(scene, time) {
    this.config = {
      radius: 300,
      height: 50,
      open: false,
      color: color.circleColor,
      opacity: 0.6,
      position: {
        x: 1500,
        y: -400,
        z: 300
      },
      speed: 2.0
    }
    new Cylinder(scene, time).createCylinder(this.config)
  }
}