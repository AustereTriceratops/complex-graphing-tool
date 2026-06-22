// TODO: contour lines

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
uniform float zoom;
uniform vec2 offset;

// display parameters
uniform float param_1;
uniform float param_2;
uniform float degree;
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
  return c_multiply(a, conj(b)/len_sq(b));
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

// TODO: fully implement
vec2 c_pow_full(vec2 a, vec2 p) {
  float radius = complex_radius(a);
  float angle = complex_angle(a);
  
  return pow(radius, p.x) * vec2(cos(p.x * angle), sin(p.x * angle));
}
  
// implementation of complex exponentiation
// e^(a + ib) = e^a * e^(ib) = e^a * (cos(b) + i*sin(b))
///////////////////////////////////////////////////////////////////////
vec2 c_exp(vec2 a) {
  return exp(a.x) * vec2(cos(a.y), sin(a.y));
}
`

const functions = `
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

vec2 eisenstein_function_4(vec2 x) {
  vec2 q = q(x); 
  vec2 term_1 = c_divide(q, vec2(1.0, 0.0) - q);

  vec2 q_pow_2 = c_pow(q, 2.0);
  vec2 term_2 = pow(2.0, 3.0) * c_divide(q_pow_2, vec2(1.0, 0.0) - q_pow_2);
  vec2 q_pow_3 = c_pow(q, 3.0);
  vec2 term_3 = pow(3.0, 3.0) * c_divide(q_pow_3, vec2(1.0, 0.0) - q_pow_3);
  vec2 q_pow_4 = c_pow(q, 4.0);
  vec2 term_4 = pow(4.0, 3.0) * c_divide(q_pow_4, vec2(1.0, 0.0) - q_pow_4);
  vec2 q_pow_5 = c_pow(q, 5.0);
  vec2 term_5 = pow(5.0, 3.0) * c_divide(q_pow_5, vec2(1.0, 0.0) - q_pow_5);
  vec2 q_pow_6 = c_pow(q, 6.0);
  vec2 term_6 = pow(6.0, 3.0) * c_divide(q_pow_6, vec2(1.0, 0.0) - q_pow_6);
  vec2 q_pow_7 = c_pow(q, 7.0);
  vec2 term_7 = pow(7.0, 3.0) * c_divide(q_pow_7, vec2(1.0, 0.0) - q_pow_7);
  vec2 q_pow_8 = c_pow(q, 8.0);
  vec2 term_8 = pow(8.0, 3.0) * c_divide(q_pow_8, vec2(1.0, 0.0) - q_pow_8);
  vec2 q_pow_9 = c_pow(q, 9.0);
  vec2 term_9 = pow(9.0, 3.0) * c_divide(q_pow_9, vec2(1.0, 0.0) - q_pow_9);
  vec2 q_pow_10 = c_pow(q, 10.0);
  vec2 term_10 = pow(10.0, 3.0) * c_divide(q_pow_10, vec2(1.0, 0.0) - q_pow_10);
  vec2 q_pow_11 = c_pow(q, 11.0);
  vec2 term_11 = pow(11.0, 3.0) * c_divide(q_pow_11, vec2(1.0, 0.0) - q_pow_11);
  vec2 q_pow_12 = c_pow(q, 12.0);
  vec2 term_12 = pow(12.0, 3.0) * c_divide(q_pow_12, vec2(1.0, 0.0) - q_pow_12);
  vec2 q_pow_13 = c_pow(q, 13.0);
  vec2 term_13 = pow(13.0, 3.0) * c_divide(q_pow_13, vec2(1.0, 0.0) - q_pow_13);
  vec2 q_pow_14 = c_pow(q, 14.0);
  vec2 term_14 = pow(14.0, 3.0) * c_divide(q_pow_14, vec2(1.0, 0.0) - q_pow_14);
  vec2 q_pow_15 = c_pow(q, 15.0);
  vec2 term_15 = pow(15.0, 3.0) * c_divide(q_pow_15, vec2(1.0, 0.0) - q_pow_15);
  vec2 q_pow_16 = c_pow(q, 16.0);
  vec2 term_16 = pow(16.0, 3.0) * c_divide(q_pow_16, vec2(1.0, 0.0) - q_pow_16);
  vec2 q_pow_17 = c_pow(q, 17.0);
  vec2 term_17 = pow(17.0, 3.0) * c_divide(q_pow_17, vec2(1.0, 0.0) - q_pow_17);
  vec2 q_pow_18 = c_pow(q, 18.0);
  vec2 term_18 = pow(18.0, 3.0) * c_divide(q_pow_18, vec2(1.0, 0.0) - q_pow_18);
  vec2 q_pow_19 = c_pow(q, 19.0);
  vec2 term_19 = pow(19.0, 3.0) * c_divide(q_pow_19, vec2(1.0, 0.0) - q_pow_19);

  // return vec2(1.0, 0.0) + 240.0 * (term_1 + term_2 + term_3 + term_4 + term_5 + term_6 + term_7 + term_8 + term_9 + term_10);
  return vec2(1.0, 0.0) + 240.0 * (
    term_1 + term_2 + term_3 + term_4 + term_5 + term_6 + term_7 + term_8 + term_9 + term_10 +
    term_11 + term_12 + term_13 + term_14 + term_15 + term_16 + term_17 + term_18 + term_19
  );
}
`

const fragmentShaderMain = `
// gl_FragCoord in [ (0, 0), (pixel_width, pixel_height) ]
void main() {
  // these ternary conditions ensure that the scale of the image will never be below 1 in either dimension
  vec2 aspect_ = (aspect < 1.0) ? vec2(1.0/aspect, 1.0) : vec2(1.0, aspect);
  
  // all coords will be in the range [-1, 1] and [-aspect, aspect]

  vec2 normalized_coords = aspect_ * 2.0 * gl_FragCoord.xy/resolution - aspect_;
  vec2 coords = zoom * normalized_coords + offset;

  // vec2 val = (coords.y > 0.0) ? eisenstein_function_4(coords) : vec2(0.0,0.0);
  vec2 val = function(coords);

  float angle = complex_angle(val);
  float radius = complex_radius(val);

  
  // modulate the brightness by complex magnitude
  float fac = 1.0/(0.2*pow(radius, 0.2) + 1.0);
  // float fac = radius; // cool visual effect
  // float fac = 1.0 - 1.0/(radius + 1.0);
  

  // color by complex angle
  float phased_angle = angle + param_2;
  vec3 color = vec3(sin(phased_angle), sin(phased_angle - 2.0*PI/3.0), sin(phased_angle - 4.0*PI/3.0));


  // draw contour lines
  float tightness_angular = 40.0*max(length(coords), 0.1);
  float n_contours = 8.0;
  float contour_mask_angular = min(tightness_angular * sin(n_contours * phased_angle) + tightness_angular, 1.0);

  float tightness_radial = 40.0;
  // float contour_mask_radial = min(tightness_radial * cos(20.0*pow(radius, 1.0/degree)) + tightness_radial, 1.0);
  float contour_mask_radial = min(tightness_radial * cos(8.0*log(radius)) + tightness_radial, 1.0);

  float contour_mask = contour_mask_radial * contour_mask_angular;
  

  // extra parameters
  float inv_param_1 = 1.0 - param_1;
  color = vec3(inv_param_1, inv_param_1, inv_param_1) + param_1 * color;

  gl_FragColor = vec4(contour_mask*fac*color, 1.0);
}
`

const user_function = `
vec2 function(vec2 x) {
  // vec2 y = c_multiply(x, c_pow4(x)) - vec2(0.5, 0.0);
  // vec2 y = c_exp(x);
  vec2 y = c_pow(x, 5.0) - vec2(1.0, 0.0);

  return y;
}
`

const fragmentShader = fragmentShaderSetup + complexNumbers + functions + user_function + fragmentShaderMain

export function createFragmentShader(user_function) {
  const shader = fragmentShaderSetup + complexNumbers + functions + user_function + fragmentShaderMain;

  return shader;
}

export {vertexShader, fragmentShader}
