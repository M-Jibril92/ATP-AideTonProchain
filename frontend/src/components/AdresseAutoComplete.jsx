import React, { useState } from 'react';

export default function AdresseAutoComplete({ value, onChange }) {
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState(value || '');
  const [show, setShow] = useState(false);

  const handleInput = async (e) => {
    const val = e.target.value;
    setInput(val);
    onChange(val);
    if (val.length < 3) {
      setSuggestions([]);
      setShow(false);
      return;
    }
    try {
      // Appel API Adresse
      const resp = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(val)}&limit=5&autocomplete=1&region=11`);
      const data = await resp.json();
      if (data && data.features) {
        setSuggestions(data.features.map(f => f.properties.label));
        setShow(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Erreur API Adresse:', err);
      setSuggestions([]);
    }
  };

  const handleSelect = (s) => {
    setInput(s);
    onChange(s);
    setShow(false);
  };

  return (
    <div style={{position:'relative'}}>
      <input
        type="text"
        value={input}
        onChange={handleInput}
        onBlur={() => setTimeout(()=>setShow(false), 100)}
        onFocus={() => input.length >= 3 && setShow(true)}
        placeholder="Commencez à taper une adresse..."
        style={{width:'100%', padding:'0.7rem', borderRadius:6, border:'1px solid #ddd'}}
        autoComplete="off"
      />
      {show && suggestions.length > 0 && (
        <ul style={{position:'absolute', top:'100%', left:0, right:0, background:'#fff', border:'1px solid #eee', borderRadius:6, zIndex:10, margin:0, padding:'0.3rem 0', listStyle:'none', boxShadow:'0 2px 8px #eee'}}>
          {suggestions.map(s => (
            <li key={s} style={{padding:'0.5rem 1rem', cursor:'pointer'}} onMouseDown={()=>handleSelect(s)}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
