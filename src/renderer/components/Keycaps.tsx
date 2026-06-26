const keyLabels: Record<string, string> = {
  cmd: "⌘",
  command: "⌘",
  commandorcontrol: "⌘/Ctrl",
  ctrlorcmd: "⌘/Ctrl",
  ctrl: "⌃",
  control: "⌃",
  option: "⌥",
  alt: "⌥",
  shift: "⇧",
  enter: "Return",
  return: "Return",
  esc: "Esc",
  escape: "Esc",
  space: "Space",
  tab: "Tab",
  backquote: "`",
  slash: "/",
  backslash: "\\",
  leftbracket: "[",
  rightbracket: "]",
  comma: ",",
  period: ".",
  minus: "-",
  equal: "=",
  plus: "+",
  delete: "⌫",
  backspace: "⌫",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→"
};

function labelForKey(part: string): string {
  const normalized = part.replace(/\s+/g, "").toLowerCase();
  return keyLabels[normalized] ?? part;
}

function Combo({ combo }: { combo: string }) {
  const sequences = combo.split(/\s+/).filter(Boolean);

  return (
    <span className="combo" aria-label={combo}>
      {sequences.map((sequence, sequenceIndex) => (
        <span className="combo-sequence" key={`${combo}-${sequence}-${sequenceIndex}`}>
          {sequenceIndex > 0 ? <span className="combo-then">then</span> : null}
          {sequence.split("+").map((part) => (
            <kbd className="keycap" key={`${combo}-${sequence}-${part}`}>
              {labelForKey(part)}
            </kbd>
          ))}
        </span>
      ))}
    </span>
  );
}

export function Keycaps({ combos }: { combos: string[] }) {
  return (
    <div className="keycap-list">
      {combos.map((combo) => (
        <Combo combo={combo} key={combo} />
      ))}
    </div>
  );
}
