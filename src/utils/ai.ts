import { LevelId } from "@/types/quiz";

export interface GenOptions {
  apiKey?: string;
}

export async function generateQuestions(level: LevelId, count: number, usedIds: Set<string>, opts: GenOptions = {}) {
  const fallback = fallbackQuestions(level, count, usedIds);
  if (!opts.apiKey) return fallback;

  try {
    const sys = levelSystemPrompt(level);
    const user = `Generate ${count} multiple-choice questions in JSON with fields: id, prompt, options (array of 4), answerIndex (0-3). Ensure unique ids and no repeats from: ${[...usedIds].join(',') || 'none'}.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${opts.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini-2025-04-14",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
        temperature: 0.7,
      }),
    });
    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    const arr = Array.isArray(parsed) ? parsed : parsed.questions;
    if (Array.isArray(arr) && arr.length) return arr;
    return fallback;
  } catch {
    return fallback;
  }
}

function levelSystemPrompt(level: LevelId) {
  if (level === 1) return "You create inspiring, factual questions about Dr. A.P.J. Abdul Kalam. Keep them crisp for quiz show.";
  if (level === 2) return "You create general science and fun knowledge questions suitable for a fast quiz show.";
  return "You create Tamil/History focused questions (concise) for a quiz show in English prompts.";
}

function fallbackQuestions(level: LevelId, count: number, used: Set<string>) {
  const bank: Record<LevelId, Array<{p: string; o: string[]; a: number}>> = {
    1: [
      { p: "What is the full name of Dr. A.P.J. Abdul Kalam?", o: ["Avul Pakir Jainulabdeen Abdul Kalam","Abdul Prasad Jain Kalam","Avul Prakash Janardhan Kalam","Abdul Parvez Jaleel Kalam"], a: 0 },
      { p: "In which year was Dr. Kalam born?", o: ["1931","1935","1940","1929"], a: 0 },
      { p: "Dr. Kalam was known as the '___ Man of India'.", o: ["Missile","Science","Rocket","Technology"], a: 0 },
      { p: "Which book by Dr. Kalam is his autobiography?", o: ["Wings of Fire","Ignited Minds","India 2020","My Life"], a: 0 },
      { p: "Dr. Kalam served as the ___ President of India.", o: ["11th","12th","10th","13th"], a: 0 },
      { p: "Dr. Kalam was born in which village?", o: ["Rameswaram","Madurai","Chennai","Trichy"], a: 0 },
      { p: "Which missile program did Dr. Kalam lead?", o: ["Integrated Guided Missile Development Program","Nuclear Program","Space Program","Defence Research"], a: 0 },
      { p: "Dr. Kalam worked at which organization for most of his career?", o: ["DRDO and ISRO","BARC","TIFR","IIT"], a: 0 },
      { p: "What was Dr. Kalam's vision for India?", o: ["Developed nation by 2020","Nuclear power by 2010","Space leader by 2015","Education hub by 2025"], a: 0 },
      { p: "Dr. Kalam died in which year?", o: ["2015","2014","2016","2013"], a: 0 },
      { p: "Which university is named after Dr. Kalam?", o: ["APJ Abdul Kalam Technological University","Kalam Institute","Abdul Kalam University","Dr. Kalam Technical University"], a: 0 },
      { p: "Dr. Kalam was known for his love of which instrument?", o: ["Veena","Guitar","Piano","Flute"], a: 0 },
      { p: "What was Dr. Kalam's father's profession?", o: ["Boat owner","Teacher","Doctor","Farmer"], a: 0 },
      { p: "Dr. Kalam's first job was at?", o: ["Hindustan Aeronautics Limited","DRDO","ISRO","Indian Army"], a: 0 },
      { p: "Which award did Dr. Kalam receive in 1997?", o: ["Bharat Ratna","Padma Vibhushan","Padma Bhushan","Padma Shri"], a: 0 },
      { p: "Dr. Kalam was often called the ___ President.", o: ["People's","Missile","Science","Youth"], a: 0 },
      { p: "What subject did Dr. Kalam study in college?", o: ["Aerospace Engineering","Mechanical Engineering","Electrical Engineering","Civil Engineering"], a: 0 },
      { p: "Dr. Kalam worked on which satellite launch vehicle?", o: ["SLV-3","PSLV","GSLV","ASLV"], a: 0 },
      { p: "Which motto did Dr. Kalam often promote?", o: ["Dream, Dream, Dream","Work, Work, Work","Think, Think, Think","Learn, Learn, Learn"], a: 0 },
      { p: "Dr. Kalam's book 'Ignited Minds' focuses on?", o: ["Youth empowerment","Science","Technology","Politics"], a: 0 },
      { p: "What was Dr. Kalam's mother's name?", o: ["Ashiamma","Fatima","Kamala","Saraswati"], a: 0 },
      { p: "Dr. Kalam believed education should develop?", o: ["Character and competence","Only knowledge","Only skills","Only values"], a: 0 },
      { p: "Which international honor did Dr. Kalam receive?", o: ["Honorary doctorate from multiple universities","Nobel Prize","UNESCO award","UN recognition"], a: 0 },
      { p: "Dr. Kalam was fond of which activity with children?", o: ["Teaching and inspiring","Playing games","Telling stories","Drawing pictures"], a: 0 },
      { p: "What was unique about Dr. Kalam's presidency?", o: ["Connected with common people","Longest tenure","Youngest president","Most traveled"], a: 0 },
      { p: "Dr. Kalam's last public appearance was at?", o: ["IIM Shillong","IIT Delhi","ISRO","DRDO"], a: 0 },
      { p: "Which quality was Dr. Kalam most known for?", o: ["Humility and simplicity","Intelligence","Wealth","Fame"], a: 0 },
      { p: "Dr. Kalam advocated for which type of society?", o: ["Knowledge society","Industrial society","Agricultural society","Service society"], a: 0 },
      { p: "What did Dr. Kalam call his life philosophy?", o: ["Simple living, high thinking","Work hard, party harder","Live fast, die young","Money matters most"], a: 0 },
      { p: "Dr. Kalam's contribution to Pokhran II was as?", o: ["Scientific advisor","Project director","Team member","Observer"], a: 0 },
      { p: "Which bird did Dr. Kalam often mention in his speeches?", o: ["Eagle","Peacock","Parrot","Crow"], a: 0 },
      { p: "Dr. Kalam believed in which approach to problem-solving?", o: ["Scientific temperament","Emotional approach","Political solution","Religious guidance"], a: 0 },
      { p: "What did Dr. Kalam say about failure?", o: ["Failure is not the opposite of success","Failure is permanent","Failure should be avoided","Failure is shameful"], a: 0 },
      { p: "Dr. Kalam's favorite quote was about?", o: ["Dreams and dedication","Money and fame","Power and position","Rest and relaxation"], a: 0 },
      { p: "Which subject did Dr. Kalam emphasize for students?", o: ["Mathematics and Science","Only Arts","Only Commerce","Only Sports"], a: 0 },
      { p: "Dr. Kalam's leadership style was?", o: ["Participative and inspiring","Authoritarian","Hands-off","Micromanaging"], a: 0 },
      { p: "What did Dr. Kalam consider most important for nation building?", o: ["Education and innovation","Only military strength","Only economic growth","Only population control"], a: 0 },
      { p: "Dr. Kalam's vision included India as?", o: ["Self-reliant and progressive","Dependent on others","Isolated from world","Only service provider"], a: 0 },
      { p: "Which value did Dr. Kalam practice throughout his life?", o: ["Integrity","Compromise","Shortcuts","Publicity"], a: 0 },
      { p: "Dr. Kalam's message to youth was?", o: ["You have the power to change the world","Life is predetermined","Success comes easy","Others will solve problems"], a: 0 },
      { p: "What made Dr. Kalam's speeches special?", o: ["Simplicity and inspiration","Complex terminology","Political rhetoric","Entertainment focus"], a: 0 },
      { p: "Dr. Kalam believed research should be?", o: ["Application-oriented","Only theoretical","Profit-focused","Government-controlled"], a: 0 },
      { p: "What was Dr. Kalam's approach to criticism?", o: ["Learn and improve","Ignore completely","Fight back","Get upset"], a: 0 },
      { p: "Dr. Kalam's legacy is primarily in?", o: ["Inspiring generations","Political achievements","Business success","Entertainment industry"], a: 0 },
      { p: "What did Dr. Kalam say about small dreams?", o: ["Small dreams do not fire the mind","Small dreams are practical","Small dreams are safe","Small dreams are better"], a: 0 },
      { p: "Dr. Kalam's final message to students was about?", o: ["Pursuing dreams with determination","Getting good marks","Finding jobs","Making money"], a: 0 },
      { p: "How is Dr. Kalam remembered today?", o: ["As an inspiration for all","As a politician","As a businessman","As an entertainer"], a: 0 },
      { p: "Dr. Kalam's greatest achievement was?", o: ["Inspiring millions of young minds","Building missiles","Becoming President","Writing books"], a: 0 },
      { p: "What did Dr. Kalam say about teachers?", o: ["Best teachers are those who show where to look","Teachers should be strict","Teachers know everything","Teachers should lecture only"], a: 0 },
      { p: "Dr. Kalam's life teaches us?", o: ["Hard work and dedication lead to success","Success comes by chance","Education is not important","Dreams are useless"], a: 0 },
      { p: "What is Dr. Kalam popularly known as?", o: ["Father of the Nation","Missile Man of India","Iron Man of India","Bharat Ratna Winner"], a: 1 },
      { p: "Which book was written by Dr. A.P.J. Abdul Kalam?", o: ["Discovery of India","My Experiments with Truth","Wings of Fire","Ignited Minds"], a: 2 },
      { p: "In which year did Dr. Kalam become the President of India?", o: ["2005","1997","2010","2002"], a: 3 },
      { p: "Dr. Kalam was born in which state?", o: ["Tamil Nadu","Kerala","Karnataka","Andhra Pradesh"], a: 0 },
      { p: "Which island is named after Dr. Kalam?", o: ["Sriharikota","Wheeler Island","Lakshadweep","Andaman"], a: 1 },
      { p: "What profession did Kalam pursue before becoming President?", o: ["Politician","Teacher","Scientist","Writer"], a: 2 },
      { p: "Which award did Kalam receive in 1997?", o: ["Padma Shri","Padma Vibhushan","Noble Prize","Bharat Ratna"], a: 3 },
      { p: "Kalam worked with which Indian space organization?", o: ["ISRO","DRDO","NASA","HAL"], a: 0 },
      { p: "What was Kalam's dream for India by 2020?", o: ["Superpower in Sports","Developed Nation","Richest Country","World Leader in Fashion"], a: 1 },
      { p: "Which subject did Kalam love teaching after presidency?", o: ["Mathematics","History","Science","Economics"], a: 2 },
      // NEW QUESTIONS - 10 more for Level 1
      { p: "Where was Dr. A.P.J. Abdul Kalam born?", o: ["Chennai","Madurai","Rameswaram","Trichy"], a: 2 },
      { p: "What is the nickname of Dr. Kalam?", o: ["Iron Man of India","Father of the Nation","Young Scientist","Missile Man of India"], a: 3 },
      { p: "Kalam served as which number President of India?", o: ["10th","11th","12th","13th"], a: 1 },
      { p: "Which subject did Kalam love teaching most?", o: ["Physics","Aerospace","Mathematics","Biology"], a: 2 },
      { p: "What was the name of Kalam's autobiography?", o: ["Wings of Fire","Ignited Minds","My Experiments with Truth","Spirit of India"], a: 0 },
      { p: "Dr. Kalam worked in which two major Indian space/defense organizations?", o: ["ISRO & DRDO","BARC & HAL","CSIR & TATA","ONGC & BEL"], a: 0 },
      { p: "In which year was Dr. Kalam awarded Bharat Ratna?", o: ["1995","1997","2000","2002"], a: 1 },
      { p: "Which rocket project earned Kalam the title 'Missile Man'?", o: ["Agni & Prithvi","PSLV","SLV-3","INSAT"], a: 0 },
      { p: "Kalam passed away while delivering a lecture at?", o: ["IIT Delhi","IIM Shillong","Anna University","NIT Trichy"], a: 1 },
      { p: "Kalam always encouraged students to?", o: ["Dream big","Study abroad","Join politics","Avoid technology"], a: 0 }
    ],
    2: [
      { p: "What is the chemical symbol for water?", o: ["H2O","O2H","HO2","OH"], a: 0 },
      { p: "Who proposed the law of universal gravitation?", o: ["Isaac Newton","Albert Einstein","Galileo Galilei","Nikola Tesla"], a: 0 },
      { p: "Which gas do plants absorb during photosynthesis?", o: ["Carbon Dioxide","Oxygen","Nitrogen","Helium"], a: 0 },
      { p: "The speed of light is approximately ___ km/s.", o: ["300,000","30,000","3,000","300"], a: 0 },
      { p: "Which part of the cell contains the genetic material?", o: ["Nucleus","Cytoplasm","Cell wall","Mitochondria"], a: 0 },
      { p: "What is the hardest natural substance?", o: ["Diamond","Iron","Gold","Platinum"], a: 0 },
      { p: "How many bones are in an adult human body?", o: ["206","196","216","186"], a: 0 },
      { p: "What is the largest planet in our solar system?", o: ["Jupiter","Saturn","Earth","Mars"], a: 0 },
      { p: "Which scientist developed the theory of relativity?", o: ["Albert Einstein","Isaac Newton","Stephen Hawking","Marie Curie"], a: 0 },
      { p: "What is the powerhouse of the cell?", o: ["Mitochondria","Nucleus","Ribosome","Endoplasmic reticulum"], a: 0 },
      { p: "Which element has the chemical symbol 'Au'?", o: ["Gold","Silver","Aluminum","Argon"], a: 0 },
      { p: "What force keeps planets in orbit around the sun?", o: ["Gravity","Magnetism","Electricity","Friction"], a: 0 },
      { p: "How many chambers does a human heart have?", o: ["Four","Two","Three","Five"], a: 0 },
      { p: "What is the most abundant gas in Earth's atmosphere?", o: ["Nitrogen","Oxygen","Carbon dioxide","Argon"], a: 0 },
      { p: "Which blood type is known as the universal donor?", o: ["O negative","AB positive","A positive","B negative"], a: 0 },
      { p: "What is the unit of electric current?", o: ["Ampere","Volt","Watt","Ohm"], a: 0 },
      { p: "Which planet is known as the Red Planet?", o: ["Mars","Venus","Jupiter","Mercury"], a: 0 },
      { p: "What is the process by which plants make their food?", o: ["Photosynthesis","Respiration","Digestion","Absorption"], a: 0 },
      { p: "Which scientist discovered penicillin?", o: ["Alexander Fleming","Louis Pasteur","Marie Curie","Charles Darwin"], a: 0 },
      { p: "What is the smallest unit of matter?", o: ["Atom","Molecule","Cell","Tissue"], a: 0 },
      { p: "How many minutes does it take for light from the sun to reach Earth?", o: ["8","4","12","16"], a: 0 },
      { p: "What is the study of earthquakes called?", o: ["Seismology","Geology","Meteorology","Astronomy"], a: 0 },
      { p: "Which vitamin is produced when skin is exposed to sunlight?", o: ["Vitamin D","Vitamin C","Vitamin A","Vitamin B"], a: 0 },
      { p: "What is the largest mammal in the world?", o: ["Blue whale","African elephant","Giraffe","Hippopotamus"], a: 0 },
      { p: "Which gas makes up about 21% of Earth's atmosphere?", o: ["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"], a: 0 },
      { p: "What is the center of an atom called?", o: ["Nucleus","Electron","Proton","Neutron"], a: 0 },
      { p: "How many teeth does an adult human typically have?", o: ["32","28","30","34"], a: 0 },
      { p: "What is the fastest land animal?", o: ["Cheetah","Lion","Horse","Antelope"], a: 0 },
      { p: "Which organ in the human body produces insulin?", o: ["Pancreas","Liver","Kidney","Heart"], a: 0 },
      { p: "What is the chemical formula for salt?", o: ["NaCl","KCl","CaCl2","MgCl2"], a: 0 },
      { p: "How many days does it take for the Moon to orbit Earth?", o: ["28","30","24","32"], a: 0 },
      { p: "What is the study of living organisms called?", o: ["Biology","Chemistry","Physics","Geology"], a: 0 },
      { p: "Which planet has the most moons?", o: ["Jupiter","Saturn","Earth","Mars"], a: 0 },
      { p: "What is the boiling point of water at sea level?", o: ["100°C","90°C","110°C","120°C"], a: 0 },
      { p: "Which part of the brain controls balance?", o: ["Cerebellum","Cerebrum","Brain stem","Medulla"], a: 0 },
      { p: "What is the largest organ in the human body?", o: ["Skin","Liver","Brain","Heart"], a: 0 },
      { p: "How many pairs of chromosomes do humans have?", o: ["23","22","24","25"], a: 0 },
      { p: "What is the process of liquid changing to gas called?", o: ["Evaporation","Condensation","Sublimation","Freezing"], a: 0 },
      { p: "Which scientist proposed the theory of evolution?", o: ["Charles Darwin","Gregor Mendel","Louis Pasteur","Alfred Wallace"], a: 0 },
      { p: "What is the pH of pure water?", o: ["7","6","8","9"], a: 0 },
      { p: "How many sides does a hexagon have?", o: ["6","5","7","8"], a: 0 },
      { p: "What is the main component of natural gas?", o: ["Methane","Ethane","Propane","Butane"], a: 0 },
      { p: "Which blood vessels carry blood away from the heart?", o: ["Arteries","Veins","Capillaries","Venules"], a: 0 },
      { p: "What is the smallest bone in the human body?", o: ["Stapes","Malleus","Incus","Femur"], a: 0 },
      { p: "How many continents are there?", o: ["7","6","5","8"], a: 0 },
      { p: "What is the study of weather called?", o: ["Meteorology","Climatology","Geography","Astronomy"], a: 0 },
      { p: "Which element is essential for photosynthesis?", o: ["Carbon","Nitrogen","Phosphorus","Sulfur"], a: 0 },
      { p: "What is the largest desert in the world?", o: ["Antarctica","Sahara","Gobi","Arabian"], a: 0 },
      { p: "How many valves does the human heart have?", o: ["4","2","3","6"], a: 0 },
      { p: "What is the study of stars and planets called?", o: ["Astronomy","Astrology","Astrophysics","Cosmology"], a: 0 },
      { p: "Water boils at what temperature at sea level?", o: ["90°C","100°C","120°C","80°C"], a: 1 },
      { p: "Who invented the telephone?", o: ["Thomas Edison","Nikola Tesla","Alexander Graham Bell","James Watt"], a: 2 },
      { p: "Which planet is known as the Red Planet?", o: ["Venus","Jupiter","Saturn","Mars"], a: 3 },
      { p: "What gas do humans exhale?", o: ["Carbon Dioxide","Oxygen","Nitrogen","Hydrogen"], a: 0 },
      { p: "The hardest substance on Earth is?", o: ["Iron","Diamond","Gold","Platinum"], a: 1 },
      { p: "Electricity is measured in?", o: ["Joules","Newtons","Volts","Hertz"], a: 2 },
      { p: "Which part of the plant makes food?", o: ["Root","Stem","Flower","Leaf"], a: 3 },
      { p: "The chemical symbol for water is?", o: ["H₂O","CO₂","O₂","NaCl"], a: 0 },
      { p: "Which vitamin is produced in the human body when exposed to sunlight?", o: ["Vitamin A","Vitamin D","Vitamin C","Vitamin K"], a: 1 },
      { p: "Who is known as the father of electricity?", o: ["Albert Einstein","Isaac Newton","Michael Faraday","Archimedes"], a: 2 },
      // NEW QUESTIONS - 10 more for Level 2
      { p: "What planet is known as the Red Planet?", o: ["Venus","Jupiter","Mars","Saturn"], a: 2 },
      { p: "What is H2O commonly known as?", o: ["Hydrogen Peroxide","Water","Steam","Ice"], a: 1 },
      { p: "Who discovered gravity?", o: ["Albert Einstein","Galileo","James Watt","Isaac Newton"], a: 3 },
      { p: "The speed of light is approximately?", o: ["1.5 × 10^6 m/s","9.8 m/s^2","3 × 10^8 m/s","5 × 10^10 m/s"], a: 2 },
      { p: "Which gas do humans exhale?", o: ["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"], a: 2 },
      { p: "The human brain is part of which system?", o: ["Digestive system","Respiratory system","Circulatory system","Nervous system"], a: 3 },
      { p: "What is the chemical symbol for Gold?", o: ["Ag","Gd","Au","Go"], a: 2 },
      { p: "Earth's only natural satellite is?", o: ["Mars","Titan","The Moon","Europa"], a: 2 },
      { p: "Which vitamin is produced when skin is exposed to sunlight?", o: ["Vitamin A","Vitamin C","Vitamin D","Vitamin B12"], a: 2 },
      { p: "Which scientist proposed the Theory of Relativity?", o: ["Newton","Galileo","Tesla","Einstein"], a: 3 }
    ],
    3: [
      { p: "Which is the oldest Tamil literary work?", o: ["Tholkappiyam","Silappathikaram","Purananuru","Manimekalai"], a: 0 },
      { p: "Who is known as the 'Tamil Thai'?", o: ["Tamil language personified","A poet","A queen","A goddess of war"], a: 0 },
      { p: "Which Tamil king is known for his generosity?", o: ["Paari","Karikalan","Rajaraja Chola","Cheran Senguttuvan"], a: 0 },
      { p: "Pongal is a festival celebrated in which month?", o: ["January","March","August","October"], a: 0 },
      { p: "The epic Silappathikaram revolves around which character?", o: ["Kannagi","Manimekalai","Kovalan","Madhavi"], a: 0 },
      { p: "How many letters are there in the Tamil alphabet?", o: ["247","200","300","150"], a: 0 },
      { p: "Which dynasty built the Brihadeeswara Temple?", o: ["Chola","Pallava","Pandya","Chera"], a: 0 },
      { p: "Tamil belongs to which language family?", o: ["Dravidian","Indo-Aryan","Sino-Tibetan","Austroasiatic"], a: 0 },
      { p: "Who wrote the epic Silappatikaram?", o: ["Ilango Adigal","Kamban","Bharathi","Bharathidasan"], a: 0 },
      { p: "Which is the classical dance form of Tamil Nadu?", o: ["Bharatanatyam","Kathak","Odissi","Manipuri"], a: 0 },
      { p: "The Sangam period lasted for how many years?", o: ["600","400","800","1000"], a: 0 },
      { p: "Who is known as the Shakespeare of Tamil literature?", o: ["Kamban","Bharathi","Thiruvalluvar","Ilango"], a: 0 },
      { p: "Thirukkural was written by?", o: ["Thiruvalluvar","Kamban","Bharathi","Avvaiyar"], a: 0 },
      { p: "How many chapters are there in Thirukkural?", o: ["133","100","150","200"], a: 0 },
      { p: "Which port city was important during the Sangam period?", o: ["Puhar","Madurai","Thanjavur","Kanchipuram"], a: 0 },
      { p: "The Pandya kingdom's capital was?", o: ["Madurai","Chennai","Thanjavur","Kanchipuram"], a: 0 },
      { p: "Who is considered the mother of Tamil?", o: ["Avvaiyar","Andal","Karaikkal Ammaiyar","Nachiyar"], a: 0 },
      { p: "Tamil New Year is celebrated as?", o: ["Puthandu","Pongal","Diwali","Onam"], a: 0 },
      { p: "Which Tamil poet is known as Mahakavi?", o: ["Bharathi","Bharathidasan","Kamban","Nammalvar"], a: 0 },
      { p: "The Chola empire reached its peak under?", o: ["Rajaraja Chola I","Rajendra Chola","Karikalan","Vijayalaya"], a: 0 },
      { p: "Mahabalipuram monuments were built by?", o: ["Pallavas","Cholas","Pandyas","Cheras"], a: 0 },
      { p: "Which Tamil month marks the beginning of summer?", o: ["Chithirai","Vaikasi","Aani","Aadi"], a: 0 },
      { p: "The ancient Tamil country was divided into how many regions?", o: ["5","3","4","6"], a: 0 },
      { p: "Purananooru contains how many poems?", o: ["400","300","500","600"], a: 0 },
      { p: "Who translated Ramayana into Tamil?", o: ["Kamban","Bharathi","Thiruvalluvar","Avvaiyar"], a: 0 },
      { p: "Tamil is an official language of which country besides India?", o: ["Sri Lanka","Malaysia","Singapore","Myanmar"], a: 0 },
      { p: "The Tamil film industry is popularly known as?", o: ["Kollywood","Bollywood","Tollywood","Sandalwood"], a: 0 },
      { p: "Which Tamil king is mentioned in Ashoka's edicts?", o: ["All three","Chera","Chola","Pandya"], a: 0 },
      { p: "The ancient Tamil trading guilds were called?", o: ["All of these","Nanadesis","Ayyavole","Manigramam"], a: 0 },
      { p: "Tamil calendar month corresponding to April-May is?", o: ["Chithirai","Vaikasi","Thai","Maasi"], a: 0 },
      { p: "Who is the patron deity of Tamil literature?", o: ["Murugan","Ganesha","Saraswati","Lakshmi"], a: 0 },
      { p: "The Tamil grammatical work Nannool was written by?", o: ["Pavanandhi","Tolkappiyar","Agathiyar","Bharathi"], a: 0 },
      { p: "Which river is considered sacred in Tamil culture?", o: ["Kaveri","Vaigai","Tamiraparani","Palar"], a: 0 },
      { p: "The ancient Tamil anthology Ettuthokai contains how many collections?", o: ["8","10","6","12"], a: 0 },
      { p: "Tamil month of harvest festival is?", o: ["Thai","Margazhi","Chithirai","Vaikasi"], a: 0 },
      { p: "Who established the Tamil Sangam?", o: ["Agathiyar","Tolkappiyar","Tiruvalluvar","Unknown"], a: 0 },
      { p: "The Tamil epic Manimekalai was written by?", o: ["Seethalai Sattanar","Ilango Adigal","Kamban","Bharathi"], a: 0 },
      { p: "Which Tamil king performed the Rajasuya sacrifice?", o: ["Rajendra Chola","Rajaraja Chola","Karikalan","Neduncheziyan"], a: 0 },
      { p: "Tamil numerical system is based on?", o: ["Decimal","Binary","Octal","Hexadecimal"], a: 0 },
      { p: "The ancient Tamil medical system is called?", o: ["Siddha","Ayurveda","Unani","Homeopathy"], a: 0 },
      { p: "Which Tamil text deals with statecraft?", o: ["Thirukkural","Silappatikaram","Manimekalai","Purananuru"], a: 0 },
      { p: "Tamil month dedicated to Lord Murugan is?", o: ["Aippasi","Thai","Chithirai","Panguni"], a: 0 },
      { p: "The Tamil word for school is?", o: ["Palli","Vidyalaya","Gurukula","Ashram"], a: 0 },
      { p: "Which Tamil festival celebrates the victory of good over evil?", o: ["Diwali","Pongal","Navaratri","Karthigai"], a: 0 },
      { p: "Tamil literature's golden age is considered to be?", o: ["Sangam period","Medieval period","Modern period","Ancient period"], a: 0 },
      { p: "The Tamil concept of beauty is expressed through?", o: ["Azhagu","Soundarya","Roop","Shobha"], a: 0 },
      { p: "Which Tamil text is considered a guide for ethical living?", o: ["Thirukkural","Silappatikaram","Kambaramayanam","Periyapuranam"], a: 0 },
      { p: "Tamil New Year typically falls in which month?", o: ["April","January","March","May"], a: 0 },
      { p: "The Tamil martial art form is called?", o: ["Silambam","Kalaripayattu","Gatka","Thang-ta"], a: 0 },
      { p: "Tamil cultural identity is strongly associated with?", o: ["All of the above","Language","Literature","Traditions"], a: 0 },
      { p: "Who is called the 'Father of Tamil Literature'?", o: ["Bharathiyar","Ilango Adigal","Kambar","Tholkappiyar"], a: 3 },
      { p: "Which is the oldest Tamil grammar book?", o: ["Tholkappiyam","Silappathikaram","Kamba Ramayanam","Tirukkural"], a: 0 },
      { p: "Who wrote Tirukkural?", o: ["Kambar","Thiruvalluvar","Bharathidasan","Avvaiyar"], a: 1 },
      { p: "What is the symbol of Tamil language pride?", o: ["Bharathiyar Songs","Silappathikaram","Tamil Thai Valthu","Pongal"], a: 2 },
      { p: "Which festival is considered Tamil New Year?", o: ["Pongal","Diwali","Aadi Perukku","Puthandu"], a: 3 },
      { p: "Which Tamil poet is known as Mahakavi?", o: ["Bharathiyar","Kambar","Thiruvalluvar","Avvaiyar"], a: 0 },
      { p: "Who composed the epic Silappathikaram?", o: ["Kambar","Ilango Adigal","Bharathidasan","Periyar"], a: 1 },
      { p: "Which river is praised in many Tamil poems?", o: ["Ganga","Yamuna","Kaveri","Krishna"], a: 2 },
      { p: "Which Tamil king is associated with the legend of giving away his kingdom?", o: ["Karikalan","Rajaraja Chola","Pandian","Pari"], a: 3 },
      { p: "The Tamil classical dance form is?", o: ["Bharatanatyam","Kathak","Odissi","Kathakali"], a: 0 },
      // NEW QUESTIONS - 10 more for Level 3
      { p: "Who is called the 'Father of Tamil Literature'?", o: ["Thiruvalluvar","Ilango Adigal","Bharathiyar","Agastya"], a: 3 },
      { p: "Thirukkural has how many couplets?", o: ["1500","2000","1200","1330"], a: 3 },
      { p: "Silappatikaram was written by?", o: ["Kamban","Thiruvalluvar","Avvaiyar","Ilango Adigal"], a: 3 },
      { p: "Which Tamil king supported arts and literature greatly?", o: ["Ashoka","Krishna Devaraya","Akbar","Raja Raja Chola"], a: 3 },
      { p: "Bharathiyar is also known as?", o: ["Vallal","Kavi Chakravarthy","Pulavar","Mahakavi"], a: 3 },
      { p: "What is the Tamil word for 'Education'?", o: ["Arivu","Mozhi","Puthagam","Kalvi"], a: 3 },
      { p: "Which Sangam literature is about love and war?", o: ["Tholkappiyam","Pathupattu","Silappatikaram","Ettuthogai"], a: 3 },
      { p: "Who is the author of 'Manimekalai'?", o: ["Avvaiyar","Kambar","Ilango","Sattanar"], a: 3 },
      { p: "Which Tamil classic deals with Tamil grammar?", o: ["Thirukkural","Silappatikaram","Agananuru","Tholkappiyam"], a: 3 },
      { p: "The Tamil month 'Aadi' is known for which festival?", o: ["Pongal","Deepavali","Karthigai Deepam","Aadi Perukku"], a: 3 }
    ],
  };
  const out: any[] = [];
  const pool = bank[level];
  const idxs = Array.from({ length: pool.length }, (_, i) => i).filter(i => !used.has(`L${level}-${i}`));
  shuffle(idxs);
  for (let i = 0; i < Math.min(count, idxs.length); i++) {
    const ii = idxs[i];
    const it = pool[ii];
    
    // Shuffle options while maintaining correct answer
    const shuffledOptions = [...it.o];
    const correctAnswer = shuffledOptions[it.a];
    shuffle(shuffledOptions);
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswer);
    
    out.push({ 
      id: `L${level}-${ii}`, 
      level, 
      prompt: it.p, 
      options: shuffledOptions, 
      answerIndex: newAnswerIndex 
    });
  }
  return out;
}

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
}