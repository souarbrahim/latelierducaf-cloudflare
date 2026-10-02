import { createContext, useContext, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Instagram,
  Menu,
  MoveRight,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type Language = 'fr' | 'en';

const copy = {
  fr: {
    nav: [
      { label: 'L’atelier', href: '#atelier' },
      { label: 'À propos', href: '#a-propos' },
      { label: 'Prestations', href: '#prestations' },
      { label: 'Méthode', href: '#methode' },
      { label: 'Journal', href: '#journal' },
    ],
    header: {
      quote: 'Demander un devis',
      location: 'Paris · France',
      mainNav: 'Navigation principale',
      mobileNav: 'Navigation mobile',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      language: 'Choisir la langue',
    },
    hero: {
      kicker: 'Café de spécialité · mariages · entreprises · salons',
      title: 'Le café,',
      titleAccent: 'autrement.',
      description: 'L’Atelier du Café installe à Paris un comptoir de café vivant, précis et généreux pour vos mariages, événements d’entreprise et salons professionnels, avec une carte pensée sur mesure.',
      primary: 'Parlons de votre événement',
      secondary: 'Découvrir l’atelier',
      videoAlt: 'Film silencieux d’un geste de préparation espresso',
    },
    marquee: 'TORRÉFACTION JUSTE   ·   SERVICE HUMAIN   ·   CAFÉ QUI A DU CARACTÈRE   ·   PARIS ET AU-DELÀ   ·   ',
    atelier: {
      label: '01 — L’atelier',
      title: 'Du grain',
      titleAccent: 'au sourire.',
      lead: 'Nous croyons qu’un bon café n’est jamais seulement une boisson. C’est une attention. Un rythme qui ralentit. Le début d’une conversation.',
      bodyOne: 'Nous sélectionnons des cafés traçables auprès de maisons qui partagent notre exigence, puis nous les travaillons avec une torréfaction claire et expressive.',
      bodyTwo: 'Le jour J, notre équipe arrive avec son matériel, son sourire et une obsession tranquille : que chaque tasse soit à sa place.',
      cta: 'Voir notre méthode',
    },
    about: {
      label: '02 — À propos',
      title: 'Le meilleur du',
      titleAccent: 'coffee shop.',
      lead: 'Après cinq ans passés dans différents coffee shops parisiens, nous avons fondé L’Atelier du Café avec une mission : apporter au catering le meilleur de l’univers du coffee shop, des grains de qualité et d’excellents produits et recettes artisanaux, façonnés à la main par des baristas expérimentés.',
      bodyOne: 'Nous y ajoutons ce qui fait la différence : un service client attentionné, de la première prise de contact jusqu’au dernier café servi.',
      bodyTwo: 'Notre installation compacte occupe peu de place et s’adapte partout, du stand de salon à la salle de réception.',
      statValue: '5',
      statLabel: 'ans dans les coffee shops de Paris',
    },
    services: {
      label: '03 — Nos événements',
      title: 'Pensé pour',
      titleAccent: 'vos invités.',
      description: 'Mariages, événements d’entreprise, salons professionnels : chaque comptoir est pensé pour vos invités, à partir de 40 convives.',
      items: [
        { number: '01', title: 'Mariages', text: 'Un comptoir de café élégant pour votre cérémonie, votre vin d’honneur ou votre réception.', meta: 'Café pour mariages' },
        { number: '02', title: 'Événements d’entreprise', text: 'Fêtes d’entreprise, lancements et rencontres : un service café qui accueille vos équipes comme vos clients.', meta: 'Entreprises · Lancements' },
        { number: '03', title: 'Salons professionnels & expositions', text: 'Un comptoir à votre image, installé sur votre stand ou dans votre espace, pour accueillir vos visiteurs toute la journée.', meta: 'Salons · Stands · Expositions' },
      ],
    },
    method: {
      label: '04 — La méthode',
      title: 'Moins de',
      titleAccent: 'bruit.',
      titleEnd: 'Plus de soin.',
      steps: [
        ['01', 'On écoute', 'Votre lieu, votre public, votre tempo. Tout commence par quelques bonnes questions.'],
        ['02', 'On compose', 'Café, matériel et carte sur mesure, pensés selon votre public, votre lieu et vos envies : nous dessinons un comptoir cohérent avec votre événement.'],
        ['03', 'On sert', 'Une équipe préparée, une mise en place discrète, un service qui reste présent sans jamais prendre toute la place.'],
      ],
      mediaAlt: 'Lumière chaude sur le matériel de café',
      mediaLabel: 'Voir le comptoir en action',
      detailLabel: 'Le détail compte',
      detailCopy: 'Une machine rare, un geste sûr, une tasse qui reste en mémoire.',
    },
    cacao: {
      label: '05 — Produits artisanaux',
      title: 'Le goût',
      titleAccent: 'des artisans.',
      body: 'Tous nos produits sont artisanaux, choisis pour leur goût, leur origine et la main qui les façonne.',
      products: [
        'Cafés de spécialité torréfiés avec soin par Gaia Torréfacteur',
        'Cacao artisanal imaginé avec Diggers Roastery, à Lyon',
        'Une variété de thés et infusions aux plantes d’excellente qualité, avec Goutte de Thé',
        'Laits, sirops et accompagnements sélectionnés avec exigence',
        'Des recettes simples, préparées à la commande, sans artifice',
      ],
      collaborators: [
        { logo: '/diggers-roastery-logo.png', name: 'Diggers Roastery', detail: 'Cacao · Lyon · France' },
        { logo: '/goutte-de-the-logo.png', name: 'Goutte de Thé', detail: 'Thés & infusions aux plantes' },
        { logo: '/gaia-torrefacteur-logo.png', name: 'Gaia Torréfacteur', detail: 'Cafés de spécialité · France' },
      ],
    },
    quote: {
      label: '06 — Parlons-nous',
      title: 'Faites',
      titleAccent: 'place',
      titleEnd: 'au bon café.',
      description: 'Quelques détails suffisent pour commencer. Nous revenons vers vous sous 48 heures ouvrées.',
      nameLabel: 'Votre nom / entreprise *',
      namePlaceholder: 'Ex. Camille, Maison Parallèle',
      emailLabel: 'Email *',
      emailPlaceholder: 'camille@votreentreprise.fr',
      dateLabel: 'Date de l’événement *',
      guestsLabel: 'Nombre d’invités',
      guestsPlaceholder: 'Environ 120',
      projectLabel: 'Votre projet',
      projectPlaceholder: 'Salon, mariage, lancement… racontez-nous.',
      submit: 'Envoyer la demande',
      sending: 'Envoi en cours…',
      successTitle: 'C’est bien noté.',
      successCopy: 'Votre demande est sur notre établi. Nous revenons vers vous très vite pour imaginer le bon format.',
      another: 'Faire une autre demande',
      errors: {
        required: 'Indiquez votre nom, votre email et la date de l’événement.',
        email: 'Cette adresse email semble incomplète.',
        send: 'L’envoi n’a pas abouti. Réessayez ou écrivez-nous directement par email.',
      },
    },
    footer: {
      contact: 'Contact',
      copyright: '© {year} L’Atelier du Café · Paris',
      email: 'bonjourlatelierducafe@gmail.com',
      phone: '+33 (0)6 17 44 96 18',
    },
    meta: {
      title: 'L’Atelier du Café — Café de spécialité pour mariages, entreprises et salons',
      description: 'Café de spécialité pour vos mariages, événements d’entreprise, salons professionnels et expositions à Paris. Carte sur mesure, adaptée à vos besoins.',
    },
  },
  en: {
    nav: [
      { label: 'The atelier', href: '#atelier' },
      { label: 'About', href: '#a-propos' },
      { label: 'Services', href: '#prestations' },
      { label: 'Our method', href: '#methode' },
      { label: 'Journal', href: '#journal' },
    ],
    header: {
      quote: 'Request a quote',
      location: 'Paris · France',
      mainNav: 'Main navigation',
      mobileNav: 'Mobile navigation',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      language: 'Choose language',
    },
    hero: {
      kicker: 'Specialty coffee · weddings · corporate · trade shows',
      title: 'Coffee,',
      titleAccent: 'reimagined.',
      description: 'L’Atelier du Café brings a lively, precise and generous coffee counter to Paris for your weddings, corporate events and trade shows, with a menu tailored to your needs.',
      primary: 'Talk about your event',
      secondary: 'Discover the atelier',
      videoAlt: 'Silent film of an espresso preparation ritual',
    },
    marquee: 'THOUGHTFUL ROASTING   ·   HUMAN SERVICE   ·   COFFEE WITH CHARACTER   ·   PARIS AND BEYOND   ·   ',
    atelier: {
      label: '01 — The atelier',
      title: 'From bean',
      titleAccent: 'to smile.',
      lead: 'We believe a good coffee is never just a drink. It is a gesture of care. A rhythm that slows down. The beginning of a conversation.',
      bodyOne: 'We select traceable coffees from houses that share our standards, then work with them through a clear and expressive roast.',
      bodyTwo: 'On the day, our team arrives with its equipment, its warmth and one quiet obsession: that every cup feels exactly right.',
      cta: 'See our method',
    },
    about: {
      label: '02 — About us',
      title: 'The best of',
      titleAccent: 'the coffee shop.',
      lead: 'After five years working in coffee shops across Paris, we founded L’Atelier du Café with one mission: to bring the best of the coffee shop world to catering, with quality beans and excellent artisanal products and recipes, handcrafted by experienced baristas.',
      bodyOne: 'We pair it with what makes the difference: attentive customer service, from the first conversation to the last cup served.',
      bodyTwo: 'Our compact setup has a small footprint and fits anywhere, from a trade show stand to a reception hall.',
      statValue: '5',
      statLabel: 'years in Paris coffee shops',
    },
    services: {
      label: '03 — Our events',
      title: 'Made for',
      titleAccent: 'your guests.',
      description: 'Weddings, corporate events, trade shows: every counter is designed around your guests, from 40 guests.',
      items: [
        { number: '01', title: 'Weddings', text: 'An elegant coffee counter for your ceremony, cocktail hour or reception.', meta: 'Wedding coffee catering' },
        { number: '02', title: 'Corporate events', text: 'Company celebrations, launches and meetings: a coffee service that welcomes your teams and your clients.', meta: 'Corporate · Launches' },
        { number: '03', title: 'Trade shows & exhibitions', text: 'A counter that reflects your brand, set up at your stand or in your space to welcome visitors all day.', meta: 'Trade shows · Stands · Exhibitions' },
      ],
    },
    method: {
      label: '04 — Our method',
      title: 'Less',
      titleAccent: 'noise.',
      titleEnd: 'More care.',
      steps: [
        ['01', 'We listen', 'Your venue, your audience, your tempo. It all starts with a few good questions.'],
        ['02', 'We compose', 'Coffee, equipment and a menu tailored to you, built around your audience, your venue and your wishes: we shape a counter that belongs to your event.'],
        ['03', 'We serve', 'A prepared team, a discreet setup, a service that stays present without taking over the room.'],
      ],
      mediaAlt: 'Warm light on coffee equipment',
      mediaLabel: 'See the counter in action',
      detailLabel: 'Details matter',
      detailCopy: 'A rare machine, a sure hand, a cup that stays with you.',
    },
    cacao: {
      label: '05 — Artisanal products',
      title: 'Made by',
      titleAccent: 'skilled hands.',
      body: 'Every product we serve is artisanal, chosen for its flavour, its origin and the hands that shape it.',
      products: [
        'Specialty coffees roasted with care by Gaia Torréfacteur',
        'Artisanal cacao created with Diggers Roastery in Lyon',
        'A variety of excellent herbal teas and infusions from Goutte de Thé',
        'Milk, syrups and accompaniments selected with high standards',
        'Simple recipes, prepared to order, with nothing unnecessary',
      ],
      collaborators: [
        { logo: '/diggers-roastery-logo.png', name: 'Diggers Roastery', detail: 'Cacao · Lyon · France' },
        { logo: '/goutte-de-the-logo.png', name: 'Goutte de Thé', detail: 'Herbal teas & infusions' },
        { logo: '/gaia-torrefacteur-logo.png', name: 'Gaia Torréfacteur', detail: 'Specialty coffee · France' },
      ],
    },
    quote: {
      label: '06 — Let’s talk',
      title: 'Make',
      titleAccent: 'room',
      titleEnd: 'for good coffee.',
      description: 'A few details are enough to get started. We will get back to you within two business days.',
      nameLabel: 'Your name / company *',
      namePlaceholder: 'e.g. Camille, Maison Parallèle',
      emailLabel: 'Email *',
      emailPlaceholder: 'camille@yourcompany.com',
      dateLabel: 'Event date *',
      guestsLabel: 'Number of guests',
      guestsPlaceholder: 'Around 120',
      projectLabel: 'Your project',
      projectPlaceholder: 'Trade show, wedding, launch… tell us about it.',
      submit: 'Send your request',
      sending: 'Sending…',
      successTitle: 'Noted.',
      successCopy: 'Your request is on our workbench. We will be in touch very soon to imagine the right format.',
      another: 'Make another request',
      errors: {
        required: 'Please add your name, email and event date.',
        email: 'This email address seems incomplete.',
        send: 'Something went wrong. Please try again or email us directly.',
      },
    },
    footer: {
      contact: 'Contact',
      copyright: '© {year} L’Atelier du Café · Paris',
      email: 'bonjourlatelierducafe@gmail.com',
      phone: '+33 (0)6 17 44 96 18',
    },
    meta: {
      title: 'L’Atelier du Café — Specialty coffee for weddings, corporate events and trade shows',
      description: 'Specialty coffee for weddings, corporate events, trade shows and exhibitions in Paris. A menu tailored to your needs.',
    },
  },
} as const;

type Copy = (typeof copy)[Language];

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: Copy } | null>(null);

function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageContext');
  return value;
}

function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div className="language-toggle flex items-center gap-1" role="group" aria-label={t.header.language}>
      {(['fr', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`language-option ${language === option ? 'language-option-active' : ''}`}
          aria-pressed={language === option}
          data-testid={`button-language-${option}`}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Anchor({ href, children, className = '', onClick }: { href: string; children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <a className="cursor-link font-mono uppercase tracking-[.16em] text-[16px]" href={href} onClick={onClick} data-testid={`link-${href.replace('#', '')}`}>
      {children}
    </a>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`flex shrink-0 items-center gap-3 sm:gap-4 ${light ? 'text-[#f1e5d4]' : 'text-[#182238]'}`} data-testid="link-logo">
      <img src="/atelier-du-cafe-logo.png" alt="L’Atelier du Café logo" className="h-10 w-10 shrink-0 object-contain sm:h-12 sm:w-12" />
      <span className="font-display text-[17px] leading-[.92] tracking-[-.04em] sm:text-[20px]">L’Atelier<br />du Caf<span className="text-[#c9a15a]">é</span></span>
    </a>
  );
}

function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="absolute left-0 right-0 top-0 z-40">
      <div className="section-wrap flex h-[104px] items-center justify-between gap-4 border-b border-[#d8cbb8]/50 text-[1px]">
        <Logo />
        <nav className="hidden items-center gap-5 lg:flex xl:gap-8" aria-label={t.header.mainNav}>
          {t.nav.map((item) => <Anchor href={item.href} key={item.href} className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[.14em]">{item.label}</Anchor>)}
        </nav>
        <div className="hidden shrink-0 items-center gap-5 lg:flex xl:gap-7">
          <LanguageToggle />
          <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[.14em] text-[#5a6067] xl:inline">{t.header.location}</span>
          <Anchor href="#contact" className="group flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[.14em]">
            {t.header.quote} <ArrowUpRight size={14} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Anchor>
        </div>
        <div className="flex shrink-0 items-center gap-4 lg:hidden">
          <LanguageToggle />
          <button type="button" className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? t.header.closeMenu : t.header.openMenu} aria-expanded={open} data-testid="button-mobile-menu">
          {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-[104px] border-b border-[#d8cbb8] bg-[#f2eadc] px-8 py-8 lg:hidden">
          <nav className="flex flex-col gap-5" aria-label={t.header.mobileNav}>
            {t.nav.map((item) => <Anchor href={item.href} key={item.href} className="font-display text-3xl" onClick={close}>{item.label}</Anchor>)}
            <Anchor href="#contact" className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.14em]" onClick={close}>{t.header.quote} <MoveRight size={16} /></Anchor>
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const { t } = useLanguage();
  return (
    <section id="top" className="relative min-h-[738px] overflow-hidden bg-[#e9dfcf] pt-[104px]">
      <div className="section-wrap grid min-h-[634px] items-end gap-10 pb-14 pt-14 md:grid-cols-[.88fr_1.12fr] md:pb-20 md:pt-24">
        <div className="relative z-10 max-w-[530px]">
          <p className="reveal mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.18em] text-[#b84e2e]"><span className="h-px w-8 bg-[#b84e2e]" /> {t.hero.kicker}</p>
          <h1 className="reveal delay-1 font-display text-[clamp(4.3rem,9.4vw,8.6rem)] leading-[.84] tracking-[-.075em] text-[#182238]">{t.hero.title}<br /><em className="text-[#b84e2e]">{t.hero.titleAccent}</em></h1>
          <p className="reveal delay-2 mt-8 max-w-[390px] text-[15px] leading-7 text-[#4d555d]">{t.hero.description}</p>
          <div className="reveal delay-3 mt-9 flex flex-wrap items-center gap-7">
            <Anchor href="#contact" className="btn-main inline-flex items-center gap-4 bg-[#b84e2e] px-5 py-3 font-mono text-[10px] uppercase tracking-[.14em] text-[#f7edde]">{t.hero.primary} <ArrowDownRight size={15} /></Anchor>
            <Anchor href="#atelier" className="line-arrow flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.14em] text-[#182238]">{t.hero.secondary} <MoveRight size={15} /></Anchor>
          </div>
        </div>
        <div className="relative h-[390px] overflow-hidden md:h-[520px]">
          <div className="media-frame absolute inset-0 overflow-hidden bg-[#172238]">
            <video className="absolute inset-0 z-0 h-full w-full object-cover" autoPlay muted loop playsInline poster="/atelier-dynamic-poster-v2.jpg" aria-label={t.hero.videoAlt}>
              <source src="/atelier-dynamic-loop-v2.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const { t } = useLanguage();
  const content = t.marquee;
  return <div className="marquee bg-[#182238] py-4 text-[#e9dfcf]"><div className="marquee-track font-mono text-[10px] uppercase tracking-[.2em]"><span>{content}</span><span>{content}</span></div></div>;
}

function AtelierSection() {
  const { t } = useLanguage();
  return (
    <section id="atelier" className="bg-[#f2eadc] py-24 md:py-36">
      <div className="section-wrap grid gap-16 md:grid-cols-[.75fr_1.25fr] md:gap-28">
        <div>
          <p className="mb-7 font-mono text-[10px] uppercase tracking-[.18em] text-[#b84e2e]">{t.atelier.label}</p>
          <h2 className="font-display text-[clamp(3rem,6.5vw,6.2rem)] leading-[.9] tracking-[-.06em] text-[#182238]">{t.atelier.title}<br /><span className="text-[#b84e2e]">{t.atelier.titleAccent}</span></h2>
        </div>
        <div className="max-w-[640px]">
          <p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.12] tracking-[-.035em] text-[#182238]">{t.atelier.lead}</p>
          <div className="mt-12 grid gap-8 border-t border-[#c9bba6] pt-7 md:grid-cols-2">
            <p className="text-[14px] leading-7 text-[#596068]">{t.atelier.bodyOne}</p>
            <p className="text-[14px] leading-7 text-[#596068]">{t.atelier.bodyTwo}</p>
          </div>
          <Anchor href="#methode" className="line-arrow mt-10 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#b84e2e]">{t.atelier.cta} <MoveRight size={15} /></Anchor>
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="a-propos" className="bg-[#e9dfcf] py-24 md:py-36">
      <div className="section-wrap grid gap-16 md:grid-cols-[.75fr_1.25fr] md:gap-28">
        <div>
          <p className="mb-7 font-mono text-[10px] uppercase tracking-[.18em] text-[#b84e2e]">{t.about.label}</p>
          <h2 className="font-display text-[clamp(3rem,6.5vw,6.2rem)] leading-[.9] tracking-[-.06em] text-[#182238]">{t.about.title}<br /><span className="text-[#b84e2e]">{t.about.titleAccent}</span></h2>
          <div className="mt-12 border-t border-[#c9bba6] pt-7">
            <p className="font-display text-[clamp(4rem,9vw,7.5rem)] leading-none tracking-[-.06em] text-[#182238]">{t.about.statValue}</p>
            <p className="mt-3 max-w-[220px] font-mono text-[10px] uppercase tracking-[.15em] text-[#596068]">{t.about.statLabel}</p>
          </div>
        </div>
        <div className="max-w-[640px]">
          <p className="font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-[1.12] tracking-[-.035em] text-[#182238]">{t.about.lead}</p>
          <div className="mt-12 grid gap-8 border-t border-[#c9bba6] pt-7 md:grid-cols-2">
            <p className="text-[14px] leading-7 text-[#596068]">{t.about.bodyOne}</p>
            <p className="text-[14px] leading-7 text-[#596068]">{t.about.bodyTwo}</p>
          </div>
          <Anchor href="#contact" className="line-arrow mt-10 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#b84e2e]">{t.hero.primary} <MoveRight size={15} /></Anchor>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const { t } = useLanguage();
  return (
    <section id="prestations" className="bg-[#d9e0dc] py-24 md:py-32">
      <div className="section-wrap">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><p className="mb-6 font-mono text-[10px] uppercase tracking-[.18em] text-[#39756e]">{t.services.label}</p><h2 className="font-display text-[clamp(3rem,6vw,6rem)] leading-[.88] tracking-[-.06em] text-[#182238]">{t.services.title}<br /><em>{t.services.titleAccent}</em></h2></div>
          <p className="max-w-[290px] text-[13px] leading-6 text-[#50645f]">{t.services.description}</p>
        </div>
        <div className="divide-y divide-[#a9bdb6] border-y border-[#a9bdb6]">
          {t.services.items.map((item) => (
            <article key={item.number} className="group grid gap-5 py-8 transition-[padding] duration-300 hover:px-3 md:grid-cols-[70px_1fr_1fr_auto] md:items-center md:gap-8 md:py-10" data-testid={`card-service-${item.number}`}>
              <span className="font-mono text-[11px] text-[#39756e]">{item.number}</span>
              <h3 className="font-display text-[clamp(2rem,4vw,3.7rem)] leading-none tracking-[-.045em] text-[#182238]">{item.title}</h3>
              <p className="max-w-[300px] text-[#50645f] text-[18px]">{item.text}</p>
              <div className="flex items-center justify-between gap-6 md:block md:text-right"><span className="font-mono text-[9px] uppercase tracking-[.13em] text-[#39756e]">{item.meta}</span><ArrowUpRight size={18} className="ml-auto transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:mt-5" strokeWidth={1.4} /></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  const { t } = useLanguage();
  return (
    <section id="methode" className="bg-[#182238] py-24 text-[#f1e5d4] md:py-36">
      <div className="section-wrap">
        <div className="grid gap-14 md:grid-cols-[.7fr_1.3fr]">
          <div><p className="mb-7 font-mono text-[10px] uppercase tracking-[.18em] text-[#d9794d]">{t.method.label}</p><h2 className="font-display text-[clamp(3rem,6vw,6rem)] leading-[.88] tracking-[-.06em]">{t.method.title}<br /><em className="text-[#d9794d]">{t.method.titleAccent}</em><br />{t.method.titleEnd}</h2></div>
          <div className="md:pt-16">{t.method.steps.map(([number, title, text]) => <div key={number} className="grid grid-cols-[45px_1fr] gap-4 border-t border-[#d1c3ad]/25 py-7 last:border-b md:grid-cols-[70px_150px_1fr] md:gap-7"><span className="font-mono text-[10px] text-[#d9794d]">{number}</span><h3 className="font-display text-2xl text-[#f1e5d4]">{title}</h3><p className="col-start-2 text-[13px] leading-6 text-[#bcb9b1] md:col-start-auto">{text}</p></div>)}</div>
        </div>
        <div className="mt-20 grid gap-5 md:grid-cols-[1.25fr_.75fr]">
          <div className="media-frame relative min-h-[260px] overflow-hidden bg-[#263750] md:min-h-[390px]">
            <video className="absolute inset-0 z-0 h-full w-full object-cover" autoPlay muted loop playsInline poster="/atelier-dynamic-poster-v2.jpg" aria-label={t.method.mediaAlt}><source src="/atelier-dynamic-loop-v2.mp4" type="video/mp4" /></video>
          </div>
          <div className="flex flex-col justify-between border border-[#d1c3ad]/25 p-7 md:p-9"><div><p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#d9794d]">{t.method.detailLabel}</p><p className="mt-7 font-display text-[2rem] leading-[1.05] tracking-[-.04em]">{t.method.detailCopy}</p></div></div>
        </div>
      </div>
    </section>
  );
}

function Cacao() {
  const { t } = useLanguage();
  return (
    <section id="journal" className="relative overflow-hidden bg-[#c66943] py-24 text-[#f8ead7] md:py-32">
      <div className="absolute -right-20 top-8 font-display text-[18rem] leading-none text-[#edc2a2]/20">02</div>
      <div className="section-wrap relative grid gap-14 md:grid-cols-[.8fr_1.2fr] md:items-end">
        <div><p className="mb-7 font-mono text-[10px] uppercase tracking-[.18em] text-[#182238]/70">{t.cacao.label}</p><h2 className="font-display text-[clamp(3.2rem,7vw,7rem)] leading-[.84] tracking-[-.07em] text-[#182238]">{t.cacao.title}<br /><em>{t.cacao.titleAccent}</em></h2></div>
        <div className="md:pb-3">
          <p className="max-w-[510px] font-display text-[clamp(1.7rem,3.2vw,2.8rem)] leading-[1.06] tracking-[-.045em] text-[#182238]">{t.cacao.body}</p>
          <ul className="mt-8 grid max-w-[510px] gap-3 border-t border-[#182238]/25 pt-6">
            {t.cacao.products.map((product) => (
              <li key={product} className="flex gap-3 font-mono text-[10px] uppercase leading-[1.5] tracking-[.12em] text-[#182238]/80">
                <span className="mt-[.42em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#182238]" aria-hidden="true" />
                <span>{product}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid max-w-[510px] gap-5 sm:grid-cols-3">
            {t.cacao.collaborators.map((collaborator) => (
              <div key={collaborator.name} className="border-t border-[#182238]/25 pt-4">
                <div className="flex h-14 w-full items-center justify-start">
                  <img src={collaborator.logo} alt={`${collaborator.name} logo`} className="max-h-14 w-full object-contain object-left" />
                </div>
                <span className="mt-4 block font-mono text-[10px] uppercase leading-[1.5] tracking-[.12em] text-[#182238]/75">{collaborator.name}<br />{collaborator.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Get a free access key at https://web3forms.com (enter bonjourlatelierducafe@gmail.com) —
// the key arrives by email in seconds, no account or password needed.
// Web3Forms says this key is not secret and is fine to leave in the source code.
const WEB3FORMS_ACCESS_KEY = '967b5bdf-77e2-4ef0-a14e-4785c369f6c5';

function QuoteForm() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const date = String(data.get('date') || '').trim();
    if (!name || !email || !date) { setError(t.quote.errors.required); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(t.quote.errors.email); return; }
    setError('');
    setSending(true);
    try {
      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'Nouvelle demande de devis — L’Atelier du Café',
        from_name: 'Site L’Atelier du Café',
        name,
        email,
        date,
        guests: String(data.get('guests') || '').trim(),
        message: String(data.get('message') || '').trim(),
      };
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || `Form submission failed (${response.status})`);
      setSent(true);
    } catch {
      setError(t.quote.errors.send);
    } finally {
      setSending(false);
    }
  };
  return (
    <section id="contact" className="bg-[#39756e] py-24 text-[#f1e5d4] md:py-32">
      <div className="section-wrap grid gap-16 md:grid-cols-[.83fr_1.17fr]">
        <div><p className="mb-7 font-mono text-[10px] uppercase tracking-[.18em] text-[#d9e0dc]">{t.quote.label}</p><h2 className="font-display text-[clamp(3.2rem,7vw,7rem)] leading-[.84] tracking-[-.07em]">{t.quote.title}<br /><em className="text-[#e8a875]">{t.quote.titleAccent}</em><br />{t.quote.titleEnd}</h2><p className="mt-9 max-w-[300px] text-[13px] leading-6 text-[#d6e0d9]">{t.quote.description}</p><div className="mt-12 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[.12em] text-[#d6e0d9]"><a href={`mailto:${t.footer.email}`} className="cursor-link hover:text-[#e8a875]" data-testid="link-email">{t.footer.email}</a><a href={`tel:${t.footer.phone.replace('(0)', '').replace(/[^\d+]/g, '')}`} className="cursor-link hover:text-[#e8a875]" data-testid="link-phone">{t.footer.phone}</a></div></div>
        <div className="md:pt-14">
          {sent ? (
            <div className="border border-[#d6e0d9]/40 p-8 md:p-12" role="status" data-testid="status-quote-success"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8a875] text-[#182238]"><Check size={22} /></div><h3 className="mt-8 font-display text-4xl">{t.quote.successTitle}</h3><p className="mt-4 max-w-[370px] text-[14px] leading-7 text-[#d6e0d9]">{t.quote.successCopy}</p><button type="button" onClick={() => setSent(false)} className="mt-9 font-mono text-[10px] uppercase tracking-[.16em] text-[#e8a875] underline underline-offset-4" data-testid="button-new-request">{t.quote.another}</button></div>
          ) : (
            <form name="quote" onSubmit={handleSubmit} noValidate className="border-t border-[#d6e0d9]/35" data-testid="form-quote">
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
              <label className="block border-b border-[#d6e0d9]/35 py-5"><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#d6e0d9]/75">{t.quote.nameLabel}</span><input name="name" className="form-field text-[15px]" placeholder={t.quote.namePlaceholder} data-testid="input-name" /></label>
              <label className="block border-b border-[#d6e0d9]/35 py-5"><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#d6e0d9]/75">{t.quote.emailLabel}</span><input name="email" type="email" className="form-field text-[15px]" placeholder={t.quote.emailPlaceholder} data-testid="input-email" /></label>
              <div className="grid gap-0 sm:grid-cols-2 sm:gap-8"><label className="block border-b border-[#d6e0d9]/35 py-5"><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#d6e0d9]/75">{t.quote.dateLabel}</span><input name="date" type="date" className="form-field text-[15px]" data-testid="input-date" /></label><label className="block border-b border-[#d6e0d9]/35 py-5"><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#d6e0d9]/75">{t.quote.guestsLabel}</span><input name="guests" type="number" min="1" className="form-field text-[15px]" placeholder={t.quote.guestsPlaceholder} data-testid="input-guests" /></label></div>
              <label className="block border-b border-[#d6e0d9]/35 py-5"><span className="font-mono text-[9px] uppercase tracking-[.15em] text-[#d6e0d9]/75">{t.quote.projectLabel}</span><textarea name="message" rows={3} className="form-field resize-none text-[15px]" placeholder={t.quote.projectPlaceholder} data-testid="input-message" /></label>
              {error && <p className="mt-5 text-[12px] text-[#ffd0b0]" role="alert" data-testid="status-quote-error">{error}</p>}
              <button type="submit" disabled={sending} className="btn-main mt-8 flex items-center gap-5 bg-[#e8a875] px-6 py-4 font-mono text-[10px] uppercase tracking-[.15em] text-[#182238] disabled:opacity-60" data-testid="button-submit-quote">{sending ? t.quote.sending : t.quote.submit} <ArrowUpRight size={16} /></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLanguage();
  return <footer className="bg-[#182238] py-10 text-[#f1e5d4]"><div className="section-wrap flex flex-col gap-8 md:flex-row md:items-end md:justify-between"><Logo light /><div className="flex flex-col gap-3 text-left md:items-end"><div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[.13em] text-[#bcb9b1]"><Anchor href="#atelier">{t.nav[0].label}</Anchor><Anchor href="#prestations">{t.nav[1].label}</Anchor><Anchor href="#contact">{t.footer.contact}</Anchor><a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="link-instagram"><Instagram size={15} /></a></div><p className="font-mono text-[9px] uppercase tracking-[.13em] text-[#747c87]">{t.footer.copyright.replace('{year}', String(new Date().getFullYear()))}</p></div></div></footer>;
}

function Home() {
  const { language, t } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.meta.title;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t.meta.description);
  }, [language, t]);
  return <div className="site-shell noise min-h-[100dvh] overflow-x-hidden" id="page"><Header /><main><Hero /><Marquee /><AtelierSection /><AboutSection /><Services /><Method /><Cacao /><QuoteForm /></main><Footer /></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'fr';
    return window.localStorage.getItem('atelier-language') === 'en' ? 'en' : 'fr';
  });
  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem('atelier-language', nextLanguage);
  };
  const t = copy[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <RoutedErrorBoundary><Router /></RoutedErrorBoundary>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageContext.Provider>
  );
}

export default App;