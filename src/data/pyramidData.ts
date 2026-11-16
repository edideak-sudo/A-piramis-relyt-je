export interface ChamberMeta {
  id: number;
  title: string;
  subtitle: string;
  topic: string;
  image: string;
  imageAlt: string;
  story: string;
  relicName: string;
  relicDescription: string;
  hints: [string, string, string];
}

export interface KnowledgeSection {
  id: string;
  title: string;
  subtitle: string;
  facts: {
    term: string;
    detail: string;
  }[];
  tip: string;
}

export const TITLE_HERO_IMAGE = '/src/assets/images/pyramid_title_hero_1794827479217.jpg';

export const CHAMBERS: ChamberMeta[] = [
  {
    id: 1,
    title: 'A Bejárati Csarnok',
    subtitle: '01. Kamra · Az építészet titka',
    topic: 'Piramisok és templomi építészet',
    image: '/src/assets/images/chamber_1_entrance_1794827479814.jpg',
    imageAlt: 'Fáklyákkal megvilágított ókori egyiptomi mészkő bejárati csarnok lótusz- és papiruszoszlopokkal',
    story:
      'A hatalmas mészkőkapu becsukódott mögötted! A csarnok falán ősi építészeti rajzok és kőbe vésett zárak állják utadat. Párosítsd az építményeket, és állítsd be a kőtárcsákat a továbbjutáshoz.',
    relicName: 'Az Építőmester Piramidionja',
    relicDescription: 'A piramis csúcsára helyezett aranyozott zárókő jelképe.',
    hints: [
      'A legelső piramis lépcsős volt (Dzsószer fáraóé), míg a gízai nagy piramisok sima oldalú, négyzet alapú gúlák.',
      'A Szfinx oroszlántestű, emberfejű őrzőszobor, a templomoszlopok teteje pedig lótusz- vagy papiruszvirágot mintáz.',
      'A zárkód helyes beállításai: Kheopsz · Négyzet · Növényi motívum.',
    ],
  },
  {
    id: 2,
    title: 'A Festők Terme',
    subtitle: '02. Kamra · Az egyiptomi kánon',
    topic: 'Síkábrázolás és színszimbolika',
    image: '/src/assets/images/chamber_2_fresco_hall_1794827480737.jpg',
    imageAlt: 'Színes ókori egyiptomi falfestményekkel díszített sírkamra okker, lazúrkék és arany színekkel',
    story:
      'A falfestmények egy ősi szabály – az úgynevezett egyiptomi kánon – szerint készültek, ám valaki összekeverte a fáraó alakját és a szent festéktégelyeket. Állítsd helyre a mesterművet!',
    relicName: 'A Királyi Festőpaletta',
    relicDescription: 'Ásványi festékekkel őrzött paletta, amely örök életet ad a faliképeknek.',
    hints: [
      'Az egyiptomi festészetben minden testrészt a legjellemzőbb nézetből ábrázoltak: így válik a test a legkönnyebben felismerhetővé.',
      'A fej és a lábak oldalnézetben (profilból), míg a szem és a vállak szemből látszanak. A fáraó mindig nagyobb a szolgáknál!',
      'Színek: Arany = isteni fény, Fekete = termékeny iszap és újjászületés, Zöld = élet és növényzet, Okkervörös = férfi életerő.',
    ],
  },
  {
    id: 3,
    title: 'A Szobrászok Műhelye',
    subtitle: '03. Kamra · Portrék és jelképek',
    topic: 'Szobrászat és királyi hatalmi jelvények',
    image: '/src/assets/images/chamber_3_sculptor_hall_1794827480800.jpg',
    imageAlt: 'Szobrászműhely Nofertiti mellszobrával és Tutanhamon arany halotti maszkjával',
    story:
      'Két híres uralkodói remekmű között állsz: Nofertiti királyné mellszobra és Tutanhamon arany maszkja őrzi a következő ajtót. Vizsgáld meg a szobrokat, és helyezd vissza a fáraó jelképeit!',
    relicName: 'Az Arany Ureusz',
    relicDescription: 'A fáraó homlokán ágaskodó védelmező kobra arany dísze.',
    hints: [
      'Az egyiptomi szobrok szigorúan szimmetrikusak, méltóságteljesek és szemből (frontálisan) tekintenek ránk.',
      'Az ureusz kígyó a homlokon véd, a csíkos nemesz fejkendő a fejet takarja, az álszakáll az állon ül, a pásztorbot és ostor pedig a kézben van.',
      'Nofertiti szobra festett mészkőből készült, Tutanhamon halotti maszkja pedig színarany és kék lazúrkő berakású.',
    ],
  },
  {
    id: 4,
    title: 'Az Írnokok Könyvtára',
    subtitle: '04. Kamra · Hieroglifák és a kartus',
    topic: 'Képírás és szent szimbólumok',
    image: '/src/assets/images/chamber_4_scribe_archive_1794827482105.jpg',
    imageAlt: 'Papirusztekercsekkel és hieroglifás kőtáblával teli ókori egyiptomi írnokszoba',
    story:
      'A falon egy királyi kartus – ovális keretbe vésett név – zárja el a belső szentélyt. Használd az írnokok hangjel-kulcsát a név megfejtéséhez, majd társítsd a szent szimbólumokat!',
    relicName: 'A Lazúrkő Kartuspecsét',
    relicDescription: 'Ovális királyi névkeret, amely megőrzi az uralkodó nevét az örökkévalóságnak.',
    hints: [
      'Nézd meg figyelmesen a hieroglifa kulcstáblát: minden képjel egy-egy betűnek felel meg!',
      'A víz hullámvonala az N, a nádlevél az I, a fekvő oroszlán az L, a fürjfióka az U, az összecsukott kendő pedig az S betű.',
      'A megfejtendő 5 betűs szó Egyiptom életadó folyója: NILUS. Az Ankh az élet kulcsa, a Skarabeusz az újjászületés.',
    ],
  },
  {
    id: 5,
    title: 'A Sírkamra és a Napkapu',
    subtitle: '05. Kamra · Ma’at mérlege',
    topic: 'Túlvilági hit és művészeti összegzés',
    image: '/src/assets/images/chamber_5_burial_gate_1794827482732.jpg',
    imageAlt: 'Csillagos kék mennyezetű fáraói sírkamra középen Ma’at arany mérlegével és a csillagos sivatagra nyíló kapuval',
    story:
      'Elérkeztél a csillagos mennyezetű sírkamrába! A kijárat előtti Napkapu csak akkor tárul fel, ha 4 tudáspecséttel egyensúlyba hozod Ma’at igazságmérlegét az igazság tollával szemben.',
    relicName: 'Ma’at Igazságtolla',
    relicDescription: 'Az igazság és a rend szent tolla, amely megnyitja a sivatag csillagos éjszakájára vezető kaput.',
    hints: [
      'A mumifikálás során a belső szerveket négy díszes edényben, úgynevezett kanópusz edényekben őrizték meg.',
      'Az usébti kis szobrocskák a túlvilági munkákban segítették az elhunytat, a Halottak Könyve pedig útmutató volt a túlvilágra.',
      'A fáraó azért magasabb a domborműveken másoknál, mert a mérethierarchia az isteni rangot és hatalmat fejezi ki.',
    ],
  },
];

export const KNOWLEDGE_SECTIONS: KnowledgeSection[] = [
  {
    id: 'architecture',
    title: '1. Építészet és Piramisok',
    subtitle: 'Örök kőépítmények a sivatagban',
    facts: [
      {
        term: 'Lépcsős piramis',
        detail: 'Az első piramist Imhotep tervezte Dzsószer fáraónak Szakkarában, egymásra helyezett lépcsős szintekből.',
      },
      {
        term: 'Gízai gúlapiramisok',
        detail: 'Kheopsz, Khephrén és Mükerinosz fáraók sima oldalú, négyzet alapú gúla alakú síremlékei.',
      },
      {
        term: 'Nagy Szfinx',
        detail: 'Oroszlántestű, fáraófejű hatalmas sziklaszobor, amely a piramisok bejáratát őrzi.',
      },
      {
        term: 'Templomi oszlopok',
        detail: 'Az egyiptomi oszlopfejezetek gyakran a Nílus növényeit – lótuszvirágot és papiruszsást – mintázzák.',
      },
    ],
    tip: 'A piramisok belsejében álajtók és rejtett folyosók védték a királyi sírkamrát.',
  },
  {
    id: 'painting',
    title: '2. Festészet és az Egyiptomi Kánon',
    subtitle: 'A „legjellemzőbb nézet” törvénye',
    facts: [
      {
        term: 'Szemtörvény (Kánon)',
        detail: 'Az emberi test minden részét a legkönnyebben felismerhető irányból rajzolták: fej oldalról, szem szemből, vállak szemből, derék és lábak oldalról.',
      },
      {
        term: 'Mérethierarchia',
        detail: 'A rang határozza meg a méretet: a fáraót és az isteneket sokkal nagyobbra festették, mint a szolgákat.',
      },
      {
        term: 'Színek jelentése',
        detail: 'Arany = isteni és örökkévaló; Fekete = termékeny Nílus-iszap és újjászületés; Zöld = élet és növényzet; Okkervörös = férfi életerő.',
      },
    ],
    tip: 'Az egyiptomi művészek nem a pillanatnyi látványt, hanem az örök érvényű rendet akarták megmutatni.',
  },
  {
    id: 'sculpture',
    title: '3. Szobrászat és Királyi Jelképek',
    subtitle: 'Szimmetria és örökkévalóság',
    facts: [
      {
        term: 'Nofertiti mellszobra',
        detail: 'Festett mészkőből készült, világhírű, finom vonású királynéportré.',
      },
      {
        term: 'Tutanhamon halotti maszkja',
        detail: 'Színaranyból, kék lazúrkő és féldrágakövek berakásával készült fáraómaszk.',
      },
      {
        term: 'A fáraó jelképei',
        detail: 'Nemesz (csíkos fejkendő), Ureusz (védelmező kobra a homlokon), álszakáll (isteni méltóság), pásztorbot és ostor (uralkodói hatalom).',
      },
    ],
    tip: 'A királyi szobrok szemből (frontálisan) néznek ránk, és szigorúan szimmetrikusak.',
  },
  {
    id: 'hieroglyphs',
    title: '4. Hieroglifák és Jelképek',
    subtitle: 'Szent vésetek és amulettek',
    facts: [
      {
        term: 'Hieroglifák',
        detail: 'Görög eredetű szó, jelentése „szent vésetek”. Egyes jelek egész szót, mások hangokat jelölnek.',
      },
      {
        term: 'Kartus',
        detail: 'Ovális királyi keret, amelybe a fáraó nevét írták, hogy megvédje azt.',
      },
      {
        term: 'Ankh és Udzsat',
        detail: 'Az Ankh (füles kereszt) az élet kulcsa; az Udzsat (Hórusz szeme) a védelem és gyógyulás szimbóluma.',
      },
      {
        term: 'Skarabeusz',
        detail: 'A szent ganajtúró bogár az újjászületést és a felkelő napot jelképezi.',
      },
    ],
    tip: 'Az írnokok az egyik legmegbecsültebb mesterséget űzték Egyiptomban; papirusztekercsre írtak nádtollal.',
  },
  {
    id: 'afterlife',
    title: '5. Túlvilági Hit és Sírmellékletek',
    subtitle: 'Út az örökkévalóságba',
    facts: [
      {
        term: 'Ma’at mérlege',
        detail: 'Anubisz mérlegén az elhunyt szívét Ma’at igazságtollával mérték össze.',
      },
      {
        term: 'Kanópusz edények',
        detail: 'Négy, istenek fejével díszített kőedény, amelyekben a mumifikált belső szerveket őrizték.',
      },
      {
        term: 'Usébti szobrocskák',
        detail: 'Kis szolgáló szobrocskák a sírban, amelyek a túlvilágon segítették az elhunytat a munkában.',
      },
    ],
    tip: 'A Halottak Könyve egy tekercs volt, amely varázsigékkel segítette a lelket a túlvilági próbákon.',
  },
];
