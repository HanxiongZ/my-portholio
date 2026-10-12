precision highp float;
uniform vec2 uResolution;
uniform float uTime;
float gauss(float z,float s){return exp(-pow(z/s,2.0));}
void main(){
 vec2 p=gl_FragCoord.xy/uResolution;
 p.y=1.0-p.y;
 float x=p.x,y=p.y,t=uTime*.045;
 float u=x+.10*sin(y*5.8+x*2.1+t)+.035*sin(y*13.0-x*5.0-t*.7);
 float v=y+.12*sin(x*4.5-y*2.2+t*.6);
 float f=v-.43+.24*sin(u*4.8-.8+t*.3)+.055*sin(u*11.5+v*3.0+t);
 float g=u-.84+.17*sin(v*5.7+t*.4);
 vec3 c=vec3(0.,102.,255.)/255.;
 c=mix(c,vec3(24.,38.,162.)/255.,clamp(.56*y+.24*pow(sin(u*4.0+v*3.0),2.0),0.,1.));
 c=mix(c,vec3(101.,109.,244.)/255.,gauss(f+.18,.20)*.72);
 c=mix(c,vec3(25.,195.,246.)/255.,gauss(f-.09,.19)*.87);
 c=mix(c,vec3(205.,244.,255.)/255.,gauss(f-.105,.045)*.72);
 c=mix(c,vec3(234.,249.,255.)/255.,gauss(f-.13,.008)*.72);
 c=mix(c,vec3(91.,223.,255.)/255.,gauss(g,.12)*.60);
 c=mix(c,vec3(221.,251.,255.)/255.,gauss(g-.035,.015)*.64);
 float mist=exp(-pow((x-.22)/.43,2.)-pow((y-.13)/.34,2.));
 c=mix(c,vec3(213.,235.,255.)/255.,mist*.66);
 float calm=exp(-pow((x-.5)/.25,2.)-pow((y-.5)/.31,2.))*.18;
 c=mix(c,vec3(20.,119.,255.)/255.,calm);
 float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
 gl_FragColor=vec4(c+grain*.0025,1.);
}
