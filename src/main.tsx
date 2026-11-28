import React from 'react';
import ReactDOM from 'react-dom/client';
import './shell/shell.css';
import { Shell, type ShellConfig } from './shell/Shell';
import DefaultTab from './modules/kaku/Module';

const config: ShellConfig = {
  pillar: 'worldview & physics',
  title: "Exponential Futures Atlas",
  subtitle:
    "Two interactive lessons on where civilisation is heading: how much energy humanity uses and what more energy would unlock, and how fast computers grow towards the hard limit set by physics.",
  footer: "Exponential Futures Atlas · runs entirely in your browser · Mohammed KM",
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
  ],
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Shell config={config} />
  </React.StrictMode>,
);
