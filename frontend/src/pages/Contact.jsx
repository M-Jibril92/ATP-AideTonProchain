import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Contact message', form);
    
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          maxWidth: '600px',
          margin: '4rem auto',
          textAlign: 'center',
          padding: '3rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '2px solid rgba(20, 184, 166, 0.5)',
          backdropFilter: 'blur(10px)',
          animation: 'slideUp 0.5s ease',
          boxShadow: '0 12px 32px rgba(20, 184, 166, 0.2)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Message envoyé !
          </h2>
          <p style={{ color: '#cbd5e1', marginBottom: '1.5rem' }}>
            Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <button
            onClick={() => setSent(false)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }}
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    background: 'rgba(15, 23, 42, 0.8)',
    color: '#f9fafb',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: '0.9rem'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(106, 17, 203, 0.1) 100%)',
        padding: '3rem 2rem',
        borderRadius: '20px',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem',
          letterSpacing: '-0.02em'
        }}>
          Contactez-nous
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#cbd5e1',
          lineHeight: '1.8'
        }}>
          Une question ? Une suggestion ? N'hésitez pas à nous écrire !
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Contact Form Card */}
        <div style={{
          padding: '2rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          backdropFilter: 'blur(10px)',
          animation: 'slideUp 0.6s ease'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#f9fafb', fontWeight: '700' }}>
            Envoyez-nous un message
          </h2>

          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Votre nom</label>
              <input
                type="text"
                placeholder="Jean Dupont"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Votre email</label>
              <input
                type="email"
                placeholder="jean.dupont@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Votre message</label>
              <textarea
                placeholder="Décrivez votre demande..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={6}
                required
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '140px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.9rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                color: '#fff',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {loading ? '⏳ Envoi en cours...' : '📧 Envoyer le message'}
            </button>
          </form>
        </div>

        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Email Card */}
          <div style={{
            padding: '2rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            backdropFilter: 'blur(10px)',
            animation: 'slideUp 0.7s ease',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              📧
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#f9fafb', fontWeight: '700' }}>
              Email
            </h3>
            <a
              href="mailto:aidetonprochain@gmail.com"
              style={{
                color: '#60a5fa',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#60a5fa';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Aidetonprochain@gmail.com
            </a>
          </div>

          {/* Social Media Card */}
          <div style={{
            padding: '2rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            backdropFilter: 'blur(10px)',
            animation: 'slideUp 0.8s ease',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              💬
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#f9fafb', fontWeight: '700' }}>
              Réseaux sociaux
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '0' }}>
              Suivez-nous sur nos réseaux pour rester informé des nouveautés !
            </p>
          </div>

          {/* Hours Card */}
          <div style={{
            padding: '2rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            backdropFilter: 'blur(10px)',
            animation: 'slideUp 0.9s ease',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #f59e0b, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              ⏰
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#f9fafb', fontWeight: '700' }}>
              Horaires de réponse
            </h3>
            <p style={{ color: '#cbd5e1', marginBottom: '0' }}>
              Nous répondons généralement sous 24-48h, du lundi au vendredi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}