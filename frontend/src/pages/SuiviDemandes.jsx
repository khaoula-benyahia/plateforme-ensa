import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const couleurs = {
  en_attente:'#f59e0b',en_cours:'#3b82f6',
  validee:'#10b981',rejetee:'#ef4444'
};

export default function SuiviDemandes() {
  const [demandes, setDemandes] = useState([]);
  const nav = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8080/api/demandes/mes-demandes',
      { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setDemandes(r.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8'}}>
      <div style={{background:'white',padding:'16px 32px',
                   display:'flex',alignItems:'center',gap:24,
                   boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
        <button onClick={() => nav('/dashboard')}
          style={{background:'none',border:'none',cursor:'pointer',color:'#1d4ed8'}}>
          ← Dashboard
        </button>
        <h2 style={{margin:0}}>📋 Mes Demandes</h2>
      </div>
      <div style={{padding:32,maxWidth:700,margin:'0 auto'}}>
        {demandes.length === 0 ? (
          <p style={{textAlign:'center',color:'#888',marginTop:40}}>
            Aucune demande pour le moment.
          </p>
        ) : demandes.map(d => (
          <div key={d.id} style={{background:'white',padding:24,borderRadius:12,
                                   marginBottom:16,boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 style={{margin:0,textTransform:'capitalize'}}>
                {d.type_demande.replace('_',' ')}
              </h3>
              <span style={{background:couleurs[d.statut],color:'white',
                            padding:'4px 12px',borderRadius:20,fontSize:12,fontWeight:'bold'}}>
                {d.statut.replace('_',' ')}
              </span>
            </div>
            <p style={{color:'#666',margin:'8px 0'}}>{d.description}</p>
            <p style={{color:'#999',fontSize:12}}>
              Soumis le : {new Date(d.date_soumission).toLocaleDateString('fr-FR')}
            </p>
            {d.commentaire_admin && (
              <p style={{background:'#f0f9ff',padding:8,borderRadius:8,fontSize:13,margin:0}}>
                💬 Admin : {d.commentaire_admin}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}