const vertexShader = `
attribute vec4 aVertexPosition;

void main() {
    gl_Position = aVertexPosition;
}
`

const fragmentShaderSetup = `
precision highp float;
`

const coordinateTransforms =
`
// COORDINATE TRANSFORMS ===========
vec2 to0Pos1( vec2 v ) {
  return vec2(aspect, 1.0) * v / resolution;
}

vec2 toNeg1Pos1( vec2 v ) {
  vec2 w = to0Pos1(v);
  return vec2(2.0*w.x - aspect, 2.0*w.y - 1.0);
}

// maps p in interval a to interval b
float toInterval( vec2 a, vec2 b, float p ) {
  float n = (p - a.x)/(a.y - a.x);
  float m = n * (b.y - b.x) + b.x;
  return m;
}
`

const fragmentShaderMain = `
// gl_FragCoord in [0,1]
void main() {
    // vec2 uv = toNeg1Pos1(gl_FragCoord.xy) * vec2(1.0/(aspect*aspect), 1.0);

    // background color
    vec3 color = vec3(0.9, 0.6, 0.65);

    gl_FragColor = vec4(color, 1.0);
}
`

const fragmentShader = fragmentShaderSetup + fragmentShaderMain

export {vertexShader, fragmentShader}
