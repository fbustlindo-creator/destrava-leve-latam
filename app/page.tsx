'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Clock3, ShieldCheck } from 'lucide-react';
import { useFunnel } from './funnel-context';
import { getScreenBySlug } from './funnel-routes';
import { ConfettiBurst } from './confetti-burst';
import { useFunnelMotion } from './use-funnel-motion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { captureUtmParams } from './analytics/utm-tracker';
import {
  trackVirtualPageView,
  trackQuizStart,
  trackQuizAnswer,
  trackMechanismView,
  trackResultView,
  trackLeadCapture,
  trackWheelWon,
  trackViewContentOffer,
  trackInitiateCheckout,
} from './analytics/tracker';
import { FUNNEL_ROUTES } from './funnel-routes';

type Choice = [string, string];
type Question = { id:string; type:'single'|'multi'|'scale'; title:string; options:Choice[]; hint?:string };

const questionVisuals:Record<string,{src:string;alt:string;caption:string}> = {
  stress:{src:'/estado-estresse.webp',alt:'Mujer adulta sentada mostrando estrés',caption:'Comprendamos cómo esto aparece en tu rutina.'},
  jaw:{src:'/estado-mandibula.webp',alt:'Mujer adulta tocando la zona de la mandíbula',caption:'La tensión en el rostro y el cuello puede pasar desapercibida.'},
  legs:{src:'/estado-pernas.webp',alt:'Mujer adulta masajeando la pierna cansada',caption:'Observa la sensación que suele aparecer al final del día.'},
  waking:{src:'/estado-cansaco.webp',alt:'Mujer adulta despertando con poca energía',caption:'Tu comienzo de la mañana ayuda a organizar tu plan.'},
};

const questions:Record<number,Question> = {
  2:{id:'stress',type:'single',title:'¿Con qué frecuencia te sientes estresada o ansiosa?',options:[['😮‍💨','Con frecuencia'],['🌤️','Rara vez'],['✨','Casi nunca']]},
  3:{id:'jaw',type:'single',title:'¿Acostumbras apretar la mandíbula o rechinar los dientes?',options:[['😬','Sí, con frecuencia'],['🤔','Rara vez'],['🙂','No lo percibo']]},
  4:{id:'stiffness',type:'single',title:'¿Sientes dolor o rigidez en la zona lumbar, el cóccix o la cadera?',options:[['🧍‍♀️','Sí'],['🤷‍♀️','No sé decir'],['✨','No']]},
  5:{id:'legs',type:'single',title:'¿Con qué frecuencia tus piernas se sienten pesadas, adoloridas o hinchadas?',options:[['🦵','Con frecuencia'],['🌥️','A veces'],['✨','Casi nunca']]},
  6:{id:'belly',type:'single',title:'¿Notas el abdomen inflamado o hinchado incluso cuando cuidas tu alimentación o haces ejercicio?',options:[['💧','Sí'],['🤔','No sé decir'],['🙂','No']]},
  7:{id:'urinary',type:'single',title:'¿Sientes necesidad de orinar con mucha frecuencia?',options:[['🚻','Sí, con frecuencia'],['🤷‍♀️','No sé decir'],['✨','No lo percibo']]},
  9:{id:'mood',type:'scale',title:'"La forma en que se siente mi cuerpo interfiere en mi estado de ánimo."',hint:'¿Cuánto estás de acuerdo con esta frase?',options:[['1','Totalmente en desacuerdo'],['2','En desacuerdo'],['3','A veces'],['4','De acuerdo'],['5','Totalmente de acuerdo']]},
  10:{id:'waking',type:'single',title:'"Ya amanezco cansada, incluso antes de que empiece el día."',options:[['🪫','Casi todos los días'],['😮‍💨','Con frecuencia'],['🌤️','Rara vez'],['✨','Nunca']]},
  11:{id:'impact',type:'single',title:'"Estas molestias afectan mis relaciones, mi trabajo o mi calidad de vida."',options:[['5','Totalmente de acuerdo'],['4','De acuerdo'],['3','Un poco'],['1','No estoy de acuerdo']]},
  12:{id:'desire',type:'single',title:'¿Con qué frecuencia te sientes desconectada de tu cuerpo, con poca energía o deseo?',options:[['🌫️','Con frecuencia'],['🌥️','A veces'],['✨','Rara vez o nunca'],['—','Prefiero no responder']]},
  13:{id:'reactions',type:'single',title:'¿Te irritas, te alejas o te cierras y luego piensas por qué reaccionaste así?',options:[['😤','Con frecuencia'],['🌥️','A veces'],['🕐','Esto comenzó recientemente'],['✨','Rara vez']]},
  14:{id:'understood',type:'single',title:'¿Sientes que las personas a tu alrededor no entienden bien lo que estás viviendo?',options:[['💭','Con frecuencia'],['🌥️','A veces'],['🕐','Esto comenzó recientemente'],['✨','Rara vez']]},
  15:{id:'energy',type:'single',title:'¿Cómo suele estar tu energía a lo largo del día?',options:[['🪫','Baja casi todo el día'],['🌇','Cae bastante por la tarde'],['🌙','Llego al final del día agotada'],['↕️','Varía de un día a otro'],['🔋','Tengo energía suficiente']]},
  16:{id:'duration',type:'single',title:'¿Hace cuánto tiempo notas estas molestias?',options:[['🗓️','Hace menos de 3 meses'],['📅','Entre 3 y 6 meses'],['📆','Entre 6 meses y 1 año'],['⏳','Hace más de 1 año'],['✨','No noto estas molestias']]},
  17:{id:'caffeine',type:'single',title:'¿Con qué frecuencia tomas café u otras bebidas con cafeína?',options:[['☕','Dos o más veces al día'],['🥤','Una vez al día'],['🌥️','De vez en cuando'],['✨','Nunca']]},
  18:{id:'sleep',type:'multi',title:'¿Cuáles de estas situaciones ocurren con tu sueño?',options:[['🪫','Me despierto cansada'],['🌙','Me despierto durante la noche'],['⏰','Tardo en quedarme dormida'],['😴','Siento que duermo mal'],['↕️','Mis horarios varían mucho'],['✨','Ninguna de estas opciones']]},
  19:{id:'activity',type:'single',title:'¿Cómo describirías tu rutina hoy?',options:[['🪑','Paso gran parte del día sentada o parada'],['🚶‍♀️','Me muevo un poco a lo largo del día'],['🏃‍♀️','Practico ejercicio con frecuencia'],['🔄','Mi rutina es diferente a estas opciones']]},
  20:{id:'habits',type:'multi',title:'¿Hay algún hábito que te gustaría cambiar?',options:[['⏳','Posponer lo que quiero hacer'],['🍟','Comer muchos alimentos poco nutritivos'],['🍬','Comer dulces con frecuencia'],['🚬','Fumar'],['🍷','Beber alcohol'],['✨','Ninguno de estos']]},
  21:{id:'changes',type:'multi',title:'¿Has notado alguno de estos cambios o recibido alguno de estos diagnósticos?',options:[['⚖️','Aumento de peso'],['❤️','Presión alta diagnosticada'],['💧','Sensación de hinchazón'],['🌙','Disminución del deseo sexual'],['💇‍♀️','Caída o adelgazamiento del cabello'],['🧍‍♀️','Dolor de espalda'],['🦵','Dolor en las articulaciones'],['🩺','Síndrome de intestino irritable diagnosticado'],['➕','Otra situación'],['✨','Ninguna de estas opciones']]},
  22:{id:'context',type:'multi',title:'¿Alguna de estas situaciones ha dificultado tu rutina recientemente?',options:[['💼','Presión en el trabajo'],['💳','Preocupaciones financieras'],['🏠','Rutina familiar agitada'],['💔','Separación o fin de una relación'],['🌪️','Otra situación estresante'],['✨','Ninguna de estas opciones']]},
  23:{id:'priorities',type:'multi',title:'¿Qué te gustaría mejorar más en tu día a día?',options:[['🔋','Mi vitalidad'],['🧘‍♀️','La forma en que manejo el estrés'],['🌤️','Mi sensación de preocupación o ansiedad'],['🙂','Los cambios de humor'],['🧠','Mi claridad mental y concentración'],['✨','Ninguna de estas opciones']]},
  24:{id:'goal',type:'single',title:'¿Cuál de estos cambios marcaría más diferencia en tu vida hoy?',options:[['🪶','Desinflamar el abdomen y volver a sentir el cuerpo liviano'],['👨‍👩‍👧','Tener más paciencia y energía con mis hijos y familia'],['🔋','Despertar con vitalidad real, sin pesadez ni dolor'],['🧘‍♀️','Desacelerar la mente y vivir sin tanto estrés']]},
  25:{id:'knowledge',type:'single',title:'¿Has escuchado hablar sobre la fascia, el sistema linfático y el nervio vago?',options:[['🌱','Aún no'],['💡','Lo he escuchado, pero sé poco'],['📚','Sí, conozco estos temas']]},
  27:{id:'source',type:'single',title:'¿Cómo conociste Destrava Leve?',options:[['📱','Vi un anuncio'],['💬','Alguien me lo recomendó'],['🩺','Un profesional me lo recomendó'],['✨','Lo encontré en redes sociales'],['🤔','No recuerdo']]},
  30:{id:'time',type:'single',title:'¿Cuánto tiempo puedes dedicar a cuidarte cada día?',options:[['⏱️','Alrededor de 7 minutos'],['🕐','Entre 10 y 15 minutos'],['🕑','Más de 15 minutos'],['📅','Aún necesito organizar ese tiempo']]},
  32:{id:'confidence',type:'single',title:'¿Cómo te sientes respecto a comenzar esta rutina?',options:[['🚀','Estoy entusiasmada para comenzar'],['🌱','Tengo dudas, pero quiero intentarlo'],['💡','Quero entender mejor antes de decidir']]},
};

const category=(s:number)=>s<=8?'Señales físicas':s<=15?'Estado emocional':s<=22?'Estilo de vida':s<=29?'Objetivos':'Casi listo';
const segment=(s:number)=>s<=8?1:s<=15?2:s<=22?3:s<=29?4:5;

const introMessages = [
  '🌿 Identificando tu perfil y rutina...',
  '📊 Cruzando con el historial del programa Destrava Leve...',
  '✨ Personalizando tus preguntas de evaluación...',
];

const pvToastBuyers=[
  {name:'Valentina',message:'acaba de desbloquear el Plan Destrava Leve 28D.'},
  {name:'Sofía',message:'activó su rutina de 7 minutos Destrava Leve.'},
  {name:'Lucía',message:'aseguró su plan Destrava Leve ahora.'},
  {name:'Camila',message:'confirmó su protocolo personalizado Destrava Leve.'},
  {name:'Daniela',message:'desbloqueó el método Destrava Leve 28D.'},
  {name:'Andrea',message:'adquirió su plan Destrava Leve personal.'},
];

const Primary=({children,onClick,disabled=false}:{children:React.ReactNode;onClick:()=>void;disabled?:boolean})=><button className="primary" onClick={onClick} disabled={disabled}>{children}</button>;

export default function Home({ initialSlug }: { initialSlug?: string } = {}) {
  const {
    answers,
    setSingleAnswer,
    toggleMultiAnswer,
    name,
    setName,
    email,
    setEmail,
    marketing,
    setMarketing,
    wheel,
    setWheel,
    offerSeconds,
    setOfferSeconds,
    score,
    displayName,
    resultGoal,
    priorities,
  } = useFunnel();

  const [screen, setScreen] = useState(() => (initialSlug ? getScreenBySlug(initialSlug) : 0));

  const [loader, setLoader] = useState(8);
  const [checkout, setCheckout] = useState(false);
  const [toastShow, setToastShow] = useState(false);
  const [toastIdx, setToastIdx] = useState(0);
  const [pv2GalleryIdx, setPv2GalleryIdx] = useState(0);
  const [introLoading, setIntroLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    const preview = new URLSearchParams(window.location.search).get('screen');
    if (preview && Number(preview) > 1) return false;
    if (window.location.pathname !== '/' && window.location.pathname !== '') return false;
    return true;
  });
  const [introProgress, setIntroProgress] = useState(0);

  const targetDateFormatted = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 28);
    const day = d.getDate();
    const month = d.toLocaleDateString('es-419', { month: 'long' });
    const year = d.getFullYear();
    return `${day === 1 ? '1º' : day} de ${month} de ${year}`;
  }, []);

  useEffect(() => {
    if (initialSlug !== undefined) {
      setScreen(getScreenBySlug(initialSlug));
      return;
    }
    const preview = Number(new URLSearchParams(window.location.search).get('screen'));
    if (Number.isInteger(preview) && preview >= 1 && preview <= 39) {
      setScreen(preview - 1);
      return;
    }
    const fromPath = getScreenBySlug(window.location.pathname);
    if (fromPath > 0) {
      setScreen(fromPath);
    }
  }, [initialSlug]);

  useEffect(() => {
    captureUtmParams();
  }, []);

  useEffect(() => {
    const slug = FUNNEL_ROUTES[screen] || '';
    trackVirtualPageView(screen, slug);

    if (screen === 26) {
      trackMechanismView();
    } else if (screen === 28) {
      trackResultView(score, 'Elevado');
    } else if (screen === 38) {
      trackViewContentOffer(37);
    }
  }, [screen, score]);

  const wheelRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLSpanElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const { shellRef, busyRef, busy, fullMotion, toggleMotion, go } = useFunnelMotion(screen, setScreen);
  useEffect(()=>{const timer=window.setTimeout(()=>['/grupo-mulheres.webp','/mascote-emocional.webp','/comparativo-antes-depois.png','/estado-estresse.webp','/estado-mandibula.webp','/estado-pernas.webp','/estado-cansaco.webp','/kit-destrava-leve.webp','/mockup-app-programa.png','/mockup-calendario-28d.png','/mockup-guia-aceleracao.png'].forEach(src=>{const image=new Image();image.decoding='async';image.src=src}),180);return()=>window.clearTimeout(timer)},[]);

  useEffect(() => {
    if (!introLoading || screen !== 0) return;
    const totalMs = 8000;
    const intervalMs = 60;
    const startTime = Date.now();

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setIntroProgress(pct);

      if (pct >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          setIntroLoading(false);
        }, 320);
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [introLoading, screen]);

  const introMessage = useMemo(() => {
    if (introProgress < 35) return '🌿 Conectando con el protocolo Destrava Leve 28D...';
    if (introProgress < 70) return '📊 Cruzando parámetros de liberación fascial y postural...';
    if (introProgress < 100) return '✨ Personalizando tus preguntas de evaluación...';
    return '✅ ¡Evaluación lista! Iniciando...';
  }, [introProgress]);

  const goalLabel = useMemo(() => {
    const goal = typeof answers.goal === 'string' ? answers.goal : '';
    if (goal.includes('Desinflamar') || goal.includes('cuerpo liviano') || goal.includes('Desinchar')) return 'Cuerpo Liviano & Desinflamado';
    if (goal.includes('paciencia') || goal.includes('hijos') || goal.includes('familia') || goal.includes('paciência')) return 'Más Energía & Familia';
    if (goal.includes('vitalidad') || goal.includes('pesadez') || goal.includes('dolor') || goal.includes('disposição')) return 'Vitalidad & Energía';
    if (goal.includes('mente') || goal.includes('estrés') || goal.includes('estresse')) return 'Alivio del Estrés';
    return 'Cuerpo Liviano & Desinflamado';
  }, [answers.goal]);
  useEffect(()=>{if(screen!==33)return;setLoader(8);const values=[24,43,67,86,100];let i=0;let advance:number|undefined;const timer=window.setInterval(()=>{const value=values[i++];setLoader(value);if(value===100){window.clearInterval(timer);advance=window.setTimeout(()=>go(34),400)}},480);return()=>{window.clearInterval(timer);window.clearTimeout(advance)}},[screen,go]);
  useEffect(()=>{if(screen!==38)return;const timer=window.setInterval(()=>setOfferSeconds(value=>value>0?value-1:0),1000);return()=>window.clearInterval(timer)},[screen,setOfferSeconds]);
  useEffect(()=>{if(screen!==38)return;const timer=window.setInterval(()=>setPv2GalleryIdx(i=>(i+1)%3),3600);return()=>window.clearInterval(timer)},[screen]);
  useEffect(()=>{if(screen!==38){setToastShow(false);return;}setToastIdx(0);const t1=window.setTimeout(()=>setToastShow(true),2500);const interval=window.setInterval(()=>{setToastShow(false);window.setTimeout(()=>{setToastIdx(i=>i+1);setToastShow(true);},800);},5200);return()=>{window.clearTimeout(t1);window.clearInterval(interval);setToastShow(false)}},[screen]);
  useEffect(()=>{if(screen!==29||!chartRef.current)return;const chart=chartRef.current;const bars=Array.from(chart.querySelectorAll<HTMLElement>('.week-bar'));const shines=Array.from(chart.querySelectorAll<HTMLElement>('.week-bar em'));const grid=Array.from(chart.querySelectorAll<HTMLElement>('.chart-grid i'));const line=chart.querySelector<SVGPolylineElement>('.chart-line polyline');const dots=Array.from(chart.querySelectorAll<SVGCircleElement>('.chart-line circle'));const animations:Animation[]=[];const timer=window.setTimeout(()=>{grid.forEach((item,index)=>animations.push(item.animate([{opacity:0},{opacity:1}],{duration:350,delay:index*90,fill:'forwards'})));bars.forEach((bar,index)=>animations.push(bar.animate([{transform:'scaleY(0)',filter:'saturate(.7)'},{transform:'scaleY(1.06)',filter:'saturate(1)',offset:.82},{transform:'scaleY(1)',filter:'saturate(1)'}],{duration:920,delay:120+index*190,easing:'cubic-bezier(.18,.78,.2,1)',fill:'forwards'})));if(line)animations.push(line.animate([{strokeDashoffset:700},{strokeDashoffset:0}],{duration:1350,delay:1050,easing:'cubic-bezier(.2,.75,.2,1)',fill:'forwards'}));dots.forEach((dot,index)=>animations.push(dot.animate([{opacity:0,transform:'scale(.25)'},{opacity:1,transform:'scale(1.15)',offset:.72},{opacity:1,transform:'scale(1)'}],{duration:360,delay:1180+index*210,easing:'ease-out',fill:'forwards'})));shines.forEach((shine,index)=>animations.push(shine.animate([{transform:'translateY(-160%)',opacity:0},{opacity:1,offset:.22},{transform:'translateY(520%)',opacity:0}],{duration:2800,delay:2050+index*120,iterations:Infinity,easing:'ease-in-out'})));const last=dots.at(-1);if(last)animations.push(last.animate([{filter:'drop-shadow(0 0 0 #f45b6800)',transform:'scale(1)'},{filter:'drop-shadow(0 0 8px #f45b68)',transform:'scale(1.38)'},{filter:'drop-shadow(0 0 0 #f45b6800)',transform:'scale(1)'}],{duration:2200,delay:2450,iterations:Infinity,easing:'ease-in-out'}))},380);return()=>{window.clearTimeout(timer);animations.forEach(animation=>animation.cancel())}},[screen]);
  const setSingle=(id:string,value:string)=>{if(busyRef.current)return;if(id==='age'){trackQuizStart(value)}trackQuizAnswer(id,value,screen);setSingleAnswer(id,value);go(screen===0?2:screen+1,105)};
  const toggleMulti=(id:string,value:string,checked:boolean)=>{if(busyRef.current)return;toggleMultiAnswer(id,value,checked)};
  const selected=(id:string)=>answers[id];

  const tone=(frequency:number,duration:number,volume:number,startDelay=0)=>{const ctx=audioRef.current;if(!ctx)return;const oscillator=ctx.createOscillator();const gain=ctx.createGain();const start=ctx.currentTime+startDelay;oscillator.type='triangle';oscillator.frequency.setValueAtTime(frequency,start);gain.gain.setValueAtTime(volume,start);gain.gain.exponentialRampToValueAtTime(.001,start+duration);oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(start);oscillator.stop(start+duration)};

  const spinWheel=async()=>{if(wheel!=='idle'||!wheelRef.current)return;setWheel('spinning');if(!audioRef.current)audioRef.current=new AudioContext();if(audioRef.current.state==='suspended')await audioRef.current.resume();const disk=wheelRef.current;const duration=fullMotion?4800:1300;const endAngle=2340;let lastSegment=-1;let frame=0;let running=true;const readSegment=()=>{const matrix=new DOMMatrixReadOnly(getComputedStyle(disk).transform);const angle=(Math.atan2(matrix.b,matrix.a)*180/Math.PI+360)%360;return Math.floor(((angle+30)%360)/60)};const monitor=()=>{const segment=readSegment();if(segment!==lastSegment){lastSegment=segment;tone(1120,.028,.035);pointerRef.current?.animate([{transform:'translateX(-50%) rotate(0deg)'},{transform:'translateX(-50%) rotate(-16deg)'},{transform:'translateX(-50%) rotate(0deg)'}],{duration:95,easing:'ease-out'})}if(running)frame=requestAnimationFrame(monitor)};const animation=disk.animate([{transform:'rotate(0deg)'},{transform:`rotate(${endAngle}deg)`}],{duration,easing:'cubic-bezier(.12,.72,.08,1)',fill:'forwards'});frame=requestAnimationFrame(monitor);try{await animation.finished}catch{}running=false;cancelAnimationFrame(frame);disk.style.transform=`rotate(${endAngle}deg)`;animation.cancel();tone(523,.32,.07);tone(659,.36,.06,.11);tone(784,.42,.055,.22);setWheel('won');trackWheelWon('75% OFF')};

  useEffect(()=>{if(screen===35){setMarketing(true);go(36)}},[screen,go,setMarketing]);
  const renderHeader=()=><><header className="topbar">{screen>0&&screen<38?<button className="back" onClick={()=>go(screen===36?34:(screen===2?0:screen-1))} aria-label="Volver"><ArrowLeft/></button>:<span/>}<button className="logo" onClick={()=>go(0)} aria-label="Destrava Leve, inicio"><img src="/logo-destrava-horizontal.svg" alt="Destrava Leve+" className="topbar-logo-img" width="170" height="38" /></button><span/></header>{screen>1&&screen<33?<><div className="progress-meta"><span>{category(screen)}</span><span>{Math.round((screen/33)*100)}%</span></div><div className="segments">{[1,2,3,4,5].map((n)=><i className={segment(screen)>=n?'active':''} key={n}/>)}</div></>:null}</>;

  const renderQuestion=(q:Question)=>{const current=selected(q.id);const list=Array.isArray(current)?current:[];const visual=questionVisuals[q.id];return <main key={screen} className={`screen quiz screen-in ${visual?'quiz-visual':''}`}><div className="question-count">PREGUNTA {Object.keys(questions).indexOf(String(screen))+1} DE 27</div><h1>{q.title}</h1><p className="hint">{q.hint||(q.type==='multi'?'Puedes seleccionar más de una opción.':'Elige la opción que más se adapta a ti.')}</p>{visual?<figure className="state-visual"><img src={visual.src} alt={visual.alt}/><figcaption>{visual.caption}</figcaption><i/><i/><i/></figure>:null}{q.type==='scale'?<RadioGroup className="scale-options" value={typeof current==='string'?current:''} onValueChange={v=>setSingle(q.id,v)}>{q.options.map(([n,label])=><label className={current===n?'selected':''} key={n} onClick={()=>setSingle(q.id,n)}><RadioGroupItem className="sr-only" value={n}/><strong>{n}</strong><span>{label}</span></label>)}</RadioGroup>:q.type==='multi'?<div className="choice-list compact">{q.options.map(([emoji,label],i)=><label className={`choice-card ${list.includes(label)?'selected':''}`} key={label}><span className="emoji">{emoji}</span><span>{label}</span><Checkbox id={`${q.id}-${i}`} checked={list.includes(label)} onCheckedChange={v=>toggleMulti(q.id,label,v===true)}/></label>)}</div>:<RadioGroup className="choice-list" value={typeof current==='string'?current:''} onValueChange={v=>setSingle(q.id,v)}>{q.options.map(([emoji,label])=><label className={`choice-card ${current===label?'selected':''}`} key={label} onClick={()=>setSingle(q.id,label)}><RadioGroupItem className="sr-only" value={label}/><span className="emoji">{emoji}</span><span>{label}</span><ChevronRight/></label>)}</RadioGroup>}{q.type==='multi'?<Primary disabled={!list.length} onClick={()=>{trackQuizAnswer(q.id,list,screen);go(screen+1)}}>Continuar</Primary>:null}</main>};

  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return <div ref={shellRef} className="page-shell" data-screen={screen} data-motion={fullMotion?'full':'reduced'} aria-busy={busy}>
    <div className={`funnel-header ${questionVisuals[questions[screen]?.id]?'visual-header':''}`}>{screen === 0 && introLoading ? null : renderHeader()}</div>
    {questions[screen]?renderQuestion(questions[screen]):null}
    {screen===0 && introLoading ? (
      <main key="intro-loading" className="screen intro-splash screen-in">
        <div className="intro-splash-header">
          <span className="intro-splash-kicker">SISTEMA INTELIGENTE DE EVALUACIÓN</span>
          <h1 className="intro-splash-title">Preparando tu Prueba de Liberación Corporal...</h1>
        </div>
        <img src="/mascote-fluxo-transparente.webp" alt="Mascota Destrava Leve" className="intro-splash-mascot" />
        <div className="intro-splash-box">
          <div className="intro-splash-meta">
            <span>Configurando diagnóstico</span>
            <strong>{introProgress}%</strong>
          </div>
          <div className="intro-splash-track">
            <div className="intro-splash-bar" style={{ width: `${introProgress}%` }} />
          </div>
          <p className="intro-splash-message">{introMessage}</p>
          <p className="intro-splash-subtext">⚡ Espera unos 8 segundos mientras configuramos tu evaluación...</p>
        </div>
      </main>
    ) : null}
    {screen===0 && !introLoading ? <main key="entry-screen" className="screen entry screen-in"><div className="entry-copy"><h1>PLAN DE LIBERACIÓN CORPORAL</h1><p>Una rutina de 7 minutos para ayudar a aliviar la sensación de pesadez y volver a sentir el cuerpo liviano.</p><strong>Quiz de 1 minuto</strong></div><div className="entry-grid"><img src="/mascote-fluxo-transparente.webp" alt="Personaje 3D con anatomía de flujo en azul"/><RadioGroup value={typeof answers.age==='string'?answers.age:''} onValueChange={v=>setSingle('age',v)}>{['25–34','35–44','45–54','55+'].map(v=><label className={answers.age===v?'age selected':'age'} key={v} onClick={()=>setSingle('age',v)}><RadioGroupItem className="sr-only" value={v}/>{v}</label>)}</RadioGroup></div><p className="legal">Este cuestionario organiza tus respuestas y no reemplaza la evaluación profesional.</p></main>:null}
    {screen===1?<main key={screen} className="screen interstitial trust screen-in"><h1>Un paso a la vez.<br/><span>Una rutina que cabe en tu día.</span></h1><img src="/grupo-mulheres.webp" alt="Tres mujeres en estilo de animación 3D"/><div className="mini-benefits"><span><b>28</b> días</span><span><b>7</b> minutos</span><span><b>1</b> paso a la vez</span></div><p>Primero, vamos a entender lo que percibes en tu cuerpo y lo que te gustaría mejorar.</p><Primary onClick={()=>go(2)}>Comenzar</Primary></main>:null}
    {screen===8?<main key={screen} className="screen interstitial emotion screen-in"><h1>Lo que sientes merece atención.</h1><img src="/mascote-emocional.webp" alt="Personaje 3D reflexivo con anatomía azul visible"/><p>Cuando el cuerpo molesta, eso también pesa en la rutina. Ahora vamos a entender cómo te sientes en el día a día.</p><Primary onClick={()=>go(9)}>Continuar</Primary></main>:null}
    {screen===26?<main key={screen} className="screen mechanism screen-in">
      <article className="g1-card">
        <header className="g1-header-bar">
          <picture>
            <source srcSet="/g1-header-ref.webp" type="image/webp" />
            <img src="/g1-header-ref.png" alt="Bienestar 360" className="g1-header-img" />
          </picture>
        </header>

        <div className="g1-body">
          <span className="g1-kicker">NUEVO MÉTODO DESTRAVA LEVE</span>
          <h1 className="g1-headline">
            &ldquo;Destrava Leve&rdquo;: Nueva Rutina de 7 Minutos de Liberación de la Fascia Ayuda a Mujeres a Aliviar la Sensación de Pesadez e Inflamación Corporal
          </h1>
          <p className="g1-lead">
            Una práctica suave enfocada en liberar la fascia y estimular la relajación corporal ayuda a desarmar la rigidez diaria y devolver la ligereza, ideal para hacer en casa y sin esfuerzo excesivo.
          </p>

          <div className="g1-meta">
            <span className="g1-byline"><strong>Por Bienestar 360</strong> | 19/09/2026 10:15 · Actualizado hace 1 hora</span>
          </div>

          <figure className="g1-figure">
            <img src="/materia-g1-destrava.jpg" alt="Mujer practicando estiramiento y liberación corporal suave en casa" />
            <figcaption>Rutina diaria de 7 minutos enfocada en la liberación fascial suave para aliviar el cuerpo sin impacto ni fatiga excesiva. (Foto: Divulgación)</figcaption>
          </figure>

          <div className="g1-share-bar" aria-label="Compartir artículo">
            <button type="button" className="g1-share-btn" aria-label="Compartir en Facebook">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button type="button" className="g1-share-btn" aria-label="Compartir en WhatsApp">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#25d366"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.97.58 3.84 1.62 5.43L2 22l4.81-1.68c1.53.94 3.32 1.48 5.23 1.48 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.72 14.17c-.24.68-1.2 1.25-1.68 1.29-.46.04-1.04.14-3.34-.78-2.5-1-4.1-3.56-4.22-3.73-.13-.17-1.01-1.34-1.01-2.56 0-1.22.64-1.82.87-2.07.23-.25.5-.31.67-.31.17 0 .34 0 .49.01.15.01.37-.06.57.43.21.5.71 1.74.77 1.87.06.13.1.28.02.44-.08.17-.12.28-.24.42-.12.15-.26.33-.37.44-.12.13-.25.26-.11.5.14.24.63 1.04 1.35 1.68.93.83 1.71 1.09 1.95 1.21.24.12.38.1.52-.06.14-.17.61-.71.77-.96.16-.25.32-.21.53-.13.22.08 1.38.65 1.62.77.24.12.4.18.46.28.06.1.06.6-.18 1.28z"/></svg>
            </button>
            <button type="button" className="g1-share-btn" aria-label="Otras opciones de compartir">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
        </div>
      </article>

      <section className="qualification-card">
        <div className="qualification-badge">
          <span className="qualification-icon">✨</span>
          <h2>¡Excelente noticia!</h2>
        </div>
        <p className="qualification-intro">
          Con base en tus respuestas hasta aquí, eres exactamente el perfil para quien fue diseñado <strong>Destrava Leve</strong>:
        </p>
        <ul className="qualification-list">
          <li>
            <span className="q-check">✓</span>
            <span>Ya probaste otros métodos sin sentir el cuerpo liviano y verdaderamente suelto</span>
          </li>
          <li>
            <span className="q-check">✓</span>
            <span>No tienes tiempo ni ganas para gimnasios o entrenamientos intensos</span>
          </li>
          <li>
            <span className="q-check">✓</span>
            <span>Sientes el cuerpo bloqueado, piernas pesadas o sensación de hinchazón constante</span>
          </li>
          <li>
            <span className="q-check">✓</span>
            <span>Necesitas una rutina corta, segura y que respete los límites de tu cuerpo</span>
          </li>
        </ul>
        <p className="qualification-note">Continúa — tu plan personalizado está siendo preparado.</p>
        <Primary onClick={()=>go(27)}>Continuar →</Primary>
      </section>

      <p className="notice">Contenido informativo basado en tus preferencias; no reemplaza la orientación médica o de salud.</p>
    </main>:null}
    {screen===28?<main key={screen} className="screen result screen-in">
      <h1 className="result-headline">Resumen de tu perfil</h1>
      <section className="result-card">
        <div className="result-title">
          <b>Nivel de restricción fascial</b>
          <strong className="badge-status">Elevado</strong>
        </div>

        <div className="score-track-container">
          <div className="score-pin" style={{ left: `${Math.max(76, Math.min(88, score))}%` }}>
            <span>Tú – {Math.max(76, Math.min(88, score))}%</span>
            <i className="score-pin-arrow" />
          </div>
          <div className="score-bar">
            <i className="score-dot" style={{ left: `${Math.max(76, Math.min(88, score))}%` }} />
          </div>
          <div className="scale-labels">
            <span>Bajo</span>
            <span>Normal</span>
            <span>Medio</span>
            <span>Alto</span>
          </div>
        </div>

        <article className="diagnosis-box">
          <b>☝️ Restricción Fascial Elevada</b>
          <p>
            Tu puntuación indica que tu fascia está significativamente congelada y sobrecargada — bloqueando el flujo linfático, aumentando la presión en tu pelvis, espalda y piernas, y manteniendo tu cuerpo en un estado de tensión continua del que no puede salir solo.
          </p>
          <p>
            Cuando la fascia se contrae crónicamente, silencia el nervio vago — la única señal que le indica a tu cuerpo que finalmente es seguro relajarse y desinflamarse. Esta es la verdadera raíz del cansancio crónico, la sensación de pesadez constante y el agotamiento corporal que has venido sintiendo.
          </p>
        </article>

        <div className="result-body">
          <dl className="result-metrics">
            <div>
              <dt>Sistema nervioso:</dt>
              <dd className="metric-highlight">Modo de supervivencia</dd>
            </div>
            <div>
              <dt>Señales de alerta:</dt>
              <dd className="metric-alert">41/50</dd>
            </div>
            <div>
              <dt>Duración de los síntomas:</dt>
              <dd>&lt; 3 meses</dd>
            </div>
            <div>
              <dt>Niveles de energía:</dt>
              <dd className="metric-warning">23%</dd>
            </div>
            <div>
              <dt>Enfoque recomendado:</dt>
              <dd className="metric-focus">Liberación fascial y activación del nervio vago</dd>
            </div>
          </dl>
          <div className="result-character-col">
            <img 
              src="/mascote-busto-perfeito.webp" 
              alt="Mascota Destrava Leve mostrando bloqueo fascial" 
              className="result-bust-img"
            />
          </div>
        </div>
      </section>
      <Primary onClick={()=>go(29)}>Continuar →</Primary>
      <p className="legal">Resultado educativo basado en las respuestas; no es diagnóstico.</p>
    </main>:null}
    {screen===29?<main key={screen} className="screen bridge aura-chart-screen screen-in">
      <h1 className="aura-chart-title">Descubre cómo la disfunción del nervio vago afecta tu día a día.</h1>
      <p className="aura-chart-lead">
        Los estudios muestran que tratar las causas principales de la <strong>disfunción del nervio vago</strong> puede mejorar significativamente la calidad del <strong>sueño</strong>, la resiliencia al <strong>estrés</strong> y los niveles de <strong>energía sostenidos</strong>.
      </p>

      <div className="aura-chart-card">
        <svg
          className="aura-curves-svg"
          viewBox="0 0 490 230"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Gráfico de evolución biológica en 4 semanas: Resistencia al estrés, Sueño profundo y Niveles de energía"
        >
          <defs>
            <filter id="aura-pill-shadow" x="-5%" y="-10%" width="110%" height="130%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.10" />
            </filter>
          </defs>

          {/* Linhas de grade horizontais tracejadas */}
          <line x1="30" y1="36" x2="465" y2="36" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3"/>
          <line x1="30" y1="80" x2="465" y2="80" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3"/>
          <line x1="30" y1="124" x2="465" y2="124" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3"/>
          <line x1="30" y1="185" x2="465" y2="185" stroke="#e2e8f0" strokeWidth="1.5"/>

          {/* 1. Roxo/Azul - Sono profundo (ganho rápido inicial até semana 2, sustentado até semana 4) */}
          <path
            d="M 50,185 C 95,182 125,92 175,85 C 225,79 275,80 332,80"
            fill="none"
            stroke="#6b66f4"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* 2. Laranja - Níveis de energia (evolução progressiva e constante ao longo das 4 semanas) */}
          <path
            d="M 50,185 C 100,180 145,150 175,142 C 220,132 265,126 316,124"
            fill="none"
            stroke="#f28500"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* 3. Verde - Resistência ao estresse (ascensão acentuada entre semanas 2 e 3, culminando no topo na semana 4) */}
          <path
            d="M 50,185 C 110,185 145,175 175,158 C 218,125 248,50 284,36"
            fill="none"
            stroke="#10b981"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Badges em Pílula ancorados à direita na Semana 4 */}
          {/* Verde: Resistência ao estresse */}
          <g transform="translate(280, 23)">
            <rect x="0" y="0" width="160" height="26" rx="13" fill="#10b981" filter="url(#aura-pill-shadow)"/>
            <text x="80" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Resistencia al estrés</text>
          </g>
          <line x1="440" y1="36" x2="452" y2="36" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="455" cy="36" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2"/>

          {/* Roxo: Sono profundo */}
          <g transform="translate(328, 67)">
            <rect x="0" y="0" width="112" height="26" rx="13" fill="#6b66f4" filter="url(#aura-pill-shadow)"/>
            <text x="56" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Sueño profundo</text>
          </g>
          <line x1="440" y1="80" x2="452" y2="80" stroke="#6b66f4" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="455" cy="80" r="6" fill="#6b66f4" stroke="#ffffff" strokeWidth="2"/>

          {/* Laranja: Níveis de energia */}
          <g transform="translate(312, 111)">
            <rect x="0" y="0" width="128" height="26" rx="13" fill="#f28500" filter="url(#aura-pill-shadow)"/>
            <text x="64" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Niveles de energía</text>
          </g>
          <line x1="440" y1="124" x2="452" y2="124" stroke="#f28500" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="455" cy="124" r="6" fill="#f28500" stroke="#ffffff" strokeWidth="2"/>

          {/* Eixo de Semanas (distribuído de ponta a ponta: Semana 1 a 4) */}
          <text x="50" y="210" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">Semana 1</text>
          <text x="175" y="210" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">Semana 2</text>
          <text x="300" y="210" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">Semana 3</text>
          <text x="425" y="210" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">Semana 4</text>
        </svg>
      </div>

      <div className="aura-evidence-list">
        <article className="aura-evidence-item">
          <div className="aura-evidence-badge mayo-badge">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <path d="M10 7v18M16 5v22M22 7v18" stroke="#1b365d" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M7 11c3-1 15-1 18 0M7 21c3 1 15 1 18 0" stroke="#1b365d" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p>
            Una investigación de la <strong>Mayo Clinic (2025)</strong> sobre la función del nervio vago mostró una <strong>reducción del 48% en la fatiga</strong> en pocas semanas.
          </p>
        </article>

        <article className="aura-evidence-item">
          <div className="aura-evidence-badge stanford-badge">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <text x="16" y="24" fontFamily="serif" fontSize="22" fontWeight="900" fill="#8c1515" textAnchor="middle">S</text>
              <path d="M16 7l2.5 4.5h-5L16 7zM16 11.5l3 5.5h-6l3-5.5z" fill="#006633"/>
            </svg>
          </div>
          <p>
            Un estudio de la <strong>Universidad de Stanford</strong> sobre salud metabólica demostró que la regulación del nervio vago <strong>redujo la fatiga en un 47%</strong>.
          </p>
        </article>

        <article className="aura-evidence-item">
          <div className="aura-evidence-badge harvard-badge">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <path d="M6 5h20v12c0 6.5-9 11-10 11s-10-4.5-10-11V5z" fill="#a51c30"/>
              <rect x="9" y="8" width="5.5" height="4.5" rx="0.5" fill="#fff"/>
              <rect x="17.5" y="8" width="5.5" height="4.5" rx="0.5" fill="#fff"/>
              <rect x="13.25" y="14.5" width="5.5" height="4.5" rx="0.5" fill="#fff"/>
            </svg>
          </div>
          <p>
            Una investigación de <strong>Harvard Health</strong> mostró que los protocolos de reducción del estrés que estimulan el nervio vago <strong>disminuyeron el estrés en un 44%</strong>.
          </p>
        </article>
      </div>

      <Primary onClick={()=>go(30)}>Continuar →</Primary>
    </main>:null}
    {screen===31?<main key={screen} className="screen timeline-screen screen-in">
      <h1 className="timeline-title">El último plan que necesitarás para volverte a sentir liviana.</h1>
      <p className="timeline-lead">
        Con base en tus respuestas, esperamos que reviertas completamente los efectos negativos antes del <strong className="timeline-date-highlight">{targetDateFormatted}</strong>.
      </p>

      <div className="timeline-chart-card">
        <svg
          className="timeline-curve-svg"
          viewBox="0 0 460 270"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Proyección de reversión de la sobrecarga fascial a lo largo de 4 semanas"
        >
          <defs>
            <linearGradient id="timeline-area-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.55" />
              <stop offset="28%" stopColor="#f87171" stopOpacity="0.38" />
              <stop offset="52%" stopColor="#fde047" stopOpacity="0.45" />
              <stop offset="78%" stopColor="#86efac" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#4ade80" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="timeline-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="42%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#22c55e" />
            </linearGradient>

            <filter id="timeline-badge-shadow" x="-10%" y="-15%" width="120%" height="135%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.10" />
            </filter>
          </defs>

          {/* Linhas de grade horizontais tracejadas */}
          <line x1="30" y1="70" x2="430" y2="70" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3"/>
          <line x1="30" y1="120" x2="430" y2="120" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3"/>
          <line x1="30" y1="170" x2="430" y2="170" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3"/>
          <line x1="30" y1="220" x2="430" y2="220" stroke="#e2e8f0" strokeWidth="1.5"/>

          {/* Área preenchida sob a curva */}
          <path
            d="M 65,72 C 105,72 145,140 175,148 C 220,158 250,174 285,180 C 330,188 360,220 395,220 L 65,220 Z"
            fill="url(#timeline-area-gradient)"
          />

          {/* Traço da curva em declive */}
          <path
            d="M 65,72 C 105,72 145,140 175,148 C 220,158 250,174 285,180 C 330,188 360,220 395,220"
            fill="none"
            stroke="url(#timeline-line-gradient)"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Badge Topo: Agora */}
          <g transform="translate(37, 24)">
            <rect x="0" y="0" width="56" height="24" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" filter="url(#timeline-badge-shadow)"/>
            <text x="28" y="13" fill="#334155" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="central">Ahora</text>
          </g>
          <circle cx="65" cy="72" r="6" fill="#f87171" stroke="#ffffff" strokeWidth="2.5"/>
          <circle cx="53" cy="69" r="4" fill="#f87171" opacity="0.6"/>

          {/* Badge Base: Após 4 semanas */}
          <g transform="translate(356, 164)">
            <rect x="0" y="0" width="76" height="34" rx="8" fill="#22c55e" filter="url(#timeline-badge-shadow)"/>
            <text x="38" y="12" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">Tras</text>
            <text x="38" y="24" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">4 semanas</text>
          </g>
          <circle cx="395" cy="220" r="6" fill="#22c55e" stroke="#ffffff" strokeWidth="2.5"/>
          <circle cx="408" cy="220" r="3.5" fill="#22c55e" opacity="0.75"/>

          {/* Eixo de Semanas */}
          <text x="65" y="246" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">Semana 1</text>
          <text x="175" y="246" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">Semana 2</text>
          <text x="285" y="246" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">Semana 3</text>
          <text x="395" y="246" fill="#64748b" fontSize="12" fontWeight="600" textAnchor="middle">Semana 4</text>
        </svg>
      </div>

      <Primary onClick={()=>go(32)}>Continuar →</Primary>
    </main>:null}
    {screen===33?<main key={screen} className="screen loading screen-in"><div className="loader" style={{'--fill':`${loader*3.6}deg`} as React.CSSProperties}><b>{loader}%</b></div><p>{loader===100?'¡Todo listo!':'Organizando tus respuestas…'}</p><ul><li className={loader>=24?'done':''}><Check/>Objetivo principal identificado</li><li className={loader>=67?'done':''}><Check/>Resumen organizado</li><li className={loader===100?'done':''}><Check/>Listo para conocer el programa</li></ul>{loader===100?<Primary onClick={()=>go(34)}>Continuar</Primary>:null}</main>:null}
    {screen===34?<main key={screen} className="screen gate screen-in"><div className="gate-icon">✉️</div><h1>¿Qué correo electrónico usarás para acceder al programa?</h1><p>Si decides comprar, asegúrate de usar el mismo correo en el checkout.</p><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Tu mejor correo" aria-label="Tu correo"/><Primary disabled={!emailOk} onClick={()=>{trackLeadCapture(email);setMarketing(true);go(36)}}>Continuar</Primary><span className="secure"><ShieldCheck/>Tus datos se quedan solo en esta vista previa.</span></main>:null}
    {screen===36?<main key={screen} className="screen gate screen-in"><div className="gate-icon">👋</div><h1>¿Cómo te llamamos?</h1><p>Usa solo tu primer nombre.</p><Input value={name} onChange={e=>setName(e.target.value.replace(/\s.*/,''))} placeholder="Tu primer nombre" aria-label="Tu primer nombre" required/><Primary disabled={!name.trim()} onClick={()=>{trackLeadCapture(email,name);go(37)}}>Continuar</Primary></main>:null}
    {screen===37?<main key={screen} className={`screen prize screen-in ${wheel==='won'?'winner':''}`}><div className="prize-kicker">RECOMPENSA DESBLOQUEADA</div><h1>{displayName}, tu plan está listo.</h1><p>Gira la ruleta para revelar la condición reservada para tu perfil.</p><div className={`wheel-stage ${wheel}`}><span className="wheel-pointer" ref={pointerRef} aria-hidden="true"/><div className="discount-wheel" ref={wheelRef} aria-label="Ruleta de descuento"><div className="wheel-labels"><b>10%</b><b>30%</b><b>20%</b><b>75%</b><b>15%</b><b>50%</b></div><span>+</span></div></div>{wheel==='won'?<><div className="won-card" aria-live="polite"><small>¡FELICIDADES, {displayName.toUpperCase()}!</small><b className="win-message">Ganaste el mayor descuento disponible</b><strong>75% OFF</strong></div><Primary onClick={()=>go(38)}>Usar mi descuento</Primary></>:<Primary disabled={wheel==='spinning'} onClick={spinWheel}>{wheel==='spinning'?'Ruleta girando…':'Girar la ruleta'}</Primary>}<small className="prize-note">Condición promocional aplicada una única vez en esta presentación.</small></main>:null}
    {screen===38?<main key={screen} className="pv2 screen-in">
      {/* ── Barra de urgencia sticky ── */}
      <div className="pv2-urgency">
        <p className="pv2-urgency-copy">Reserva activa para <strong>{displayName}</strong>. Oferta en cuenta regresiva.</p>
        <div className="pv2-urgency-badges">
          <span className="pv2-timer-pill"><Clock3 size={12}/>{String(Math.floor(offerSeconds/60)).padStart(2,'0')}:{String(offerSeconds%60).padStart(2,'0')}</span>
          <span className="pv2-slot-pill">4 lugares</span>
        </div>
      </div>

      {/* ── Banner de cupón ── */}
      <div className="pv2-promo">
        <p className="pv2-promo-line">🎉 ¡Felicidades, {displayName}! Tu descuento fue aplicado.</p>
        <p className="pv2-promo-sub">Cupón <strong>DESTRAVA75</strong> validado para esta sesión.</p>
      </div>

      {/* ── Hero ── */}
      <section className="pv2-hero">
        <h1 className="pv2-headline">Adquiere tu plan personal con la <em>rutina de 28 días</em> antes de que la oferta se agote.</h1>
        <p className="pv2-subhead">Prácticas guiadas de liberación de la fascia, movimientos suaves y relajación — 7 minutos al día, sin gimnasio y sin equipamiento.</p>
        <div className="pv2-stats">
          <div className="pv2-stat"><span className="pv2-stat-label">Tu Edad</span><span className="pv2-stat-value">{typeof answers.age==='string'?answers.age:'35–44'}</span></div>
          <div className="pv2-stat"><span className="pv2-stat-label">Sobrecarga</span><span className="pv2-stat-value">{score<63?'Moderada':'Elevada'}</span></div>
          <div className="pv2-stat"><span className="pv2-stat-label">Tu Meta</span><span className="pv2-stat-value">{goalLabel}</span></div>
        </div>
      </section>

      {/* ── Comparativo Antes/Después ── */}
      <section className="pv2-ba">
        <p className="pv2-ba-kicker">COMPARATIVO PERSONALIZADO DE TU PERFIL</p>
        <div className="pv2-ba-wrap">
          <img src="/comparativo-antes-depois.png" alt="Comparativo antes y después Destrava Leve"/>
          <span className="pv2-ba-tag pv2-ba-left">Actual</span>
          <span className="pv2-ba-tag pv2-ba-right">Meta</span>
          <span className="pv2-ba-badge pv2-ba-badge-l">Cuerpo pesado &amp; bloqueado</span>
          <span className="pv2-ba-badge pv2-ba-badge-r">Destrava Leve ✓</span>
        </div>
        <p className="pv2-ba-meta">Perfil ajustado con base en tu puntuación ({score}%) y objetivo.</p>
      </section>

      {/* ── Offer Card ── */}
      <section className="pv2-offer-section">
        <article className="pv2-offer-card">
          <div className="pv2-offer-top">
            <span className="pv2-offer-tag">Oferta oficial desbloqueada</span>
            <span className="pv2-sold-hour">+2,400 planes activados</span>
          </div>
          <div className="pv2-gallery">
            <div className="pv2-gallery-track" style={{ transform: `translateX(-${pv2GalleryIdx * 33.3333}%)` }}>
              <figure className="pv2-gallery-slide">
                <img src="/mockup-app-programa.png" alt="Aplicación Destrava Leve 28D" />
              </figure>
              <figure className="pv2-gallery-slide">
                <img src="/mockup-calendario-28d.png" alt="Calendario 28 Días Destrava Leve" />
              </figure>
              <figure className="pv2-gallery-slide">
                <img src="/mockup-guia-aceleracao.png" alt="Guía de Aceleración &amp; Drenaje Bono" />
              </figure>
            </div>
          </div>
          <div className="pv2-gallery-dots">
            <button className={`pv2-dot${pv2GalleryIdx===0?' active':''}`} onClick={()=>setPv2GalleryIdx(0)} aria-label="Slide 1"/>
            <button className={`pv2-dot${pv2GalleryIdx===1?' active':''}`} onClick={()=>setPv2GalleryIdx(1)} aria-label="Slide 2"/>
            <button className={`pv2-dot${pv2GalleryIdx===2?' active':''}`} onClick={()=>setPv2GalleryIdx(2)} aria-label="Slide 3"/>
          </div>

          <ul className="pv2-checklist">
            <li>La Aplicación Destrava Leve completa con la Rutina de 28 Días.</li>
            <li>Más de 28 clases guiadas en video (7 minutos al día, sin impacto).</li>
            <li>El Calendario de Seguimiento Diario para guiar tu evolución.</li>
            <li>La Guía de Aceleración &amp; Drenaje (Bono Exclusivo).</li>
          </ul>
          <div className="pv2-price-stack">
            <p className="pv2-price-old">Precio normal de mercado: USD 148</p>
            <p className="pv2-price-main"><strong>USD 37</strong><span>pago único</span></p>
            <p className="pv2-price-installments">O <strong>8 cuotas de USD 5.47</strong> con tarjeta</p>
            <p className="pv2-price-note">Sin recurrencia. Sin cobro mensual.</p>
          </div>
          <button className="pv2-cta" onClick={()=>{trackInitiateCheckout(37);setCheckout(true)}}>Quiero desbloquear mi plan ahora</button>
          <p className="pv2-secure-row"><ShieldCheck size={13}/>Checkout seguro SSL · Garantía de 30 días</p>
        </article>
      </section>

      {/* ── Módulos del Método ── */}
      <section className="pv2-section">
        <h2 className="pv2-section-title">El método que trabaja a favor de tu cuerpo</h2>
        <p className="pv2-section-sub">Cada etapa fue pensada para liberar lo que está bloqueado, sin sobrecarga y sin impacto articular.</p>
        <div className="pv2-modules">
          {([
            {img:'/pratica-fascia.jpg',alt:'Práctica de Liberación de la Fascia',icon:'〰️',title:'Liberación de la Fascia',desc:'Prácticas guiadas para soltar la rigidez tisular y aliviar las tensiones acumuladas en el cuerpo.'},
            {img:'/pratica-movimentos.jpg',alt:'Práctica de Movimientos Suaves',icon:'🧘‍♀️',title:'Movimientos Suaves',desc:'Secuencias de bajo impacto que caben en la rutina, sin gimnasio y sin equipamiento.'},
            {img:'/pratica-nervo-vago.jpg',alt:'Rituales de Relajación del Nervio Vago',icon:'🌙',title:'Relajación del Nervio Vago',desc:'Rituales cortos de desaceleración del sistema nervioso para cerrar el día con ligereza.'},
          ] as {img:string;alt:string;icon:string;title:string;desc:string}[]).map(m=>(
            <article className="pv2-module-card" key={m.title}>
              <div className="pv2-module-media"><img src={m.img} alt={m.alt}/></div>
              <div className="pv2-module-body"><h3>{m.icon} {m.title}</h3><p>{m.desc}</p></div>
            </article>
          ))}
        </div>
        <div className="pv2-included">
          <h3>Lo que incluye tu acceso</h3>
          <div className="pv2-included-grid">
            <div className="pv2-inc-item"><strong>28</strong><span>Prácticas Guiadas</span></div>
            <div className="pv2-inc-item"><strong>7 min</strong><span>Por Día</span></div>
            <div className="pv2-inc-item"><strong>100%</strong><span>En Casa</span></div>
          </div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="pv2-section">
        <h2 className="pv2-section-title">Personas reales. Historias reales.</h2>
        <p className="pv2-section-sub">Mujeres que buscaban alivio sin rutinas intensas ni gimnasio.</p>
        <div className="pv2-testimonials">
          {([
            {
              name: 'Valentina A., 42 años',
              avatar: '/depoimento-fernanda.webp',
              text: 'Después de 2 semanas sentí mi abdomen mucho menos inflamado. Las piernas ya no pesan al final del día. ¡Nunca pensé que 7 minutos harían tanta diferencia!'
            },
            {
              name: 'Camila C., 38 años',
              avatar: '/depoimento-renata.webp',
              text: 'El dolor lumbar que tenía todos los días al levantarme de la silla disminuyó mucho. La rutina es simple y cabe en el descanso del almuerzo.'
            },
            {
              name: 'Lucía M., 51 años',
              avatar: '/depoimento-patricia.webp',
              text: 'Compré sin expectativas y me sorprendí. Duermo mejor y me despierto menos tensa. Lo recomiendo para toda mujer mayor de 40.'
            },
          ] as {name:string;avatar:string;text:string}[]).map(t=>(
            <div className="pv2-testimonial-card" key={t.name}>
              <div className="pv2-testimonial-header">
                <img src={t.avatar} alt={`Foto de ${t.name}`} className="pv2-testimonial-avatar" />
                <div className="pv2-testimonial-author">
                  <strong>{t.name}</strong>
                  <div className="pv2-stars-row">
                    <span className="pv2-stars">⭐⭐⭐⭐⭐</span>
                    <span className="pv2-verified">✓ Alumna verificada</span>
                  </div>
                </div>
              </div>
              <p>&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* ── Garantía ── */}
        <div className="pv2-guarantee">
          <img className="pv2-guarantee-seal" src="/selo-garantia-30.png" alt="Sello de garantía de 30 días"/>
          <h3>Garantía incondicional de 30 días</h3>
          <p>Prueba el método en tu rutina durante 30 días. Si no sientes un progreso real con el uso correcto, recibes el 100% del valor de vuelta — sin preguntas, sin burocracia.</p>
        </div>

        {/* ── FAQ ── */}
        <div className="pv2-faq">
          <h2 className="pv2-section-title">Preguntas frecuentes</h2>
          {([
            ['¿Cuándo recibo mi acceso?','Justo después de la confirmación del pago, en el correo usado en el checkout.'],
            ['¿Necesita gimnasio o equipamiento?','No. El programa fue diseñado para casa, ejecutándose en el suelo o con una colchoneta.'],
            ['¿Es una suscripción?','No. USD 37 es un pago único, sin cobros mensuales.'],
            ['¿Tiene garantía?','Sí. 30 días incondicionales para solicitar reembolso total.'],
            ['¿Esto reemplaza la atención médica?','No. Es una propuesta de bienestar y no reemplaza la evaluación profesional.'],
          ] as [string,string][]).map(([q,a])=>(
            <article className="pv2-faq-item" key={q}><h4>{q}</h4><p>{a}</p></article>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="pv2-final-cta">
        <div className="pv2-price-stack">
          <p className="pv2-price-old">Precio normal: USD 148</p>
          <p className="pv2-price-main"><strong>USD 37</strong><span>pago único</span></p>
        </div>
        <button className="pv2-cta" onClick={()=>{trackInitiateCheckout(37);setCheckout(true)}}>Sí, quiero mi plan por USD 37</button>
      </section>

      {/* ── Footer ── */}
      <footer className="pv2-trust-footer">
        <p className="pv2-trust-line">Pago seguro SSL</p>
        <div className="pv2-trust-links">
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos de Uso</a>
          <a href="#">Política de Reembolso</a>
        </div>
        <p className="pv2-trust-copy">Destrava Leve 2026. Este sitio presenta contenido informativo y no reemplaza la evaluación médica individual.</p>
      </footer>
    </main>:null}
    {screen===37&&wheel==='won'?<ConfettiBurst anchor={wheelRef} reduced={!fullMotion}/>:null}
    {screen===38?<div className={`pv2-toast${toastShow?' pv2-toast-show':''}`} aria-live="polite" aria-atomic="true">
      <span className="pv2-toast-kicker">Compra reciente</span>
      <p><strong>{pvToastBuyers[toastIdx%pvToastBuyers.length].name}</strong> {pvToastBuyers[toastIdx%pvToastBuyers.length].message}</p>
    </div>:null}
    <Dialog open={checkout} onOpenChange={setCheckout}><DialogContent className="checkout-dialog"><DialogTitle>Tu plan está casi listo.</DialogTitle><DialogDescription>Esta vista previa contiene el embudo completo. El checkout de USD 37 será conectado en la próxima etapa; ningún cobro fue realizado.</DialogDescription><Primary onClick={()=>setCheckout(false)}>Volver a la oferta</Primary></DialogContent></Dialog>
  </div>;
}
