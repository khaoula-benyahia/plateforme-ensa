import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ nom:'', prenom:'', email:'', password:'' });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const register = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/register', form);
      setMsg('✅ Inscription réussie ! Connectez-vous.');
      setTimeout(() => nav('/'), 2000);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.error || 'Erreur'));
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>📝 Inscription</h2>
        <input placeholder="Nom" style={s.input}
          onChange={e => setForm({...form, nom: e.target.value})} />
        <input placeholder="Prénom" style={s.input}
          onChange={e => setForm({...form, prenom: e.target.value})} />
        <input placeholder="Email" style={s.input}
          onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Mot de passe" style={s.input}
          onChange={e => setForm({...form, password: e.target.value})} />
        {msg && <p style={{textAlign:'center',fontSize:13}}>{msg}</p>}
        <button onClick={register} style={s.btn}>S'inscrire</button>
        <p style={{textAlign:'center',marginTop:12,fontSize:13}}>
          Déjà un compte ? <Link to="/">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {display:'flex',justifyContent:'center',alignItems:'center',
         height:'100vh',background:'linear-gradient(135deg,#1d4ed8,#0f172a)'},
  card: {background:'white',padding:40,borderRadius:16,
         boxShadow:'0 8px 32px rgba(0,0,0,0.2)',width:360},
  title: {textAlign:'center',margin:'0 0 16px',color:'#1d4ed8'},
  input: {width:'100%',padding:12,margin:'8px 0',borderRadius:8,
          border:'1px solid #ddd',fontSize:14,boxSizing:'border-box'},
  btn: {width:'100%',padding:12,background:'#1d4ed8',color:'white',
        border:'none',borderRadius:8,cursor:'pointer',fontSize:16,marginTop:8}
};