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
            saturation: this.gl.getUniformLocation(this.shaderProgram, 'saturation'),
            phase: this.gl.getUniformLocation(this.shaderProgram, 'phase'),
            radialOffset: this.gl.getUniformLocation(this.shaderProgram, 'radialOffset')
        };
        
        this.gl.uniform2fv(this.shaderAttribs.resolution, [this.width, this.height]);
        this.gl.uniform1f(this.shaderAttribs.aspect, this.height/this.width)

        this.positionBuffer = initPositionBuffer(this.gl, this.shaderAttribs.vertexPosition);
    }

    render(zoom, offsetX, offsetY, saturation, phase, radialOffset) {
        this.gl.uniform1f(this.shaderAttribs.zoom, zoom);
        this.gl.uniform2fv(this.shaderAttribs.offset, [offsetX, offsetY]);
        this.gl.uniform1f(this.shaderAttribs.saturation, saturation);
        this.gl.uniform1f(this.shaderAttribs.phase, phase);
        this.gl.uniform1f(this.shaderAttribs.radialOffset, radialOffset);

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}