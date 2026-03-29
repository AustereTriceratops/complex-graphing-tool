 import {initProgram, initPositionBuffer} from './glUtils'
 import {fragmentShader, vertexShader} from './shaders'

export default class glManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        const gl = canvas.getContext('webgl');
        gl.clearColor(0.5, 0.6, 0.1, 1.0);

        this.shaderProgram = initProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(this.shaderProgram);

        this.shaderAttribs = {
            vertexPosition: gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
            // resolution: gl.getUniformLocation(this.shaderProgram, 'resolution'),
            // aspect: gl.getUniformLocation(this.shaderProgram, 'aspect')
        };
        
        // gl.uniform2fv(this.shaderAttribs.resolution, [this.width, this.height]);
        // gl.uniform1f(this.shaderAttribs.aspect, this.height/this.width)

        this.positionBuffer = initPositionBuffer(gl, this.shaderAttribs.vertexPosition);

        this.gl = gl
    }

    render() {
        console.log("render called")
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}