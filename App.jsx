import { useState } from "react";

// ─── CLAVE API ────────────────────────────────────────────────────────────────
// IMPORTANTE: Reemplaza con tu clave real de Google Gemini
// Obtén una GRATIS en: aistudio.google.com → Get API Key
const GEMINI_API_KEY = "AIzaSyDkhaVyucyfVkP6r4aTtowYXwgjzMBBFIY";

// ─── DATOS SIMULADOS ──────────────────────────────────────────────────────────
// En producción: estos datos vienen del RPA que consulta sistemas reales PNP
const getMockVehiculo = (placa) => ({
  placa: placa || "ABC-123",
  propietario: "CARLOS MENDOZA QUISPE",
  marca: "TOYOTA", modelo: "YARIS", año: "2019", color: "BLANCO",
  soat: { estado: "VIGENTE", vence: "15/08/2025", aseguradora: "RIMAC" },
  tecnica: { estado: "VENCIDA", vencio: "03/01/2025" },
  papeletas: 2,
  requisitoria: false,
});

const getMockPersona = (dni) => ({
  dni: dni || "45678901",
  nombres: "CARLOS ALBERTO", apellidos: "MENDOZA QUISPE",
  fechaNac: "12/03/1985",
  direccion: "AV. BOLOGNESI 456, TACNA",
  estado: "ACTIVO",
  antecedentes: false,
  requisitoria: false,
  licencia: { categoria: "A-I", estado: "VIGENTE", vence: "2027" },
});

// ─── PROMPT DEL SISTEMA ───────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres un asistente especializado en redacción de documentos policiales peruanos para la Policía Nacional del Perú (PNP).

Tu tarea es redactar ACTAS DE INTERVENCIÓN POLICIAL en formato oficial PNP.

ESTRUCTURA OBLIGATORIA DEL ACTA:

1. ENCABEZADO:
   POLICÍA NACIONAL DEL PERÚ
   [UNIDAD / COMISARÍA]
   ACTA DE INTERVENCIÓN POLICIAL
   
2. APERTURA:
   "En [lugar], siendo las [hora] horas del día [fecha], el/la [grado y nombre del efectivo], 
   perteneciente a [unidad], en cumplimiento de sus funciones..."

3. HECHOS:
   Descripción detallada en tercera persona, formal, con datos exactos del vehículo y conductor.

4. INFRACCIONES DETECTADAS:
   Lista numerada de todas las infracciones encontradas.

5. RESULTADO DE CONSULTAS:
   Datos verificados en sistemas institucionales.

6. DISPOSICIÓN:
   Acción tomada: papeleta, acta de retención, citación, etc.

7. CIERRE:
   "En señal de conformidad, firman los intervinientes:"
   
   ________________________________    ________________________________
   [GRADO Y NOMBRE DEL EFECTIVO]        FIRMA DEL INTERVENIDO
   DNI:                                  DNI:
   
   HUELLA DIGITAL DEL INTERVENIDO: [  ]

REGLAS:
- Lenguaje formal técnico-policial peruano
- MAYÚSCULAS para nombres, lugares, documentos
- Tercera persona siempre
- Máximo 500 palabras
- Sin información inventada — solo lo que se te proporciona`;

// ─── COLORES ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0e14",
  surface: "#0f1520",
  card: "#141c2b",
  border: "#1e2d45",
  accent: "#00aaff",
  accentDim: "rgba(0,170,255,0.12)",
  accentBorder: "rgba(0,170,255,0.3)",
  danger: "#ff3b30",
  dangerDim: "rgba(255,59,48,0.12)",
  warn: "#ff9500",
  warnDim: "rgba(255,149,0,0.12)",
  success: "#30d158",
  successDim: "rgba(48,209,88,0.12)",
  text: "#e8edf5",
  textMid: "#8899aa",
  textDim: "#445566",
};

// ─── ESTILOS GLOBALES ─────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
    @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
    .fade-up { animation: fadeUp 0.3s ease forwards; }
    .btn { cursor:pointer; border:none; transition: all 0.18s ease; font-family:'Barlow Condensed',sans-serif; font-weight:700; letter-spacing:1.5px; }
    .btn:hover:not(:disabled) { filter:brightness(1.15); transform:translateY(-1px); }
    .btn:active:not(:disabled) { transform:translateY(0px); }
    .btn:disabled { cursor:not-allowed; opacity:0.5; }
    input:focus, textarea:focus { outline:none; }
    textarea { resize:none; }
    ::-webkit-scrollbar { width:3px; }
    ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:2px; }
  `}</style>
);

// ─── COMPONENTES REUTILIZABLES ────────────────────────────────────────────────
function Badge({ children, type = "neutral" }) {
  const map = {
    ok:      { bg: C.successDim, border: C.success, color: C.success },
    danger:  { bg: C.dangerDim,  border: C.danger,  color: C.danger  },
    warn:    { bg: C.warnDim,    border: C.warn,     color: C.warn    },
    neutral: { bg: C.accentDim,  border: C.accent,   color: C.accent  },
  };
  const s = map[type] || map.neutral;
  return (
    <span style={{
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      fontSize: 10, fontFamily: "'Barlow Condensed',sans-serif",
      fontWeight: 700, letterSpacing: 1.5, padding: "2px 8px", borderRadius: 3,
    }}>
      {children}
    </span>
  );
}

function DataRow({ label, value, alert }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "8px 0", borderBottom: `1px solid ${C.border}`,
    }}>
      <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'Source Code Pro',monospace" }}>{label}</span>
      <span style={{ fontSize: 13, color: alert ? C.danger : C.text, fontFamily: "'Source Code Pro',monospace", fontWeight: alert ? 700 : 400 }}>
        {value}
      </span>
    </div>
  );
}

function Card({ title, badge, borderColor, children }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${borderColor || C.border}`,
      borderRadius: 10, padding: "16px 18px", marginBottom: 12,
    }} className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800,
          fontSize: 12, letterSpacing: 2.5, color: borderColor || C.textMid, textTransform: "uppercase",
        }}>
          {title}
        </span>
        {badge}
      </div>
      {children}
    </div>
  );
}

function AlertBox({ type, title, message }) {
  const colors = {
    danger: { bg: C.dangerDim, border: C.danger, color: C.danger, icon: "🚨" },
    warn:   { bg: C.warnDim,   border: C.warn,   color: C.warn,   icon: "⚠️" },
    info:   { bg: C.accentDim, border: C.accent,  color: C.accent,  icon: "ℹ️" },
  };
  const s = colors[type] || colors.info;
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 8,
      padding: "12px 14px", marginBottom: 12, display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 16, lineHeight: 1.4 }}>{s.icon}</span>
      <div>
        <div style={{ fontSize: 12, color: s.color, fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 800, letterSpacing: 1 }}>{title}</div>
        {message && <div style={{ fontSize: 11, color: C.textMid, fontFamily: "'Source Code Pro',monospace", marginTop: 4, lineHeight: 1.5 }}>{message}</div>}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", maxLength, large, mono }) {
  const Tag = large ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 10, color: C.accent,
        fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 2.5,
        textTransform: "uppercase", marginBottom: 7,
      }}>
        {label}
      </label>
      <Tag
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        maxLength={maxLength}
        rows={large ? 5 : undefined}
        style={{
          width: "100%",
          background: C.card,
          border: `1px solid ${value ? C.accentBorder : C.border}`,
          borderRadius: 8,
          padding: "12px 14px",
          color: C.text,
          fontSize: mono ? 16 : 13,
          fontFamily: mono ? "'Barlow Condensed',sans-serif" : "'Source Code Pro',monospace",
          fontWeight: mono ? 700 : 400,
          letterSpacing: mono ? 3 : 0.5,
          lineHeight: 1.6,
          transition: "border-color 0.2s",
        }}
      />
    </div>
  );
}

// ─── PANTALLA: HOME ───────────────────────────────────────────────────────────
function HomeScreen({ onStart }) {
  const hora  = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  const fecha = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `2px solid ${C.accent}`, padding: "24px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.success, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 10, color: C.accent, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 3 }}>SISTEMA ACTIVO</span>
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 34, fontWeight: 800, color: C.text, lineHeight: 1, letterSpacing: 1 }}>
              COPILOTO<br />
              <span style={{ color: C.accent }}>PNP</span>
            </div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Source Code Pro',monospace", marginTop: 6 }}>
              Asistente de Intervención Policial
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 36, fontWeight: 800, color: C.text, lineHeight: 1 }}>{hora}</div>
            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Source Code Pro',monospace", marginTop: 5, textTransform: "capitalize", maxWidth: 120 }}>{fecha}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 18, flexWrap: "wrap" }}>
          {["CONSULTA VEHICULAR", "SISTEMA PNP", "PODER JUDICIAL", "IA ACTIVA"].map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 4, padding: "4px 8px",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.success, animation: `pulse ${1.5 + i * 0.3}s infinite` }} />
              <span style={{ fontSize: 9, color: C.textMid, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "24px 20px" }}>
        <button className="btn" onClick={onStart} style={{
          width: "100%", padding: "22px", borderRadius: 10,
          background: C.accent, color: "#000", fontSize: 20, letterSpacing: 2,
          marginBottom: 16, boxShadow: `0 4px 32px rgba(0,170,255,0.35)`,
        }}>
          ⊕ NUEVA INTERVENCIÓN
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { valor: "SOAT", sub: "Vigencia en tiempo real" },
            { valor: "ACTA", sub: "Redacción automática IA" },
            { valor: "DNI", sub: "Datos del intervenido" },
            { valor: "REQ.", sub: "Consulta requisitorias" },
          ].map((s, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 800, color: C.accent }}>{s.valor}</div>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Source Code Pro',monospace", marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <AlertBox
          type="info"
          title="VERSIÓN BETA · PROTOTIPO"
          message="Consultas en modo simulación. La redacción de actas usa IA real. Datos reales disponibles en la versión de producción."
        />
      </div>
    </div>
  );
}

// ─── PANTALLA: FORMULARIO ─────────────────────────────────────────────────────
function FormScreen({ onConsultar, loading }) {
  const [placa,     setPlaca]     = useState("");
  const [dni,       setDni]       = useState("");
  const [situacion, setSituacion] = useState("");
  const [efectivo,  setEfectivo]  = useState("");
  const [unidad,    setUnidad]    = useState("");

  const listo = placa.length >= 6 || dni.length === 8;

  return (
    <div style={{ padding: "20px" }} className="fade-up">
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: 1 }}>
          DATOS DE INTERVENCIÓN
        </div>
        <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Source Code Pro',monospace", marginTop: 4 }}>
          Mínimo una placa o DNI para continuar
        </div>
      </div>

      <Input label="Tu grado y nombre" value={efectivo} onChange={setEfectivo}
        placeholder="ej: SO PNP GABRIEL FLORES MAMANI" />

      <Input label="Unidad / Comisaría" value={unidad} onChange={setUnidad}
        placeholder="ej: COMISARÍA PNP TACNA" />

      <Input label="Placa vehicular" value={placa} onChange={v => setPlaca(v.toUpperCase())}
        placeholder="ABC-123" maxLength={8} mono />

      <Input label="DNI del intervenido" value={dni} onChange={v => setDni(v.replace(/\D/g, ""))}
        placeholder="12345678" maxLength={8} />

      <Input label="Descripción de hechos · habla con naturalidad"
        value={situacion} onChange={setSituacion}
        placeholder="ej: Intervengo vehículo en Av. Bolognesi altura 400, conductor no portaba brevete, vehículo sin SOAT vigente, conducía a exceso de velocidad..."
        large />

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 16, color: C.accent, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 2, animation: "pulse 1s infinite" }}>
            ⟳ CONSULTANDO SISTEMAS...
          </div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Source Code Pro',monospace", marginTop: 8 }}>
            Verificando placa · persona · requisitorias
          </div>
        </div>
      ) : (
        <button className="btn" onClick={() => onConsultar({ placa, dni, situacion, efectivo, unidad })}
          disabled={!listo}
          style={{
            width: "100%", padding: "18px", borderRadius: 8,
            background: listo ? C.accent : C.border,
            color: listo ? "#000" : C.textDim,
            fontSize: 16, letterSpacing: 2,
          }}>
          ⊕ CONSULTAR Y GENERAR ACTA
        </button>
      )}
    </div>
  );
}

// ─── PANTALLA: RESULTADOS ─────────────────────────────────────────────────────
function ResultadosScreen({ vehiculo, persona, acta, loadingActa }) {
  const [tab,    setTab]    = useState("vehiculo");
  const [copied, setCopied] = useState(false);

  const copiar = () => {
    if (!acta) return;
    navigator.clipboard.writeText(acta).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const tabs = [
    { key: "vehiculo", label: "VEHÍCULO" },
    { key: "persona",  label: "PERSONA"  },
    { key: "acta",     label: "ACTA IA"  },
  ];

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        {tabs.map(t => (
          <button key={t.key} className="btn" onClick={() => setTab(t.key)} style={{
            padding: "14px 0", fontSize: 12, letterSpacing: 2,
            background: "transparent",
            color: tab === t.key ? C.accent : C.textDim,
            borderBottom: tab === t.key ? `2px solid ${C.accent}` : "2px solid transparent",
            borderRadius: 0,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 20px" }}>

        {/* TAB VEHÍCULO */}
        {tab === "vehiculo" && (
          <div className="fade-up">
            {vehiculo.tecnica.estado === "VENCIDA" && (
              <AlertBox type="danger" title={`REVISIÓN TÉCNICA VENCIDA DESDE ${vehiculo.tecnica.vencio}`} />
            )}
            {vehiculo.requisitoria && (
              <AlertBox type="danger" title="VEHÍCULO CON REQUISITORIA — RETENER" />
            )}

            <Card title="Datos del Vehículo" borderColor={C.accent}>
              <DataRow label="PLACA"       value={vehiculo.placa} />
              <DataRow label="PROPIETARIO" value={vehiculo.propietario} />
              <DataRow label="MARCA"       value={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`} />
              <DataRow label="COLOR"       value={vehiculo.color} />
            </Card>

            <Card title="SOAT"
              borderColor={vehiculo.soat.estado === "VIGENTE" ? C.success : C.danger}
              badge={<Badge type={vehiculo.soat.estado === "VIGENTE" ? "ok" : "danger"}>{vehiculo.soat.estado}</Badge>}>
              <DataRow label="ESTADO"      value={vehiculo.soat.estado} alert={vehiculo.soat.estado !== "VIGENTE"} />
              <DataRow label="VENCIMIENTO" value={vehiculo.soat.vence} />
              <DataRow label="ASEGURADORA" value={vehiculo.soat.aseguradora} />
            </Card>

            <Card title="Revisión Técnica"
              borderColor={vehiculo.tecnica.estado === "VENCIDA" ? C.danger : C.success}
              badge={<Badge type={vehiculo.tecnica.estado === "VENCIDA" ? "danger" : "ok"}>{vehiculo.tecnica.estado}</Badge>}>
              <DataRow label="ESTADO"   value={vehiculo.tecnica.estado} alert={vehiculo.tecnica.estado === "VENCIDA"} />
              {vehiculo.tecnica.vencio && <DataRow label="VENCIÓ EL" value={vehiculo.tecnica.vencio} alert />}
            </Card>

            <Card title="Infracciones y Requisitorias">
              <DataRow label="PAPELETAS PENDIENTES"  value={`${vehiculo.papeletas} multa(s)`} alert={vehiculo.papeletas > 0} />
              <DataRow label="REQUISITORIA VEHICULAR" value={vehiculo.requisitoria ? "SÍ — RETENER" : "NO REGISTRA"} alert={vehiculo.requisitoria} />
            </Card>
          </div>
        )}

        {/* TAB PERSONA */}
        {tab === "persona" && (
          <div className="fade-up">
            {persona.requisitoria && (
              <AlertBox type="danger" title="PERSONA CON REQUISITORIA VIGENTE" message="PROCEDER A DETENCIÓN INMEDIATA — Comunicar a Central." />
            )}
            {persona.antecedentes && (
              <AlertBox type="warn" title="REGISTRA ANTECEDENTES POLICIALES" />
            )}

            <Card title="Datos RENIEC" borderColor={C.accent}>
              <DataRow label="DNI"        value={persona.dni} />
              <DataRow label="NOMBRES"    value={persona.nombres} />
              <DataRow label="APELLIDOS"  value={persona.apellidos} />
              <DataRow label="FECHA NAC." value={persona.fechaNac} />
              <DataRow label="DOMICILIO"  value={persona.direccion} />
            </Card>

            <Card title="Licencia de Conducir"
              borderColor={persona.licencia.estado === "VIGENTE" ? C.success : C.danger}
              badge={<Badge type={persona.licencia.estado === "VIGENTE" ? "ok" : "danger"}>{persona.licencia.estado}</Badge>}>
              <DataRow label="CATEGORÍA" value={persona.licencia.categoria} />
              <DataRow label="ESTADO"    value={persona.licencia.estado} alert={persona.licencia.estado !== "VIGENTE"} />
              <DataRow label="VENCE"     value={persona.licencia.vence} />
            </Card>

            <Card title="Sistema PNP — Antecedentes">
              <DataRow label="ANTECEDENTES"  value={persona.antecedentes ? "REGISTRA" : "NO REGISTRA"} alert={persona.antecedentes} />
              <DataRow label="REQUISITORIA"  value={persona.requisitoria ? "SÍ — URGENTE" : "NO REGISTRA"} alert={persona.requisitoria} />
            </Card>
          </div>
        )}

        {/* TAB ACTA */}
        {tab === "acta" && (
          <div className="fade-up">
            {loadingActa ? (
              <div style={{ textAlign: "center", padding: "50px 0" }}>
                <div style={{
                  width: 40, height: 40, border: `3px solid ${C.border}`,
                  borderTop: `3px solid ${C.accent}`, borderRadius: "50%",
                  margin: "0 auto 20px", animation: "spin 1s linear infinite",
                }} />
                <div style={{ fontSize: 16, color: C.accent, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 2 }}>
                  GENERANDO ACTA CON IA...
                </div>
                <div style={{ fontSize: 11, color: C.textDim, fontFamily: "'Source Code Pro',monospace", marginTop: 8 }}>
                  Aplicando formato PNP · Redactando hechos
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, fontWeight: 800, color: C.text, letterSpacing: 1 }}>
                      ACTA GENERADA
                    </div>
                    <div style={{ fontSize: 10, color: C.textDim, fontFamily: "'Source Code Pro',monospace" }}>
                      Revisar antes de imprimir · editable
                    </div>
                  </div>
                  <button className="btn" onClick={copiar} style={{
                    background: copied ? C.successDim : C.accentDim,
                    border: `1px solid ${copied ? C.success : C.accent}`,
                    color: copied ? C.success : C.accent,
                    padding: "8px 14px", borderRadius: 6, fontSize: 12, letterSpacing: 1,
                  }}>
                    {copied ? "✓ COPIADO" : "⎘ COPIAR"}
                  </button>
                </div>

                <div style={{
                  background: "#fff", borderRadius: 8, padding: "20px",
                  fontFamily: "'Source Code Pro',monospace",
                  fontSize: 12, color: "#111", lineHeight: 1.85,
                  whiteSpace: "pre-wrap", border: `1px solid ${C.border}`,
                }}>
                  {acta}
                </div>

                <AlertBox
                  type="warn"
                  title="REVISAR ANTES DE FIRMAR"
                  message="Verifica datos del intervenido, hora y lugar. La IA puede cometer errores. El efectivo es responsable del contenido final."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function App() {
  const [pantalla,    setPantalla]    = useState("home");
  const [loading,     setLoading]     = useState(false);
  const [loadingActa, setLoadingActa] = useState(false);
  const [acta,        setActa]        = useState("");
  const [vehiculo,    setVehiculo]    = useState(null);
  const [persona,     setPersona]     = useState(null);

  const handleConsultar = async ({ placa, dni, situacion, efectivo, unidad }) => {
    setLoading(true);

    // Simula delay de consulta a sistemas (en producción: RPA real)
    await new Promise(r => setTimeout(r, 2000));

    const v = getMockVehiculo(placa);
    const p = getMockPersona(dni);
    setVehiculo(v);
    setPersona(p);
    setLoading(false);
    setPantalla("resultados");
    setLoadingActa(true);

    // Genera acta real con Claude API
    try {
      const hora  = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
      const fecha = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });

      const userPrompt = `
DATOS PARA EL ACTA:

EFECTIVO: ${efectivo || "SO PNP (nombre pendiente)"}
UNIDAD: ${unidad || "COMISARÍA PNP"}
FECHA: ${fecha}
HORA: ${hora}

VEHÍCULO:
- Placa: ${v.placa}
- Propietario: ${v.propietario}
- Marca/Modelo: ${v.marca} ${v.modelo} ${v.año} color ${v.color}
- SOAT: ${v.soat.estado} — vence ${v.soat.vence} (${v.soat.aseguradora})
- Revisión Técnica: ${v.tecnica.estado}${v.tecnica.vencio ? ` — venció el ${v.tecnica.vencio}` : ""}
- Papeletas pendientes: ${v.papeletas}
- Requisitoria vehicular: ${v.requisitoria ? "SÍ" : "NO"}

INTERVENIDO:
- DNI: ${p.dni}
- Nombres y apellidos: ${p.nombres} ${p.apellidos}
- Fecha de nacimiento: ${p.fechaNac}
- Domicilio: ${p.direccion}
- Licencia: Categoría ${p.licencia.categoria} — ${p.licencia.estado} hasta ${p.licencia.vence}
- Antecedentes policiales: ${p.antecedentes ? "REGISTRA" : "NO REGISTRA"}
- Requisitoria: ${p.requisitoria ? "SÍ — DETENER" : "NO REGISTRA"}

HECHOS NARRADOS POR EL EFECTIVO:
${situacion || "Intervención de tránsito. Conductor no portaba brevete. Vehículo con revisión técnica vencida."}

Redacta el acta oficial completa.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { maxOutputTokens: 1024, temperature: 0.3 },
          }),
        }
      );

      const data = await res.json();
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setActa(texto || "Error al generar el acta. Intenta nuevamente.");
    } catch (err) {
      setActa("Error de conexión. Verifica tu internet e intenta nuevamente.");
    } finally {
      setLoadingActa(false);
    }
  };

  const volver = () => {
    if (pantalla === "resultados") setPantalla("form");
    else setPantalla("home");
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>
      <GlobalStyles />

      {/* Barra superior */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: C.bg, borderBottom: `1px solid ${C.border}`,
        padding: "10px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {pantalla !== "home" && (
            <button className="btn" onClick={volver} style={{
              background: C.card, border: `1px solid ${C.border}`,
              color: C.textMid, padding: "6px 12px", borderRadius: 6, fontSize: 14,
            }}>← Volver</button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accent, animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: C.textMid, letterSpacing: 2 }}>
              COPILOTO PNP
            </span>
          </div>
        </div>
        <span style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 10, color: C.textDim }}>
          BETA v0.1
        </span>
      </div>

      {/* Pantallas */}
      {pantalla === "home"       && <HomeScreen onStart={() => setPantalla("form")} />}
      {pantalla === "form"       && <FormScreen onConsultar={handleConsultar} loading={loading} />}
      {pantalla === "resultados" && vehiculo && persona && (
        <ResultadosScreen
          vehiculo={vehiculo}
          persona={persona}
          acta={acta}
          loadingActa={loadingActa}
        />
      )}
    </div>
  );
}
