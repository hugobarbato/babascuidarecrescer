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
          <span style={{ color: "#F0B478" }}>c</span>
          <span style={{ color: "#96A587" }}>u</span>
          <span style={{ color: "#B46969" }}>i</span>
          <span style={{ color: "#5A7896" }}>d</span>
          <span style={{ color: "#D29687" }}>a</span>
          <span style={{ color: "#C3C3E1" }}>r</span>
          <span style={{ color: "#96A587" }}> &</span>
        </div>
        <div>
          <span style={{ color: "#5A7896" }}>c</span>
          <span style={{ color: "#5A7896" }}>r</span>
          <span style={{ color: "#D29687" }}>e</span>
          <span style={{ color: "#96A587" }}>s</span>
          <span style={{ color: "#B46969" }}>c</span>
          <span style={{ color: "#F0B478" }}>e</span>
          <span style={{ color: "#5A7896" }}>r</span>
        </div>
      </div>
    </div>
  );
}
