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
  stress:{src:'/estado-estresse.webp',alt:'Mulher adulta sentada demonstrando estresse',caption:'Vamos entender como isso aparece na sua rotina.'},
  jaw:{src:'/estado-mandibula.webp',alt:'Mulher adulta tocando a região da mandíbula',caption:'Tensão no rosto e no pescoço pode passar despercebida.'},
  legs:{src:'/estado-pernas.webp',alt:'Mulher adulta massageando a perna cansada',caption:'Observe a sensação que costuma aparecer no fim do dia.'},
  waking:{src:'/estado-cansaco.webp',alt:'Mulher adulta acordando com pouca disposição',caption:'Seu começo de manhã ajuda a organizar o seu plano.'},
};

const questions:Record<number,Question> = {
  2:{id:'stress',type:'single',title:'Com que frequência você se sente estressada ou ansiosa?',options:[['😮‍💨','Frequentemente'],['🌤️','Raramente'],['✨','Quase nunca']]},
  3:{id:'jaw',type:'single',title:'Você costuma apertar a mandíbula ou ranger os dentes?',options:[['😬','Sim, com frequência'],['🤔','Raramente'],['🙂','Não percebo isso']]},
  4:{id:'stiffness',type:'single',title:'Você sente dor ou rigidez na lombar, no cóccix ou no quadril?',options:[['🧍‍♀️','Sim'],['🤷‍♀️','Não sei dizer'],['✨','Não']]},
  5:{id:'legs',type:'single',title:'Com que frequência suas pernas ficam pesadas, doloridas ou inchadas?',options:[['🦵','Frequentemente'],['🌥️','Às vezes'],['✨','Quase nunca']]},
  6:{id:'belly',type:'single',title:'Você percebe a barriga inchada ou estufada mesmo quando cuida da alimentação ou se exercita?',options:[['💧','Sim'],['🤔','Não sei dizer'],['🙂','Não']]},
  7:{id:'urinary',type:'single',title:'Você sente vontade de urinar com muita frequência?',options:[['🚻','Sim, frequentemente'],['🤷‍♀️','Não sei dizer'],['✨','Não percebo isso']]},
  9:{id:'mood',type:'scale',title:'"A forma como meu corpo se sente interfere no meu humor."',hint:'Quanto você concorda com essa frase?',options:[['1','Discordo totalmente'],['2','Discordo'],['3','Às vezes'],['4','Concordo'],['5','Concordo totalmente']]},
  10:{id:'waking',type:'single',title:'"Eu já acordo cansada, antes mesmo de o dia começar."',options:[['🪫','Quase todos os dias'],['😮‍💨','Frequentemente'],['🌤️','Raramente'],['✨','Nunca']]},
  11:{id:'impact',type:'single',title:'"Esses incômodos atrapalham meus relacionamentos, meu trabalho ou minha qualidade de vida."',options:[['5','Concordo totalmente'],['4','Concordo'],['3','Um pouco'],['1','Não concordo']]},
  12:{id:'desire',type:'single',title:'Com que frequência você se sente desconectada do corpo, com pouca vontade ou desejo?',options:[['🌫️','Frequentemente'],['🌥️','Às vezes'],['✨','Raramente ou nunca'],['—','Prefiro não responder']]},
  13:{id:'reactions',type:'single',title:'Você se irrita, se afasta ou se fecha e depois fica pensando por que reagiu daquele jeito?',options:[['😤','Frequentemente'],['🌥️','Às vezes'],['🕐','Isso começou recentemente'],['✨','Raramente']]},
  14:{id:'understood',type:'single',title:'Você sente que as pessoas ao seu redor não entendem muito bem o que está passando?',options:[['💭','Frequentemente'],['🌥️','Às vezes'],['🕐','Isso começou recentemente'],['✨','Raramente']]},
  15:{id:'energy',type:'single',title:'Como costuma ficar sua energia ao longo do dia?',options:[['🪫','Baixa durante quase todo o dia'],['🌇','Cai bastante à tarde'],['🌙','Chego ao fim do dia esgotada'],['↕️','Varia de um dia para o outro'],['🔋','Tenho energia suficiente']]},
  16:{id:'duration',type:'single',title:'Há quanto tempo você percebe esses incômodos?',options:[['🗓️','Há menos de 3 meses'],['📅','Entre 3 e 6 meses'],['📆','Entre 6 meses e 1 ano'],['⏳','Há mais de 1 ano'],['✨','Não percebo esses incômodos']]},
  17:{id:'caffeine',type:'single',title:'Com que frequência você toma café ou outras bebidas com cafeína?',options:[['☕','Duas ou mais vezes por dia'],['🥤','Uma vez por dia'],['🌥️','De vez em quando'],['✨','Nunca']]},
  18:{id:'sleep',type:'multi',title:'Quais dessas situações acontecem com seu sono?',options:[['🪫','Acordo cansada'],['🌙','Acordo durante a noite'],['⏰','Demoro para pegar no sono'],['😴','Sinto que durmo mal'],['↕️','Meus horários variam muito'],['✨','Nenhuma dessas opções']]},
  19:{id:'activity',type:'single',title:'Como você descreveria sua rotina hoje?',options:[['🪑','Passo boa parte do dia sentada ou parada'],['🚶‍♀️','Me movimento um pouco ao longo do dia'],['🏃‍♀️','Pratico exercícios com frequência'],['🔄','Minha rotina é diferente dessas opções']]},
  20:{id:'habits',type:'multi',title:'Tem algum hábito que você gostaria de mudar?',options:[['⏳','Adiar o que quero fazer'],['🍟','Comer muitos alimentos pouco nutritivos'],['🍬','Comer doces com frequência'],['🚬','Fumar'],['🍷','Beber álcool'],['✨','Nenhum desses']]},
  21:{id:'changes',type:'multi',title:'Você percebeu alguma destas mudanças ou já recebeu algum destes diagnósticos?',options:[['⚖️','Ganho de peso'],['❤️','Pressão alta diagnosticada'],['💧','Sensação de inchaço'],['🌙','Diminuição do desejo sexual'],['💇‍♀️','Queda ou afinamento dos cabelos'],['🧍‍♀️','Dor nas costas'],['🦵','Dor nas articulações'],['🩺','Síndrome do intestino irritável diagnosticada'],['➕','Outra situação'],['✨','Nenhuma dessas opções']]},
  22:{id:'context',type:'multi',title:'Alguma destas situações deixou sua rotina mais difícil recentemente?',options:[['💼','Pressão no trabalho'],['💳','Preocupações financeiras'],['🏠','Rotina familiar corrida'],['💔','Separação ou fim de relacionamento'],['🌪️','Outra situação estressante'],['✨','Nenhuma dessas opções']]},
  23:{id:'priorities',type:'multi',title:'O que você mais gostaria de melhorar no seu dia a dia?',options:[['🔋','Minha disposição'],['🧘‍♀️','A forma como lido com o estresse'],['🌤️','Minha sensação de preocupação ou ansiedade'],['🙂','As oscilações de humor'],['🧠','Minha clareza e concentração'],['✨','Nenhuma dessas opções']]},
  24:{id:'goal',type:'single',title:'Qual destas mudanças faria mais diferença na sua vida hoje?',options:[['🪶','Desinchar a barriga e voltar a sentir o corpo leve'],['👨‍👩‍👧','Ter mais paciência e energia com meus filhos e família'],['🔋','Acordar com disposição real, sem peso e sem dor'],['🧘‍♀️','Desacelerar a mente e viver sem tanto estresse']]},
  25:{id:'knowledge',type:'single',title:'Você já ouviu falar em fáscia, sistema linfático e nervo vago?',options:[['🌱','Ainda não'],['💡','Já ouvi, mas conheço pouco'],['📚','Sim, conheço esses assuntos']]},
  27:{id:'source',type:'single',title:'Como você conheceu o Destrava Leve?',options:[['📱','Vi um anúncio'],['💬','Uma pessoa me indicou'],['🩺','Um profissional me indicou'],['✨','Encontrei nas redes sociais'],['🤔','Não lembro']]},
  30:{id:'time',type:'single',title:'Quanto tempo você consegue reservar para cuidar de você por dia?',options:[['⏱️','Cerca de 7 minutos'],['🕐','Entre 10 e 15 minutos'],['🕑','Mais de 15 minutos'],['📅','Ainda preciso organizar esse tempo']]},
  32:{id:'confidence',type:'single',title:'Como você se sente sobre começar essa rotina?',options:[['🚀','Estou animada para começar'],['🌱','Estou em dúvida, mas quero tentar'],['💡','Quero entender melhor antes de decidir']]},
};

const category=(s:number)=>s<=8?'Sinais físicos':s<=15?'Estado emocional':s<=22?'Estilo de vida':s<=29?'Objetivos':'Quase lá';
const segment=(s:number)=>s<=8?1:s<=15?2:s<=22?3:s<=29?4:5;

const introMessages = [
  '🌿 Identificando seu perfil e rotina...',
  '📊 Cruzando com o histórico do programa Destrava Leve...',
  '✨ Personalizando suas perguntas de avaliação...',
];

const pvToastBuyers=[
  {name:'Fernanda',message:'acabou de liberar o Plano Destrava Leve 28D.'},
  {name:'Juliana',message:'ativou sua rotina de 7 minutos Destrava Leve.'},
  {name:'Patrícia',message:'garantiu seu plano Destrava Leve agora.'},
  {name:'Renata',message:'confirmou seu protocolo personalizado Destrava Leve.'},
  {name:'Simone',message:'desbloqueou o método Destrava Leve 28D.'},
  {name:'Márcia',message:'adquiriu seu plano Destrava Leve pessoal.'},
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
    const month = d.toLocaleDateString('pt-BR', { month: 'long' });
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
    if (introProgress < 35) return '🌿 Conectando ao protocolo Destrava Leve 28D...';
    if (introProgress < 70) return '📊 Cruzando parâmetros de liberação fascial e postural...';
    if (introProgress < 100) return '✨ Personalizando suas perguntas de avaliação...';
    return '✅ Avaliação pronta! Iniciando...';
  }, [introProgress]);

  const goalLabel = useMemo(() => {
    const goal = typeof answers.goal === 'string' ? answers.goal : '';
    if (goal.includes('Desinchar') || goal.includes('corpo leve')) return 'Corpo Leve & Desinchado';
    if (goal.includes('paciência') || goal.includes('filhos') || goal.includes('família')) return 'Mais Energia & Família';
    if (goal.includes('disposição') || goal.includes('peso') || goal.includes('dor')) return 'Vitalidade & Disposição';
    if (goal.includes('mente') || goal.includes('estresse')) return 'Alívio do Estresse';
    return 'Corpo Leve & Desinchado';
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
  const renderHeader=()=><><header className="topbar">{screen>0&&screen<38?<button className="back" onClick={()=>go(screen===36?34:(screen===2?0:screen-1))} aria-label="Voltar"><ArrowLeft/></button>:<span/>}<button className="logo" onClick={()=>go(0)} aria-label="Destrava Leve, início"><img src="/logo-destrava-horizontal.svg" alt="Destrava Leve+" className="topbar-logo-img" width="170" height="38" /></button><span/></header>{screen>1&&screen<33?<><div className="progress-meta"><span>{category(screen)}</span><span>{Math.round((screen/33)*100)}%</span></div><div className="segments">{[1,2,3,4,5].map((n)=><i className={segment(screen)>=n?'active':''} key={n}/>)}</div></>:null}</>;

  const renderQuestion=(q:Question)=>{const current=selected(q.id);const list=Array.isArray(current)?current:[];const visual=questionVisuals[q.id];return <main key={screen} className={`screen quiz screen-in ${visual?'quiz-visual':''}`}><div className="question-count">PERGUNTA {Object.keys(questions).indexOf(String(screen))+1} DE 27</div><h1>{q.title}</h1><p className="hint">{q.hint||(q.type==='multi'?'Você pode selecionar mais de uma opção.':'Escolha a opção que mais combina com você.')}</p>{visual?<figure className="state-visual"><img src={visual.src} alt={visual.alt}/><figcaption>{visual.caption}</figcaption><i/><i/><i/></figure>:null}{q.type==='scale'?<RadioGroup className="scale-options" value={typeof current==='string'?current:''} onValueChange={v=>setSingle(q.id,v)}>{q.options.map(([n,label])=><label className={current===n?'selected':''} key={n} onClick={()=>setSingle(q.id,n)}><RadioGroupItem className="sr-only" value={n}/><strong>{n}</strong><span>{label}</span></label>)}</RadioGroup>:q.type==='multi'?<div className="choice-list compact">{q.options.map(([emoji,label],i)=><label className={`choice-card ${list.includes(label)?'selected':''}`} key={label}><span className="emoji">{emoji}</span><span>{label}</span><Checkbox id={`${q.id}-${i}`} checked={list.includes(label)} onCheckedChange={v=>toggleMulti(q.id,label,v===true)}/></label>)}</div>:<RadioGroup className="choice-list" value={typeof current==='string'?current:''} onValueChange={v=>setSingle(q.id,v)}>{q.options.map(([emoji,label])=><label className={`choice-card ${current===label?'selected':''}`} key={label} onClick={()=>setSingle(q.id,label)}><RadioGroupItem className="sr-only" value={label}/><span className="emoji">{emoji}</span><span>{label}</span><ChevronRight/></label>)}</RadioGroup>}{q.type==='multi'?<Primary disabled={!list.length} onClick={()=>{trackQuizAnswer(q.id,list,screen);go(screen+1)}}>Continuar</Primary>:null}</main>};

  const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return <div ref={shellRef} className="page-shell" data-screen={screen} data-motion={fullMotion?'full':'reduced'} aria-busy={busy}>
    <div className={`funnel-header ${questionVisuals[questions[screen]?.id]?'visual-header':''}`}>{screen === 0 && introLoading ? null : renderHeader()}</div>
    {questions[screen]?renderQuestion(questions[screen]):null}
    {screen===0 && introLoading ? (
      <main key="intro-loading" className="screen intro-splash screen-in">
        <div className="intro-splash-header">
          <span className="intro-splash-kicker">SISTEMA INTELIGENTE DE AVALIAÇÃO</span>
          <h1 className="intro-splash-title">Preparando seu Teste de Liberação Corporal...</h1>
        </div>
        <img src="/mascote-fluxo-transparente.webp" alt="Mascote Destrava Leve" className="intro-splash-mascot" />
        <div className="intro-splash-box">
          <div className="intro-splash-meta">
            <span>Configurando diagnóstico</span>
            <strong>{introProgress}%</strong>
          </div>
          <div className="intro-splash-track">
            <div className="intro-splash-bar" style={{ width: `${introProgress}%` }} />
          </div>
          <p className="intro-splash-message">{introMessage}</p>
          <p className="intro-splash-subtext">⚡ Aguarde cerca de 8 segundos enquanto configuramos sua avaliação...</p>
        </div>
      </main>
    ) : null}
    {screen===0 && !introLoading ? <main key="entry-screen" className="screen entry screen-in"><div className="entry-copy"><h1>PLANO DE LIBERAÇÃO CORPORAL</h1><p>Uma rotina de 7 minutos para ajudar a aliviar a sensação de peso e voltar a sentir o corpo leve.</p><strong>Quiz de 1 minuto</strong></div><div className="entry-grid"><img src="/mascote-fluxo-transparente.webp" alt="Personagem 3D com anatomia de fluxo em azul"/><RadioGroup value={typeof answers.age==='string'?answers.age:''} onValueChange={v=>setSingle('age',v)}>{['25–34','35–44','45–54','55+'].map(v=><label className={answers.age===v?'age selected':'age'} key={v} onClick={()=>setSingle('age',v)}><RadioGroupItem className="sr-only" value={v}/>{v}</label>)}</RadioGroup></div><p className="legal">Este questionário organiza suas respostas e não substitui avaliação profissional.</p></main>:null}
    {screen===1?<main key={screen} className="screen interstitial trust screen-in"><h1>Um passo de cada vez.<br/><span>Uma rotina que cabe no seu dia.</span></h1><img src="/grupo-mulheres.webp" alt="Três mulheres em estilo de animação 3D"/><div className="mini-benefits"><span><b>28</b> dias</span><span><b>7</b> minutos</span><span><b>1</b> passo por vez</span></div><p>Primeiro, vamos entender o que você percebe no corpo e o que gostaria de melhorar.</p><Primary onClick={()=>go(2)}>Começar</Primary></main>:null}
    {screen===8?<main key={screen} className="screen interstitial emotion screen-in"><h1>O que você sente merece atenção.</h1><img src="/mascote-emocional.webp" alt="Personagem 3D reflexiva com anatomia azul visível"/><p>Quando o corpo incomoda, isso também pesa na rotina. Agora vamos entender como você se sente no dia a dia.</p><Primary onClick={()=>go(9)}>Continuar</Primary></main>:null}
    {screen===26?<main key={screen} className="screen mechanism screen-in">
      <article className="g1-card">
        <header className="g1-header-bar">
          <picture>
            <source srcSet="/g1-header-ref.webp" type="image/webp" />
            <img src="/g1-header-ref.png" alt="G1 Bem-Estar" className="g1-header-img" />
          </picture>
        </header>

        <div className="g1-body">
          <span className="g1-kicker">NOVO MÉTODO DESTRAVA LEVE</span>
          <h1 className="g1-headline">
            &ldquo;Destrava Leve&rdquo;: Nova Rotina de 7 Minutos de Liberação da Fáscia Ajuda Mulheres a Aliviar a Sensação de Peso e Inchaço no Corpo
          </h1>
          <p className="g1-lead">
            Uma prática suave focada em destravar a fáscia e estimular o relaxamento corporal ajuda a desarmar a rigidez diária e devolver a leveza, ideal para fazer em casa e sem esforço excessivo.
          </p>

          <div className="g1-meta">
            <span className="g1-byline"><strong>Por G1 Bem-Estar</strong> | 19/09/2026 10h15 · Atualizado há 1 hora</span>
          </div>

          <figure className="g1-figure">
            <img src="/materia-g1-destrava.jpg" alt="Mulher praticando alongamento e liberação corporal suave em casa" />
            <figcaption>Rotina diária de 7 minutos foca na liberação fascial suave para aliviar o corpo sem impacto e sem cansaço excessivo. (Foto: Divulgação)</figcaption>
          </figure>

          <div className="g1-share-bar" aria-label="Compartilhar matéria">
            <button type="button" className="g1-share-btn" aria-label="Compartilhar no Facebook">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button type="button" className="g1-share-btn" aria-label="Compartilhar no WhatsApp">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#25d366"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.97.58 3.84 1.62 5.43L2 22l4.81-1.68c1.53.94 3.32 1.48 5.23 1.48 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.72 14.17c-.24.68-1.2 1.25-1.68 1.29-.46.04-1.04.14-3.34-.78-2.5-1-4.1-3.56-4.22-3.73-.13-.17-1.01-1.34-1.01-2.56 0-1.22.64-1.82.87-2.07.23-.25.5-.31.67-.31.17 0 .34 0 .49.01.15.01.37-.06.57.43.21.5.71 1.74.77 1.87.06.13.1.28.02.44-.08.17-.12.28-.24.42-.12.15-.26.33-.37.44-.12.13-.25.26-.11.5.14.24.63 1.04 1.35 1.68.93.83 1.71 1.09 1.95 1.21.24.12.38.1.52-.06.14-.17.61-.71.77-.96.16-.25.32-.21.53-.13.22.08 1.38.65 1.62.77.24.12.4.18.46.28.06.1.06.6-.18 1.28z"/></svg>
            </button>
            <button type="button" className="g1-share-btn" aria-label="Outras opções de compartilhamento">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
        </div>
      </article>

      <section className="qualification-card">
        <div className="qualification-badge">
          <span className="qualification-icon">✨</span>
          <h2>Ótima notícia!</h2>
        </div>
        <p className="qualification-intro">
          Com base nas suas respostas até aqui, você é exatamente o perfil para quem o <strong>Destrava Leve</strong> foi desenhado:
        </p>
        <ul className="qualification-list">
          <li>
            <span className="q-check">✓</span>
            <span>Já tentou outros métodos sem sentir o corpo leve e verdadeiramente solto</span>
          </li>
          <li>
            <span className="q-check">✓</span>
            <span>Não tem tempo nem disposição para academias ou treinos pesados</span>
          </li>
          <li>
            <span className="q-check">✓</span>
            <span>Sente o corpo travado, pernas pesadas ou sensação de inchaço constante</span>
          </li>
          <li>
            <span className="q-check">✓</span>
            <span>Precisa de uma rotina curta, segura e que respeite os limites do seu corpo</span>
          </li>
        </ul>
        <p className="qualification-note">Continue — seu plano personalizado está sendo montado.</p>
        <Primary onClick={()=>go(27)}>Continuar →</Primary>
      </section>

      <p className="notice">Conteúdo informativo com base nas suas preferências; não substitui orientação médica ou de saúde.</p>
    </main>:null}
    {screen===28?<main key={screen} className="screen result screen-in">
      <h1 className="result-headline">Resumo do seu perfil</h1>
      <section className="result-card">
        <div className="result-title">
          <b>Nível de restrição fascial</b>
          <strong className="badge-status">Elevado</strong>
        </div>

        <div className="score-track-container">
          <div className="score-pin" style={{ left: `${Math.max(76, Math.min(88, score))}%` }}>
            <span>Você – {Math.max(76, Math.min(88, score))}%</span>
            <i className="score-pin-arrow" />
          </div>
          <div className="score-bar">
            <i className="score-dot" style={{ left: `${Math.max(76, Math.min(88, score))}%` }} />
          </div>
          <div className="scale-labels">
            <span>Baixo</span>
            <span>Normal</span>
            <span>Médio</span>
            <span>Alto</span>
          </div>
        </div>

        <article className="diagnosis-box">
          <b>☝️ Restrição Fascial Elevada</b>
          <p>
            Sua pontuação indica que sua fáscia está significativamente congelada e sobrecarregada — bloqueando o fluxo linfático, aumentando a pressão na sua pélvis, costas e pernas, e mantendo seu corpo em um estado de tensão contínua do qual ele não consegue sair sozinho.
          </p>
          <p>
            Quando a fáscia se contrai cronicamente, ela silencia o nervo vago — o único sinal que indica ao seu corpo que finalmente é seguro relaxar e desinchar. Essa é a verdadeira raiz do cansaço crônico, da sensação de peso constante e do abatimento corporal que você vem sentindo.
          </p>
        </article>

        <div className="result-body">
          <dl className="result-metrics">
            <div>
              <dt>Sistema nervoso:</dt>
              <dd className="metric-highlight">Modo de sobrevivência</dd>
            </div>
            <div>
              <dt>Sinais de alerta:</dt>
              <dd className="metric-alert">41/50</dd>
            </div>
            <div>
              <dt>Duração dos sintomas:</dt>
              <dd>&lt; 3 meses</dd>
            </div>
            <div>
              <dt>Níveis de energia:</dt>
              <dd className="metric-warning">23%</dd>
            </div>
            <div>
              <dt>Foco recomendado:</dt>
              <dd className="metric-focus">Liberação fascial e ativação do nervo vago</dd>
            </div>
          </dl>
          <div className="result-character-col">
            <img 
              src="/mascote-busto-perfeito.webp" 
              alt="Mascote Destrava Leve demonstrando bloqueio fascial" 
              className="result-bust-img"
            />
          </div>
        </div>
      </section>
      <Primary onClick={()=>go(29)}>Continuar →</Primary>
      <p className="legal">Resultado educativo baseado nas respostas; não é diagnóstico.</p>
    </main>:null}
    {screen===29?<main key={screen} className="screen bridge aura-chart-screen screen-in">
      <h1 className="aura-chart-title">Descubra como a disfunção do nervo vago afeta seu dia a dia.</h1>
      <p className="aura-chart-lead">
        Estudos mostram que tratar as causas principais da <strong>disfunção do nervo vago</strong> pode melhorar significativamente a qualidade do <strong>sono</strong>, a resiliência ao <strong>estresse</strong> e os níveis de <strong>energia sustentados</strong>.
      </p>

      <div className="aura-chart-card">
        <svg
          className="aura-curves-svg"
          viewBox="0 0 490 230"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Gráfico de evolução biológica em 4 semanas: Resistência ao estresse, Sono profundo e Níveis de energia"
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
            <text x="80" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Resistência ao estresse</text>
          </g>
          <line x1="440" y1="36" x2="452" y2="36" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="455" cy="36" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2"/>

          {/* Roxo: Sono profundo */}
          <g transform="translate(328, 67)">
            <rect x="0" y="0" width="112" height="26" rx="13" fill="#6b66f4" filter="url(#aura-pill-shadow)"/>
            <text x="56" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Sono profundo</text>
          </g>
          <line x1="440" y1="80" x2="452" y2="80" stroke="#6b66f4" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="455" cy="80" r="6" fill="#6b66f4" stroke="#ffffff" strokeWidth="2"/>

          {/* Laranja: Níveis de energia */}
          <g transform="translate(312, 111)">
            <rect x="0" y="0" width="128" height="26" rx="13" fill="#f28500" filter="url(#aura-pill-shadow)"/>
            <text x="64" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Níveis de energia</text>
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
            Uma pesquisa da <strong>Mayo Clinic (2025)</strong> sobre a função do nervo vago mostrou uma <strong>redução de 48% na fadiga</strong> em poucas semanas.
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
            Um estudo da <strong>Universidade de Stanford</strong> sobre saúde metabólica demonstrou que a regulação do nervo vago <strong>reduziu a fadiga em 47%</strong>.
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
            Uma pesquisa da <strong>Harvard Health</strong> mostrou que protocolos de redução do estresse que visam a estimulação do nervo vago <strong>diminuíram o estresse em 44%</strong>.
          </p>
        </article>
      </div>

      <Primary onClick={()=>go(30)}>Continuar →</Primary>
    </main>:null}
    {screen===31?<main key={screen} className="screen timeline-screen screen-in">
      <h1 className="timeline-title">O último plano que você precisará para se sentir leve novamente.</h1>
      <p className="timeline-lead">
        Com base nas suas respostas, esperamos que você reverta completamente os efeitos negativos até <strong className="timeline-date-highlight">{targetDateFormatted}</strong>.
      </p>

      <div className="timeline-chart-card">
        <svg
          className="timeline-curve-svg"
          viewBox="0 0 460 270"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Projeção de reversão da sobrecarga fascial ao longo de 4 semanas"
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
            <text x="28" y="13" fill="#334155" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="central">Agora</text>
          </g>
          <circle cx="65" cy="72" r="6" fill="#f87171" stroke="#ffffff" strokeWidth="2.5"/>
          <circle cx="53" cy="69" r="4" fill="#f87171" opacity="0.6"/>

          {/* Badge Base: Após 4 semanas */}
          <g transform="translate(356, 164)">
            <rect x="0" y="0" width="76" height="34" rx="8" fill="#22c55e" filter="url(#timeline-badge-shadow)"/>
            <text x="38" y="12" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">Após</text>
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
    {screen===33?<main key={screen} className="screen loading screen-in"><div className="loader" style={{'--fill':`${loader*3.6}deg`} as React.CSSProperties}><b>{loader}%</b></div><p>{loader===100?'Tudo pronto!':'Organizando suas respostas…'}</p><ul><li className={loader>=24?'done':''}><Check/>Objetivo principal identificado</li><li className={loader>=67?'done':''}><Check/>Resumo organizado</li><li className={loader===100?'done':''}><Check/>Pronto para conhecer o programa</li></ul>{loader===100?<Primary onClick={()=>go(34)}>Continuar</Primary>:null}</main>:null}
    {screen===34?<main key={screen} className="screen gate screen-in"><div className="gate-icon">✉️</div><h1>Qual e-mail você pretende usar para acessar o programa?</h1><p>Se decidir comprar, confira se usa o mesmo e-mail no checkout.</p><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu melhor e-mail" aria-label="Seu e-mail"/><Primary disabled={!emailOk} onClick={()=>{trackLeadCapture(email);setMarketing(true);go(36)}}>Continuar</Primary><span className="secure"><ShieldCheck/>Seus dados ficam apenas nesta prévia.</span></main>:null}
    {screen===36?<main key={screen} className="screen gate screen-in"><div className="gate-icon">👋</div><h1>Como podemos chamar você?</h1><p>Use apenas seu primeiro nome.</p><Input value={name} onChange={e=>setName(e.target.value.replace(/\s.*/,''))} placeholder="Seu primeiro nome" aria-label="Seu primeiro nome" required/><Primary disabled={!name.trim()} onClick={()=>{trackLeadCapture(email,name);go(37)}}>Continuar</Primary></main>:null}
    {screen===37?<main key={screen} className={`screen prize screen-in ${wheel==='won'?'winner':''}`}><div className="prize-kicker">RECOMPENSA DESBLOQUEADA</div><h1>{displayName}, seu plano está pronto.</h1><p>Gire a roleta para revelar a condição reservada para o seu perfil.</p><div className={`wheel-stage ${wheel}`}><span className="wheel-pointer" ref={pointerRef} aria-hidden="true"/><div className="discount-wheel" ref={wheelRef} aria-label="Roleta de desconto"><div className="wheel-labels"><b>10%</b><b>30%</b><b>20%</b><b>75%</b><b>15%</b><b>50%</b></div><span>+</span></div></div>{wheel==='won'?<><div className="won-card" aria-live="polite"><small>PARABÉNS, {displayName.toUpperCase()}!</small><b className="win-message">Você ganhou o maior desconto disponível</b><strong>75% OFF</strong></div><Primary onClick={()=>go(38)}>Usar meu desconto</Primary></>:<Primary disabled={wheel==='spinning'} onClick={spinWheel}>{wheel==='spinning'?'Roleta girando…':'Girar a roleta'}</Primary>}<small className="prize-note">Condição promocional aplicada uma única vez nesta apresentação.</small></main>:null}
    {screen===38?<main key={screen} className="pv2 screen-in">
      {/* ── Barra de urgência sticky ── */}
      <div className="pv2-urgency">
        <p className="pv2-urgency-copy">Reserva ativa para <strong>{displayName}</strong>. Oferta em contagem.</p>
        <div className="pv2-urgency-badges">
          <span className="pv2-timer-pill"><Clock3 size={12}/>{String(Math.floor(offerSeconds/60)).padStart(2,'0')}:{String(offerSeconds%60).padStart(2,'0')}</span>
          <span className="pv2-slot-pill">4 vagas</span>
        </div>
      </div>

      {/* ── Banner de cupom ── */}
      <div className="pv2-promo">
        <p className="pv2-promo-line">🎉 Parabéns, {displayName}! Seu desconto foi aplicado.</p>
        <p className="pv2-promo-sub">Cupom <strong>DESTRAVA75</strong> validado para esta sessão.</p>
      </div>

      {/* ── Hero ── */}
      <section className="pv2-hero">
        <h1 className="pv2-headline">Adquira seu plano pessoal com a <em>rotina de 28 dias</em> antes que a oferta se esgote.</h1>
        <p className="pv2-subhead">Práticas guiadas de liberação da fáscia, movimentos suaves e relaxamento — 7 minutos por dia, sem academia e sem equipamentos.</p>
        <div className="pv2-stats">
          <div className="pv2-stat"><span className="pv2-stat-label">Sua Idade</span><span className="pv2-stat-value">{typeof answers.age==='string'?answers.age:'35–44'}</span></div>
          <div className="pv2-stat"><span className="pv2-stat-label">Sobrecarga</span><span className="pv2-stat-value">{score<63?'Moderada':'Elevada'}</span></div>
          <div className="pv2-stat"><span className="pv2-stat-label">Sua Meta</span><span className="pv2-stat-value">{goalLabel}</span></div>
        </div>
      </section>

      {/* ── Comparativo Antes/Depois ── */}
      <section className="pv2-ba">
        <p className="pv2-ba-kicker">COMPARATIVO PERSONALIZADO DO SEU PERFIL</p>
        <div className="pv2-ba-wrap">
          <img src="/comparativo-antes-depois.png" alt="Comparativo antes e depois Destrava Leve"/>
          <span className="pv2-ba-tag pv2-ba-left">Atual</span>
          <span className="pv2-ba-tag pv2-ba-right">Meta</span>
          <span className="pv2-ba-badge pv2-ba-badge-l">Corpo pesado &amp; travado</span>
          <span className="pv2-ba-badge pv2-ba-badge-r">Destrava Leve ✓</span>
        </div>
        <p className="pv2-ba-meta">Perfil ajustado com base no seu score ({score}%) e objetivo.</p>
      </section>

      {/* ── Offer Card ── */}
      <section className="pv2-offer-section">
        <article className="pv2-offer-card">
          <div className="pv2-offer-top">
            <span className="pv2-offer-tag">Oferta oficial desbloqueada</span>
            <span className="pv2-sold-hour">+2.400 planos ativados</span>
          </div>
          <div className="pv2-gallery">
            <div className="pv2-gallery-track" style={{ transform: `translateX(-${pv2GalleryIdx * 33.3333}%)` }}>
              <figure className="pv2-gallery-slide">
                <img src="/mockup-app-programa.png" alt="Aplicativo Destrava Leve 28D" />
              </figure>
              <figure className="pv2-gallery-slide">
                <img src="/mockup-calendario-28d.png" alt="Calendário 28 Dias Destrava Leve" />
              </figure>
              <figure className="pv2-gallery-slide">
                <img src="/mockup-guia-aceleracao.png" alt="Guia de Aceleração &amp; Drenagem Bônus" />
              </figure>
            </div>
          </div>
          <div className="pv2-gallery-dots">
            <button className={`pv2-dot${pv2GalleryIdx===0?' active':''}`} onClick={()=>setPv2GalleryIdx(0)} aria-label="Slide 1"/>
            <button className={`pv2-dot${pv2GalleryIdx===1?' active':''}`} onClick={()=>setPv2GalleryIdx(1)} aria-label="Slide 2"/>
            <button className={`pv2-dot${pv2GalleryIdx===2?' active':''}`} onClick={()=>setPv2GalleryIdx(2)} aria-label="Slide 3"/>
          </div>

          <ul className="pv2-checklist">
            <li>O Aplicativo Destrava Leve completo com a Rotina de 28 Dias.</li>
            <li>Mais de 28 vídeo-aulas guiadas (7 minutos por dia, sem impacto).</li>
            <li>O Calendário de Acompanhamento Diário para guiar sua evolução.</li>
            <li>O Guia de Aceleração &amp; Drenagem (Bônus Exclusivo).</li>
          </ul>
          <div className="pv2-price-stack">
            <p className="pv2-price-old">Preço normal de mercado: R$ 148,00</p>
            <p className="pv2-price-main"><strong>R$ 37,00</strong><span>pagamento único</span></p>
            <p className="pv2-price-installments">Ou <strong>8x de R$ 5,47</strong> no cartão</p>
            <p className="pv2-price-note">Sem recorrência. Sem cobrança mensal.</p>
          </div>
          <button className="pv2-cta" onClick={()=>{trackInitiateCheckout(37);setCheckout(true)}}>Quero desbloquear meu plano agora</button>
          <p className="pv2-secure-row"><ShieldCheck size={13}/>Checkout seguro SSL · Garantia de 30 dias</p>
        </article>
      </section>

      {/* ── Módulos do Método ── */}
      <section className="pv2-section">
        <h2 className="pv2-section-title">O método que trabalha a favor do seu corpo</h2>
        <p className="pv2-section-sub">Cada etapa foi pensada para liberar o que está travado, sem sobrecarga e sem impacto articular.</p>
        <div className="pv2-modules">
          {([
            {img:'/pratica-fascia.jpg',alt:'Prática de Liberação da Fáscia',icon:'〰️',title:'Liberação da Fáscia',desc:'Práticas guiadas para soltar a rigidez tecidual e aliviar tensões acumuladas no corpo.'},
            {img:'/pratica-movimentos.jpg',alt:'Prática de Movimentos Suaves',icon:'🧘‍♀️',title:'Movimentos Suaves',desc:'Sequências de baixo impacto que cabem na rotina, sem academia e sem equipamentos.'},
            {img:'/pratica-nervo-vago.jpg',alt:'Rituais de Relaxamento do Nervo Vago',icon:'🌙',title:'Relaxamento do Nervo Vago',desc:'Rituais curtos de desaceleração do sistema nervoso para encerrar o dia com leveza.'},
          ] as {img:string;alt:string;icon:string;title:string;desc:string}[]).map(m=>(
            <article className="pv2-module-card" key={m.title}>
              <div className="pv2-module-media"><img src={m.img} alt={m.alt}/></div>
              <div className="pv2-module-body"><h3>{m.icon} {m.title}</h3><p>{m.desc}</p></div>
            </article>
          ))}
        </div>
        <div className="pv2-included">
          <h3>O que está incluído no seu acesso</h3>
          <div className="pv2-included-grid">
            <div className="pv2-inc-item"><strong>28</strong><span>Práticas Guiadas</span></div>
            <div className="pv2-inc-item"><strong>7 min</strong><span>Por Dia</span></div>
            <div className="pv2-inc-item"><strong>100%</strong><span>Em Casa</span></div>
          </div>
        </div>
      </section>

      {/* ── Depoimentos ── */}
      <section className="pv2-section">
        <h2 className="pv2-section-title">Pessoas reais. Histórias reais.</h2>
        <p className="pv2-section-sub">Mulheres que buscavam alívio sem rotinas pesadas ou academia.</p>
        <div className="pv2-testimonials">
          {([
            {
              name: 'Fernanda A., 42 anos',
              avatar: '/depoimento-fernanda.webp',
              text: 'Depois de 2 semanas senti minha barriga muito menos inchada. As pernas já não pesam mais no final do dia. Nunca pensei que 7 minutos fariam tanta diferença!'
            },
            {
              name: 'Renata C., 38 anos',
              avatar: '/depoimento-renata.webp',
              text: 'A dor na lombar que eu tinha todo dia ao levantar da cadeira diminuiu muito. A rotina é simples e cabe no intervalo do almoço.'
            },
            {
              name: 'Patrícia M., 51 anos',
              avatar: '/depoimento-patricia.webp',
              text: 'Comprei sem expectativa e me surpreendi. Consigo dormir melhor e acordo menos tensa. Recomendo para toda mulher acima dos 40.'
            },
          ] as {name:string;avatar:string;text:string}[]).map(t=>(
            <div className="pv2-testimonial-card" key={t.name}>
              <div className="pv2-testimonial-header">
                <img src={t.avatar} alt={`Foto de ${t.name}`} className="pv2-testimonial-avatar" />
                <div className="pv2-testimonial-author">
                  <strong>{t.name}</strong>
                  <div className="pv2-stars-row">
                    <span className="pv2-stars">⭐⭐⭐⭐⭐</span>
                    <span className="pv2-verified">✓ Aluna verificada</span>
                  </div>
                </div>
              </div>
              <p>&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* ── Garantia ── */}
        <div className="pv2-guarantee">
          <img className="pv2-guarantee-seal" src="/selo-garantia-30.png" alt="Selo de garantia de 30 dias"/>
          <h3>Garantia incondicional de 30 dias</h3>
          <p>Teste o método na sua rotina durante 30 dias. Se não sentir progresso real com uso correto, você recebe 100% do valor de volta — sem perguntas, sem burocracia.</p>
        </div>

        {/* ── FAQ ── */}
        <div className="pv2-faq">
          <h2 className="pv2-section-title">Perguntas frequentes</h2>
          {([
            ['Quando recebo meu acesso?','Logo após a confirmação do pagamento, no e-mail usado no checkout.'],
            ['Precisa de academia ou equipamentos?','Não. O programa foi desenhado para casa, com execução no chão ou tapete.'],
            ['É uma assinatura?','Não. R$ 37 é um pagamento único, sem cobranças mensais.'],
            ['Tem garantia?','Sim. 30 dias incondicionais para solicitar reembolso total.'],
            ['Isso substitui atendimento médico?','Não. É uma proposta de bem-estar e não substitui avaliação profissional.'],
          ] as [string,string][]).map(([q,a])=>(
            <article className="pv2-faq-item" key={q}><h4>{q}</h4><p>{a}</p></article>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="pv2-final-cta">
        <div className="pv2-price-stack">
          <p className="pv2-price-old">Preço normal: R$ 148,00</p>
          <p className="pv2-price-main"><strong>R$ 37,00</strong><span>pagamento único</span></p>
        </div>
        <button className="pv2-cta" onClick={()=>{trackInitiateCheckout(37);setCheckout(true)}}>Sim, quero meu plano por R$ 37,00</button>
      </section>

      {/* ── Footer ── */}
      <footer className="pv2-trust-footer">
        <p className="pv2-trust-line">Pagamento seguro SSL</p>
        <div className="pv2-trust-links">
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Reembolso</a>
        </div>
        <p className="pv2-trust-copy">Destrava Leve 2026. Este site apresenta conteúdo informativo e não substitui avaliação médica individual.</p>
      </footer>
    </main>:null}
    {screen===37&&wheel==='won'?<ConfettiBurst anchor={wheelRef} reduced={!fullMotion}/>:null}
    {screen===38?<div className={`pv2-toast${toastShow?' pv2-toast-show':''}`} aria-live="polite" aria-atomic="true">
      <span className="pv2-toast-kicker">Compra recente</span>
      <p><strong>{pvToastBuyers[toastIdx%pvToastBuyers.length].name}</strong> {pvToastBuyers[toastIdx%pvToastBuyers.length].message}</p>
    </div>:null}
    <Dialog open={checkout} onOpenChange={setCheckout}><DialogContent className="checkout-dialog"><DialogTitle>Seu plano está quase liberado.</DialogTitle><DialogDescription>Esta prévia já contém o funil completo. O checkout de R$ 37 será conectado na próxima etapa; nenhuma cobrança foi realizada.</DialogDescription><Primary onClick={()=>setCheckout(false)}>Voltar para a oferta</Primary></DialogContent></Dialog>
  </div>;
}
