 import {initProgram, initPositionBuffer} from './glUtils'
 import {fragmentShader, vertexShader} from './shaders'

export default class glManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        const gl = canvas.getContext('webgl');
        this.gl = gl;

        this.gl.clearColor(0.5, 0.6, 0.1, 1.0);

        this.updateFragmentShader(fragmentShader);
    }

    updateDims(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;

        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.uniform2fv(this.shaderAttribs.resolution, [this.width, this.height]);
        this.gl.uniform1f(this.shaderAttribs.aspect, this.height/this.width);
    }

    updateFragmentShader(fragmentShader) {
        this.shaderProgram = initProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.shaderProgram);

        this.shaderAttribs = {
            vertexPosition: this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
            resolution: this.gl.getUniformLocation(this.shaderProgram, 'resolution'),
            aspect: this.gl.getUniformLocation(this.shaderProgram, 'aspect'),
            zoom: this.gl.getUniformLocation(this.shaderProgram, 'zoom'),
            offset: this.gl.getUniformLocation(this.shaderProgram, 'offset'),
            param_1: this.gl.getUniformLocation(this.shaderProgram, 'param_1'),
            param_2: this.gl.getUniformLocation(this.shaderProgram, 'param_2'),
            degree: this.gl.getUniformLocation(this.shaderProgram, 'degree')
        };
        
        this.gl.uniform2fv(this.shaderAttribs.resolution, [this.width, this.height]);
        this.gl.uniform1f(this.shaderAttribs.aspect, this.height/this.width)

        this.positionBuffer = initPositionBuffer(this.gl, this.shaderAttribs.vertexPosition);
    }

    render(zoom, offsetX, offsetY, shaderParameter1, shaderParameter2, degree) {
        this.gl.uniform1f(this.shaderAttribs.zoom, zoom);
        this.gl.uniform2fv(this.shaderAttribs.offset, [offsetX, offsetY]);
        this.gl.uniform1f(this.shaderAttribs.param_1, shaderParameter1);
        this.gl.uniform1f(this.shaderAttribs.param_2, shaderParameter2);
        this.gl.uniform1f(this.shaderAttribs.degree, degree);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}