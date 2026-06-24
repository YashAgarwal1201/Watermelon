export type Difficulty = "easy" | "medium" | "hard";

export type Category =
  | "Ancient Civilizations"
  | "Medieval World"
  | "Age of Exploration"
  | "Revolutions & Independence"
  | "World Wars"
  | "Cold War & Modern Era";

export interface Question {
  id: number;
  category: Category;
  difficulty: Difficulty;
  question: string;
  answer: string;
}

export const CATEGORIES: Category[] = [
  "Ancient Civilizations",
  "Medieval World",
  "Age of Exploration",
  "Revolutions & Independence",
  "World Wars",
  "Cold War & Modern Era",
];

export const CATEGORY_ICONS: Record<Category, string> = {
  "Ancient Civilizations": "pi-building-columns",
  "Medieval World": "pi-shield",
  "Age of Exploration": "pi-compass",
  "Revolutions & Independence": "pi-flag",
  "World Wars": "pi-globe",
  "Cold War & Modern Era": "pi-bolt",
};

export const DIFFICULTY_SEVERITY: Record<
  Difficulty,
  "success" | "warning" | "danger"
> = {
  easy: "success",
  medium: "warning",
  hard: "danger",
};

export const questions: Question[] = [
  // ── Ancient Civilizations ──────────────────────────────────────────────
  {
    id: 1,
    category: "Ancient Civilizations",
    difficulty: "easy",
    question:
      "Which river was central to the rise of ancient Egyptian civilization?",
    answer:
      "The Nile River. Its annual floods deposited rich silt on the surrounding land, enabling agriculture in an otherwise arid region and supporting one of the ancient world's most enduring civilizations.",
  },
  {
    id: 2,
    category: "Ancient Civilizations",
    difficulty: "easy",
    question: "What writing system did the ancient Sumerians develop?",
    answer:
      "Cuneiform — one of the earliest writing systems, created around 3100 BCE. It began as pictographic symbols pressed into clay tablets and evolved into wedge-shaped marks representing sounds and concepts.",
  },
  {
    id: 3,
    category: "Ancient Civilizations",
    difficulty: "medium",
    question: "What was the significance of the Code of Hammurabi?",
    answer:
      "Hammurabi's Code (c. 1754 BCE) was one of the earliest and most complete written legal codes. Enacted by the Babylonian king Hammurabi, it established standardized laws covering trade, property, family, and criminal justice, introducing the principle of presumption of innocence and the idea that the powerful could not arbitrarily oppress the weak.",
  },
  {
    id: 4,
    category: "Ancient Civilizations",
    difficulty: "medium",
    question:
      "How did the Persian Royal Road contribute to the Achaemenid Empire's strength?",
    answer:
      "The Royal Road stretched roughly 2,700 km from Susa to Sardis, enabling royal couriers to travel its length in about seven days. This rapid communication network let the Achaemenid kings project authority across a vast empire, coordinate military responses, and facilitate trade — a logistical advantage most rivals couldn't match.",
  },
  {
    id: 5,
    category: "Ancient Civilizations",
    difficulty: "hard",
    question:
      "What were the principal causes of the decline of the Indus Valley Civilization around 1900 BCE?",
    answer:
      "Historians debate this, but leading theories point to a combination of climate change — a centuries-long drought linked to a weakening monsoon — and the resulting agricultural collapse. The drying of the Ghaggar-Hakra river system likely disrupted the civilization's agricultural base. Evidence of Aryan invasion, once popular, is now largely discredited; the decline appears gradual rather than sudden, suggesting environmental stress over conquest.",
  },
  {
    id: 6,
    category: "Ancient Civilizations",
    difficulty: "easy",
    question:
      "Which structure did the ancient Greeks consider one of the Seven Wonders of the World and still stands today?",
    answer:
      "The Great Pyramid of Giza — though built by ancient Egyptians, not Greeks — is the only Wonder that survives intact. The Greeks included it in their list because of its extraordinary scale and precision, constructed around 2560 BCE as a tomb for Pharaoh Khufu.",
  },
  {
    id: 7,
    category: "Ancient Civilizations",
    difficulty: "medium",
    question:
      "What role did the Silk Road play in the Han Dynasty's influence?",
    answer:
      "The Silk Road was a network of trade routes connecting China to Central Asia, Persia, and the Mediterranean. Under the Han Dynasty (206 BCE – 220 CE), it enabled the export of silk, porcelain, and paper — goods that generated enormous wealth — while bringing back glass, wool, gold, and new religions including Buddhism. It also spread Han cultural and diplomatic influence far beyond China's borders.",
  },
  {
    id: 8,
    category: "Ancient Civilizations",
    difficulty: "hard",
    question:
      "Why did the Library of Alexandria's destruction matter so much to the history of knowledge?",
    answer:
      "The Library of Alexandria, at its height, held hundreds of thousands of scrolls representing the accumulated scholarship of the ancient Mediterranean world. Its gradual destruction — through fires, neglect, and political upheaval over several centuries — meant the irreversible loss of works in mathematics, astronomy, medicine, and philosophy. Scholars estimate that the vast majority of ancient Greek literature was lost, leaving us with fragments of what once existed.",
  },
  {
    id: 9,
    category: "Ancient Civilizations",
    difficulty: "easy",
    question:
      "What form of government did ancient Athens develop that influenced modern democracies?",
    answer:
      "Direct democracy — a system where citizens voted directly on laws and policies rather than electing representatives. Introduced under Cleisthenes around 507 BCE, it gave adult male citizens the right to participate in the Assembly (Ekklesia), debate legislation, and hold public officials accountable.",
  },
  {
    id: 10,
    category: "Ancient Civilizations",
    difficulty: "hard",
    question:
      "What distinguished the Carthaginian military system that allowed Hannibal to challenge Rome?",
    answer:
      "Carthage relied on a mercenary-based professional army recruited from across the Mediterranean — Numidian cavalry, Iberian infantry, Gauls, and Libyans — which gave it tactical flexibility Rome's citizen-legions initially lacked. Hannibal weaponized this diversity at Cannae (216 BCE), using his superior cavalry and a double-envelopment that annihilated a much larger Roman force. Rome ultimately prevailed because its manpower reserves and political durability outlasted Carthage's ability to sustain a mercenary army far from home.",
  },

  // ── Medieval World ─────────────────────────────────────────────────────
  {
    id: 11,
    category: "Medieval World",
    difficulty: "easy",
    question:
      "What event in 1066 fundamentally changed the English language and culture?",
    answer:
      "The Norman Conquest. William the Conqueror defeated King Harold II at the Battle of Hastings, bringing Norman French into English court and administration. Over the following centuries, English absorbed thousands of French words — particularly in law, cuisine, and government — creating the hybrid language we recognize as Middle English.",
  },
  {
    id: 12,
    category: "Medieval World",
    difficulty: "easy",
    question:
      "What was the Black Death, and how did it transform medieval European society?",
    answer:
      "The Black Death was a bubonic plague pandemic (1347–1351) that killed an estimated one-third to one-half of Europe's population. Beyond the immediate devastation, it upended feudal structures: a labor shortage gave surviving peasants more bargaining power, accelerating the decline of serfdom, spurring skepticism of the Church, and indirectly fueling the social changes that preceded the Renaissance.",
  },
  {
    id: 13,
    category: "Medieval World",
    difficulty: "medium",
    question: "How did the feudal system structure medieval European society?",
    answer:
      "Feudalism organized society into a hierarchy of obligation and land tenure. At the top sat the monarch, who granted land (fiefs) to nobles (lords and vassals) in exchange for military service. Lords in turn granted portions to knights, who owed military duty upward. Serfs and peasants at the base worked the land in exchange for protection. The system bound political authority, military service, and economic production into a single interlocked structure.",
  },
  {
    id: 14,
    category: "Medieval World",
    difficulty: "medium",
    question:
      "What were the Crusades, and what lasting effects did they have on East-West relations?",
    answer:
      "The Crusades were a series of religious wars (1095–1291) launched by Western Christian powers to capture the Holy Land from Muslim rule. They failed militarily in the long term — Jerusalem was ultimately lost — but had profound lasting effects: increased trade and cultural exchange between Europe and the Islamic world, deep mutual suspicion and enmity that persisted for centuries, and the transmission to Europe of classical knowledge preserved in Arabic translation.",
  },
  {
    id: 15,
    category: "Medieval World",
    difficulty: "hard",
    question:
      "Why was the Mongol Empire's rise so consequential for Eurasian history?",
    answer:
      "The Mongol Empire, at its 13th-century peak, was the largest contiguous land empire in history, stretching from the Pacific to Eastern Europe. Its conquests devastated cities like Baghdad (ending the Abbasid Caliphate in 1258) and depopulated regions of Central Asia for generations. Yet it also unified trade routes under the Pax Mongolica, enabling unprecedented movement of people, goods, and ideas across Eurasia — and inadvertently facilitated the spread of the plague that became the Black Death.",
  },
  {
    id: 16,
    category: "Medieval World",
    difficulty: "medium",
    question:
      "What was the Magna Carta and why does it matter to constitutional history?",
    answer:
      "The Magna Carta (1215) was a charter forced on King John of England by rebellious barons, establishing that the king was subject to the rule of law and could not act with absolute power. Clauses guaranteeing due process and protection against arbitrary imprisonment became foundational to English common law and later influenced the U.S. Constitution and the Universal Declaration of Human Rights.",
  },
  {
    id: 17,
    category: "Medieval World",
    difficulty: "hard",
    question:
      "How did the Byzantine Empire preserve Roman and Greek learning during Europe's early medieval period?",
    answer:
      "While Western Europe experienced a relative cultural contraction after Rome's fall, Constantinople served as a continuous center of literacy, philosophy, and administration. Byzantine scholars copied and maintained manuscripts of Greek philosophy, medicine, mathematics, and history. When the empire's scholars fled westward — particularly after the Ottoman conquest of Constantinople in 1453 — they brought these texts to Italy, directly fueling the Renaissance's recovery of classical learning.",
  },
  {
    id: 18,
    category: "Medieval World",
    difficulty: "easy",
    question:
      "What invention transformed medieval European warfare in the 14th century?",
    answer:
      "Gunpowder weapons — particularly the cannon — introduced to Europe via trade with China and the Islamic world. By the Hundred Years' War, artillery was beginning to make traditional stone castles obsolete, fundamentally shifting the balance of power between monarchs (who could afford cannon) and castle-holding nobles.",
  },

  // ── Age of Exploration ─────────────────────────────────────────────────
  {
    id: 19,
    category: "Age of Exploration",
    difficulty: "easy",
    question:
      "Who led the first European expedition to circumnavigate the globe?",
    answer:
      "Ferdinand Magellan initiated the expedition in 1519, but was killed in the Philippines in 1521. Juan Sebastián Elcano completed the voyage, returning to Spain in 1522 with 18 survivors from an original crew of roughly 270 — proving the Earth was round and far larger than many had estimated.",
  },
  {
    id: 20,
    category: "Age of Exploration",
    difficulty: "easy",
    question: "What was the Columbian Exchange?",
    answer:
      "The Columbian Exchange was the widespread transfer of plants, animals, culture, disease, and people between the Americas and the Old World following Columbus's 1492 voyage. It brought potatoes, tomatoes, maize, and tobacco to Europe while sending horses, cattle, smallpox, and measles to the Americas — with catastrophic consequences for Indigenous populations who had no immunity to Old World diseases.",
  },
  {
    id: 21,
    category: "Age of Exploration",
    difficulty: "medium",
    question:
      "Why was Portugal the first European power to establish a sea route to Asia?",
    answer:
      "Portugal's early investment in maritime technology, cartography, and navigation — under the patronage of Prince Henry the Navigator — gave it a decisive head start. Its Atlantic position, experience with open-ocean sailing, and the development of the caravel (a maneuverable, lateen-rigged ship suited to exploration) let it systematically chart the African coast. Vasco da Gama's 1498 rounding of the Cape of Good Hope opened a direct spice trade route, breaking the Ottoman and Venetian stranglehold on overland trade.",
  },
  {
    id: 22,
    category: "Age of Exploration",
    difficulty: "medium",
    question:
      "What was the Treaty of Tordesillas and what did it reveal about European attitudes toward the rest of the world?",
    answer:
      "Signed in 1494 between Spain and Portugal (brokered by Pope Alexander VI), the Treaty divided the non-European world along a meridian — roughly 370 leagues west of the Cape Verde Islands — granting Spain rights to the west and Portugal to the east. It reveals the extraordinary presumption of European powers to partition lands inhabited by millions of people without any consultation or recognition of their sovereignty.",
  },
  {
    id: 23,
    category: "Age of Exploration",
    difficulty: "hard",
    question:
      "How did the fall of Constantinople in 1453 accelerate European exploration?",
    answer:
      "The Ottoman conquest of Constantinople closed or heavily taxed the overland Silk Road routes that had carried Asian spices and goods to Europe. With the most profitable trade corridor now controlled by a rival power, European merchants and monarchs had strong economic incentives to find alternative sea routes to Asia. This pressure directly motivated the Portuguese push around Africa and Spanish support for Columbus — making Ottoman expansion an indirect catalyst for the Age of Exploration.",
  },
  {
    id: 24,
    category: "Age of Exploration",
    difficulty: "hard",
    question:
      "What role did the encomienda system play in the Spanish colonization of the Americas?",
    answer:
      "The encomienda was a labor grant system in which the Spanish Crown assigned Indigenous people to a conquistador or colonist (encomendero), who was entitled to their labor and tribute in exchange for their supposed Christianization and 'protection.' In practice it functioned as forced labor, leading to massive Indigenous population collapse through overwork, disease, and violence. Reformers like Bartolomé de las Casas campaigned against it, leading to the New Laws of 1542 — though enforcement was inconsistent and exploitation continued in other forms.",
  },
  {
    id: 25,
    category: "Age of Exploration",
    difficulty: "medium",
    question:
      "What navigational tool made long-distance oceanic sailing viable for European explorers?",
    answer:
      "Several tools converged: the magnetic compass (adopted from China via the Islamic world), the astrolabe and later the cross-staff for measuring latitude from stellar positions, and improved charts (portolan charts). Equally important was the adoption of triangular lateen sails, which allowed ships to sail closer to the wind and navigate back from equatorial regions where trade winds blew the wrong direction for square-rigged ships.",
  },

  // ── Revolutions & Independence ─────────────────────────────────────────
  {
    id: 26,
    category: "Revolutions & Independence",
    difficulty: "easy",
    question:
      "What document, adopted in 1776, declared the thirteen American colonies independent from Britain?",
    answer:
      "The Declaration of Independence, primarily drafted by Thomas Jefferson and adopted by the Continental Congress on July 4, 1776. Drawing on Enlightenment philosophy — particularly John Locke's ideas about natural rights — it articulated the principle that governments derive their just powers from the consent of the governed.",
  },
  {
    id: 27,
    category: "Revolutions & Independence",
    difficulty: "easy",
    question:
      "What was the storming of the Bastille and why is it symbolic of the French Revolution?",
    answer:
      "On July 14, 1789, Parisian crowds stormed the Bastille fortress-prison, which symbolized royal tyranny. The event marked the beginning of popular revolutionary violence and signaled that the monarchy could no longer rely on passive obedience from its subjects. July 14 is now celebrated as Bastille Day, France's national holiday.",
  },
  {
    id: 28,
    category: "Revolutions & Independence",
    difficulty: "medium",
    question:
      "How did the Haitian Revolution challenge the assumptions of the Atlantic world?",
    answer:
      "The Haitian Revolution (1791–1804) was the only successful slave revolt in history that led to the founding of an independent nation. It directly challenged Enlightenment hypocrisy — proving that the ideals of liberty and equality proclaimed by American and French revolutionaries applied to enslaved Africans too, whether or not their liberators admitted it. It sent shockwaves through slaveholding societies in the Americas and contributed to Napoleon's decision to sell Louisiana to the United States.",
  },
  {
    id: 29,
    category: "Revolutions & Independence",
    difficulty: "medium",
    question:
      "What were the underlying causes of the American Revolution beyond taxation disputes?",
    answer:
      "Beyond 'taxation without representation,' the Revolution had deeper causes: a growing colonial identity distinct from Britain, Enlightenment ideas about natural rights and limited government, resentment of British military presence after the Seven Years' War, mercantilist restrictions on colonial trade, and the ambitions of colonial elites who saw independence as an opportunity for self-governance. The taxation disputes were triggers that ignited longer-simmering tensions.",
  },
  {
    id: 30,
    category: "Revolutions & Independence",
    difficulty: "hard",
    question: "Why did the French Revolution descend into the Reign of Terror?",
    answer:
      "The Terror (1793–1794) emerged from the convergence of external military threat (France at war with most of Europe), internal counter-revolutionary revolt (particularly the Vendée uprising), and the radical Jacobin belief that the Revolution's enemies had to be eliminated to save it. The Committee of Public Safety under Robespierre institutionalized political violence as an instrument of revolutionary purity — executing not just royalists but rival revolutionaries. The logic of suspicion became self-consuming, ending only when the Thermidorian Reaction toppled Robespierre himself.",
  },
  {
    id: 31,
    category: "Revolutions & Independence",
    difficulty: "medium",
    question: "How did Simón Bolívar shape the independence of South America?",
    answer:
      "Bolívar led or inspired independence movements across Venezuela, Colombia, Ecuador, Peru, and Bolivia (named for him). He was both a military commander — winning decisive campaigns like the Battle of Boyacá (1819) — and a political thinker who dreamed of a unified Gran Colombia. His campaigns permanently broke Spanish colonial power on the continent, though his vision of continental unity fragmented after independence as regional interests diverged.",
  },
  {
    id: 32,
    category: "Revolutions & Independence",
    difficulty: "hard",
    question:
      "What made the Indian independence movement under Gandhi historically distinctive?",
    answer:
      "Gandhi's strategy of nonviolent resistance (Satyagraha) was unprecedented in its disciplined, mass-scale application against a colonial power. By making British repression visible and morally untenable to an increasingly global audience — and by mobilizing millions across caste and religious lines — he demonstrated that empire could be delegitimized from within without matching its violence. The 1930 Salt March is a paradigmatic example: a seemingly small act of civil disobedience became a global symbol that cracked British moral authority in India.",
  },

  // ── World Wars ─────────────────────────────────────────────────────────
  {
    id: 33,
    category: "World Wars",
    difficulty: "easy",
    question: "What event directly triggered the start of World War I?",
    answer:
      "The assassination of Archduke Franz Ferdinand of Austria-Hungary in Sarajevo on June 28, 1914, by Gavrilo Princip, a Bosnian Serb nationalist. This triggered a chain of alliance obligations — Austria-Hungary declared war on Serbia, drawing in Russia, Germany, France, and Britain — transforming a regional conflict into a continental war within six weeks.",
  },
  {
    id: 34,
    category: "World Wars",
    difficulty: "easy",
    question: "What was D-Day?",
    answer:
      "D-Day refers to June 6, 1944 — the Allied invasion of Normandy, France, codenamed Operation Overlord. Over 156,000 American, British, and Canadian troops landed on five beaches in the largest seaborne invasion in history. The operation opened a Western Front that, combined with Soviet advances from the east, put Nazi Germany in an unwinnable two-front war.",
  },
  {
    id: 35,
    category: "World Wars",
    difficulty: "medium",
    question:
      "Why did the Treaty of Versailles contribute to the rise of the Nazi Party?",
    answer:
      "The Treaty (1919) imposed harsh terms on Germany: the 'war guilt' clause, massive reparations, significant territorial losses, and military restrictions. These created genuine economic hardship, deep national humiliation, and a potent political grievance that the Nazi Party — along with other nationalist movements — exploited masterfully. Hitler's promises to restore Germany's honor and reverse Versailles resonated with millions of Germans suffering under the Great Depression.",
  },
  {
    id: 36,
    category: "World Wars",
    difficulty: "medium",
    question: "What was the Holocaust?",
    answer:
      "The Holocaust was the systematic, state-sponsored persecution and murder of six million Jews by the Nazi regime and its collaborators between 1933 and 1945. It also targeted Roma, disabled people, homosexuals, Soviet POWs, and political opponents. The Nazis used industrial-scale methods — concentration camps, mobile killing units (Einsatzgruppen), and extermination camps like Auschwitz — making it one of history's most documented and deliberate genocides.",
  },
  {
    id: 37,
    category: "World Wars",
    difficulty: "hard",
    question:
      "How did the Eastern Front of World War II differ from the Western Front, and why did it matter more to the war's outcome?",
    answer:
      "The Eastern Front (1941–1945) was the largest and most destructive theater of World War II. Germany invaded the Soviet Union in Operation Barbarossa, engaging in a war of annihilation — not just conquest — driven by Nazi racial ideology. An estimated 27 million Soviet citizens died. The scale dwarfed the Western Front: roughly 80% of German military losses occurred in the East. The Battle of Stalingrad (1942–43) and Kursk (1943) broke the Wehrmacht's offensive capability; from 1943 onward, it was Soviet forces that did most of the work of destroying the German army.",
  },
  {
    id: 38,
    category: "World Wars",
    difficulty: "hard",
    question:
      "What role did propaganda play in mobilizing populations during World War I?",
    answer:
      "WWI saw the first systematic use of mass propaganda by modern states. Governments used posters, films, newspapers, and speeches to construct narratives of national duty and dehumanize the enemy. Britain's invasion of Belgium was framed as a moral crusade; Germany promoted the concept of Kulturkampf (cultural struggle). Propaganda was essential for sustaining public support through years of attritional warfare and for managing the psychological reality of industrialized slaughter — and its techniques were refined and reused more lethally by totalitarian regimes in the 1930s.",
  },
  {
    id: 39,
    category: "World Wars",
    difficulty: "medium",
    question: "What was the significance of the Battle of Britain?",
    answer:
      "The Battle of Britain (summer–autumn 1940) was the first major military campaign fought entirely by air forces. Germany's Luftwaffe attempted to destroy the Royal Air Force to pave the way for a naval invasion. The RAF's successful defense — aided by radar, the Spitfire and Hurricane fighters, and the Bletchley Park codebreakers reading German communications — denied Hitler air superiority and forced the indefinite postponement of Operation Sea Lion, meaning Britain remained in the war as a base for future Allied operations.",
  },

  // ── Cold War & Modern Era ──────────────────────────────────────────────
  {
    id: 40,
    category: "Cold War & Modern Era",
    difficulty: "easy",
    question: "What was the Berlin Wall and why did it fall?",
    answer:
      "The Berlin Wall was a concrete barrier built by East Germany in 1961 to stop the mass emigration of East Germans to the West. It became the defining symbol of the Iron Curtain. It fell on November 9, 1989, when a confused East German spokesman announced that the border would be opened 'immediately' — crowds gathered, guards stood down, and citizens began dismantling it. The fall was a product of Soviet reform under Gorbachev (glasnost and perestroika), economic stagnation in the East Bloc, and a wave of mass protests across Eastern Europe.",
  },
  {
    id: 41,
    category: "Cold War & Modern Era",
    difficulty: "easy",
    question: "What was the Cuban Missile Crisis?",
    answer:
      "A 13-day confrontation in October 1962 between the United States and the Soviet Union after the U.S. discovered Soviet nuclear missiles being installed in Cuba. It is considered the closest the Cold War came to nuclear conflict. It was resolved through a combination of public naval blockade, secret diplomacy, and mutual concession: the Soviets removed the missiles; the U.S. pledged not to invade Cuba and secretly agreed to remove its missiles from Turkey.",
  },
  {
    id: 42,
    category: "Cold War & Modern Era",
    difficulty: "medium",
    question: "How did the Marshall Plan reshape post-World War II Europe?",
    answer:
      "The Marshall Plan (1948–1952) committed the United States to providing approximately $13 billion in economic aid to rebuild Western European economies devastated by the war. Beyond reconstruction, it served a strategic purpose: prosperous, stable democracies were less susceptible to communist political movements. The Plan accelerated European recovery, deepened economic integration (laying groundwork for the eventual European Union), and firmly tied Western Europe to the American sphere — shaping the geopolitical map for the rest of the Cold War.",
  },
  {
    id: 43,
    category: "Cold War & Modern Era",
    difficulty: "medium",
    question: "What was apartheid and how did it end?",
    answer:
      "Apartheid was a system of institutionalized racial segregation and discrimination enforced by South Africa's National Party government from 1948 to 1994. It classified people by race, restricted where they could live and work, and denied Black South Africans political rights. It ended through a combination of internal resistance (ANC, student uprisings like Soweto 1976), international economic sanctions, and negotiation — culminating in Nelson Mandela's release in 1990 and South Africa's first multiracial elections in 1994.",
  },
  {
    id: 44,
    category: "Cold War & Modern Era",
    difficulty: "hard",
    question:
      "What were the primary factors that led to the dissolution of the Soviet Union in 1991?",
    answer:
      "The Soviet collapse resulted from overlapping crises: chronic economic stagnation and inability to compete with Western technology, the catastrophic cost of the Afghan War (1979–89), the Chernobyl disaster (1986) exposing systemic incompetence, Gorbachev's reforms (glasnost and perestroika) which inadvertently allowed suppressed nationalism and political dissent to surface, the loss of Eastern European satellite states in 1989, and an attempted coup in August 1991 that fatally weakened the Communist Party's authority. By December 1991, the Union formally dissolved.",
  },
  {
    id: 45,
    category: "Cold War & Modern Era",
    difficulty: "hard",
    question:
      "How did decolonization reshape the international order in the mid-20th century?",
    answer:
      "Between roughly 1945 and 1975, dozens of nations in Asia, Africa, and the Middle East gained independence from European colonial powers — often through a combination of nationalist movements, imperial economic exhaustion after WWII, and Cold War pressures (both superpowers found European colonialism inconvenient for different reasons). Decolonization dramatically expanded the UN's membership, created the Non-Aligned Movement, and generated new states that became arenas for Cold War proxy competition. The borders and institutions left by colonial powers — often arbitrary and poorly adapted to local realities — shaped conflicts that continue today.",
  },
  {
    id: 46,
    category: "Cold War & Modern Era",
    difficulty: "medium",
    question: "What was the significance of the Space Race?",
    answer:
      "The Space Race (roughly 1957–1969) was a competition between the U.S. and Soviet Union for supremacy in spaceflight technology. The Soviets struck first — Sputnik (1957), Gagarin (1961) — but NASA's Apollo program landed astronauts on the Moon in July 1969. Beyond national prestige, it drove technological development in computing, materials science, and telecommunications, while framing the Cold War as a contest of systems: which ideology could achieve more? The Moon landing was as much a propaganda victory as a scientific one.",
  },
  {
    id: 47,
    category: "Cold War & Modern Era",
    difficulty: "hard",
    question:
      "Why did the Vietnam War end the way it did, and what were its lasting consequences for U.S. foreign policy?",
    answer:
      "The U.S. failed in Vietnam for several interconnected reasons: a guerrilla war that nullified American conventional military superiority, a corrupt and unpopular South Vietnamese government that failed to build popular legitimacy, the inability to seal the Ho Chi Minh trail supply network, and — critically — the erosion of domestic political support as casualties mounted and the rationale for war became increasingly unclear. The war's legacy reshaped U.S. foreign policy through the 'Vietnam Syndrome' — a public and Congressional reluctance to commit ground troops to foreign conflicts — and the War Powers Resolution (1973), which attempted to limit presidential war-making authority.",
  },
  {
    id: 48,
    category: "Cold War & Modern Era",
    difficulty: "medium",
    question: "What was the Non-Aligned Movement and what did it represent?",
    answer:
      "Founded at the Bandung Conference (1955) and formalized in 1961, the Non-Aligned Movement was an alliance of nations — primarily newly independent states from Asia and Africa — that sought to avoid alignment with either the U.S. or Soviet bloc during the Cold War. Leaders like Nehru (India), Nasser (Egypt), and Tito (Yugoslavia) championed it as a 'third way' — asserting sovereignty and development on their own terms rather than as pawns in superpower competition. It gave voice to anti-colonial sentiment and challenged the bipolar framing of world politics.",
  },
];

export const TOTAL_QUESTIONS = questions.length;

export const questionsByCategory = CATEGORIES.reduce(
  (acc, category) => {
    acc[category] = questions.filter((q) => q.category === category);
    return acc;
  },
  {} as Record<Category, Question[]>,
);

export const questionsByDifficulty = (
  ["easy", "medium", "hard"] as Difficulty[]
).reduce(
  (acc, difficulty) => {
    acc[difficulty] = questions.filter((q) => q.difficulty === difficulty);
    return acc;
  },
  {} as Record<Difficulty, Question[]>,
);
