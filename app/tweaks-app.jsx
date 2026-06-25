/* ============================================================
   weGAS Intelligence — Tweaks app
   React panel that drives the design via CSS variables
   ============================================================ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#EE3EC9",
  "secondary": "#54C4C8",
  "display": "Roboto Condensed",
  "mono": "Roboto Mono",
  "radius": 16,
  "glow": true
}/*EDITMODE-END*/;

const DISPLAY_STACKS = {
  'Roboto Condensed': "'Roboto Condensed', sans-serif",
  'Archivo': "'Archivo', sans-serif",
  'Space Grotesk': "'Space Grotesk', sans-serif",
};
const MONO_STACKS = {
  'Roboto Mono': "'Roboto Mono', monospace",
  'Space Mono': "'Space Mono', monospace",
  'IBM Plex Mono': "'IBM Plex Mono', monospace",
};

function applyTweaks(t) {
  const r = document.documentElement.style;
  r.setProperty('--magenta', t.primary);
  r.setProperty('--teal', t.secondary);
  r.setProperty('--display', DISPLAY_STACKS[t.display] || DISPLAY_STACKS['Roboto Condensed']);
  r.setProperty('--mono', MONO_STACKS[t.mono] || MONO_STACKS['Roboto Mono']);
  const md = +t.radius;
  r.setProperty('--r-lg', (md + 8) + 'px');
  r.setProperty('--r-md', md + 'px');
  r.setProperty('--r-sm', Math.max(4, md - 6) + 'px');
  document.body.classList.toggle('no-glow', !t.glow);
}

function WegasTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => applyTweaks(t), [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand color" />
      <TweakColor label="Primary accent" value={t.primary}
        options={['#EE3EC9', '#FF3D6E', '#B14BFF', '#FF6A00']}
        onChange={(v) => setTweak('primary', v)} />
      <TweakColor label="Secondary accent" value={t.secondary}
        options={['#54C4C8', '#2A9D8F', '#4C6FFF', '#00C2A8']}
        onChange={(v) => setTweak('secondary', v)} />

      <TweakSection label="Type" />
      <TweakSelect label="Display font" value={t.display}
        options={['Roboto Condensed', 'Archivo', 'Space Grotesk']}
        onChange={(v) => setTweak('display', v)} />
      <TweakSelect label="UI mono font" value={t.mono}
        options={['Roboto Mono', 'Space Mono', 'IBM Plex Mono']}
        onChange={(v) => setTweak('mono', v)} />

      <TweakSection label="Surface" />
      <TweakSlider label="Corner radius" value={t.radius} min={4} max={26} step={2} unit="px"
        onChange={(v) => setTweak('radius', v)} />
      <TweakToggle label="Intel box glow" value={t.glow}
        onChange={(v) => setTweak('glow', v)} />
    </TweaksPanel>
  );
}

(function mountTweaks() {
  const mount = () => {
    const el = document.getElementById('tweaks-root');
    if (!el || !window.React || !window.ReactDOM || !window.useTweaks) { setTimeout(mount, 60); return; }
    ReactDOM.createRoot(el).render(<WegasTweaks />);
  };
  mount();
})();
