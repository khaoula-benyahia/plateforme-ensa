import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NouvelleDemande() {
  const [form, setForm] = useState({ type_demande:'attestation', description:'' });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();
  const token = localStorage.getItem('token');

  const soumettre = async () => {
    try {
      await axios.post('http://localhost:8080/api/demandes', form,
        { headers: { Authorization: `Bearer ${token}` } });
      setMsg('✅ Demande soumise avec succès !');
      setTimeout(() => nav('/suivi'), 2000);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Erreur'));
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',display:'flex',
                 justifyContent:'center',alignItems:'center'}}>
      <div style={{background:'white',padding:40,borderRadius:16,width:500,
                   boxShadow:'0 4px 16px rgba(0,0,0,0.1)'}}>
        <button onClick={() => nav('/dashboard')}
          style={{background:'none',border:'none',cursor:'pointer',
                  color:'#1d4ed8',fontSize:14,marginBottom:16}}>← Retour</button>
        <h2>📝 Nouvelle Demande</h2>
        <label style={{display:'block',fontWeight:'bold',marginTop:16,marginBottom:4}}>
          Type de demande
        </label>
        <select style={s.input}
          onChange={e => setForm({...form, type_demande: e.target.value})}>
          <option value="attestation">Attestation de scolarité</option>
          <option value="releve_notes">Relevé de notes</option>
          <option value="stage">Convention de stage</option>
          <option value="autre">Autre</option>
        </select>
        <label style={{display:'block',fontWeight:'bold',marginTop:16,marginBottom:4}}>
          Description
        </label>
        <textarea rows={5} style={s.input} placeholder="Décrivez votre demande..."
          onChange={e => setForm({...form, description: e.target.value})} />
        {msg && <p>{msg}</p>}
        <button onClick={soumettre} style={s.btn}>Envoyer la demande</button>
      </div>
    </div>
  );
}

const s = {
  input: {width:'100%',padding:12,borderRadius:8,border:'1px solid #ddd',
          fontSize:14,boxSizing:'border-box'},
  btn: {width:'100%',padding:12,background:'#1d4ed8',color:'white',
        border:'none',borderRadius:8,cursor:'pointer',fontSize:16,marginTop:16}
};