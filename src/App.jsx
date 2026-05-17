import React, { useState, useEffect, useRef } from 'react';
import { Home, List, Users, MessageCircle, CheckCircle, Navigation, Award, BookOpen, Star, Send, Camera, Plus, Trash2, Share, PlusSquare, Info, X } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState(2);
  const [currentView, setCurrentView] = useState('home');
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [toast, setToast] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const APP_VERSION = "v1.2.0";

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
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setIsFirstLaunch(false);
    }
    
    // Forza sempre 2 crediti per il prototipo
    localStorage.setItem('unihub_credits', '2');
    setCredits(2);
  }, []);

  const saveProfile = (newProfile) => {
    localStorage.setItem('unihub_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setIsFirstLaunch(false);
    setIsEditingProfile(false);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const renderView = () => {
    if (isEditingProfile) {
      return <ProfileSetup onSave={saveProfile} initialData={profile} />;
    }
    
    switch (currentView) {
      case 'home': return <HomeView profile={profile} onShowInfo={() => setShowChangelog(true)} onEditProfile={() => setIsEditingProfile(true)} />;
      case 'bacheca': return <BachecaView showToast={showToast} profile={profile} />;
      case 'tutoring': return <TutoringView credits={credits} showToast={showToast} />;
      case 'chat': return <ChatView />;
      default: return <HomeView profile={profile} onShowInfo={() => setShowChangelog(true)} onEditProfile={() => setIsEditingProfile(true)} />;
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

      {showChangelog && (
        <div className="modal-overlay" onClick={() => setShowChangelog(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="subtitle" style={{ margin: 0 }}>Cronologia Versioni</h2>
              <button onClick={() => setShowChangelog(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            
            <div className="changelog-item">
              <div className="changelog-version">v1.2.0</div>
              <div className="changelog-date">17 Maggio 2026</div>
              <ul className="changelog-changes">
                <li>Aggiunto bollino crediti nella barra superiore</li>
                <li>Barra di navigazione fissa in basso</li>
                <li>Aggiunto pulsante Modifica Profilo</li>
                <li>Rimossa sezione Mappa</li>
                <li>Aggiunto Match di Studio nelle attività</li>
                <li>Fix definitivo schermata bianca iOS (Service Worker network-first)</li>
              </ul>
            </div>

            <div className="changelog-item">
              <div className="changelog-version">v1.1.0</div>
              <div className="changelog-date">16 Maggio 2026</div>
              <ul className="changelog-changes">
                <li>Aggiunta gestione versioning e info app</li>
                <li>Nuovi campi obbligatori nel profilo (Città, Tipo Laurea)</li>
                <li>Migliorata validazione e legenda inserimento dati</li>
                <li>Rimosso frame simulazione smartphone per desktop</li>
                <li>Corretti percorsi per installazione PWA su sottocartelle</li>
              </ul>
            </div>

            <div className="changelog-item">
              <div className="changelog-version">v1.0.0</div>
              <div className="changelog-date">12 Maggio 2026</div>
              <ul className="changelog-changes">
                <li>Rilascio iniziale prototipo UniHub</li>
                <li>Configurazione PWA e Service Worker</li>
                <li>Sistema crediti (Peer-Tutoring)</li>
                <li>Mappa campus e Bacheca annunci</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="version-tag">UniHub {APP_VERSION}</div>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </button>
);

const ProfileSetup = ({ onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    university: '',
    department: '',
    degreeType: 'Triennale',
    degree: '',
    city: '',
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
    if (formData.name && formData.university && formData.city && formData.degree) {
      onSave(formData);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 className="title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Il tuo Profilo</h1>
        <p className="text-muted">Completa i dati per iniziare</p>
      </div>

      <div className="info-legend">
        <Info size={20} style={{ flexShrink: 0 }} />
        <span>
          Tutte le informazioni inserite devono corrispondere ai <strong>nomi completi ed esatti</strong> (es. nome università, dipartimento, corso ed esami).
        </span>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Foto Profilo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="photo-upload-wrapper" style={{ marginBottom: '0.5rem' }}>
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="profile-avatar" style={{ marginBottom: 0 }} />
              ) : (
                <div className="profile-avatar" style={{ marginBottom: 0 }}>
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
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Foto (Facoltativa)</p>
          </div>

          <div className="input-group">
            <label className="input-label">Nome e Cognome *</label>
            <input required type="text" className="input-field" placeholder="Es. Mario Rossi" 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="input-group">
            <label className="input-label">Università *</label>
            <input required type="text" className="input-field" placeholder="Es. Università Cattolica del Sacro Cuore" 
              value={formData.university} onChange={(e) => setFormData({...formData, university: e.target.value})} />
          </div>

          <div className="input-group">
            <label className="input-label">Città *</label>
            <input required type="text" className="input-field" placeholder="Es. Milano" 
              value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
          </div>

          <div className="input-group">
            <label className="input-label">Dipartimento *</label>
            <input required type="text" className="input-field" placeholder="Es. Economia" 
              value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
          </div>

          <div className="input-group">
            <label className="input-label">Tipo di Laurea *</label>
            <select className="input-field" value={formData.degreeType} 
              onChange={(e) => setFormData({...formData, degreeType: e.target.value})}>
              <option value="Triennale">Triennale</option>
              <option value="Magistrale">Magistrale</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Nome Corso di Laurea *</label>
            <input required type="text" className="input-field" placeholder="Es. Direzione e Consulenza aziendale" 
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

const HomeView = ({ profile, onShowInfo, onEditProfile }) => {
  const [showExamsModal, setShowExamsModal] = useState(false);
  const initials = profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?';
  
  return (
    <div className="container animate-fade-in">
      <div className="card" style={{ textAlign: 'center', paddingTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="profile-avatar" />
          ) : (
            <div className="profile-avatar">{initials}</div>
          )}
          <button 
            onClick={() => onShowInfo()}
            style={{ position: 'absolute', right: '0', top: '0', background: 'none', border: 'none', color: 'var(--primary-navy)', cursor: 'pointer' }}
          >
            <Info size={24} />
          </button>
        </div>
        <h2 className="title" style={{ marginBottom: '0.25rem' }}>{profile.name}</h2>
        <p className="text-muted" style={{ marginBottom: '0.5rem' }}>
          {profile.degreeType} in {profile.degree} • {profile.university} ({profile.city})
        </p>
        
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <button className="btn btn-outline" style={{ width: 'auto', fontSize: '0.85rem', padding: '0.4rem 1.5rem', borderRadius: '9999px' }} onClick={onEditProfile}>
            Modifica Profilo
          </button>
        </div>
      </div>

      {profile.exams && profile.exams.length > 0 && (
        <>
          <h3 className="subtitle" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>I tuoi Esami</h3>
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setShowExamsModal(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#E0F2FE', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-navy)' }}>
                <BookOpen size={24} />
              </div>
              <div style={{ fontWeight: 600 }}>Esami Sostenuti ({profile.exams.length})</div>
            </div>
            <div className="badge" style={{ cursor: 'pointer' }}>Vedi tutti</div>
          </div>
        </>
      )}

      {showExamsModal && (
        <div className="modal-overlay" onClick={() => setShowExamsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="subtitle" style={{ margin: 0 }}>I tuoi Esami</h2>
              <button onClick={() => setShowExamsModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>
            {profile.exams.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center' }}>Nessun esame inserito.</p>
            ) : (
              <div>
                {profile.exams.map(exam => (
                  <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 600 }}>{exam.name}</div>
                    <div className="badge">{exam.grade === '31' ? '30L' : exam.grade}/30</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <h3 className="subtitle" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>Le tue attività</h3>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: '#E0F2FE', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-navy)', flexShrink: 0 }}>
          <BookOpen size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Ripetizioni</div>
          <div className="text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
            Innovazioni e Metriche di Marketing<br/>
            Con Luigi Verdi<br/>
            Domani, 15:00
          </div>
        </div>
      </div>
      
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '0.75rem', borderRadius: '50%', color: '#EC4899', flexShrink: 0 }}>
          <Users size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Match di Studio</div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Innovazioni e Metriche di Marketing • Con Giulia F.</div>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAd, setSelectedAd] = useState(null);
  
  const ads = [
    { id: 1, title: 'Cerco compagno di studio per Analisi Matematica 1', subject: 'Analisi Matematica 1', professor: 'Prof. Giovanni Bianchi', author: 'Elena B.', university: 'Università Cattolica del Sacro Cuore', degree: 'Economia e Gestione Aziendale', city: 'Milano', description: 'Cerco qualcuno con cui preparare l\'esame di Analisi 1 insieme. Disponibile in biblioteca o online.' },
    { id: 2, title: 'Cerco compagno studio Programmazione Web', subject: 'Programmazione Web e Mobile', professor: 'Prof. Andrea Fumagalli', author: 'Giulia F.', university: 'Politecnico di Milano', degree: 'Ingegneria Informatica', city: 'Milano', description: 'Sto cercando qualcuno per lavorare insieme al progetto finale e prepararsi per l\'esame.' },
    { id: 3, title: 'Cerco compagno per studio Economia Aziendale', subject: 'Economia Aziendale', professor: 'Prof.ssa Maria Conte', author: 'Sara M.', university: 'Università Cattolica del Sacro Cuore', degree: 'Economia', city: 'Milano', description: 'Vorrei trovare un gruppo per studiare insieme Economia Aziendale, ho tutti gli appunti delle lezioni.' },
    { id: 4, title: 'Gruppo studio Innovazioni e Metriche di Marketing', subject: 'Innovazioni e Metriche di Marketing', professor: 'Prof. Luca Pellegrini', author: 'Marco T.', university: 'Università Cattolica del Sacro Cuore', degree: 'Direzione e Consulenza Aziendale', city: 'Milano', description: 'Cerco compagni per prepararsi all\'esame di Innovazioni e Metriche di Marketing. Preferibilmente in zona Largo Gemelli.' },
    { id: 5, title: 'Cerco partner studio Diritto Commerciale', subject: 'Diritto Commerciale', professor: 'Prof.ssa Laura Rossi', author: 'Davide P.', university: 'Università degli Studi di Milano', degree: 'Giurisprudenza', city: 'Milano', description: 'Cerco qualcuno per ripasso intensivo prima dell\'appello. Disponibile tutti i pomeriggi.' }
  ];

  const filteredAds = searchQuery.trim() === '' 
    ? ads 
    : ads.filter(ad => 
        ad.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.professor.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="container animate-fade-in">
      <h2 className="title">Match di Studio</h2>
      <p className="text-muted" style={{ marginBottom: '1rem' }}>Trova compagni di studio nella tua zona</p>
      
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Cerca per materia, titolo o professore..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.75rem', marginBottom: 0 }}
        />
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>

      {filteredAds.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <p className="text-muted">Nessun annuncio trovato{searchQuery ? ` per "${searchQuery}"` : ''}</p>
        </div>
      ) : (
        filteredAds.map(ad => (
          <div key={ad.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedAd(ad)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>Match Studio</span>
              <span className="badge">{ad.subject}</span>
            </div>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{ad.title}</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Pubblicato da {ad.author} • {ad.city}</p>
          </div>
        ))
      )}

      {selectedAd && (
        <div className="modal-overlay" onClick={() => setSelectedAd(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="subtitle" style={{ margin: 0 }}>Dettaglio Annuncio</h2>
              <button onClick={() => setSelectedAd(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
              <div className="profile-avatar" style={{ width: '48px', height: '48px', fontSize: '1rem' }}>
                {selectedAd.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{selectedAd.author}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{selectedAd.university}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{selectedAd.degree} • {selectedAd.city}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Materia</div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{selectedAd.subject}</div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Professore</div>
              <div style={{ fontWeight: 600, fontSize: '1rem' }}>{selectedAd.professor}</div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>Descrizione</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-color)' }}>{selectedAd.description}</p>
            </div>

            <button className="btn btn-primary" onClick={() => { setSelectedAd(null); showToast('Richiesta di match inviata a ' + selectedAd.author + '!'); }}>
              Invia Richiesta di Match
            </button>
          </div>
        </div>
      )}
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
