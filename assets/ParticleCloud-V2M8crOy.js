import{j as h,C as S,b as c,u as A,S as P,V as z,A as E,c as b,B as L,d as y}from"./three-Dj-t5hDI.js";const R=`
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uAmp;
  uniform float uPointerStrength;
  uniform vec2  uPointer;
  attribute float aSeed;
  varying float vMix;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float t = uTime;

    // slow organic wave motion
    p.y += sin(p.x * 0.9 + t * 0.6 + aSeed * 6.2831) * 0.18 * uAmp;
    p.z += cos(p.x * 0.7 - t * 0.5 + p.y * 0.8) * 0.35 * uAmp;
    p.x += sin(p.y * 1.3 + t * 0.4 + aSeed * 12.0) * 0.08 * uAmp;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    // pointer / touch displacement (view space)
    vec2 d = mv.xy - uPointer;
    float dist = length(d);
    float f = exp(-dist * dist * 0.35) * uPointerStrength;
    mv.xy += normalize(d + vec2(1e-4)) * f * 0.9;
    mv.z  += f * 0.8;

    gl_Position = projectionMatrix * mv;

    float tw = 0.6 + 0.4 * sin(t * 1.5 + aSeed * 40.0);
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.95) * (0.8 + 0.2 * tw) * (9.0 / -mv.z);

    vMix = clamp(0.5 + p.y * 0.18 + p.z * 0.1, 0.0, 1.0);
    vAlpha = (0.3 + 0.7 * aSeed) * (0.65 + 0.35 * tw);
  }
`,j=`
  varying float vMix;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    a *= a;

    vec3 deep = vec3(0.30, 0.08, 0.85);
    vec3 mid  = vec3(0.62, 0.22, 1.00);
    vec3 hot  = vec3(0.95, 0.60, 1.00);
    vec3 col = mix(deep, mid, smoothstep(0.0, 0.6, vMix));
    col = mix(col, hot, smoothstep(0.68, 1.0, vMix));

    gl_FragColor = vec4(col, a * vAlpha);
  }
`;function x(){return Math.random()+Math.random()+Math.random()-1.5}function C(a){const v=new Float32Array(a*3),i=new Float32Array(a);for(let s=0;s<a;s++){const o=Math.random()*2-1,d=Math.random()*2-1;let f=o*5.2,p=Math.sin(o*2.4+d*1.2)*1.1+d*1.5*(1-.35*Math.abs(o)),u=Math.cos(o*1.8-d*2.2)*1.6+d*.8;const n=Math.pow(Math.random(),2.2)*.9+.05;f+=x()*n*1.2,p+=x()*n,u+=x()*n,v.set([f,p,u],s*3),i[s]=Math.random()}const t=new L;return t.setAttribute("position",new y(v,3)),t.setAttribute("aSeed",new y(i,1)),t}function T({count:a,size:v,reduced:i}){const t=c.useRef();c.useRef();const s=c.useRef({x:0,y:0,tx:0,ty:0,active:0,tActive:0}),{viewport:o,size:d,gl:f}=A(),p=c.useMemo(()=>C(a),[a]),u=c.useMemo(()=>new P({vertexShader:R,fragmentShader:j,transparent:!0,depthWrite:!1,blending:E,uniforms:{uTime:{value:0},uSize:{value:v},uPixelRatio:{value:1},uAmp:{value:i?.25:1},uPointerStrength:{value:0},uPointer:{value:new z(0,0)}}}),[]);return c.useEffect(()=>()=>{p.dispose(),u.dispose()},[p,u]),c.useEffect(()=>{if(i)return;const n=s.current,l=r=>{n.tx=r.clientX/window.innerWidth*2-1,n.ty=-(r.clientY/window.innerHeight*2-1),n.tActive=1},e=()=>n.tActive=0;return window.addEventListener("pointermove",l,{passive:!0}),window.addEventListener("pointerdown",l,{passive:!0}),window.addEventListener("pointerup",e,{passive:!0}),window.addEventListener("pointercancel",e,{passive:!0}),document.documentElement.addEventListener("pointerleave",e),()=>{window.removeEventListener("pointermove",l),window.removeEventListener("pointerdown",l),window.removeEventListener("pointerup",e),window.removeEventListener("pointercancel",e),document.documentElement.removeEventListener("pointerleave",e)}},[i]),b((n,l)=>{const e=s.current,r=u.uniforms,w=1-Math.pow(.001,l);e.x+=(e.tx-e.x)*w*.6,e.y+=(e.ty-e.y)*w*.6,e.active+=(e.tActive-e.active)*w*.5,r.uTime.value+=l*(i?.25:1),r.uPixelRatio.value=f.getPixelRatio(),r.uPointer.value.set(e.x*o.width/2,e.y*o.height/2),r.uPointerStrength.value=e.active;const m=t.current;if(m){const g=d.width<768,M=Math.min(1,o.width/8);m.scale.setScalar(M),m.position.x=g?0:o.width*.17,m.position.y=g?-o.height*.14:0,m.rotation.y=r.uTime.value*.07+e.x*.25,m.rotation.x=-e.y*.12}}),h.jsx("group",{ref:t,children:h.jsx("points",{geometry:p,material:u,frustumCulled:!1})})}function F({tier:a,paused:v,reduced:i}){const t={mobile:{count:16e3,size:2.6,dpr:[1,1.25]},tablet:{count:32e3,size:2.4,dpr:[1,1.5]},desktop:{count:6e4,size:2.2,dpr:[1,1.75]}}[a];return h.jsx(S,{className:"cloud-canvas",dpr:t.dpr,frameloop:v?"never":"always",camera:{position:[0,0,9],fov:50,near:.1,far:60},gl:{antialias:!1,alpha:!0,powerPreference:"high-performance"},"aria-hidden":"true",children:h.jsx(T,{count:t.count,size:t.size,reduced:i})})}export{F as default};
