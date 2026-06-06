export default function DemoModal({ isOpen, onClose, videoUrl }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000
    }} onClick={onClose}>
      <div style={{ background:"white", borderRadius:"16px", padding:"20px", width:"640px", maxWidth:"90vw" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"14px" }}>
          <h3 style={{ fontSize:"16px", fontWeight:"700" }}>Démonstration SmartBuild</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer" }}>✕</button>
        </div>
        <iframe width="100%" height="360" src={videoUrl} frameBorder="0" allowFullScreen style={{ borderRadius:"10px" }} />
      </div>
    </div>
  );
}