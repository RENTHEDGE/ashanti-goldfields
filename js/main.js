(function(){
  /* TICKER */
  var td=[
    {n:'XAU/USD',v:'$3,322.40',c:'+0.84%',u:true},
    {n:'WTI CRUDE',v:'$61.18',c:'-0.22%',u:false},
    {n:'DXY INDEX',v:'100.23',c:'-0.11%',u:false},
    {n:'S&P 500',v:'5,659.91',c:'+0.51%',u:true},
    {n:'US 10Y',v:'4.38%',c:'+2bp',u:false},
    {n:'EUR/USD',v:'1.1243',c:'+0.18%',u:true},
    {n:'Ashanti (1999)',v:'$256\u2192$338',c:'+32%',u:true},
    {n:'COMEX GC',v:'$3,318.50',c:'+0.79%',u:true},
    {n:'VIX',v:'23.40',c:'-1.2%',u:false},
    {n:'BTC/USD',v:'$103,421',c:'+1.3%',u:true},
  ];
  var track=document.getElementById('ticker-track');
  var html=td.concat(td).map(function(d){
    return '<div class="ticker-item"><span class="t-name">'+d.n+'</span><span>'+d.v+'</span><span class="'+(d.u?'t-up':'t-dn')+'">'+d.c+'</span></div>';
  }).join('');
  track.innerHTML=html;

  /* FASES TOPBAR */
  var PHASES=[
    {label:'Empresa',  slides:[0,1]},
    {label:'Contexto', slides:[2,3]},
    {label:'Simulador',slides:[4,5]},
    {label:'Crisis',   slides:[6,7,8,9]},
    {label:'Reflexi\u00f3n',slides:[10,11,12]}
  ];
  var phaseEl=document.getElementById('tb-phases');
  var phaseItems=[];
  PHASES.forEach(function(ph,pi){
    if(pi>0){var sep=document.createElement('span');sep.className='tb-phase-sep';sep.textContent='\u203a';phaseEl.appendChild(sep);}
    var btn=document.createElement('button');
    btn.className='tb-phase';
    btn.innerHTML='<div class="tb-phase-dot"></div><span>'+ph.label+'</span>';
    btn.title=ph.label;
    btn.addEventListener('click',function(){go(ph.slides[0]);});
    phaseEl.appendChild(btn);phaseItems.push(btn);
  });
  function updatePhase(idx){
    PHASES.forEach(function(ph,pi){phaseItems[pi].classList.toggle('active',ph.slides.indexOf(idx)>-1);});
  }

  /* FULLSCREEN */
  var fsBtn=document.getElementById('fs-btn');
  var FS_ENTER='<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 5V2h3M10 2h3v3M13 10v3h-3M5 13H2v-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var FS_EXIT='<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5 2v3H2M13 5h-3V2M10 13v-3h3M2 10h3v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function isFull(){return !!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement);}
  function syncFsBtn(){if(!fsBtn)return;fsBtn.innerHTML=isFull()?FS_EXIT:FS_ENTER;fsBtn.title=isFull()?'Salir de pantalla completa (F)':'Pantalla completa (F)';fsBtn.classList.toggle('fs-active',isFull());}
  function toggleFS(){
    if(!isFull()){var el=document.documentElement;if(el.requestFullscreen)el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();else if(el.mozRequestFullScreen)el.mozRequestFullScreen();}
    else{if(document.exitFullscreen)document.exitFullscreen();else if(document.webkitExitFullscreen)document.webkitExitFullscreen();else if(document.mozCancelFullScreen)document.mozCancelFullScreen();}
  }
  if(fsBtn)fsBtn.addEventListener('click',toggleFS);
  document.addEventListener('fullscreenchange',syncFsBtn);
  document.addEventListener('webkitfullscreenchange',syncFsBtn);
  document.addEventListener('mozfullscreenchange',syncFsBtn);
  syncFsBtn();

  /* LIQUID GOLD CANVAS */
  var lc=document.getElementById('liquid-canvas');
  if(lc){
    var lx=lc.getContext('2d'),lW,lH;
    function lResize(){lW=lc.width=lc.offsetWidth;lH=lc.height=lc.offsetHeight;}
    lResize();window.addEventListener('resize',lResize,{passive:true});
    var blobs=[];
    for(var k=0;k<7;k++)blobs.push({x:Math.random()*1920,y:Math.random()*1080,r:Math.random()*180+80,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.28,phase:Math.random()*Math.PI*2});
    var lPts=[];
    for(var j=0;j<60;j++)lPts.push({x:Math.random()*1920,y:Math.random()*1080,r:Math.random()*1.6+.3,vx:(Math.random()-.5)*.22,vy:(Math.random()-.5)*.15,a:Math.random()*Math.PI*2});
    var lT=0;
    function drawLiquid(){
      if(!document.querySelector('.slide[data-i="0"].active')){requestAnimationFrame(drawLiquid);return;}
      lx.clearRect(0,0,lW,lH);lT+=0.008;
      blobs.forEach(function(b,i){
        b.x+=b.vx;b.y+=b.vy;
        if(b.x<-b.r)b.x=lW+b.r;if(b.x>lW+b.r)b.x=-b.r;
        if(b.y<-b.r)b.y=lH+b.r;if(b.y>lH+b.r)b.y=-b.r;
        var pulse=Math.sin(lT+b.phase)*0.15+0.85;
        var grad=lx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*pulse);
        var alpha=i<3?0.07:0.04;
        grad.addColorStop(0,'rgba(200,155,30,'+alpha+')');
        grad.addColorStop(0.5,'rgba(168,112,0,'+(alpha*.5)+')');
        grad.addColorStop(1,'rgba(100,60,0,0)');
        lx.beginPath();lx.arc(b.x,b.y,b.r*pulse,0,Math.PI*2);lx.fillStyle=grad;lx.fill();
      });
      for(var row=0;row<3;row++){
        var wY=lH*(0.25+row*0.25)+Math.sin(lT*0.7+row)*20;
        var wGrad=lx.createLinearGradient(0,wY-1,lW,wY+1);
        wGrad.addColorStop(0,'rgba(232,176,48,0)');
        wGrad.addColorStop(0.3+Math.sin(lT+row)*.2,'rgba(232,176,48,0.04)');
        wGrad.addColorStop(1,'rgba(232,176,48,0)');
        lx.beginPath();lx.moveTo(0,wY);
        for(var wx=0;wx<=lW;wx+=8)lx.lineTo(wx,wY+Math.sin((wx/lW)*Math.PI*4+lT*1.2+row)*(6+row*3));
        lx.strokeStyle=wGrad;lx.lineWidth=1.5;lx.stroke();
      }
      lPts.forEach(function(p){
        p.x+=p.vx;p.y+=p.vy;p.a+=.01;
        if(p.x<0)p.x=lW;if(p.x>lW)p.x=0;
        if(p.y<0)p.y=lH;if(p.y>lH)p.y=0;
        var alpha=.1+.08*Math.sin(p.a);
        lx.beginPath();lx.arc(p.x,p.y,p.r,0,Math.PI*2);lx.fillStyle='rgba(200,160,40,'+alpha+')';lx.fill();
      });
      requestAnimationFrame(drawLiquid);
    }
    drawLiquid();
  }

  /* DECK */
  var slides=Array.from(document.querySelectorAll('.slide'));
  var N=slides.length;
  var pillsEl=document.getElementById('tb-pills');
  var prevBtn=document.getElementById('nav-prev');
  var nextBtn=document.getElementById('nav-next');
  var cnt=document.getElementById('tb-cnt');
  var pb=document.getElementById('progress-bar');
  var cur=0,busy=false,charts={};

  slides.forEach(function(_,i){
    var p=document.createElement('button');
    p.className='tb-pill'+(i===0?' active':'');
    p.title='Slide '+(i+1);
    p.addEventListener('click',function(){go(i);});
    pillsEl.appendChild(p);
  });
  var pills=pillsEl.querySelectorAll('.tb-pill');

  document.querySelectorAll('.idx-item').forEach(function(btn){
    btn.addEventListener('click',function(){go(parseInt(btn.dataset.goto,10));});
  });

  function pad(n){return n<10?'0'+n:''+n;}
  function updateUI(i){
    cnt.textContent=pad(i+1)+' / '+pad(N);
    pills.forEach(function(p,j){p.classList.toggle('active',j===i);});
    prevBtn.classList.toggle('off',i===0);
    nextBtn.classList.toggle('off',i===N-1);
    pb.style.width=Math.round((i/(N-1))*100)+'%';
    updatePhase(i);
  }

  function animateIn(slide){
    var els=slide.querySelectorAll('.reveal');
    els.forEach(function(el){el.classList.remove('in');void el.offsetWidth;});
    requestAnimationFrame(function(){els.forEach(function(el){el.classList.add('in');});});
    /* contador animado sincronizado con el reveal */
    slide.querySelectorAll('.stat-n').forEach(function(el){
      var orig=el.textContent.trim();
      var m=orig.match(/^([+$#]?)([\d]+)([%MKx]*)$/);
      if(!m||+m[2]<2)return;
      var pre=m[1],num=+m[2],suf=m[3];
      el.textContent=pre+'0'+suf;
      setTimeout(function(){
        var t0=null,dur=900;
        requestAnimationFrame(function step(ts){
          if(!t0)t0=ts;
          var p=Math.min((ts-t0)/dur,1);
          el.textContent=pre+Math.round((1-Math.pow(1-p,3))*num)+suf;
          if(p<1)requestAnimationFrame(step);else el.textContent=orig;
        });
      },420);
    });
  }

  function go(idx){
    if(busy||idx===cur||idx<0||idx>=N)return;
    busy=true;
    var from=slides[cur],to=slides[idx],fwd=idx>cur;

    /* === DESTELLO DORADO — flash + slow decay === */
    var veil=document.getElementById('trans-veil');
    if(veil){
      veil.style.transition='none';
      veil.style.opacity='0';
      veil.style.background='radial-gradient(ellipse 70% 55% at 50% 48%,rgba(255,205,50,.92) 0%,rgba(200,130,0,.72) 30%,rgba(90,50,0,.38) 62%,rgba(0,0,0,0) 100%)';
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){
          veil.style.transition='opacity .06s ease';
          veil.style.opacity='1';
          setTimeout(function(){
            veil.style.transition='opacity .8s cubic-bezier(.16,1,.3,1)';
            veil.style.opacity='0';
          },48);
        });
      });
    }

    /* === SLIDE ENTRANTE — sweep desde lateral + overexposed === */
    var xIn=fwd?'translateX(-55px) scale(.91)':'translateX(55px) scale(.91)';
    to.style.transition='none';
    to.style.opacity='0';
    to.style.transform=xIn;
    to.style.filter='blur(8px) brightness(1.6)';
    to.classList.add('active');
    to.getBoundingClientRect();

    var spring='cubic-bezier(.16,1,.3,1)';
    var snap='cubic-bezier(.55,.05,.67,.19)';
    var TI='opacity .62s '+spring+',transform .62s '+spring+',filter .5s '+spring;
    var TO='opacity .3s '+snap+',transform .3s '+snap+',filter .22s ease';

    to.style.transition=TI;
    to.style.opacity='1';
    to.style.transform='translateX(0) scale(1)';
    to.style.filter='blur(0) brightness(1)';

    /* === SLIDE SALIENTE — colapsa y se oscurece === */
    var xOut=fwd?'translateX(50px) scale(.88)':'translateX(-50px) scale(.88)';
    from.style.transition=TO;
    from.style.opacity='0';
    from.style.transform=xOut;
    from.style.filter='blur(20px) brightness(.4)';

    cur=idx;updateUI(idx);animateIn(to);
    setTimeout(function(){
      from.classList.remove('active');
      [from,to].forEach(function(el){
        el.style.transition='';el.style.transform='';el.style.opacity='';el.style.filter='';
      });
      busy=false;
      if(idx===2&&!charts[2])buildChart1();
      if(idx===6&&!charts[6])buildChart2();
      if(idx===5&&!charts[5])buildChart9();
    },680);
  }

  prevBtn.addEventListener('click',function(){go(cur-1);});
  nextBtn.addEventListener('click',function(){go(cur+1);});
  document.addEventListener('keydown',function(e){
    if(e.key==='f'||e.key==='F'){toggleFS();return;}
    if(['ArrowRight','ArrowDown','PageDown',' '].indexOf(e.key)>-1){e.preventDefault();go(cur+1);}
    if(['ArrowLeft','ArrowUp','PageUp'].indexOf(e.key)>-1){e.preventDefault();go(cur-1);}
  });
  var tx=0;
  document.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  document.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>44){dx<0?go(cur+1):go(cur-1);}},{passive:true});
  updateUI(0);setTimeout(function(){animateIn(slides[0]);},80);

  /* ---- CHARTS ---- */
  var monoFont='JetBrains Mono, monospace';

  function buildChart1(){
    charts[2]=true;
    var x=[1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005];
    var y=[161,125,148,193,307,614,460,376,424,361,317,368,447,437,381,383,362,344,360,384,384,388,331,294,278,279,271,310,363,410,444];
    var ex=[1980,1999,2001],ey=[614,278,271],ec=['#c99d3a','#c06060','#5b9fd4'];
    var labels=['Pico hist\u00f3rico\n$850/oz','Acuerdo Washington\nCrisis Ashanti','M\u00ednimo post-crisis'];
    Plotly.newPlot('ch1',[
      {x:x,y:y,type:'scatter',mode:'lines',line:{color:'#1565a0',width:3,shape:'spline'},fill:'tozeroy',fillcolor:'rgba(21,101,160,.12)',hovertemplate:'<b>%{x}</b><br>Precio: <b>$%{y}/oz</b><extra></extra>',hoveron:'points+fills'},
      {x:ex,y:ey,type:'scatter',mode:'markers+text',marker:{color:ec,size:13,symbol:'circle',line:{width:2.5,color:'#fff'},opacity:1},text:labels,textposition:['top center','bottom center','top center'],textfont:{size:9,color:ec,family:monoFont},customdata:labels,hovertemplate:'<b>%{x}</b><br>$%{y}/oz<br><i>%{customdata}</i><extra></extra>',showlegend:false}
    ],{
      paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
      margin:{t:6,b:36,l:52,r:10},
      hovermode:'x',
      hoverlabel:{bgcolor:'rgba(10,9,7,0.93)',font:{color:'#f0ece0',size:12,family:monoFont},bordercolor:'rgba(168,112,0,.6)'},
      xaxis:{showgrid:false,zeroline:false,tickfont:{size:11,color:'#a09e96',family:monoFont},tickformat:'d',showspikes:true,spikemode:'across',spikesnap:'cursor',spikedash:'dot',spikecolor:'rgba(168,112,0,.7)',spikethickness:1.5},
      yaxis:{showgrid:true,gridcolor:'rgba(20,18,10,.12)',zeroline:false,tickprefix:'$',ticksuffix:'/oz',tickfont:{size:11,color:'#a09e96',family:monoFont},showspikes:true,spikemode:'across',spikesnap:'cursor',spikedash:'dot',spikecolor:'rgba(168,112,0,.4)',spikethickness:1},
      showlegend:false,font:{family:monoFont},
      shapes:[{type:'rect',x0:1999,x1:2001,y0:0,y1:1,xref:'x',yref:'paper',fillcolor:'rgba(139,32,32,.07)',line:{width:0}}],
      annotations:[
        {x:1980,y:614,xref:'x',yref:'y',text:'<b>$850</b>',showarrow:true,ax:0,ay:-30,font:{size:10,color:'#c99d3a',family:monoFont},arrowcolor:'rgba(201,157,58,.4)',arrowwidth:1},
        {x:1999,y:278,xref:'x',yref:'y',text:'<b>$256</b>',showarrow:true,ax:0,ay:28,font:{size:10,color:'#c06060',family:monoFont},arrowcolor:'rgba(192,96,96,.4)',arrowwidth:1}
      ]
    },{responsive:true,displayModeBar:false});
  }

  function buildChart2(){
    charts[6]=true;
    var x2=['1999-01','1999-02','1999-03','1999-04','1999-05','1999-06','1999-07','1999-08','1999-09-01','1999-09-15','1999-09-24','1999-09-27','1999-09-30','1999-10-05','1999-10-15','1999-11','1999-12','2000-01','2000-03','2000-06'];
    var y2=[288,286,282,280,277,270,256,258,258,257,258,310,331,338,330,295,285,284,280,278];
    Plotly.newPlot('ch2',[{x:x2,y:y2,type:'scatter',mode:'lines+markers',line:{color:'#1565a0',width:2.5,shape:'spline'},marker:{color:x2.map(function(v){return v==='1999-09-27'?'#8b2020':'#1565a0';}),size:x2.map(function(v){return v==='1999-09-27'?11:5;})},fill:'tozeroy',fillcolor:'rgba(21,101,160,.06)',hovertemplate:'<b>%{x}</b> \u2014 $%{y}/oz<extra></extra>'}],{
      paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',margin:{t:6,b:36,l:54,r:10},
      xaxis:{showgrid:false,zeroline:false,tickfont:{size:10,color:'#a09e96',family:monoFont},showspikes:true,spikemode:'across',spikesnap:'hovered data',spikedash:'dot',spikecolor:'rgba(21,101,160,.55)',spikethickness:1.5},
      yaxis:{showgrid:true,gridcolor:'rgba(20,18,10,.07)',zeroline:false,tickprefix:'$',ticksuffix:'/oz',tickfont:{size:10,color:'#a09e96',family:monoFont},range:[230,360],showspikes:true,spikemode:'across',spikesnap:'hovered data',spikedash:'dot',spikecolor:'rgba(21,101,160,.3)',spikethickness:1},
      shapes:[{type:'rect',x0:'1999-09-24',x1:'1999-10-05',y0:0,y1:1,xref:'x',yref:'paper',fillcolor:'rgba(139,32,32,.1)',line:{color:'rgba(139,32,32,.3)',width:1}}],
      annotations:[{x:'1999-09-27',y:318,xref:'x',yref:'y',text:'<b>Acuerdo de Washington</b><br>26 sep 1999 \u00b7 +32% en 2 sem.',showarrow:true,arrowhead:2,ax:78,ay:-44,font:{size:11,color:'#8b2020',family:monoFont},bgcolor:'rgba(245,222,222,.96)',bordercolor:'rgba(139,32,32,.3)',borderwidth:1,borderpad:5}],
      hovermode:'x unified',hoverlabel:{bgcolor:'#19180f',font:{color:'#f0ece0',size:12,family:monoFont},bordercolor:'transparent'},
      showlegend:false,font:{family:monoFont}
    },{responsive:true,displayModeBar:false});
  }

  /* ======== SLIDE 09 — PAYOFF INTERACTIVO ======== */
  var PF_DATA={
    all:{
      title:'Payoff combinado \u2014 Ashanti 1999',
      sub:'USD millones \u00b7 vs precio spot del oro ($/oz)',
      color:'#1a1a2e',
      label:'Vista General',
      infoHtml:function(){
        return '<div class="pfi-label"><div class="pfi-label-dot" style="background:#1a1a2e;"></div><span style="color:#1a1a2e;">P&L Neto Total</span></div>'
          +'<div class="pfi-title">Los cuatro instrumentos juntos</div>'
          +'<div class="pfi-row"><span class="pfi-key">Forward vendido</span><span class="pfi-val" style="color:#1565a0;">10M oz @ $300</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Put comprada</span><span class="pfi-val" style="color:#2a7a4a;">2M oz @ $280, prima $8</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Call vendida</span><span class="pfi-val" style="color:#c06060;">5M oz @ $300, prima $12</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Precio crisis WAG</span><span class="pfi-val" style="color:#8b2020;">$338/oz</span></div>'
          +'<div class="pfi-note danger"><strong>La trampa:</strong> las calls vendidas amplifican las pérdidas cuando el precio sube. El P&L neto es fuertemente negativo tanto con subidas extremas <em>como</em> con caídas extremas.</div>';
      }
    },
    fwd:{
      title:'Forward vendido \u2014 10 millones de onzas',
      sub:'Ashanti vende oro a futuro a $300/oz',
      color:'#1565a0',
      label:'Forward vendido',
      infoHtml:function(){
        return '<div class="pfi-label"><div class="pfi-label-dot" style="background:#1565a0;"></div><span style="color:#1565a0;">Forward Vendido</span></div>'
          +'<div class="pfi-title">Venta adelantada a precio fijo</div>'
          +'<div class="pfi-row"><span class="pfi-key">Volumen</span><span class="pfi-val">10,000,000 oz</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Precio pactado</span><span class="pfi-val">$300/oz</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Ganancia máxima</span><span class="pfi-val" style="color:#2a7a4a;">Ilimitada (si el spot cae)</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Pérdida si spot=$338</span><span class="pfi-val" style="color:#8b2020;">\u2212$380M</span></div>'
          +'<div class="pfi-note"><strong>Lineal y sin límite de pérdida:</strong> por cada dólar que sube el oro sobre $300, Ashanti pierde $10M (10M oz &times; $1).</div>';
      }
    },
    pc:{
      title:'Put comprada \u2014 strike $280, prima $8',
      sub:'Derecho a vender 2M oz a $280 si el mercado cae',
      color:'#2a7a4a',
      label:'Put comprada',
      infoHtml:function(){
        return '<div class="pfi-label"><div class="pfi-label-dot" style="background:#2a7a4a;"></div><span style="color:#2a7a4a;">Put Comprada</span></div>'
          +'<div class="pfi-title">Protección contra caída del oro</div>'
          +'<div class="pfi-row"><span class="pfi-key">Volumen</span><span class="pfi-val">2,000,000 oz</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Strike</span><span class="pfi-val">$280/oz</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Prima pagada</span><span class="pfi-val" style="color:#8b2020;">$8/oz = $16M</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Breakeven</span><span class="pfi-val">$272/oz</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Activación</span><span class="pfi-val">Solo si spot &lt; $280</span></div>'
          +'<div class="pfi-note"><strong>Cobertura muy parcial:</strong> solo 2M de las 10M oz cubiertas en forward tienen protección por caída. Además, no protege contra subida.</div>';
      }
    },
    cv:{
      title:'Call vendida \u2014 strike $300, prima $12',
      sub:'Ashanti cobra prima cediendo el derecho de compra al alza',
      color:'#c06060',
      label:'Call vendida',
      infoHtml:function(){
        return '<div class="pfi-label"><div class="pfi-label-dot" style="background:#c06060;"></div><span style="color:#c06060;">Call Vendida</span></div>'
          +'<div class="pfi-title">Prima cobrada; pérdida cuando el oro sube</div>'
          +'<div class="pfi-row"><span class="pfi-key">Volumen</span><span class="pfi-val">5,000,000 oz</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Strike</span><span class="pfi-val">$300/oz</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Prima cobrada</span><span class="pfi-val" style="color:#2a7a4a;">$12/oz = $60M</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Pérdida si spot=$338</span><span class="pfi-val" style="color:#8b2020;">−$130M</span></div>'
          +'<div class="pfi-row"><span class="pfi-key">Relación vs. put comprada</span><span class="pfi-val" style="color:#8b2020;">2.5\u00d7 mayor volumen</span></div>'
          +'<div class="pfi-note danger"><strong>El error crítico:</strong> vender calls financió la protección bajista pero creó pérdidas al alza. Con el WAG, este instrumento generó ~$130M adicionales de pérdida.</div>';
      }
    }
  };

  var pfActive='all';

  function buildChart9(){
    charts[5]=true;

    /* calcular datos */
    var spots=[];for(var s=200;s<=500;s+=2)spots.push(s);
    var FWD=300,OZ_FWD=10e6,STK=280,PRIMA_C=8,OZ_PC=2e6,STK_CV=300,PRIMA_V=12,OZ_CV=5e6;
    var fwd=[],pc=[],cv=[],neto=[];
    for(var i=0;i<spots.length;i++){
      var sp=spots[i];
      var f=(FWD-sp)*OZ_FWD/1e6;
      var c=(Math.max(STK-sp,0)-PRIMA_C)*OZ_PC/1e6;
      var v=-(Math.max(sp-STK_CV,0)-PRIMA_V)*OZ_CV/1e6;
      fwd.push(f);pc.push(c);cv.push(v);neto.push(f+c+v);
    }

    var baseLayout={
      paper_bgcolor:'rgba(0,0,0,0)',
      plot_bgcolor:'rgba(0,0,0,0)',
      margin:{t:8,r:12,b:42,l:62},
      font:{family:monoFont,size:10},
      xaxis:{title:{text:'Precio spot ($/oz)',font:{family:monoFont,size:10}},tickfont:{family:monoFont,size:10},gridcolor:'rgba(0,0,0,.07)',zerolinecolor:'rgba(0,0,0,.15)',tickprefix:'$',showspikes:true,spikemode:'across',spikesnap:'cursor',spikedash:'dot',spikecolor:'rgba(26,26,46,.5)',spikethickness:1.5},
      yaxis:{title:{text:'P&L (USD millones)',font:{family:monoFont,size:10}},tickfont:{family:monoFont,size:10},gridcolor:'rgba(0,0,0,.07)',zerolinecolor:'rgba(0,0,0,.25)',ticksuffix:'M',showspikes:true,spikemode:'across',spikesnap:'cursor',spikedash:'dot',spikecolor:'rgba(26,26,46,.3)',spikethickness:1},
      showlegend:false,
      hovermode:'x unified',
      hoverlabel:{bgcolor:'#19180f',font:{color:'#f0ece0',size:11,family:monoFont},bordercolor:'transparent'},
      shapes:[
        {type:'line',x0:300,x1:300,y0:0,y1:1,yref:'paper',line:{color:'rgba(21,101,160,.5)',width:1.5,dash:'dash'}},
        {type:'line',x0:338,x1:338,y0:0,y1:1,yref:'paper',line:{color:'rgba(139,32,32,.5)',width:1.5,dash:'dash'}},
        {type:'rect',x0:300,x1:500,y0:-900,y1:0,fillcolor:'rgba(192,96,96,.05)',line:{width:0}}
      ],
      annotations:[
        {x:301,y:0.97,yref:'paper',text:'$300<br>forward',showarrow:false,font:{size:9,color:'rgba(21,101,160,.8)',family:monoFont},xanchor:'left',yanchor:'top'},
        {x:339,y:0.82,yref:'paper',text:'$338<br>WAG',showarrow:false,font:{size:9,color:'rgba(139,32,32,.8)',family:monoFont},xanchor:'left',yanchor:'top'}
      ]
    };

    /* trazos completos (modo all) */
    var allTraces=[
      {x:spots,y:fwd,name:'Forward vendido',mode:'lines',line:{color:'rgba(21,101,160,.35)',width:1.5},hovertemplate:'Forward: <b>%{y:.0f}M</b><extra></extra>'},
      {x:spots,y:pc,name:'Put comprada',mode:'lines',line:{color:'rgba(42,122,74,.35)',width:1.5,dash:'dot'},hovertemplate:'Put comprada: <b>%{y:.0f}M</b><extra></extra>'},
      {x:spots,y:cv,name:'Call vendida',mode:'lines',line:{color:'rgba(192,96,96,.35)',width:1.5,dash:'dot'},hovertemplate:'Call vendida: <b>%{y:.0f}M</b><extra></extra>'},
      {x:spots,y:neto,name:'P&L Neto',mode:'lines',line:{color:'#1a1a2e',width:3.5},hovertemplate:'<b>Neto: %{y:.0f}M</b><extra></extra>'}
    ];

    var singleTraces={
      fwd:[{x:spots,y:fwd,name:'Forward vendido',mode:'lines',fill:'tozeroy',fillcolor:'rgba(21,101,160,.07)',line:{color:'#1565a0',width:3},hovertemplate:'$%{x}/oz \u2014 P&L: <b>%{y:.0f}M</b><extra></extra>'}],
      pc: [{x:spots,y:pc, name:'Put comprada', mode:'lines',fill:'tozeroy',fillcolor:'rgba(42,122,74,.07)', line:{color:'#2a7a4a',width:3},hovertemplate:'$%{x}/oz \u2014 P&L: <b>%{y:.0f}M</b><extra></extra>'}],
      cv: [{x:spots,y:cv, name:'Call vendida', mode:'lines',fill:'tozeroy',fillcolor:'rgba(192,96,96,.07)', line:{color:'#c06060',width:3},hovertemplate:'$%{x}/oz \u2014 P&L: <b>%{y:.0f}M</b><extra></extra>'}]
    };

    Plotly.newPlot('ch-payoff',allTraces,baseLayout,{responsive:true,displayModeBar:false});
    renderInfo('all');

    /* Botones */
    var tabBtns=document.querySelectorAll('.pf-tab');
    tabBtns.forEach(function(btn){
      btn.addEventListener('click',function(){
        var key=btn.dataset.pf;
        if(key===pfActive)return;
        pfActive=key;
        tabBtns.forEach(function(b){b.classList.toggle('active',b.dataset.pf===key);});
        var d=PF_DATA[key];
        document.getElementById('pf-chart-title').textContent=d.title;
        document.getElementById('pf-chart-sub').textContent=d.sub;
        var traces=key==='all'?allTraces:singleTraces[key];
        Plotly.react('ch-payoff',traces,baseLayout,{responsive:true,displayModeBar:false});
        renderInfo(key);
      });
    });
  }

  function renderInfo(key){
    var el=document.getElementById('pf-info');
    if(!el)return;
    el.style.opacity='0';
    setTimeout(function(){
      el.innerHTML=PF_DATA[key].infoHtml();
      el.style.opacity='1';
    },150);
  }

})();
