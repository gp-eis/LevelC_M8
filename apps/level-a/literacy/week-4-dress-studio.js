(() => {
  'use strict';
  const modal=document.querySelector('#week4-game'),board=document.querySelector('#w4-game-board'),prompt=document.querySelector('#w4-game-prompt'),feedback=document.querySelector('#w4-game-feedback');
  const overlay=modal.querySelector('[data-week4-completion]'),goodJob=overlay.querySelector('video');
  const base='../assets/media/literacy/week-4-games/';
  const definitions={
    sportswear:{label:'sportswear',zone:'body',colors:[['Blue','#268cdf'],['Red','#ed5664'],['Yellow','#f6c53e']],patterns:['Stripes','Zigzags']},
    swimsuit:{label:'swimsuit',zone:'body',colors:[['Turquoise','#25bfc4'],['Coral','#ef7d79'],['Purple','#a46ad6']],patterns:['Waves','Bubbles']},
    sneakers:{label:'sneakers',zone:'feet',colors:[['Blue','#448edc'],['Purple','#9c69d4'],['Green','#4cbb89']],patterns:['Stars','Lightning']},
    helmet:{label:'helmet',zone:'head',colors:[['Orange','#f38a3d'],['Teal','#20aaa9'],['Red','#e95359']],patterns:['Flames','Checkers']},
    socks:{label:'socks',zone:'feet',colors:[['Pink','#ed83b2'],['Yellow','#efd15b'],['Mint','#83d7b7']],patterns:['Dots','Hearts']}
  };
  const designs=Object.fromEntries(Object.keys(definitions).map(id=>[id,{color:null,pattern:null,worn:null}]));
  const fullCharacterSources={
    sportswear:{
      '#268cdf|Stripes':'sportswear-character-variants/sportswear-blue-stripes-v1',
      '#268cdf|Zigzags':'sportswear-character-variants/sportswear-blue-zigzags-v1',
      '#ed5664|Stripes':'sportswear-character-variants/sportswear-red-stripes-v1',
      '#ed5664|Zigzags':'sportswear-character-variants/sportswear-red-zigzags-v1',
      '#f6c53e|Stripes':'sportswear-character-variants/sportswear-yellow-stripes-v1',
      '#f6c53e|Zigzags':'sportswear-character-variants/sportswear-yellow-zigzags-v1'
    },
    swimsuit:{
      '#25bfc4|Waves':'swimsuit-character-variants/swimsuit-turquoise-waves-v1',
      '#25bfc4|Bubbles':'swimsuit-character-variants/swimsuit-turquoise-bubbles-v1',
      '#ef7d79|Waves':'swimsuit-character-variants/swimsuit-coral-waves-v1',
      '#ef7d79|Bubbles':'swimsuit-character-variants/swimsuit-coral-bubbles-v1',
      '#a46ad6|Waves':'swimsuit-character-variants/swimsuit-purple-waves-v1',
      '#a46ad6|Bubbles':'swimsuit-character-variants/swimsuit-purple-bubbles-v1'
    },
    sneakers:{
      '#448edc|Stars':'sneaker-character-variants/sneakers-blue-stars-v1',
      '#448edc|Lightning':'sneaker-character-variants/sneakers-blue-lightning-v1',
      '#9c69d4|Stars':'sneaker-character-variants/sneakers-purple-stars-v1',
      '#9c69d4|Lightning':'sneaker-character-variants/sneakers-purple-lightning-v1',
      '#4cbb89|Stars':'sneaker-character-variants/sneakers-green-stars-v1',
      '#4cbb89|Lightning':'sneaker-character-variants/sneakers-green-lightning-v1'
    },
    helmet:{
      '#f38a3d|Flames':'helmet-character-variants/helmet-orange-flames-v1',
      '#f38a3d|Checkers':'helmet-character-variants/helmet-orange-checkers-v1',
      '#20aaa9|Flames':'helmet-character-variants/helmet-teal-flames-v1',
      '#20aaa9|Checkers':'helmet-character-variants/helmet-teal-checkers-v1',
      '#e95359|Flames':'helmet-character-variants/helmet-red-flames-v1',
      '#e95359|Checkers':'helmet-character-variants/helmet-red-checkers-v1'
    },
    socks:{
      '#ed83b2|Dots':'sock-character-variants/socks-pink-dots-v1',
      '#ed83b2|Hearts':'sock-character-variants/socks-pink-hearts-v1',
      '#efd15b|Dots':'sock-character-variants/socks-yellow-dots-v1',
      '#efd15b|Hearts':'sock-character-variants/socks-yellow-hearts-v1',
      '#83d7b7|Dots':'sock-character-variants/socks-mint-dots-v1',
      '#83d7b7|Hearts':'sock-character-variants/socks-mint-hearts-v1'
    }
  };
  const fullCharacters=new Map(),images=new Map(),timers=new Set();let game='sportswear',revision=0,launch=null,mode='body',busy=false,avatar,helmet,sock,sneaker,avatarData,helmetData,sockData,sneakerData;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const SIZE=1254;
  function canvas(w=SIZE,h=SIZE){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
  function load(name){if(images.has(name))return images.get(name);const p=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{images.delete(name);reject(new Error('The studio picture could not load. Please try again.'))};img.src=name==='sneakers-product'?'https://pub-aa69c309a877446c857c4f2564279578.r2.dev/language-m8/apps/level-a/assets/media/games/week-4/sneakers.png':base+name+'.png'});images.set(name,p);return p}
  function schedule(fn,ms){const stamp=revision,id=setTimeout(()=>{timers.delete(id);if(stamp===revision&&modal.open)fn()},ms);timers.add(id)}
  function stop(){revision++;timers.forEach(clearTimeout);timers.clear();window.speechSynthesis?.cancel();goodJob.pause();goodJob.currentTime=0;overlay.hidden=true;board.inert=false;busy=false}
  function say(text,after){const stamp=revision;if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){after?.();return}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.91;u.pitch=1.06;let finished=false;const finish=()=>{if(!finished&&stamp===revision&&modal.open){finished=true;after?.()}};u.onend=finish;u.onerror=finish;window.speechSynthesis.speak(u)}
  function btn(text,parent,action,cls=''){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls;b.onclick=action;parent.append(b);return b}
  function polygon(points){const p=new Path2D();points.forEach(([x,y],i)=>i?p.lineTo(x*SIZE/100,y*SIZE/100):p.moveTo(x*SIZE/100,y*SIZE/100));p.closePath();return p}
  // These masks follow the existing avatar's clothing, never drawing new limbs or resizing him.
  const paths={
    shirt:polygon([[35.5,44.3],[38,36.7],[44.9,33.5],[47.5,34.6],[52,34.6],[56,33.5],[60.8,36.5],[65,44.3],[60.5,47.5],[60,51],[60.5,59.9],[40.1,59.9],[40.8,51],[40.4,47.4]]),
    shorts:polygon([[40.2,59.7],[59.8,59.7],[62.1,73.8],[51.3,74.6],[49.8,68.8],[48.8,74.7],[37.8,73.8]]),
    leftShoe:polygon([[34,93.5],[35.2,90.6],[36.5,88],[40.5,87.8],[44.4,91],[44.7,95.5],[42.4,96.1],[34.7,96],[33.8,95.1]]),
    rightShoe:polygon([[55.9,88],[60.9,87.8],[63.1,90.6],[66.7,94],[67.1,95.2],[65.9,96.1],[57,95.6],[55.5,93]]),
    leftShoeFull:polygon([[32.8,87],[45.8,87],[45.8,98.2],[32.8,98.2]]),
    rightShoeFull:polygon([[54.5,87],[68.5,87],[68.5,98.2],[54.5,98.2]]),
    leftLace:polygon([[37.1,88.6],[40.1,88.6],[41.9,93],[36.6,93.4]]),
    rightLace:polygon([[57.8,88.6],[60.2,88.6],[63.4,93.5],[58,93.2]]),
    leftSock:polygon([[38.1,86.2],[42.4,86.4],[42.8,88.5],[37.9,88.7]]),
    rightSock:polygon([[57.5,86.1],[61.6,86.5],[62,88.9],[57.5,88.6]])
  };
  const crops={sportswear:[.33,.32,.34,.45],swimsuit:[.33,.32,.34,.45],sneakers:[.315,.855,.37,.135],socks:[.36,.843,.28,.059],helmet:[0,0,1,1]};
  const masks=new Map();
  function mask(id,data){if(masks.has(id))return masks.get(id);const c=canvas(data.width,data.height),ctx=c.getContext('2d');ctx.fillStyle='#fff';if(id!=='helmet'){const names=id==='sportswear'||id==='swimsuit'?['shirt','shorts']:id==='socks'?['leftSock','rightSock']:id==='sneakersPreview'?['leftShoeFull','rightShoeFull']:['leftShoe','rightShoe'];names.forEach(p=>ctx.fill(paths[p]));if(id==='sneakers'){ctx.globalCompositeOperation='destination-out';ctx.fill(paths.leftLace);ctx.fill(paths.rightLace)}}const pixels=ctx.getImageData(0,0,c.width,c.height).data,result=new Uint8Array(c.width*c.height);for(let i=0;i<result.length;i++){const at=i*4,r=data.data[at],g=data.data[at+1],b=data.data[at+2];result[i]=data.data[at+3]>(id==='helmet'?0:149)&&(id==='helmet'?(r>g*1.15&&r>b*1.12&&r>70):(pixels[at+3]>127&&Math.max(r,g,b)-Math.min(r,g,b)<39))?1:0}masks.set(id,result);return result}
  function star(ctx,x,y,r){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;i?ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):ctx.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();ctx.fill()}
  function pattern(kind,w,h,id){const out=canvas(w,h),c=out.getContext('2d');if(!kind)return out;const gap=id==='socks'?15:id==='sneakerProduct'?210:id==='sneakers'?35:id==='helmet'?115:62;const r=gap*.21;c.fillStyle='#fff9e7';c.strokeStyle='#fff9e7';c.lineWidth=Math.max(3,gap*.12);c.lineCap='round';c.lineJoin='round';
    if(kind==='Stripes'){for(let y=-w;y<h+w;y+=gap){c.beginPath();c.moveTo(0,y);c.lineTo(w,y+w*.25);c.stroke()}}
    else if(kind==='Zigzags'||kind==='Waves'){for(let y=0;y<h;y+=gap){c.beginPath();for(let x=-gap;x<w+gap;x+=kind==='Waves'?6:gap/2){const yy=y+(kind==='Waves'?Math.sin(x/gap*Math.PI)*gap*.2:(Math.round(x/(gap/2))%2?gap*.28:0));x===-gap?c.moveTo(x,yy):c.lineTo(x,yy)}c.stroke()}}
    else if(kind==='Checkers'){for(let y=0;y<h;y+=gap)for(let x=0;x<w;x+=gap)if((Math.round(x/gap)+Math.round(y/gap))%2===0)c.fillRect(x,y,gap,gap)}
    else for(let y=gap*.35;y<h;y+=gap)for(let x=gap*.35+((Math.floor(y/gap)%2)*gap*.5);x<w;x+=gap){
      if(kind==='Stars')star(c,x,y,r);
      else if(kind==='Lightning'){c.beginPath();c.moveTo(x+r*.5,y-r*1.5);c.lineTo(x-r,y+r*.1);c.lineTo(x,y+r*.1);c.lineTo(x-r*.4,y+r*1.6);c.lineTo(x+r,y-r*.3);c.lineTo(x,y-r*.3);c.closePath();c.fill()}
      else if(kind==='Hearts'){c.beginPath();c.moveTo(x,y+r);c.bezierCurveTo(x-r*2,y-r*.2,x-r,y-r*1.6,x,y-r*.4);c.bezierCurveTo(x+r,y-r*1.6,x+r*2,y-r*.2,x,y+r);c.fill()}
      else if(kind==='Flames'){c.beginPath();c.moveTo(x,y+r*1.5);c.bezierCurveTo(x-r*1.6,y+r,x-r,y-r,x,y-r*1.5);c.bezierCurveTo(x-r*.1,y-r*.2,x+r,y-r*.5,x+r*.5,y-r);c.bezierCurveTo(x+r*1.6,y+r,x+r,y+r*1.5,x,y+r*1.5);c.fill()}
      else{c.beginPath();c.arc(x,y,r,0,Math.PI*2);kind==='Bubbles'?c.stroke():c.fill()}
    }return out;
  }
  function texture(id,design){const data=id==='helmet'?helmetData:avatarData,w=data.width,h=data.height,out=canvas(w,h),ctx=out.getContext('2d'),pixels=ctx.createImageData(w,h);if(!design.color)return out;if(id==='helmet')pixels.data.set(data.data);const rgb=design.color.slice(1).match(/../g).map(v=>parseInt(v,16)),motif=pattern(design.pattern,w,h,id).getContext('2d').getImageData(0,0,w,h).data,area=mask(id,data);
    for(let n=0;n<area.length;n++){const i=n*4;if(!area[n])continue;const lum=(data.data[i]*.2126+data.data[i+1]*.7152+data.data[i+2]*.0722)/255;const shade=id==='helmet'?.5+lum*.9:.25+lum*.85,a=motif[i+3]/255*.83;for(let k=0;k<3;k++)pixels.data[i+k]=Math.min(255,(rgb[k]*(1-a)+motif[i+k]*a)*shade);if(id==='swimsuit'){const px=(n%w)/w*100,py=Math.floor(n/w)/h*100;const panel=(py>38&&py<74)&&((px>39&&px<43)||(px>57&&px<61)),collar=py>33.4&&py<36.5&&px>44&&px<56,zip=px>49.9&&px<50.55&&py>36&&py<47;if(panel||collar||zip){for(let k=0;k<3;k++)pixels.data[i+k]*=.46;if(zip&&Math.floor(py*2.3)%2===0&&px>50.05&&px<50.4){pixels.data[i]=215;pixels.data[i+1]=236;pixels.data[i+2]=238}}}pixels.data[i+3]=data.data[i+3]}
    ctx.putImageData(pixels,0,0);return out;
  }
  function drawSockProduct(design){const data=sockData,out=canvas(data.width,data.height),ctx=out.getContext('2d');ctx.drawImage(sock,0,0);if(design.color){const p=ctx.getImageData(0,0,out.width,out.height),rgb=design.color.slice(1).match(/../g).map(v=>parseInt(v,16)),motif=pattern(design.pattern,out.width,out.height,'sockPreview').getContext('2d').getImageData(0,0,out.width,out.height).data;for(let i=0;i<p.data.length;i+=4){if(!p.data[i+3])continue;const lum=(data.data[i]*.2126+data.data[i+1]*.7152+data.data[i+2]*.0722)/255,shade=.35+lum*.8,a=motif[i+3]/255*.83;for(let k=0;k<3;k++)p.data[i+k]=Math.min(255,(rgb[k]*(1-a)+motif[i+k]*a)*shade)}ctx.putImageData(p,0,0)}out.className='ds-product ds-sock-product';out.setAttribute('role','img');out.setAttribute('aria-label',`${design.color?colorName('socks',design.color)+' ':''}sock${design.pattern?' with '+design.pattern.toLowerCase():''}`);return out}
  function drawSneakerProduct(design){
    const data=sneakerData,out=canvas(data.width,data.height),ctx=out.getContext('2d');ctx.drawImage(sneaker,0,0);
    if(design.color){const pixels=ctx.getImageData(0,0,out.width,out.height),rgb=design.color.slice(1).match(/../g).map(v=>parseInt(v,16)),motif=pattern(design.pattern,out.width,out.height,'sneakerProduct').getContext('2d').getImageData(0,0,out.width,out.height).data;
      for(let i=0;i<pixels.data.length;i+=4){const r=data.data[i],g=data.data[i+1],b=data.data[i+2];if(!data.data[i+3]||b-r<25||b-g<8||(b-r)/Math.max(1,b)<.18)continue;const lum=(r*.2126+g*.7152+b*.0722)/255,shade=.45+lum*1.1,a=motif[i+3]/255*.9;for(let k=0;k<3;k++)pixels.data[i+k]=Math.min(255,(rgb[k]*(1-a)+motif[i+k]*a)*shade)}ctx.putImageData(pixels,0,0)
    }
    out.className='ds-product ds-sneaker-product';out.setAttribute('role','img');out.setAttribute('aria-label',`${design.color?colorName('sneakers',design.color)+' ':''}sneakers${design.pattern?' with '+design.pattern.toLowerCase():''}, with white laces and soles`);return out;
  }
  function wearSneakers(ctx,design){
    const customized=drawSneakerProduct(design),single=canvas(1020,930),s=single.getContext('2d');
    // Isolate the foreground shoe at native resolution; the rear shoe is not a second leg.
    const outline=new Path2D();[[95,195],[225,170],[254,247],[339,266],[393,324],[507,294],[572,340],[586,377],[635,362],[704,381],[732,430],[699,479],[728,537],[824,631],[942,747],[1016,880],[1042,972],[1006,1041],[840,1090],[581,1093],[406,1004],[290,872],[164,846],[58,779],[32,685],[57,538],[96,411],[109,285]].forEach(([x,y],i)=>i?outline.lineTo(x-30,y-170):outline.moveTo(x-30,y-170));outline.closePath();s.clip(outline);s.drawImage(customized,-30,-170);
    const top=SIZE*.864,height=SIZE*.12,width=SIZE*.142;
    ctx.save();ctx.translate(SIZE*.462,top);ctx.scale(-1,1);ctx.drawImage(single,0,0,width,height);ctx.restore();
    ctx.drawImage(single,SIZE*.545,top,width,height);
  }
  const generatedPreviewCrops={sportswear:[.29,.30,.42,.48],swimsuit:[.29,.30,.42,.48],helmet:[.25,0,.5,.39],socks:[.31,.79,.38,.19]};
  function drawGeneratedProduct(id,design){const previewPattern=design?.pattern||definitions[id]?.patterns?.[0],source=design?.color&&previewPattern?fullCharacters.get(`${id}|${design.color}|${previewPattern}`):null,crop=generatedPreviewCrops[id];if(!source||!crop)return null;const out=canvas(Math.round(source.width*crop[2]),Math.round(source.height*crop[3])),ctx=out.getContext('2d');ctx.drawImage(source,source.width*crop[0],source.height*crop[1],source.width*crop[2],source.height*crop[3],0,0,out.width,out.height);out.className='ds-product ds-generated-product';out.setAttribute('role','img');out.setAttribute('aria-label',`${colorName(id,design.color)} ${definitions[id].label} preview with ${previewPattern.toLowerCase()}${design.pattern?', exactly as it will look on the character':'; choose a pattern to finish'}`);return out}
  function drawProduct(id,design){const generated=drawGeneratedProduct(id,design);if(generated)return generated;if(id==='socks')return drawSockProduct(design);if(id==='sneakers'&&sneakerData)return drawSneakerProduct(design);const crop=crops[id],source=id==='helmet'?helmet:avatar,material=texture(id,design),layer=canvas(source.width,source.height),ctx=layer.getContext('2d');
    if(id==='helmet'){ctx.drawImage(design.color?material:source,0,0)}else{
      // Isolate the actual garment pixels, retaining original neutral material before color selection.
      const data=avatarData,out=ctx.createImageData(SIZE,SIZE),area=mask(id==='sneakers'?'sneakersPreview':id,data);for(let n=0;n<area.length;n++){const i=n*4;if(area[n])out.data.set(data.data.subarray(i,i+4),i)}ctx.putImageData(out,0,0);ctx.drawImage(material,0,0);
    }
    const preview=canvas(Math.round(source.width*crop[2]),Math.round(source.height*crop[3]));preview.getContext('2d').drawImage(layer,source.width*crop[0],source.height*crop[1],source.width*crop[2],source.height*crop[3],0,0,preview.width,preview.height);preview.className='ds-product';preview.setAttribute('role','img');preview.setAttribute('aria-label',`${design.color?colorName(id,design.color)+' ':''}${definitions[id].label}${design.pattern?' with '+design.pattern.toLowerCase():''}`);return preview;
  }
  function colorName(id,value){return definitions[id].colors.find(c=>c[1]===value)?.[0]||''}
  function drawBoy(design){const c=canvas(),ctx=c.getContext('2d'),fullCharacter=design?.color&&design.pattern?fullCharacters.get(`${game}|${design.color}|${design.pattern}`):null;ctx.drawImage(fullCharacter||avatar,0,0,SIZE,SIZE);if(design?.color&&!fullCharacter){const layer=texture(game,design);if(game==='helmet'){ctx.drawImage(layer,SIZE*.318,-SIZE*.02,SIZE*.36,SIZE*.24)}else if(game==='sneakers'&&sneakerData){wearSneakers(ctx,design)}else ctx.drawImage(layer,0,0)}c.className='ds-boy';c.setAttribute('role','img');c.setAttribute('aria-label',`Same standing boy${design?.color?' wearing '+colorName(game,design.color)+' '+definitions[game].label+' with '+design.pattern.toLowerCase():''}`);return c}
  function body(celebrating=false){mode='body';board.replaceChildren();prompt.textContent=celebrating?'Your design looks great!':`Tap the glowing ${definitions[game].zone} to design your ${definitions[game].label}.`;const stage=document.createElement('div');stage.className='ds-stage'+(celebrating?' ds-happy':'');board.append(stage);const model=document.createElement('div');model.className='ds-model';model.append(drawBoy(designs[game].worn));stage.append(model);if(!celebrating){const target=btn('✦ Design my '+definitions[game].label,model,editor,'ds-target ds-target-'+definitions[game].zone);target.setAttribute('aria-label','Design '+definitions[game].label+' — '+definitions[game].zone);target.focus();const space=document.createElement('div');space.className='ds-editor-actions';space.setAttribute('aria-hidden','true');board.append(space)}else{const badge=document.createElement('div');badge.className='ds-wow';badge.textContent='★ Made by you! ★';stage.append(badge);const actions=document.createElement('div');actions.className='ds-editor-actions';board.append(actions);btn('← Design again',actions,editor);btn('Finish! ★',actions,finish,'ds-wear')}}
  function editor(){if(busy)return;mode='editor';board.replaceChildren();prompt.textContent='Choose a color, then a pattern. Make it yours!';feedback.textContent='';const d=designs[game],def=definitions[game];const editor=document.createElement('div');editor.className='ds-editor';board.append(editor);const display=document.createElement('div');display.className='ds-display';display.dataset.item=game;editor.append(display);const controls=document.createElement('div');controls.className='ds-options';editor.append(controls);const colorTitle=document.createElement('h3');colorTitle.textContent='1. Color';controls.append(colorTitle);const colors=document.createElement('div');colors.className='ds-choice-row';controls.append(colors);const patternTitle=document.createElement('h3');patternTitle.textContent='2. Pattern';controls.append(patternTitle);const patterns=document.createElement('div');patterns.className='ds-choice-row';controls.append(patterns);const actions=document.createElement('div');actions.className='ds-editor-actions';board.append(actions);btn('← Back',actions,()=>body());const wear=btn('Wear It! ✨',actions,wearIt,'ds-wear');
    function refresh(){display.replaceChildren(drawProduct(game,d));colors.querySelectorAll('button').forEach(b=>{const active=b.dataset.color===d.color;b.setAttribute('aria-pressed',String(active));b.classList.toggle('ds-selected',active)});patterns.querySelectorAll('button').forEach(b=>{b.disabled=!d.color;const active=b.dataset.pattern===d.pattern;b.setAttribute('aria-pressed',String(active));b.classList.toggle('ds-selected',active)});wear.disabled=!(d.color&&d.pattern);feedback.textContent=d.color?(d.pattern?`${colorName(game,d.color)} + ${d.pattern.toLowerCase()}`:'Now choose a pattern.'):''}
    def.colors.forEach(([label,color])=>{const b=btn(label,colors,()=>{if(busy)return;d.color=color;refresh();say(label)},'ds-color');b.dataset.color=color;b.style.setProperty('--swatch',color);b.setAttribute('aria-label',label+' color')});def.patterns.forEach(kind=>{const b=btn(kind,patterns,()=>{if(busy)return;d.pattern=kind;refresh();say(kind)},'ds-pattern');b.dataset.pattern=kind;b.setAttribute('aria-label',kind+' pattern')});refresh();say('Choose a color. Then choose a pattern.');colors.querySelector('button').focus();
  }
  function wearIt(){const d=designs[game];if(busy||!d.color||!d.pattern)return;d.worn={color:d.color,pattern:d.pattern};body(true);feedback.textContent='You designed it!';say(`Wow! My ${definitions[game].label}! I love it!`)}
  function finish(){if(busy)return;busy=true;say('Great job! You made it!',()=>schedule(()=>{overlay.hidden=false;board.inert=true;goodJob.hidden=reduced.matches;overlay.querySelector('p').hidden=!reduced.matches;if(!reduced.matches)goodJob.play().catch(()=>{goodJob.hidden=true;overlay.querySelector('p').hidden=false});overlay.querySelector('button').focus()},500))}
  async function open(id){stop();game=id;launch=document.querySelector(`[data-clip="${game}"]`);if(!modal.open)modal.showModal();modal.querySelector('h2').textContent='Design It · Wear It';feedback.textContent='';prompt.textContent='Getting your studio ready…';board.replaceChildren();const stamp=revision;try{[avatar,helmet,sock,sneaker]=await Promise.all([load('neutral-boy'),load('helmet-front'),load('sock-blue'),load('sneakers-product')]);const entries=Object.entries(fullCharacterSources[id]||{}),missing=entries.filter(([key])=>!fullCharacters.has(`${id}|${key}`));if(missing.length){const loaded=await Promise.all(missing.map(([,name])=>load(name)));missing.forEach(([key],index)=>fullCharacters.set(`${id}|${key}`,loaded[index]))}if(stamp!==revision||!modal.open)return;if(!avatarData){const c=canvas();c.getContext('2d').drawImage(avatar,0,0,SIZE,SIZE);avatarData=c.getContext('2d').getImageData(0,0,SIZE,SIZE)}if(!helmetData){const c=canvas(helmet.width,helmet.height);c.getContext('2d').drawImage(helmet,0,0);helmetData=c.getContext('2d').getImageData(0,0,c.width,c.height)}if(!sockData){const c=canvas(sock.width,sock.height);c.getContext('2d').drawImage(sock,0,0);sockData=c.getContext('2d').getImageData(0,0,c.width,c.height)}if(!sneakerData){const c=canvas(sneaker.width,sneaker.height);c.getContext('2d').drawImage(sneaker,0,0);sneakerData=c.getContext('2d').getImageData(0,0,c.width,c.height)}body();say('Let’s design your '+definitions[game].label+'!')}catch(e){if(stamp!==revision)return;prompt.textContent=e.message;feedback.textContent='Use the local preview, then choose Reset to try again.'}}
  function close(){stop();modal.close();launch?.focus()}
  document.addEventListener('week4-open-activity',e=>{if(definitions[e.detail])open(e.detail)});
  modal.querySelectorAll('[data-game-watch]').forEach(b=>b.onclick=()=>{const id=game;close();document.dispatchEvent(new CustomEvent('week4-watch-video',{detail:id}))});
  ['close','done'].forEach(id=>modal.querySelector(`[data-game-${id}]`).onclick=close);
  const reset=modal.querySelector('[data-game-reset]');reset.textContent='↻ Reset design';reset.onclick=()=>{designs[game]={color:null,pattern:null,worn:null};open(game)};
  const again=modal.querySelector('[data-game-again]');again.textContent='Design again';again.onclick=()=>{stop();editor()};
  modal.addEventListener('cancel',e=>{e.preventDefault();close()});modal.addEventListener('close',stop);window.addEventListener('pagehide',stop);
  modal.addEventListener('keydown',e=>{if(e.key!=='Tab'||overlay.hidden)return;const b=overlay.querySelectorAll('button'),first=b[0],last=b[b.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
})();
