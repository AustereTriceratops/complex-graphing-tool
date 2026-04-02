const vertexShader = `
attribute vec4 aVertexPosition;

void main() {
    gl_Position = aVertexPosition;
}
`

const fragmentShaderSetup = `
precision highp float;

float PI = 3.14159265358;

// canvas dims
uniform vec2 resolution;
uniform float aspect;

// display parameters
uniform float param_1;
uniform float param_2;
`

const complexNumbers = `
vec2 conj(vec2 a) {
  return vec2(a.x, -a.y);
}

float len_sq(vec2 a) {
  return a.x*a.x + a.y*a.y;
}
  
vec2 multiply(vec2 a, vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}
    
// calculate a/b
vec2 divide(vec2 a, vec2 b) {
  return a * conj(b)/len_sq(b);
}

vec2 square(vec2 a) {
  return vec2(a.x * a.x - a.y * a.y, 2.0 * a.x * a.y);
}

vec2 pow4(vec2 a) {
  vec2 sq = square(a);
  return square(sq);
}
`

const functionToBeGraphed = `
vec2 function(vec2 x) {
  vec2 y = pow4(x) - vec2(0.5, 0.0);

  return y;
}
`

const fragmentShaderMain = `
// gl_FragCoord in [ (0, 0), (pixel_width, pixel_height) ]
void main() {
  // these ternary conditions ensures that the scale of the image will never be below 1 in either dimension
  vec2 scale = (aspect < 1.0) ? vec2(1.0/aspect, 1.0) : vec2(1.0, aspect);
  vec2 disp = (aspect < 1.0) ? vec2(1.0/aspect, 1.0) : vec2(1.0, aspect);
  
  // all coords will be in the range [-1, 1] and [-aspect, aspect]
  vec2 coords = scale * 2.0 * gl_FragCoord.xy/resolution - disp;

  vec2 val = function(coords);

  float angle = atan(val.y, val.x);
  float radius = sqrt(val.x * val.x + val.y * val.y);

  // modulate the brightness by complex magnitude
  float fac = 1.0/(radius + 1.0);

  // color by complex angle
  vec3 color = vec3(sin(angle + param_2), sin(angle + param_2 - 2.0*PI/3.0), sin(angle + param_2 - 4.0*PI/3.0));
  
  // extra parameters
  float inv_param_1 = 1.0 - param_1;
  color = vec3(inv_param_1, inv_param_1, inv_param_1) + param_1 * color;

  gl_FragColor = vec4(fac*color, 1.0);
}
`

const fragmentShader = fragmentShaderSetup + complexNumbers + functionToBeGraphed + fragmentShaderMain

export {vertexShader, fragmentShader}
