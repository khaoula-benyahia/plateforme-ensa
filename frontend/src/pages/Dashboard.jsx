import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const logout = () => { localStorage.clear(); nav('/'); };

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8'}}>
      <div style={{background:'#1d4ed8',color:'white',padding:'16px 32px',
                   display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{margin:0}}>🎓 Plateforme ENSA Beni Mellal</h2>
        <div>
          <span style={{marginRight:16}}>Bonjour, {user.prenom} {user.nom}</span>
          <button onClick={logout} style={{padding:'8px 16px',background:'rgba(255,255,255,0.2)',
            color:'white',border:'none',borderRadius:8,cursor:'pointer'}}>Déconnexion</button>
        </div>
      </div>
      <div style={{padding:40,maxWidth:800,margin:'0 auto'}}>
        <h3>Que souhaitez-vous faire ?</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:24}}>
          <div onClick={() => nav('/nouvelle-demande')}
            style={{background:'white',padding:40,borderRadius:16,textAlign:'center',
                    cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize:48,marginBottom:12}}>📝</div>
            <h3>Nouvelle Demande</h3>
            <p style={{color:'#666'}}>Déposez une demande administrative</p>
          </div>
          <div onClick={() => nav('/suivi')}
            style={{background:'white',padding:40,borderRadius:16,textAlign:'center',
                    cursor:'pointer',boxShadow:'0 4px 16px rgba(0,0,0,0.1)'}}>
            <div style={{fontSize:48,marginBottom:12}}>📋</div>
            <h3>Mes Demandes</h3>
            <p style={{color:'#666'}}>Suivez vos demandes en cours</p>
          </div>
        </div>
      </div>
    </div>
  );
}