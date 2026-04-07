import logoImg from "@assets/logo.jpg";

export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoImg}
        alt="Cuidar & Crescer"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className={`font-sans font-bold ${className}`}>
        <div>
          <span style={{ color: "#F4BA7B" }}>c</span>
          <span style={{ color: "#9FAF88" }}>u</span>
          <span style={{ color: "#C56969" }}>i</span>
          <span style={{ color: "#60799E" }}>d</span>
          <span style={{ color: "#D7A392" }}>a</span>
          <span style={{ color: "#CAB7E9" }}>r</span>
          <span style={{ color: "#9FAF88" }}> &</span>
        </div>
        <div>
          <span style={{ color: "#60799E" }}>c</span>
          <span style={{ color: "#60799E" }}>r</span>
          <span style={{ color: "#D7A392" }}>e</span>
          <span style={{ color: "#9FAF88" }}>s</span>
          <span style={{ color: "#C56969" }}>c</span>
          <span style={{ color: "#F4BA7B" }}>e</span>
          <span style={{ color: "#60799E" }}>r</span>
        </div>
      </div>
    </div>
  );
}
