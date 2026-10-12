precision highp float;
uniform vec2 uResolution;
uniform float uTime;
float gauss(float z,float s){return exp(-pow(z/s,2.));}
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec2 warp(vec2 p,float t){return p+vec2(.085*sin(p.y*4.8+p.x*1.4+t)+.026*sin(p.y*8.1-p.x*3.2-t*.6),.095*sin(p.x*4.1-p.y*1.3+t*.7));}
float surface(vec2 p,float t){vec2 q=warp(p,t);return q.y-.56+.24*sin(q.x*4.5-.65+t*.3);}
vec3 water(vec2 p,float t){
 vec2 q=warp(p,t);float u=q.x,v=q.y,f=surface(p,t);
 float w=.13+.065*(1.-clamp(u,0.,1.));
 vec3 c=vec3(0.,102.,255.)/255.;
 c=mix(c,vec3(25.,49.,173.)/255.,exp(-pow((u-.43)/.55,2.)-pow((v-.87)/.44,2.))*.72);
 c=mix(c,vec3(128.,142.,227.)/255.,exp(-pow((u-.10)/.50,2.)-pow((v-.04)/.44,2.))*.82);
 c=mix(c,vec3(40.,174.,225.)/255.,gauss(f,w)*.80);
 c=mix(c,vec3(122.,200.,231.)/255.,gauss(f+.075,w*.70)*.30);
 c=mix(c,vec3(20.,88.,206.)/255.,gauss(f-.18,.12)*exp(-pow((u-.55)/.65,2.))*.36);
 float g=u-.93+.12*sin(v*4.4+.8+t*.35);
 c=mix(c,vec3(62.,168.,225.)/255.,gauss(g,.22)*.62);
 c=mix(c,vec3(169.,211.,235.)/255.,exp(-pow((u-.76)/.40,2.)-pow((v+.04)/.27,2.))*.50);
 return c;
}
void main(){
 vec2 p=gl_FragCoord.xy/uResolution;p.y=1.-p.y;
 float t=uTime*.24;
 vec2 q=warp(p,t);
 // A curved ice lens: varying thickness, a displaced transmitted background,
 // a darker inner bevel, and broad low-energy scattering, rather than glow.
 float d=surface(p,t)+.045;
 float thickness=.043+.020*(.5+.5*sin(q.x*5.+t*.45));
 float lens=1.-smoothstep(thickness-.012,thickness+.012,abs(d));
 vec2 n=normalize(vec2(1.08*cos(q.x*4.5-.65+t*.3),1.));
 float bevel=d/thickness;
 float micro=.003*sin(q.x*24.+q.y*7.+t*.4);
 vec2 offset=n*(.042*bevel+micro)*lens;
 vec3 c=water(p,t);
 vec3 transmission=water(p+offset,t);
 // Very small channel separation suggests dispersion through thickness.
 transmission.r=water(p+offset*1.10,t).r;
 transmission.b=water(p+offset*.90,t).b;
 c=mix(c,transmission,lens*.85);
 float rim=gauss(d+thickness*.80,.011)*(.40+.60*pow(sin(q.x*6.+.8),2.));
 float inner=gauss(d-thickness*.65,.014);
 c=mix(c,vec3(.12,.37,.69),inner*.27);
 c=mix(c,vec3(.60,.81,.90),rim*.24);
 float scatter=gauss(d,.060)*(.5+.5*sin(q.x*7.+t*.3));
 c=mix(c,vec3(.48,.73,.86),scatter*.09);
 float grain=(hash(floor(p*vec2(2200.,1238.)))-.5)*.010;
 gl_FragColor=vec4(clamp(c+grain,0.,1.),1.);
}
