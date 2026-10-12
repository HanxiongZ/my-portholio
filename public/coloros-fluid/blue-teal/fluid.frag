precision highp float;
uniform vec2 uResolution;
uniform float uTime;
float gauss(float z,float s){return exp(-pow(z/s,2.0));}
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
void main(){
 vec2 p=gl_FragCoord.xy/uResolution;p.y=1.-p.y;
 float x=p.x,y=p.y,t=uTime*.045;
 float colorShift=smoothstep(.35,.95,x);
 float u=x+.085*sin(y*4.8+x*1.4+t)+.026*sin(y*8.1-x*3.2-t*.6);
 float v=y+.095*sin(x*4.1-y*1.3+t*.7);
 float f=v-.56+.24*sin(u*4.5-.65+t*.3);
 float w=.13+.065*(1.-clamp(u,0.,1.));
 vec3 c=mix(vec3(0.,102.,255.),vec3(0.,200.,166.),colorShift)/255.;
 float deep=exp(-pow((u-.43)/.55,2.)-pow((v-.87)/.44,2.));
 c=mix(c,mix(vec3(25.,49.,173.),vec3(5.,110.,102.),colorShift)/255.,deep*.72);
 float lilac=exp(-pow((u-.10)/.50,2.)-pow((v-.04)/.44,2.));
 c=mix(c,mix(vec3(128.,142.,227.),vec3(102.,203.,185.),colorShift)/255.,lilac*.82);
 c=mix(c,mix(vec3(40.,174.,225.),vec3(47.,203.,176.),colorShift)/255.,gauss(f,w)*.80);
 c=mix(c,mix(vec3(122.,200.,231.),vec3(142.,233.,214.),colorShift)/255.,gauss(f+.075,w*.70)*.42);
 float shadow=gauss(f-.18,.12)*exp(-pow((u-.55)/.65,2.));
 c=mix(c,mix(vec3(20.,88.,206.),vec3(7.,158.,140.),colorShift)/255.,shadow*.36);
 float g=u-.93+.12*sin(v*4.4+.8+t*.35);
 c=mix(c,mix(vec3(62.,168.,225.),vec3(68.,214.,185.),colorShift)/255.,gauss(g,.22)*.62);
 float mist=exp(-pow((u-.76)/.40,2.)-pow((v+.04)/.27,2.));
 c=mix(c,mix(vec3(169.,211.,235.),vec3(181.,241.,221.),colorShift)/255.,mist*.50);
 // Fixed fine and medium grain: tactile rather than flickering.
 vec2 grainUV=p*vec2(1600.,900.);
 float grain=(hash(floor(grainUV))-.5)*.024+(noise(grainUV/2.3)-.5)*.027;
 gl_FragColor=vec4(clamp(c+grain,0.,1.),1.);
}
