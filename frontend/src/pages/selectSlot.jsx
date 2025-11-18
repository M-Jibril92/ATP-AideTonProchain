import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const SLOTS = [
  "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00",
  "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00",
  "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00",
  "17:00 - 18:00", "18:00 - 19:00"
];

function getDateStr(daysOffset=0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().substring(0,10);
}

// ⚠️ Composant avec majuscule
export default function SelectSlot() {
  const { addItem } = useCart();
  const location = useLocation();
  const nav = useNavigate();
  // Récupère la tâche choisie passée en state
  const task = location.state?.task;
  const [date, setDate] = useState(getDateStr(0));
  const [slot, setSlot] = useState(SLOTS[0]);

  // ⚠️ Les hooks doivent être appelés hors conditions

  if (!task) return (
    <div className="page-container" style={{textAlign:"center",marginTop:"3rem"}}>
      <h2 style={{color:"#a259e4"}}>❌ Tâche non trouvée</h2>
      <button className="btn btn-primary" onClick={()=>nav("/tasks")}>Retour aux tâches</button>
    </div>
  );

  const validDates = [0,1,2].map(getDateStr);

  function handleConfirm() {
    addItem({ ...task, date, slot }, 1);
    nav("/reservation");
  }

  return (
    <div className="page-container" style={{
      maxWidth:480, margin:"2rem auto", background:"#231942cc",
      borderRadius:"20px", boxShadow:"0 6px 24px #a259e466"
    }}>
      <style>{`
        .select-head {
          display: flex; align-items:center; gap:1rem; justify-content:center;
          margin-bottom:2rem;
        }
        .slot-list { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .slot-btn {
          background: linear-gradient(120deg,#a259e4 0%,#ff6ee4 70%,#7ee8fa 100%);
          color: #231942;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1rem;
          box-shadow: 0 2px 10px #a259e482;
          padding: 0.7rem;
          cursor: pointer;
          border:none;
          opacity:0.78;
          transition:all 0.2s;
        }
        .slot-btn.selected {
          opacity:1;
          box-shadow:0 6px 20px #ff6ee4;
          border:2px solid #ff6ee492;
        }
        .select-date-btn {
          background: #141032;
          color: #a259e4;
          border:1.5px solid #a259e488;
          padding:0.5rem 1.3rem;
          border-radius:8px;
          margin-right:0.5rem;
          font-weight:600;
          cursor:pointer;
          transition:all 0.18s;
        }
        .select-date-btn.selected {
          background: linear-gradient(120deg,#a259e4 0%,#ff6ee4 90%);
          color:#231942;
          border-color: #ff6ee4;
        }
        @media (max-width:500px){
          .page-container{padding:0.5rem;}
          .select-head{flex-direction: column; gap:0.5rem;}
          .slot-list{grid-template-columns:1fr;}
        }
      `}</style>
      <div className="select-head">
        <div style={{fontSize:"2.6rem"}}>{task.icon || "⭐"}</div>
        <div>
          <h2 style={{color:"#fff",fontSize:"1.18rem",marginBottom:"0.4rem"}}>{task.title}</h2>
          <span style={{
            background: 'linear-gradient(120deg,#a259e4 0%,#ff6ee4 100%)',
            color: '#231942', padding: "0.19rem 0.5rem", borderRadius: "7px", fontWeight: 600, fontSize:"0.9rem"
          }}>{task.category}</span>
        </div>
      </div>
      <div style={{marginBottom:"1.7rem"}}>
        <div style={{fontWeight:700,color:"#ff6ee4",marginBottom:"0.7rem"}}>Choisissez la date :</div>
        {validDates.map(d=>(
          <button key={d}
            className={`select-date-btn${date===d?" selected":""}`}
            onClick={()=>setDate(d)}
          >{new Date(d).toLocaleDateString('fr-FR', {weekday:"short",day:"2-digit",month:"short"})}</button>
        ))}
      </div>
      <div style={{marginBottom:"2.5rem"}}>
        <div style={{fontWeight:700,color:"#ff6ee4",marginBottom:"0.7rem"}}>Choisissez un créneau d'1h :</div>
        <div className="slot-list">
          {SLOTS.map(s=>(
            <button key={s}
              className={`slot-btn${slot===s?" selected":""}`}
              onClick={()=>setSlot(s)}
            >{s}</button>
          ))}
        </div>
      </div>
      <button className="btn btn-primary" style={{width:"100%",marginTop:"1rem"}} onClick={handleConfirm}>
        Confirmer & Ajouter au panier
      </button>
    </div>
  );
}