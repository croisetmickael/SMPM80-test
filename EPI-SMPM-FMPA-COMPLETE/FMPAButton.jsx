import React, { useState, useEffect } from 'react';
import './FMPAButton.css';

function FMPAButton() {
  const [fmpa, setFmpa] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFMPA, setSelectedFMPA] = useState(null);
  const [editingFMPA, setEditingFMPA] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadFMPA();
  }, []);

  async function loadFMPA() {
    setLoading(true);
    try {
      const response = await fetch('/api/sheets?type=fmpa');
      if (!response.ok) throw new Error('Erreur API FMPA');
      const data = await response.json();
      setFmpa(data.fmpa || []);
    } catch (error) {
      console.error('Erreur chargement FMPA:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredFMPA = fmpa.filter(f =>
    (f.lieu || '').toLowerCase().includes(searchLocation.toLowerCase())
  );

  function openFMPA(record) {
    setSelectedFMPA(record);
    setEditingFMPA(null);
  }

  function startEdit(record) {
    setEditingFMPA(record);
    setEditData({ ...record });
  }

  async function saveFMPA() {
    try {
      const fmpaIndex = fmpa.findIndex(f => f.date === editData.date && f.lieu === editData.lieu);
      if (fmpaIndex === -1) throw new Error('FMPA not found');

      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateFMPA',
          rowIndex: fmpaIndex,
          data: editData,
        }),
      });

      if (!response.ok) throw new Error('Erreur sauvegarde');

      const newFMPA = [...fmpa];
      newFMPA[fmpaIndex] = editData;
      setFmpa(newFMPA);
      
      setSelectedFMPA(editData);
      setEditingFMPA(null);
      alert('FMPA mise à jour avec succès!');
    } catch (error) {
      console.error('Erreur sauvegarde FMPA:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }

  async function addNewFMPA() {
    const newFMPA = {
      date: '',
      lieu: '',
      gps: '',
      observation: ''
    };
    setEditData(newFMPA);
    setEditingFMPA({ isNew: true });
  }

  async function deleteFMPA(record) {
    if (!window.confirm('Confirmer la suppression?')) return;

    try {
      const fmpaIndex = fmpa.findIndex(f => f.date === record.date && f.lieu === record.lieu);
      if (fmpaIndex === -1) throw new Error('FMPA not found');

      const response = await fetch('/api/sheets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteFMPA',
          rowIndex: fmpaIndex,
        }),
      });

      if (!response.ok) throw new Error('Erreur suppression');

      const newFMPA = fmpa.filter((_, idx) => idx !== fmpaIndex);
      setFmpa(newFMPA);
      setSelectedFMPA(null);
      alert('FMPA supprimée');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  }

  return (
    <>
      <button
        className="fmpa-button"
        onClick={() => setShowModal(true)}
        title="Gestion des FMPA"
      >
        📍 FMPA
      </button>

      {showModal && (
        <div className="fmpa-modal-bg open" onClick={() => setShowModal(false)}>
          <div className="fmpa-modal" onClick={e => e.stopPropagation()}>
            <div className="fmpa-modal-header">
              <h2>Gestion FMPA</h2>
              <button className="fmpa-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="fmpa-modal-body">
              {!selectedFMPA ? (
                <>
                  <div className="fmpa-search-box">
                    <input
                      type="text"
                      placeholder="Rechercher par lieu..."
                      value={searchLocation}
                      onChange={e => setSearchLocation(e.target.value)}
                      className="fmpa-search-input"
                    />
                    <button className="fmpa-btn-add" onClick={addNewFMPA}>
                      ➕ Nouvelle FMPA
                    </button>
                  </div>

                  {loading ? (
                    <div className="fmpa-loading">Chargement...</div>
                  ) : filteredFMPA.length > 0 ? (
                    <div className="fmpa-list">
                      {filteredFMPA.map((record, idx) => (
                        <div
                          key={idx}
                          className="fmpa-card"
                          onClick={() => openFMPA(record)}
                        >
                          <div className="fmpa-card-header">
                            <strong>{record.lieu}</strong>
                            <span className="fmpa-date">{record.date}</span>
                          </div>
                          <div className="fmpa-card-body">
                            {record.gps && (
                              <div className="fmpa-row">
                                <span className="fmpa-label">GPS:</span>
                                <span className="fmpa-value">{record.gps}</span>
                              </div>
                            )}
                            {record.observation && (
                              <div className="fmpa-row">
                                <span className="fmpa-label">Note:</span>
                                <span className="fmpa-value">{record.observation.substring(0, 60)}...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="fmpa-no-results">
                      Aucune FMPA trouvée
                    </div>
                  )}
                </>
              ) : editingFMPA ? (
                <>
                  <div className="fmpa-edit-header">
                    <h3>Éditer FMPA</h3>
                    <button className="fmpa-close" onClick={() => setEditingFMPA(null)}>✕</button>
                  </div>

                  <div className="fmpa-edit-form">
                    <div className="fmpa-form-group">
                      <label>DATE</label>
                      <input
                        type="date"
                        value={editData.date || ''}
                        onChange={e => setEditData({...editData, date: e.target.value})}
                      />
                    </div>

                    <div className="fmpa-form-group">
                      <label>LIEU</label>
                      <input
                        type="text"
                        placeholder="Lieu d'intervention"
                        value={editData.lieu || ''}
                        onChange={e => setEditData({...editData, lieu: e.target.value})}
                      />
                    </div>

                    <div className="fmpa-form-group">
                      <label>COORDONNÉES GPS</label>
                      <input
                        type="text"
                        placeholder="ex: 48.8566° N, 2.3522° E"
                        value={editData.gps || ''}
                        onChange={e => setEditData({...editData, gps: e.target.value})}
                      />
                    </div>

                    <div className="fmpa-form-group">
                      <label>OBSERVATION</label>
                      <textarea
                        placeholder="Détails de l'intervention..."
                        value={editData.observation || ''}
                        onChange={e => setEditData({...editData, observation: e.target.value})}
                        rows="4"
                      />
                    </div>
                  </div>

                  <div className="fmpa-edit-footer">
                    <button className="fmpa-btn-save" onClick={saveFMPA}>
                      Enregistrer
                    </button>
                    {!editData.isNew && (
                      <button 
                        className="fmpa-btn-delete" 
                        onClick={() => {
                          setEditingFMPA(null);
                          deleteFMPA(selectedFMPA);
                        }}
                      >
                        Supprimer
                      </button>
                    )}
                    <button className="fmpa-btn-cancel" onClick={() => setEditingFMPA(null)}>
                      Annuler
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="fmpa-detail-header">
                    <h3>{selectedFMPA.lieu}</h3>
                    <button className="fmpa-close" onClick={() => setSelectedFMPA(null)}>✕</button>
                  </div>

                  <div className="fmpa-detail-body">
                    <div className="fmpa-detail-row">
                      <span className="fmpa-detail-label">Date:</span>
                      <span className="fmpa-detail-value">{selectedFMPA.date}</span>
                    </div>

                    <div className="fmpa-detail-row">
                      <span className="fmpa-detail-label">Lieu:</span>
                      <span className="fmpa-detail-value">{selectedFMPA.lieu}</span>
                    </div>

                    {selectedFMPA.gps && (
                      <div className="fmpa-detail-row">
                        <span className="fmpa-detail-label">GPS:</span>
                        <span className="fmpa-detail-value">
                          <a 
                            href={`https://maps.google.com/?q=${encodeURIComponent(selectedFMPA.gps)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fmpa-gps-link"
                          >
                            {selectedFMPA.gps} 🔗
                          </a>
                        </span>
                      </div>
                    )}

                    {selectedFMPA.observation && (
                      <div className="fmpa-detail-row full-width">
                        <span className="fmpa-detail-label">Observation:</span>
                        <span className="fmpa-detail-value">{selectedFMPA.observation}</span>
                      </div>
                    )}
                  </div>

                  <div className="fmpa-detail-footer">
                    <button className="fmpa-btn-edit" onClick={() => startEdit(selectedFMPA)}>
                      Éditer
                    </button>
                    <button 
                      className="fmpa-btn-delete" 
                      onClick={() => {
                        deleteFMPA(selectedFMPA);
                      }}
                    >
                      Supprimer
                    </button>
                    <button className="fmpa-btn-close" onClick={() => setSelectedFMPA(null)}>
                      Fermer
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FMPAButton;
