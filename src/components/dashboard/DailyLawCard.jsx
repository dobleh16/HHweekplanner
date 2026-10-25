import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Zap, Feather, Cross } from 'lucide-react';

// ─────────────────────────────────────────────
// CATEGORY CONFIGS
// ─────────────────────────────────────────────
const CATEGORIES = {
  law: {
    label: 'Ley del Poder',
    icon: BookOpen,
    accent: '#5B8DEF',
    accentBg: 'rgba(91, 141, 239, 0.12)',
    accentBorder: 'rgba(91, 141, 239, 0.28)',
    glowColor: 'rgba(91, 141, 239, 0.08)',
    insideAccent: '#A78BFA',
    insideBg: 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(91,141,239,0.08))',
    insideBorder: '#A78BFA',
    reflectionLabel: 'Reflexión',
  },
  stoic: {
    label: 'Sabiduría Estoica',
    icon: Feather,
    accent: '#34D399',
    accentBg: 'rgba(52, 211, 153, 0.12)',
    accentBorder: 'rgba(52, 211, 153, 0.28)',
    glowColor: 'rgba(52, 211, 153, 0.08)',
    insideAccent: '#6EE7B7',
    insideBg: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(110,231,183,0.06))',
    insideBorder: '#34D399',
    reflectionLabel: 'Enseñanza',
  },
  bible: {
    label: 'Palabra del Día',
    icon: Cross,
    accent: '#F0B429',
    accentBg: 'rgba(240, 180, 41, 0.12)',
    accentBorder: 'rgba(240, 180, 41, 0.28)',
    glowColor: 'rgba(240, 180, 41, 0.08)',
    insideAccent: '#FCD34D',
    insideBg: 'linear-gradient(135deg, rgba(240,180,41,0.12), rgba(252,211,77,0.06))',
    insideBorder: '#F0B429',
    reflectionLabel: 'Reflexión',
  },
};

// ─────────────────────────────────────────────
// 48 LEYES DEL PODER
// ─────────────────────────────────────────────
const LAWS_OF_POWER = [
  { number: 1,  title: "Nunca opaques al maestro", summary: "Haz que quienes están por encima de ti se sientan siempre superiores. En tu deseo de complacerlos o impresionarlos, no vayas tan lejos en la demostración de tus talentos que termines provocando el efecto contrario.", insight: "La envidia del superior es el veneno más silencioso del éxito." },
  { number: 2,  title: "No confíes en los amigos; aprende a usar a los enemigos", summary: "Ten cuidado con los amigos: te traicionarán más rápido, pues se hacen presa fácil de la envidia. Contrata a un antiguo enemigo y será más leal, pues tiene mucho que demostrar.", insight: "Un enemigo convertido en aliado lucha con más lealtad que cualquier amigo." },
  { number: 3,  title: "Oculta tus intenciones", summary: "Mantén a la gente desorientada y en la oscuridad respecto a tus intenciones. Si no saben qué planeas, no pueden preparar una defensa.", insight: "La carta que nadie ha visto es la más poderosa de la mano." },
  { number: 4,  title: "Di siempre menos de lo necesario", summary: "Cuando intentes impresionar con palabras, cuanto más dices, más común te ves y menos control tienes. El poder se encuentra en la brevedad.", insight: "El silencio es un escudo y una espada al mismo tiempo." },
  { number: 5,  title: "Cuida tu reputación: es la piedra angular del poder", summary: "La reputación es la piedra angular del poder. Con una buena reputación puedes influir e intimidar; piérdela y quedas vulnerable ante cualquier ataque.", insight: "Tu reputación te precede — cuídala como si fuera tu vida." },
  { number: 6,  title: "Llama la atención a cualquier precio", summary: "Todo depende de la atención que uno atraiga. Al llamar la atención, te haces más grande, más grandioso, más misterioso de lo que eres en la realidad.", insight: "Ser ignorado es peor que ser odiado — la invisibilidad es la verdadera muerte." },
  { number: 7,  title: "Haz que otros trabajen para ti y llévate el crédito", summary: "Usa la sabiduría, el conocimiento y el trabajo de los demás para llevar a cabo tu propia causa. Tu eficiencia aumentará y tu reputación con ella.", insight: "El genio toma prestado; el maestro roba con elegancia." },
  { number: 8,  title: "Haz que la gente venga a ti: usa el cebo si es necesario", summary: "Es siempre mejor hacer que el otro venga a ti, abandonando sus propios planes. Cuando obligas a los demás a actuar, tomas el control.", insight: "Quien controla el terreno, controla la batalla." },
  { number: 9,  title: "Gana a través de las acciones, nunca los argumentos", summary: "Cualquier victoria momentánea que obtengas mediante el argumento crea resentimiento y mala voluntad más fuertes y duraderos que cualquier cambio temporal de opinión.", insight: "Los hechos hablan; las palabras solo ensayan." },
  { number: 10, title: "Evita a los infelices y a los desafortunados", summary: "El infeliz contagia su desgracia a quienes están cerca. Puedes morir de la infección del caos y la desdicha de los demás. Rodéate de los afortunados.", insight: "La energía de quienes te rodean moldea quién te conviertes." },
  { number: 11, title: "Aprende a mantener a las personas dependientes de ti", summary: "Para mantener tu independencia debes ser necesario e indispensable. Cuanto más dependan de ti, más libertad tendrás. Nunca enseñes todo lo que sabes.", insight: "El irremplazable nunca teme ser reemplazado." },
  { number: 12, title: "Usa la generosidad selectiva para desarmar a tu víctima", summary: "Un regalo generoso hecho en el momento preciso puede ablandar a la persona más hostil. Un solo gesto estratégico puede abrir puertas que ningún argumento podría abrir.", insight: "La generosidad calculada es la más poderosa de las armas sociales." },
  { number: 13, title: "Apela al interés propio, nunca a la misericordia", summary: "Si necesitas ayuda de alguien poderoso, no apeles a su misericordia sino a su interés propio. Muéstrale cómo ayudarte beneficia su causa también.", insight: "El interés propio mueve montañas donde la compasión solo suspira." },
  { number: 14, title: "Preséntate como amigo, actúa como espía", summary: "Conoces a tu enemigo conociéndolo bien. Usa preguntas indirectas o a un tercero para descubrir sus secretos, puntos débiles y verdaderas intenciones.", insight: "La información es el activo más valioso en el juego del poder." },
  { number: 15, title: "Aplasta totalmente a tu enemigo", summary: "Todos los grandes líderes saben que un enemigo peligroso debe ser aplastado por completo. Si lo dejas recuperarse, buscará venganza. Aplasta o no empieces.", insight: "La misericordia mal colocada crea enemigos más feroces." },
  { number: 16, title: "Usa la ausencia para aumentar el respeto y el honor", summary: "Demasiado de ti mismo genera desprecio. Aprende cuándo alejarte: crea valor a través de la escasez. La ausencia aumenta el honor.", insight: "Lo que es raro es precioso — no te hagas demasiado disponible." },
  { number: 17, title: "Mantén a otros en suspenso: cultiva la imprevisibilidad", summary: "Los humanos son criaturas de hábito que anhelan patrones familiares. Tu imprevisibilidad rompe este instinto y genera respeto incómodo y fascinación.", insight: "El predecible es vulnerable — la imprevisibilidad es armadura." },
  { number: 18, title: "No construyas fortalezas: el aislamiento es peligroso", summary: "El mundo es peligroso y los enemigos están en todas partes. Aislarte te protege pero te priva de información valiosa. Es mejor circular, mezclarte, ser social.", insight: "Las murallas protegen del peligro y también encierran la ignorancia." },
  { number: 19, title: "Sabe con quién tratas: no ofendas a la persona equivocada", summary: "Hay muchos tipos de personas en el mundo y nunca puedes asumir que reaccionarán como esperas. Nunca ofendas a la persona equivocada.", insight: "Conoce el carácter de cada persona antes de jugar tus cartas." },
  { number: 20, title: "No te comprometas con nadie", summary: "No te comprometas con ningún bando ni causa. Mantén tu independencia para que todos te cortejéis; sé el maestro de los demás jugando a unos contra los otros.", insight: "El independiente tiene el poder; el comprometido, solo lealtades." },
  { number: 21, title: "Juega al tonto para atrapar a un tonto", summary: "Ningún ser humano se siente cómodo si piensa que su interlocutor es más inteligente. Parece más tonto de lo que eres y tu interlocutor bajará la guardia.", insight: "La apariencia de ignorancia es la máscara más astuta." },
  { number: 22, title: "Usa la rendición: transforma la debilidad en poder", summary: "Cuando eres más débil, nunca pelees por honor; en cambio, ríndete. La rendición te da tiempo para recuperarte, atormentar y esperar tu momento.", insight: "La rendición táctica no es derrota — es paciencia con propósito." },
  { number: 23, title: "Concentra tus fuerzas", summary: "Conserva tus fuerzas y energía concentrándolas en el punto más fuerte de tus recursos. La intensidad supera a la extensión. La potencia concentrada es incontenible.", insight: "El rayo concentrado quema; el disperso solo calienta." },
  { number: 24, title: "Juega al perfecto cortesano", summary: "El cortesano perfecto prospera en un mundo donde todo gira en torno al poder y la gracia social. Domina el arte de la adulación indirecta y la deferencia estratégica.", insight: "La elegancia social es una forma de poder que los rudos nunca comprenderán." },
  { number: 25, title: "Recréate a ti mismo", summary: "No aceptes los roles que la sociedad te impone. Recréate con una identidad que llame la atención y no se pueda ignorar. El maestro de su propia imagen tiene todo el poder.", insight: "Quien define su propia narrativa controla su destino." },
  { number: 26, title: "Mantén tus manos limpias", summary: "Debes parecer un pozo de civilidad y bondad. Usa a otros como pantallas y chivos expiatorios para ocultar tu participación en asuntos sucios.", insight: "El poder real actúa desde las sombras; lo visible siempre es el blanco." },
  { number: 27, title: "Crea un culto: juega con la necesidad de creer", summary: "La gente tiene una necesidad desesperante de creer en algo. Conviértete en el centro de ese culto ofreciendo grandes promesas, un propósito emocionante y una causa vaga.", insight: "El creyente entregado es el seguidor más leal y peligroso." },
  { number: 28, title: "Entra en acción con audacia", summary: "Si eres inseguro, la audacia puede parecer intimidante, pero es mejor entrar con audacia. Los errores de audacia son los más fáciles de corregir con más audacia.", insight: "La audacia sin límites crea su propia realidad." },
  { number: 29, title: "Planea hasta el final", summary: "El final de una situación es lo que hay que contemplar. Considera todos los resultados posibles, los obstáculos y los vuelcos antes de actuar.", insight: "El que ve el fin desde el principio nunca se pierde en el camino." },
  { number: 30, title: "Haz que tus logros parezcan sin esfuerzo", summary: "Tus acciones deben parecer naturales y ejecutadas con facilidad. Todos los trucos y el trabajo duro deben quedar ocultos. Nunca reveles cómo lo lograste.", insight: "La maestría real luce como magia — nadie ve los años de práctica." },
  { number: 31, title: "Controla las opciones: haz que otros jueguen tus cartas", summary: "La mejor forma de engañar a alguien es darle una opción; esto los hace sentir en control pero siempre dentro de tus parámetros. Tú defines las posibilidades.", insight: "El que define las opciones, define el resultado." },
  { number: 32, title: "Juega a los deseos, nunca al miedo", summary: "La gente quiere ser llevada a la tierra prometida. Alimenta sus esperanzas más profundas y tócalos en el corazón — el miedo ata pero el deseo moviliza.", insight: "El miedo paraliza; la esperanza bien dirigida conquista ejércitos." },
  { number: 33, title: "Descubre el talón de Aquiles de cada persona", summary: "Todo el mundo tiene una debilidad, una fisura en su armadura. Una vez que la encuentras, tienes poder sobre esa persona.", insight: "Conocer la vulnerabilidad de alguien es tener la llave de su alma." },
  { number: 34, title: "Sé real a través de tus propios actos", summary: "Si no actúas a través de tu propia grandeza, otros dictarán tus acciones. Toma la iniciativa, actúa con determinación y haz que otros reaccionen a ti.", insight: "El que actúa crea la realidad; el que reacciona solo la sufre." },
  { number: 35, title: "Domina el arte del momento oportuno", summary: "Nunca parezcas tener prisa: la precipitación traiciona falta de control. Siempre parece paciente, como si supieras que todo llegará a su debido tiempo.", insight: "El timing perfecto convierte lo ordinario en extraordinario." },
  { number: 36, title: "Desprecia las cosas que no puedes tener", summary: "Al reconocer algo, le das existencia y poder. Si hay algo que quieres pero no puedes tener, ignorarlo es la forma más inteligente de manejarlo.", insight: "La indiferencia fingida es más poderosa que el deseo declarado." },
  { number: 37, title: "Crea espectáculos cautivadores", summary: "Los ojos de las personas son siempre captados por el movimiento y el color. Nunca apeles al intelecto ni a la lógica — diseña espectáculos que enciendan los sentidos.", insight: "El que controla la atención, controla los pensamientos." },
  { number: 38, title: "Piensa como quieras, pero compórtate como los demás", summary: "Si demuestras tus diferencias de manera demasiado abierta, la gente buscará venganza porque les haces sentir inferiores. Es más seguro mezclarse.", insight: "La originalidad radical se comparte solo con los dignos de comprenderla." },
  { number: 39, title: "Agita las aguas para pescar mejor", summary: "La ira y la emoción son contraproducentes. Debes siempre mantenerte tranquilo y objetivo. Si agitas a tus enemigos, tendrás ventaja en la batalla.", insight: "La ecuanimidad en el caos es la señal más clara de poder real." },
  { number: 40, title: "Desprecia el dinero gratuito", summary: "Lo que se entrega gratuitamente suele ser peligroso porque esconde un anzuelo. Lo que tiene precio da poder; lo gratuito ata con deudas invisibles.", insight: "Nada es gratis — el precio oculto siempre es el más caro." },
  { number: 41, title: "Evita seguir los pasos de un gran hombre", summary: "Lo que ocurrió una vez no puede repetirse. Construye tu propio terreno y no te bases en el legado de otros. Los grandes hombres proyectan sombras muy largas.", insight: "Imitar grandeza es condenarse a ser siempre segundo." },
  { number: 42, title: "Golpea al pastor y las ovejas se dispersarán", summary: "El problema generalmente es una persona clave. Si identificas y neutralizas a esa persona, el grupo que la rodea se disolverá por sí solo.", insight: "Ataca la raíz, no las ramas." },
  { number: 43, title: "Trabaja sobre el corazón y la mente de los demás", summary: "La coerción crea resentimiento y el deseo de venganza. Debes seducir en lugar de forzar. Trabaja las emociones y el pensamiento de los demás para que te sigan voluntariamente.", insight: "La conquista del corazón es más duradera que la del cuerpo." },
  { number: 44, title: "Desarma e irrita con el efecto espejo", summary: "Al reflejar exactamente las acciones de tu enemigo, lo humillas y no sabe cómo reaccionar. Esto confunde y frustra.", insight: "El espejo es el arma más perturbadora — nadie puede atacar su propio reflejo." },
  { number: 45, title: "Predica el cambio, pero reformes poco a la vez", summary: "Todos entienden la necesidad del cambio, pero las personas son criaturas de hábito y la novedad los amenaza. Parece que cambias mientras conservas lo que funciona.", insight: "El cambio radical anunciado suavemente se acepta sin resistencia." },
  { number: 46, title: "Nunca parezcas demasiado perfecto", summary: "Aparecer mejor que los demás es siempre peligroso pero lo más peligroso es mostrar no tener defectos. Admite defectos inofensivos para despertar envidia.", insight: "La perfección provoca envidia; la imperfección estratégica genera simpatía." },
  { number: 47, title: "No vayas más allá del objetivo que te marcaste", summary: "El momento de la victoria es a menudo el momento de mayor peligro. El éxito puede llevar al exceso. Saber cuándo parar es tan importante como saber cómo empezar.", insight: "La sabiduría sabe cuándo la victoria está completa." },
  { number: 48, title: "Asume la forma sin forma", summary: "Si aceptas una forma fija y visible, te expones al ataque. Sé flexible y fluido. Acepta que nada es permanente. La forma sin forma es el más alto nivel de poder.", insight: "El agua vence a la roca no por fuerza, sino por adaptación infinita." },
].map(l => ({ ...l, category: 'law' }));

// ─────────────────────────────────────────────
// FRASES ESTOICAS
// ─────────────────────────────────────────────
const STOIC_QUOTES = [
  { author: "Marco Aurelio", source: "Meditaciones", quote: "Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de eso y encontrarás la fuerza.", insight: "El control interior es la única libertad verdadera." },
  { author: "Marco Aurelio", source: "Meditaciones", quote: "Nunca estimes nada ventajoso para ti que te obligue a romper tu palabra, a perder tu respeto por ti mismo, a odiar, sospechar, maldecir a alguien.", insight: "La integridad no se negocia, ni siquiera por el éxito." },
  { author: "Marco Aurelio", source: "Meditaciones", quote: "La felicidad de tu vida depende de la calidad de tus pensamientos.", insight: "Cuida tus pensamientos — ellos construyen tu realidad." },
  { author: "Marco Aurelio", source: "Meditaciones", quote: "Si no te resulta correcto, no lo hagas; si no es verdad, no lo digas.", insight: "La rectitud no necesita argumentos — solo acción." },
  { author: "Marco Aurelio", source: "Meditaciones", quote: "Acepta las cosas a las que el destino te ata, y ama a la gente con la que el destino te reúne.", insight: "El amor al destino transforma la carga en propósito." },
  { author: "Marco Aurelio", source: "Meditaciones", quote: "Pierde el tiempo leyendo esto y actúa. Actúa como si cada momento fuera el último de tu vida.", insight: "La urgencia de vivir bien no puede posponerse." },
  { author: "Epicteto", source: "Enquiridión", quote: "Primero di lo que te gustaría ser; luego haz lo que tienes que hacer.", insight: "La identidad antecede al hábito — sé primero, luego actúa." },
  { author: "Epicteto", source: "Enquiridión", quote: "No busques que los sucesos ocurran como tú quieres, sino desea que ocurran como ocurren y encontrarás tranquilidad.", insight: "La paz no viene de controlar el mundo, sino de aceptarlo." },
  { author: "Epicteto", source: "Enquiridión", quote: "Tenemos dos orejas y una boca para que podamos escuchar el doble de lo que hablamos.", insight: "La escucha activa es el inicio de toda sabiduría." },
  { author: "Epicteto", source: "Discursos", quote: "Él es un hombre sabio que no se lamenta por las cosas que no tiene, sino que se alegra por las que tiene.", insight: "La gratitud convierte lo que tenemos en suficiente." },
  { author: "Epicteto", source: "Discursos", quote: "La riqueza no consiste en tener grandes posesiones, sino en tener pocas necesidades.", insight: "La libertad crece cuando las necesidades menguan." },
  { author: "Epicteto", source: "Enquiridión", quote: "Haz de filosofar lo que hacemos de comer: tómala por necesidad, no por placer.", insight: "La sabiduría es sustento, no entretenimiento." },
  { author: "Séneca", source: "Cartas a Lucilio", quote: "No es pobre el que tiene poco, sino el que codicia más.", insight: "La pobreza real es del espíritu, no del bolsillo." },
  { author: "Séneca", source: "De la brevedad de la vida", quote: "No es que tengamos poco tiempo, es que desperdiciamos mucho.", insight: "El tiempo no falta — lo perdemos en lo que no importa." },
  { author: "Séneca", source: "Cartas a Lucilio", quote: "Recógete en ti mismo tanto como puedas; trata con los que te van a mejorar; admite en tu trato a los que pueden hacerte mejor.", insight: "El entorno que eliges define quién te conviertes." },
  { author: "Séneca", source: "De la tranquilidad del alma", quote: "Comienza a ser ahora lo que serás al final.", insight: "El carácter no se construye mañana — se practica hoy." },
  { author: "Séneca", source: "Cartas a Lucilio", quote: "La suerte no existe; lo que vulgarmente se llama así es el encuentro de la oportunidad con la preparación.", insight: "La suerte favorece al que se prepara sin descanso." },
  { author: "Séneca", source: "De la ira", quote: "Cuanto más se agita alguien, más lo domina la ira; la mejor cura para ella es el tiempo y el silencio.", insight: "La pausa es el antídoto más poderoso contra la impulsividad." },
  { author: "Zenón de Citio", source: "Fragmentos", quote: "La felicidad es un buen fluir de la vida.", insight: "Vivir bien no es acumular — es fluir con propósito." },
  { author: "Cleantes", source: "Himno a Zeus", quote: "Condúceme, oh Zeus, y tú, Destino, adonde quiera que me habéis asignado.", insight: "La aceptación del destino es la más alta forma de libertad." },
  { author: "Crisipo", source: "Fragmentos estoicos", quote: "El mundo es una gran ciudad y los hombres sus ciudadanos.", insight: "Somos parte de algo más grande que nosotros mismos." },
  { author: "Catón el Joven", source: "Plutarco — Vidas paralelas", quote: "Soporta y abstente.", insight: "La disciplina se resume en dos palabras: aguanta y renuncia." },
  { author: "Musonio Rufo", source: "Fragmentos", quote: "Si quieres practicar la filosofía, prepárate para ser ridiculizado.", insight: "El camino del crecimiento siempre pasa por el juicio ajeno." },
  { author: "Marco Aurelio", source: "Meditaciones", quote: "El obstáculo en el camino se convierte en el camino. Nunca olvides que dentro de cada obstáculo está la oportunidad.", insight: "La adversidad no bloquea el progreso — lo define." },
  { author: "Epicteto", source: "El manual de vida", quote: "El secreto de toda virtud está en distinguir aquello que depende de nosotros y lo que no depende.", insight: "Claridad sobre lo controlable es el inicio de toda paz." },
  { author: "Marco Aurelio", source: "Meditaciones", quote: "Si alguien puede refutarte, demuéstrate y actúa en consecuencia. Si no, ¿por qué perder tiempo?", insight: "La corrección que duele es la más valiosa." },
  { author: "Séneca", source: "Cartas a Lucilio", quote: "Errar es humano, pero perseverar en el error es del diablo.", insight: "La grandeza está en reconocer el error, no en evitarlo." },
  { author: "Marco Aurelio", source: "Meditaciones", quote: "Cuando te levantes por la mañana, piensa en el privilegio de estar vivo, de pensar, de disfrutar, de amar.", insight: "Cada mañana es un regalo — trátalo como tal." },
  { author: "Epicteto", source: "Discursos", quote: "No intentes que todo sea como deseas. Desea que todo sea como es y serás feliz.", insight: "La alineación con la realidad es la raíz de toda paz." },
  { author: "Séneca", source: "De la providencia", quote: "Muéstrame a alguien que no sea esclavo. Uno lo es de la lascivia, otro de la codicia, otro de la ambición.", insight: "La verdadera libertad es dominar las propias pasiones." },
].map(q => ({ ...q, category: 'stoic' }));

// ─────────────────────────────────────────────
// VERSÍCULOS BÍBLICOS
// ─────────────────────────────────────────────
const BIBLE_VERSES = [
  { reference: "Filipenses 4:13", verse: "Todo lo puedo en Cristo que me fortalece.", insight: "La fortaleza más profunda no viene de uno mismo, sino de la fe." },
  { reference: "Josué 1:9", verse: "¿No te lo he mandado yo? Sé fuerte y valiente. No temas ni te desalientes, porque el SEÑOR tu Dios estará contigo dondequiera que vayas.", insight: "El valor que necesitas ya fue depositado en ti." },
  { reference: "Proverbios 4:7", verse: "Lo primero es la sabiduría; adquiere sabiduría, y con todo lo que obtengas, adquiere inteligencia.", insight: "Toda inversión en sabiduría da el mayor retorno." },
  { reference: "Romanos 8:28", verse: "Y sabemos que para los que aman a Dios, todas las cosas cooperan para bien, esto es, para los que son llamados conforme a su propósito.", insight: "Hasta el dolor tiene un propósito cuando confías en Dios." },
  { reference: "Proverbios 16:3", verse: "Encomienda al SEÑOR tus obras, y tus planes se afianzarán.", insight: "El plan más sólido es el que Dios sostiene." },
  { reference: "Jeremías 29:11", verse: "Porque yo sé los planes que tengo para vosotros, declara el SEÑOR, planes de bienestar y no de calamidad, para daros un futuro y una esperanza.", insight: "Tu futuro está en manos mejores que las tuyas." },
  { reference: "Isaías 40:31", verse: "Pero los que esperan en el SEÑOR renovarán sus fuerzas; se remontarán con alas como las águilas.", insight: "La espera fiel no debilita — renueva." },
  { reference: "Proverbios 13:4", verse: "El alma del perezoso desea, pero nada alcanza; pero el alma de los diligentes queda satisfecha.", insight: "El deseo sin acción es solo fantasía; la diligencia lo hace real." },
  { reference: "Gálatas 6:9", verse: "Y no nos cansemos de hacer el bien, pues a su tiempo segaremos, si no nos damos por vencidos.", insight: "La constancia en el bien es su propia recompensa." },
  { reference: "Mateo 5:6", verse: "Bienaventurados los que tienen hambre y sed de justicia, pues ellos serán saciados.", insight: "El hambre de crecer es señal de que Dios te está moldeando." },
  { reference: "1 Corintios 9:27", verse: "Sino que golpeo mi cuerpo y lo hago mi esclavo, no sea que habiendo predicado a otros, yo mismo sea descalificado.", insight: "La autodisciplina es la forma más alta de respeto por tu propósito." },
  { reference: "Proverbios 27:17", verse: "El hierro con hierro se aguza, y un hombre aguza a otro.", insight: "Rodéate de personas que te desafíen a crecer." },
  { reference: "Mateo 6:33", verse: "Pero buscad primero su reino y su justicia, y todas estas cosas os serán añadidas.", insight: "Priorizar lo eterno no te quita lo temporal — te lo multiplica." },
  { reference: "Santiago 1:2-4", verse: "Considerad como sumo gozo, hermanos míos, cuando os encontréis en diversas pruebas, sabiendo que la prueba de vuestra fe produce paciencia.", insight: "Las pruebas no llegan para destruirte — llegan para forjarte." },
  { reference: "2 Timoteo 1:7", verse: "Porque Dios no nos ha dado un espíritu de cobardía, sino de poder, de amor y de dominio propio.", insight: "El miedo no es de Dios — el poder y la disciplina sí." },
  { reference: "Proverbios 21:5", verse: "Los planes del diligente ciertamente llevan a la abundancia, pero todo el que se apresura llega solo a la pobreza.", insight: "La planeación paciente supera siempre a la urgencia impulsiva." },
  { reference: "Eclesiastés 9:10", verse: "Todo lo que te venga a la mano para hacer, hazlo con toda tu fuerza.", insight: "La excelencia en lo ordinario es lo que produce lo extraordinario." },
  { reference: "Salmos 37:4", verse: "Pon tu delicia en el SEÑOR, y Él te dará las peticiones de tu corazón.", insight: "El deseo más profundo de tu corazón nació en Él." },
  { reference: "Romanos 12:2", verse: "Y no os adaptéis a este mundo, sino transformaos mediante la renovación de vuestra mente.", insight: "Transformar tu mente transforma tu vida entera." },
  { reference: "Proverbios 3:5-6", verse: "Confía en el SEÑOR con todo tu corazón, y no te apoyes en tu propio entendimiento. Reconócelo en todos tus caminos, y Él enderezará tus sendas.", insight: "La fe activa abre caminos que la razón sola no puede ver." },
  { reference: "1 Pedro 5:7", verse: "Echad toda vuestra ansiedad sobre Él, porque Él tiene cuidado de vosotros.", insight: "Dios no te pide que cargues solo — Él te invita a soltar." },
  { reference: "Proverbios 10:4", verse: "La mano negligente empobrece, pero la mano de los diligentes enriquece.", insight: "La diligencia cotidiana construye fortunas que la suerte no puede dar." },
  { reference: "Colosenses 3:23", verse: "Hagan lo que hagan, trabajen de buena gana, como para el Señor y no como para nadie en este mundo.", insight: "El trabajo con propósito trascendente nunca se siente vacío." },
  { reference: "Isaías 41:10", verse: "No temas, porque yo estoy contigo; no te desalientes, porque yo soy tu Dios. Te fortaleceré, ciertamente te ayudaré.", insight: "La presencia de Dios convierte el miedo en fortaleza." },
  { reference: "Salmos 119:105", verse: "Lámpara es a mis pies tu palabra, y luz para mi camino.", insight: "En la oscuridad de la incertidumbre, la Palabra ilumina el siguiente paso." },
  { reference: "Deuteronomio 8:18", verse: "Sino que recuerdes al SEÑOR tu Dios, porque Él es el que te da poder para hacer riquezas.", insight: "El talento y la fuerza para producir son un don — úsalos con gratitud." },
  { reference: "Proverbios 22:29", verse: "¿Ves un hombre que sea hábil en su trabajo? Estará delante de los reyes; no estará delante de hombres obscuros.", insight: "La maestría en tu oficio abre puertas que ninguna influencia puede abrir." },
  { reference: "Mateo 25:29", verse: "Porque al que tiene, se le dará más, y tendrá en abundancia; pero al que no tiene, aun lo que tiene le será quitado.", insight: "La fidelidad en lo poco es la semilla de lo grande." },
  { reference: "Salmos 1:2-3", verse: "Sino que en la ley del SEÑOR está su deleite, y en su ley medita de día y de noche. Será como árbol plantado junto a corrientes de agua.", insight: "El que se nutre de sabiduría da fruto en toda estación." },
  { reference: "Efesios 6:10", verse: "Por lo demás, fortaleceos en el Señor y en el poder de su fuerza.", insight: "La verdadera fortaleza no se construye sola — se recibe." },
].map(v => ({ ...v, category: 'bible' }));

// ─────────────────────────────────────────────
// COMBINED POOL & DAILY PICKER
// ─────────────────────────────────────────────
const ALL_ENTRIES = [...LAWS_OF_POWER, ...STOIC_QUOTES, ...BIBLE_VERSES];

function getDailyEntry() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return ALL_ENTRIES[dayOfYear % ALL_ENTRIES.length];
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export const DailyLawCard = () => {
  const [expanded, setExpanded] = useState(false);
  const entry = getDailyEntry();
  const cat = CATEGORIES[entry.category];
  const IconComp = cat.icon;

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  // Derive display title / meta by category
  let badgeLabel = '';
  let mainTitle = '';
  let mainBody = '';
  let reflectionText = '';

  if (entry.category === 'law') {
    badgeLabel = `${cat.label} · #${entry.number}`;
    mainTitle = entry.title;
    mainBody = entry.summary;
    reflectionText = entry.insight;
  } else if (entry.category === 'stoic') {
    badgeLabel = `${cat.label} · ${entry.author}`;
    mainTitle = `"${entry.quote}"`;
    mainBody = `— ${entry.author}, ${entry.source}`;
    reflectionText = entry.insight;
  } else {
    badgeLabel = `${cat.label} · ${entry.reference}`;
    mainTitle = `"${entry.verse}"`;
    mainBody = entry.reference;
    reflectionText = entry.insight;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${cat.accentBorder}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: `0 0 32px ${cat.glowColor}`,
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Decorative glow orb */}
      <div style={{
        position: 'absolute', top: '-50px', right: '-50px',
        width: '180px', height: '180px', borderRadius: '50%',
        background: `radial-gradient(circle, ${cat.glowColor.replace('0.08', '0.18')} 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: 'var(--radius-md)', flexShrink: 0,
          background: `linear-gradient(135deg, ${cat.accentBg}, ${cat.accentBorder.replace('0.28', '0.08')})`,
          border: `1px solid ${cat.accentBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: cat.accent
        }}>
          <IconComp size={22} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: cat.accent,
              background: cat.accentBg, border: `1px solid ${cat.accentBorder}`,
              borderRadius: 'var(--radius-full)', padding: '0.15rem 0.65rem'
            }}>
              {badgeLabel}
            </span>
          </div>
          <p style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
            {dateFormatted}
          </p>
          <h3 style={{
            fontSize: entry.category === 'law' ? '1rem' : '0.92rem',
            fontWeight: entry.category === 'law' ? 700 : 600,
            color: 'var(--text-main)', lineHeight: 1.4,
            fontStyle: entry.category !== 'law' ? 'italic' : 'normal'
          }}>
            {mainTitle}
          </h3>
          {entry.category !== 'law' && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
              {mainBody}
            </p>
          )}
        </div>
      </div>

      {/* Insight callout */}
      <div style={{
        background: cat.insideBg,
        borderLeft: `3px solid ${cat.insideBorder}`,
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        padding: '0.7rem 1rem',
        marginBottom: entry.category === 'law' ? '0.75rem' : '0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
          <Zap size={11} color={cat.insideAccent} />
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: cat.insideAccent
          }}>
            {cat.reflectionLabel}
          </span>
        </div>
        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          "{reflectionText}"
        </p>
      </div>

      {/* Expandable summary — only for laws */}
      {entry.category === 'law' && (
        <>
          <button
            onClick={() => setExpanded(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.78rem', fontWeight: 600, color: cat.accent,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.2rem 0', transition: 'opacity var(--transition-fast)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Ocultar explicación' : 'Ver explicación completa'}
          </button>

          {expanded && (
            <div style={{
              marginTop: '0.75rem', padding: '1rem',
              backgroundColor: 'var(--bg-surface-hover)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              animation: 'fadeIn 0.2s ease-out',
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {mainBody}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
