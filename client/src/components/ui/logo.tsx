import logoImg from "@assets/logo.jpg";

export function Logo({ className = "text-2xl" }: { className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={logoImg}
        alt="Cuidar & Crescer"
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className={`font-bold ${className}`}>
        <div>
          <span className="text-coral">c</span>
          <span className="text-sage">u</span>
          <span className="text-soft-pink">i</span>
          <span className="text-soft-blue">d</span>
          <span className="text-coral">a</span>
          <span className="text-soft-purple">r</span>
          <span className="text-sage"> &</span>
        </div>
        <div>
          <span className="text-soft-blue">c</span>
          <span className="text-soft-purple">r</span>
          <span className="text-coral">e</span>
          <span className="text-sage">s</span>
          <span className="text-soft-pink">c</span>
          <span className="text-coral">e</span>
          <span className="text-soft-blue">r</span>
        </div>
      </div>
    </div>
  );
}
