import fs from 'fs';
import path from 'path';

const ebookData = {
  title: "100 Rituais de Chás Anti-Inchaço & Drenagem Noturna",
  subtitle: "O Guia Oficial de Infusões Linfáticas, Desinchaço Abdominal e Desativação do Estresse para Noites Restauradoras",
  author: "Destrava Leve 28D",
  version: "1.0 Oficial",
  chapters: [
    {
      number: 1,
      title: "O Desinchaço Linfático Noturno",
      subtitle: "20 Rituais para drenar pernas pesadas, tornozelos inchados e fluidos retidos enquanto você dorme",
      recipes: [
        {
          num: 1,
          name: "Ritual Linfático Ouro Verde",
          target: "Drenagem global e pernas leves",
          time: "10 min de infusão",
          temp: "90°C (água quase fervendo)",
          ingredients: [
            "1 colher de sopa de cavalinha desidratada",
            "1/2 maçã vermelha com casca fatiada em lâminas",
            "1 pequeno pau de canela",
            "300ml de água filtrada"
          ],
          prep: "Aqueça a água até iniciar as primeiras bolhas no fundo da panela (não deixe ferver em ebulição forte). Desligue o fogo, adicione a cavalinha, a maçã e a canela. Tampe o recipiente e abafe por 10 minutos. Coe e sirva morno.",
          tip: "Tome 40 minutos antes de se deitar. A maçã neutraliza o sabor herbal da cavalinha e fornece quercetina anti-inflamatória."
        },
        {
          num: 2,
          name: "Elixir Hibisco & Frutas Noturno",
          target: "Estímulo da microcirculação e eliminação de toxinas",
          time: "7 min de infusão",
          temp: "85°C",
          ingredients: [
            "1 colher de sobremesa de flores de hibisco seco",
            "3 amoras ou morangos frescos (levemente amassados)",
            "1 tira fina de casca de limão siciliano",
            "250ml de água filtrada"
          ],
          prep: "Ferva a água e desligue. Acrescente o hibisco e a casca de limão. Deixe em infusão abafada por 7 minutos. Coe sobre as frutas levemente amassadas na xícara para soltar a cor e os antioxidantes.",
          tip: "O hibisco acelera a filtragem renal noturna. Não ultrapasse o tempo de infusão para não acidificar demais o paladar."
        },
        {
          num: 3,
          name: "Infusão Dente-de-Leão Suave",
          target: "Filtragem hepática e alívio de retenção profunda",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de chá de folhas secas de dente-de-leão",
            "1 colher de café de sementes de funcho levemente esmagadas",
            "250ml de água fervente"
          ],
          prep: "Esmague o funcho com as costas de uma colher para liberar os óleos essenciais. Coloque em uma xícara junto ao dente-de-leão e despeje a água quente. Abafe por 8 minutos e coe bem.",
          tip: "Excelente para dias em que você comeu alimentos com muito sal ou ultraprocessados."
        },
        {
          num: 4,
          name: "Chá da Leveza das Pernas",
          target: "Retorno venoso e alívio de peso nos membros inferiores",
          time: "10 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de centelha asiática seca",
            "1 colher de chá de cavalinha",
            "4 folhas de hortelã fresca",
            "300ml de água filtrada"
          ],
          prep: "Despeje a água aquecida sobre a centelha e a cavalinha. Cubra com um pires por 8 minutos. Nos últimos 2 minutos, adicione as folhas de hortelã fresca para preservar seu aroma e frescor. Coe.",
          tip: "Ideal para quem passa longos períodos em pé ou sentada na mesma posição durante o trabalho."
        },
        {
          num: 5,
          name: "Infusão Salsa & Limão Drenante",
          target: "Limpeza das vias urinárias e redução de volume corporal",
          time: "10 min de infusão",
          temp: "95°C",
          ingredients: [
            "1 punhado pequeno de salsa fresca com talos (bem lavada)",
            "Suco de 1/2 limão espremido na hora",
            "1 lâmina fina de gengibre",
            "300ml de água"
          ],
          prep: "Ferva a água com a lâmina de gengibre por 2 minutos. Desligue, acrescente a salsa fresca, tampe e abafe por 8 minutos. Coe na xícara e finalize com o suco de limão fresco.",
          tip: "A salsa é um dos diuréticos naturais mais potentes da natureza, rica em potássio que equilibra o sódio do organismo."
        },
        {
          num: 6,
          name: "Ritual Chá Verde Descafeinado & Melancia",
          target: "Estímulo antioxidante sem alterar o sono",
          time: "5 min de infusão",
          temp: "80°C",
          ingredients: [
            "1 colher de sobremesa de chá verde descafeinado em folhas",
            "2 cubos pequenos da parte branca da casca da melancia (altamente diurética)",
            "250ml de água"
          ],
          prep: "Ferva os cubinhos da casca branca da melancia por 3 minutos na água. Desligue, adicione as folhas de chá verde descafeinado, abafe por 5 minutos e coe.",
          tip: "A casca branca da melancia é rica em citrulina, aminoácido essencial para o relaxamento dos vasos e circulação de fluidos."
        },
        {
          num: 7,
          name: "Infusão Pêssego & Cavalinha",
          target: "Eliminação suave de líquidos com aroma reconfortante",
          time: "10 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de cavalinha",
            "1/4 de pêssego fresco cortado em lâminas finas",
            "1 colher de café de erva-doce",
            "250ml de água"
          ],
          prep: "Coloque o pêssego e a erva-doce na xícara. Despeje a água aquecida sobre a cavalinha em infusão tampada por 10 minutos. Despeje o chá coado sobre o pêssego.",
          tip: "O pêssego empresta uma doçura natural aveludada, dispensando qualquer tipo de adoçante."
        },
        {
          num: 8,
          name: "Elixir Cúrcuma Linfática",
          target: "Desinflamação dos nódulos linfáticos e queima de estagnação",
          time: "8 min de infusão",
          temp: "95°C",
          ingredients: [
            "1 colher de chá de cúrcuma fresca ralada (ou 1/2 colher de chá em pó)",
            "1 rodela de gengibre",
            "1 pitada minúscula de pimenta-do-reino preta moída",
            "1 pau de canela",
            "300ml de água"
          ],
          prep: "Ferva a água com o gengibre e a canela por 3 minutos. Desligue o fogo, adicione a cúrcuma e a pitada de pimenta-preta (a piperina ativa a curcumina em até 2000%). Abafe por 5 minutos e coe em pano fino.",
          tip: "Tome morno antes de iniciar sua rotina de 7 minutos de descompressão corporal."
        },
        {
          num: 9,
          name: "Chá de Alecrim Suave & Casca de Maçã",
          target: "Tonificação vascular e combate à sensação de peso",
          time: "7 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 raminho pequeno de alecrim fresco",
            "Casca de 1/2 maçã higienizada",
            "250ml de água"
          ],
          prep: "Aqueça a água com a casca da maçã até ferver. Desligue, junte o alecrim, tampe por 7 minutos. Retire o alecrim para não amargar e sirva.",
          tip: "O alecrim estimula o fluxo linfático de retorno enquanto a maçã acalma o paladar."
        },
        {
          num: 10,
          name: "Ritual Capim-Santo & Hibisco Suave",
          target: "Drenagem equilibrada com profundo relaxamento",
          time: "8 min de infusão",
          temp: "85°C",
          ingredients: [
            "1 colher de sopa de capim-santo (capim-limão) fresco picado",
            "1 colher de café de flores de hibisco seco",
            "250ml de água filtrada"
          ],
          prep: "Macere levemente o capim-santo com a ponta dos dedos para romper as glândulas de óleo essencial. Junte ao hibisco e despeje a água quente. Abafe por 8 minutos e coe.",
          tip: "Combinação perfeita entre o efeito desintoxicante do hibisco e o citral do capim-santo que acalma o ritmo cardíaco."
        },
        {
          num: 11,
          name: "Chá Branco & Jasmim Descafeinado",
          target: "Ação drenante sutil e regeneração celular noturna",
          time: "6 min de infusão",
          temp: "75°C (água morna para quente)",
          ingredients: [
            "1 colher de sobremesa de chá branco descafeinado",
            "1 colher de café de flores secas de jasmim",
            "3 folhas de hortelã",
            "250ml de água"
          ],
          prep: "Deixe a água esfriar por 2 minutos após aquecer (o chá branco queima facilmente). Adicione as folhas e flores, abafe por 6 minutos e filtre.",
          tip: "O chá branco tem a maior concentração de polifenóis protetores dos tecidos conectivos da fáscia."
        },
        {
          num: 12,
          name: "Infusão Pepino & Melissa",
          target: "Hidratação celular intracelular e desinchaço facial",
          time: "8 min de infusão",
          temp: "85°C",
          ingredients: [
            "3 rodelas finas de pepino fresco com casca",
            "1 colher de sopa de folhas de melissa (erva-cidreira verdadeira)",
            "3 gotas de limão",
            "250ml de água"
          ],
          prep: "Faça a infusão da melissa na água quente por 8 minutos. Coe sobre as rodelas de pepino na xícara e finalize com as gotinhas de limão.",
          tip: "Excelente para quem acorda com o rosto, pálpebras e olheiras inchadas pela manhã."
        },
        {
          num: 13,
          name: "Chá de Casca de Abacaxi & Hortelã",
          target: "Ação enzimática contra retenção e inchaço corporal",
          time: "10 min de fervura suave",
          temp: "Decocção em 100°C",
          ingredients: [
            "Casca de 1/4 de abacaxi higienizado com escovinha",
            "1 canela em pau pequena",
            "6 folhas de hortelã fresca",
            "400ml de água"
          ],
          prep: "Ferva a casca do abacaxi e a canela em fogo brando por 10 minutos. Desligue, acrescente a hortelã fresca, tampe por 5 minutos e coe muito bem.",
          tip: "A bromelina presente na casca do abacaxi é uma potente enzima anti-inflamatória e desidratante de edemas."
        },
        {
          num: 14,
          name: "Infusão Urtiga Mansa & Camomila",
          target: "Remineralização dos tecidos e eliminação de líquidos",
          time: "9 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de chá de urtiga desidratada (folhas secas culinárias)",
            "1 colher de sopa de flores de camomila",
            "250ml de água"
          ],
          prep: "Despeje a água fervente sobre a urtiga e a camomila em infusão tampada por 9 minutos. Coe com peneira fina.",
          tip: "A urtiga nutre o tecido fascial com silício e magnésio, enquanto drena fluidos estagnados."
        },
        {
          num: 15,
          name: "Chá de Folhas de Amora Drenante",
          target: "Equilíbrio hídrico feminino e regulação metabólica",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de folhas secas de amora miúra",
            "1 colher de café de sementes de erva-doce",
            "300ml de água filtrada"
          ],
          prep: "Aqueça a água, adicione a folha de amora e a erva-doce levemente prensada. Abafe por 8 minutos e coe.",
          tip: "Especialmente benéfico para mulheres acima de 40 anos que sentem retenção agravada por oscilações hormonais."
        },
        {
          num: 16,
          name: "Blend Laranja Doce & Cavalinha",
          target: "Aroma sedoso e alívio da retenção pós-treino ou caminhada",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "Tiras da casca de 1/2 laranja bahia (sem a parte branca amarga)",
            "1 colher de sobremesa de cavalinha",
            "2 cravos-da-índia",
            "250ml de água"
          ],
          prep: "Ferva a casca de laranja e os cravos por 2 minutos. Apague o fogo, junte a cavalinha, abafe por 6 minutos e coe.",
          tip: "A hesperidina da casca de laranja atua fortalecendo a parede dos capilares linfáticos."
        },
        {
          num: 17,
          name: "Infusão Erva-Cidreira & Gengibre Suave",
          target: "Ativação circulatória sem calor excessivo",
          time: "7 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de folhas de cidreira fresca",
            "1 fatia finíssima de gengibre (espessura de papel)",
            "250ml de água"
          ],
          prep: "Despeje a água quente sobre a cidreira e o gengibre suave. Abafe por 7 minutos e retire a fatia de gengibre antes de consumir.",
          tip: "A dose milimétrica de gengibre aquece o fluxo de linfa sem tirar o sono."
        },
        {
          num: 18,
          name: "Chá de Maçã, Canela & Folha de Louro",
          target: "Drenagem dos tecidos viscerais e sensação de aconchego",
          time: "10 min de fervura suave",
          temp: "100°C",
          ingredients: [
            "1/2 maçã picadinha com casca",
            "1 pau de canela pequeno",
            "1 folha de louro seca",
            "300ml de água"
          ],
          prep: "Coloque todos os ingredientes na panela com água fria e leve ao fogo. Quando ferver, baixe a chama e cozinhe por 5 minutos. Desligue, tampe por mais 5 minutos e coe.",
          tip: "O louro é excelente para desobstruir a linfa abdominal e aliviar o abdômen tenso."
        },
        {
          num: 19,
          name: "Elixir Bétula & Funcho",
          target: "Desinchaço articular de dedos, mãos e pés",
          time: "10 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de chá de folhas secas de bétula",
            "1 colher de sobremesa de sementes de funcho",
            "250ml de água fervente"
          ],
          prep: "Misture a bétula e o funcho na água quente. Mantenha vedado por 10 minutos para liberar os flavonoides drenantes da bétula.",
          tip: "A bétula é conhecida na fitoterapia tradicional europeia como a 'árvore da linfa pura'."
        },
        {
          num: 20,
          name: "Ritual Serenidade Linfática Noturna",
          target: "Sinergia total: desinchaço físico + relaxamento muscular",
          time: "10 min de infusão",
          temp: "88°C",
          ingredients: [
            "1 colher de sopa de camomila romana",
            "1 colher de sobremesa de cavalinha",
            "1 colher de chá de polpa de maracujá fresco",
            "300ml de água filtrada"
          ],
          prep: "Faça a infusão da camomila com a cavalinha por 8 minutos. Coe sobre a colher de polpa de maracujá na xícara e mexa com delicadeza.",
          tip: "O ritual definitivo para encerrar a primeira semana de práticas do Destrava Leve 28D."
        }
      ]
    },
    {
      number: 2,
      title: "Alívio da Barriga Estufada & Gases",
      subtitle: "20 Rituais para esvaziamento gástrico, fim da fermentação pós-jantar e conforto no abdômen",
      recipes: [
        {
          num: 21,
          name: "O Clássico Ventre Plano",
          target: "Eliminação imediata de gases e sensação de barriga inchada",
          time: "7 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sobremesa de erva-doce",
            "1 colher de chá de sementes de funcho",
            "4 folhas de hortelã fresca",
            "250ml de água fervente"
          ],
          prep: "Pressione as sementes de erva-doce e funcho com as costas da colher. Despeje a água fervente e abafe por 5 minutos. Adicione a hortelã nos 2 minutos finais. Coe.",
          tip: "Tome 20 a 30 minutos após o jantar. Os óleos essenciais (anetol) desfazem bolhas gasosas em minutos."
        },
        {
          num: 22,
          name: "Infusão Hortelã-Pimenta & Anis",
          target: "Espasmos intestinais e cólicas de estufamento",
          time: "6 min de infusão",
          temp: "85°C",
          ingredients: [
            "1 colher de sopa de hortelã-pimenta fresca ou seca",
            "1 estrela de anis inteira",
            "250ml de água"
          ],
          prep: "Ferva a água com a estrela de anis por 1 minuto. Desligue, acrescente a hortelã-pimenta, tampe por 5 minutos e coe.",
          tip: "O mentol da hortelã-pimenta atua relaxando diretamente as fibras lisas do trato digestivo."
        },
        {
          num: 23,
          name: "Blend Gengibre Quentinho & Limão",
          target: "Digestão lenta de refeições pesadas",
          time: "8 min de infusão",
          temp: "95°C",
          ingredients: [
            "2 fatias finas de gengibre fresco",
            "1 fatia de limão taiti com casca",
            "1 pitada de canela em pó",
            "250ml de água"
          ],
          prep: "Aqueça a água com o gengibre até ferver. Desligue, adicione a fatia de limão e a pitada de canela. Deixe abafado por 6 minutos antes de coar.",
          tip: "Aumenta o esvaziamento gástrico, impedindo que a comida fermente no estômago durante a noite."
        },
        {
          num: 24,
          name: "Chá de Anis Estrelado & Camomila",
          target: "Alívio suave para barriga dura e dolorida ao toque",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 estrela de anis",
            "1 colher de sopa cheia de flores de camomila",
            "250ml de água"
          ],
          prep: "Coloque a água quente sobre os dois ingredientes e deixe abafado com tampa por 8 minutos exatos. Coe e beba bem morninho.",
          tip: "A camomila atua como calmante gástrico enquanto o anis alivia a pressão diafragmática."
        },
        {
          num: 25,
          name: "Infusão Funcho & Casca de Maçã",
          target: "Intestino preguiçoso e abdômen distendido",
          time: "10 min de infusão",
          temp: "95°C",
          ingredients: [
            "1 colher de sobremesa de funcho",
            "Casca de 1 maçã gala lavada",
            "300ml de água"
          ],
          prep: "Ferva a casca da maçã por 3 minutos na água. Apague o fogo, misture o funcho, abafe por 7 minutos e coe.",
          tip: "A pectina da maçã protege a microbiota intestinal e favorece o trânsito matinal suave."
        },
        {
          num: 26,
          name: "Chá de Louro Digestivo & Canela",
          target: "Sensação de estômago pesado e empachamento",
          time: "5 min de fervura + 5 min de abafe",
          temp: "100°C",
          ingredients: [
            "2 folhas de louro seco (sem os cabinhos)",
            "1 pequeno pedaço de canela em pau",
            "250ml de água filtrada"
          ],
          prep: "Ferva as folhas de louro e a canela em fogo baixo por 5 minutos. Desligue, deixe descansar com tampa por mais 5 minutos e sirva morno.",
          tip: "O louro tem taninos e eugenol que reduzem a formação de gases intestinais em até 60%."
        },
        {
          num: 27,
          name: "Blend Cardamomo & Melissa",
          target: "Flatulência nervosa causada por estresse emocional",
          time: "7 min de infusão",
          temp: "90°C",
          ingredients: [
            "2 bagos de cardamomo verde levemente abertos",
            "1 colher de sopa de folhas de melissa",
            "250ml de água quente"
          ],
          prep: "Abra as vagens de cardamomo para expor as sementinhas pretas. Junte à melissa, despeje a água quente e mantenha coberto por 7 minutos.",
          tip: "Excelente para a 'barriga de estresse', onde o inchaço é piorado pela tensão no plexo solar."
        },
        {
          num: 28,
          name: "Chá de Casca de Maracujá & Erva-Doce",
          target: "Saciedade noturna e desinchaço da gordura visceral",
          time: "8 min de cozimento suave",
          temp: "100°C",
          ingredients: [
            "2 colheres de sopa da parte branca interna da casca de maracujá picada",
            "1 colher de sopa de erva-doce",
            "350ml de água"
          ],
          prep: "Cozinhe a parte branca do maracujá por 8 minutos na água. Desligue, adicione a erva-doce, tampe por 5 minutos e coe.",
          tip: "A parte branca do maracujá é rica em polissacarídeos que alimentam bactérias benéficas e desincham o cólon."
        },
        {
          num: 29,
          name: "Infusão Cidreira & Alecrim Leve",
          target: "Digestão pesada combinada com dor de cabeça pós-jantar",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de capim-cidreira",
            "1 galhinho pequeno de alecrim fresco (cerca de 5cm)",
            "250ml de água"
          ],
          prep: "Despeje a água quente sobre as ervas frescas. Deixe em repouso com tampa por 8 minutos e coe antes que o alecrim amargue.",
          tip: "Desobstrui o fígado e a vesícula, aliviando a queimação e o refluxo leve noturno."
        },
        {
          num: 30,
          name: "Chá de Coentro em Grãos Tostados",
          target: "Eliminação de gases profundos e desintoxicação",
          time: "8 min de infusão",
          temp: "95°C",
          ingredients: [
            "1 colher de chá de sementes de coentro secas",
            "1 tira de casca de limão",
            "250ml de água fervente"
          ],
          prep: "Aqueça uma frigideira seca por 30 segundos e toste levemente as sementes de coentro até soltarem aroma (não deixe queimar). Despeje a água quente e a casca de limão, abafe por 8 minutos e coe.",
          tip: "O coentro em grãos tem sabor amendoado cítrico delicioso, completamente diferente das folhas frescas."
        },
        {
          num: 31,
          name: "Blend Manjericão & Hortelã",
          target: "Espasmos digestivos e sensação de nó no estômago",
          time: "6 min de infusão",
          temp: "85°C",
          ingredients: [
            "5 folhas de manjericão fresco limpo",
            "5 folhas de hortelã fresca",
            "250ml de água quente"
          ],
          prep: "Rasgue as folhas com as mãos para liberar o linalol. Cubra com a água aquecida e abafe por 6 minutos.",
          tip: "O linalol do manjericão atua no sistema nervoso entérico (o 'segundo cérebro' no intestino)."
        },
        {
          num: 32,
          name: "Chá de Cominho Suave & Camomila",
          target: "Fermentação abdominal intensa após leguminosas (feijão/grão-de-bico)",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 pitada leve (1/3 colher de café) de sementes de cominho",
            "1 colher de sopa de camomila",
            "250ml de água"
          ],
          prep: "Misture as sementes de cominho com a camomila. Cubra com água fervente e deixe abafado por 8 minutos.",
          tip: "O cominho é o antídoto natural mais eficaz da medicina ayurvédica contra gases causados por feijões e fibras duras."
        },
        {
          num: 33,
          name: "Infusão Camomila, Maçã & Baunilha",
          target: "Acalmar a fome emocional noturna e desinchar a barriga",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de camomila",
            "3 rodelas finas de maçã",
            "2 gotas de extrato puro de baunilha",
            "250ml de água quente"
          ],
          prep: "Deixe a camomila e a maçã em infusão abafada por 8 minutos. Adicione as 2 gotas de baunilha na xícara antes de servir.",
          tip: "O aroma da baunilha desliga a vontade incontrolável de comer doces após o jantar."
        },
        {
          num: 34,
          name: "Chá de Gengibre & Pera Suave",
          target: "Digestão suave e hidratação das mucosas gástricas",
          time: "6 min de infusão",
          temp: "90°C",
          ingredients: [
            "2 fatias de pera madura com casca",
            "1 lâmina fina de gengibre",
            "1 ramo de hortelã",
            "250ml de água"
          ],
          prep: "Ferva a água com o gengibre e a pera por 2 minutos. Desligue, junte a hortelã e deixe abafado por 5 minutos.",
          tip: "A pera contém sorbitol e fibras solúveis que lubrificam o intestino sem causar irritação."
        },
        {
          num: 35,
          name: "Infusão Espinheira-Santa & Melissa",
          target: "Azia, queimação no peito e refluxo noturno",
          time: "10 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sobremesa de folhas secas de espinheira-santa",
            "1 colher de sopa de melissa",
            "300ml de água fervente"
          ],
          prep: "Despeje a água fervente sobre a espinheira-santa e a melissa. Mantenha em infusão com tampa por 10 minutos e coe.",
          tip: "Cria uma película protetora na parede estomacal, impedindo o refluxo de subir para a garganta durante o sono."
        },
        {
          num: 36,
          name: "Chá Flor de Laranjeira & Erva-Doce",
          target: "Tensão diafragmática e digestão nervosa",
          time: "8 min de infusão",
          temp: "85°C",
          ingredients: [
            "1 colher de chá de flores de laranjeira secas",
            "1 colher de sobremesa de erva-doce",
            "250ml de água"
          ],
          prep: "Coloque as flores e a erva-doce na água quente, cubra com tampa e deixe por 8 minutos. Filtre suavemente.",
          tip: "As flores de laranjeira soltam o nó muscular que costuma se formar na 'boca do estômago'."
        },
        {
          num: 37,
          name: "Blend Pós-Jantar de Hortelã, Gengibre & Limão",
          target: "Esvaziamento rápido para quem janta tarde",
          time: "5 min de infusão",
          temp: "95°C",
          ingredients: [
            "8 folhas de hortelã fresca",
            "1 lâmina de gengibre",
            "Suco de 1/2 limão",
            "200ml de água fervente"
          ],
          prep: "Despeje a água quente sobre a hortelã e o gengibre. Abafe por 5 minutos, coe e misture o limão espremido na hora.",
          tip: "Ideal para tomar quando você foi forçada a jantar menos de 2 horas antes de ir para a cama."
        },
        {
          num: 38,
          name: "Chá de Folha de Louro & Maçã Verde",
          target: "Desestufamento rápido e controle glicêmico noturno",
          time: "7 min de cozimento brando",
          temp: "100°C",
          ingredients: [
            "2 folhas de louro seco",
            "1/2 maçã verde picada com casca",
            "300ml de água"
          ],
          prep: "Cozinhe o louro e a maçã verde em fogo baixo por 5 minutos. Desligue, abafe por 5 minutos e coe.",
          tip: "O ácido málico da maçã verde potencializa a eliminação de fluidos acumulados nas vísceras."
        },
        {
          num: 39,
          name: "Infusão Funcho & Toque de Noz-Moscada",
          target: "Acalmar cólicas e relaxar o assoalho pélvico",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de sementes de funcho",
            "1 raladinha muito suave de noz-moscada (cerca de 1/4 de colher de café)",
            "250ml de água"
          ],
          prep: "Esmague o funcho, adicione a noz-moscada e junte a água quente. Mantenha abafado por 8 minutos e filtre.",
          tip: "A miristicina da noz-moscada promove sonolência suave enquanto o funcho remove a pressão pélvica."
        },
        {
          num: 40,
          name: "Ritual Ventre Leve Supremo",
          target: "O protocolo de ouro contra barriga estufada",
          time: "10 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sobremesa de erva-doce",
            "1 estrela de anis",
            "4 folhas de hortelã fresca",
            "5 gotas de extrato de própolis verde",
            "300ml de água"
          ],
          prep: "Faça a infusão da erva-doce, anis e hortelã por 10 minutos. Coe na xícara, espere amornar ligeiramente e pingue o própolis.",
          tip: "O própolis verde atua como bactericida seletivo, inibindo bactérias que fermentam em excesso no intestino grosso."
        }
      ]
    },
    {
      number: 3,
      title: "Desativação do Nervo Vago & Sono Profundo",
      subtitle: "20 Rituais para silenciar pensamentos acelerados, baixar o cortisol e restaurar a calma no sistema nervoso",
      recipes: [
        {
          num: 41,
          name: "Ritual Mulungu Silencioso",
          target: "Indução de sono pesado para insônia e mente inquieta",
          time: "10 min de fervura leve",
          temp: "100°C",
          ingredients: [
            "1 colher de sobremesa de cascas de mulungu",
            "1 colher de sopa de melissa",
            "300ml de água"
          ],
          prep: "Ferva as cascas de mulungu na água por 5 minutos. Desligue, acrescente a melissa, abafe por mais 5 minutos e coe com peneira fina.",
          tip: "O mulungu atua nos receptores GABA do cérebro, desligando o 'modo de alerta' do corpo em 30 minutos."
        },
        {
          num: 42,
          name: "Infusão Maracujá & Camomila dos Sonhos",
          target: "Acalmar palpitações no peito e ansiedade noturna",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de folhas secas de passiflora (folhas de maracujá)",
            "1 colher de sopa cheia de camomila romana",
            "250ml de água filtrada"
          ],
          prep: "Coloque as folhas e as flores na água quente. Vede o recipiente por 8 minutos e coe com delicadeza.",
          tip: "A passiflora desacelera os batimentos cardíacos, sinalizando segurança física para o nervo vago."
        },
        {
          num: 43,
          name: "Chá Lavanda Noturna & Erva-Cidreira",
          target: "Alívio de tensão nos maxilares e ranger de dentes",
          time: "7 min de infusão",
          temp: "85°C",
          ingredients: [
            "1 colher de café rasa de flores de lavanda culinária secas",
            "1 colher de sopa de erva-cidreira fresca picada",
            "250ml de água"
          ],
          prep: "Aqueça a água sem ferver. Despeje sobre a lavanda e a cidreira. Abafe por 7 minutos e coe.",
          tip: "Não exagere na lavanda: uma dose pequena solta a mandíbula e relaxa os músculos da face."
        },
        {
          num: 44,
          name: "Blend Valeriana Suave & Maçã",
          target: "Pessoas que acordam várias vezes de madrugada",
          time: "10 min de infusão",
          temp: "95°C",
          ingredients: [
            "1/2 colher de chá de raiz picada de valeriana",
            "Casca de 1/2 maçã vermelha",
            "1 pitada de canela",
            "250ml de água"
          ],
          prep: "Ferva a valeriana com a casca de maçã por 3 minutos. Desligue o fogo, adicione a canela e abafe por 7 minutos.",
          tip: "A maçã e a canela suavizam o cheiro terroso característico da raiz de valeriana."
        },
        {
          num: 45,
          name: "Infusão Folha de Maracujá & Erva-Doce",
          target: "Corpo tenso com respiração curta e superficial",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de folhas de passiflora",
            "1 colher de sobremesa de erva-doce",
            "250ml de água"
          ],
          prep: "Esmague a erva-doce, adicione as folhas de passiflora e despeje a água fervente. Abafe por 8 minutos.",
          tip: "Tome realizando 5 respirações lentas e profundas, expandindo o abdômen ao inspirar."
        },
        {
          num: 46,
          name: "Chá Melatonina de Cereja & Camomila",
          target: "Estímulo à produção natural do hormônio do sono",
          time: "8 min de infusão",
          temp: "88°C",
          ingredients: [
            "3 cerejas frescas sem caroço picadas (ou amoras frescas)",
            "1 colher de sopa de camomila",
            "250ml de água quente"
          ],
          prep: "Abafe a camomila na água quente por 8 minutos. Coe sobre as frutinhas levemente esmagadas no fundo da xícara.",
          tip: "Cerejas e amoras vermelhas contêm fitomelatonina biodisponível que avisa a glândula pineal que é hora de dormir."
        },
        {
          num: 47,
          name: "Blend Serenidade Vagal",
          target: "Desativação de sobrecarga sensorial após usar muito o celular ou computador",
          time: "8 min de infusão",
          temp: "85°C",
          ingredients: [
            "1 colher de sobremesa de melissa",
            "1/2 colher de café de flores de lavanda",
            "1 raladinha sutil de noz-moscada",
            "250ml de água"
          ],
          prep: "Coloque todos os ingredientes na xícara, derrame a água aquecida, cubra com um pratinho por 8 minutos e coe.",
          tip: "Beba com as luzes do quarto em meia-luz para criar o ambiente visual perfeito para o sono."
        },
        {
          num: 48,
          name: "Chá Flor de Tília & Casca de Laranja",
          target: "Acalmar palpitações nervosas e suores noturnos",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sobremesa de folhas e flores de tília",
            "Tiras de casca de 1/2 laranja bahia (sem a parte branca)",
            "250ml de água"
          ],
          prep: "Deixe a tília e a casca de laranja em infusão abafada por 8 minutos. Sirva morno.",
          tip: "A tília é o calmante clássico da fitoterapia francesa para desacelerar o ritmo cardíaco agitado."
        },
        {
          num: 49,
          name: "Chá Leite Dourado da Camomila",
          target: "Aconchego emocional profundo e relaxamento muscular",
          time: "7 min de preparo",
          temp: "80°C",
          ingredients: [
            "150ml de chá de camomila bem concentrado",
            "100ml de leite vegetal de aveia ou amêndoas morno",
            "1 pitada de canela em pó"
          ],
          prep: "Faça o chá de camomila forte (2 colheres em 150ml de água por 7 min). Misture o leite vegetal morno e polvilhe canela por cima.",
          tip: "Aquece o estômago e induz uma sensação de segurança infantil reconfortante antes de dormir."
        },
        {
          num: 50,
          name: "Chá Menta Suave & Maracujá",
          target: "Sensação de cabeça quente e cansaço mental acumulado",
          time: "7 min de infusão",
          temp: "85°C",
          ingredients: [
            "6 folhas de hortelã ou menta fresca",
            "1 colher de sobremesa de folhas secas de maracujá",
            "250ml de água"
          ],
          prep: "Cubra as ervas com água quente por 7 minutos, tampe com um pires e coe.",
          tip: "Traz uma sensação refrescante para a cabeça enquanto o maracujá desacelera o corpo."
        },
        {
          num: 51,
          name: "Blend Macela Dourada & Capim-Santo",
          target: "Dores de estômago causadas por estresse crônico",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de flores de macela",
            "1 colher de sobremesa de capim-santo fresco picado",
            "250ml de água"
          ],
          prep: "Despeje a água aquecida sobre a macela e o capim-santo. Mantenha abafado por 8 minutos e coe.",
          tip: "A macela é tradicional no sul do Brasil por desarmar a tensão visceral e a gastrite nervosa."
        },
        {
          num: 52,
          name: "Infusão Anis & Lavanda Calmante",
          target: "Soltura de suspiros frequentes e sensação de aperto no peito",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 estrela de anis",
            "1/2 colher de chá de lavanda seca",
            "250ml de água"
          ],
          prep: "Abafe o anis e a lavanda na água recém-fervida por 8 minutos. Beba devagar, inalando o vapor aromático.",
          tip: "Inale o vapor antes do primeiro gole. A via olfativa atinge a amígdala cerebral em frações de segundo."
        },
        {
          num: 53,
          name: "Chá Sálvia Suave & Gotas de Mel",
          target: "Regulação da sudorese noturna e fogachos",
          time: "7 min de infusão",
          temp: "85°C",
          ingredients: [
            "4 folhas frescas de sálvia",
            "1 colher de café de mel puro",
            "250ml de água"
          ],
          prep: "Abafe as folhas de sálvia na água aquecida por 7 minutos. Coe e dissolva a colher de mel.",
          tip: "A sálvia atua diretamente no centro termorregulador do hipotálamo, aliviando calores noturnos."
        },
        {
          num: 54,
          name: "Blend Calmaria Absoluta",
          target: "Para dias de estresse extremo ou discussões difíceis",
          time: "10 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sobremesa de camomila",
            "1 colher de café de cascas de mulungu",
            "1 colher de chá de melissa",
            "Tira de casca de limão",
            "300ml de água"
          ],
          prep: "Ferva o mulungu na água por 3 minutos. Desligue, coloque a camomila, melissa e a casca de limão. Abafe por 7 minutos e filtre.",
          tip: "Um verdadeiro escudo natural que zera o estresse e desliga o estado de luta ou fuga."
        },
        {
          num: 55,
          name: "Chá de Noz-Moscada & Canela Quentinha",
          target: "Pés e mãos frias que impedem o corpo de adormecer",
          time: "5 min de fervura suave",
          temp: "100°C",
          ingredients: [
            "1 pequeno pedaço de canela em pau",
            "1 pitadinha de noz-moscada ralada",
            "250ml de água filtrada"
          ],
          prep: "Ferva a canela por 4 minutos. Desligue, junte a pitadinha de noz-moscada, tampe por 3 minutos e tome bem quentinho.",
          tip: "Aquece a circulação periférica de pés e mãos, facilitando a queda da temperatura central necessária para o sono."
        },
        {
          num: 56,
          name: "Infusão Noturna Alecrim & Melissa",
          target: "Cansaço mental com corpo físico agitado",
          time: "7 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 raminho muito fino de alecrim",
            "1 colher de sopa cheia de melissa fresca",
            "250ml de água"
          ],
          prep: "Despeje a água quente sobre a melissa e o alecrim. Deixe abafado por 7 minutos. Retire as ervas.",
          tip: "A melissa equilibra o alecrim, criando um estado de foco tranquilo e relaxamento corporal."
        },
        {
          num: 57,
          name: "Chá Hipnótico de Passiflora & Laranja Doce",
          target: "Para quem acorda às 3h ou 4h da manhã com a cabeça ligada",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de passiflora seca",
            "Casca de 1/2 laranja doce",
            "1 cravo-da-índia",
            "250ml de água"
          ],
          prep: "Ferva a casca de laranja com o cravo por 2 minutos. Desligue, adicione a passiflora e abafe por 6 minutos.",
          tip: "Mantém os níveis de ácido gama-aminobutírico (GABA) estáveis no cérebro por até 6 horas de sono contínuo."
        },
        {
          num: 58,
          name: "Blend Desacelera Coração",
          target: "Tensão torácica e respiração curta ao se deitar",
          time: "8 min de infusão",
          temp: "88°C",
          ingredients: [
            "1 colher de sobremesa de flores de tília",
            "1 colher de sobremesa de capim-cidreira",
            "1 colher de chá de camomila",
            "300ml de água"
          ],
          prep: "Junte as três ervas e despeje a água aquecida. Abafe por 8 minutos e coe em seguida.",
          tip: "Favorece o tônus vagal e a variabilidade da frequência cardíaca durante a fase de sono não-REM."
        },
        {
          num: 59,
          name: "Chá Relaxante de Verbena & Hortelã Doce",
          target: "Rigidez na nuca e nos ombros acumulada no dia",
          time: "7 min de infusão",
          temp: "85°C",
          ingredients: [
            "1 colher de sobremesa de folhas de lúcia-lima (verbena)",
            "4 folhas de hortelã doce fresca",
            "250ml de água"
          ],
          prep: "Coloque as folhas em água recém-aquecida, tampe por 7 minutos e filtre.",
          tip: "A verbena tem ação miorrelaxante, aliviando a tensão isométrica nos trapézios."
        },
        {
          num: 60,
          name: "Ritual Apagão Noturno",
          target: "A receita suprema para noites de insônia rebelde",
          time: "10 min de preparo",
          temp: "95°C",
          ingredients: [
            "1 colher de café de mulungu",
            "1 colher de sobremesa de passiflora",
            "1 colher de sopa de camomila",
            "3 gotas de extrato puro de baunilha",
            "300ml de água"
          ],
          prep: "Ferva o mulungu por 3 minutos na água. Apague o fogo, misture a passiflora e a camomila. Deixe vedado com prato por 7 minutos. Coe e adicione a baunilha.",
          tip: "Tome 30 minutos antes de se deitar, já com o celular desligado. É a fórmula mais potente do e-book."
        }
      ]
    },
    {
      number: 4,
      title: "Desinflamação da Fáscia & Alívio de Tensões",
      subtitle: "20 Rituais para desinflamar o tecido conjuntivo, soltar nós de dor na lombar, quadril e articulações",
      recipes: [
        {
          num: 61,
          name: "O Ouro Dourado da Fáscia",
          target: "Rigidez matinal e dores articulares difusas",
          time: "8 min de infusão",
          temp: "95°C",
          ingredients: [
            "1 colher de chá de cúrcuma pura em pó",
            "1 fatia de gengibre fresco",
            "1 pau de canela pequeno",
            "1 pitada de pimenta-preta moída",
            "300ml de água"
          ],
          prep: "Ferva o gengibre e a canela por 3 minutos. Desligue, junte a cúrcuma e a pimenta-preta. Abafe por 5 minutos e coe com filtro de pano.",
          tip: "A curcumina inibe as citocinas pró-inflamatórias (IL-6 e TNF-alfa) que deixam a fáscia enrijecida."
        },
        {
          num: 62,
          name: "Chá de Casca de Maçã, Canela & Cravo",
          target: "Alívio de dor e cansaço lombar após dia de esforço",
          time: "10 min de fervura suave",
          temp: "100°C",
          ingredients: [
            "Casca de 1 maçã vermelha bem limpa",
            "1 pau de canela",
            "3 cravos-da-índia",
            "300ml de água"
          ],
          prep: "Cozinhe em fogo baixo por 6 minutos todos os ingredientes. Desligue, tampe por mais 4 minutos e coe.",
          tip: "O eugenol do cravo atua como analgésico natural suave no sistema muscular profundo."
        },
        {
          num: 63,
          name: "Blend Alecrim & Limão Anti-Rigidez",
          target: "Dores na coluna dorsal e rigidez nas escápulas",
          time: "7 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 raminho de alecrim fresco (cerca de 6cm)",
            "1 rodela grossa de limão siciliano ou taiti",
            "250ml de água"
          ],
          prep: "Despeje a água fervente sobre o alecrim e a rodela de limão. Cubra com tampa por 7 minutos, retire o alecrim e beba morno.",
          tip: "O ácido rosmarínico presente no alecrim neutraliza radicais livres que oxidam os tecidos fascias."
        },
        {
          num: 64,
          name: "Infusão Cavalinha & Cúrcuma",
          target: "Remodelação do colágeno fascial e flexibilidade",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sobremesa de cavalinha",
            "1/2 colher de café de cúrcuma",
            "1 pitada de pimenta-preta",
            "250ml de água"
          ],
          prep: "Aqueça a água, acrescente a cavalinha, cúrcuma e a pimentinha. Abafe por 8 minutos e coe.",
          tip: "A cavalinha fornece silício orgânico, mineral chave para a elasticidade e hidratação da fáscia."
        },
        {
          num: 65,
          name: "Chá de Gengibre, Anis & Cravo",
          target: "Sensação de corpo enferrujado e estalos articulares",
          time: "8 min de cozimento brando",
          temp: "100°C",
          ingredients: [
            "2 fatias de gengibre fresco",
            "1 estrela de anis",
            "2 cravos-da-índia",
            "300ml de água"
          ],
          prep: "Ferva em fogo brando por 5 minutos. Desligue, deixe abafado por 3 minutos adicionais e coe.",
          tip: "Aquece profundamente os meridianos corporais, facilitando o relaxamento fascial noturno."
        },
        {
          num: 66,
          name: "Blend Casca de Romã & Camomila",
          target: "Desinflamação tecidual profunda e rejuvenescimento",
          time: "10 min de infusão",
          temp: "95°C",
          ingredients: [
            "1 colher de chá de casca de romã seca picadinha",
            "1 colher de sopa de flores de camomila",
            "250ml de água"
          ],
          prep: "Ferva a casca de romã por 2 minutos. Desligue, junte a camomila, tampe por 8 minutos e filtre.",
          tip: "A casca de romã tem punicalaginas, um dos antioxidantes mais potentes conhecidos pela ciência médica."
        },
        {
          num: 67,
          name: "Chá Anti-Espasmo de Tomilho & Mel",
          target: "Contraturas musculares nos ombros e trapézio",
          time: "7 min de infusão",
          temp: "88°C",
          ingredients: [
            "1 raminho de tomilho fresco",
            "1 colher de café de mel silvestre",
            "250ml de água filtrada"
          ],
          prep: "Despeje a água quente sobre o tomilho. Abafe por 7 minutos, coe e dissolva o mel antes de servir.",
          tip: "O timol do tomilho atua diretamente na descompressão das fibras musculares estressadas."
        },
        {
          num: 68,
          name: "Infusão Folha de Amora & Cúrcuma",
          target: "Alívio de dores nas pernas e articulações femininas",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de folhas secas de amora",
            "1/2 colher de café de açafrão em pó",
            "1 pitada de pimenta-do-reino",
            "300ml de água"
          ],
          prep: "Misture as folhas de amora com a cúrcuma e a pimenta na água recém-fervida. Deixe tampado por 8 minutos.",
          tip: "Ajuda a regular o estrogênio natural e reduz a inflamação nas articulações dos joelhos e quadris."
        },
        {
          num: 69,
          name: "Chá Dente-de-Leão com Gengibre",
          target: "Eliminação de ácido úrico e toxinas que endurecem tendões",
          time: "8 min de infusão",
          temp: "92°C",
          ingredients: [
            "1 colher de chá de folhas ou raiz de dente-de-leão",
            "1 fatia de gengibre fresco",
            "250ml de água"
          ],
          prep: "Ferva o gengibre por 2 minutos. Desligue, adicione o dente-de-leão, tampe por 6 minutos e filtre.",
          tip: "Promove uma limpeza celular profunda nos tecidos conjuntivos estagnados."
        },
        {
          num: 70,
          name: "Blend Orégano Fresco & Limão",
          target: "Dores de cabeça tensionais que sobem do pescoço",
          time: "6 min de infusão",
          temp: "85°C",
          ingredients: [
            "1 colher de sobremesa de folhas de orégano fresco (ou 1 colher de chá do seco)",
            "Suco de meio limão fresco",
            "250ml de água"
          ],
          prep: "Abafe o orégano na água quente por 6 minutos. Coe e finalize com o suco de limão espremido.",
          tip: "O carvacrol do orégano tem potente ação anti-inflamatória e alivia tensões occipitais."
        },
        {
          num: 71,
          name: "Chá de Canela do Ceilão & Casca de Laranja",
          target: "Aquecimento corporal e soltura de rigidez postural",
          time: "8 min de infusão",
          temp: "95°C",
          ingredients: [
            "1 pau de canela",
            "Tiras de casca de 1/2 laranja",
            "250ml de água"
          ],
          prep: "Ferva a canela e a casca de laranja por 3 minutos. Desligue, abafe por 5 minutos e sirva morno.",
          tip: "O cinamaldeído melhora a microcirculação periférica da fáscia superficial."
        },
        {
          num: 72,
          name: "Infusão Hortelã, Cúrcuma & Pimenta Rosa",
          target: "Alívio de dor fascial após esforço físico ou faxina",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "6 folhas de hortelã fresca",
            "1/2 colher de chá de cúrcuma",
            "3 grãos de pimenta rosa levemente esmagados",
            "250ml de água"
          ],
          prep: "Junte a cúrcuma e a pimenta rosa na água fervente. Abafe por 5 minutos, acrescente a hortelã nos últimos 3 minutos e filtre.",
          tip: "A pimenta rosa é aromática e rica em antioxidantes que aceleram a recuperação de microfissuras."
        },
        {
          num: 73,
          name: "Chá Fortalecedor de Urtiga & Alecrim",
          target: "Nutrição de colágeno e desinflamação lombar",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sobremesa de urtiga seca",
            "1 galhinho pequeno de alecrim",
            "250ml de água"
          ],
          prep: "Despeje a água aquecida sobre a urtiga e o alecrim, tampe por 8 minutos e coe com peneira fina.",
          tip: "Fornece minerais bioativos essenciais para a saúde dos discos intervertebrais da coluna."
        },
        {
          num: 74,
          name: "Blend Camomila, Gengibre & Mel",
          target: "Alívio dores musculares gerais e estresse físico",
          time: "8 min de infusão",
          temp: "90°C",
          ingredients: [
            "1 colher de sopa de camomila",
            "1 lâmina fina de gengibre",
            "1 colher de café de mel",
            "250ml de água"
          ],
          prep: "Abafe o gengibre e a camomila em água quente por 8 minutos. Coe e dissolva o mel na xícara morna.",
          tip: "Combina o relaxamento neuroquímico da camomila com a ação anti-prostaglandinas do gengibre."
        },
        {
          num: 75,
          name: "Chá de Cravo-da-Índia & Erva-Doce",
          target: "Tensão na mandíbula e peso na musculatura do quadril",
          time: "7 min de cozimento suave",
          temp: "100°C",
          ingredients: [
            "4 cravos-da-índia",
            "1 colher de sobremesa de erva-doce",
            "250ml de água"
          ],
          prep: "Ferva os cravos na água por 3 minutos. Desligue o fogo, misture a erva-doce, abafe por 4 minutos e coe.",
          tip: "Analgésico natural com aroma suave que prepara o corpo para relaxar na cama."
        },
        {
          num: 76,
          name: "Infusão Casca de Melancia & Canela",
          target: "Redução de edemas inflamatórios nas pernas e pés",
          time: "8 min de fervura",
          temp: "100°C",
          ingredients: [
            "3 cubos da casca branca da melancia",
            "1 pedaço de canela em pau",
            "300ml de água"
          ],
          prep: "Ferva a casca de melancia e a canela por 8 minutos em fogo brando. Coe e beba morninho.",
          tip: "Reduz o inchaço acumulado nos tornozelos ao final de dias quentes ou cansativos."
        },
        {
          num: 77,
          name: "Chá de Louro, Gengibre & Limão",
          target: "Dores articulares causadas por mudanças bruscas de tempo/frio",
          time: "7 min de fervura",
          temp: "100°C",
          ingredients: [
            "2 folhas de louro",
            "1 fatia de gengibre fresco",
            "Suco de meio limão",
            "250ml de água"
          ],
          prep: "Ferva o louro e o gengibre por 4 minutos. Apague o fogo, tampe por 3 minutos, coe e misture o limão.",
          tip: "Aquece a circulação profunda dos ossos e alivia a sensação de rigidez nos joelhos."
        },
        {
          num: 78,
          name: "Blend Sálvia & Camomila Restauradora",
          target: "Desinflamação geral para quem pratica exercícios e sente dores",
          time: "8 min de infusão",
          temp: "88°C",
          ingredients: [
            "3 folhas de sálvia fresca",
            "1 colher de sopa de camomila",
            "250ml de água"
          ],
          prep: "Deixe as ervas em infusão com tampa por 8 minutos na água recém-fervida. Coe e sirva morno.",
          tip: "Acelera a cicatrização de microtraumas nos tecidos após esforços e caminhadas."
        },
        {
          num: 79,
          name: "Chá Casca de Abacaxi, Canela & Alecrim",
          target: "O coquetel anti-edema e regenerador da fáscia",
          time: "10 min de fervura leve",
          temp: "100°C",
          ingredients: [
            "Casca de 1/4 de abacaxi bem higienizada",
            "1 pau de canela",
            "1 raminho de alecrim",
            "400ml de água"
          ],
          prep: "Ferva o abacaxi e a canela por 8 minutos. Desligue, junte o alecrim, abafe por 4 minutos e coe.",
          tip: "Potente combinação de enzimas que dissolvem a densificação da fáscia travada."
        },
        {
          num: 80,
          name: "Ritual Reset Fascial Noturno",
          target: "O ritual definitivo para soltar o corpo todo antes de dormir",
          time: "10 min de infusão",
          temp: "95°C",
          ingredients: [
            "1 colher de chá de cúrcuma fresca ralada",
            "1 lâmina de gengibre",
            "1 colher de sopa de melissa",
            "1 pitadinha de pimenta-preta",
            "5 gotas de própolis",
            "300ml de água"
          ],
          prep: "Ferva o gengibre na água por 2 minutos. Desligue, adicione a cúrcuma, a melissa e a pimenta. Abafe por 7 minutos, coe na xícara e pingue o própolis.",
          tip: "A fórmula mestra para complementar a sessão de 7 minutos do Destrava Leve."
        }
      ]
    },
    {
      number: 5,
      title: "Shots & Rituais Turbo de 3 Minutos",
      subtitle: "20 Fórmulas concentradas express para dias corridos sem tempo de fazer infusões demoradas",
      recipes: [
        {
          num: 81,
          name: "Shot Dourado Noturno",
          target: "Anti-inflamatório instantâneo tomado em 1 gole",
          time: "2 minutos de preparo",
          temp: "Morno",
          ingredients: [
            "50ml de água morna filtrada",
            "1/2 colher de café de cúrcuma pura",
            "10 gotas de extrato de própolis",
            "Suco de 1/2 limão espremido"
          ],
          prep: "Misture vigorosamente todos os ingredientes em um copinho de dose pequena e tome de uma só vez.",
          tip: "Tome 20 minutos antes de dormir para absorção imediata no estômago vazio."
        },
        {
          num: 82,
          name: "Shot Vinagre de Maçã & Canela",
          target: "Equilíbrio glicêmico e fim do estufamento de doces",
          time: "1 minuto",
          temp: "Temperatura ambiente",
          ingredients: [
            "40ml de água",
            "1 colher de sobremesa de vinagre de maçã orgânico com madre",
            "1 pitada de canela em pó"
          ],
          prep: "Misture com uma colher de café e beba imediatamente.",
          tip: "O ácido acético reduz o pico de insulina noturno e impede o acúmulo de gordura visceral."
        },
        {
          num: 83,
          name: "Infusão Express de Hortelã na Caneca",
          target: "Digestão expressa para quando você acabou de jantar",
          time: "3 minutos",
          temp: "Fervente",
          ingredients: [
            "8 folhas de hortelã fresca lavada",
            "200ml de água fervente direto da chaleira",
            "1 pires para abafar"
          ],
          prep: "Rasgue as folhas na caneca, despeje a água fervente por cima e cubra com o pires por 3 minutos. Beba sem coar.",
          tip: "Sem sujeira de panela nem coador: direto na xícara em 3 minutos."
        },
        {
          num: 84,
          name: "Shot Anti-Inchaço de Gengibre & Limão",
          target: "Drenagem rápida após dia de pés inchados",
          time: "2 minutos",
          temp: "Morno",
          ingredients: [
            "40ml de água morna",
            "1 colher de café de gengibre ralado espremido (só o caldinho)",
            "Suco de 1/2 limão taiti"
          ],
          prep: "Rale o gengibre e aperte com os dedos sobre o copinho para soltar o sumo puro. Adicione o limão e a água morna. Tome em um gole.",
          tip: "Ativa a circulação linfática instantaneamente."
        },
        {
          num: 85,
          name: "Elixir Erva-Doce Express",
          target: "Gases incômodos que surgem de repente à noite",
          time: "3 minutos",
          temp: "Quente",
          ingredients: [
            "1 colher de chá de sementes de erva-doce",
            "150ml de água fervente"
          ],
          prep: "Amasse as sementes no fundo da caneca com o cabo de uma faca ou colher. Despeje água fervente, abafe por 3 minutos e beba.",
          tip: "Ao quebrar as sementes, os óleos essenciais se misturam na água em tempo recorde."
        },
        {
          num: 86,
          name: "Shot Vagal de Própolis & Camomila",
          target: "Desaceleração do coração e alívio de angústia",
          time: "2 minutos",
          temp: "Morno",
          ingredients: [
            "40ml de chá de camomila forte (ou água morna)",
            "15 gotas de extrato de própolis verde"
          ],
          prep: "Pingue o própolis na água morna, mexa e beba de uma só vez.",
          tip: "O própolis tem bioflavonoides calmantes que agem no eixo intestino-cérebro."
        },
        {
          num: 87,
          name: "Infusão a Frio Pepino & Hortelã (Cold Brew)",
          target: "Refresco drenante para noites muito quentes de verão",
          time: "Pronta na geladeira",
          temp: "Gelado/Fresco",
          ingredients: [
            "4 rodelas de pepino",
            "6 folhas de hortelã",
            "1 rodela de limão",
            "300ml de água gelada"
          ],
          prep: "Coloque tudo em uma garrafinha ou copo tampado pela manhã ou à tarde na geladeira. À noite, tome esse elixir geladinho.",
          tip: "A extração a frio preserva 100% da vitamina C e dos eletrólitos das folhas."
        },
        {
          num: 88,
          name: "Shot Linfático de Salsa & Limão",
          target: "Eliminação imediata de retenção nos tornozelos",
          time: "2 minutos",
          temp: "Ambiente",
          ingredients: [
            "Suco de 1 limão",
            "1 colher de sopa de sumo concentrado de salsa fresca",
            "30ml de água"
          ],
          prep: "Esprema a salsa e o limão, misture com a água e tome em jejum noturno (2 horas após o jantar).",
          tip: "Efeito diurético suave que não te faz acordar no meio da noite para ir ao banheiro."
        },
        {
          num: 89,
          name: "Elixir Rápido Canela & Mel Noturno",
          target: "Fome de doce e sensação de frio no corpo",
          time: "1 minuto",
          temp: "Morno",
          ingredients: [
            "100ml de água morna",
            "1/2 colher de café de canela em pó pura",
            "1/2 colher de café de mel puro"
          ],
          prep: "Dissolva a canela e o mel na água morna até ficar homogêneo e beba.",
          tip: "Aquece a circulação e estabiliza a glicose enquanto você dorme."
        },
        {
          num: 90,
          name: "Shot Cúrcuma & Pimenta Preta Express",
          target: "Prevenção de dor lombar matinal",
          time: "1 minuto",
          temp: "Morno",
          ingredients: [
            "40ml de água morna",
            "1/2 colher de café de cúrcuma",
            "1 pitada mínima de pimenta-preta moída"
          ],
          prep: "Mexa rápido com a colher e engula em um gole só.",
          tip: "Age nas articulações durante as 8 horas de repouso na cama."
        },
        {
          num: 91,
          name: "Infusão Sachê Turbo Duplo",
          target: "A praticidade máxima usando sachês de supermercado",
          time: "4 minutos",
          temp: "Fervente",
          ingredients: [
            "1 sachê de chá de camomila",
            "1 sachê de chá de hortelã",
            "250ml de água quente"
          ],
          prep: "Mergulhe os dois sachês juntos na mesma caneca de água fervente. Pressione com a colher contra a borda e abafe por 4 minutos.",
          tip: "A sinergia entre camomila e hortelã é comprovadamente superior a cada uma isolada."
        },
        {
          num: 92,
          name: "Shot Calmante de Maracujá Puro",
          target: "Irritabilidade e cansaço mental extremo",
          time: "2 minutos",
          temp: "Ambiente",
          ingredients: [
            "Polpa de 1/2 maracujá fresco com sementes",
            "50ml de água morna"
          ],
          prep: "Amasse a polpa na água morna, coe rapidamente para tirar as sementes e beba o néctar concentrado.",
          tip: "A passiflorina fresca relaxa a musculatura respiratória em minutos."
        },
        {
          num: 93,
          name: "Elixir Turbo de Maçã no Micro-Ondas",
          target: "Conforto quentinho e doce sem sujar fogão",
          time: "2 minutos",
          temp: "Quente",
          ingredients: [
            "1/2 maçã picadinha com casca na caneca",
            "1 canela em pau",
            "200ml de água"
          ],
          prep: "Coloque tudo na caneca e leve ao micro-ondas por 2 minutos. Deixe descansar 1 minuto dentro do micro-ondas antes de tomar.",
          tip: "Rápido, gostoso e libera pectina natural que protege a mucosa gástrica."
        },
        {
          num: 94,
          name: "Shot Digestivo de Anis Rápido",
          target: "Barriga estufada quando você já está deitada na cama",
          time: "1 minuto",
          temp: "Morno",
          ingredients: [
            "50ml de água morna",
            "1 estrela de anis macerada rapidamente com o cabo de uma colher"
          ],
          prep: "Jogue o anis esmagado na água bem quente por 1 minuto, coe e tome.",
          tip: "Alívio em menos de 10 minutos para você dormir de bruços ou de lado sem desconforto."
        },
        {
          num: 95,
          name: "Cold Brew Noturno de Capim-Santo",
          target: "Hidratação refrescante e relaxamento suave",
          time: "Extração lenta",
          temp: "Fresco",
          ingredients: [
            "1 punhado de capim-santo fresco picadinho",
            "300ml de água fresca"
          ],
          prep: "Deixe as folhas de capim-santo na água na geladeira por 3 horas. À noite, basta coar e beber.",
          tip: "O óleo essencial de citral se preserva intacto sem calor."
        },
        {
          num: 96,
          name: "Shot Noturno de Alecrim & Mel",
          target: "Pescoço e trapézio travados por computador",
          time: "2 minutos",
          temp: "Morno",
          ingredients: [
            "40ml de água morna",
            "1 colher de café de folhas frescas de alecrim maceradas",
            "1/2 colher de café de mel"
          ],
          prep: "Amasse as folhas de alecrim com o mel no fundo do copinho. Adicione água morna, mexa e tome coado.",
          tip: "Alivia a cefaleia tensional e a sensação de peso na base do crânio."
        },
        {
          num: 97,
          name: "Elixir Express de Melissa Pura",
          target: "Coração acelerado antes de dormir",
          time: "3 minutos",
          temp: "Quente",
          ingredients: [
            "1 punhado de folhas de melissa fresca",
            "200ml de água fervente"
          ],
          prep: "Aperte as folhas na caneca, verta a água fervente e abafe com o celular por cima da caneca por 3 minutos.",
          tip: "Aquece a caixa torácica e acalma o ritmo respiratório."
        },
        {
          num: 98,
          name: "Shot Anti-Gases de Funcho Instantâneo",
          target: "Sensação de estufamento doloroso no baixo ventre",
          time: "2 minutos",
          temp: "Quente",
          ingredients: [
            "1 colher de café cheia de sementes de funcho trituradas",
            "50ml de água fervente"
          ],
          prep: "Triture o funcho com o fundo de um copo. Despeje água fervente, mexa por 1 minuto, coe e beba em 2 goles.",
          tip: "A maior concentração de anetol por mililitro possível em um remédio caseiro."
        },
        {
          num: 99,
          name: "Shot Turbo de Canela & Cravo em Pó",
          target: "Digestão paralisada e sensação de corpo pesado",
          time: "1 minuto",
          temp: "Morno",
          ingredients: [
            "40ml de água morna",
            "1 pitada de canela em pó",
            "1 pitadinha de cravo em pó"
          ],
          prep: "Dissolva os dois pós na água morna com uma colher de café e beba na hora.",
          tip: "Aumenta a termogênese digestiva e queima a sensação de peso pós-prandial."
        },
        {
          num: 100,
          name: "O Shot Mestre do Destrava Leve",
          target: "A fórmula soberana de fechamento diário da rotina",
          time: "2 minutos de preparo",
          temp: "Morno",
          ingredients: [
            "50ml de água morna filtrada",
            "1/2 limão espremido",
            "1/2 colher de café de cúrcuma pura",
            "1 pitada de canela em pó",
            "10 gotas de extrato de própolis verde"
          ],
          prep: "Misture vigorosamente todos os ingredientes na água morna até formar um líquido dourado e homogêneo. Tome imediatamente após sua prática de liberação da fáscia.",
          tip: "Combina drenagem linfática, desinflamação do tecido conjuntivo e desativação do nervo vago. O fechamento perfeito para os 28 dias do Destrava Leve."
        }
      ]
    }
  ]
};

// Generate Markdown E-book
let md = `# ${ebookData.title}\n`;
md += `## ${ebookData.subtitle}\n\n`;
md += `**Autor:** ${ebookData.author}  \n`;
md += `**Versão:** ${ebookData.version}  \n`;
md += `**Uso Exclusivo:** Alunas do Programa Destrava Leve 28D\n\n`;
md += `---\n\n`;

md += `## SUMÁRIO GERAL\n\n`;
md += `1. **Introdução:** A Ciência da Drenagem Noturna & Fáscia Leve\n`;
md += `2. **A Regra de Ouro da Infusão:** Como extrair os princípios ativos sem amargar\n`;
ebookData.chapters.forEach(c => {
  md += `3. **Capítulo ${c.number}: ${c.title}** (${c.recipes.length} Rituais)\n`;
});
md += `4. **Tabela de Consulta Rápida por Sintoma**\n`;
md += `5. **Conclusão:** O Seu Compromisso de Leveza\n\n`;
md += `---\n\n`;

md += `## 🌿 INTRODUÇÃO: A CIÊNCIA DA DRENAGEM NOTURNA\n\n`;
md += `Você já reparou que o corpo acorda diferente da forma como você foi dormir?\n\n`;
md += `Muitas mulheres acreditam que a retenção de líquidos e a barriga estufada são causadas apenas pelo que comem. No entanto, o verdadeiro maestro do inchaço é o seu **sistema linfático** — uma rede invisível de microcanais que transporta toxinas, restos celulares e líquidos retidos.\n\n`;
md += `Diferente do sistema circulatório, que tem o coração para bombear o sangue, o sistema linfático **não tem uma bomba própria**. Ele depende de dois fatores fundamentais:\n`;
md += `1. **O movimento mecânico suave** (as práticas de 7 minutos de liberação fascial do Destrava Leve);\n`;
md += `2. **O relaxamento profundo do Nervo Vago durante o sono**, que permite que os vasos linfáticos se abram e filtrem os tecidos.\n\n`;
md += `Quando você ingere os princípios ativos corretos das ervas cerca de 30 a 60 minutos antes de se deitar, esses fitoquímicos naturais atuam sinergicamente com a gravidade e com o repouso horizontal, direcionando os fluidos para os rins e desinchando a fáscia enquanto você descansa.\n\n`;
md += `---\n\n`;

md += `## ☕ A REGRA DE OURO DA INFUSÃO PERFEITA\n\n`;
md += `Para aproveitar 100% das propriedades medicinais das ervas, é vital entender a diferença entre **Infusão** e **Decocção**:\n\n`;
md += `### 1. Infusão (Para folhas, flores e partes delicadas)\n`;
md += `*Exemplos: camomila, melissa, hortelã, hibisco, capim-cidreira, cavalinha.*\n`;
md += `* **Como fazer:** Aqueça a água até as primeiras bolhas (85°C a 90°C). **NÃO deixe a água ferver em ebulição borbulhante**, pois o calor excessivo queima os óleos essenciais voláteis. Desligue o fogo, coloque as ervas, **tampe imediatamente** com tampa ou pires e aguarde o tempo indicado (geralmente de 7 a 10 minutos). Coe e sirva morno.\n\n`;
md += `### 2. Decocção (Para cascas, raízes e caules duros)\n`;
md += `*Exemplos: canela em pau, gengibre, mulungu, casca de maçã, casca de abacaxi, cravos.*\n`;
md += `* **Como fazer:** Coloque as cascas ou raízes na panela com água fria. Leve ao fogo e deixe ferver em fogo brando por 3 a 8 minutos. Depois, apague o fogo e deixe descansar abafado por mais alguns minutos antes de coar.\n\n`;
md += `---\n\n`;

ebookData.chapters.forEach(c => {
  md += `\n# CAPÍTULO ${c.number}: ${c.title.toUpperCase()}\n`;
  md += `*${c.subtitle}*\n\n`;
  md += `---\n\n`;

  c.recipes.forEach(r => {
    md += `### Ritual nº ${r.num.toString().padStart(3, '0')}: ${r.name}\n`;
    md += `* **Objetivo:** ${r.target}\n`;
    md += `* **Tempo & Temperatura:** ${r.time} | ${r.temp}\n`;
    md += `* **Ingredientes:**\n`;
    r.ingredients.forEach(i => {
      md += `  - ${i}\n`;
    });
    md += `* **Modo de Preparo:** ${r.prep}\n`;
    md += `* **💡 Dica da Especialista:** ${r.tip}\n\n`;
    md += `---\n\n`;
  });
});

md += `\n## 📋 TABELA DE CONSULTA RÁPIDA POR SINTOMA\n\n`;
md += `| O que você está sentindo hoje? | Capítulo Recomendado | Rituais Mais Indicados |\n`;
md += `| :--- | :--- | :--- |\n`;
md += `| Pernas pesadas, tornozelos inchados | **Capítulo 1** (Drenagem Linfática) | Rituais 01, 04, 05 e 13 |\n`;
md += `| Barriga estufada, gases pós-jantar | **Capítulo 2** (Ventre Plano) | Rituais 21, 22, 26 e 40 |\n`;
md += `| Mente acelerada, insônia, coração agitado | **Capítulo 3** (Nervo Vago) | Rituais 41, 42, 47 e 60 |\n`;
md += `| Dores na lombar, pescoço ou rigidez | **Capítulo 4** (Desinflamação da Fáscia) | Rituais 61, 62, 63 e 80 |\n`;
md += `| Dia corrido, sem tempo para cozinhar | **Capítulo 5** (Shots Turbo) | Rituais 81, 84, 91 e 100 |\n\n`;

md += `## 🌟 CONCLUSÃO: SEU COMPROMISSO DE LEVEZA\n\n`;
md += `Você agora tem nas mãos uma farmácia natural com 100 caminhos para devolver o alívio, a paz e a leveza ao seu corpo.\n\n`;
md += `Não tente fazer tudo ao mesmo tempo. Escolha **1 ritual por noite** que converse com o que seu corpo está pedindo hoje. Combine com os 7 minutos de descompressão do **Destrava Leve 28D**, deite-se com a respiração calma e deixe a sabedoria da natureza trabalhar por você enquanto você descansa.\n\n`;
md += `*Com carinho e votos de um corpo leve,*\n`;
md += `**Equipe Destrava Leve 28D**\n`;

fs.writeFileSync('ebook-100-chas/100-RITUAIS-DE-CHAS.md', md, 'utf-8');
console.log('Markdown e-book written successfully!');

// Generate HTML Luxury Printable E-book
const chapterThemes = {
  1: {
    name: 'linfatico',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    accent: '#059669',
    badgeColor: '#047857',
    badgeBg: '#d1fae5',
    cardBg: '#f0fdf4',
    cardBorder: '#86efac',
    titleColor: '#064e3b',
    targetPillBg: '#dcfce7',
    targetColor: '#047857',
    tipBorder: '#10b981',
    tipBg: '#ecfdf5',
    tipColor: '#065f46',
    bulletColor: '#059669'
  },
  2: {
    name: 'digestao',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    accent: '#ea580c',
    badgeColor: '#c2410c',
    badgeBg: '#ffedd5',
    cardBg: '#fff7ed',
    cardBorder: '#fdba74',
    titleColor: '#7c2d12',
    targetPillBg: '#ffedd5',
    targetColor: '#c2410c',
    tipBorder: '#f97316',
    tipBg: '#fff7ed',
    tipColor: '#9a3412',
    bulletColor: '#ea580c'
  },
  3: {
    name: 'nervo-vago',
    gradient: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 100%)',
    accent: '#7c3aed',
    badgeColor: '#6d28d9',
    badgeBg: '#ede9fe',
    cardBg: '#f5f3ff',
    cardBorder: '#c4b5fd',
    titleColor: '#3b0764',
    targetPillBg: '#ede9fe',
    targetColor: '#6d28d9',
    tipBorder: '#8b5cf6',
    tipBg: '#f5f3ff',
    tipColor: '#5b21b6',
    bulletColor: '#7c3aed'
  },
  4: {
    name: 'fascia',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    accent: '#d97706',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
    cardBg: '#fffbeb',
    cardBorder: '#fcd34d',
    titleColor: '#78350f',
    targetPillBg: '#fef3c7',
    targetColor: '#b45309',
    tipBorder: '#f59e0b',
    tipBg: '#fffbeb',
    tipColor: '#92400e',
    bulletColor: '#d97706'
  },
  5: {
    name: 'shots',
    gradient: 'linear-gradient(135deg, #881337 0%, #e11d48 100%)',
    accent: '#e11d48',
    badgeColor: '#be123c',
    badgeBg: '#ffe4e6',
    cardBg: '#fff1f2',
    cardBorder: '#fda4af',
    titleColor: '#881337',
    targetPillBg: '#ffe4e6',
    targetColor: '#be123c',
    tipBorder: '#f43f5e',
    tipBg: '#fff1f2',
    tipColor: '#9f1239',
    bulletColor: '#e11d48'
  }
};

let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ebookData.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap');

    :root {
      --navy: #193556;
      --text: #1e293b;
      --text-muted: #64748b;
      --bg: #f1f5f9;
      --white: #ffffff;
      --card-border: #e2e8f0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text);
      background-color: var(--bg);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .book-container {
      max-width: 860px;
      margin: 0 auto;
      background: var(--white);
      box-shadow: 0 10px 40px rgba(0,0,0,0.06);
      padding: 0 40px 60px;
    }

    /* Print action bar: completely suppressed in print */
    .print-bar {
      position: sticky;
      top: 0;
      z-index: 99999;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
      border-radius: 0 0 14px 14px;
      margin-bottom: 24px;
      max-width: 860px;
      margin-left: auto;
      margin-right: auto;
    }
    .print-bar-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
    }
    .print-bar-info strong { color: #38bdf8; font-size: 14px; }
    .print-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 800;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(16,185,129,0.35);
      transition: all .2s ease;
    }
    .print-btn:hover {
      background: #047857;
      transform: translateY(-1px);
    }

    /* Full-page Luxury Cover */
    .cover-fullpage {
      width: 100%;
      margin: 0 auto 50px;
      text-align: center;
      background: #02231c;
      border-radius: 0 0 20px 20px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(2,35,28,0.2);
    }
    .cover-full-img {
      width: 100%;
      height: auto;
      max-height: 1020px;
      object-fit: cover;
      display: block;
    }

    /* Print rules: Strict hiding and A4 pagination */
    @media print {
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      @page :first {
        margin: 0 !important;
      }
      html, body {
        background: white !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .no-print,
      .print-bar,
      #print-bar {
        display: none !important;
        visibility: hidden !important;
        position: absolute !important;
        top: -99999px !important;
        left: -99999px !important;
        height: 0 !important;
        width: 0 !important;
        opacity: 0 !important;
        overflow: hidden !important;
      }
      .book-container {
        max-width: 100% !important;
        width: 100% !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .cover-fullpage {
        margin: 0 !important;
        padding: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        height: 100vh !important;
        min-height: 100vh !important;
        page-break-after: always !important;
        break-after: page !important;
      }
      .cover-full-img {
        width: 100% !important;
        height: 100vh !important;
        max-height: none !important;
        object-fit: cover !important;
      }
      .page-break {
        page-break-after: always !important;
        break-after: page !important;
      }
      .recipe-card {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        margin-bottom: 20px !important;
        box-shadow: none !important;
      }
    }

    /* Intro Section */
    .section-intro {
      padding: 30px 20px 40px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 40px;
    }
    .section-intro-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .section-intro h2 {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      color: #064e3b;
      line-height: 1.25;
    }
    .section-intro p {
      font-size: 15px;
      color: #334155;
      margin-bottom: 16px;
      line-height: 1.65;
    }
    .highlight-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #e6fcf5 100%);
      border: 1.5px solid #86efac;
      border-radius: 14px;
      padding: 20px 24px;
      margin: 24px 0;
    }
    .highlight-card h3 {
      font-size: 17px;
      color: #065f46;
      margin-bottom: 8px;
      font-weight: 800;
    }
    .highlight-card p {
      margin-bottom: 8px;
      font-size: 14px;
      color: #1e3a5f;
    }

    /* Chapter Title Header */
    .chapter-banner {
      color: white;
      padding: 36px 32px;
      border-radius: 18px;
      margin: 50px 0 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
      page-break-before: always;
      break-before: page;
    }
    .chapter-num {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 8px;
      display: block;
    }
    .chapter-banner h2 {
      font-family: 'Playfair Display', serif;
      font-size: 30px;
      line-height: 1.2;
      margin-bottom: 8px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .chapter-banner p {
      font-size: 15px;
      opacity: 0.92;
      line-height: 1.5;
    }

    /* Recipe cards */
    .recipe-card {
      border-radius: 16px;
      padding: 24px 26px;
      margin-bottom: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      border-width: 1.5px;
      border-style: solid;
      border-left-width: 6px;
      transition: all .2s ease;
    }
    .recipe-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      gap: 12px;
      flex-wrap: wrap;
    }
    .recipe-badge {
      font-size: 11px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      display: inline-block;
      margin-bottom: 6px;
    }
    .recipe-title {
      font-size: 20px;
      font-weight: 800;
      line-height: 1.3;
    }
    .recipe-target-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 8px;
      margin-bottom: 14px;
    }
    .recipe-meta-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      padding: 8px 14px;
      background: rgba(255,255,255,0.7);
      border-radius: 8px;
      font-size: 12.5px;
      color: #334155;
      font-weight: 700;
      border: 1px solid rgba(0,0,0,0.06);
    }
    .recipe-subtitle {
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 14px 0 6px;
      opacity: 0.75;
    }
    .recipe-ingredients {
      list-style: none;
      margin-bottom: 14px;
    }
    .recipe-ingredients li {
      position: relative;
      padding-left: 20px;
      font-size: 14px;
      color: #1e293b;
      margin-bottom: 4px;
      line-height: 1.45;
      font-weight: 500;
    }
    .recipe-ingredients li::before {
      content: "✦";
      position: absolute;
      left: 2px;
      font-size: 11px;
    }
    .recipe-prep {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
      margin-bottom: 14px;
      background: rgba(255,255,255,0.85);
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid rgba(0,0,0,0.04);
    }
    .recipe-tip {
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 13px;
      line-height: 1.5;
      border-left-width: 4px;
      border-left-style: solid;
    }

    /* Summary Table */
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 13.5px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0,0,0,0.04);
    }
    .summary-table th, .summary-table td {
      padding: 12px 16px;
      text-align: left;
    }
    .summary-table th {
      background: #0f172a;
      color: white;
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
    .summary-table tr:nth-child(1) td { background: #f0fdf4; border-left: 4px solid #059669; }
    .summary-table tr:nth-child(2) td { background: #fff7ed; border-left: 4px solid #ea580c; }
    .summary-table tr:nth-child(3) td { background: #f5f3ff; border-left: 4px solid #7c3aed; }
    .summary-table tr:nth-child(4) td { background: #fffbeb; border-left: 4px solid #d97706; }
    .summary-table tr:nth-child(5) td { background: #fff1f2; border-left: 4px solid #e11d48; }

    /* Footer note */
    .book-footer {
      text-align: center;
      padding: 50px 20px 20px;
      border-top: 2px solid #e2e8f0;
      margin-top: 60px;
      color: var(--text-muted);
      font-size: 13px;
    }
  </style>
</head>
<body>

  <!-- Floating Print Bar: 100% hidden in print engine -->
  <aside id="print-bar" class="print-bar no-print" data-no-print="true">
    <div class="print-bar-info">
      <span>🌿</span>
      <div>
        <strong>100 Rituais de Chás Anti-Inchaço</strong>
        <p style="margin:0;font-size:11.5px;color:#94a3b8;">Guia Oficial Ilustrado • Destrava Leve 28D</p>
      </div>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Salvar como PDF / Imprimir</button>
  </aside>

  <div class="book-container">
    
    <!-- Full-page Editorial Cover -->
    <header class="cover-fullpage">
      <img src="/capa-ebook-luxo.jpg" alt="100 Rituais de Chás Anti-Inchaço - Capa Oficial" class="cover-full-img">
    </header>

    <div class="page-break"></div>

    <!-- Intro -->
    <section class="section-intro">
      <div class="section-intro-header">
        <span style="font-size: 32px;">🌿</span>
        <div>
          <span style="font-size: 11px; font-weight: 800; color: #059669; letter-spacing: 1.5px; text-transform: uppercase;">Fundamento Científico</span>
          <h2>A Ciência da Drenagem Noturna & Fáscia Leve</h2>
        </div>
      </div>

      <p>Você já acordou com a sensação de estar pesada, com a barriga dura e marcas profundas do lençol na pele? Essa retenção matinal não é acúmulo de gordura: é <strong>linfa estagnada e fáscia tensionada</strong>.</p>
      
      <p>O sistema linfático é a rede de encanamento do corpo humano responsável por eliminar toxinas, restos celulares e líquidos acumulados nos tecidos. No entanto, ele não possui um coração para bombear esses fluidos. Ele depende de duas forças fundamentais:</p>
      
      <div style="background: #f8fafc; border-radius: 12px; padding: 14px 18px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
        <p style="margin-bottom: 8px;"><strong>1. A massagem mecânica suave dos tecidos</strong> (as rotinas de 7 minutos do Destrava Leve);</p>
        <p style="margin: 0;"><strong>2. O repouso noturno horizontal combinado com o relaxamento do Nervo Vago</strong>, momento exato em que os vasos se dilatam e drenam a sobrecarga para a filtragem renal.</p>
      </div>

      <p>Quando você une a prática corporal da noite com as infusões deste guia, os princípios ativos das ervas aceleram a circulação de retorno enquanto você dorme, permitindo acordar com a barriga reta e o corpo leve.</p>

      <div class="highlight-card">
        <h3>☕ A Regra de Ouro da Infusão Perfeita</h3>
        <p><strong>🍃 Para Folhas e Flores Delicadas (Infusão):</strong> Aqueça a água até as primeiras bolinhas no fundo da panela (85°C a 90°C). <em>Nunca deixe ferver em borbulhas fortes</em>, pois a fervura evapora os óleos essenciais terapêuticos. Desligue, coloque as ervas e tampe imediatamente por 7 a 10 minutos.</p>
        <p style="margin-top: 10px;"><strong>🪵 Para Cascas, Raízes e Caules Duros (Decocção):</strong> Ferva em fogo baixo por 3 a 8 minutos com água fria inicial, apague o fogo e abafe por mais 5 minutos antes de coar.</p>
      </div>
    </section>

    <!-- Chapters & Recipes -->
`;

ebookData.chapters.forEach(c => {
  const t = chapterThemes[c.number];

  html += `
    <div class="page-break"></div>
    <div class="chapter-banner" style="background: ${t.gradient};">
      <span class="chapter-num" style="color: ${t.badgeBg};">Capítulo ${c.number}</span>
      <h2>${c.title}</h2>
      <p>${c.subtitle}</p>
    </div>
  `;

  c.recipes.forEach(r => {
    html += `
      <article class="recipe-card" style="background: ${t.cardBg}; border-color: ${t.cardBorder}; border-left-color: ${t.accent};">
        <div class="recipe-header">
          <div>
            <span class="recipe-badge" style="background: ${t.badgeBg}; color: ${t.badgeColor};">Ritual #${r.num.toString().padStart(3, '0')}</span>
            <h3 class="recipe-title" style="color: ${t.titleColor};">${r.name}</h3>
          </div>
        </div>

        <div class="recipe-target-pill" style="background: ${t.targetPillBg}; color: ${t.targetColor};">
          <span>🎯 Foco:</span> ${r.target}
        </div>

        <div class="recipe-meta-row">
          <span>⏱️ ${r.time}</span>
          <span>🌡️ ${r.temp}</span>
        </div>
        
        <div class="recipe-subtitle" style="color: ${t.titleColor};">Ingredientes Selecionados</div>
        <ul class="recipe-ingredients">
          ${r.ingredients.map(i => `<li style="--bullet: '${t.bulletColor}';"><span style="color: ${t.accent}; margin-right: 6px;">✦</span>${i}</li>`).join('')}
        </ul>

        <div class="recipe-subtitle" style="color: ${t.titleColor};">Modo de Preparo</div>
        <p class="recipe-prep">${r.prep}</p>

        <div class="recipe-tip" style="background: ${t.tipBg}; border-left-color: ${t.tipBorder}; color: ${t.tipColor};">
          💡 <strong>Dica da Especialista:</strong> ${r.tip}
        </div>
      </article>
    `;
  });
});

html += `
    <div class="page-break"></div>
    <section class="section-intro">
      <div class="section-intro-header">
        <span style="font-size: 32px;">📋</span>
        <div>
          <span style="font-size: 11px; font-weight: 800; color: #0d9488; letter-spacing: 1.5px; text-transform: uppercase;">Consulta Expressa</span>
          <h2 style="color: #0f172a;">Tabela de Consulta Rápida por Sintoma</h2>
        </div>
      </div>

      <p>Consulte esta tabela para escolher o melhor ritual de acordo com o que você está sentindo no dia:</p>
      
      <table class="summary-table">
        <thead>
          <tr>
            <th>O que você sente hoje?</th>
            <th>Capítulo Temático</th>
            <th>Rituais Mais Indicados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Pernas pesadas, tornozelos inchados</strong></td>
            <td><strong style="color: #059669;">Capítulo 1</strong> (Drenagem Linfática)</td>
            <td>Rituais 01, 04, 05 e 13</td>
          </tr>
          <tr>
            <td><strong>Barriga estufada, gases pós-jantar</strong></td>
            <td><strong style="color: #ea580c;">Capítulo 2</strong> (Ventre Plano)</td>
            <td>Rituais 21, 22, 26 e 40</td>
          </tr>
          <tr>
            <td><strong>Mente agitada, insônia, estresse alto</strong></td>
            <td><strong style="color: #7c3aed;">Capítulo 3</strong> (Nervo Vago)</td>
            <td>Rituais 41, 42, 47 e 60</td>
          </tr>
          <tr>
            <td><strong>Dores na lombar, pescoço ou rigidez</strong></td>
            <td><strong style="color: #d97706;">Capítulo 4</strong> (Desinflamação da Fáscia)</td>
            <td>Rituais 61, 62, 63 e 80</td>
          </tr>
          <tr>
            <td><strong>Dia corrido, sem tempo para infusão</strong></td>
            <td><strong style="color: #e11d48;">Capítulo 5</strong> (Shots Turbo 3 min)</td>
            <td>Rituais 81, 84, 91 e 100</td>
          </tr>
        </tbody>
      </table>
    </section>

    <footer class="book-footer">
      <p><strong>Destrava Leve 28D</strong> • Todos os direitos reservados.</p>
      <p>Este guia digital é educativo e complementar à sua rotina de liberação fascial e bem-estar corporal.</p>
    </footer>

  </div>

</body>
</html>`;

fs.writeFileSync('ebook-100-chas/index.html', html, 'utf-8');
console.log('HTML printable e-book written successfully!');

