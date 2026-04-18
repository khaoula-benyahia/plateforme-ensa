import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/admin-login', form);
      localStorage.setItem('adminToken', res.data.token);
      nav('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur');
    }
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',
                 height:'100vh',background:'#0f172a'}}>
      <div style={{background:'white',padding:40,borderRadius:16,width:360}}>
        <h2 style={{textAlign:'center',color:'#0f172a',marginBottom:4}}>🛡️ Administration</h2>
        <p style={{textAlign:'center',color:'#888',marginBottom:24}}>ENSA Beni Mellal</p>
        <input placeholder="Email admin" style={s.input}
          onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Mot de passe" style={s.input}
          onChange={e => setForm({...form, password: e.target.value})} />
        {error && <p style={{color:'red',fontSize:13,textAlign:'center'}}>{error}</p>}
        <button onClick={login} style={{...s.input,background:'#0f172a',
          color:'white',cursor:'pointer',fontWeight:'bold',marginTop:8}}>
          Connexion Admin
        </button>
      </div>
    </div>
  );
}

const s = {
  input:{width:'100%',padding:12,margin:'8px 0',borderRadius:8,
         border:'1px solid #ddd',fontSize:14,boxSizing:'border-box'}
};