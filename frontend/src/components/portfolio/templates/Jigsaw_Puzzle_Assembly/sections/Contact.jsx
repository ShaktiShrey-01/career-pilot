import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import PuzzleHeading from '../components/PuzzleHeading';
import PuzzleButton from '../components/PuzzleButton';
import { PUZZLE_PATH, PUZZLE_VIEWBOX, COLORS, PIECE_EASE } from '../utils/puzzleHelpers';

// The 6 final-assembly pieces — converge from screen edges when section enters view
const FINAL_PIECES = [
  { size: 80, xStart: -300, yStart: -200, rotate: 30,  color: '#7C3AED', delay: 0    },
  { size: 65, xStart:  300, yStart: -200, rotate: -25, color: '#06B6D4', delay: 0.08 },
  { size: 90, xStart: -350, yStart:    0, rotate: 15,  color: '#F59E0B', delay: 0.16 },
  { size: 70, xStart:  350, yStart:    0, rotate: -20, color: '#7C3AED', delay: 0.24 },
  { size: 75, xStart: -300, yStart:  200, rotate: 35,  color: '#06B6D4', delay: 0.32 },
  { size: 60, xStart:  300, yStart:  200, rotate: -30, color: '#F59E0B', delay: 0.40 },
];

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
      <label className="text-xs font-bold tracking-wider uppercase" style={{ color: COLORS.faint }}>
        {label}
      </label>
      <El
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={multiline ? 4 : undefined}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          color: COLORS.text,
        }}
        onFocus={(e)  => (e.target.style.borderColor = 'rgba(124,58,237,0.55)')}
        onBlur={(e)   => (e.target.style.borderColor = COLORS.border)}
      />
    </div>
  );
}

export default function Contact({ personal, socials }) {
  const sectionRef = useRef(null);
  const isInView   = useInView(sectionRef, { once: true, amount: 0.2 });

  const [form, setForm]   = useState({ name: '', email: '', message: '' });
  const [sent, setSent]   = useState(false);

  const change = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080B14 0%, #0D0B20 100%)', zIndex: 1 }}
    >
      {/* Completion radial glow — expands when section is in view */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 1.0 }}
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 50%, rgba(124,58,237,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Final assembly pieces converging on entry */}
      {FINAL_PIECES.map((p, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{ width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
          initial={{ x: p.xStart, y: p.yStart, rotate: p.rotate, opacity: 0 }}
          animate={isInView ? { x: 0, y: 0, rotate: 0, opacity: 0.12 } : {}}
          transition={{ delay: p.delay, type: 'spring', stiffness: 120, damping: 22 }}
        >
          <svg viewBox={PUZZLE_VIEWBOX} className="w-full h-full">
            <path d={PUZZLE_PATH} fill={`${p.color}20`} stroke={`${p.color}60`} strokeWidth="1.5" />
          </svg>
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        <PuzzleHeading
          label="Contact"
          title="Let's Complete The Picture Together"
          accentColor={COLORS.violet}
          gradientTo="#67e8f9"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-sm max-w-lg mb-14"
          style={{ color: COLORS.faint }}
        >
          Every great collaboration starts with a single piece. Reach out and let's see what we can assemble together.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
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
                  <svg width="60" height="60" viewBox={PUZZLE_VIEWBOX}>
                    <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.3)" stroke="rgba(124,58,237,0.8)" strokeWidth="2" />
                  </svg>
                </motion.div>
                <CheckCircle size={30} style={{ color: COLORS.violet }} />
                <p className="font-semibold text-lg" style={{ color: COLORS.text }}>
                  Piece received!
                </p>
                <p className="text-sm" style={{ color: COLORS.faint }}>
                  Thank you for reaching out. I'll be in touch soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField label="Name"  value={form.name}    onChange={change('name')}    placeholder="Your name" />
                  <InputField label="Email" type="email" value={form.email} onChange={change('email')} placeholder="you@example.com" />
                </div>
                <InputField label="Message" value={form.message} onChange={change('message')} placeholder="Tell me about your project…" multiline />
                <PuzzleButton variant="primary" accentColor={COLORS.violet} as="button">
                  <Send size={14} /> Send Message
                </PuzzleButton>
              </form>
            )}
          </motion.div>

          {/* Social links + info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.55, type: 'spring', stiffness: 150 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Info card */}
            <div
              className="p-6 rounded-2xl flex flex-col gap-4"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}` }}
            >
              {personal?.location && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
                    <MapPin size={13} style={{ color: COLORS.violet }} />
                  </div>
                  <span className="text-sm" style={{ color: COLORS.muted }}>{personal.location}</span>
                </div>
              )}
              {socials?.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}>
                    <Mail size={13} style={{ color: COLORS.cyan }} />
                  </div>
                  <a
                    href={`mailto:${socials.email}`}
                    className="text-sm transition-colors hover:text-cyan-400"
                    style={{ color: COLORS.muted }}
                  >
                    {socials.email}
                  </a>
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map(({ key, Icon, label, color, isEmail }) => {
                const href = isEmail ? `mailto:${socials?.[key] || ''}` : (socials?.[key] || '#');
                if (!socials?.[key]) return null;
                return (
                  <motion.a
                    key={key}
                    href={href}
                    target={isEmail ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl text-sm font-semibold"
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.muted }}
                    whileHover={{ x: 6, borderColor: `${color}50`, color, background: `${color}10` }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon size={15} />
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
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4 }}
          className="mt-24 pt-8 flex flex-col items-center gap-3"
          style={{ borderTop: `1px solid ${COLORS.border}` }}
        >
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.9, 1.05, 0.9] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
              >
                <svg width="18" height="18" viewBox={PUZZLE_VIEWBOX}>
                  <path d={PUZZLE_PATH} fill="rgba(124,58,237,0.25)" stroke="rgba(124,58,237,0.6)" strokeWidth="2" />
                </svg>
              </motion.div>
            ))}
          </div>
          <p
            className="text-xs tracking-widest uppercase"
            style={{ color: '#1e293b' }}
          >
            {personal?.name} — Portfolio Assembled
          </p>
        </motion.div>
      </div>
    </section>
  );
}
