import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const PUZZLE_PATH =
  'M 20,0 L 42,0 C 42,-12 58,-12 58,0 L 100,0 L 100,42 C 112,42 112,58 100,58 L 100,100 L 58,100 C 58,112 42,112 42,100 L 0,100 L 0,58 C -12,58 -12,42 0,42 L 0,0 Z';
const PUZZLE_VB = '-15 -15 130 130';

const SOCIAL_LINKS = [
  { key: 'github',   Icon: Github,   label: 'GitHub',   color: '#a78bfa' },
  { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn', color: '#67e8f9' },
  { key: 'twitter',  Icon: Twitter,  label: 'Twitter',  color: '#fcd34d' },
  { key: 'email',    Icon: Mail,     label: 'Email',    color: '#f9a8d4', isEmail: true },
];

function InputField({ label, type = 'text', value, onChange, placeholder, multiline }) {
  const El = multiline ? 'textarea' : 'input';
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-slate-500 font-semibold tracking-wider uppercase">{label}</label>
      <El
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
        className="w-full rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all resize-none"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)',
        }}
        onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
      />
    </div>
  );
}

export default function Contact({ data }) {
  const { personal, socials } = data;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  const bgPiecesContact = [
    { size: 180, x: '2%',  y: '5%',  rotate: 20,  opacity: 0.05, stroke: '#7C3AED', dur: 9,  delay: 0 },
    { size: 250, x: '80%', y: '60%', rotate: -15, opacity: 0.04, stroke: '#06B6D4', dur: 12, delay: 1 },
    { size: 140, x: '50%', y: '80%', rotate: 35,  opacity: 0.06, stroke: '#F59E0B', dur: 8,  delay: 2 },
  ];

  return (
    <section
      ref={ref}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080B14 0%, #0D0B20 100%)' }}
    >
      {/* Ambient glow — final assembled */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 70%)' }}
      />

      {/* Floating bg puzzle pieces */}
      {bgPiecesContact.map((p, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
          animate={{ y: [0, -20, 0], rotate: [p.rotate, p.rotate + 6, p.rotate], opacity: [p.opacity, p.opacity * 1.5, p.opacity] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox={PUZZLE_VB} className="w-full h-full">
            <path d={PUZZLE_PATH} fill="none" stroke={p.stroke} strokeWidth="1.5" />
          </svg>
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <svg width="20" height="20" viewBox={PUZZLE_VB}>
            <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.3)" stroke="rgba(124,58,237,0.9)" strokeWidth="2.5" />
          </svg>
          <span className="text-violet-400 text-xs font-semibold tracking-[0.3em] uppercase">Contact</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ color: '#F1F5F9' }}
        >
          Let's Complete<br />
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            The Picture Together
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
          className="text-slate-500 text-sm max-w-lg mb-16"
        >
          Every great collaboration starts with a single piece. Reach out and let's see what we can assemble together.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, type: 'spring', stiffness: 150 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 p-12 rounded-2xl text-center"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.3)' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg width="64" height="64" viewBox={PUZZLE_VB}>
                    <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.3)" stroke="rgba(124,58,237,0.8)" strokeWidth="2" />
                  </svg>
                </motion.div>
                <CheckCircle size={32} className="text-violet-400" />
                <p className="text-slate-100 font-semibold text-lg">Piece received!</p>
                <p className="text-slate-500 text-sm">Thank you for reaching out. I'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Name"
                    value={form.name}
                    onChange={handleChange('name')}
                    placeholder="Your name"
                  />
                  <InputField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange('email')}
                    placeholder="you@example.com"
                  />
                </div>
                <InputField
                  label="Message"
                  value={form.message}
                  onChange={handleChange('message')}
                  placeholder="Tell me about your project..."
                  multiline
                />
                <motion.button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white text-sm font-semibold w-fit"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
                  whileHover={{ scale: 1.04, y: -2, boxShadow: '0 12px 30px rgba(124,58,237,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Send size={15} /> Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Right — info + socials */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.45, type: 'spring', stiffness: 150 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Info card */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {personal?.location && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
                    <MapPin size={14} className="text-violet-400" />
                  </div>
                  <span className="text-slate-400 text-sm">{personal.location}</span>
                </div>
              )}
              {socials?.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}>
                    <Mail size={14} className="text-cyan-400" />
                  </div>
                  <a href={`mailto:${socials.email}`} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">
                    {socials.email}
                  </a>
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="flex flex-col gap-3">
              {SOCIAL_LINKS.map(({ key, Icon, label, color, isEmail }) => {
                const href = isEmail
                  ? `mailto:${socials?.[key] || ''}`
                  : (socials?.[key] || '#');
                if (!socials?.[key]) return null;
                return (
                  <motion.a
                    key={key}
                    href={href}
                    target={isEmail ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}
                    whileHover={{ x: 6, borderColor: `${color}50`, color, background: `${color}10` }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Footer — puzzle complete */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-24 pt-8 flex flex-col items-center gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            {[-1, 0, 1].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.05, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, delay: (i + 1) * 0.5, ease: 'easeInOut' }}
              >
                <svg width="20" height="20" viewBox={PUZZLE_VB}>
                  <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.25)" stroke="rgba(124,58,237,0.6)" strokeWidth="2" />
                </svg>
              </motion.div>
            ))}
          </div>
          <p className="text-slate-700 text-xs tracking-widest uppercase">
            {personal?.name} — Portfolio Assembled
          </p>
        </motion.div>
      </div>
    </section>
  );
}
