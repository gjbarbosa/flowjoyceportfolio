/* Flow With Joyce — Tweaks island. Mounts a small panel that themes the page. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#8B5E3C",
  "motion": "Cinematic",
  "mode": "Cream"
}/*EDITMODE-END*/;

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-dynamic", t.accent);
    root.setAttribute("data-mode", t.mode === "Espresso" ? "espresso" : "cream");
    const m = t.motion === "Off" ? 0 : t.motion === "Calm" ? 0.4 : 1;
    if (window.PORTFOLIO) window.PORTFOLIO.setMotion(m);
  }, [t.accent, t.mode, t.motion]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={["#8B5E3C", "#7A8C6E", "#C4956A", "#3A2214"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSection label="Atmosphere" />
      <TweakRadio
        label="Surface"
        value={t.mode}
        options={["Cream", "Espresso"]}
        onChange={(v) => setTweak("mode", v)}
      />
      <TweakSection label="Motion" />
      <TweakRadio
        label="Scroll"
        value={t.motion}
        options={["Calm", "Cinematic", "Off"]}
        onChange={(v) => setTweak("motion", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
