import './styles.css';
import './module.css';
import KardashevLab from './KardashevLab.jsx';

export default function KardashevModule() {
  return (
    <div className="mod-wrap">
      <div className="mod-head">
        <h2 className="section-title">planetary energy budget builder</h2>
        <p className="section-lead">Start from the world's real 2023 energy mix, cut fossil fuels or grow clean sources, and watch the Kardashev rating move.</p>
      </div>
      <KardashevLab />
    </div>
  );
}
