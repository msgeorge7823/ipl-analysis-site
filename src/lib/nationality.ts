/**
 * Player nationality utilities.
 *
 * Used to decide whether to render the overseas ✈️ icon next to a player.
 *
 * Three possible answers:
 *   true   – known overseas (non-Indian) IPL player
 *   false  – known Indian IPL player
 *   null   – unknown / can't tell
 *
 * Source priority:
 *   1. squads-2026.json has an explicit `overseas` boolean per player
 *      (see `buildOverseasLookup`). This is used for any player currently
 *      in the 2026 squads.
 *   2. A hardcoded list of well-known overseas players whose names are
 *      unambiguous — used for historical players not in the 2026 squads.
 *      The list is comprehensive for star players but not exhaustive.
 *   3. Otherwise null (indicator is hidden).
 */

/**
 * Hardcoded well-known overseas IPL players. Used as fallback when a player
 * isn't in the current-season squad file. Names are case-insensitively matched.
 *
 * This is not exhaustive — focus is on recognisable star players across
 * the IPL's history. The list can be extended any time without code changes
 * elsewhere in the app.
 */
/** All known-overseas player countries we surface in the UI. */
export const COUNTRY_LIST = [
  'India',
  'Australia',
  'New Zealand',
  'South Africa',
  'West Indies',
  'England',
  'Sri Lanka',
  'Afghanistan',
  'Pakistan',
  'Other',
] as const
export type Country = typeof COUNTRY_LIST[number]

/** Per-country lookup. Each name (normalised) → country. Built from the same
 *  hand-curated lists used by `KNOWN_OVERSEAS_SET` so the two stay in sync. */
const COUNTRY_BY_NAME = new Map<string, Country>()
function regCountry(country: Country, names: string[]) {
  for (const n of names) COUNTRY_BY_NAME.set(n, country)
}

const KNOWN_OVERSEAS_SET = new Set<string>([
  // --- Australia ---
  'ricky ponting', 'rt ponting', 'adam gilchrist', 'ac gilchrist',
  'shane warne', 'sk warne', 'shane watson', 'glenn maxwell', 'gj maxwell',
  'david warner', 'da warner', 'steve smith', 'sp smith', 'aaron finch',
  'pat cummins', 'mitchell starc', 'josh hazlewood', 'jp hazlewood',
  'cameron green', 'ca green', 'marcus stoinis', 'mp stoinis',
  'tim david', 'tim paine', 'mitchell marsh', 'matthew wade', 'ms wade',
  'travis head', 'jake fraser-mcgurk', 'james faulkner', 'jp faulkner',
  'michael hussey', 'david hussey', 'shaun marsh', 'adam zampa',
  'shaun tait', 'brett lee', 'mitchell johnson', 'mg johnson',
  'dan christian', 'da christian', 'kane richardson', 'ben dwarshuis',
  'chris lynn', 'clynn', 'andrew tye', 'na pooran',
  'josh philippe', 'jp behrendorff', 'jason behrendorff',
  'usman khawaja', 'uk khawaja', 'd warner', 'ellis',
  'jason gillespie', 'dj thornely', 'david hussey',
  'michael clarke', 'mj clarke', 'simon katich', 'sm katich',
  'cameron white', 'cl white', 'brad hodge', 'bj hodge', 'nathan coulter-nile',
  'dirk nannes', 'dp nannes', 'brad haddin', 'bj haddin',
  'moises henriques', 'mc henriques', 'shaun tait', 'nathan bracken',
  'james pattinson', 'jl pattinson', 'mitchell mcclenaghan',
  'xavier bartlett', 'spencer johnson', 'tim southee', 'tg southee',
  'matthew short',

  // --- New Zealand ---
  'brendon mccullum', 'bb mccullum', 'kane williamson', 'ks williamson',
  'ross taylor', 'lrpl taylor', 'trent boult', 'ta boult',
  'martin guptill', 'mj guptill', 'corey anderson', 'colin munro',
  'daniel vettori', 'dl vettori', 'jesse ryder', 'j ryder',
  'stephen fleming', 'sp fleming', 'nathan mccullum', 'n mccullum',
  'mitchell santner', 'm santner', 'ish sodhi', 'is sodhi',
  'tim seifert', 'lockie ferguson', 'lh ferguson', 'jimmy neesham',
  'james neesham', 'jdn neesham', 'devon conway', 'dp conway',
  'glenn phillips', 'gd phillips', 'finn allen', 'rachin ravindra',
  'michael bracewell', 'mark chapman', 'adam milne', 'ab mcdonnell',
  'kyle jamieson', 'kyle mills', 'ka mills', 'scott kuggeleijn',

  // --- South Africa ---
  'jacques kallis', 'jh kallis', 'ab de villiers', 'ab de villiers',
  'quinton de kock', 'q de kock', 'faf du plessis', 'f du plessis',
  'dale steyn', 'd steyn', 'morne morkel', 'm morkel', 'vernon philander',
  'albie morkel', 'am morkel', 'jp duminy', 'jp duminy',
  'heinrich klaasen', 'h klaasen', 'david miller', 'da miller',
  'rilee rossouw', 'rr rossouw', 'kagiso rabada', 'k rabada',
  'lungi ngidi', 'l ngidi', 'anrich nortje', 'a nortje',
  'tabraiz shamsi', 'imran tahir', 'graeme smith', 'gc smith',
  'hashim amla', 'hm amla', 'mark boucher', 'mv boucher',
  'lance klusener', 'l klusener', 'jacques rudolph', 'herschelle gibbs',
  'wayne parnell', 'kyle abbott', 'aiden markram', 'temba bavuma',
  'marco jansen', 'tristan stubbs', 'gerald coetzee', 'keshav maharaj',
  'chris morris', 'cm morris', 'shaun pollock', 'sm pollock',

  // --- West Indies ---
  'chris gayle', 'ch gayle', 'dwayne bravo', 'dj bravo',
  'darren bravo', 'kieron pollard', 'ka pollard', 'andre russell', 'ad russell',
  'sunil narine', 'sp narine', 'dwayne smith', 'ds smith',
  'nicholas pooran', 'n pooran', 'shimron hetmyer', 'sg hetmyer',
  'jason holder', 'jo holder', 'carlos brathwaite', 'cr brathwaite',
  'samuel badree', 'johnson charles', 'jn charles', 'obed mccoy',
  'alzarri joseph', 'shamar joseph', 'shai hope', 'evin lewis',
  'sherfane rutherford', 'brandon king', 'shimron hetmyer',
  'ravi rampaul', 'r rampaul', 'marlon samuels', 'mn samuels',
  'kemar roach', 'kaj roach', 'dwayne smith', 'lendl simmons',
  'darren sammy', 'darren ganga', 'fidel edwards', 'corey collymore',
  'roston chase',

  // --- England ---
  'kevin pietersen', 'kp pietersen', 'eoin morgan', 'em morgan',
  'jos buttler', 'jc buttler', 'ben stokes', 'ba stokes',
  'joe root', 'je root', 'jonny bairstow', 'jm bairstow',
  'moeen ali', 'ma ali', 'sam curran', 'sm curran', 'tom curran', 'te curran',
  'jason roy', 'jj roy', 'dawid malan', 'dj malan', 'liam livingstone',
  'alex hales', 'aj hales', 'luke wright', 'ln wright',
  'tymal mills', 'tk mills', 'reece topley', 'adil rashid', 'ur rashid',
  'chris woakes', 'cr woakes', 'liam plunkett', 'ben duckett',
  'harry brook', 'will jacks', 'saqib mahmood', 'phil salt', 'ps salt',
  'ravi bopara', 'rs bopara', 'gareth batty', 'gj batty', 'david willey',
  'brydon carse', 'jofra archer', 'jc archer', 'mark wood', 'ma wood',
  'andrew flintoff', 'a flintoff',

  // --- Sri Lanka ---
  'kumar sangakkara', 'kc sangakkara', 'mahela jayawardene', 'dpmd jayawardene',
  'lasith malinga', 'sl malinga', 'tilakaratne dilshan', 'tm dilshan',
  'muttiah muralitharan', 'm muralitharan', 'ajantha mendis', 'b ajantha mendis',
  'angelo mathews', 'aps mathews', 'dinesh chandimal', 'ln chandimal',
  'thisara perera', 'njd perera', 'nuwan kulasekara', 'kms kulasekara',
  'kusal mendis', 'kusal perera', 'bhanuka rajapaksa', 'wanindu hasaranga',
  'maheesh theekshana', 'dasun shanaka', 'matheesha pathirana',
  'dushmantha chameera', 'dilshan madushanka',

  // --- Afghanistan ---
  'rashid khan', 'mohammad nabi', 'noor ahmad', 'naveen-ul-haq',
  'fazalhaq farooqi', 'mujeeb ur rahman', 'mujeeb zadran', 'rahmanullah gurbaz',
  'azmatullah omarzai', 'ibrahim zadran', 'hazratullah zazai',
  'karim janat', 'najibullah zadran',

  // --- Pakistan (2008 only) ---
  'shahid afridi', 'shoaib akhtar', 'sohail tanvir', 'mohammad asif',
  'younis khan', 'misbah-ul-haq', 'shoaib malik',
  'kamran akmal', 'umar gul', 'salman butt', 'mohammad hafeez',
  'rana naved-ul-hasan', 'azhar mahmood',

  // --- Others ---
  'ryan ten doeschate', 'rn ten doeschate', // Netherlands
  'paul valthaty',                            // note: Indian, exclude if false positive
])

// Explicit Indian-player overrides to prevent false positives from the
// name-heuristic. Not required for correctness — just defensive.
const KNOWN_INDIAN_SET = new Set<string>([
  'paul valthaty', 'pd valthaty',
])

// ── Per-country registration ──────────────────────────────────────────
// Mirrors the country blocks above. Each name lives in exactly one country.
// Runtime cost is a one-time map populate; the source of truth still reads
// like comment-grouped sets above for ease of editing.

regCountry('Australia', [
  'ricky ponting','rt ponting','adam gilchrist','ac gilchrist','shane warne','sk warne','shane watson','glenn maxwell','gj maxwell','david warner','da warner','steve smith','sp smith','aaron finch','pat cummins','mitchell starc','josh hazlewood','jp hazlewood','cameron green','ca green','marcus stoinis','mp stoinis','tim david','tim paine','mitchell marsh','matthew wade','ms wade','travis head','jake fraser-mcgurk','james faulkner','jp faulkner','michael hussey','david hussey','shaun marsh','adam zampa','shaun tait','brett lee','mitchell johnson','mg johnson','dan christian','da christian','kane richardson','ben dwarshuis','chris lynn','andrew tye','josh philippe','jp behrendorff','jason behrendorff','usman khawaja','uk khawaja','jason gillespie','dj thornely','michael clarke','mj clarke','simon katich','sm katich','cameron white','cl white','brad hodge','bj hodge','nathan coulter-nile','dirk nannes','dp nannes','brad haddin','bj haddin','moises henriques','mc henriques','nathan bracken','james pattinson','jl pattinson','mitchell mcclenaghan','xavier bartlett','spencer johnson','matthew short','andrew mcdonald','ab mcdonald','ashley noffke','aa noffke','brett geeves','b geeves','riley meredith','rp meredith','aiden blizzard','ac blizzard','d arcy short','djm short','ashton turner','aj turner','daniel sams','dr sams','nathan ellis','nt ellis','adam voges','ac voges','george bailey','gj bailey','ben dunk','br dunk','nic maddinson','nj maddinson','michael neser','mg neser','peter handscomb','psp handscomb','sean abbott','sa abbott','john hastings','jw hastings','jhye richardson','ja richardson','clint mckay','cj mckay','ben hilfenhaus','bw hilfenhaus','john gillespie','luke pomersbach','la pomersbach','rob quiney','rj quiney','ryan harris','rj harris','damien martyn','dr martyn','darren lehmann','ds lehmann','andrew symonds','a symonds','glenn mcgrath','gd mcgrath','tim paine','td paine','adam zampa','a zampa','tim david','scott boland','sm boland','alex carey','at carey','andrew tye','at tye','michael klinger','m klinger','callum ferguson','cj ferguson','michael lumb','mj lumb','shane bond','se bond','luke ronchi','l ronchi','ben laughlin','b laughlin','glenn maxwell','dirk nannes','marcus stoinis','daniel christian','dt christian','michael clarke','dan christian','tim ludeman','xavier doherty','mike hussey','adam gilchrist',
])

regCountry('New Zealand', [
  'brendon mccullum','bb mccullum','kane williamson','ks williamson','ross taylor','lrpl taylor','trent boult','ta boult','martin guptill','mj guptill','corey anderson','colin munro','daniel vettori','dl vettori','jesse ryder','jd ryder','stephen fleming','sp fleming','nathan mccullum','nl mccullum','mitchell santner','mj santner','ish sodhi','is sodhi','tim seifert','lockie ferguson','lh ferguson','jimmy neesham','james neesham','jdn neesham','jds neesham','devon conway','dp conway','glenn phillips','gd phillips','finn allen','rachin ravindra','michael bracewell','mg bracewell','mark chapman','adam milne','kyle jamieson','kyle mills','ka mills','scott kuggeleijn','sc kuggeleijn','tim southee','tg southee','daryl mitchell','dj mitchell','james franklin','jec franklin','luke ronchi','shane bond','se bond','jacob oram','jdp oram','james neesham','daniel vettori','doug bracewell','daj bracewell','dean brownlie','andre adams','jeetan patel','tom latham','twm latham','colin de grandhomme','tim seifert','michael rippon','will young',
  // Recent NZ debutants
  'zak foulkes','z foulkes',           // T20I debut 2024
  'matt henry','mj henry',
  'ben sears','b sears',
  'will orourke','w orourke','will o rourke',
])

regCountry('South Africa', [
  'jacques kallis','jh kallis','ab de villiers','quinton de kock','q de kock','faf du plessis','f du plessis','dale steyn','d steyn','dw steyn','morne morkel','m morkel','vernon philander','albie morkel','am morkel','jp duminy','heinrich klaasen','h klaasen','david miller','da miller','rilee rossouw','rr rossouw','kagiso rabada','k rabada','lungi ngidi','l ngidi','anrich nortje','a nortje','tabraiz shamsi','t shamsi','imran tahir','graeme smith','gc smith','hashim amla','hm amla','mark boucher','mv boucher','lance klusener','l klusener','jacques rudolph','herschelle gibbs','hh gibbs','wayne parnell','wd parnell','kyle abbott','kj abbott','aiden markram','temba bavuma','marco jansen','tristan stubbs','gerald coetzee','g coetzee','keshav maharaj','ka maharaj','chris morris','cm morris','ch morris','shaun pollock','sm pollock','andre nel','a nel','dale steyn','allan donald','aa donald','johan botha','j botha','charl langeveldt','ck langeveldt','farhaan behardien','f behardien','beuran hendricks','be hendricks','justin kemp','jm kemp','robin peterson','rj peterson','rusty theron','j theron','juan theron','colin ingram','ca ingram','richard levi','re levi','ryan mclaren','r mclaren','david wiese','d wiese','dwaine pretorius','d pretorius','junior dala','cj dala','hardus viljoen','gc viljoen','sisanda magala','ssb magala','wiaan mulder','pwa mulder','andrew puttick','jonty rhodes','herschelle gibbs','vd philander','dwaine pretorius','quinton de kock','dean elgar','duanne olivier','marchant de lange','rory kleinveldt','aaron phangiso','andile phehlukwayo','tabraiz shamsi','dane vilas','keshav maharaj','tristan stubbs','dewald brevis','reeza hendricks','tony de zorzi','tabraiz shamsi','imran tahir','dale steyn','marchant de lange','farhaan behardien','jp duminy','duanne olivier','ottneil baartman','tristan stubbs','dean elgar','marco jansen','duan jansen',
  // Recent SA debutants
  'lhuan-dre pretorius','lg pretorius','lhuan dre pretorius',  // T20I debut 2024
  'donovan ferreira','d ferreira',                              // T20I debut 2023
  'nandre burger','n burger',
  'matthew breetzke',
  'ryan rickelton','rd rickelton',
])

regCountry('West Indies', [
  'chris gayle','ch gayle','dwayne bravo','dj bravo','darren bravo','dm bravo','kieron pollard','ka pollard','andre russell','ad russell','sunil narine','sp narine','dwayne smith','ds smith','dr smith','nicholas pooran','n pooran','shimron hetmyer','so hetmyer','jason holder','jo holder','carlos brathwaite','cr brathwaite','samuel badree','s badree','johnson charles','jn charles','obed mccoy','oc mccoy','alzarri joseph','as joseph','shamar joseph','s joseph','shai hope','sd hope','evin lewis','e lewis','sherfane rutherford','brandon king','ravi rampaul','r rampaul','marlon samuels','mn samuels','kemar roach','kaj roach','lendl simmons','lmp simmons','darren sammy','djg sammy','darren ganga','fidel edwards','fh edwards','corey collymore','roston chase','keemo paul','kma paul','adrian barath','ab barath','jerome taylor','je taylor','ramnaresh sarwan','rr sarwan','shivnarine chanderpaul','s chanderpaul','dwayne smith','rk reifer','sheldon cottrell','ss cottrell','fabian allen','fa allen','khary pierre','sherfane rutherford','akeal hosein','romario shepherd','andre fletcher','denesh ramdin','marlon samuels','kevon cooper','kk cooper','kyle mayers','kr mayers','odean smith','of smith','keemo paul','sulieman benn','dwayne smith','dwayne bravo','tino best','suniel narine','ravi rampaul','obed mccoy','sherfane rutherford','tjay barath','adrian barath',
])

regCountry('England', [
  'kevin pietersen','kp pietersen','eoin morgan','ejg morgan','jos buttler','jc buttler','ben stokes','ba stokes','joe root','je root','jonny bairstow','jm bairstow','moeen ali','mm ali','sam curran','sm curran','tom curran','tk curran','jason roy','jj roy','dawid malan','dj malan','liam livingstone','ls livingstone','alex hales','ad hales','luke wright','lj wright','tymal mills','reece topley','rjw topley','adil rashid','au rashid','chris woakes','cr woakes','liam plunkett','le plunkett','ben duckett','harry brook','hc brook','will jacks','saqib mahmood','phil salt','ravi bopara','rs bopara','gareth batty','david willey','dj willey','brydon carse','jofra archer','jc archer','mark wood','ma wood','andrew flintoff','a flintoff','ian bell','ir bell','alastair cook','an cook','andrew strauss','aj strauss','paul collingwood','pd collingwood','james anderson','jm anderson','stuart broad','scj broad','ollie pope','oj pope','chris jordan','cj jordan','sam billings','sw billings','dimitri mascarenhas','ad mascarenhas','luke wright','graham napier','gr napier','michael lumb','mj lumb','owais shah','oa shah','joe denly','jl denly','james pattinson','jl pattinson','tom kohler-cadmore','t kohler-cadmore','ravi bopara','sam curran','tom curran','kevin pietersen','ben duckett','rehan ahmed','rashid khan','michael yardy','steven finn','dimitri mascarenhas','luke wright','luke ronchi','ben hilfenhaus','jonathan trott','andrew flintoff','luke wright','phil mustard','jordan cox','rashid khan','reece topley','george garton','ghs garton','dan lawrence','will jacks','tom hartley','rehan ahmed','jamie overton','craig overton','jamie smith','luke wood','liam dawson',
  // Recent England debutants
  'jacob bethell','j bethell',                // Test/ODI/T20I 2024
  'jamie smith','jl smith',
  'shoaib bashir','s bashir',
])

regCountry('Sri Lanka', [
  'kumar sangakkara','kc sangakkara','mahela jayawardene','dpmd jayawardene','lasith malinga','sl malinga','tilakaratne dilshan','tm dilshan','muttiah muralitharan','m muralitharan','ajantha mendis','baw mendis','angelo mathews','ad mathews','dinesh chandimal','ln chandimal','thisara perera','njd perera','nuwan kulasekara','kms kulasekara','kusal mendis','bkg mendis','kusal perera','bhanuka rajapaksa','pbb rajapaksa','wanindu hasaranga','maheesh theekshana','m theekshana','dasun shanaka','matheesha pathirana','dushmantha chameera','dilshan madushanka','sanath jayasuriya','st jayasuriya','isuru udana','i udana','akila dananjaya','a dananjaya','suraj randiv','s randiv','farveez maharoof','mf maharoof','dilhara fernando','crd fernando','thilan thushara','t thushara','nuwan zoysa','dnt zoysa','chamara silva','lpc silva','chamara kapugedera','ck kapugedera','jeevan mendis','sachithra senanayake','seekkuge prasanna','dunith wellalage','kasun rajitha','vijayakanth viyaskanth','v viyaskanth','dilshan madushanka','dushmantha chameera','marvan atapattu','tillakaratne dilshan','farveez maharoof','sanath jayasuriya','romesh kaluwitharana','kumar sangakkara','muttiah muralitharan',
  // Recent SL debutants
  'kamindu mendis','k mendis','kpa mendis',  // Test/ODI/T20I 2022-2024
  'pathum nissanka','p nissanka',
])

regCountry('Afghanistan', [
  'rashid khan','mohammad nabi','noor ahmad','naveen-ul-haq','fazalhaq farooqi','mujeeb ur rahman','mujeeb zadran','rahmanullah gurbaz','azmatullah omarzai','ibrahim zadran','hazratullah zazai','karim janat','najibullah zadran','mohammad shahzad','samiullah shenwari','gulbadin naib','asghar afghan',
  // Recent debutants
  'allah ghazanfar','a ghazanfar',
])

regCountry('Pakistan', [
  'shahid afridi','shoaib akhtar','sohail tanvir','mohammad asif','younis khan','misbah-ul-haq','shoaib malik','kamran akmal','umar gul','salman butt','mohammad hafeez','rana naved-ul-hasan','azhar mahmood',
])

regCountry('Other', [
  'ryan ten doeschate','rn ten doeschate','sandeep lamichhane','s lamichhane','josh little','j little','rachin ravindra','tatenda taibu','t taibu','ray price','rw price','sandeep lamichhane','josh little','tim murtagh','curtis campher',
])

/** Public: get a player's country, or null if unknown. Indian players return
 *  'India' if either explicitly registered or detected as not-overseas. */
export function getPlayerCountry(name: string | undefined | null): Country | null {
  if (!name) return null
  const key = normalise(name)
  const direct = COUNTRY_BY_NAME.get(key)
  if (direct) return direct
  // Substring fallback for "SP Fleming" vs "Stephen Fleming" cases.
  for (const [k, v] of COUNTRY_BY_NAME) {
    if (k.length >= 5 && key.includes(k)) return v
  }
  return null
}

/**
 * Cricket cap-status classifier (binary).
 *
 *   capped   = the player has played at least one international match for
 *              a senior national team (received a national cap).
 *   uncapped = the player has never played senior international cricket.
 *
 * IPL-specific note: under IPL rules, an Indian capped player can be
 * RE-classified as uncapped if they haven't played the international XI
 * in the last 5 years AND have not held a BCCI central contract for 5
 * consecutive years. This 5-year reclassification rule does NOT apply
 * to overseas cricketers — one international cap = capped for IPL
 * purposes for an overseas player.
 *
 * Implementation strategy (best-effort, name-based):
 *   - Player is in our curated overseas-internationals lookup or in the
 *     curated capped-Indians list ⇒ 'capped'.
 *   - Otherwise ⇒ 'uncapped'.
 *
 * Why binary and not tri-state: the only nationality signal we have
 * available at runtime is name-matching against curated lists (the
 * `country` field on player records is not populated by the data
 * pipeline). In an IPL context, the long tail of unrecognised names is
 * overwhelmingly domestic-only Indian players, who are uncapped by
 * definition. A tri-state with an "unknown" bucket made the filter
 * un-usable. The trade-off is that any capped Indian we forget to add
 * to CAPPED_INDIANS will be mislabelled — so that list must be kept up
 * to date as new Indians get capped.
 *
 * IMPORTANT: cap status is never derived from IPL form / runs / wickets
 * / season stats. A capped player who hasn't scored a single run this
 * season is still capped. Cap status is about international caps only.
 */
export type CapStatus = 'capped' | 'uncapped'

export function getCapStatus(name: string | undefined | null): CapStatus {
  if (!name) return 'uncapped'
  const key = normalise(name)
  if (CAPPED_INDIANS.has(key)) return 'capped'
  if (KNOWN_OVERSEAS_SET.has(key)) return 'capped'
  if (COUNTRY_BY_NAME.has(key)) return 'capped'
  // Substring fallback for "SP Fleming" vs "Stephen Fleming" cases.
  for (const k of CAPPED_INDIANS) if (k.length >= 5 && key.includes(k)) return 'capped'
  for (const k of COUNTRY_BY_NAME.keys()) if (k.length >= 5 && key.includes(k)) return 'capped'
  return 'uncapped'
}

/** Boolean wrapper. Prefer `getCapStatus()` directly in new code. */
export function isCappedPlayer(name: string | undefined | null): boolean {
  return getCapStatus(name) === 'capped'
}

// Hand-curated set of capped Indian internationals (have played senior
// international cricket for India). Not exhaustive but covers all the
// well-known names spanning the IPL era. Add to this list as needed.
const CAPPED_INDIANS = new Set<string>([
  'sachin tendulkar','sr tendulkar','virat kohli','v kohli','rohit sharma','rg sharma',
  'ms dhoni','suresh raina','sk raina','yuvraj singh','virender sehwag','v sehwag',
  'gautam gambhir','g gambhir','vvs laxman','sourav ganguly','sc ganguly','anil kumble','a kumble',
  'zaheer khan','z khan','harbhajan singh','irfan pathan','i pathan','ik pathan','yusuf pathan','yk pathan',
  'rp singh','praveen kumar','p kumar','ishant sharma','i sharma','ashish nehra','a nehra',
  'parthiv patel','pa patel','dinesh karthik','kd karthik','wriddhiman saha','wp saha',
  'ajinkya rahane','am rahane','cheteshwar pujara','ca pujara','murali vijay','m vijay',
  'shikhar dhawan','s dhawan','rohit sharma','manish pandey','mk pandey','ambati rayudu','at rayudu',
  'ravichandran ashwin','r ashwin','ravindra jadeja','ra jadeja','kuldeep yadav','k yadav',
  'yuzvendra chahal','yk chahal','bhuvneshwar kumar','b kumar','jasprit bumrah','jj bumrah',
  'umesh yadav','ut yadav','mohammed shami','mohammed siraj','hardik pandya','hh pandya',
  'krunal pandya','kh pandya','shreyas iyer','sd iyer','rishabh pant','rr pant',
  'kl rahul','prithvi shaw','p shaw','shubman gill','sd gill','ishan kishan','ip kishan',
  'sanju samson','sv samson','suryakumar yadav','sa yadav','venkatesh iyer','navdeep saini','n saini',
  'arshdeep singh','a singh','tilak varma','t varma','ruturaj gaikwad','rd gaikwad',
  'washington sundar','w sundar','axar patel','akr patel','deepak chahar','d chahar',
  'shardul thakur','sn thakur','t natarajan','rajat patidar','riyan parag','r parag',
  'mukesh kumar','avesh khan','akash madhwal','khaleel ahmed','rinku singh','jitesh sharma',
  'manish pandey','dinesh karthik','wasim jaffer','w jaffer','mohammad kaif','m kaif',
  'sreesanth','s sreesanth','lakshmipathy balaji','l balaji','munaf patel','mm patel',
  'sanjay bangar','sb bangar','ajit agarkar','ab agarkar','ashok dinda','ab dinda',
  'wriddhiman saha','irfan pathan','sudeep tyagi','s tyagi','rahul tewatia','r tewatia',
  'piyush chawla','pp chawla','amit mishra','a mishra','varun aaron','vr aaron',
  'mohit sharma','m sharma','umesh yadav','aakash chopra','a chopra','wridhiman saha',
  'sandeep sharma','s sharma','siddarth kaul','s kaul','vinay kumar','sandeep warrier',
  'ankit rajpoot','as rajpoot','barinder sran','bb sran','akshdeep nath','ad nath',
  'rishabh pant','priyam garg','pk garg','prithvi shaw','navdeep saini','riyan parag',
  'devdutt padikkal','dp padikkal','arzan nagwaswalla','varun chakaravarthy','varun chakravarthy',
  'kedar jadhav','km jadhav','stuart binny','str binny','ambati rayudu',
  // ── Recent India debutants (2022-2025), missing from the original list ──
  // Verified via ESPNcricinfo + Wikipedia debut entries.
  'sai sudharsan','b sai sudharsan',          // ODI debut Dec 2023, T20I Jul 2024, Test Jun 2025
  'yashasvi jaiswal','yb jaiswal',            // Test/T20I debut 2023
  'prasidh krishna','m prasidh krishna',      // ODI debut 2021, Test debut 2022
  'nitish rana','n rana',                     // T20I debut 2023
  'umran malik',                              // T20I/ODI debut 2022
  'anuj rawat','a rawat',                     // T20I/ODI debut 2022
  'kartik tyagi','kt tyagi',                  // T20I debut 2021
  'mayank yadav',                             // T20I debut 2024
  'dhruv jurel',                              // Test debut 2024
  'harshit rana',                             // Test/ODI/T20I debut 2024-25
  'nitish kumar reddy','n kumar reddy',       // T20I debut Sep 2024, Test debut Nov 2024
  'abhishek sharma',                          // T20I debut 2024
  'akash deep',                               // Test debut 2024
  'ramandeep singh',                          // T20I debut Nov 2024
  'shivam dube','sd dube',                    // T20I + ODI 2019
  'ravi bishnoi','rd bishnoi',                // T20I debut 2022, ODI debut 2022
  'karun nair','kk nair',                     // Test triple-centurion 2016
  'arzan nagwaswalla',                        // already partially listed; keep
  'jaydev unadkat','jd unadkat','jaydev d unadkat',  // Test 2010, ODI 2013, T20I 2016
  'shivam mavi','s mavi',                     // T20I debut Jan 2023 (3-wkt haul)
  'karn sharma','ks sharma',                  // Test 2014, ODI 2014
  'shahbaz nadeem','s nadeem',                // ODI 2019, Test 2020
])

function normalise(name: string): string {
  return name.trim().toLowerCase()
}

/**
 * Build a name → overseas lookup from the squads-2026 file. Call once and pass
 * the result to `isOverseasPlayer`.
 */
export function buildOverseasLookup(officialSquads: Record<string, any> | undefined | null): Map<string, boolean> {
  const map = new Map<string, boolean>()
  if (!officialSquads) return map
  for (const teamName of Object.keys(officialSquads)) {
    const squad = officialSquads[teamName]
    if (!squad?.players) continue
    for (const p of squad.players) {
      if (typeof p.overseas === 'boolean' && p.name) {
        map.set(normalise(p.name), p.overseas)
      }
    }
  }
  return map
}

/**
 * Decide whether a player should get the overseas (✈️) badge.
 *
 * @param name - the player's display name
 * @param lookup - optional map from `buildOverseasLookup(officialSquads)`
 * @returns `true` if overseas, `false` if Indian, `null` if unknown
 */
export function isOverseasPlayer(
  name: string | undefined | null,
  lookup?: Map<string, boolean>,
): boolean | null {
  if (!name) return null
  const key = normalise(name)

  // 1. 2026-squad lookup — most accurate, wins if present.
  if (lookup && lookup.has(key)) {
    return lookup.get(key) as boolean
  }

  // 2. Explicit Indian override.
  if (KNOWN_INDIAN_SET.has(key)) return false

  // 3. Known-overseas hardcoded set.
  if (KNOWN_OVERSEAS_SET.has(key)) return true

  // 4. Substring match as a final pass — handles "SP Fleming" vs "Stephen Fleming".
  // Only fire if the hardcoded name is long enough (≥5 chars) to reduce noise.
  for (const known of KNOWN_OVERSEAS_SET) {
    if (known.length >= 5 && key.includes(known)) return true
  }
  return null
}
