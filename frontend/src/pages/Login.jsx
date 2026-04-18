import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      nav('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur de connexion');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>🎓 Plateforme ENSA</h2>
        <p style={s.sub}>Beni Mellal — Espace Étudiant</p>
        <input placeholder="Email" style={s.input}
          onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Mot de passe" style={s.input}
          onChange={e => setForm({...form, password: e.target.value})} />
        {error && <p style={{color:'red',fontSize:13}}>{error}</p>}
        <button onClick={login} style={s.btn}>Se connecter</button>
        <p style={{textAlign:'center',marginTop:12,fontSize:13}}>
          Pas de compte ? <Link to="/register">S'inscrire</Link>
        </p>
        <p style={{textAlign:'center',fontSize:12,color:'#999',marginTop:8}}>
          <Link to="/admin-login">Accès Administrateur</Link>
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
  title: {textAlign:'center',margin:0,color:'#1d4ed8'},
  sub: {textAlign:'center',color:'#888',marginBottom:24},
  input: {width:'100%',padding:12,margin:'8px 0',borderRadius:8,
          border:'1px solid #ddd',fontSize:14,boxSizing:'border-box'},
  btn: {width:'100%',padding:12,background:'#1d4ed8',color:'white',
        border:'none',borderRadius:8,cursor:'pointer',fontSize:16,marginTop:8}
};