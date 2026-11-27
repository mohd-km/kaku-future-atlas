import React from 'react';
import ReactDOM from 'react-dom/client';
import './shell/shell.css';
import { Shell, type ShellConfig } from './shell/Shell';
import DefaultTab from './modules/kaku/Module';

const config: ShellConfig = {
  pillar: 'worldview & physics',
  title: 'Civilization & Futures Atlas',
  subtitle:
    'Four interactive lessons on how much energy humanity uses, how fast computers grow, how 13.8 billion years of history fit on one screen, and what speed and gravity do to time.',
  footer: 'Civilization & Futures Atlas · runs entirely in your browser · Mohammed KM',
  tabs: [
    {
      id: 'kardashev', label: 'Energy scale', sub: 'how much power we use, and what it unlocks', scope: 'kaku',
      provenance: [
        { kind: 'real', label: '2023 world energy use' },
        { kind: 'real', label: 'Kardashev rating formula' },
        { kind: 'model', label: 'which technology needs how much energy' },
      ],
      story: {
        problem:
          'How advanced is our civilisation, measured in physics rather than opinion? The Kardashev scale rates a civilisation by how much energy it uses: Type I uses all the energy reaching its planet, Type II all of its star, Type III all of its galaxy.',
        how:
          "Humanity used about 19.6 TW in 2023 (TW: a trillion watts, steady power), which works out to Type 0.73. Each whole step up is 10 billion times more power, so Type I needs roughly 500 times what we use today. Mix the energy sources below and the rating updates live.",
        tryThis:
          'Drag "Fossil fuels" to 0%: the rating falls from 0.73 to about 0.66, because most of today\'s power is still fossil. Then press "Type I (1.00)": the planet grows rings of orbiting solar collectors and 3 of the 7 future technologies switch on.',
        terms: [
          ['Type 0.73', 'our current rating; the decimal says how far we are between Type 0 and Type I'],
          ['Log-scale slider', 'each notch multiplies the power instead of adding to it, so watts to galaxies fit on one slider'],
          ['Dyson swarm', 'a cloud of solar collectors orbiting a star to catch its light'],
          ['Class I, II, III', 'how impossible an idea is: I breaks no law of physics, II is at the edge of known physics, III breaks a law'],
        ],
      },
      component: DefaultTab,
      load: () => import('./modules/kaku/Module'),
    },
    {
      id: 'singularity', label: 'Computing future', sub: 'how fast computers grow, and the hard limit', scope: 'singularity',
      provenance: [
        { kind: 'real', label: 'historical computer speed per dollar' },
        { kind: 'real', label: 'physics limit on computing' },
        { kind: 'model', label: 'projection after 2025' },
      ],
      story: {
        problem:
          'Computers keep getting faster for the same money. When does a $1,000 machine match a human brain, and is there a ceiling that no engineering can ever break?',
        how:
          'The chart stacks six generations of computer hardware, each one taking over when the last hits a wall. The ceiling is the Seth Lloyd limit: the most computing any lump of matter could ever do, about 5.4 × 10^50 operations a second for 1 kg, set by quantum physics and E = mc².',
        tryThis:
          'Drag "Hardware price-performance doubling time" from 1.5 to 3 years: the year a $1,000 computer matches a brain jumps from about 2035 to about 2045.',
        terms: [
          ['cps', 'calculations per second, how much work a computer (or brain) does each second'],
          ['10^16', '1 followed by 16 zeros; each step on these axes is 10 times bigger than the last'],
          ['Doubling time', 'how many years it takes for the same money to buy twice the computing'],
          ['Qubit', 'a quantum bit; each extra one doubles the memory a normal computer needs to copy it'],
        ],
      },
      load: () => import('./modules/singularity/Module'),
    },
    {
      id: 'history', label: 'Big history', sub: 'Big Bang to today on one screen', scope: 'history',
      provenance: [
        { kind: 'real', label: 'published dates and historical energy-use estimates' },
        { kind: 'model', label: 'resilience simulation' },
      ],
      story: {
        problem:
          'How do you show the Big Bang, the dinosaurs and the internet on one line when they are billions of years apart? On an ordinary timeline, all of recorded history would be thinner than a hair.',
        how:
          'The timeline uses a log scale: each step on the axis is 10 times further back in time, so billions of years and the last century fit on one screen. Below it, a simple model shows how energy per person, openness and shocks decide whether a society grows or collapses.',
        tryThis:
          'Press the "Industrial" button to zoom into the industrial era (1750 to 1950). On a straight timeline those 200 years would be 0.0000014% of the width; on this axis they already take up over 5% of the full view.',
        terms: [
          ['Gya / Mya / kya', 'billion / million / thousand years ago'],
          ['10^6 y', 'a million years ago; each tick is 10 times further back than the one to its right'],
          ['Energy capture', 'food plus fuel energy used per person per day, in kilocalories (kcal)'],
          ['Resilience score', 'a 0 to 100 estimate from this model of how well a society absorbs shocks; higher is sturdier'],
        ],
      },
      load: () => import('./modules/history/Module'),
    },
    {
      id: 'cosmos', label: 'Speed, gravity & time', sub: 'relativity, black holes, the four forces', scope: 'cosmos',
      provenance: [{ kind: 'model', label: 'standard physics equations and official constants (CODATA)' }],
      story: {
        problem:
          'Why do astronauts age a little slower, and what happens to time near a black hole? And why do physicists think the forces of nature were once a single force?',
        how:
          'Moving very fast makes your clock run slower compared with people at rest (Lorentz time dilation), and strong gravity does the same. Every number here comes from the real equations. The second part shows how the strengths of three forces change with collision energy and nearly meet at one point.',
        tryThis:
          'Press the "0.866c (2x)" speed button: the time stretch factor (γ) becomes 2, so the traveller\'s clock ticks once for every two ticks back home.',
        terms: [
          ['c', 'the speed of light, 299,792 km per second; 0.5c means half of that'],
          ['Light-year', 'the distance light travels in one year, about 9.46 trillion km; a distance, not a time'],
          ['Redshift', 'light stretched to redder colours, by expanding space or by climbing out of strong gravity; the same slowing of time, seen as colour'],
          ['Event horizon', 'the edge of a black hole; past it, not even light can escape'],
          ['GeV', 'a unit of particle energy; 1 GeV is about the energy locked in one proton\'s mass'],
        ],
      },
      load: () => import('./modules/cosmos/Module'),
    },
  ],
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell config={config} />
  </React.StrictMode>,
);
