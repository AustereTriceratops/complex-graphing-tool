const vertexShader = `
attribute vec4 aVertexPosition;

void main() {
    gl_Position = aVertexPosition;
}
`

const fragmentShaderSetup = `
precision highp float;

float PI = 3.14159265358;
vec2 i = vec2(0.0, 1.0);

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

float complex_angle(vec2 a) {
  return atan(a.y, a.x);
}

float complex_radius(vec2 a) {
  return sqrt(len_sq(a));
}
  
vec2 c_multiply(vec2 a, vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}
    
// calculate a/b
vec2 c_divide(vec2 a, vec2 b) {
  return a * conj(b)/len_sq(b);
}

vec2 c_pow2(vec2 a) {
  return vec2(a.x * a.x - a.y * a.y, 2.0 * a.x * a.y);
}

vec2 c_pow4(vec2 a) {
  vec2 sq = c_pow2(a);
  return c_pow2(sq);
}

// De Moivre's theorem: formula for integer/rational complex powers
// NOTE: for rational powers, this will only return the "first" branch.
//       Since p/q will have q distinct roots to choose from, we can't
//       fully enumerate all the possible roots in GLSL anyway. So it 
//       doesn't matter
///////////////////////////////////////////////////////////////////////
vec2 c_pow(vec2 a, float p) {
  float radius = complex_radius(a);
  float angle = complex_angle(a);
  
  return pow(radius, p) * vec2(cos(p * angle), sin(p * angle));
}
  
// implementation of complex exponentiation
// e^(a + ib) = e^a * e^(ib) = e^a * (cos(b) + i*sin(b))
///////////////////////////////////////////////////////////////////////
vec2 c_exp(vec2 a) {
  return exp(a.x) * vec2(cos(a.y), sin(a.y));
}
`

const functionToBeGraphed = `
vec2 function(vec2 x) {
  // vec2 y = c_multiply(x, c_pow4(x)) - vec2(0.5, 0.0);
  // vec2 y = c_exp(x);
  vec2 y = c_pow(x, 3.0) - vec2(1.0, 0.0);

  return y;
}

// the basic term q in q expansions
vec2 q(vec2 x) {
  vec2 y = c_exp(2.0*PI*c_multiply(i, x));

  return y;
}

vec2 dedekind_eta_function(vec2 x) {
  vec2 q = q(x);
  vec2 fac = c_pow(q, 1.0/24.0);
  vec2 term_1 = vec2(1.0, 0.0) - q;

  vec2 prod1 = c_multiply(fac, term_1);
  vec2 prod2 = c_multiply(prod1, vec2(1.0, 0.0) - c_pow(q, 2.0));
  vec2 prod3 = c_multiply(prod2, vec2(1.0, 0.0) - c_pow(q, 3.0));
  vec2 prod4 = c_multiply(prod3, vec2(1.0, 0.0) - c_pow(q, 4.0));
  vec2 prod5 = c_multiply(prod4, vec2(1.0, 0.0) - c_pow(q, 5.0));
  vec2 prod6 = c_multiply(prod5, vec2(1.0, 0.0) - c_pow(q, 6.0));
  vec2 prod7 = c_multiply(prod6, vec2(1.0, 0.0) - c_pow(q, 7.0));
  vec2 prod8 = c_multiply(prod7, vec2(1.0, 0.0) - c_pow(q, 8.0));
  vec2 prod9 = c_multiply(prod8, vec2(1.0, 0.0) - c_pow(q, 9.0));
  vec2 prod10 = c_multiply(prod9, vec2(1.0, 0.0) - c_pow(q, 10.0));

  return prod10;
}
`

const fragmentShaderMain = `
// gl_FragCoord in [ (0, 0), (pixel_width, pixel_height) ]
void main() {
  // these ternary conditions ensure that the scale of the image will never be below 1 in either dimension
  vec2 aspect_ = (aspect < 1.0) ? vec2(1.0/aspect, 1.0) : vec2(1.0, aspect);
  
  // all coords will be in the range [-1, 1] and [-aspect, aspect]

  vec2 normalized_coords = aspect_ * 2.0 * gl_FragCoord.xy/resolution - aspect_;
  float zoom = 1.0;
  vec2 displacement = vec2(0.0, 1.0);
  vec2 coords = zoom * normalized_coords + displacement;

  vec2 val = (coords.y > 0.0) ? dedekind_eta_function(coords) : vec2(0.0,0.0);
  // vec2 val = function(coords);

  float angle = complex_angle(val);
  float radius = complex_radius(val);

  // modulate the brightness by complex magnitude
  float fac = 1.0/(pow(radius, 0.3) + 1.0);

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
