const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  // 1. questionVisuals
  ["alt:'Mulher adulta sentada demonstrando estresse',caption:'Vamos entender como isso aparece na sua rotina.'",
   "alt:'Mujer adulta sentada mostrando estrés',caption:'Comprendamos cómo esto aparece en tu rutina.'"],
  ["alt:'Mulher adulta tocando a região da mandíbula',caption:'Tensão no rosto e no pescoço pode passar despercebida.'",
   "alt:'Mujer adulta tocando la zona de la mandíbula',caption:'La tensión en el rostro y el cuello puede pasar desapercibida.'"],
  ["alt:'Mulher adulta massageando a perna cansada',caption:'Observe a sensação que costuma aparecer no fim do dia.'",
   "alt:'Mujer adulta masajeando la pierna cansada',caption:'Observa la sensación que suele aparecer al final del día.'"],
  ["alt:'Mulher adulta acordando com pouca disposição',caption:'Seu começo de manhã ajuda a organizar o seu plano.'",
   "alt:'Mujer adulta despertando con poca energía',caption:'Tu comienzo de la mañana ayuda a organizar tu plan.'"],

  // 2. questions
  // 2
  ["2:{id:'stress',type:'single',title:'Com que frequência você se sente estressada ou ansiosa?',options:[['😮‍💨','Frequentemente'],['🌤️','Raramente'],['✨','Quase nunca']]}",
   "2:{id:'stress',type:'single',title:'¿Con qué frecuencia te sientes estresada o ansiosa?',options:[['😮‍💨','Con frecuencia'],['🌤️','Rara vez'],['✨','Casi nunca']]}"],
  // 3
  ["3:{id:'jaw',type:'single',title:'Você costuma apertar a mandíbula ou ranger os dentes?',options:[['😬','Sim, com frequência'],['🤔','Raramente'],['🙂','Não percebo isso']]}",
   "3:{id:'jaw',type:'single',title:'¿Acostumbras apretar la mandíbula o rechinar los dientes?',options:[['😬','Sí, con frecuencia'],['🤔','Rara vez'],['🙂','No lo percibo']]}"],
  // 4
  ["4:{id:'stiffness',type:'single',title:'Você sente dor ou rigidez na lombar, no cóccix ou no quadril?',options:[['🧍‍♀️','Sim'],['🤷‍♀️','Não sei dizer'],['✨','Não']]}",
   "4:{id:'stiffness',type:'single',title:'¿Sientes dolor o rigidez en la zona lumbar, el cóccix o la cadera?',options:[['🧍‍♀️','Sí'],['🤷‍♀️','No sé decir'],['✨','No']]}"],
  // 5
  ["5:{id:'legs',type:'single',title:'Com que frequência suas pernas ficam pesadas, doloridas ou inchadas?',options:[['🦵','Frequentemente'],['🌥️','Às vezes'],['✨','Quase nunca']]}",
   "5:{id:'legs',type:'single',title:'¿Con qué frecuencia tus piernas se sienten pesadas, adoloridas o hinchadas?',options:[['🦵','Con frecuencia'],['🌥️','A veces'],['✨','Casi nunca']]}"],
  // 6
  ["6:{id:'belly',type:'single',title:'Você percebe a barriga inchada ou estufada mesmo quando cuida da alimentação ou se exercita?',options:[['💧','Sim'],['🤔','Não sei dizer'],['🙂','Não']]}",
   "6:{id:'belly',type:'single',title:'¿Notas el abdomen inflamado o hinchado incluso cuando cuidas tu alimentación o haces ejercicio?',options:[['💧','Sí'],['🤔','No sé decir'],['🙂','No']]}"],
  // 7
  ["7:{id:'urinary',type:'single',title:'Você sente vontade de urinar com muita frequência?',options:[['🚻','Sim, frequentemente'],['🤷‍♀️','Não sei dizer'],['✨','Não percebo isso']]}",
   "7:{id:'urinary',type:'single',title:'¿Sientes necesidad de orinar con mucha frecuencia?',options:[['🚻','Sí, con frecuencia'],['🤷‍♀️','No sé decir'],['✨','No lo percibo']]}"],
  // 9
  ["9:{id:'mood',type:'scale',title:'\"A forma como meu corpo se sente interfere no meu humor.\"',hint:'Quanto você concorda com essa frase?',options:[['1','Discordo totalmente'],['2','Discordo'],['3','Às vezes'],['4','Concordo'],['5','Concordo totalmente']]}",
   "9:{id:'mood',type:'scale',title:'\"La forma en que se siente mi cuerpo interfiere en mi estado de ánimo.\"',hint:'¿Cuánto estás de acuerdo con esta frase?',options:[['1','Totalmente en desacuerdo'],['2','En desacuerdo'],['3','A veces'],['4','De acuerdo'],['5','Totalmente de acuerdo']]}"],
  // 10
  ["10:{id:'waking',type:'single',title:'\"Eu já acordo cansada, antes mesmo de o dia começar.\"',options:[['🪫','Quase todos os dias'],['😮‍💨','Frequentemente'],['🌤️','Raramente'],['✨','Nunca']]}",
   "10:{id:'waking',type:'single',title:'\"Ya amanezco cansada, incluso antes de que empiece el día.\"',options:[['🪫','Casi todos los días'],['😮‍💨','Con frecuencia'],['🌤️','Rara vez'],['✨','Nunca']]}"],
  // 11
  ["11:{id:'impact',type:'single',title:'\"Esses incômodos atrapalham meus relacionamentos, meu trabalho ou minha qualidade de vida.\"',options:[['5','Concordo totalmente'],['4','Concordo'],['3','Um pouco'],['1','Não concordo']]}",
   "11:{id:'impact',type:'single',title:'\"Estas molestias afectan mis relaciones, mi trabajo o mi calidad de vida.\"',options:[['5','Totalmente de acuerdo'],['4','De acuerdo'],['3','Un poco'],['1','No estoy de acuerdo']]}"],
  // 12
  ["12:{id:'desire',type:'single',title:'Com que frequência você se sente desconectada do corpo, com pouca vontade ou desejo?',options:[['🌫️','Frequentemente'],['🌥️','Às vezes'],['✨','Raramente ou nunca'],['—','Prefiro não responder']]}",
   "12:{id:'desire',type:'single',title:'¿Con qué frecuencia te sientes desconectada de tu cuerpo, con poca energía o deseo?',options:[['🌫️','Con frecuencia'],['🌥️','A veces'],['✨','Rara vez o nunca'],['—','Prefiero no responder']]}"],
  // 13
  ["13:{id:'reactions',type:'single',title:'Você se irrita, se afasta ou se fecha e depois fica pensando por que reagiu daquele jeito?',options:[['😤','Frequentemente'],['🌥️','Às vezes'],['🕐','Isso começou recentemente'],['✨','Raramente']]}",
   "13:{id:'reactions',type:'single',title:'¿Te irritas, te alejas o te cierras y luego piensas por qué reaccionaste así?',options:[['😤','Con frecuencia'],['🌥️','A veces'],['🕐','Esto comenzó recientemente'],['✨','Rara vez']]}"],
  // 14
  ["14:{id:'understood',type:'single',title:'Você sente que as pessoas ao seu redor não entendem muito bem o que está passando?',options:[['💭','Frequentemente'],['🌥️','Às vezes'],['🕐','Isso começou recentemente'],['✨','Raramente']]}",
   "14:{id:'understood',type:'single',title:'¿Sientes que las personas a tu alrededor no entienden bien lo que estás viviendo?',options:[['💭','Con frecuencia'],['🌥️','A veces'],['🕐','Esto comenzó recientemente'],['✨','Rara vez']]}"],
  // 15
  ["15:{id:'energy',type:'single',title:'Como costuma ficar sua energia ao longo do dia?',options:[['🪫','Baixa durante quase todo o dia'],['🌇','Cai bastante à tarde'],['🌙','Chego ao fim do dia esgotada'],['↕️','Varia de um dia para o outro'],['🔋','Tenho energia suficiente']]}",
   "15:{id:'energy',type:'single',title:'¿Cómo suele estar tu energía a lo largo del día?',options:[['🪫','Baja casi todo el día'],['🌇','Cae bastante por la tarde'],['🌙','Llego al final del día agotada'],['↕️','Varía de un día a otro'],['🔋','Tengo energía suficiente']]}"],
  // 16
  ["16:{id:'duration',type:'single',title:'Há quanto tempo você percebe esses incômodos?',options:[['🗓️','Há menos de 3 meses'],['📅','Entre 3 e 6 meses'],['📆','Entre 6 meses e 1 ano'],['⏳','Há mais de 1 ano'],['✨','Não percebo esses incômodos']]}",
   "16:{id:'duration',type:'single',title:'¿Hace cuánto tiempo notas estas molestias?',options:[['🗓️','Hace menos de 3 meses'],['📅','Entre 3 y 6 meses'],['📆','Entre 6 meses y 1 año'],['⏳','Hace más de 1 año'],['✨','No noto estas molestias']]}"],
  // 17
  ["17:{id:'caffeine',type:'single',title:'Com que frequência você toma café ou outras bebidas com cafeína?',options:[['☕','Duas ou mais vezes por dia'],['🥤','Uma vez por dia'],['🌥️','De vez em quando'],['✨','Nunca']]}",
   "17:{id:'caffeine',type:'single',title:'¿Con qué frecuencia tomas café u otras bebidas con cafeína?',options:[['☕','Dos o más veces al día'],['🥤','Una vez al día'],['🌥️','De vez en cuando'],['✨','Nunca']]}"],
  // 18
  ["18:{id:'sleep',type:'multi',title:'Quais dessas situações acontecem com seu sono?',options:[['🪫','Acordo cansada'],['🌙','Acordo durante a noite'],['⏰','Demoro para pegar no sono'],['😴','Sinto que durmo mal'],['↕️','Meus horários variam muito'],['✨','Nenhuma dessas opções']]}",
   "18:{id:'sleep',type:'multi',title:'¿Cuáles de estas situaciones ocurren con tu sueño?',options:[['🪫','Me despierto cansada'],['🌙','Me despierto durante la noche'],['⏰','Tardo en quedarme dormida'],['😴','Siento que duermo mal'],['↕️','Mis horarios varían mucho'],['✨','Ninguna de estas opciones']]}"],
  // 19
  ["19:{id:'activity',type:'single',title:'Como você descreveria sua rotina hoje?',options:[['🪑','Passo boa parte do dia sentada ou parada'],['🚶‍♀️','Me movimento um pouco ao longo do dia'],['🏃‍♀️','Pratico exercícios com frequência'],['🔄','Minha rotina é diferente dessas opções']]}",
   "19:{id:'activity',type:'single',title:'¿Cómo describirías tu rutina hoy?',options:[['🪑','Paso gran parte del día sentada o parada'],['🚶‍♀️','Me muevo un poco a lo largo del día'],['🏃‍♀️','Practico ejercicio con frecuencia'],['🔄','Mi rutina es diferente a estas opciones']]}"],
  // 20
  ["20:{id:'habits',type:'multi',title:'Tem algum hábito que você gostaria de mudar?',options:[['⏳','Adiar o que quero fazer'],['🍟','Comer muitos alimentos pouco nutritivos'],['🍬','Comer doces com frequência'],['🚬','Fumar'],['🍷','Beber álcool'],['✨','Nenhum desses']]}",
   "20:{id:'habits',type:'multi',title:'¿Hay algún hábito que te gustaría cambiar?',options:[['⏳','Posponer lo que quiero hacer'],['🍟','Comer muchos alimentos poco nutritivos'],['🍬','Comer dulces con frecuencia'],['🚬','Fumar'],['🍷','Beber alcohol'],['✨','Ninguno de estos']]}"],
  // 21
  ["21:{id:'changes',type:'multi',title:'Você percebeu alguma destas mudanças ou já recebeu algum destes diagnósticos?',options:[['⚖️','Ganho de peso'],['❤️','Pressão alta diagnosticada'],['💧','Sensação de inchaço'],['🌙','Diminuição do desejo sexual'],['💇‍♀️','Queda ou afinamento dos cabelos'],['🧍‍♀️','Dor nas costas'],['🦵','Dor nas articulações'],['🩺','Síndrome do intestino irritável diagnosticada'],['➕','Outra situação'],['✨','Nenhuma dessas opções']]}",
   "21:{id:'changes',type:'multi',title:'¿Has notado alguno de estos cambios o recibido alguno de estos diagnósticos?',options:[['⚖️','Aumento de peso'],['❤️','Presión alta diagnosticada'],['💧','Sensación de hinchazón'],['🌙','Disminución del deseo sexual'],['💇‍♀️','Caída o adelgazamiento del cabello'],['🧍‍♀️','Dolor de espalda'],['🦵','Dolor en las articulaciones'],['🩺','Síndrome de intestino irritable diagnosticado'],['➕','Otra situación'],['✨','Ninguna de estas opciones']]}"],
  // 22
  ["22:{id:'context',type:'multi',title:'Alguma destas situações deixou sua rotina mais difícil recentemente?',options:[['💼','Pressão no trabalho'],['💳','Preocupações financeiras'],['🏠','Rotina familiar corrida'],['💔','Separação ou fim de relacionamento'],['🌪️','Outra situação estressante'],['✨','Nenhuma dessas opções']]}",
   "22:{id:'context',type:'multi',title:'¿Alguna de estas situaciones ha dificultado tu rutina recientemente?',options:[['💼','Presión en el trabajo'],['💳','Preocupaciones financieras'],['🏠','Rutina familiar agitada'],['💔','Separación o fin de una relación'],['🌪️','Otra situación estresante'],['✨','Ninguna de estas opciones']]}"],
  // 23
  ["23:{id:'priorities',type:'multi',title:'O que você mais gostaria de melhorar no seu dia a dia?',options:[['🔋','Minha disposição'],['🧘‍♀️','A forma como lido com o estresse'],['🌤️','Minha sensação de preocupação ou ansiedade'],['🙂','As oscilações de humor'],['🧠','Minha clareza e concentração'],['✨','Nenhuma dessas opções']]}",
   "23:{id:'priorities',type:'multi',title:'¿Qué te gustaría mejorar más en tu día a día?',options:[['🔋','Mi vitalidad'],['🧘‍♀️','La forma en que manejo el estrés'],['🌤️','Mi sensación de preocupación o ansiedad'],['🙂','Los cambios de humor'],['🧠','Mi claridad mental y concentración'],['✨','Ninguna de estas opciones']]}"],
  // 24
  ["24:{id:'goal',type:'single',title:'Qual destas mudanças faria mais diferença na sua vida hoje?',options:[['🪶','Desinchar a barriga e voltar a sentir o corpo leve'],['👨‍👩‍👧','Ter mais paciência e energia com meus filhos e família'],['🔋','Acordar com disposição real, sem peso e sem dor'],['🧘‍♀️','Desacelerar a mente e viver sem tanto estresse']]}",
   "24:{id:'goal',type:'single',title:'¿Cuál de estos cambios marcaría más diferencia en tu vida hoy?',options:[['🪶','Desinflamar el abdomen y volver a sentir el cuerpo liviano'],['👨‍👩‍👧','Tener más paciencia y energía con mis hijos y familia'],['🔋','Despertar con vitalidad real, sin pesadez ni dolor'],['🧘‍♀️','Desacelerar la mente y vivir sin tanto estrés']]}"],
  // 25
  ["25:{id:'knowledge',type:'single',title:'Você já ouviu falar em fáscia, sistema linfático e nervo vago?',options:[['🌱','Ainda não'],['💡','Já ouvi, mas conheço pouco'],['📚','Sim, conheço esses assuntos']]}",
   "25:{id:'knowledge',type:'single',title:'¿Has escuchado hablar sobre la fascia, el sistema linfático y el nervio vago?',options:[['🌱','Aún no'],['💡','Lo he escuchado, pero sé poco'],['📚','Sí, conozco estos temas']]}"],
  // 27
  ["27:{id:'source',type:'single',title:'Como você conheceu o Destrava Leve?',options:[['📱','Vi um anúncio'],['💬','Uma pessoa me indicou'],['🩺','Um profissional me indicou'],['✨','Encontrei nas redes sociais'],['🤔','Não lembro']]}",
   "27:{id:'source',type:'single',title:'¿Cómo conociste Destrava Leve?',options:[['📱','Vi un anuncio'],['💬','Alguien me lo recomendó'],['🩺','Un profesional me lo recomendó'],['✨','Lo encontré en redes sociales'],['🤔','No recuerdo']]}"],
  // 30
  ["30:{id:'time',type:'single',title:'Quanto tempo você consegue reservar para cuidar de você por dia?',options:[['⏱️','Cerca de 7 minutos'],['🕐','Entre 10 e 15 minutos'],['🕑','Mais de 15 minutos'],['📅','Ainda preciso organizar esse tempo']]}",
   "30:{id:'time',type:'single',title:'¿Cuánto tiempo puedes dedicar a cuidarte cada día?',options:[['⏱️','Alrededor de 7 minutos'],['🕐','Entre 10 y 15 minutos'],['🕑','Más de 15 minutos'],['📅','Aún necesito organizar ese tiempo']]}"],
  // 32
  ["32:{id:'confidence',type:'single',title:'Como você se sente sobre começar essa rotina?',options:[['🚀','Estou animada para começar'],['🌱','Estou em dúvida, mas quero tentar'],['💡','Quero entender melhor antes de decidir']]}",
   "32:{id:'confidence',type:'single',title:'¿Cómo te sientes respecto a comenzar esta rutina?',options:[['🚀','Estoy entusiasmada para comenzar'],['🌱','Tengo dudas, pero quiero intentarlo'],['💡','Quero entender mejor antes de decidir']]}"],

  // 3. category
  ["const category=(s:number)=>s<=8?'Sinais físicos':s<=15?'Estado emocional':s<=22?'Estilo de vida':s<=29?'Objetivos':'Quase lá';",
   "const category=(s:number)=>s<=8?'Señales físicas':s<=15?'Estado emocional':s<=22?'Estilo de vida':s<=29?'Objetivos':'Casi listo';"],

  // 4. introMessages
  [`const introMessages = [
  '🌿 Identificando seu perfil e rotina...',
  '📊 Cruzando com o histórico do programa Destrava Leve...',
  '✨ Personalizando suas perguntas de avaliação...',
];`,
   `const introMessages = [
  '🌿 Identificando tu perfil y rutina...',
  '📊 Cruzando con el historial del programa Destrava Leve...',
  '✨ Personalizando tus preguntas de evaluación...',
];`],

  // 5. pvToastBuyers
  [`const pvToastBuyers=[
  {name:'Fernanda',message:'acabou de liberar o Plano Destrava Leve 28D.'},
  {name:'Juliana',message:'ativou sua rotina de 7 minutos Destrava Leve.'},
  {name:'Patrícia',message:'garantiu seu plano Destrava Leve agora.'},
  {name:'Renata',message:'confirmou seu protocolo personalizado Destrava Leve.'},
  {name:'Simone',message:'desbloqueou o método Destrava Leve 28D.'},
  {name:'Márcia',message:'adquiriu seu plano Destrava Leve pessoal.'},
];`,
   `const pvToastBuyers=[
  {name:'Valentina',message:'acaba de desbloquear el Plan Destrava Leve 28D.'},
  {name:'Sofía',message:'activó su rutina de 7 minutos Destrava Leve.'},
  {name:'Lucía',message:'aseguró su plan Destrava Leve ahora.'},
  {name:'Camila',message:'confirmó su protocolo personalizado Destrava Leve.'},
  {name:'Daniela',message:'desbloqueó el método Destrava Leve 28D.'},
  {name:'Andrea',message:'adquirió su plan Destrava Leve personal.'},
];`],

  // 6. Date format
  ["d.toLocaleDateString('pt-BR', { month: 'long' });",
   "d.toLocaleDateString('es-419', { month: 'long' });"],

  // 7. introMessage useMemo
  [`  const introMessage = useMemo(() => {
    if (introProgress < 35) return '🌿 Conectando ao protocolo Destrava Leve 28D...';
    if (introProgress < 70) return '📊 Cruzando parâmetros de liberação fascial e postural...';
    if (introProgress < 100) return '✨ Personalizando suas perguntas de avaliação...';
    return '✅ Avaliação pronta! Iniciando...';
  }, [introProgress]);`,
   `  const introMessage = useMemo(() => {
    if (introProgress < 35) return '🌿 Conectando con el protocolo Destrava Leve 28D...';
    if (introProgress < 70) return '📊 Cruzando parámetros de liberación fascial y postural...';
    if (introProgress < 100) return '✨ Personalizando tus preguntas de evaluación...';
    return '✅ ¡Evaluación lista! Iniciando...';
  }, [introProgress]);`],

  // 8. goalLabel useMemo
  [`  const goalLabel = useMemo(() => {
    const goal = typeof answers.goal === 'string' ? answers.goal : '';
    if (goal.includes('Desinchar') || goal.includes('corpo leve')) return 'Corpo Leve & Desinchado';
    if (goal.includes('paciência') || goal.includes('filhos') || goal.includes('família')) return 'Mais Energia & Família';
    if (goal.includes('disposição') || goal.includes('peso') || goal.includes('dor')) return 'Vitalidade & Disposição';
    if (goal.includes('mente') || goal.includes('estresse')) return 'Alívio do Estresse';
    return 'Corpo Leve & Desinchado';
  }, [answers.goal]);`,
   `  const goalLabel = useMemo(() => {
    const goal = typeof answers.goal === 'string' ? answers.goal : '';
    if (goal.includes('Desinflamar') || goal.includes('cuerpo liviano') || goal.includes('Desinchar')) return 'Cuerpo Liviano & Desinflamado';
    if (goal.includes('paciencia') || goal.includes('hijos') || goal.includes('familia') || goal.includes('paciência')) return 'Más Energía & Familia';
    if (goal.includes('vitalidad') || goal.includes('pesadez') || goal.includes('dolor') || goal.includes('disposição')) return 'Vitalidad & Energía';
    if (goal.includes('mente') || goal.includes('estrés') || goal.includes('estresse')) return 'Alivio del Estrés';
    return 'Cuerpo Liviano & Desinflamado';
  }, [answers.goal]);`],

  // 9. Header
  [`aria-label="Voltar"><ArrowLeft/></button>:<span/>}<button className="logo" onClick={()=>go(0)} aria-label="Destrava Leve, início">`,
   `aria-label="Volver"><ArrowLeft/></button>:<span/>}<button className="logo" onClick={()=>go(0)} aria-label="Destrava Leve, inicio">`],

  // 10. renderQuestion
  [`<div className="question-count">PERGUNTA {Object.keys(questions).indexOf(String(screen))+1} DE 27</div><h1>{q.title}</h1><p className="hint">{q.hint||(q.type==='multi'?'Você pode selecionar mais de uma opção.':'Escolha a opção que mais combina com você.')}</p>`,
   `<div className="question-count">PREGUNTA {Object.keys(questions).indexOf(String(screen))+1} DE 27</div><h1>{q.title}</h1><p className="hint">{q.hint||(q.type==='multi'?'Puedes seleccionar más de una opción.':'Elige la opción que más se adapta a ti.')}</p>`],
  [`{q.type==='multi'?<Primary disabled={!list.length} onClick={()=>{trackQuizAnswer(q.id,list,screen);go(screen+1)}}>Continuar</Primary>:null}`,
   `{q.type==='multi'?<Primary disabled={!list.length} onClick={()=>{trackQuizAnswer(q.id,list,screen);go(screen+1)}}>Continuar</Primary>:null}`],

  // 11. intro-splash screen
  [`          <span className="intro-splash-kicker">SISTEMA INTELIGENTE DE AVALIAÇÃO</span>
          <h1 className="intro-splash-title">Preparando seu Teste de Liberação Corporal...</h1>
        </div>
        <img src="/mascote-fluxo-transparente.webp" alt="Mascote Destrava Leve" className="intro-splash-mascot" />
        <div className="intro-splash-box">
          <div className="intro-splash-meta">
            <span>Configurando diagnóstico</span>
            <strong>{introProgress}%</strong>
          </div>
          <div className="intro-splash-track">
            <div className="intro-splash-bar" style={{ width: \`\${introProgress}%\` }} />
          </div>
          <p className="intro-splash-message">{introMessage}</p>
          <p className="intro-splash-subtext">⚡ Aguarde cerca de 8 segundos enquanto configuramos sua avaliação...</p>`,
   `          <span className="intro-splash-kicker">SISTEMA INTELIGENTE DE EVALUACIÓN</span>
          <h1 className="intro-splash-title">Preparando tu Prueba de Liberación Corporal...</h1>
        </div>
        <img src="/mascote-fluxo-transparente.webp" alt="Mascota Destrava Leve" className="intro-splash-mascot" />
        <div className="intro-splash-box">
          <div className="intro-splash-meta">
            <span>Configurando diagnóstico</span>
            <strong>{introProgress}%</strong>
          </div>
          <div className="intro-splash-track">
            <div className="intro-splash-bar" style={{ width: \`\${introProgress}%\` }} />
          </div>
          <p className="intro-splash-message">{introMessage}</p>
          <p className="intro-splash-subtext">⚡ Espera unos 8 segundos mientras configuramos tu evaluación...</p>`],

  // 12. screen 0 entry
  [`{screen===0 && !introLoading ? <main key="entry-screen" className="screen entry screen-in"><div className="entry-copy"><h1>PLANO DE LIBERAÇÃO CORPORAL</h1><p>Uma rotina de 7 minutos para ajudar a aliviar a sensação de peso e voltar a sentir o corpo leve.</p><strong>Quiz de 1 minuto</strong></div><div className="entry-grid"><img src="/mascote-fluxo-transparente.webp" alt="Personagem 3D com anatomia de fluxo em azul"/><RadioGroup value={typeof answers.age==='string'?answers.age:''} onValueChange={v=>setSingle('age',v)}>{['25–34','35–44','45–54','55+'].map(v=><label className={answers.age===v?'age selected':'age'} key={v} onClick={()=>setSingle('age',v)}><RadioGroupItem className="sr-only" value={v}/>{v}</label>)}</RadioGroup></div><p className="legal">Este questionário organiza suas respostas e não substitui avaliação profissional.</p></main>:null}`,
   `{screen===0 && !introLoading ? <main key="entry-screen" className="screen entry screen-in"><div className="entry-copy"><h1>PLAN DE LIBERACIÓN CORPORAL</h1><p>Una rutina de 7 minutos para ayudar a aliviar la sensación de pesadez y volver a sentir el cuerpo liviano.</p><strong>Quiz de 1 minuto</strong></div><div className="entry-grid"><img src="/mascote-fluxo-transparente.webp" alt="Personaje 3D con anatomía de flujo en azul"/><RadioGroup value={typeof answers.age==='string'?answers.age:''} onValueChange={v=>setSingle('age',v)}>{['25–34','35–44','45–54','55+'].map(v=><label className={answers.age===v?'age selected':'age'} key={v} onClick={()=>setSingle('age',v)}><RadioGroupItem className="sr-only" value={v}/>{v}</label>)}</RadioGroup></div><p className="legal">Este cuestionario organiza tus respuestas y no reemplaza la evaluación profesional.</p></main>:null}`],

  // 13. screen 1 trust
  [`{screen===1?<main key={screen} className="screen interstitial trust screen-in"><h1>Um passo de cada vez.<br/><span>Uma rotina que cabe no seu dia.</span></h1><img src="/grupo-mulheres.webp" alt="Três mulheres em estilo de animação 3D"/><div className="mini-benefits"><span><b>28</b> dias</span><span><b>7</b> minutos</span><span><b>1</b> passo por vez</span></div><p>Primeiro, vamos entender o que você percebe no corpo e o que gostaria de melhorar.</p><Primary onClick={()=>go(2)}>Começar</Primary></main>:null}`,
   `{screen===1?<main key={screen} className="screen interstitial trust screen-in"><h1>Un paso a la vez.<br/><span>Una rutina que cabe en tu día.</span></h1><img src="/grupo-mulheres.webp" alt="Tres mujeres en estilo de animación 3D"/><div className="mini-benefits"><span><b>28</b> días</span><span><b>7</b> minutos</span><span><b>1</b> paso a la vez</span></div><p>Primero, vamos a entender lo que percibes en tu cuerpo y lo que te gustaría mejorar.</p><Primary onClick={()=>go(2)}>Comenzar</Primary></main>:null}`],

  // 14. screen 8 emotion
  [`{screen===8?<main key={screen} className="screen interstitial emotion screen-in"><h1>O que você sente merece atenção.</h1><img src="/mascote-emocional.webp" alt="Personagem 3D reflexiva com anatomia azul visível"/><p>Quando o corpo incomoda, isso também pesa na rotina. Agora vamos entender como você se sente no dia a dia.</p><Primary onClick={()=>go(9)}>Continuar</Primary></main>:null}`,
   `{screen===8?<main key={screen} className="screen interstitial emotion screen-in"><h1>Lo que sientes merece atención.</h1><img src="/mascote-emocional.webp" alt="Personaje 3D reflexivo con anatomía azul visible"/><p>Cuando el cuerpo molesta, eso también pesa en la rutina. Ahora vamos a entender cómo te sientes en el día a día.</p><Primary onClick={()=>go(9)}>Continuar</Primary></main>:null}`],

  // 15. screen 26 mechanism
  [`            <img src="/g1-header-ref.png" alt="G1 Bem-Estar" className="g1-header-img" />`,
   `            <img src="/g1-header-ref.png" alt="Bienestar 360" className="g1-header-img" />`],
  [`          <span className="g1-kicker">NOVO MÉTODO DESTRAVA LEVE</span>
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
          </figure>`,
   `          <span className="g1-kicker">NUEVO MÉTODO DESTRAVA LEVE</span>
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
          </figure>`],

  [`          <div className="g1-share-bar" aria-label="Compartilhar matéria">
            <button type="button" className="g1-share-btn" aria-label="Compartilhar no Facebook">`,
   `          <div className="g1-share-bar" aria-label="Compartir artículo">
            <button type="button" className="g1-share-btn" aria-label="Compartir en Facebook">`],
  [`            <button type="button" className="g1-share-btn" aria-label="Compartilhar no WhatsApp">`,
   `            <button type="button" className="g1-share-btn" aria-label="Compartir en WhatsApp">`],
  [`            <button type="button" className="g1-share-btn" aria-label="Outras opções de compartilhamento">`,
   `            <button type="button" className="g1-share-btn" aria-label="Otras opciones de compartir">`],

  [`      <section className="qualification-card">
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

      <p className="notice">Conteúdo informativo com base nas suas preferências; não substitui orientação médica ou de saúde.</p>`,
   `      <section className="qualification-card">
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

      <p className="notice">Contenido informativo basado en tus preferencias; no reemplaza la orientación médica o de salud.</p>`],

  // 16. screen 28 result
  [`    {screen===28?<main key={screen} className="screen result screen-in">
      <h1 className="result-headline">Resumo do seu perfil</h1>
      <section className="result-card">
        <div className="result-title">
          <b>Nível de restrição fascial</b>
          <strong className="badge-status">Elevado</strong>
        </div>

        <div className="score-track-container">
          <div className="score-pin" style={{ left: \`\${Math.max(76, Math.min(88, score))}%\` }}>
            <span>Você – {Math.max(76, Math.min(88, score))}%</span>
            <i className="score-pin-arrow" />
          </div>
          <div className="score-bar">
            <i className="score-dot" style={{ left: \`\${Math.max(76, Math.min(88, score))}%\` }} />
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
    </main>:null}`,
   `    {screen===28?<main key={screen} className="screen result screen-in">
      <h1 className="result-headline">Resumen de tu perfil</h1>
      <section className="result-card">
        <div className="result-title">
          <b>Nivel de restricción fascial</b>
          <strong className="badge-status">Elevado</strong>
        </div>

        <div className="score-track-container">
          <div className="score-pin" style={{ left: \`\${Math.max(76, Math.min(88, score))}%\` }}>
            <span>Tú – {Math.max(76, Math.min(88, score))}%</span>
            <i className="score-pin-arrow" />
          </div>
          <div className="score-bar">
            <i className="score-dot" style={{ left: \`\${Math.max(76, Math.min(88, score))}%\` }} />
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
    </main>:null}`],

  // 17. screen 29 vagus chart
  [`    {screen===29?<main key={screen} className="screen bridge aura-chart-screen screen-in">
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
        >`,
   `    {screen===29?<main key={screen} className="screen bridge aura-chart-screen screen-in">
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
        >`],

  [`            <text x="80" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Resistência ao estresse</text>`,
   `            <text x="80" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Resistencia al estrés</text>`],
  [`            <text x="56" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Sono profundo</text>`,
   `            <text x="56" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Sueño profundo</text>`],
  [`            <text x="64" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Níveis de energia</text>`,
   `            <text x="64" y="14" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Niveles de energía</text>`],

  [`          <p>
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
          </p>`,
   `          <p>
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
          </p>`],

  // 18. screen 31 timeline
  [`    {screen===31?<main key={screen} className="screen timeline-screen screen-in">
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
        >`,
   `    {screen===31?<main key={screen} className="screen timeline-screen screen-in">
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
        >`],

  [`            <text x="28" y="13" fill="#334155" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="central">Agora</text>`,
   `            <text x="28" y="13" fill="#334155" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="central">Ahora</text>`],
  [`            <text x="38" y="12" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">Após</text>
            <text x="38" y="24" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">4 semanas</text>`,
   `            <text x="38" y="12" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">Tras</text>
            <text x="38" y="24" fill="#ffffff" fontSize="9.5" fontWeight="700" textAnchor="middle">4 semanas</text>`],

  // 19. screen 33 loader
  [`    {screen===33?<main key={screen} className="screen loading screen-in"><div className="loader" style={{'--fill':\`\${loader*3.6}deg\`} as React.CSSProperties}><b>{loader}%</b></div><p>{loader===100?'Tudo pronto!':'Organizando suas respostas…'}</p><ul><li className={loader>=24?'done':''}><Check/>Objetivo principal identificado</li><li className={loader>=67?'done':''}><Check/>Resumo organizado</li><li className={loader===100?'done':''}><Check/>Pronto para conhecer o programa</li></ul>{loader===100?<Primary onClick={()=>go(34)}>Continuar</Primary>:null}</main>:null}`,
   `    {screen===33?<main key={screen} className="screen loading screen-in"><div className="loader" style={{'--fill':\`\${loader*3.6}deg\`} as React.CSSProperties}><b>{loader}%</b></div><p>{loader===100?'¡Todo listo!':'Organizando tus respuestas…'}</p><ul><li className={loader>=24?'done':''}><Check/>Objetivo principal identificado</li><li className={loader>=67?'done':''}><Check/>Resumen organizado</li><li className={loader===100?'done':''}><Check/>Listo para conocer el programa</li></ul>{loader===100?<Primary onClick={()=>go(34)}>Continuar</Primary>:null}</main>:null}`],

  // 20. screen 34 email gate
  [`    {screen===34?<main key={screen} className="screen gate screen-in"><div className="gate-icon">✉️</div><h1>Qual e-mail você pretende usar para acessar o programa?</h1><p>Se decidir comprar, confira se usa o mesmo e-mail no checkout.</p><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Seu melhor e-mail" aria-label="Seu e-mail"/><Primary disabled={!emailOk} onClick={()=>{trackLeadCapture(email);setMarketing(true);go(36)}}>Continuar</Primary><span className="secure"><ShieldCheck/>Seus dados ficam apenas nesta prévia.</span></main>:null}`,
   `    {screen===34?<main key={screen} className="screen gate screen-in"><div className="gate-icon">✉️</div><h1>¿Qué correo electrónico usarás para acceder al programa?</h1><p>Si decides comprar, asegúrate de usar el mismo correo en el checkout.</p><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Tu mejor correo" aria-label="Tu correo"/><Primary disabled={!emailOk} onClick={()=>{trackLeadCapture(email);setMarketing(true);go(36)}}>Continuar</Primary><span className="secure"><ShieldCheck/>Tus datos se quedan solo en esta vista previa.</span></main>:null}`],

  // 21. screen 36 name gate
  [`    {screen===36?<main key={screen} className="screen gate screen-in"><div className="gate-icon">👋</div><h1>Como podemos chamar você?</h1><p>Use apenas seu primeiro nome.</p><Input value={name} onChange={e=>setName(e.target.value.replace(/\\s.*/,''))} placeholder="Seu primeiro nome" aria-label="Seu primeiro nome" required/><Primary disabled={!name.trim()} onClick={()=>{trackLeadCapture(email,name);go(37)}}>Continuar</Primary></main>:null}`,
   `    {screen===36?<main key={screen} className="screen gate screen-in"><div className="gate-icon">👋</div><h1>¿Cómo te llamamos?</h1><p>Usa solo tu primer nombre.</p><Input value={name} onChange={e=>setName(e.target.value.replace(/\\s.*/,''))} placeholder="Tu primer nombre" aria-label="Tu primer nombre" required/><Primary disabled={!name.trim()} onClick={()=>{trackLeadCapture(email,name);go(37)}}>Continuar</Primary></main>:null}`],

  // 22. screen 37 prize wheel
  [`    {screen===37?<main key={screen} className={\`screen prize screen-in \${wheel==='won'?'winner':''}\`}><div className="prize-kicker">RECOMPENSA DESBLOQUEADA</div><h1>{displayName}, seu plano está pronto.</h1><p>Gire a roleta para revelar a condição reservada para o seu perfil.</p><div className={\`wheel-stage \${wheel}\`}><span className="wheel-pointer" ref={pointerRef} aria-hidden="true"/><div className="discount-wheel" ref={wheelRef} aria-label="Roleta de desconto"><div className="wheel-labels"><b>10%</b><b>30%</b><b>20%</b><b>75%</b><b>15%</b><b>50%</b></div><span>+</span></div></div>{wheel==='won'?<><div className="won-card" aria-live="polite"><small>PARABÉNS, {displayName.toUpperCase()}!</small><b className="win-message">Você ganhou o maior desconto disponível</b><strong>75% OFF</strong></div><Primary onClick={()=>go(38)}>Usar meu desconto</Primary></>:<Primary disabled={wheel==='spinning'} onClick={spinWheel}>{wheel==='spinning'?'Roleta girando…':'Girar a roleta'}</Primary>}<small className="prize-note">Condição promocional aplicada uma única vez nesta apresentação.</small></main>:null}`,
   `    {screen===37?<main key={screen} className={\`screen prize screen-in \${wheel==='won'?'winner':''}\`}><div className="prize-kicker">RECOMPENSA DESBLOQUEADA</div><h1>{displayName}, tu plan está listo.</h1><p>Gira la ruleta para revelar la condición reservada para tu perfil.</p><div className={\`wheel-stage \${wheel}\`}><span className="wheel-pointer" ref={pointerRef} aria-hidden="true"/><div className="discount-wheel" ref={wheelRef} aria-label="Ruleta de descuento"><div className="wheel-labels"><b>10%</b><b>30%</b><b>20%</b><b>75%</b><b>15%</b><b>50%</b></div><span>+</span></div></div>{wheel==='won'?<><div className="won-card" aria-live="polite"><small>¡FELICIDADES, {displayName.toUpperCase()}!</small><b className="win-message">Ganaste el mayor descuento disponible</b><strong>75% OFF</strong></div><Primary onClick={()=>go(38)}>Usar mi descuento</Primary></>:<Primary disabled={wheel==='spinning'} onClick={spinWheel}>{wheel==='spinning'?'Ruleta girando…':'Girar la ruleta'}</Primary>}<small className="prize-note">Condición promocional aplicada una única vez en esta presentación.</small></main>:null}`],

  // 23. screen 38 PV2
  [`      {/* ── Barra de urgência sticky ── */}
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
      </section>`,
   `      {/* ── Barra de urgencia sticky ── */}
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
      </section>`],

  [`          <div className="pv2-offer-top">
            <span className="pv2-offer-tag">Oferta oficial desbloqueada</span>
            <span className="pv2-sold-hour">+2.400 planos ativados</span>
          </div>
          <div className="pv2-gallery">
            <div className="pv2-gallery-track" style={{ transform: \`translateX(-\${pv2GalleryIdx * 33.3333}%)\` }}>
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
            <button className={\`pv2-dot\${pv2GalleryIdx===0?' active':''}\`} onClick={()=>setPv2GalleryIdx(0)} aria-label="Slide 1"/>
            <button className={\`pv2-dot\${pv2GalleryIdx===1?' active':''}\`} onClick={()=>setPv2GalleryIdx(1)} aria-label="Slide 2"/>
            <button className={\`pv2-dot\${pv2GalleryIdx===2?' active':''}\`} onClick={()=>setPv2GalleryIdx(2)} aria-label="Slide 3"/>
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
          <p className="pv2-secure-row"><ShieldCheck size={13}/>Checkout seguro SSL · Garantia de 30 dias</p>`,
   `          <div className="pv2-offer-top">
            <span className="pv2-offer-tag">Oferta oficial desbloqueada</span>
            <span className="pv2-sold-hour">+2,400 planes activados</span>
          </div>
          <div className="pv2-gallery">
            <div className="pv2-gallery-track" style={{ transform: \`translateX(-\${pv2GalleryIdx * 33.3333}%)\` }}>
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
            <button className={\`pv2-dot\${pv2GalleryIdx===0?' active':''}\`} onClick={()=>setPv2GalleryIdx(0)} aria-label="Slide 1"/>
            <button className={\`pv2-dot\${pv2GalleryIdx===1?' active':''}\`} onClick={()=>setPv2GalleryIdx(1)} aria-label="Slide 2"/>
            <button className={\`pv2-dot\${pv2GalleryIdx===2?' active':''}\`} onClick={()=>setPv2GalleryIdx(2)} aria-label="Slide 3"/>
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
          <p className="pv2-secure-row"><ShieldCheck size={13}/>Checkout seguro SSL · Garantía de 30 días</p>`],

  [`      {/* ── Módulos do Método ── */}
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
      </section>`,
   `      {/* ── Módulos del Método ── */}
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
      </section>`],

  [`      {/* ── Depoimentos ── */}
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
                <img src={t.avatar} alt={\`Foto de \${t.name}\`} className="pv2-testimonial-avatar" />
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
      </footer>`,
   `      {/* ── Testimonios ── */}
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
                <img src={t.avatar} alt={\`Foto de \${t.name}\`} className="pv2-testimonial-avatar" />
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
      </footer>`],

  // 24. toast & dialog
  [`      <span className="pv2-toast-kicker">Compra recente</span>`,
   `      <span className="pv2-toast-kicker">Compra reciente</span>`],
  [`    <Dialog open={checkout} onOpenChange={setCheckout}><DialogContent className="checkout-dialog"><DialogTitle>Seu plano está quase liberado.</DialogTitle><DialogDescription>Esta prévia já contém o funil completo. O checkout de R$ 37 será conectado na próxima etapa; nenhuma cobrança foi realizada.</DialogDescription><Primary onClick={()=>setCheckout(false)}>Voltar para a oferta</Primary></DialogContent></Dialog>`,
   `    <Dialog open={checkout} onOpenChange={setCheckout}><DialogContent className="checkout-dialog"><DialogTitle>Tu plan está casi listo.</DialogTitle><DialogDescription>Esta vista previa contiene el embudo completo. El checkout de USD 37 será conectado en la próxima etapa; ningún cobro fue realizado.</DialogDescription><Primary onClick={()=>setCheckout(false)}>Volver a la oferta</Primary></DialogContent></Dialog>`]
];

let replacedCount = 0;
let missing = [];

for (let i = 0; i < replacements.length; i++) {
  const [target, replacement] = replacements[i];
  if (!content.includes(target)) {
    missing.push(i);
    console.warn(`Target #${i} NOT FOUND!`);
  } else {
    content = content.replace(target, replacement);
    replacedCount++;
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Translation finished! Replaced ${replacedCount}/${replacements.length} blocks.`);
if (missing.length > 0) {
  console.log('Missing indices:', missing);
}
