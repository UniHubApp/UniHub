import React, { useState, useEffect, useRef } from 'react';
import { Home, List, MapPin, Users, MessageCircle, CheckCircle, Navigation, Award, BookOpen, Star, Send, Camera, Plus, Trash2, Share, PlusSquare } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState(3);
  const [currentView, setCurrentView] = useState('home');
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [toast, setToast] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Check if it's iOS and not already installed
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
    
    // Support for Android (beforeinstallprompt)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      // Show prompt on Android
      if (!isStandalone) {
        setShowInstallPrompt(true);
      }
    });

    // Show prompt immediately if on iOS and not standalone
    if (isIOS && !isStandalone) {
      setShowInstallPrompt(true);
    }
  }, []);

  useEffect(() => {
    const savedProfile = localStorage.getItem('unihub_profile');
    const savedCredits = localStorage.getItem('unihub_credits');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsFirstLaunch(false);
    }
    
    if (savedCredits) {
      setCredits(parseInt(savedCredits, 10));
    } else {
      localStorage.setItem('unihub_credits', '3');
    }
  }, []);

  const saveProfile = (newProfile) => {
    localStorage.setItem('unihub_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setIsFirstLaunch(false);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView profile={profile} credits={credits} />;
      case 'bacheca': return <BachecaView showToast={showToast} profile={profile} />;
      case 'mappa': return <MappaView showToast={showToast} />;
      case 'tutoring': return <TutoringView credits={credits} showToast={showToast} />;
      case 'chat': return <ChatView />;
      default: return <HomeView profile={profile} credits={credits} />;
    }
  };

  return (
    <div className="app-container">
      {toast && (
        <div className="toast">
          <CheckCircle size={20} />
          {toast}
        </div>
      )}
      
      {isFirstLaunch ? (
        <main className="main-content">
          <ProfileSetup onSave={saveProfile} />
        </main>
      ) : (
        <>
          <header className="app-header">
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>UniHub</h1>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{profile.university}</div>
            </div>
            <div className="credit-badge">
              <Award size={18} color="#20B2AA" />
              <span>{credits} CR</span>
            </div>
          </header>

          <main className="main-content">
            {renderView()}
          </main>

          <nav className="bottom-nav">
            <NavItem icon={<Home />} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
            <NavItem icon={<List />} label="Annunci" active={currentView === 'bacheca'} onClick={() => setCurrentView('bacheca')} />
            <NavItem icon={<MapPin />} label="Mappa" active={currentView === 'mappa'} onClick={() => setCurrentView('mappa')} />
            <NavItem icon={<Users />} label="Tutor" active={currentView === 'tutoring'} onClick={() => setCurrentView('tutoring')} />
            <NavItem icon={<MessageCircle />} label="Chat" active={currentView === 'chat'} onClick={() => setCurrentView('chat')} />
          </nav>
        </>
      )}

      {showInstallPrompt && (
        <div className="install-prompt-overlay" onClick={() => setShowInstallPrompt(false)}>
          <div className="install-prompt-card" onClick={e => e.stopPropagation()}>
            <div className="install-prompt-icon-container">
              <div className="install-prompt-icon">
                <Home size={38} />
              </div>
            </div>
            
            <div className="install-prompt-title">
              <h3>Installa UniHub</h3>
              <p>Aggiungi l'app alla schermata home per un'esperienza fluida e veloce.</p>
            </div>
            
            <div className="install-steps">
              <div className="install-step">
                <div className="step-icon"><Share size={18} /></div>
                <span>Tocca l'icona <strong>Condividi</strong> o i <strong>tre puntini</strong></span>
              </div>
              <div className="install-step">
                <div className="step-icon"><PlusSquare size={18} /></div>
                <span>Seleziona <strong>Aggiungi alla schermata Home</strong></span>
              </div>
            </div>

            <button className="close-prompt-btn" onClick={() => setShowInstallPrompt(false)}>
              Ho capito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </button>
);

const ProfileSetup = ({ onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    department: '',
    degree: '',
    photo: null,
    exams: []
  });
  
  const [currentExam, setCurrentExam] = useState({ name: '', grade: '' });
  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addExam = () => {
    if (currentExam.name && currentExam.grade) {
      setFormData({
        ...formData,
        exams: [...formData.exams, { ...currentExam, id: Date.now() }]
      });
      setCurrentExam({ name: '', grade: '' });
    }
  };

  const removeExam = (id) => {
    setFormData({
      ...formData,
      exams: formData.exams.filter(e => e.id !== id)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.university) {
      onSave(formData);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Il tuo Profilo</h1>
        <p className="text-muted">Completa i dati per iniziare</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Foto Profilo */}
          <div className="photo-upload-wrapper">
            {formData.photo ? (
              <img src={formData.photo} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar">
                {formData.name ? formData.name[0].toUpperCase() : '?'}
              </div>
            )}
            <div className="photo-upload-btn" onClick={() => fileInputRef.current.click()}>
              <Camera size={16} />
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="photo-input" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Nome e Cognome *</label>
            <input required type="text" className="input-field" placeholder="Es. Mario Rossi" 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Università *</label>
            <input required type="text" className="input-field" placeholder="Es. Politecnico di Milano" 
              value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Dipartimento (Facoltativo)</label>
            <input type="text" className="input-field" placeholder="Es. Ingegneria dell'Informazione" 
              value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
          </div>
          <div className="input-group">
            <label className="input-label">Corso di Laurea (Facoltativo)</label>
            <input type="text" className="input-field" placeholder="Es. Ingegneria Informatica" 
              value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} />
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
          
          <label className="input-label">Esami Sostenuti (Facoltativo)</label>
          
          {formData.exams.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              {formData.exams.map(exam => (
                <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-color)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exam.name}</div>
                    <div className="badge">{exam.grade}/30</div>
                  </div>
                  <button type="button" onClick={() => removeExam(exam.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="text" className="input-field" placeholder="Materia" style={{ flex: 2 }}
              value={currentExam.name} onChange={(e) => setCurrentExam({...currentExam, name: e.target.value})} />
            <input type="number" min="18" max="31" className="input-field" placeholder="Voto" style={{ flex: 1 }}
              value={currentExam.grade} onChange={(e) => setCurrentExam({...currentExam, grade: e.target.value})} />
            <button type="button" className="btn btn-outline" style={{ width: 'auto', padding: '0.75rem' }} onClick={addExam}>
              <Plus size={20} />
            </button>
          </div>

          <button type="submit" className="btn btn-primary">
            Salva Profilo
          </button>
        </form>
      </div>
    </div>
  );
};

const HomeView = ({ profile, credits }) => {
  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?';
  const examsCount = profile.exams ? profile.exams.length : 0;
  
  return (
    <div className="container animate-fade-in">
      <div className="card" style={{ textAlign: 'center', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="profile-avatar" />
          ) : (
            <div className="profile-avatar">{initials}</div>
          )}
        </div>
        <h2 className="title" style={{ marginBottom: '0.25rem' }}>{profile.name}</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
          {profile.degree || 'Studente'} • {profile.university}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-navy)' }}>{credits}</div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>Crediti Disp.</div>
          </div>
          <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', flex: 1 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-navy)' }}>{examsCount}</div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>Esami Dati</div>
          </div>
        </div>
      </div>

      {profile.exams && profile.exams.length > 0 && (
        <>
          <h3 className="subtitle" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>Libretto (Ultimi Esami)</h3>
          <div className="card">
            {profile.exams.slice(-3).reverse().map(exam => (
              <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 600 }}>{exam.name}</div>
                <div className="badge">{exam.grade === '31' ? '30L' : exam.grade}/30</div>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="subtitle" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>Le tue attività</h3>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: '#E0F2FE', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-navy)', flexShrink: 0 }}>
          <BookOpen size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ripetizioni di Analisi 1</div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Con Marco Rossi • Domani, 15:00</div>
        </div>
      </div>
      
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(32, 178, 170, 0.1)', padding: '0.75rem', borderRadius: '50%', color: 'var(--accent-aqua)', flexShrink: 0 }}>
          <MapPin size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Prenotazione Aula Studio</div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Biblioteca Centrale • Oggi, 16:30</div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn btn-danger" style={{ width: 'auto', fontSize: '0.8rem', padding: '0.5rem 1rem' }} onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>
          Reset Prototipo (Svuota Dati)
        </button>
      </div>
    </div>
  );
};

const BachecaView = ({ showToast, profile }) => {
  const ads = [
    { id: 1, title: 'Gruppo di studio Analisi 1', subject: 'Matematica', author: 'Elena B.', type: 'Cerco' },
    { id: 2, title: 'Appunti Fisica Tecnica', subject: 'Fisica', author: 'Luca V.', type: 'Offro' },
    { id: 3, title: 'Progetto di Programmazione Web', subject: 'Informatica', author: 'Giulia F.', type: 'Cerco' }
  ];

  return (
    <div className="container animate-fade-in">
      <h2 className="title">Bacheca Annunci</h2>
      <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Annunci per {profile.university}</p>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        <span className="badge" style={{ background: 'var(--primary-navy)', color: 'white', flexShrink: 0 }}>Tutti</span>
        <span className="badge" style={{ flexShrink: 0 }}>Matematica</span>
        <span className="badge" style={{ flexShrink: 0 }}>Fisica</span>
        <span className="badge" style={{ flexShrink: 0 }}>Informatica</span>
      </div>

      {ads.map(ad => (
        <div key={ad.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span className="badge" style={{ background: ad.type === 'Cerco' ? '#FFFBEB' : '#ECFDF5', color: ad.type === 'Cerco' ? '#D97706' : '#059669' }}>
              {ad.type}
            </span>
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>{ad.subject}</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{ad.title}</h3>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>Pubblicato da {ad.author}</p>
          <button className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.9rem' }} onClick={() => showToast('Richiesta inviata con successo!')}>
            Invia Richiesta
          </button>
        </div>
      ))}
    </div>
  );
};

const MappaView = ({ showToast }) => {
  const places = [
    { id: 1, name: 'Bar del Politecnico', address: 'Piazza Leonardo da Vinci, 32', slots: 5 },
    { id: 2, name: 'Caffè Letterario', address: 'Via Pascoli, 12', slots: 2 },
    { id: 3, name: 'Biblioteca Campus', address: 'Edificio 14', slots: 12 }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: 0 }}>
      {/* Mock Map Image */}
      <div style={{ height: '250px', background: '#E2E8F0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>
        <div style={{ position: 'absolute', top: '40%', left: '30%', color: 'var(--primary-navy)', transform: 'translate(-50%, -50%)' }}>
          <MapPin size={32} fill="white" />
        </div>
        <div style={{ position: 'absolute', top: '60%', left: '70%', color: 'var(--accent-aqua)', transform: 'translate(-50%, -50%)' }}>
          <MapPin size={32} fill="white" />
        </div>
        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'white', padding: '0.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Mappa Campus</span>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <h2 className="title">Locali Convenzionati</h2>
        <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Trova un posto dove studiare in tranquillità.</p>

        {places.map(place => (
          <div key={place.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{place.name}</h3>
                <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                  <Navigation size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {place.address}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-aqua)' }}>{place.slots}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>posti liberi</div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => showToast(`Posto prenotato al ${place.name}!`)}>
              Prenota Posto
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TutoringView = ({ credits, showToast }) => {
  const tutors = [
    { id: 1, name: 'Marco Rossi', subject: 'Analisi 1', rating: 4.8, cost: 1 },
    { id: 2, name: 'Sara Bianchi', subject: 'Programmazione', rating: 5.0, cost: 2 }
  ];

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="title" style={{ margin: 0 }}>Peer-Tutoring</h2>
        <div className="badge" style={{ background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Award size={14} />
          {credits} Crediti
        </div>
      </div>
      
      <div className="card" style={{ background: 'var(--primary-navy)', color: 'white' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Come funziona?</h3>
        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1rem' }}>
          1 Credito = 1 Ora di lezione.<br/>
          Guadagna crediti offrendo ripetizioni, spendili per ricevere aiuto.
        </p>
        <button className="btn" style={{ background: 'white', color: 'var(--primary-navy)' }}>
          Offri Ripetizioni (+1 CR/h)
        </button>
      </div>

      <h3 className="subtitle" style={{ margin: '1.5rem 0 1rem' }}>Tutor Disponibili</h3>
      {tutors.map(tutor => (
        <div key={tutor.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>{tutor.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              {tutor.rating}
            </div>
          </div>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>Materia: <strong>{tutor.subject}</strong></p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-navy)' }}>Costo: {tutor.cost} CR/h</span>
            <button className="btn btn-accent" style={{ width: 'auto', padding: '0.5rem 1rem' }} 
              onClick={() => showToast(credits >= tutor.cost ? 'Richiesta di tutoring inviata!' : 'Crediti insufficienti!')}>
              Richiedi
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const ChatView = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
          MR
        </div>
        <div>
          <div style={{ fontWeight: 600 }}>Marco Rossi</div>
          <div style={{ fontSize: '0.8rem', color: '#10B981' }}>Online</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Oggi</div>
        
        <div className="chat-message received">
          <div className="chat-bubble">Ciao! Ho visto che hai accettato la mia richiesta per le ripetizioni di Analisi 1.</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginLeft: '0.5rem' }}>14:30</div>
        </div>

        <div className="chat-message sent">
          <div className="chat-bubble">Ciao Marco! Sì esatto. Quando saresti disponibile per iniziare?</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginRight: '0.5rem', textAlign: 'right' }}>14:35</div>
        </div>

        <div className="chat-message received">
          <div className="chat-bubble">Domani pomeriggio verso le 15:00 in biblioteca centrale andrebbe bene?</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginLeft: '0.5rem' }}>14:36</div>
        </div>
      </div>

      <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input type="text" className="input-field" style={{ marginBottom: 0 }} placeholder="Scrivi un messaggio..." />
          <button className="btn btn-primary" style={{ width: 'auto', padding: '0.75rem' }}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
