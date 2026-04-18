import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const couleurs = {
  en_attente:'#f59e0b',en_cours:'#3b82f6',
  validee:'#10b981',rejetee:'#ef4444'
};

export default function AdminPanel() {
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState({});
  const [selected, setSelected] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const nav = useNavigate();
  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats', { headers })
      .then(r => setStats(r.data)).catch(console.error);
    axios.get('http://localhost:5000/api/admin/demandes', { headers })
      .then(r => setDemandes(r.data)).catch(console.error);
  }, []);

  const traiter = async (id, statut) => {
    await axios.put(`http://localhost:8080/api/admin/demandes/${id}`,
      { statut, commentaire_admin: commentaire }, { headers });
    setDemandes(prev => prev.map(d =>
      d.id === id ? {...d, statut, commentaire_admin: commentaire} : d));
    setSelected(null);
    setCommentaire('');
  };

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8'}}>
      <div style={{background:'#0f172a',color:'white',padding:'16px 32px',
                   display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{margin:0}}>🛡️ Espace Administrateur — ENSA</h2>
        <button onClick={() => {localStorage.removeItem('adminToken'); nav('/admin-login');}}
          style={{padding:'8px 16px',background:'#ef4444',color:'white',
                  border:'none',borderRadius:8,cursor:'pointer'}}>Déconnexion</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',
                   gap:16,padding:32,maxWidth:1100,margin:'0 auto'}}>
        {[
          {label:'Total',value:stats.total,color:'#3b82f6'},
          {label:'En attente',value:stats.attente,color:'#f59e0b'},
          {label:'Validées',value:stats.validees,color:'#10b981'},
          {label:'Rejetées',value:stats.rejetees,color:'#ef4444'},
        ].map((s,i) => (
          <div key={i} style={{background:'white',padding:24,borderRadius:12,
                               textAlign:'center',borderTop:`4px solid ${s.color}`,
                               boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
            <div style={{fontSize:36,fontWeight:'bold',color:s.color}}>{s.value ?? 0}</div>
            <div style={{color:'#666',fontSize:13}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{padding:'0 32px 32px',maxWidth:1100,margin:'0 auto'}}>
        <div style={{background:'white',borderRadius:12,overflow:'hidden',
                     boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#0f172a',color:'white'}}>
                {['Étudiant','Email','Type','Date','Statut','Action'].map(h => (
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:13}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demandes.map((d,i) => (
                <>
                  <tr key={d.id} style={{borderBottom:'1px solid #eee',
                                         background:i%2===0?'#fafafa':'white'}}>
                    <td style={{padding:'12px 16px',fontSize:13}}>
                      <strong>{d.prenom} {d.nom}</strong>
                    </td>
                    <td style={{padding:'12px 16px',fontSize:12,color:'#666'}}>{d.email}</td>
                    <td style={{padding:'12px 16px',fontSize:13,textTransform:'capitalize'}}>
                      {d.type_demande.replace('_',' ')}
                    </td>
                    <td style={{padding:'12px 16px',fontSize:12}}>
                      {new Date(d.date_soumission).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{background:couleurs[d.statut],color:'white',
                                    padding:'3px 10px',borderRadius:20,
                                    fontSize:11,fontWeight:'bold'}}>
                        {d.statut.replace('_',' ')}
                      </span>
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <button onClick={() => setSelected(selected===d.id?null:d.id)}
                        style={{padding:'6px 12px',background:'#1d4ed8',color:'white',
                                border:'none',borderRadius:6,cursor:'pointer',fontSize:12}}>
                        Traiter
                      </button>
                    </td>
                  </tr>
                  {selected === d.id && (
                    <tr key={`edit-${d.id}`}>
                      <td colSpan={6} style={{padding:16,background:'#f0f9ff'}}>
                        <textarea placeholder="Commentaire pour l'étudiant..." rows={2}
                          style={{width:'100%',padding:8,borderRadius:6,
                                  border:'1px solid #ddd',marginBottom:8,boxSizing:'border-box'}}
                          onChange={e => setCommentaire(e.target.value)} />
                        <div style={{display:'flex',gap:8}}>
                          {[
                            {label:'✓ Valider',statut:'validee',color:'#10b981'},
                            {label:'⏳ En cours',statut:'en_cours',color:'#3b82f6'},
                            {label:'✗ Rejeter',statut:'rejetee',color:'#ef4444'},
                          ].map(btn => (
                            <button key={btn.statut}
                              onClick={() => traiter(d.id, btn.statut)}
                              style={{padding:'8px 16px',background:btn.color,
                                      color:'white',border:'none',
                                      borderRadius:6,cursor:'pointer',fontSize:13}}>
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {demandes.length === 0 && (
            <p style={{textAlign:'center',color:'#888',padding:40}}>
              Aucune demande pour le moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}