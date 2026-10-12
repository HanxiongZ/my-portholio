precision highp float;
uniform vec2 uResolution;
uniform float uTime;

float field(vec2 p, vec2 center, vec2 radius){
  vec2 d=(p-center)/radius;
  return exp(-dot(d,d)*2.0);
}
float hash(vec2 p){
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}
void main(){
  vec2 p=gl_FragCoord.xy/uResolution;p.y=1.-p.y;
  float t=uTime*.065;
  // Only the broad fields move; the paper-like grain stays anchored.
  vec2 q=p+vec2(.035*sin(p.y*4.0+t),.045*sin(p.x*3.8-t*.8));
  float cyan=field(q,vec2(.09+.055*sin(t*.8),.48+.07*cos(t*.7)),vec2(.61,.82));
  float blue=field(q,vec2(.48+.07*cos(t*.6),.79+.07*sin(t)),vec2(.55,.76));
  float violet=field(q,vec2(.96+.05*cos(t*.7),.62+.09*sin(t*.8)),vec2(.54,.85));
  vec3 color=(cyan*vec3(.055,.73,.83)+blue*vec3(0.,.4,1.)+violet*vec3(.48,.29,.88))/(cyan+blue+violet+.0001);
  float coverage=1.-exp(-(cyan+blue+violet)*2.6);
  // Soft neutral perimeter, with enough depth below for the white artwork.
  float top=1.-smoothstep(-.10,.43,p.y);
  float corner=field(p,vec2(0.,0.),vec2(.46,.38))+field(p,vec2(1.,0.),vec2(.46,.38));
  float mist=clamp(top*.52+corner*.15,0.,.72);
  color=mix(vec3(.935,.945,.95),color,coverage*(1.-mist));
  float grain=(hash(floor(gl_FragCoord.xy))-.5)*.037;
  gl_FragColor=vec4(clamp(color+grain,0.,1.),1.);
}
