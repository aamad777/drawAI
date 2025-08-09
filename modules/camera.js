// modules/camera.js
import { $ } from './helpers.js';

export function initCamera(){
  async function startCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      $('#video').srcObject = s;
    } catch {
      alert('Camera permission needed and HTTPS required.');
    }
  }
  function snapPhoto() {
    const v = $('#video'), c = $('#photoCanvas'), ctx = c.getContext('2d');
    const w=c.width, h=c.height, vw=v.videoWidth||640, vh=v.videoHeight||480;
    const sc = Math.min(w/vw, h/vh), nw=vw*sc, nh=vh*sc, dx=(w-nw)/2, dy=(h-nh)/2;
    ctx.clearRect(0,0,w,h); ctx.drawImage(v,dx,dy,nw,nh);
    applyFilter($('#filterSelect').value);
  }
  function applyFilter(type){
    const c=$('#photoCanvas'), ctx=c.getContext('2d'), w=c.width, h=c.height;
    const img=ctx.getImageData(0,0,w,h), d=img.data;
    if(type==='grayscale'){ for(let i=0;i<d.length;i+=4){ const a=(d[i]+d[i+1]+d[i+2])/3; d[i]=d[i+1]=d[i+2]=a; } }
    else if(type==='invert'){ for(let i=0;i<d.length;i+=4){ d[i]=255-d[i]; d[i+1]=255-d[i+1]; d[i+2]=255-d[i+2]; } }
    else if(type==='rainbow'){ for(let y=0;y<h;y++){ for(let x=0;x<w;x++){ const i=(y*w+x)*4; const t=y/h; d[i]=d[i]*(1-t)+255*t; d[i+1]=d[i+1]*(1-Math.abs(0.5-t))*2; d[i+2]=d[i+2]*(1-(1-t)); } } }
    else if(type==='comic'){ for(let i=0;i<d.length;i+=4){ d[i]=Math.floor(d[i]/64)*64; d[i+1]=Math.floor(d[i+1]/64)*64; d[i+2]=Math.floor(d[i+2]/64)*64; } }
    ctx.putImageData(img,0,0);
  }
  function downloadCanvas(canvas, filename){ const a=document.createElement('a'); a.href=canvas.toDataURL('image/png'); a.download=filename; a.click(); }

  $('#startCamBtn')?.addEventListener('click', startCamera);
  $('#snapBtn')?.addEventListener('click', snapPhoto);
  $('#filterSelect')?.addEventListener('change', e=>applyFilter(e.target.value));
  $('#downloadPhotoBtn')?.addEventListener('click', ()=>downloadCanvas($('#photoCanvas'), 'my_photo.png'));
}
