export function initShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );

    return shader;
}

export function initProgram(gl, vertexSource, fragmentSource) {
    // create shaders
    const vShader = initShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fShader = initShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    // create program then attach + link shaders
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);

    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) throw Error(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`
    );

    return shaderProgram;
}

export function initArrayBuffer(gl, array, attribute, dim) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, dim, gl.FLOAT, true, 0, 0);

    return buffer;
}

// initialize positions for a square mesh
export function initPositionBuffer(gl, positionAttrib) {
    const positions = new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0
    ]);

    return initArrayBuffer(gl, positions, positionAttrib, 2);
}
