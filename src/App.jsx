import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// SHARED TOPIC POOL — VFA ↔ 10th Prelim only
// Key format: "shared::<id>"
// ═══════════════════════════════════════════════════════════════════════════
const SHARED_TOPICS = {
  // Physics
  ph01: "ഭൗതീകശാസ്ത്രത്തിന്റെ ശാഖകൾ, ദ്രവ്യം, യൂണിറ്റ്, അളവുകൾ",
  ph02: "ചലനം - ന്യൂട്ടന്റെ ചലന നിയമങ്ങൾ, ആക്കം, പ്രൊജക്ടൈൽ മോഷൻ, ISRO നേട്ടങ്ങൾ",
  ph03: "പ്രകാശം - ലെൻസ്, ദർപ്പണം, r=2f, വിവിധ പ്രതിഭാസങ്ങൾ, മഴവില്ല്, EM സ്പെക്ട്രം",
  ph04: "ശബ്ദം - വിവിധ തരം തരംഗങ്ങൾ, അനുരണനം, ആവർതന പ്രതിപതനം",
  ph05: "ബലം - ഘർഷണം, ദ്രാവക മർദ്ദം, പ്ലവക്ഷമ ബലം, ആർക്കമിഡീസ്, പാസ്കൽ നിയമം",
  ph06: "ഗുരുത്വാകർഷണം - അഭികേന-അപകേന ബലം, ഉപഗ്രഹങ്ങൾ, 'g' യുടെ മൂല്യം",
  ph07: "താപം - താപനില, വിവിധ തെർമോമീറ്ററുകൾ, ആർദ്രത",
  ph08: "പ്രവൃത്തി, ഊർജ്ജം, പവർ - ഉത്തോലകങ്ങൾ, ഗണിത പ്രശ്നങ്ങൾ",
  // Chemistry
  ch01: "ആറ്റം, തന്മാത്ര, ദ്രവ്യത്തിന്റെ അവസ്ഥകൾ, രൂപാന്തരത്വം, വാതക നിയമങ്ങൾ, അക്വാ റീജിയ",
  ch02: "മൂലകങ്ങൾ, ആവർതന പട്ടിക, ലോഹങ്ങൾ, അലോഹങ്ങൾ, രാസ-ഭൗതിക മാറ്റങ്ങൾ",
  ch03: "രാസ പ്രവർതനങ്ങൾ, ലായനികൾ, മിശ്രിതങ്ങൾ, സംയുക്തങ്ങൾ",
  ch04: "ലോഹങ്ങൾ, അലോഹങ്ങൾ, ലോഹസങ്കരങ്ങൾ",
  ch05: "ആസിഡ്, ബേസ്, pH മൂല്യം, ആൽക്കലോയ്ഡുകൾ",
  // Life Science
  ls01: "മനുഷ്യ ശരീരത്തെക്കുറിച്ചുള്ള പൊതു അറിവ്",
  ls02: "ജീവകങ്ങളും ധാതുക്കളും അവയുടെ അപര്യാപ്തതാ രോഗങ്ങളും",
  ls03: "സാംക്രമിക രോഗങ്ങളും രോഗകാരികളും, പ്രതിരോധ-പ്രതിവിധി മാർഗ്ഗങ്ങൾ",
  ls04: "കേരളത്തിലെ ആരോഗ്യക്ഷേമ പ്രവർതനങ്ങൾ",
  ls05: "ജീവിതശൈലീ രോഗങ്ങൾ",
  ls06: "അടിസ്ഥാന ആരോഗ്യ വിജ്ഞാനം",
  ls07: "പരിസ്ഥിതിയും പരിസ്ഥിതി പ്രശ്നങ്ങളും",
  // Kerala facts
  ke01: "കേരളത്തിലെ നദികളും കായലുകളും",
  ke02: "കേരളത്തിലെ വൈദ്യുത പദ്ധതികൾ",
  ke03: "വന്യജീവി സങ്കേതങ്ങളും ദേശീയോദ്യാനങ്ങളും",
  ke04: "കേരളത്തിലെ മത്സ്യബന്ധനം",
  ke05: "കേരളം - ജില്ലകൾ, ഭൂപ്രകൃതി, സവിശേഷതകൾ",
  ke06: "കേരളത്തിലെ കൃഷിയും ഗവേഷണ സ്ഥാപനങ്ങളും",
  ke07: "കേരളത്തിലെ ധാതുക്കളും വ്യവസായങ്ങളും",
  ke08: "കേരളം - ഗതാഗത സംവിധാനങ്ങൾ (റോഡ്, ജലം, റെയിൽ, വ്യോമം)",
  // Kerala reformers / Renaissance
  kr01: "അയ്യൻകാളിയും സാമൂഹ്യ പരിഷ്കരണവും",
  kr02: "ചട്ടമ്പി സ്വാമികളും സംഭാവനകളും",
  kr03: "ശ്രീനാരായണ ഗുരുവും നവോത്ഥാനവും",
  kr04: "പണ്ഡിറ്റ് കറുപ്പനും സംഭാവനകളും",
  kr05: "വി.ടി. ഭട്ടതിരിപ്പാടും സാമൂഹ്യ പരിഷ്കരണവും",
  kr06: "കുമാര ഗുരുദേവന്റെ സംഭാവനകൾ",
  kr07: "മന്നത്ത് പദ്മനാഭനും എൻ.എസ്.എസ്. പ്രസ്ഥാനവും",
  kr08: "കേരളത്തിലെ സ്വാതന്ത്ര്യ സമര പ്രസ്ഥാനങ്ങൾ",
  kr09: "ഐക്യ കേരള പ്രസ്ഥാനം",
  kr10: "1956-നു ശേഷമുള്ള കേരളത്തിന്റെ സാമൂഹ്യ-രാഷ്ട്രീയ ചരിത്രം",
  // Arithmetic
  ar01: "സംഖ്യകളും അടിസ്ഥാന ക്രിയകളും",
  ar02: "ലസാഗു, ഉസാഘ (LCM & HCF)",
  ar03: "ഭിന്നസംഖ്യകളും ദശാംശ സംഖ്യകളും",
  ar04: "ശതമാനം (Percentage)",
  ar05: "ലാഭവും നഷ്ടവും (Profit & Loss)",
  ar06: "സാധാരണ പലിശയും കൂട്ടുപലിശയും",
  ar07: "അംശബന്ധവും അനുപാതവും (Ratio & Proportion)",
  ar08: "സമയവും ദൂരവും (Time & Distance)",
  ar09: "സമയവും പ്രവൃത്തിയും (Time & Work)",
  ar10: "ശരാശരി (Average)",
  ar11: "കൃത്യാംഗങ്ങൾ (Laws of Exponents)",
  ar12: "ജ്യാമിതീയ രൂപങ്ങൾ - ചുറ്റളവ്, വിസ്തീർണ്ണം, വ്യാപ്തം (Mensuration)",
  ar13: "പ്രോഗ്രഷനുകൾ (Progressions)",
  // Reasoning
  re01: "ശ്രേണികൾ - സംഖ്യ, അക്ഷര ശ്രേണികൾ (Series)",
  re02: "ഗണിത ചിഹ്നങ്ങൾ ഉപയോഗിച്ചുള്ള പ്രശ്നങ്ങൾ",
  re03: "സ്ഥാന നിർണ്ണയ പരിശോധന (Verifying Positions)",
  re04: "സമാന ബന്ധങ്ങൾ (Analogy - Word, Alphabet, Number)",
  re05: "ഒറ്റയാനെ കണ്ടെത്തൽ (Odd Man Out)",
  re06: "സംഖ്യാ ശേഷി (Numerical Ability)",
  re07: "കോഡിങും ഡീകോഡിങും (Coding & Decoding)",
  re08: "കുടുംബ ബന്ധങ്ങൾ (Family Relations)",
  re09: "ദിശാബോധം (Sense of Direction)",
  re10: "ക്ലോക്കിലെ സമയവും കോണളവും (Time & Angles)",
  re11: "ക്ലോക്കിലെ സമയവും പ്രതിബിംബവും (Clock Reflection)",
  re12: "കലണ്ടറും തീയതിയും (Date & Calendar)",
  re13: "ക്ലറിക്കൽ ശേഷി (Clerical Ability)",
  // Malayalam language
  ml01: "പദശുദ്ധി (ശരിയായ വാക്കുകൾ)",
  ml02: "വാക്യശുദ്ധി (ശരിയായ വാക്യ ഘടന)",
  ml03: "പരിഭാഷ (Translation)",
  ml04: "ഒറ്റപ്പദം (One Word Substitution)",
  ml05: "പര്യായം (Synonyms)",
  ml06: "വിപരീത പദം (Antonyms)",
  ml07: "ശൈലികൾ / പഴഞ്ചൊല്ലുകൾ (Idioms & Proverbs)",
  ml08: "സമാനപദം (Equivalent Words)",
  ml09: "ചേർത്തെഴുതുക (Sandhi / Join Words)",
  ml10: "സ്ത്രീലിംഗം / പുല്ലിംഗം (Gender)",
  ml11: "വചനം (Singular & Plural)",
  ml12: "പിരിച്ചെഴുതൽ (Split Words)",
  ml13: "ഘടകപദം - വാക്യം ചേർത്തെഴുതുക (Adding Phrases)",
  // India History (shared)
  ih01: "ബ്രിട്ടീഷ് ആധിപത്യം - ഒന്നാം സ്വാതന്ത്ര്യ സമരം (1857)",
  ih02: "ഇന്ത്യൻ നാഷണൽ കോൺഗ്രസ് രൂപീകരണം",
  ih03: "സ്വദേശി പ്രസ്ഥാനം",
  ih04: "സാമൂഹ്യ പരിഷ്കരണ പ്രസ്ഥാനങ്ങൾ - ഇന്ത്യ",
  ih05: "സ്വാതന്ത്ര്യ സമരവും മഹാത്മാ ഗാന്ധിയും",
  ih06: "ഇന്ത്യൻ സ്വാതന്ത്ര്യം - സ്വാതന്ത്ര്യാനന്തര കാലഘട്ടം",
  ih07: "സംസ്ഥാനങ്ങളുടെ പുനഃസംഘടന",
  ih08: "ഇംഗ്ലണ്ടിലെ മഹത്തായ വിപ്ലവം",
  ih09: "അമേരിക്കൻ സ്വാതന്ത്ര്യ സമരം",
  ih10: "ഫ്രഞ്ച് വിപ്ലവം",
  ih11: "റഷ്യൻ വിപ്ലവം",
  ih12: "ചൈനീസ് വിപ്ലവം",
  ih13: "രണ്ടാം ലോക മഹായുദ്ധാനന്തര രാഷ്ട്രീയ ചരിത്രം",
  ih14: "ഐക്യരാഷ്ട്ര സംഘടനയും അന്തർദേശീയ സംഘടനകളും",
  // Kerala History (shared)
  kh01: "കേരളം - യൂറോപ്യന്മാരുടെ വരവും സംഭാവനകളും",
  kh02: "മാർതാണ്ഡ വർമ്മ മുതൽ ശ്രീചിത്തിരതിരുനാൾ - തിരുവിതാംകൂർ ചരിത്രം",
  kh03: "കേരളത്തിലെ സാമൂഹ്യ-മത-നവോത്ഥാന പ്രസ്ഥാനങ്ങൾ",
  kh04: "കേരള ചരിത്രത്തിന്റെ സാഹിത്യ സ്രോതസ്സുകൾ",
};

// ═══════════════════════════════════════════════════════════════════════════
// EXAM DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════
const EXAMS = [
  // ─────────────────────────────────────────────────────────────────────────
  // EXAM 1: KSFE / Jr. Assistant — STANDALONE (English, Degree Level)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ksfe",
    name: "Jr. Asst / Cashier",
    shortName: "KSFE",
    catNo: "Cat. 26/2022",
    org: "KSFE / KSEB / KMML",
    level: "Degree Level",
    totalMarks: 100,
    lang: "en",
    color: "#818CF8",
    icon: "🏦",
    standalone: true,
    subjects: [
      { id:"ksfe_hist", name:"History", marks:5, icon:"🏛️", section:"General Knowledge",
        topics:["Kerala: Arrival of Europeans in Kerala","Kerala: Contributions of Europeans","Kerala: Travancore — Marthanda Varma to Sree Chithirathirunal","Kerala: Social and Religious Reform Movements","Kerala: National Movement in Kerala","Kerala: Literary Sources of Kerala History","Kerala: United Kerala Movement","Kerala: Political & Social History after 1956","India: Political History — Establishment of the British","India: First War of Independence (1857)","India: Formation of INC","India: Swadeshi Movement","India: Social Reform Movements","India: Newspapers & Arts during Freedom Struggle","India: Independence Movement & Mahatma Gandhi","India: Post-Independent Period","India: State Reorganisation","India: Foreign Policy","World: Great Revolution in England","World: American War of Independence","World: French Revolution","World: Russian Revolution","World: Chinese Revolution","World: Political History after WW2","World: UNO and International Organizations"] },
      { id:"ksfe_geo", name:"Geography", marks:5, icon:"🌍", section:"General Knowledge",
        topics:["Basics of Geography — Earth Structure","Atmosphere, Rocks, Landforms","Pressure Belt, Winds, Temperature & Seasons","Global Issues — Global Warming","Various Forms of Pollution","Maps — Topographic Maps and Signs","Remote Sensing — GIS","Oceans and various movements","Continents — Nations and their features","India: Physiography — States and features","India: Northern Mountain Region","India: Rivers of India","India: Northern Great Plain","India: Peninsular Plateau & Coastal Plain","India: Climate — Natural Vegetation","India: Agriculture, Minerals & Industries","India: Energy Sources","India: Transport — Road, Water, Railways, Air","Kerala: Physiography — Districts and features","Kerala: Rivers","Kerala: Climate — Natural Vegetation — Wildlife","Kerala: Agriculture & Research Centres","Kerala: Minerals & Industries","Kerala: Energy Sources","Kerala: Transport — Road, Water, Railway, Air"] },
      { id:"ksfe_eco", name:"Economics", marks:5, icon:"💰", section:"General Knowledge",
        topics:["Indian Economy — Overview","Five Year Plans","New Economic Reforms (1991)","Planning Commission and NITI Aayog","Financial Institutions in India","Agriculture — Major Crops","Green Revolution","Minerals in India","Direct and Indirect Taxes in India","GST in India — Rationale and Structure","Benefits of GST"] },
      { id:"ksfe_const", name:"Indian Constitution", marks:5, icon:"⚖️", section:"General Knowledge",
        topics:["Constituent Assembly","Preamble","Citizenship","Fundamental Rights","Writs — Habeas Corpus, Mandamus, Prohibition, Certiorari, Quo Warranto","Directive Principles of State Policy","Fundamental Duties","Union Executive — President, VP, PM & Cabinet","Parliament — Lok Sabha & Rajya Sabha","Union Judiciary — Supreme Court","State Executive & Legislature","State Judiciary — High Courts","Local Self Government Institutions (LSGIs)","Constitutional Amendments (42,44,52,73,74,86,91,97,101,102,103,104)","CAG, Attorney General, Advocate General","Election Commission of India & State Election Commission","UPSC & State Public Service Commission","Finance Commission & State Finance Commission","GST Council","Union, State & Concurrent Lists","Tribunals — National Commissions for SC, ST, BC","Official Language & Regional Languages","Language of Supreme Court & High Courts","Special Directives relating to Languages"] },
      { id:"ksfe_kadmin", name:"Kerala Governance & Administration", marks:10, icon:"🏢", section:"General Knowledge",
        topics:["Kerala State Civil Service","Quasi-judicial Bodies & various Commissions","Basic Facts of Socio-economic Development","Kerala Planning Board","Commercial Planning and Policies","Disaster Management in Kerala","Watershed Management","Employment and Labour","National Rural Employment Programmes","Land Reforms in Kerala","Social Welfare and Security","Protection of Women, Children & Senior Citizens","Population and Literacy in Kerala","E-governance in Kerala","Delegated Legislation and its Controls","Legislative and Judicial Controls","Constitutional Law Remedies against Administrative Arbitrariness","Administrative Discretion and its Controls","Administrative Adjudication","Principles of Natural Justice"] },
      { id:"ksfe_life", name:"Life Science & Public Health", marks:6, icon:"🩺", section:"General Knowledge",
        topics:["Basic Facts of Human Body","Vitamins and Minerals","Deficiency Diseases","Communicable Diseases and Causative Organisms","Preventive and Remedial Measures for Diseases","Kerala — Welfare Activities in Health Sector","Lifestyle Diseases","Basic Health Facts","Environment and Environmental Hazards"] },
      { id:"ksfe_phy", name:"Physics", marks:3, icon:"⚡", section:"General Knowledge",
        topics:["Branches of Physics — Matter — Units, Measurements, Physical Quantities","Motion — Newton's Laws — Momentum — Projectile Motion — ISRO","Light — Lens, Mirrors (r=2f) — Phenomena — Rainbow — EM Spectrum","Sound — Types of Waves — Velocity — Resonance — Reverberation","Force — Friction — Liquid Pressure — Buoyant Force — Archimedes — Pascal's Law","Gravitation — Centripetal/Centrifugal Force — Escape Velocity — Satellites — Value of g","Heat — Temperature — Thermometers — Humidity","Work, Energy, Power — Simple Problems — Levers"] },
      { id:"ksfe_chem", name:"Chemistry", marks:3, icon:"🧪", section:"General Knowledge",
        topics:["Atom, Molecule — States of Matter — Allotropy — Gas Laws — Aqua Regia","Elements — Periodic Table — Metals & Non-metals — Chemical & Physical Changes","Chemical Reactions — Solutions, Mixtures, Compounds","Metals & Non-metals — Alloys","Acids, Bases — pH Value — Alkaloids"] },
      { id:"ksfe_arts", name:"Arts, Sports, Literature & Culture", marks:5, icon:"🎭", section:"General Knowledge",
        topics:["Important Audio-Visual Art Forms of Kerala","Famous Institutions & Personalities of Kerala Art Forms","Famous Sports Personalities — Kerala, India & World","Important Awards and Corresponding Fields","Famous Trophies & Related Sports","Number of Players in Important Sports","Important Terms in various Sports","Olympics — Venues, India in Olympics, Winter & Para Olympics","Asian Games, Commonwealth Games, SAF Games","National Games","Malayalam — Important Literary Movements & Icons","Main Works & Authors per Literary Movement","Writers — Pen Names and Nick Names","Famous Works and Characters","Famous Quotes — Books and Authors","Journalism in Kerala — Pioneers & Publications","Awards — Writers and their Works","Malayalam Jnanpith Award Winners","Malayalam Cinema — Origin, Milestones, National Awards","Kerala Important Celebrations & Festivals","Kerala Cultural Centres & Cultural Leaders"] },
      { id:"ksfe_comp", name:"Basics of Computer", marks:3, icon:"💻", section:"General Knowledge",
        topics:["Input Devices (Names and Uses)","Output Devices (Names and Uses)","Memory Devices — Primary & Secondary","System Software & Application Software","Operating System — Functions and Examples","Word Processors, Spreadsheets, Database, Presentation, Image Editors","Basics of Programming — Types of Instructions","Computer Networks — LAN, WAN, MAN","Network Devices — Switch, Hub, Router, Bridge, Gateway","Internet — WWW, E-mail, Search Engines","Social Media — Examples and Features","Web Designing — Browser, HTML Basics","Cyber Wrongs — Types (Awareness)","IT Act 2000 (Awareness)"] },
      { id:"ksfe_acts", name:"Important Acts", marks:5, icon:"📜", section:"General Knowledge",
        topics:["Right to Information Act 2005 — Information Commissions","Kerala State Right to Service Act 2012","Consumer Protection Act 2019","Protection of Civil Rights Act 1955","SC & ST (Prevention of Atrocities) Act 1989","Kerala State Commission for SC & ST Act 2007","Protection of Human Rights Act 1993 — NHRC & SHRC","Maintenance & Welfare of Parents & Senior Citizens Act 2007","Rights of Persons with Disabilities Act 2016","Transgender Persons (Protection of Rights) Act 2019","Offences against Women under IPC 1860","Dowry Prohibition Act 1961","National & Kerala Women's Commission Acts","Protection of Women from Domestic Violence Act 2005","Sexual Harassment at Workplace Act 2013 (POSH)","Offences against Children under IPC","POCSO Act 2012","Juvenile Justice Act 2015","Prevention of Corruption Act 1988","Lokpal & Lokayuktas Act 2013 & Kerala Lok Ayukta Act 1999","Administrative Tribunals Act 1985 — CAT & Kerala AT"] },
      { id:"ksfe_curr", name:"Current Affairs", marks:15, icon:"📰", section:"Current Affairs",
        topics:["Important National Events & Government Schemes","Kerala Government Schemes & Initiatives","Major International Events & Summits","India's Foreign Relations & Treaties","Science & Technology — Recent Developments","Space Missions — ISRO & International","Economy — Budget, GDP, RBI Policies","Environment & Climate — Recent Events","National Awards (Padma, Bharat Ratna etc.)","International Awards & Honours","Sports Events — Recent Results","Books & Authors — Recent Publications","Important National Appointments","Important International Appointments","Famous Personalities — Deaths & Tributes","Important Committees & Reports","Constitutional & Legal Changes","National & International Important Days","Art & Culture Events","Miscellaneous Current Affairs"] },
      { id:"ksfe_arith", name:"Simple Arithmetic", marks:5, icon:"🔢", section:"Arithmetic & Reasoning",
        topics:["Numbers and Basic Operations","Fraction and Decimal Numbers","Percentage","Profit and Loss","Simple Interest","Compound Interest","Ratio and Proportion","Time and Distance","Time and Work","Average","Laws of Exponents","Mensuration","Progressions (AP & GP)"] },
      { id:"ksfe_reason", name:"Mental Ability & Reasoning", marks:5, icon:"🧠", section:"Arithmetic & Reasoning",
        topics:["Series (Number, Letter, Mixed)","Problems on Mathematical Signs","Verifying Positions","Analogy — Word, Alphabet, Number","Odd Man Out","Numerical Ability","Coding and Decoding","Family Relations / Blood Relations","Sense of Direction","Time and Angles","Clock and its Reflection","Date and Calendar","Clerical Ability"] },
      { id:"ksfe_engram", name:"General English — Grammar", marks:5, icon:"🇬🇧", section:"General English",
        topics:["Types of Sentences and Interchange","Different Parts of Speech","Agreement of Subject and Verb","Articles — Definite and Indefinite","Primary and Modal Auxiliary Verbs","Question Tags","Infinitive and Gerunds","Tenses","Tenses in Conditional Sentences","Prepositions","The Use of Correlatives","Direct and Indirect Speech","Active and Passive Voice","Correction of Sentences","Degrees of Comparison"] },
      { id:"ksfe_engvoc", name:"General English — Vocabulary", marks:5, icon:"📖", section:"General English",
        topics:["Singular & Plural, Change of Gender, Collective Nouns","Word Formation — Prefix and Suffix","Compound Words","Synonyms","Antonyms","Phrasal Verbs","Foreign Words and Phrases","One Word Substitutes","Words Often Confused","Spelling Test","Idioms and their Meanings","Common Abbreviations"] },
      { id:"ksfe_mal", name:"Malayalam (Regional Language)", marks:10, icon:"🖊️", section:"Regional Language",
        topics:["പദശുദ്ധി (Word Purity)","വാക്യശുദ്ധി (Correct Sentence)","പരിഭാഷ (Translation)","ഒറ്റപ്പദം (One Word Substitution)","പര്യായം (Synonyms)","വിപരീത പദം (Antonyms)","ശൈലികൾ / പഴഞ്ചൊല്ലുകൾ (Idioms & Proverbs)","സമാനപദം (Equivalent Words)","ചേർത്തെഴുതുക (Join Words / Sandhi)","സ്ത്രീലിംഗം / പുല്ലിംഗം (Gender)","വചനം (Singular & Plural)","പിരിച്ചെഴുതൽ (Split Words)","ഘടകപദം - വാക്യം ചേർത്തെഴുതുക (Adding Phrases)"] },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EXAM 2: Village Field Assistant — SHARED POOL with 10th Prelim
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "vfa",
    name: "Village Field Assistant",
    shortName: "VFA",
    catNo: "Cat. 571/2025",
    org: "Revenue Dept.",
    level: "10th/12th Level",
    totalMarks: 100,
    lang: "ml",
    color: "#22C55E",
    icon: "🌾",
    standalone: false,
    shareGroup: "vfa_tenth",
    subjects: [
      { id:"vfa_hist", name:"ചരിത്രം", marks:5, icon:"🏛️", section:"പൊതുവിജ്ഞാനം",
        topics: { shared: ["kh01","kh02","kh03","kh04","ih01","ih02","ih03","ih04","ih05","ih06","ih07","ih08","ih09","ih10","ih11","ih12","ih13","ih14"] } },
      { id:"vfa_geo", name:"ഭൂമിശാസ്ത്രം", marks:5, icon:"🌍", section:"പൊതുവിജ്ഞാനം",
        topics: { shared: ["ke05","ke01","ke06","ke07","ke08"], own: ["ഭൂമിശാസ്ത്രത്തിന്റെ അടിസ്ഥാന തത്വങ്ങൾ - ഭൂമിയുടെ ഘടന","അന്തരീക്ഷം, പാറകൾ, ഭൗമോപരിതലം, അന്തരീക്ഷ മർദ്ദം, കാറ്റ്","ആഗോള പ്രശ്നങ്ങൾ - ആഗോള താപനം, വിവിധ മലിനീകരണങ്ങൾ","മാപ്പുകൾ - ടോപ്പോഗ്രഫിക് മാപ്പ്, അടയാളങ്ങൾ, വിദൂരസംവേദനം - GIS","ഇന്ത്യ: ഭൂപ്രകൃതി - സംസ്ഥാനങ്ങൾ, ഉത്തര പർവ്വത മേഖല, നദികൾ","ഇന്ത്യ: ഉത്തര മഹാസമതലം, ഉപദ്വീപീയ പീഠഭൂമി, തീരദേശം","ഇന്ത്യ: കാലാവസ്ഥ, സ്വാഭാവിക സസ്യപ്രകൃതി, കൃഷി, ഊർജ്ജ സ്രോതസ്സ്","ഇന്ത്യ: ഗതാഗത സംവിധാനങ്ങൾ - റോഡ്, ജലം, റെയിൽ, വ്യോമം","കേരളം: കാലാവസ്ഥ, സസ്യജാലം, വന്യജീവി"] } },
      { id:"vfa_eco", name:"ധനതത്വശാസ്ത്രം", marks:5, icon:"💰", section:"പൊതുവിജ്ഞാനം",
        topics: { own: ["ഇന്ത്യ: സാമ്പത്തിക രംഗം - അവലോകനം","പഞ്ചവത്സര പദ്ധതികൾ","പ്ലാനിംഗ് കമ്മീഷൻ, നീതി ആയോഗ്","നവ സാമ്പത്തിക പരിഷ്കരണങ്ങൾ","ധനകാര്യ സ്ഥാപനങ്ങൾ","കാർഷിക വിളകൾ, ഹരിത വിപ്ലവം","ധാതുക്കൾ"] } },
      { id:"vfa_const", name:"ഇന്ത്യൻ ഭരണഘടന", marks:5, icon:"⚖️", section:"പൊതുവിജ്ഞാനം",
        topics: { own: ["ഭരണഘടന നിർമ്മാണ സമിതി","ആമുഖം","പൗരത്വം","മൗലികാവകാശങ്ങൾ","നിർദ്ദേശക തത്വങ്ങൾ","മൗലിക കടമകൾ","ഗവൺമെന്റിന്റെ ഘടകങ്ങൾ - കേന്ദ്ര, സംസ്ഥാന","പ്രധാനപ്പെട്ട ഭരണഘടനാ ഭേദഗതികൾ (42, 44, 52, 73, 74, 86, 91)","പഞ്ചായത്തിരാജ് - LSGIs","ഭരണഘടനാ സ്ഥാപനങ്ങളും ചുമതലകളും","യൂണിയൻ ലിസ്റ്റ് - സ്റ്റേറ്റ് ലിസ്റ്റ് - കൺകറന്റ് ലിസ്റ്റ്"] } },
      { id:"vfa_kadmin", name:"കേരളം - ഭരണവും ഭരണസംവിധാനങ്ങളും", marks:5, icon:"🏢", section:"പൊതുവിജ്ഞാനം",
        topics: { own: ["കേരളം - സംസ്ഥാന സിവിൽ സർവ്വീസ്","ഭരണഘടനാ സ്ഥാപനങ്ങൾ, വിവിധ കമ്മീഷനുകൾ","സാമൂഹിക-സാമ്പത്തിക-വാണിജ്യ ആസൂത്രണ അടിസ്ഥാന വിവരങ്ങൾ","ദുരന്ത നിവാരണ അതോറിറ്റി, തണ്ണീർത്തട സംരക്ഷണം","തൊഴിലും ജോലിയും, ദേശീയ ഗ്രാമീണ തൊഴിൽ പദ്ധതികൾ","ഭൂ പരിഷ്കരണങ്ങൾ","സ്ത്രീകൾ, കുട്ടികൾ, മുതിർന്ന പൗരന്മാർ - സംരക്ഷണം","സാമൂഹ്യ ക്ഷേമം, സാമൂഹ്യ സുരക്ഷിതത്വം"] } },
      { id:"vfa_life", name:"ജീവശാസ്ത്രവും പൊതുജന ആരോഗ്യവും", marks:6, icon:"🩺", section:"പൊതുവിജ്ഞാനം",
        topics: { shared: ["ls01","ls02","ls03","ls04","ls05","ls06","ls07"] } },
      { id:"vfa_phy", name:"ഭൗതീകശാസ്ത്രം", marks:3, icon:"⚡", section:"പൊതുവിജ്ഞാനം",
        topics: { shared: ["ph01","ph02","ph03","ph04","ph05","ph06","ph07","ph08"] } },
      { id:"vfa_chem", name:"രസതന്ത്രം", marks:3, icon:"🧪", section:"പൊതുവിജ്ഞാനം",
        topics: { shared: ["ch01","ch02","ch03","ch04","ch05"] } },
      { id:"vfa_arts", name:"കല, കായികം, സാഹിത്യം, സംസ്കാരം", marks:5, icon:"🎭", section:"പൊതുവിജ്ഞാനം",
        topics: { own: ["കേരളത്തിലെ പ്രധാന ദൃശ്യ-ശ്രാവ്യ കലകൾ, പ്രശസ്ത സ്ഥലങ്ങൾ, സ്ഥാപനങ്ങൾ, വ്യക്തിത്വങ്ങൾ","കായിക രംഗത്ത് വ്യക്തിമുദ്ര പതിപ്പിച്ച കേരളം, ഇന്ത്യ, ലോക താരങ്ങൾ","പ്രധാന അവാർഡുകൾ, അവാർഡ് ജേതാക്കൾ - ഓരോ അവാർഡും ഏതു മേഖലയ്ക്ക്","പ്രധാന ട്രോഫികൾ, ബന്ധപ്പെട്ട മത്സരങ്ങൾ, കളിയിനങ്ങൾ","ഒളിമ്പിക്സ് - അടിസ്ഥാന വിവരങ്ങൾ, പ്രധാന വേദികൾ, ഇന്ത്യ ഒളിമ്പിക്സിൽ","ഏഷ്യൻ ഗെയിംസ്, കോമൺവെൽത്ത് ഗെയിംസ്, SAF ഗെയിംസ്","ദേശീയ ഗെയിംസ്","മലയാളത്തിലെ പ്രധാന സാഹിത്യ പ്രസ്ഥാനങ്ങൾ - ആദ്യ കൃതികൾ, കർത്താക്കൾ","എഴുത്തുകാർ - തൂലികാ നാമങ്ങൾ, അപരനാമങ്ങൾ","ജ്ഞാനപീഠം നേടിയ മലയാളികൾ","മലയാള സിനിമ - ഉദ്ഭവം, വളർച്ച, ദേശീയ അവാർഡ്","കേരളം - ഉത്സവങ്ങൾ, ആഘോഷങ്ങൾ, സാംസ്കാരിക കേന്ദ്രങ്ങൾ"] } },
      { id:"vfa_comp", name:"കമ്പ്യൂട്ടർ - അടിസ്ഥാന വിവരങ്ങൾ", marks:3, icon:"💻", section:"പൊതുവിജ്ഞാനം",
        topics: { own: ["ഹാർഡ്‌വെയർ - ഇൻപുട്ട് ഡിവൈസ് (നാമങ്ങളും ഉപയോഗങ്ങളും)","ഹാർഡ്‌വെയർ - ഔട്ട്പുട്ട് ഡിവൈസ് (നാമങ്ങളും സവിശേഷതകളും)","മെമ്മറി ഡിവൈസ് - പ്രൈമറി, സെക്കൻഡറി (ഉദാഹരണങ്ങൾ, സവിശേഷതകൾ)","സോഫ്റ്റ്‌വെയർ - സിസ്റ്റം സോഫ്റ്റ്‌വെയർ, ആപ്ലിക്കേഷൻ സോഫ്റ്റ്‌വെയർ","ഓപ്പറേറ്റിംഗ് സിസ്റ്റം - പ്രവർത്തനങ്ങൾ, ഉദാഹരണങ്ങൾ","ജനപ്രിയ ആപ്ലിക്കേഷൻ സോഫ്റ്റ്‌വെയർ - Word, Spreadsheet, Database, Presentation","കമ്പ്യൂട്ടർ നെറ്റ്‌വർക്ക് - LAN, WAN, MAN, നെറ്റ്‌വർക്ക് ഡിവൈസ്","ഇന്റർനെറ്റ് - WWW, ഇ-മെയിൽ, സോഷ്യൽ മീഡിയ, E-governance","സൈബർ ക്രൈം, IT ആക്ട് (Awareness Level)"] } },
      { id:"vfa_acts", name:"സുപ്രധാന നിയമങ്ങൾ", marks:5, icon:"📜", section:"പൊതുവിജ്ഞാനം",
        topics: { own: ["വിവരാവകാശ നിയമം 2005 - ഒഴിവാക്കപ്പെട്ട വിവരങ്ങൾ, ഇൻഫർമേഷൻ കമ്മീഷൻ","ഉപഭോക്തൃ സംരക്ഷണ നിയമം - ഉപഭോക്താക്കളുടെ അവകാശങ്ങൾ","SC/ST സംരക്ഷണം - ദേശീയ, സംസ്ഥാന SC/ST കമ്മീഷൻ","ന്യൂനപക്ഷ കമ്മീഷൻ, NHRC, SHRC - ആരോഗ്യ അവകാശ കമ്മീഷൻ","മുതിർന്ന പൗരന്മാരുടെ സംരക്ഷണം","സ്ത്രീ സംരക്ഷണം - ദേശീയ, സംസ്ഥാന വനിതാ കമ്മീഷൻ","ഗാർഹിക പീഡനത്തിൽ നിന്ന് സ്ത്രീകളുടെ സംരക്ഷണ നിയമം 2005","ശിശു സംരക്ഷണം - POCSO നിയമം 2012"] } },
      { id:"vfa_curr", name:"ആനുകാലിക വിഷയങ്ങൾ", marks:20, icon:"📰", section:"ആനുകാലിക വിഷയങ്ങൾ",
        topics: { own: ["ദേശീയ പ്രധാന സംഭവങ്ങൾ, സർക്കാർ പദ്ധതികൾ","കേരള സർക്കാർ പദ്ധതികൾ, സംരംഭങ്ങൾ","അന്താരാഷ്ട്ര പ്രധാന സംഭവങ്ങൾ, ഉച്ചകോടികൾ","ഇന്ത്യ - വിദേശ ബന്ധങ്ങൾ, ഉടമ്പടികൾ","ശാസ്ത്ര-സാങ്കേതിക മേഖലയിലെ പുതിയ സംഭവവികാസങ്ങൾ","ബഹിരാകാശ ദൗത്യങ്ങൾ - ISRO, അന്താരാഷ്ട്ര","സമ്പദ്‌വ്യവസ്ഥ - ബജറ്റ്, GDP, RBI നയങ്ങൾ","പരിസ്ഥിതി, കാലാവസ്ഥ - പുതിയ സംഭവങ്ങൾ","ദേശീയ അവാർഡുകൾ (പദ്മ, ഭാരതരത്നം)","അന്താരാഷ്ട്ര അവാർഡുകൾ, ബഹുമതികൾ","കായിക മേഖല - പുതിയ ഫലങ്ങൾ, ചാമ്പ്യൻഷിപ്പ്","പുസ്തകങ്ങൾ, എഴുത്തുകാർ - പുതിയ പ്രസിദ്ധീകരണങ്ങൾ","പ്രധാനപ്പെട്ട നിയമനങ്ങൾ - ദേശീയ, അന്താരാഷ്ട്ര","പ്രശസ്ത വ്യക്തിത്വങ്ങൾ - അനുസ്മരണം","ദേശീയ, അന്താരാഷ്ട്ര ദിനങ്ങൾ","കലാ-സാംസ്കാരിക മേഖലയിലെ സംഭവങ്ങൾ","ഭരണഘടനാ, നിയമ മാറ്റങ്ങൾ","പ്രധാന കമ്മിറ്റികൾ, റിപ്പോർട്ടുകൾ","കേരളം - ക്രീഡ, കലാ, ശാസ്ത്ര സംഭവങ്ങൾ","വൈവിധ്യമായ ആനുകാലിക വിഷയങ്ങൾ"] } },
      { id:"vfa_arith", name:"ലഘുഗണിതം", marks:5, icon:"🔢", section:"ഗണിതവും മാനസിക ശേഷിയും",
        topics: { shared: ["ar01","ar02","ar03","ar04","ar05","ar06","ar07","ar08","ar09","ar10","ar11","ar12","ar13"] } },
      { id:"vfa_reason", name:"മാനസിക ശേഷിയും നിരീക്ഷണ പാടവ പരിശോധനയും", marks:5, icon:"🧠", section:"ഗണിതവും മാനസിക ശേഷിയും",
        topics: { shared: ["re01","re02","re03","re04","re05","re06","re07","re08","re09","re10","re11","re12","re13"] } },
      { id:"vfa_engram", name:"General English — Grammar", marks:5, icon:"🇬🇧", section:"General English",
        topics: { own: ["Types of Sentences and Interchange of Sentences","Different Parts of Speech","Agreement of Subject and Verb","Articles — Definite and Indefinite Articles","Uses of Primary and Modal Auxiliary Verbs","Question Tags","Infinitive and Gerunds","Tenses","Tenses in Conditional Sentences","Prepositions","The Use of Correlatives","Direct and Indirect Speech","Active and Passive Voice","Correction of Sentences","Degrees of Comparison"] } },
      { id:"vfa_engvoc", name:"General English — Vocabulary", marks:5, icon:"📖", section:"General English",
        topics: { own: ["Singular & Plural, Change of Gender, Collective Nouns","Word Formation — Prefix and Suffix","Compound Words","Synonyms","Antonyms","Phrasal Verbs","Foreign Words and Phrases","One Word Substitutes","Words Often Confused","Spelling Test","Idioms and their Meanings","Common Abbreviations"] } },
      { id:"vfa_mal", name:"പ്രാദേശിക ഭാഷ — മലയാളം", marks:10, icon:"🖊️", section:"പ്രാദേശിക ഭാഷ",
        topics: { shared: ["ml01","ml02","ml03","ml04","ml05","ml06","ml07","ml08","ml09","ml10","ml11","ml12","ml13"] } },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EXAM 3: 10th Level Preliminary — SHARED POOL with VFA
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "tenth",
    name: "10th Level Preliminary",
    shortName: "10th Prelim",
    catNo: "Preliminary 2022",
    org: "Kerala PSC",
    level: "10th Level",
    totalMarks: 100,
    lang: "ml",
    color: "#F59E0B",
    icon: "📚",
    standalone: false,
    shareGroup: "vfa_tenth",
    subjects: [
      { id:"tenth_curr", name:"സമകാലിക സംഭവങ്ങൾ — ശാസ്ത്രം, കല, രാഷ്ട്രീയം, സാഹിത്യം, കായികം", marks:10, icon:"📰", section:"പൊതുവിജ്ഞാനവും ആനുകാലിക കാര്യങ്ങളും",
        topics: { own: [
          "ശാസ്ത്ര സാങ്കേതിക മേഖലയിലെ സമകാലിക സംഭവങ്ങൾ (ഇന്ത്യ, കേരളം)",
          "കലാ സാംസ്കാരിക മേഖലയിലെ സമകാലിക സംഭവങ്ങൾ (ഇന്ത്യ, കേരളം)",
          "രാഷ്ട്രീയ സാമ്പത്തിക മേഖലയിലെ സമകാലിക സംഭവങ്ങൾ (ഇന്ത്യ, കേരളം)",
          "സാഹിത്യ മേഖലയിലെ സമകാലിക സംഭവങ്ങൾ (ഇന്ത്യ, കേരളം)",
          "കായിക മേഖലയിലെ സമകാലിക സംഭവങ്ങൾ (ഇന്ത്യ, കേരളം)"
        ] } },
      { id:"tenth_geo", name:"ഇന്ത്യ — ഭൂമിശാസ്ത്ര സവിശേഷതകൾ, ഊർജ്ജം, ഗതാഗതം, വ്യവസായങ്ങൾ", marks:10, icon:"🌍", section:"പൊതുവിജ്ഞാനവും ആനുകാലിക കാര്യങ്ങളും",
        topics: { own: [
          "ഇന്ത്യയുടെ ഭൂമിശാസ്ത്ര സവിശേഷതകൾ, അതിർത്തികളും അതിരുകളും",
          "ഊർജ്ജ മേഖലയിലെ പുരോഗതി",
          "ഗതാഗത വാർത്താ വിനിമയ മേഖലയിലെ പുരോഗതി",
          "പ്രധാന വ്യവസായങ്ങൾ"
        ] } },
      { id:"tenth_hist", name:"ഇന്ത്യൻ സ്വാതന്ത്ര്യം — രാഷ്ട്രീയ, സാമൂഹ്യ, സാംസ്കാരിക മുന്നേറ്റങ്ങൾ", marks:10, icon:"🏛️", section:"പൊതുവിജ്ഞാനവും ആനുകാലിക കാര്യങ്ങളും",
        topics: { own: [
          "ഇന്ത്യയുടെ സ്വാതന്ത്ര്യവുമായി ബന്ധപ്പെട്ട രാഷ്ട്രീയ മുന്നേറ്റങ്ങൾ",
          "ഇന്ത്യയുടെ സ്വാതന്ത്ര്യവുമായി ബന്ധപ്പെട്ട സാമൂഹിക മുന്നേറ്റങ്ങൾ",
          "ഇന്ത്യയുടെ സ്വാതന്ത്ര്യവുമായി ബന്ധപ്പെട്ട സാംസ്കാരിക മുന്നേറ്റങ്ങൾ",
          "ദേശീയ പ്രസ്ഥാനങ്ങൾ",
          "സ്വാതന്ത്ര്യാനന്തര ഇന്ത്യ നേരിട്ട പ്രധാന വെല്ലുവിളികൾ"
        ] } },
      { id:"tenth_civic", name:"പൗരന്റെ അവകാശങ്ങളും കടമകളും, ദേശീയ ചിഹ്നങ്ങൾ, NHRC, RTI", marks:10, icon:"⚖️", section:"പൊതുവിജ്ഞാനവും ആനുകാലിക കാര്യങ്ങളും",
        topics: { own: [
          "ഒരു പൗരന്റെ അവകാശങ്ങൾ",
          "ഒരു പൗരന്റെ കടമകൾ",
          "ഇന്ത്യയുടെ ദേശീയ ചിഹ്നങ്ങൾ",
          "ദേശീയ പതാക",
          "ദേശീയ ഗീതം",
          "ദേശീയ ഗാനം",
          "മനുഷ്യാവകാശ കമ്മീഷൻ",
          "വിവരാവകാശ കമ്മീഷനുകൾ"
        ] } },
      { id:"tenth_kerala", name:"കേരളം — നദികൾ, കായലുകൾ, വൈദ്യുത പദ്ധതികൾ, വന്യജീവി, കായികം", marks:10, icon:"🌴", section:"പൊതുവിജ്ഞാനവും ആനുകാലിക കാര്യങ്ങളും",
        topics: { own: [
          "കേരളത്തിന്റെ അടിസ്ഥാന വിവരങ്ങൾ",
          "നദികളും കായലുകളും",
          "വിവിധ വൈദ്യുത പദ്ധതികൾ",
          "വന്യജീവി സങ്കേതങ്ങളും ദേശീയോദ്യാനങ്ങളും",
          "മത്സ്യബന്ധനം",
          "കായിക രംഗം"
        ] } },
      { id:"tenth_reform", name:"കേരള നവോത്ഥാനം — സ്വാതന്ത്ര്യ സമരം, സാമൂഹ്യ പരിഷ്കരണ പ്രസ്ഥാനങ്ങൾ", marks:10, icon:"🕊️", section:"പൊതുവിജ്ഞാനവും ആനുകാലിക കാര്യങ്ങളും",
        topics: { own: [
          "ഇന്ത്യൻ സ്വാതന്ത്ര്യ സമരവുമായി ബന്ധപ്പെട്ട് കേരളത്തിലുണ്ടായ മുന്നേറ്റങ്ങൾ",
          "കേരളത്തിലെ സാമൂഹ്യ പരിഷ്കരണം",
          "അയ്യൻകാളി",
          "ചട്ടമ്പി സ്വാമികൾ",
          "ശ്രീനാരായണ ഗുരു",
          "പണ്ഡിറ്റ് കറുപ്പൻ",
          "വി.ടി. ഭട്ടതിരിപ്പാട്",
          "കുമാര ഗുരു",
          "മന്നത്ത് പദ്മനാഭൻ"
        ] } },
      { id:"tenth_natsci", name:"പ്രകൃതി ശാസ്ത്രം (Natural Science)", marks:10, icon:"🌿", section:"പൊതുശാസ്ത്രം",
        topics: { shared: ["ls01","ls02","ls03"], own: [
          "കേരളത്തിലെ ആരോഗ്യക്ഷേമ പ്രവർതനങ്ങൾ",
          "കേരളത്തിലെ പ്രധാന ഭക്ഷ്യ, കാർഷിക വിളകൾ",
          "വനങ്ങളും വനവിഭവങ്ങളും",
          "പരിസ്ഥിതിയും പരിസ്ഥിതി പ്രശ്നങ്ങളും"
        ] } },
      { id:"tenth_physci", name:"ഭൗതിക ശാസ്ത്രം (Physical Science)", marks:10, icon:"⚛️", section:"പൊതുശാസ്ത്രം",
        topics: { own: [
          "ആറ്റവും ആറ്റത്തിന്റെ ഘടനയും",
          "അയിരുകളും ധാതുക്കളും",
          "മൂലകങ്ങളും അവയുടെ വർഗ്ഗീകരണവും",
          "ഹൈഡ്രജനും ഓക്സിജനും",
          "രസതന്ത്രം ദൈനംദിന ജീവിതത്തിൽ",
          "ദ്രവ്യവും പിണ്ഡവും",
          "പ്രവൃത്തിയും ഊർജ്ജവും",
          "ഊർജ്ജവും അതിന്റെ പരിവർതനവും",
          "താപവും ഊഷ്മാവും",
          "പ്രകൃതിയിലെ ചലനങ്ങളും ബലങ്ങളും",
          "ശബ്ദവും പ്രകാശവും",
          "സൗരയൂഥവും സവിശേഷതകളും"
        ] } },
      { id:"tenth_arith", name:"ലഘുഗണിതം", marks:10, icon:"🔢", section:"ഗണിതവും മാനസിക ശേഷിയും",
        topics: { shared: ["ar01","ar02","ar03","ar04","ar05","ar08","ar10"], own: [
          "വർഗ്ഗവും വർഗ്ഗമൂലവും",
          "ദശാംശ സംഖ്യകൾ"
        ] } },
      { id:"tenth_reason", name:"മാനസികശേഷിയും നിരീക്ഷണ പാടവ പരിശോധനയും", marks:10, icon:"🧠", section:"ഗണിതവും മാനസിക ശേഷിയും",
        topics: { shared: ["re01","re02","re04","re05","re08","re09"], own: [
          "ഗണിത ചിഹ്നങ്ങൾ ഉപയോഗിച്ചുള്ള ക്രിയകൾ",
          "അർത്ഥവത്തായ രീതിയിൽ പദങ്ങളുടെ ക്രമീകരണം",
          "വയസുമായി ബന്ധപ്പെട്ട പ്രശ്നങ്ങൾ"
        ] } },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EXAM 4: Inspector of Legal Metrology — STANDALONE (English, Technical)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "metrology",
    name: "Inspector of Legal Metrology",
    shortName: "Legal Met.",
    catNo: "Cat. 613/2025",
    org: "Legal Metrology Dept.",
    level: "Degree Level",
    totalMarks: 100,
    lang: "en",
    color: "#F97316",
    icon: "⚖️",
    standalone: true,
    subjects: [
      { id:"met_meas", name:"Electronic Measurement Systems", marks:10, icon:"📡", section:"Part I(A) — Measurement",
        topics:["Classification of instruments — Deflection and Null type","Static & Dynamic characteristics of measuring instruments","Errors in measuring instruments","Scale range, scale span, Signal-to-noise ratio","Indicating Instruments — Different torques, damping systems","Moving coil & Moving iron instruments","Galvanometer — conversion to Ammeters and Voltmeters","Extension of range using multipliers, Ohm meters, Energy meters","Single phase induction type Wattmeters","DC & AC Bridges — Wheatstone's bridge","Kelvin's double bridge","Hay's Bridge, Maxwell's bridge","Schering bridge, Wien bridge","Cathode Ray Oscilloscope (CRO) — Block diagram, Lissajous pattern","CRO — Frequency & phase angle measurement, Dual trace & DSO"] },
      { id:"met_comp", name:"Computer & IT — Information Security", marks:10, icon:"💻", section:"Part I(B) — Computer",
        topics:["IT in communication, business, governance, medicine, education, entertainment","Ethical & social issues — Responsibility, Accountability, Liability","Professional Codes of Conduct","Information Rights — Privacy & Freedom in the Internet Age","Property Rights — Intellectual Property","Cryptography — Symmetric encryption algorithms","Authentication methods","Access control — Principles, Policies, Requirements","Intrusion Detection — Malicious Software","Denial of Service attacks","Firewall — types and functions","OS Vulnerabilities — Windows & Linux","MS Word — Formatting, Mail Merge, Tables, Graphics","MS Excel — Worksheets, Functions (SUM, AVERAGE, IF), Charts, Filters","Windows OS — Desktop, Explorer, Accessories"] },
      { id:"met_mech", name:"Physics — Mechanics & Measurement", marks:6, icon:"⚙️", section:"Part II(A) — Physics",
        topics:["Physical quantities, Units, SI & CGS systems, Dimensional analysis","Errors — absolute, systematic, random, relative; screw gauge, vernier","Motion — velocity, acceleration, momentum, Newton's Laws","Law of conservation of linear momentum, work, energy, power","Gravitation — Newton's law, mass, inertia, variation of g","Rigid body — Centre of mass, Moment of inertia","Rotational motion — torque, angular momentum, centripetal & centrifugal","Simple Harmonic Motion — spring constant, oscillations"] },
      { id:"met_matter", name:"Physics — Properties of Matter & Heat", marks:5, icon:"🌡️", section:"Part II(A) — Physics",
        topics:["Elasticity — stress, strain, Hooke's law, moduli of elasticity","Fluids — Archimedes, Pascal, Bernoulli, viscosity, Poiseuille's formula","Surface tension — surface energy, capillary rise","Temperature scales — Celsius, Fahrenheit, Kelvin","Transfer of heat — conduction, convection, radiation","Black body radiation — Planck's law, Wien's law, Stefan's law","Thermal expansion — linear expansivity, ideal gas equation","Thermodynamics — isothermal, adiabatic, Carnot cycle, entropy"] },
      { id:"met_optics", name:"Physics — Optics", marks:5, icon:"🔬", section:"Part II(A) — Physics",
        topics:["Reflection — plane & spherical mirrors, mirror equation","Refraction — Snell's law, total internal reflection, lens maker's formula","Spherical & chromatic aberration, combination of lenses, prism","Interference — Young's double slit, Newton's rings","Diffraction — Fresnel & Fraunhoffer, diffraction gratings","Optical instruments — microscope & telescope — resolving power","Scattering — Rayleigh scattering, Raman scattering","Polarisation — Brewster angle, Malus's law, LASER, Ruby LASER","Electromagnetic spectrum"] },
      { id:"met_elec", name:"Physics — Electrostatics & Current Electricity", marks:5, icon:"⚡", section:"Part II(A) — Physics",
        topics:["Electrostatics — Coulomb's law, electric field, Gauss' theorem","Electric potential, dipole, capacitor, energy in capacitor","Current electricity — Ohm's law, resistance, resistivity","Cells — internal resistance, Joule heating, electrical power","Kirchhoff's laws, Wheatstone's bridge","Thevenin's theorem, Norton's theorem, Maximum power transfer theorem"] },
      { id:"met_mag", name:"Physics — Magnetism & EM Induction", marks:4, icon:"🧲", section:"Part II(A) — Physics",
        topics:["Magnetic field, flux, Biot-Savart law, Ampere's theorem","Magnetic dipole, Lorentz force, force on current-carrying conductor","Terrestrial magnetism — horizontal & vertical fields","Electromagnetic induction — Faraday's law, Lenz's law","Self & mutual induction, eddy currents, transformer","AC generation — frequency, rms, peak values, LCR circuit, resonance"] },
      { id:"met_electronics", name:"Physics — Electronics", marks:4, icon:"🔌", section:"Part II(A) — Physics",
        topics:["Band theory of semiconductors — intrinsic & extrinsic","pn junction diode — characteristics, half & full wave rectifiers","Zener diode — zener voltage regulation, LED, photo diode","Transistors — npn & pnp, biasing, CE amplifier — gain & frequency response","RC phase shift oscillators","Digital electronics — Binary number system","Logic gates — OR, AND, NOT, NOR, NAND, XOR, XNOR, Universal gates","Half adder, full adder, Boolean algebra, De Morgan's theorem"] },
      { id:"met_atom", name:"Physics — Atomic Structure", marks:1, icon:"⚛️", section:"Part II(A) — Physics",
        topics:["Atomic structure — Bohr atom model","Hydrogen spectra","Vector atom model & quantum numbers","Pauli's exclusion principle"] },
      { id:"met_states", name:"Chemistry — States of Matter & Solutions", marks:7, icon:"🧪", section:"Part II(B) — Chemistry",
        topics:["Crystalline & amorphous solids, types of crystals, X-ray diffraction, Bragg's equation","Liquid state — vapour pressure, surface tension, viscosity","Gaseous state — ideal gas equation, kinetic theory, molecular velocities","Solutions — Molarity, Molality, Normality, Mole fraction","Raoult's law, Colligative properties"] },
      { id:"met_electrochem", name:"Chemistry — Electrochemistry & Analytical", marks:8, icon:"🔋", section:"Part II(B) — Chemistry",
        topics:["Specific, equivalent & molar conductance — variation with dilution","Electrochemical cells — electrolytic & galvanic","Reference electrodes — SHE, calomel electrode","Cell reaction, Nernst equation, fuel cells","Inorganic qualitative analysis — common ion effect, solubility product","Quantitative analysis — acid-base titration, indicators","Gravimetry — basic principles","Chromatography — column, TLC, Gas chromatography, HPLC"] },
      { id:"met_polym", name:"Chemistry — Polymers & Everyday Chemistry", marks:7, icon:"🏭", section:"Part II(B) — Chemistry",
        topics:["Classification of polymers — homopolymers, copolymers","Addition & condensation polymers, thermoplastics & thermosets","Polyethylene, PVC, Teflon, Phenol-formaldehyde resin, Epoxy resin","Nylon-66, Dacron, SBR & nitrile rubbers","Cement — composition, setting & hardening","Paints — primary constituents, binders & solvents","Soaps & detergents — composition & cleansing action","Food additives"] },
      { id:"met_fuels", name:"Chemistry — Fuels, Nanomaterials & Spectroscopy", marks:8, icon:"🔭", section:"Part II(B) — Chemistry",
        topics:["Fuels — calorific value, petroleum products, natural gas, biogas, LPG","Propellants & explosives — TNT, TNG, urea nitrate, hydrazine","Nanomaterials — definition, classification, top-down & bottom-up approaches","Carbon nanotubes & fullerenes — optical, magnetic & catalytic properties","UV-Visible spectroscopy — Beer-Lambert's law, electronic transitions","IR spectroscopy — molecular vibrations, functional group region","NMR spectroscopy — proton NMR, chemical shift","Environmental chemistry — air, water, soil pollution","Acid rain, greenhouse effect, ozone layer depletion","Major environmental disasters — Bhopal, Chernobyl, Minamata","Green chemistry — principles, atom economy"] },
      { id:"met_math1", name:"Mathematics — Aptitude & Mensuration", marks:8, icon:"📐", section:"Part II(C) — Mathematics",
        topics:["Mental ability — Coding/decoding, classification, series, clocks/calendars","Quantitative aptitude — numbers, simplification, percentage, SI/CI, work, time","Mensuration — area: circle, square, rectangle, triangle, quadrilateral","Mensuration — volume: sphere, cube, cylinder, cone, parallelepiped","Quadratic equations — nature of roots, discriminant, relation between roots","Permutations & combinations — properties, applications, binomial expansion"] },
      { id:"met_math2", name:"Mathematics — Matrices, Calculus & Differential Equations", marks:12, icon:"∫", section:"Part II(C) — Mathematics",
        topics:["Matrices — types, operations, inverse, rank","Determinants — properties, applications","Systems of linear equations — homogeneous & non-homogeneous","Gauss elimination, matrix inversion, Cramer's rule","Differentiation — derivative, geometrical meaning, rate of change","Velocity & acceleration, increasing/decreasing functions","Maxima & Minima — applications","Integration — properties, geometric meaning, area under curve","Volume of solid of revolution","Differential equations — degree, order, variable separable","Exact equation, linear equation — first order","Second order linear differential equations"] },
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// STORAGE & HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const ld = (k, d) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtDate = d => { try { return new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }); } catch { return d; } };
const addDays = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt.toISOString().split("T")[0]; };
const diffDays = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

const DAY_OPTIONS = [
  { days:30,  label:"30 ദിവസം",  sub:"Intensive",   color:"#EF4444" },
  { days:40,  label:"40 ദിവസം",  sub:"Fast",         color:"#F59E0B" },
  { days:50,  label:"50 ദിവസം",  sub:"Balanced",     color:"#38BDF8" },
  { days:60,  label:"60 ദിവസം",  sub:"Comfortable",  color:"#22C55E" },
  { days:100, label:"100 ദിവസം", sub:"Relaxed",       color:"#A78BFA" },
];

// Resolve topic list for a subject
function resolveTopics(subj) {
  if (Array.isArray(subj.topics)) return subj.topics.map(t => ({ id: t, label: t, isShared: false }));
  const { shared = [], own = [] } = subj.topics;
  return [
    ...shared.map(k => ({ id: `shared::${k}`, label: SHARED_TOPICS[k] || k, isShared: true })),
    ...own.map(t => ({ id: t, label: t, isShared: false })),
  ];
}

// Compute exam stats
function examStats(exam, completed) {
  let total = 0, done = 0;
  for (const s of exam.subjects) {
    const topics = resolveTopics(s);
    total += topics.length;
    done += topics.filter(t => completed[t.id]).length;
  }
  return { total, done, pct: total > 0 ? ((done/total)*100).toFixed(1) : "0.0" };
}

function subjectStats(exam, completed) {
  return exam.subjects.map(s => {
    const topics = resolveTopics(s);
    const done = topics.filter(t => completed[t.id]).length;
    return { ...s, resolvedTopics: topics, done, pct: topics.length > 0 ? Math.round((done/topics.length)*100) : 0 };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// UI ATOMS
// ═══════════════════════════════════════════════════════════════════════════
const Bar = ({ pct, color="#22C55E", h=8, bg }) => (
  <div style={{ background: bg||"rgba(255,255,255,0.08)", borderRadius:99, height:h, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(100,Math.max(0,parseFloat(pct)))}%`, background:color, height:"100%", borderRadius:99, transition:"width 0.5s ease" }} />
  </div>
);

const paths = {
  home:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  book:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z",
  plus:"M12 5v14M5 12h14",
  bar:"M18 20V10M12 20V4M6 20v-6",
  settings:"M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  x:"M18 6L6 18M6 6l12 12",
  back:"M15 18l-6-6 6-6",
  check:"M20 6L9 17l-5-5",
  chevron:"M9 18l6-6-6-6",
  download:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  upload:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  moon:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  sun:"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  link:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
};
const Ic = ({ n, size=18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={paths[n]} />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState(() => ld("mpsc_setup", false) ? "main" : "setup");
  const [dark, setDark] = useState(() => ld("mpsc_dark", true));
  const [activeExamId, setActiveExamId] = useState(() => ld("mpsc_active_exam", "ksfe"));
  const [enrolledExams, setEnrolledExams] = useState(() => ld("mpsc_selected_exams", ["ksfe"]));
  const [examPlans, setExamPlans] = useState(() => ld("mpsc_exam_plans", { ksfe:60, vfa:60, tenth:60, metrology:60 }));
  const [examStartDates, setExamStartDates] = useState(() => ld("mpsc_start_dates", {}));
  const [completed, setCompleted] = useState(() => ld("mpsc_completed", {}));
  const [sessions, setSessions] = useState(() => ld("mpsc_sessions", {}));
  const [navTab, setNavTab] = useState("dashboard");
  const [subjectView, setSubjectView] = useState(null);
  const [progressTab, setProgressTab] = useState("overview");
  const [completedFilter, setCompletedFilter] = useState("all");
  const [dayEntry, setDayEntry] = useState({ hours:"", topics:[], notes:"" });
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [toast, setToast] = useState("");
  const [resetConfirm, setResetConfirm] = useState(false);
  const [unmarkConfirm, setUnmarkConfirm] = useState(null); // topic id or null
  const [revisions, setRevisions] = useState(() => ld("mpsc_revisions", {})); // {topicId: [dateStr, ...]}
  const [revisionExamId, setRevisionExamId] = useState(null); // confirm modal
  const [setupStep, setSetupStep] = useState(0); // 0=pick exams 1=set days per exam
  const [selectedExams, setSelectedExams] = useState(["ksfe"]);
  const [setupDayIdx, setSetupDayIdx] = useState(0);
  const [setupPlans, setSetupPlans] = useState({ ksfe:60, vfa:60, tenth:60, metrology:60 });

  useEffect(() => { sv("mpsc_completed", completed); }, [completed]);
  useEffect(() => { sv("mpsc_sessions", sessions); }, [sessions]);
  useEffect(() => { sv("mpsc_dark", dark); }, [dark]);
  useEffect(() => { sv("mpsc_active_exam", activeExamId); }, [activeExamId]);
  useEffect(() => { sv("mpsc_exam_plans", examPlans); }, [examPlans]);
  useEffect(() => { sv("mpsc_start_dates", examStartDates); }, [examStartDates]);
  useEffect(() => { sv("mpsc_revisions", revisions); }, [revisions]);

  const activeExam = EXAMS.find(e => e.id === activeExamId) || EXAMS[0];
  const activePlan = examPlans[activeExamId] || 60;
  const activeStart = examStartDates[activeExamId] || todayStr();
  const activeSessions = sessions[activeExamId] || [];
  const stats = examStats(activeExam, completed);
  const subjStats = subjectStats(activeExam, completed);

  const daysUsed = Math.max(1, diffDays(activeStart, todayStr()) + 1);
  const daysLeft = Math.max(0, activePlan - daysUsed);
  const remaining = stats.total - stats.done;
  const requiredPace = daysLeft > 0 ? Math.ceil(remaining / daysLeft) : remaining;
  const currentPace = daysUsed > 0 ? (stats.done / daysUsed).toFixed(1) : "0.0";
  const ahead = parseFloat(currentPace) >= requiredPace;
  const forecastDate = parseFloat(currentPace) > 0 ? fmtDate(addDays(todayStr(), Math.ceil(remaining / parseFloat(currentPace)))) : "Unknown";
  const daysOff = parseFloat(currentPace) > 0 ? Math.ceil(remaining / parseFloat(currentPace)) - daysLeft : null;
  const avgHours = activeSessions.length ? (activeSessions.reduce((a,s)=>a+parseFloat(s.hours||0),0)/activeSessions.length).toFixed(1) : "0";
  const streak = (() => {
    let s=0, d=new Date();
    while(true){const ds=d.toISOString().split("T")[0]; if((sessions[activeExamId]||[]).find(x=>x.date===ds)){s++;d.setDate(d.getDate()-1);}else break;}
    return s;
  })();

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(""),2500); };

  // THEME
  const T = {
    bg: dark ? "#080D1A" : "#EEF2FF",
    card: dark ? "#0D1526" : "#FFFFFF",
    card2: dark ? "#121D30" : "#F5F7FF",
    border: dark ? "rgba(255,255,255,0.07)" : "rgba(99,102,241,0.1)",
    text: dark ? "#E2E8F5" : "#1E1B4B",
    muted: dark ? "#4A5A75" : "#7C82A8",
    green:"#22C55E", blue:"#818CF8", amber:"#F59E0B", red:"#EF4444", cyan:"#38BDF8", orange:"#F97316",
    nav: dark ? "#09101F" : "#FFFFFF",
    ac: activeExam.color,
  };

  const CSS = `
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',system-ui,sans-serif;background:${T.bg};color:${T.text};min-height:100vh}
    ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${T.muted};border-radius:2px}
    input,textarea,button{font-family:inherit}
    .fade{animation:fi 0.22s ease}
    @keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  `;

  const Btn = ({ onClick, children, style={}, ...p }) => (
    <button onClick={onClick} {...p} style={{ cursor:"pointer", border:"none", ...style }}
      onMouseDown={e=>{e.currentTarget.style.transform="scale(0.97)"}}
      onMouseUp={e=>{e.currentTarget.style.transform="scale(1)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"}}>
      {children}
    </button>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SETUP — Step 0: pick exams | Step 1: set days for each chosen exam
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === "setup") {
    const toggleExam = (id) => {
      setSelectedExams(prev =>
        prev.includes(id)
          ? prev.length > 1 ? prev.filter(x => x !== id) : prev
          : [...prev, id]
      );
    };

    const finishSetup = () => {
      sv("mpsc_setup", true);
      sv("mpsc_selected_exams", selectedExams);
      const today = todayStr();
      const starts = {};
      selectedExams.forEach(id => { starts[id] = today; });
      setExamStartDates(starts);
      setExamPlans(setupPlans);
      sv("mpsc_exam_plans", setupPlans);
      sv("mpsc_start_dates", starts);
      setActiveExamId(selectedExams[0]);
      setScreen("main");
    };

    // ── STEP 0: Choose exams ──
    if (setupStep === 0) {
      return (
        <>
          <style>{CSS}</style>
          <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#050B18,#0C1A35,#080F1E)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px" }}>
            <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
              {[260,420,580].map((r,i)=>(
                <div key={i} style={{ position:"absolute", width:r, height:r, borderRadius:"50%", border:`1px solid rgba(129,140,248,${0.04+i*0.01})`, left:"50%", top:"45%", transform:"translate(-50%,-50%)" }}/>
              ))}
            </div>
            <div className="fade" style={{ position:"relative", width:"100%", maxWidth:420 }}>
              <div style={{ textAlign:"center", marginBottom:28 }}>
                <div style={{ fontSize:48, marginBottom:10 }}>🌴</div>
                <div style={{ fontSize:24, fontWeight:900, color:"#E8EDF5", letterSpacing:-0.5 }}>Kerala PSC Tracker</div>
                <div style={{ fontSize:13, color:"#818CF8", fontWeight:700, marginTop:4, letterSpacing:2, textTransform:"uppercase" }}>Multi-Exam Study Planner</div>
              </div>

              <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(129,140,248,0.15)", borderRadius:22, padding:28 }}>
                <div style={{ fontSize:15, fontWeight:800, color:"#E8EDF5", marginBottom:4 }}>Which exams are you preparing for?</div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:22 }}>Select one or more. You can add more later from Settings.</div>

                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                  {EXAMS.map(e => {
                    const sel = selectedExams.includes(e.id);
                    const et = examStats(e, {}).total;
                    return (
                      <Btn key={e.id} onClick={() => toggleExam(e.id)}
                        style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", borderRadius:16, background: sel ? `${e.color}15` : "rgba(255,255,255,0.03)", border:`2px solid ${sel ? e.color : "rgba(255,255,255,0.08)"}`, textAlign:"left", transition:"all 0.2s", position:"relative" }}>
                        <div style={{ fontSize:28, flexShrink:0 }}>{e.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:14, fontWeight:800, color: sel ? e.color : "#E8EDF5" }}>{e.name}</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{e.catNo} · {e.totalMarks} marks · {et} topics</div>
                          <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginTop:1 }}>{e.org} · {e.level}</div>
                        </div>
                        <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${sel ? e.color : "rgba(255,255,255,0.2)"}`, background: sel ? e.color : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
                          {sel && <Ic n="check" size={12}/>}
                        </div>
                      </Btn>
                    );
                  })}
                </div>

                <div style={{ background:"rgba(129,140,248,0.08)", border:"1px solid rgba(129,140,248,0.15)", borderRadius:12, padding:12, marginBottom:20, fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.6 }}>
                  💡 VFA and 10th Prelim share common topics — mark once, counts in both.
                </div>

                <Btn onClick={() => { setSetupStep(1); setSetupDayIdx(0); }}
                  style={{ width:"100%", padding:"15px 0", background:"linear-gradient(135deg,#818CF8,#6366F1)", borderRadius:14, fontSize:15, fontWeight:800, color:"#fff", boxShadow:"0 4px 20px rgba(99,102,241,0.4)" }}>
                  Continue — {selectedExams.length} exam{selectedExams.length > 1 ? "s" : ""} selected →
                </Btn>
              </div>
              <div style={{ textAlign:"center", marginTop:14, fontSize:11, color:"rgba(255,255,255,0.25)" }}>All data saved locally · No login required</div>
            </div>
          </div>
        </>
      );
    }

    // ── STEP 1: Set days per selected exam ──
    const examId = selectedExams[setupDayIdx];
    const exam = EXAMS.find(e => e.id === examId);
    const selectedDays = setupPlans[examId] || 60;
    const topicsPerDay = Math.ceil(examStats(exam, {}).total / selectedDays);
    const isLast = setupDayIdx === selectedExams.length - 1;

    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#050B18,#0C1A35,#080F1E)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px" }}>
          <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
            {[260,400,540].map((r,i)=>(
              <div key={i} style={{ position:"absolute", width:r, height:r, borderRadius:"50%", border:`1px solid ${exam.color}18`, left:"50%", top:"45%", transform:"translate(-50%,-50%)" }}/>
            ))}
          </div>
          <div className="fade" style={{ position:"relative", width:"100%", maxWidth:420 }}>
            {/* Progress dots — only for selected exams */}
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:28 }}>
              {selectedExams.map((id, i) => {
                const e = EXAMS.find(x => x.id === id);
                return (
                  <div key={id} style={{ width: i===setupDayIdx?24:8, height:8, borderRadius:4, background: i<setupDayIdx ? e.color : i===setupDayIdx ? exam.color : "rgba(255,255,255,0.15)", transition:"all 0.3s" }}/>
                );
              })}
            </div>

            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ fontSize:44, marginBottom:8 }}>{exam.icon}</div>
              <div style={{ fontSize:22, fontWeight:900, color:"#E8EDF5" }}>{exam.name}</div>
              <div style={{ fontSize:12, color:exam.color, fontWeight:700, marginTop:4 }}>{exam.catNo} · {exam.org}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:3 }}>{exam.totalMarks} Marks · {exam.level} · {examStats(exam,{}).total} Topics</div>
            </div>

            <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${exam.color}25`, borderRadius:22, padding:28 }}>
              <div style={{ fontSize:14, fontWeight:700, color:"#E8EDF5", marginBottom:4 }}>Set your study plan</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:20 }}>How many days to finish this syllabus?</div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:22 }}>
                {DAY_OPTIONS.map(opt => {
                  const sel = selectedDays === opt.days;
                  return (
                    <Btn key={opt.days} onClick={() => setSetupPlans(p => ({...p, [examId]: opt.days}))}
                      style={{ padding:"16px 10px", borderRadius:16, background: sel?`${opt.color}18`:"rgba(255,255,255,0.03)", border:`2px solid ${sel?opt.color:"rgba(255,255,255,0.08)"}`, textAlign:"center", transition:"all 0.2s", position:"relative" }}>
                      {sel && <div style={{ position:"absolute", top:6, right:6, width:14, height:14, borderRadius:"50%", background:opt.color, display:"flex", alignItems:"center", justifyContent:"center" }}><Ic n="check" size={8}/></div>}
                      <div style={{ fontSize:22, fontWeight:900, color:sel?opt.color:"#E8EDF5" }}>{opt.days}</div>
                      <div style={{ fontSize:10, color:sel?opt.color:"rgba(255,255,255,0.3)" }}>{opt.sub}</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.25)", marginTop:3 }}>~{Math.ceil(examStats(exam,{}).total/opt.days)}/day</div>
                    </Btn>
                  );
                })}
              </div>

              <div style={{ background:`${exam.color}10`, border:`1px solid ${exam.color}25`, borderRadius:12, padding:14, marginBottom:22, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, textAlign:"center" }}>
                {[["Topics/day", topicsPerDay], ["Per week", topicsPerDay*7], ["Finish by", fmtDate(addDays(todayStr(), selectedDays))]].map(([l,v]) => (
                  <div key={l}><div style={{ fontSize:16, fontWeight:800, color:exam.color }}>{v}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", marginTop:2 }}>{l}</div></div>
                ))}
              </div>

              <Btn onClick={() => { isLast ? finishSetup() : setSetupDayIdx(i => i+1); }}
                style={{ width:"100%", padding:"15px 0", background:`linear-gradient(135deg,${exam.color},${exam.color}CC)`, borderRadius:14, fontSize:15, fontWeight:800, color:"#fff", boxShadow:`0 4px 20px ${exam.color}40` }}>
                {isLast ? "Start Studying →" : `Next: ${EXAMS.find(e=>e.id===selectedExams[setupDayIdx+1])?.shortName} →`}
              </Btn>

              <Btn onClick={() => setSetupStep(0)}
                style={{ width:"100%", padding:"10px 0", background:"transparent", marginTop:10, fontSize:12, color:"rgba(255,255,255,0.3)", fontWeight:600 }}>
                ← Back to exam selection
              </Btn>
            </div>
            <div style={{ textAlign:"center", marginTop:14, fontSize:11, color:"rgba(255,255,255,0.25)" }}>
              {setupDayIdx+1} of {selectedExams.length} exam{selectedExams.length>1?"s":""} · All data saved locally
            </div>
          </div>
        </div>
      </>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EXAM SWITCHER (top bar component)

  // ══════════════════════════════════════════════════════════════════════════
  const enrolledExamObjs = EXAMS.filter(e => enrolledExams.includes(e.id));

  const ExamSwitcher = () => (
    <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2, marginBottom:16 }}>
      {enrolledExamObjs.map(e=>{
        const es = examStats(e, completed);
        const active = e.id===activeExamId;
        return (
          <Btn key={e.id} onClick={()=>{ setActiveExamId(e.id); setSubjectView(null); }}
            style={{ flexShrink:0, padding:"8px 12px", borderRadius:12, background: active?`${e.color}20`:T.card2, border:`1.5px solid ${active?e.color:T.border}`, transition:"all 0.2s" }}>
            <div style={{ fontSize:14 }}>{e.icon}</div>
            <div style={{ fontSize:10, fontWeight: active?800:500, color: active?e.color:T.muted, marginTop:2, whiteSpace:"nowrap" }}>{e.shortName}</div>
            <div style={{ fontSize:10, color: active?e.color:T.muted, marginTop:1 }}>{es.pct}%</div>
          </Btn>
        );
      })}
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════
  let content = null;

  if (navTab==="dashboard") {
    const best = [...subjStats].sort((a,b)=>b.pct-a.pct)[0];
    const weak = [...subjStats].sort((a,b)=>a.pct-b.pct)[0];
    const sections = [...new Set(activeExam.subjects.map(s=>s.section))];
    content = (
      <div className="fade" style={{ padding:"16px 16px 100px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900 }}>Dashboard</div>
            <div style={{ fontSize:11, color:T.muted }}>{fmtDate(todayStr())}</div>
          </div>
          <Btn onClick={()=>setDark(!dark)} style={{ background:T.card2, border:`1px solid ${T.border}`, borderRadius:10, padding:"7px 10px", color:T.muted }}>
            <Ic n={dark?"sun":"moon"} size={15}/>
          </Btn>
        </div>

        <ExamSwitcher />

        {/* Exam badge */}
        <div style={{ background:`${T.ac}12`, border:`1px solid ${T.ac}30`, borderRadius:14, padding:"12px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:28 }}>{activeExam.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:800, color:T.ac }}>{activeExam.name}</div>
            <div style={{ fontSize:11, color:T.muted }}>{activeExam.catNo} · {activeExam.org} · {activePlan}-day plan</div>
          </div>
          {!activeExam.standalone && (
            <div style={{ background:`${T.ac}20`, borderRadius:8, padding:"4px 8px" }}>
              <div style={{ fontSize:9, color:T.ac, fontWeight:700 }}>SHARED</div>
              <Ic n="link" size={12}/>
            </div>
          )}
        </div>

        {streak>0 && (
          <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:12, padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>🔥</span>
            <div style={{ fontSize:13, fontWeight:700, color:T.amber }}>{streak}-Day Streak!</div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
          <Btn onClick={()=>{setNavTab("subjects");setSubjectView(null);}} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:16, textAlign:"left" }}>
            <div style={{ fontSize:11, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Total Topics</div>
            <div style={{ fontSize:32, fontWeight:900, color:T.cyan, fontVariantNumeric:"tabular-nums" }}>{stats.total}</div>
            <div style={{ fontSize:11, color:T.muted }}>{activeExam.subjects.length} subjects</div>
          </Btn>
          <Btn onClick={()=>setNavTab("completed")} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:16, textAlign:"left" }}>
            <div style={{ fontSize:11, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Completed</div>
            <div style={{ fontSize:32, fontWeight:900, color:T.green, fontVariantNumeric:"tabular-nums" }}>{stats.done}</div>
            <div style={{ fontSize:11, color:T.muted }}>{remaining} remaining</div>
          </Btn>
        </div>

        {/* Progress */}
        <Btn onClick={()=>setNavTab("progress")} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:18, marginBottom:10, width:"100%", textAlign:"left" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, color:T.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Overall Progress</div>
              <div style={{ fontSize:38, fontWeight:900, color:T.ac, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{stats.pct}<span style={{ fontSize:16 }}>%</span></div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:T.muted }}>Pace</div>
              <div style={{ fontSize:18, fontWeight:800, color:ahead?T.green:T.amber }}>{currentPace}/day</div>
              <div style={{ fontSize:11, color:ahead?T.green:T.amber }}>{ahead?"On Track ✓":"⚠ Behind"}</div>
            </div>
          </div>
          <Bar pct={parseFloat(stats.pct)} color={T.ac} h={10} bg={dark?"rgba(255,255,255,0.07)":"rgba(99,102,241,0.08)"} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:7, fontSize:11, color:T.muted }}>
            <span>{stats.done} done</span><span>{remaining} to go · {activeExam.totalMarks} marks</span>
          </div>
        </Btn>

        {/* Today + Days */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          <Btn onClick={()=>setNavTab("entry")} style={{ background:`rgba(56,189,248,0.08)`, border:`1px solid rgba(56,189,248,0.18)`, borderRadius:16, padding:16, textAlign:"left" }}>
            <div style={{ fontSize:11, color:T.cyan, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Today's Work</div>
            <div style={{ fontSize:26 }}>📝</div>
            <div style={{ fontSize:12, color:T.cyan, fontWeight:700, marginTop:8 }}>+ Add Entry</div>
          </Btn>
          <Btn onClick={()=>setNavTab("daysleft")} style={{ background:daysLeft<=5?`rgba(239,68,68,0.08)`:`rgba(245,158,11,0.08)`, border:`1px solid ${daysLeft<=5?"rgba(239,68,68,0.2)":"rgba(245,158,11,0.2)"}`, borderRadius:16, padding:16, textAlign:"left" }}>
            <div style={{ fontSize:11, color:daysLeft<=5?T.red:T.amber, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>Days Left</div>
            <div style={{ fontSize:36, fontWeight:900, color:daysLeft<=5?T.red:T.amber, lineHeight:1.1, fontVariantNumeric:"tabular-nums" }}>{daysLeft}</div>
            <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>of {activePlan} days</div>
          </Btn>
        </div>

        {/* All exams snapshot */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:16, marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>My Exams</div>
          {enrolledExamObjs.map(e=>{
            const es=examStats(e,completed);
            return (
              <Btn key={e.id} onClick={()=>setActiveExamId(e.id)} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, width:"100%", background:"transparent", textAlign:"left" }}>
                <div style={{ fontSize:18, flexShrink:0 }}>{e.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{e.shortName}</span>
                    <span style={{ color:e.color, fontWeight:700 }}>{es.pct}%</span>
                  </div>
                  <Bar pct={parseFloat(es.pct)} color={e.color} h={5} bg={dark?"rgba(255,255,255,0.06)":"rgba(99,102,241,0.07)"}/>
                  <div style={{ fontSize:10, color:T.muted, marginTop:3 }}>{es.done}/{es.total} topics</div>
                </div>
              </Btn>
            );
          })}
        </div>

        {/* Best/Weak */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:14 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>🏆 Leading</div>
            <div style={{ fontSize:12, fontWeight:700, lineHeight:1.3 }}>{best?.name}</div>
            <div style={{ fontSize:22, fontWeight:900, color:T.green, marginTop:4 }}>{best?.pct}%</div>
          </div>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:14 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>📌 Focus On</div>
            <div style={{ fontSize:12, fontWeight:700, lineHeight:1.3 }}>{weak?.name}</div>
            <div style={{ fontSize:22, fontWeight:900, color:T.amber, marginTop:4 }}>{weak?.pct}%</div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SUBJECTS
  // ══════════════════════════════════════════════════════════════════════════
  else if (navTab==="subjects") {
    if (subjectView) {
      const ss = subjStats.find(s=>s.id===subjectView);
      content = (
        <div className="fade" style={{ padding:"16px 16px 100px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
            <Btn onClick={()=>setSubjectView(null)} style={{ background:T.card2, border:`1px solid ${T.border}`, borderRadius:10, padding:"8px 10px", color:T.text }}>
              <Ic n="back" size={16}/>
            </Btn>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16, fontWeight:800, lineHeight:1.3 }}>{ss.icon} {ss.name}</div>
              <div style={{ fontSize:11, color:T.muted }}>{ss.done}/{ss.resolvedTopics.length} done · {ss.pct}% · {ss.marks} marks</div>
            </div>
            <div style={{ fontSize:11, fontWeight:800, background:`${T.ac}15`, color:T.ac, padding:"4px 10px", borderRadius:8 }}>{ss.marks}M</div>
          </div>
          <div style={{ marginBottom:16 }}><Bar pct={ss.pct} color={T.ac} h={8} bg={dark?"rgba(255,255,255,0.07)":"rgba(99,102,241,0.08)"}/></div>

          {/* Read-only info bar */}
          <div style={{ background:dark?"rgba(56,189,248,0.06)":"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.18)", borderRadius:12, padding:"10px 14px", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:16 }}>ℹ️</span>
            <div style={{ fontSize:12, color:T.cyan, lineHeight:1.5 }}>This page shows your progress. To mark topics done, use the <strong>Today</strong> tab below.</div>
          </div>

          {ss.resolvedTopics.map(t=>{
            const done = !!completed[t.id];
            return (
              <div key={t.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"13px 14px", background:done?(dark?"rgba(34,197,94,0.06)":"rgba(34,197,94,0.04)"):T.card, border:"1px solid "+(done?"rgba(34,197,94,0.2)":T.border), borderRadius:13, marginBottom:7, transition:"all 0.15s" }}>
                <div style={{ width:20, height:20, borderRadius:5, border:"2px solid "+(done?T.green:T.muted), background:done?T.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                  {done&&<Ic n="check" size={10}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:done?T.muted:T.text, textDecoration:done?"line-through":"none", lineHeight:1.5 }}>{t.label}</div>
                  {t.isShared && <div style={{ fontSize:10, color:T.cyan, marginTop:2, display:"flex", alignItems:"center", gap:3 }}><Ic n="link" size={9}/> Shared topic</div>}
                  {done && (
                    <div style={{ marginTop:3 }}>
                      <div style={{ fontSize:10, color:T.green }}>✓ Completed: {completed[t.id]}</div>
                      {revisions[t.id]?.length>0 && (
                        <div style={{ fontSize:10, color:T.blue, marginTop:1 }}>
                          🔄 Revised {revisions[t.id].length}x · Last: {revisions[t.id][revisions[t.id].length-1]}
                        </div>
                      )}
                      {!revisions[t.id]?.length && (
                        <div style={{ fontSize:10, color:T.amber, marginTop:1 }}>⚠ Not revised yet</div>
                      )}
                    </div>
                  )}
                </div>
                {done && (
                  <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0, marginTop:1 }}>
                    <Btn onClick={()=>{
                      const today=todayStr();
                      setRevisions(prev=>{
                        const existing=prev[t.id]||[];
                        if(existing[existing.length-1]===today) { showToast("Already revised today"); return prev; }
                        return {...prev,[t.id]:[...existing,today]};
                      });
                      showToast("Revision logged ✓");
                    }} style={{ background:"rgba(129,140,248,0.12)", border:"1px solid rgba(129,140,248,0.3)", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:T.blue }}>
                      🔄 Revise
                    </Btn>
                    <Btn onClick={()=>setUnmarkConfirm(t.id)}
                      style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:T.red }}>
                      Undo
                    </Btn>
                  </div>
                )}
              </div>
            );
          })}

          {unmarkConfirm && (()=>{
            const topic = ss.resolvedTopics.find(t=>t.id===unmarkConfirm);
            return (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:300, display:"flex", alignItems:"flex-end" }}>
                <div style={{ background:T.card, borderRadius:"20px 20px 0 0", padding:28, width:"100%", maxWidth:480, margin:"0 auto" }}>
                  <div style={{ fontSize:16, fontWeight:800, marginBottom:8 }}>Undo this topic?</div>
                  <div style={{ fontSize:13, color:T.muted, marginBottom:6, lineHeight:1.5 }}>{topic && topic.label}</div>
                  <div style={{ fontSize:12, color:T.red, marginBottom:22 }}>This will remove it from completed. Re-add it from the Today tab.</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <Btn onClick={()=>setUnmarkConfirm(null)} style={{ padding:"13px 0", background:T.card2, border:"1px solid "+T.border, borderRadius:12, fontSize:14, fontWeight:700, color:T.text }}>Cancel</Btn>
                    <Btn onClick={()=>{ setCompleted(prev=>{ const n={...prev}; delete n[unmarkConfirm]; return n; }); setUnmarkConfirm(null); showToast("Topic unmarked"); }} style={{ padding:"13px 0", background:T.red, borderRadius:12, fontSize:14, fontWeight:700, color:"#fff" }}>Yes, Undo</Btn>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      );
    } else {
      const sections = [...new Set(activeExam.subjects.map(s=>s.section))];
      content = (
        <div className="fade" style={{ padding:"16px 16px 100px" }}>
          <ExamSwitcher/>
          <div style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>{activeExam.icon} {activeExam.shortName}</div>
          <div style={{ fontSize:12, color:T.muted, marginBottom:20 }}>{stats.done}/{stats.total} topics · {activeExam.totalMarks} marks</div>
          {sections.map(sec=>{
            const subs=subjStats.filter(s=>s.section===sec);
            const secDone=subs.reduce((a,s)=>a+s.done,0);
            const secTotal=subs.reduce((a,s)=>a+s.resolvedTopics.length,0);
            return (
              <div key={sec} style={{ marginBottom:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, paddingBottom:6, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:11, fontWeight:800, color:T.ac, textTransform:"uppercase", letterSpacing:1 }}>{sec}</div>
                  <div style={{ fontSize:11, color:T.muted }}>{secDone}/{secTotal}</div>
                </div>
                {subs.map(s=>(
                  <Btn key={s.id} onClick={()=>setSubjectView(s.id)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", background:T.card, border:`1px solid ${T.border}`, borderRadius:14, marginBottom:8, width:"100%", textAlign:"left" }}>
                    <div style={{ fontSize:22, flexShrink:0 }}>{s.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5, gap:8 }}>
                        <div style={{ fontSize:13, fontWeight:700, lineHeight:1.3, flex:1 }}>{s.name}</div>
                        <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                          <span style={{ fontSize:10, color:T.ac, background:`${T.ac}15`, padding:"2px 6px", borderRadius:5, fontWeight:700 }}>{s.marks}M</span>
                          <span style={{ fontSize:13, fontWeight:800, color:s.pct>=80?T.green:s.pct>=50?T.cyan:T.muted }}>{s.pct}%</span>
                        </div>
                      </div>
                      <Bar pct={s.pct} color={s.pct>=80?T.green:s.pct>=50?T.cyan:T.amber} h={5} bg={dark?"rgba(255,255,255,0.06)":"rgba(99,102,241,0.07)"}/>
                      <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>{s.done}/{s.resolvedTopics.length} topics</div>
                    </div>
                    <Ic n="chevron" size={14}/>
                  </Btn>
                ))}
              </div>
            );
          })}
        </div>
      );
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // COMPLETED
  // ══════════════════════════════════════════════════════════════════════════
  else if (navTab==="completed") {
    // Gather all topic IDs for active exam
    const examTopicIds = new Set();
    for(const s of activeExam.subjects){ resolveTopics(s).forEach(t=>examTopicIds.add(t.id)); }
    const filterFn = dateStr => {
      if(completedFilter==="all") return true;
      const d=new Date(dateStr), now=new Date();
      if(completedFilter==="today") return dateStr===todayStr();
      if(completedFilter==="week"){ const s=new Date(now); s.setDate(now.getDate()-7); return d>=s; }
      if(completedFilter==="month"){ const s=new Date(now); s.setDate(now.getDate()-30); return d>=s; }
      return true;
    };
    const filtered = Object.entries(completed)
      .filter(([k,d])=>examTopicIds.has(k)&&filterFn(d))
      .sort((a,b)=>b[1].localeCompare(a[1]));

    // Find subject for topic
    const findSubject = tid => {
      for(const s of activeExam.subjects){
        const t=resolveTopics(s).find(t=>t.id===tid);
        if(t) return { subj:s, topic:t };
      }
      return null;
    };

    content = (
      <div className="fade" style={{ padding:"16px 16px 100px" }}>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:16 }}>Completed Topics</div>
        <div style={{ display:"flex", gap:7, marginBottom:20, overflowX:"auto", paddingBottom:4 }}>
          {[["all","All Time"],["today","Today"],["week","This Week"],["month","This Month"]].map(([v,l])=>(
            <Btn key={v} onClick={()=>setCompletedFilter(v)}
              style={{ padding:"7px 14px", borderRadius:20, background:completedFilter===v?T.ac:T.card2, color:completedFilter===v?"#fff":T.muted, fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>
              {l}
            </Btn>
          ))}
        </div>
        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"60px 0", color:T.muted }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
            <div>No completed topics for this period.</div>
          </div>
        ) : filtered.map(([key,date])=>{
          const found=findSubject(key);
          if(!found) return null;
          const { subj, topic } = found;
          return (
            <div key={key} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background:T.card, border:`1px solid rgba(34,197,94,0.18)`, borderRadius:13, marginBottom:7 }}>
              <div style={{ width:20, height:20, borderRadius:5, background:T.green, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                <Ic n="check" size={10}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, lineHeight:1.4 }}>{topic.label}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2, display:"flex", alignItems:"center", gap:6 }}>
                  <span>{subj.icon} {subj.name}</span>
                  {topic.isShared&&<span style={{ color:T.cyan, display:"flex", alignItems:"center", gap:2 }}><Ic n="link" size={9}/> shared</span>}
                  <span>· {date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // TODAY'S ENTRY
  // ══════════════════════════════════════════════════════════════════════════
  else if (navTab==="entry") {
    const allTopics = activeExam.subjects.flatMap(s=>
      resolveTopics(s).map(t=>({ ...t, subjectName:s.name, subjectIcon:s.icon, done:!!completed[t.id] }))
    );
    const pickerFiltered = allTopics.filter(t=>
      !t.done &&(pickerSearch===""||t.label.toLowerCase().includes(pickerSearch.toLowerCase())||t.subjectName.toLowerCase().includes(pickerSearch.toLowerCase()))
    );

    content = (
      <div className="fade" style={{ padding:"16px 16px 100px" }}>
        <ExamSwitcher/>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>Today's Study</div>
        <div style={{ fontSize:12, color:T.muted, marginBottom:20 }}>{fmtDate(todayStr())} · {activeExam.shortName}</div>

        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:16, marginBottom:10 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Hours Studied</label>
          <input type="number" step="0.5" min="0" max="24" value={dayEntry.hours}
            onChange={e=>setDayEntry(p=>({...p,hours:e.target.value}))} placeholder="e.g. 4"
            style={{ width:"100%", background:T.card2, border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", fontSize:20, fontWeight:800, color:T.text, outline:"none" }}/>
        </div>

        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:16, marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <label style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:0.5 }}>Topics Completed ({dayEntry.topics.length})</label>
            <Btn onClick={()=>setShowPicker(true)} style={{ background:T.ac, borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, color:"#fff", display:"flex", alignItems:"center", gap:4 }}>
              <Ic n="plus" size={12}/> Add
            </Btn>
          </div>
          {dayEntry.topics.length===0 ? (
            <div style={{ color:T.muted, fontSize:13, textAlign:"center", padding:"14px 0" }}>Tap + Add to select topics</div>
          ) : dayEntry.topics.map(tid=>{
            const found = allTopics.find(t=>t.id===tid);
            return (
              <div key={tid} style={{ display:"flex", alignItems:"flex-start", gap:8, padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, lineHeight:1.4 }}>{found?.subjectIcon} {found?.label||tid}</div>
                  {found?.isShared&&<div style={{ fontSize:10, color:T.cyan, marginTop:2, display:"flex", alignItems:"center", gap:2 }}><Ic n="link" size={9}/> Shared</div>}
                </div>
                <Btn onClick={()=>setDayEntry(p=>({...p,topics:p.topics.filter(x=>x!==tid)}))} style={{ background:"none", color:T.red, padding:4 }}>
                  <Ic n="x" size={14}/>
                </Btn>
              </div>
            );
          })}
        </div>

        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:16, marginBottom:20 }}>
          <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8 }}>Notes</label>
          <textarea rows={3} value={dayEntry.notes} onChange={e=>setDayEntry(p=>({...p,notes:e.target.value}))}
            placeholder="Key points, doubts, revision reminders..."
            style={{ width:"100%", background:T.card2, border:`1px solid ${T.border}`, borderRadius:10, padding:"11px 13px", fontSize:13, color:T.text, resize:"none", outline:"none" }}/>
        </div>

        <Btn onClick={()=>{
          if(!dayEntry.topics.length&&!dayEntry.hours) return;
          // Mark topics as completed
          const nc={...completed};
          dayEntry.topics.forEach(k=>{nc[k]=todayStr();});
          setCompleted(nc);
          // Always add as a new entry — every save is its own record
          const now=new Date();
          const timeStr=now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
          setSessions(prev=>{
            const exSess=[...(prev[activeExamId]||[])];
            exSess.unshift({
              date:todayStr(),
              time:timeStr,
              hours:dayEntry.hours,
              topics:dayEntry.topics,
              notes:dayEntry.notes
            });
            return {...prev,[activeExamId]:exSess};
          });
          setDayEntry({hours:"",topics:[],notes:""});
          showToast("Progress saved! ✓");
        }} style={{ width:"100%", padding:"15px 0", background:`linear-gradient(135deg,${T.ac},${T.ac}CC)`, borderRadius:14, fontSize:15, fontWeight:800, color:"#fff", boxShadow:`0 4px 20px ${T.ac}40` }}>
          Save Progress ✓
        </Btn>

        {/* Topic Picker Modal */}
        {showPicker&&(
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.78)", zIndex:200, display:"flex", flexDirection:"column" }}>
            <div style={{ background:T.card, borderRadius:"20px 20px 0 0", padding:20, marginTop:"auto", maxHeight:"82vh", display:"flex", flexDirection:"column" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontSize:15, fontWeight:800 }}>Select Topics</div>
                <Btn onClick={()=>{setShowPicker(false);setPickerSearch("");}} style={{ background:T.card2, border:`1px solid ${T.border}`, borderRadius:8, padding:"6px 10px", color:T.text }}>
                  <Ic n="x" size={15}/>
                </Btn>
              </div>
              <input value={pickerSearch} onChange={e=>setPickerSearch(e.target.value)} placeholder="Search topics..."
                style={{ background:T.card2, border:`1px solid ${T.border}`, borderRadius:10, padding:"10px 14px", fontSize:13, color:T.text, outline:"none", marginBottom:12 }}/>
              <div style={{ flex:1, overflowY:"auto" }}>
                {pickerFiltered.slice(0,150).map(t=>{
                  const sel=dayEntry.topics.includes(t.id);
                  return (
                    <Btn key={t.id} onClick={()=>setDayEntry(p=>({...p,topics:sel?p.topics.filter(x=>x!==t.id):[...p.topics,t.id]}))}
                      style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"11px 0", borderBottom:`1px solid ${T.border}`, width:"100%", textAlign:"left", background:"transparent" }}>
                      <div style={{ width:19, height:19, borderRadius:5, border:`2px solid ${sel?T.green:T.muted}`, background:sel?T.green:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, transition:"all 0.15s" }}>
                        {sel&&<Ic n="check" size={10}/>}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, lineHeight:1.4 }}>{t.label}</div>
                        <div style={{ fontSize:11, color:T.muted, marginTop:2, display:"flex", alignItems:"center", gap:4 }}>
                          <span>{t.subjectIcon} {t.subjectName}</span>
                          {t.isShared&&<span style={{ color:T.cyan }}><Ic n="link" size={9}/></span>}
                        </div>
                      </div>
                    </Btn>
                  );
                })}
              </div>
              <Btn onClick={()=>{setShowPicker(false);setPickerSearch("");}} style={{ marginTop:14, padding:"14px 0", background:T.ac, borderRadius:12, fontSize:15, fontWeight:800, color:"#fff" }}>
                Done — {dayEntry.topics.length} selected
              </Btn>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PROGRESS
  // ══════════════════════════════════════════════════════════════════════════
  else if (navTab==="progress") {
    const weeklyMap={};
    const examTopicIds=new Set();
    for(const s of activeExam.subjects) resolveTopics(s).forEach(t=>examTopicIds.add(t.id));
    Object.entries(completed).filter(([k])=>examTopicIds.has(k)).forEach(([,d])=>{
      const dt=new Date(d),s0=new Date(activeStart);
      const w=Math.floor((dt-s0)/(7*86400000))+1;
      if(w>=1) weeklyMap[`Wk ${w}`]=(weeklyMap[`Wk ${w}`]||0)+1;
    });
    const weekly=Object.entries(weeklyMap).sort((a,b)=>parseInt(a[0].slice(3))-parseInt(b[0].slice(3)));
    const maxW=Math.max(...weekly.map(w=>w[1]),1);

    content = (
      <div className="fade" style={{ padding:"16px 16px 100px" }}>
        <ExamSwitcher/>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:16 }}>Progress Centre</div>
        <div style={{ display:"flex", gap:5, marginBottom:20, background:T.card2, borderRadius:12, padding:4 }}>
          {[["overview","Overview"],["analytics","Analytics"],["reality","Reality"],["revision","Revision"],["history","History"]].map(([v,l])=>(
            <Btn key={v} onClick={()=>setProgressTab(v)}
              style={{ flex:1, padding:"8px 2px", borderRadius:9, background:progressTab===v?T.ac:"transparent", color:progressTab===v?"#fff":T.muted, fontSize:10, fontWeight:700 }}>
              {l}
            </Btn>
          ))}
        </div>

        {progressTab==="overview"&&(
          <div className="fade">
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:22, marginBottom:12, textAlign:"center" }}>
              <div style={{ fontSize:11, color:T.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
                {activeExam.icon} {activeExam.shortName}
              </div>
              <div style={{ fontSize:58, fontWeight:900, color:T.ac, lineHeight:1, fontVariantNumeric:"tabular-nums" }}>{stats.pct}<span style={{ fontSize:22 }}>%</span></div>
              <div style={{ margin:"16px 0 8px" }}><Bar pct={parseFloat(stats.pct)} color={T.ac} h={12} bg={dark?"rgba(255,255,255,0.07)":"rgba(99,102,241,0.08)"}/></div>
              <div style={{ fontSize:13, color:T.muted }}>{stats.done} of {stats.total} topics · {activeExam.totalMarks} marks</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[["🔥","Streak",`${streak} days`,T.amber],["📊","Avg Topics",`${currentPace}/day`,T.cyan],["⏱️","Avg Hours",`${avgHours} hrs`,T.green],["🎯","Need Pace",`${requiredPace}/day`,ahead?T.green:T.red]].map(([icon,label,val,color])=>(
                <div key={label} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:16 }}>
                  <div style={{ fontSize:22, marginBottom:4 }}>{icon}</div>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:22, fontWeight:900, color }}>{val}</div>
                </div>
              ))}
            </div>
            {!activeExam.standalone&&(
              <div style={{ background:`rgba(56,189,248,0.07)`, border:`1px solid rgba(56,189,248,0.2)`, borderRadius:14, padding:14, marginTop:12, display:"flex", alignItems:"flex-start", gap:10 }}>
                <Ic n="link" size={16}/>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.cyan }}>Shared Topic Pool Active</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>Topics marked here are shared with {activeExamId==="vfa"?"10th Level Prelim":"Village Field Assistant"}. Mark once, counts in both.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {progressTab==="analytics"&&(
          <div className="fade">
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:18, marginBottom:12 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Weekly Progress</div>
              {weekly.length===0?<div style={{ color:T.muted, fontSize:13 }}>No data yet. Mark topics to track!</div>
                :weekly.map(([w,n])=>(
                  <div key={w} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                      <span style={{ fontWeight:600 }}>{w}</span><span style={{ color:T.ac, fontWeight:700 }}>{n} topics</span>
                    </div>
                    <Bar pct={(n/maxW)*100} color={T.ac} h={7} bg={dark?"rgba(255,255,255,0.06)":"rgba(99,102,241,0.07)"}/>
                  </div>
                ))}
            </div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:18 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Subject Performance</div>
              {[...subjStats].sort((a,b)=>b.pct-a.pct).map(s=>(
                <div key={s.id} style={{ marginBottom:11 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ flex:1, lineHeight:1.3 }}>{s.icon} {s.name}</span>
                    <span style={{ color:s.pct>=80?T.green:s.pct>=50?T.cyan:T.amber, fontWeight:700, flexShrink:0, marginLeft:8 }}>{s.pct}%</span>
                  </div>
                  <Bar pct={s.pct} color={s.pct>=80?T.green:s.pct>=50?T.cyan:T.amber} h={5} bg={dark?"rgba(255,255,255,0.06)":"rgba(99,102,241,0.07)"}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {progressTab==="reality"&&(
          <div className="fade">
            <div style={{ background:ahead?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)", border:`1px solid ${ahead?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)"}`, borderRadius:18, padding:22, marginBottom:12, textAlign:"center" }}>
              <div style={{ fontSize:38, marginBottom:10 }}>{ahead?"🚀":"⚠️"}</div>
              <div style={{ fontSize:20, fontWeight:900, color:ahead?T.green:T.red }}>{ahead?"On Track!":"Behind Schedule"}</div>
              {daysOff!==null&&<div style={{ fontSize:13, color:T.muted, marginTop:6 }}>{ahead?`~${Math.abs(daysOff)} days early`:`~${daysOff} days late`} at current pace</div>}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              {[["Required Pace",`${requiredPace}/day`,T.amber],["Current Pace",`${currentPace}/day`,parseFloat(currentPace)>=requiredPace?T.green:T.red],["Forecast Finish",forecastDate,T.cyan],["Target Finish",fmtDate(addDays(activeStart,activePlan-1)),T.muted]].map(([l,v,c])=>(
                <div key={l} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:14 }}>
                  <div style={{ fontSize:11, color:T.muted, marginBottom:5 }}>{l}</div>
                  <div style={{ fontSize:14, fontWeight:800, color:c, lineHeight:1.3 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:16 }}>
              <div style={{ fontSize:12, fontWeight:700, marginBottom:10 }}>Time vs. Syllabus</div>
              <div style={{ fontSize:11, color:T.muted, marginBottom:5, display:"flex", justifyContent:"space-between" }}><span>Time: Day {daysUsed}/{activePlan}</span><span>{Math.round((daysUsed/activePlan)*100)}% elapsed</span></div>
              <Bar pct={(daysUsed/activePlan)*100} color={T.amber} h={8} bg={dark?"rgba(255,255,255,0.07)":"rgba(99,102,241,0.07)"}/>
              <div style={{ fontSize:11, color:T.muted, margin:"8px 0 5px", display:"flex", justifyContent:"space-between" }}><span>Syllabus: {stats.pct}% done</span><span>{daysLeft} days left</span></div>
              <Bar pct={parseFloat(stats.pct)} color={T.ac} h={8} bg={dark?"rgba(255,255,255,0.07)":"rgba(99,102,241,0.07)"}/>
            </div>
          </div>
        )}

        {progressTab==="revision"&&(()=>{
          // Build revision data for active exam topics
          const examTopicIds=new Set();
          for(const s of activeExam.subjects) resolveTopics(s).forEach(t=>examTopicIds.add(t.id));

          // All completed topics for t
