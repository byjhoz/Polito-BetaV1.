import { useState } from "react";

const GEMINI_API_KEY = "AIzaSyDkhaVyucyfVkP6r4aTtowYXwgjzMBBFIY";

const FORMATOS_PNP = {
  INTERVENCION: `ACTA DE INTERVENCIÓN POLICIAL

En la ciudad de {ciudad}, siendo las {hora} horas del día {fecha}, en el lugar ubicado en {lugar}, presente el instructor, procede a dar lectura de los derechos que le asiste a la persona de {nombre_intervenido}, con {edad} años de edad, natural de {naturaleza}, estado civil {estado_civil}, de ocupación {ocupacion}, con instrucción {instruccion}, identificado con DNI {dni}, domiciliado en {domicilio}.

A quien se le informó expresamente que el motivo de la intervención es:
{motivo_intervencion}

A continuación se le puso en conocimiento los derechos que le asisten y que se encuentran contenidos en el artículo 71° del Código Procesal Penal, adjuntándose los siguientes documentos:
{documentos_adjuntos}

Finalmente, la persona intervenida es puesta a disposición, con las Actas antes señaladas, para las investigaciones que correspondan.

Siendo las {hora_conclusion} horas del mismo día, se dio por concluido la presente, firmando los participantes en señal de conformidad.


        PERSONAL PNP                                    EL INTERVENIDO


_________________________________           _________________________________
{grado_efectivo}
{nombre_efectivo}
CIP: {cip_efectivo}

Nota: En caso de negarse a firmar colocar "se negó a firmar".`,

  DETENCION: `ACTA DE DETENCIÓN

En la ciudad de {ciudad}, Distrito de {distrito}, siendo las {hora} horas, del día {fecha}, en el lugar ubicado en {lugar}, presente la persona de {nombre_intervenido} con {edad} años de edad, natural de {naturaleza}, estado civil {estado_civil}, de ocupación {ocupacion}, identificado con DNI {dni}, domiciliado en {domicilio}, a quien se le notifica que se encuentra DETENIDO en flagrante delito contemplado en la Constitución Política del Perú, Artículo 2°, Inciso 24°, Numeral "f", y Artículo 259° del Código Procesal Penal, por motivo de:
{motivo_detencion}

Que en dicha condición se le da lectura (Art. 120.4 CPP) de los siguientes derechos (Art. 71.2 CPP):
1. Que puede hacer valer por sí mismo, o a través de su Abogado Defensor, los derechos que la Constitución y las Leyes le conceden, desde el inicio de las primeras diligencias de investigación hasta la culminación del proceso.
2. Conocer los cargos formulados en su contra y, en caso de detención, a que se le exprese la causa o motivo de dicha medida.
3. Designar a la persona o institución a la que debe comunicarse su detención y que dicha comunicación se haga en forma inmediata.
4. Ser asistido desde los actos iniciales de investigación por un Abogado Defensor.
5. Abstenerse de declarar, y si acepta hacerlo, a que su Abogado Defensor esté presente en su declaración.
6. Que no se emplee en su contra medios coactivos, intimidatorios o contrarios a su dignidad.
7. Ser examinado por un médico legista o en su defecto por otro profesional de la salud, cuando su estado de salud así lo requiera.

Siendo las {hora_conclusion} horas del {fecha} se da por concluida la presente.


           ENTERADO                                  POLICÍA INTERVINIENTE


FIRMA: ___________________________           _________________________________
NOMBRES: ________________________            {grado_efectivo}
DNI N°: _________________________            {nombre_efectivo}
FECHA: _________ HORA: __________            CIP: {cip_efectivo}

Nota: En caso de negarse a firmar colocar "se negó a firmar".`,

  REGISTRO_PERSONAL: `ACTA DE REGISTRO PERSONAL E INCAUTACIÓN

En la ciudad de {ciudad}, siendo las {hora} horas del día {fecha}, en el lugar ubicado en {lugar}, el Instructor Policial que suscribe, procede al REGISTRO PERSONAL del imputado {nombre_intervenido}, de {edad} años de edad, natural de {naturaleza}, estado civil {estado_civil}, ocupación {ocupacion}, identificado con DNI {dni}, domiciliado en {domicilio}.

De conformidad con el Artículo 210° del Código Procesal Penal, se le invita al imputado a que exhiba y entregue el bien buscado. Antes de iniciar el registro se expresó al intervenido las razones de su ejecución, y se le procedió a informar del derecho que tiene de hacerse asistir en ese acto por una persona de su confianza.

Procediendo con el registro personal con el siguiente resultado:
{resultado_registro}

Observaciones:
{observaciones}

Leída la presente, se firma en señal de conformidad por los presentes a las {hora_conclusion} horas, del día de la fecha.


       EL INSTRUCTOR                                          EL IMPUTADO


_________________________________           _________________________________
{grado_efectivo}
{nombre_efectivo}
CIP: {cip_efectivo}

Nota: En caso de negarse a firmar colocar "se negó a firmar".`,

  REGISTRO_VEHICULO: `ACTA DE REGISTRO DE VEHÍCULO E INCAUTACIÓN

En la ciudad de {ciudad}, Distrito {distrito}, siendo las {hora} horas, del {fecha}, sito en {lugar}, el instructor policial que suscribe {grado_efectivo} {nombre_efectivo}, identificado con CIP {cip_efectivo}, perteneciente a la unidad {unidad}, en presencia del imputado {nombre_intervenido}, identificado con DNI {dni}, edad {edad} años, natural de {naturaleza}, estado civil {estado_civil}, ocupación {ocupacion}, domiciliado en {domicilio}; procede a realizar la presente diligencia de registro vehicular en el vehículo marca {marca_vehiculo} de placa {placa}, color {color_vehiculo}, en las circunstancias siguientes:

{circunstancias}

Procediendo a incautar lo siguiente:
{bienes_incautados}

Leída la presente se firma en señal de conformidad por los presentes a las {hora_conclusion} horas del día de la fecha.


          EL INSTRUCTOR                                        EL IMPUTADO


_________________________________           _________________________________
{grado_efectivo}
{nombre_efectivo}
CIP: {cip_efectivo}

*Adjuntar el acta de situación vehicular`
};

const buildSystemPrompt = (tipoActa) => `Eres un experto en documentación policial peruana. Redactas documentos oficiales según el Manual de Documentación Policial 2016 de la PNP (R.D. N°776-2016-DIRGEN/EMG-PNP).

TIPO DE DOCUMENTO: ${tipoActa}

PLANTILLA OFICIAL:
${FORMATOS_PNP[tipoActa]}

REGLAS:
- Usa EXACTAMENTE la estructura de la plantilla
- Reemplaza todos los campos {campo} con los datos reales
- MAYÚSCULAS para nombres, cargos, documentos y lugares
- Tercera persona siempre
- Si falta un dato usa "NO ESPECIFICADO"
- Nunca inventes datos no proporcionados
- No modifiques los artículos legales de la plantilla`;

const getMockVehiculo = (placa) => ({
  placa: placa?.toUpperCase() || "ABC-123",
  propietario: "CARLOS MENDOZA QUISPE",
  marca: "TOYOTA", modelo: "YARIS", año: "2019", color: "BLANCO",
  soat: { estado: "VIGENTE", vence: "15/08/2025", aseguradora: "RIMAC" },
  tecnica: { estado: "VENCIDA", vencio: "03/01/2025" },
  papeletas: 2, requisitoria: false,
});

const getMockPersona = (dni) => ({
  dni: dni || "45678901",
  nombres: "CARLOS ALBERTO", apellidos: "MENDOZA QUISPE",
  fechaNac: "12/03/1985", edad: "40",
  naturaleza: "TACNA", estadoCivil: "SOLTERO",
  ocupacion: "COMERCIANTE", instruccion: "SECUNDARIA",
  direccion: "AV. BOLOGNESI 456, TACNA",
  antecedentes: false, requisitoria: false,
  licencia: { categoria: "A-I", estado: "VIGENTE", vence: "2027" },
});

const C = {
  bg:"#0a0e14",surface:"#0f1520",card:"#141c2b",border:"#1e2d45",
  accent:"#00aaff",accentDim:"rgba(0,170,255,0.1)",accentBorder:"rgba(0,170,255,0.3)",
  danger:"#ff3b30",dangerDim:"rgba(255,59,48,0.1)",
  warn:"#ff9500",warnDim:"rgba(255,149,0,0.1)",
  success:"#30d158",successDim:"rgba(48,209,88,0.1)",
  text:"#e8edf5",textMid:"#8899aa",textDim:"#445566",
};

const G = () => (<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Source+Code+Pro:wght@400;500;600&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .fu{animation:fadeUp 0.3s ease forwards}
  .btn{cursor:pointer;border:none;transition:all 0.18s ease;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:1.5px}
  .btn:hover:not(:disabled){filter:brightness(1.15);transform:translateY(-1px)}
  .btn:active:not(:disabled){transform:translateY(0)}
  .btn:disabled{cursor:not-allowed;opacity:0.45}
  input:focus,textarea:focus{outline:none}
  textarea{resize:none}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
`}</style>);

const Badge = ({t="n",children}) => {
  const m={ok:[C.successDim,C.success],danger:[C.dangerDim,C.danger],warn:[C.warnDim,C.warn],n:[C.accentDim,C.accent]};
  const [bg,cl]=m[t]||m.n;
  return <span style={{background:bg,border:`1px solid ${cl}`,color:cl,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1.5,padding:"2px 8px",borderRadius:3}}>{children}</span>;
};

const Row = ({label,value,alert}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
    <span style={{fontSize:11,color:C.textDim,fontFamily:"'Source Code Pro',monospace"}}>{label}</span>
    <span style={{fontSize:12,color:alert?C.danger:C.text,fontFamily:"'Source Code Pro',monospace",fontWeight:alert?700:400,textAlign:"right",maxWidth:"60%"}}>{value}</span>
  </div>
);

const Card = ({title,badge,bc,children}) => (
  <div className="fu" style={{background:C.card,border:`1px solid ${bc||C.border}`,borderRadius:10,padding:"16px 18px",marginBottom:12}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,letterSpacing:2.5,color:bc||C.textMid,textTransform:"uppercase"}}>{title}</span>
      {badge}
    </div>
    {children}
  </div>
);

const Alerta = ({tipo,titulo,msg}) => {
  const m={danger:[C.dangerDim,C.danger,"🚨"],warn:[C.warnDim,C.warn,"⚠️"],info:[C.accentDim,C.accent,"ℹ️"]};
  const [bg,cl,ic]=m[tipo]||m.info;
  return (
    <div style={{background:bg,border:`1px solid ${cl}`,borderRadius:8,padding:"12px 14px",marginBottom:12,display:"flex",gap:10,alignItems:"flex-start"}}>
      <span style={{fontSize:16}}>{ic}</span>
      <div>
        <div style={{fontSize:12,color:cl,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,letterSpacing:1}}>{titulo}</div>
        {msg&&<div style={{fontSize:11,color:C.textMid,fontFamily:"'Source Code Pro',monospace",marginTop:4,lineHeight:1.5}}>{msg}</div>}
      </div>
    </div>
  );
};

const Inp = ({label,value,onChange,placeholder,maxLen,rows,mono}) => {
  const Tag=rows?"textarea":"input";
  return (
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontSize:10,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2.5,textTransform:"uppercase",marginBottom:6}}>{label}</label>
      <Tag value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} maxLength={maxLen} rows={rows}
        style={{width:"100%",background:C.card,border:`1px solid ${value?C.accentBorder:C.border}`,borderRadius:8,padding:"11px 13px",color:C.text,fontSize:mono?17:13,fontFamily:mono?"'Barlow Condensed',sans-serif":"'Source Code Pro',monospace",fontWeight:mono?700:400,letterSpacing:mono?3:0.3,lineHeight:1.6,transition:"border-color 0.2s"}}/>
    </div>
  );
};

function Home({onStart}) {
  const hora=new Date().toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"});
  const fecha=new Date().toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long"});
  return (
    <div className="fu">
      <div style={{background:C.surface,borderBottom:`2px solid ${C.accent}`,padding:"24px 20px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:C.success,animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:10,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:3}}>SISTEMA ACTIVO</span>
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:34,fontWeight:800,color:C.text,lineHeight:1,letterSpacing:1}}>
              COPILOTO<br/><span style={{color:C.accent}}>PNP</span>
            </div>
            <div style={{fontSize:10,color:C.textDim,fontFamily:"'Source Code Pro',monospace",marginTop:6}}>Manual Doc. Policial 2016 · R.D. N°776-2016</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:800,color:C.text,lineHeight:1}}>{hora}</div>
            <div style={{fontSize:10,color:C.textDim,fontFamily:"'Source Code Pro',monospace",marginTop:5,textTransform:"capitalize",maxWidth:130}}>{fecha}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,marginTop:18,flexWrap:"wrap"}}>
          {["CONSULTA VEHICULAR","SISTEMA PNP","PODER JUDICIAL","FORMATO OFICIAL 2016"].map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:5,background:C.card,border:`1px solid ${C.border}`,borderRadius:4,padding:"4px 8px"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:C.success,animation:`pulse ${1.5+i*0.3}s infinite`}}/>
              <span style={{fontSize:9,color:C.textMid,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{padding:"24px 20px"}}>
        <button className="btn" onClick={onStart} style={{width:"100%",padding:"22px",borderRadius:10,background:C.accent,color:"#000",fontSize:20,letterSpacing:2,marginBottom:16,boxShadow:`0 4px 32px rgba(0,170,255,0.35)`}}>
          ⊕ NUEVA INTERVENCIÓN
        </button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[{v:"CONSULTA",s:"Placa · DNI · Requisitorias"},{v:"DECISIÓN",s:"Tú decides si hay acta"},{v:"ACTAS",s:"Formato oficial PNP 2016"},{v:"MÚLTIPLE",s:"Varios pasajeros/DNIs"}].map((s,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 16px"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:C.accent}}>{s.v}</div>
              <div style={{fontSize:10,color:C.textDim,fontFamily:"'Source Code Pro',monospace",marginTop:3}}>{s.s}</div>
            </div>
          ))}
        </div>
        <Alerta tipo="info" titulo="FLUJO REAL DE INTERVENCIÓN" msg="Primero consultas datos. Tú verificas la situación en campo. Luego decides: control simple sin acta, o formulas el documento correspondiente."/>
      </div>
    </div>
  );
}

function Consulta({onConsultar,loading}) {
  const [placa,setPlaca]=useState("");
  const [dnis,setDnis]=useState([""]);
  const [efectivo,setEfectivo]=useState("");
  const [unidad,setUnidad]=useState("");
  const [lugar,setLugar]=useState("");

  const addDni=()=>{if(dnis.length<5)setDnis([...dnis,""])};
  const updDni=(i,v)=>{const n=[...dnis];n[i]=v.replace(/\D/g,"").slice(0,8);setDnis(n)};
  const remDni=(i)=>{if(dnis.length>1)setDnis(dnis.filter((_,j)=>j!==i))};
  const listo=placa.length>=6||dnis.some(d=>d.length===8);

  return (
    <div style={{padding:"20px"}} className="fu">
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:800,color:C.text,letterSpacing:1}}>CONSULTA DE INTERVENCIÓN</div>
        <div style={{fontSize:11,color:C.textDim,fontFamily:"'Source Code Pro',monospace",marginTop:4}}>Ingresa los datos disponibles en campo</div>
      </div>
      <Inp label="Tu grado y nombre completo" value={efectivo} onChange={setEfectivo} placeholder="ej: SO PNP GABRIEL FLORES MAMANI"/>
      <Inp label="Unidad / Comisaría" value={unidad} onChange={setUnidad} placeholder="ej: COMISARÍA PNP TACNA"/>
      <Inp label="Lugar de intervención" value={lugar} onChange={setLugar} placeholder="ej: AV. BOLOGNESI CUADRA 4, TACNA"/>
      <Inp label="Placa vehicular" value={placa} onChange={v=>setPlaca(v.toUpperCase())} placeholder="ABC-123" maxLen={8} mono/>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <label style={{fontSize:10,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2.5}}>DNI(S) DE INTERVENIDOS</label>
          <button className="btn" onClick={addDni} style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,color:C.accent,padding:"4px 10px",borderRadius:5,fontSize:11}}>+ Agregar</button>
        </div>
        {dnis.map((d,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8}}>
            <input value={d} onChange={e=>updDni(i,e.target.value)} placeholder={`DNI ${i===0?"conductor":`pasajero ${i}`}`} maxLength={8}
              style={{flex:1,background:C.card,border:`1px solid ${d.length===8?C.accentBorder:C.border}`,borderRadius:8,padding:"11px 13px",color:C.text,fontSize:15,fontFamily:"'Source Code Pro',monospace",letterSpacing:3}}/>
            {dnis.length>1&&<button className="btn" onClick={()=>remDni(i)} style={{background:C.dangerDim,border:`1px solid ${C.danger}`,color:C.danger,padding:"0 12px",borderRadius:8,fontSize:16}}>×</button>}
          </div>
        ))}
      </div>
      {loading?(
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:16,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,animation:"pulse 1s infinite"}}>⟳ CONSULTANDO SISTEMAS...</div>
        </div>
      ):(
        <button className="btn" onClick={()=>onConsultar({placa,dnis:dnis.filter(d=>d.length===8),efectivo,unidad,lugar})} disabled={!listo}
          style={{width:"100%",padding:"18px",borderRadius:8,background:listo?C.accent:C.border,color:listo?"#000":C.textDim,fontSize:16,letterSpacing:2}}>
          ⊕ CONSULTAR DATOS
        </button>
      )}
    </div>
  );
}

function Verificacion({datos,onDecision}) {
  const {vehiculo,personas,efectivo,unidad,lugar}=datos;
  const [tab,setTab]=useState("vehiculo");
  const [situacion,setSituacion]=useState("");
  const hayAlerta=vehiculo?.requisitoria||personas.some(p=>p.requisitoria);
  const tieneInfr=vehiculo?.tecnica?.estado==="VENCIDA"||vehiculo?.soat?.estado!=="VIGENTE"||vehiculo?.papeletas>0;

  return (
    <div className="fu">
      <div style={{display:"grid",gridTemplateColumns:`repeat(${1+personas.length},1fr)`,background:C.surface,borderBottom:`1px solid ${C.border}`}}>
        <button className="btn" onClick={()=>setTab("vehiculo")} style={{padding:"13px 0",fontSize:11,letterSpacing:1.5,background:"transparent",color:tab==="vehiculo"?C.accent:C.textDim,borderBottom:tab==="vehiculo"?`2px solid ${C.accent}`:"2px solid transparent",borderRadius:0}}>VEHÍCULO</button>
        {personas.map((p,i)=>(
          <button key={i} className="btn" onClick={()=>setTab(`p${i}`)} style={{padding:"13px 0",fontSize:11,letterSpacing:1.5,background:"transparent",color:tab===`p${i}`?(p.requisitoria?C.danger:C.accent):C.textDim,borderBottom:tab===`p${i}`?`2px solid ${p.requisitoria?C.danger:C.accent}`:"2px solid transparent",borderRadius:0}}>
            {p.requisitoria?"🚨 ":""}{i===0?"CONDUCTOR":`PASAJ.${i}`}
          </button>
        ))}
      </div>
      <div style={{padding:"16px 20px"}}>
        {tab==="vehiculo"&&vehiculo&&(
          <div>
            {vehiculo.requisitoria&&<Alerta tipo="danger" titulo="VEHÍCULO CON REQUISITORIA — RETENER"/>}
            {vehiculo.tecnica.estado==="VENCIDA"&&<Alerta tipo="danger" titulo={`REVISIÓN TÉCNICA VENCIDA DESDE ${vehiculo.tecnica.vencio}`}/>}
            <Card title="Datos del Vehículo" bc={C.accent}>
              <Row label="PLACA" value={vehiculo.placa}/>
              <Row label="PROPIETARIO" value={vehiculo.propietario}/>
              <Row label="MARCA/MODELO" value={`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`}/>
              <Row label="COLOR" value={vehiculo.color}/>
            </Card>
            <Card title="SOAT" badge={<Badge t={vehiculo.soat.estado==="VIGENTE"?"ok":"danger"}>{vehiculo.soat.estado}</Badge>} bc={vehiculo.soat.estado==="VIGENTE"?C.success:C.danger}>
              <Row label="ESTADO" value={vehiculo.soat.estado} alert={vehiculo.soat.estado!=="VIGENTE"}/>
              <Row label="VENCE" value={vehiculo.soat.vence}/>
              <Row label="ASEGURADORA" value={vehiculo.soat.aseguradora}/>
            </Card>
            <Card title="Revisión Técnica" badge={<Badge t={vehiculo.tecnica.estado==="VENCIDA"?"danger":"ok"}>{vehiculo.tecnica.estado}</Badge>} bc={vehiculo.tecnica.estado==="VENCIDA"?C.danger:C.success}>
              <Row label="ESTADO" value={vehiculo.tecnica.estado} alert={vehiculo.tecnica.estado==="VENCIDA"}/>
              {vehiculo.tecnica.vencio&&<Row label="VENCIÓ EL" value={vehiculo.tecnica.vencio} alert/>}
            </Card>
            <Card title="Papeletas y Requisitorias">
              <Row label="PAPELETAS" value={`${vehiculo.papeletas} multa(s)`} alert={vehiculo.papeletas>0}/>
              <Row label="REQUISITORIA" value={vehiculo.requisitoria?"SÍ — RETENER":"NO REGISTRA"} alert={vehiculo.requisitoria}/>
            </Card>
          </div>
        )}
        {personas.map((p,i)=>tab===`p${i}`&&(
          <div key={i}>
            {p.requisitoria&&<Alerta tipo="danger" titulo="PERSONA CON REQUISITORIA VIGENTE" msg="PROCEDER A DETENCIÓN — Comunicar a Central de inmediato."/>}
            {p.antecedentes&&<Alerta tipo="warn" titulo="REGISTRA ANTECEDENTES POLICIALES"/>}
            <Card title={i===0?"Datos Conductor":`Datos Pasajero ${i}`} bc={p.requisitoria?C.danger:C.accent}>
              <Row label="DNI" value={p.dni}/>
              <Row label="NOMBRES" value={p.nombres}/>
              <Row label="APELLIDOS" value={p.apellidos}/>
              <Row label="FECHA NAC." value={p.fechaNac}/>
              <Row label="DOMICILIO" value={p.direccion}/>
            </Card>
            {i===0&&<Card title="Licencia" badge={<Badge t={p.licencia.estado==="VIGENTE"?"ok":"danger"}>{p.licencia.estado}</Badge>} bc={p.licencia.estado==="VIGENTE"?C.success:C.danger}>
              <Row label="CATEGORÍA" value={p.licencia.categoria}/>
              <Row label="ESTADO" value={p.licencia.estado} alert={p.licencia.estado!=="VIGENTE"}/>
            </Card>}
            <Card title="Sistema PNP">
              <Row label="ANTECEDENTES" value={p.antecedentes?"REGISTRA":"NO REGISTRA"} alert={p.antecedentes}/>
              <Row label="REQUISITORIA" value={p.requisitoria?"SÍ — URGENTE":"NO REGISTRA"} alert={p.requisitoria}/>
            </Card>
          </div>
        ))}
      </div>
      <div style={{padding:"0 20px 24px"}}>
        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:20,marginBottom:14}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,color:C.text,letterSpacing:1,marginBottom:4}}>¿QUÉ PROCEDE?</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:"'Source Code Pro',monospace"}}>Evalúas la situación en campo y decides</div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:10,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2.5,marginBottom:6}}>DESCRIPCIÓN DE HECHOS</label>
          <textarea value={situacion} onChange={e=>setSituacion(e.target.value)} rows={3}
            placeholder="ej: Conductor en presunto estado de ebriedad, olía a alcohol, ojos rojos..."
            style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 13px",color:C.text,fontSize:12,fontFamily:"'Source Code Pro',monospace",lineHeight:1.6}}/>
        </div>
        <div style={{display:"grid",gap:10}}>
          <button className="btn" onClick={()=>onDecision("ninguna",situacion)} style={{padding:"14px",borderRadius:8,background:C.card,border:`1px solid ${C.border}`,color:C.textMid,fontSize:13,letterSpacing:1}}>
            ✓ CONTROL SIMPLE — Sin infracciones, sin acta
          </button>
          <button className="btn" onClick={()=>onDecision("intervencion",situacion)} style={{padding:"14px",borderRadius:8,background:C.accentDim,border:`1px solid ${C.accentBorder}`,color:C.accent,fontSize:13,letterSpacing:1}}>
            📋 ACTA DE INTERVENCIÓN POLICIAL
          </button>
          {(tieneInfr||hayAlerta)&&<button className="btn" onClick={()=>onDecision("detencion",situacion)} style={{padding:"14px",borderRadius:8,background:C.dangerDim,border:`1px solid ${C.danger}`,color:C.danger,fontSize:13,letterSpacing:1}}>
            🚨 ACTA DE DETENCIÓN — Flagrante / Requisitoria
          </button>}
          <button className="btn" onClick={()=>onDecision("registro_personal",situacion)} style={{padding:"14px",borderRadius:8,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.4)",color:"#a78bfa",fontSize:13,letterSpacing:1}}>
            🔍 ACTA DE REGISTRO PERSONAL E INCAUTACIÓN
          </button>
          <button className="btn" onClick={()=>onDecision("registro_vehiculo",situacion)} style={{padding:"14px",borderRadius:8,background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.4)",color:"#a78bfa",fontSize:13,letterSpacing:1}}>
            🚗 ACTA DE REGISTRO DE VEHÍCULO E INCAUTACIÓN
          </button>
        </div>
      </div>
    </div>
  );
}

function Acta({datos,tipoDecision,situacion}) {
  const [acta,setActa]=useState("");
  const [loading,setLoading]=useState(true);
  const [copied,setCopied]=useState(false);

  const tipoMap={intervencion:"INTERVENCION",detencion:"DETENCION",registro_personal:"REGISTRO_PERSONAL",registro_vehiculo:"REGISTRO_VEHICULO"};
  const titulos={intervencion:"ACTA DE INTERVENCIÓN POLICIAL",detencion:"ACTA DE DETENCIÓN",registro_personal:"ACTA DE REGISTRO PERSONAL E INCAUTACIÓN",registro_vehiculo:"ACTA DE REGISTRO DE VEHÍCULO E INCAUTACIÓN"};

  const generar=async()=>{
    setLoading(true);
    const {vehiculo,personas,efectivo,unidad,lugar}=datos;
    const c=personas[0]||{};
    const hora=new Date().toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"});
    const fecha=new Date().toLocaleDateString("es-PE",{day:"2-digit",month:"long",year:"numeric"});
    const tipo=tipoMap[tipoDecision]||"INTERVENCION";

    const prompt=`Redacta el documento policial oficial PNP usando la plantilla 2016.

EFECTIVO: ${efectivo||"SO PNP (NO ESPECIFICADO)"} | CIP: NO ESPECIFICADO
UNIDAD: ${unidad||"COMISARÍA PNP"} | CIUDAD: TACNA | DISTRITO: TACNA
LUGAR: ${lugar||"NO ESPECIFICADO"} | FECHA: ${fecha} | HORA: ${hora} horas

INTERVENIDO: ${c.nombres||"NO ESPECIFICADO"} ${c.apellidos||""} | DNI: ${c.dni||"NO ESPECIFICADO"}
EDAD: ${c.edad||"NO ESPECIFICADO"} | NATURALEZA: ${c.naturaleza||"TACNA"} | E.CIVIL: ${c.estadoCivil||"NO ESPECIFICADO"}
OCUPACIÓN: ${c.ocupacion||"NO ESPECIFICADO"} | INSTRUCCIÓN: ${c.instruccion||"NO ESPECIFICADO"}
DOMICILIO: ${c.direccion||"NO ESPECIFICADO"}

VEHÍCULO: Placa ${vehiculo?.placa||"NO ESPECIFICADO"} | ${vehiculo?`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año} color ${vehiculo.color}`:"NO ESPECIFICADO"}
PROPIETARIO: ${vehiculo?.propietario||"NO ESPECIFICADO"}
SOAT: ${vehiculo?.soat?.estado||"NO VERIFICADO"} | REV.TÉCNICA: ${vehiculo?.tecnica?.estado||"NO VERIFICADO"}${vehiculo?.tecnica?.vencio?` (venció ${vehiculo.tecnica.vencio})`:""}
PAPELETAS: ${vehiculo?.papeletas||0} | REQUISITORIA VEHICULAR: ${vehiculo?.requisitoria?"SÍ":"NO"}
LICENCIA CONDUCTOR: ${c.licencia?.estado||"NO VERIFICADO"} Cat.${c.licencia?.categoria||"-"}
ANTECEDENTES: ${c.antecedentes?"REGISTRA":"NO REGISTRA"} | REQUISITORIA PERSONA: ${c.requisitoria?"SÍ":"NO"}

HECHOS: ${situacion||"Intervención de control de tránsito."}

Completa TODOS los campos de la plantilla ${tipo} con estos datos.`;

   try {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: buildSystemPrompt(tipo) + "\n\n" + prompt 
          }]
        }],
        generationConfig: { 
          maxOutputTokens: 1024, 
          temperature: 0.2 
        }
      })
    }
  );
  const d = await res.json();
  if (d.error) {
    setActa("Error API: " + d.error.message);
  } else {
    setActa(d.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta.");
  }
} catch(e) {
  setActa("Error: " + e.message);
}
    setLoading(false);
  };

  useState(()=>{generar();},[]);

  const copiar=()=>{navigator.clipboard.writeText(acta).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500)})};

  return (
    <div style={{padding:"16px 20px"}} className="fu">
      <div style={{marginBottom:16}}>
        <div style={{fontSize:10,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,marginBottom:6}}>DOCUMENTO OFICIAL PNP · MANUAL 2016</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:800,color:C.text}}>{titulos[tipoDecision]}</div>
      </div>
      {loading?(
        <div style={{textAlign:"center",padding:"50px 0"}}>
          <div style={{width:40,height:40,border:`3px solid ${C.border}`,borderTop:`3px solid ${C.accent}`,borderRadius:"50%",margin:"0 auto 20px",animation:"spin 1s linear infinite"}}/>
          <div style={{fontSize:14,color:C.accent,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2}}>GENERANDO ACTA OFICIAL...</div>
          <div style={{fontSize:11,color:C.textDim,fontFamily:"'Source Code Pro',monospace",marginTop:8}}>Aplicando formato PNP 2016</div>
        </div>
      ):(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:12}}>
            <button className="btn" onClick={generar} style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,color:C.accent,padding:"7px 12px",borderRadius:6,fontSize:11}}>⟳ Regenerar</button>
            <button className="btn" onClick={copiar} style={{background:copied?C.successDim:C.accentDim,border:`1px solid ${copied?C.success:C.accent}`,color:copied?C.success:C.accent,padding:"7px 12px",borderRadius:6,fontSize:11}}>{copied?"✓ COPIADO":"⎘ COPIAR"}</button>
          </div>
          <textarea value={acta} onChange={e=>setActa(e.target.value)} rows={26}
            style={{width:"100%",background:"#fff",border:`1px solid ${C.border}`,borderRadius:8,padding:"18px",fontFamily:"'Courier New',monospace",fontSize:11,color:"#111",lineHeight:1.9}}/>
          <Alerta tipo="warn" titulo="REVISAR ANTES DE FIRMAR" msg="Verifica datos del intervenido, hora y lugar. El efectivo es responsable del contenido final."/>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [pantalla,setPantalla]=useState("home");
  const [loading,setLoading]=useState(false);
  const [datosConsulta,setDatosConsulta]=useState(null);
  const [tipoDecision,setTipoDecision]=useState(null);
  const [situacionFinal,setSituacionFinal]=useState("");

  const handleConsultar=async({placa,dnis,efectivo,unidad,lugar})=>{
    setLoading(true);
    await new Promise(r=>setTimeout(r,1800));
    const vehiculo=placa?getMockVehiculo(placa):null;
    const personas=dnis.length>0?dnis.map(d=>getMockPersona(d)):[getMockPersona("")];
    setDatosConsulta({vehiculo,personas,efectivo,unidad,lugar});
    setLoading(false);
    setPantalla("verificacion");
  };

  const handleDecision=(tipo,situacion)=>{
    if(tipo==="ninguna"){setPantalla("home");return;}
    setTipoDecision(tipo);setSituacionFinal(situacion);setPantalla("acta");
  };

  const volver=()=>{
    if(pantalla==="acta"){setPantalla("verificacion");return;}
    if(pantalla==="verificacion"){setPantalla("consulta");return;}
    setPantalla("home");
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
      <G/>
      <div style={{position:"sticky",top:0,zIndex:100,background:C.bg,borderBottom:`1px solid ${C.border}`,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {pantalla!=="home"&&<button className="btn" onClick={volver} style={{background:C.card,border:`1px solid ${C.border}`,color:C.textMid,padding:"6px 12px",borderRadius:6,fontSize:13}}>← Volver</button>}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.accent,animation:"pulse 2s infinite"}}/>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:C.textMid,letterSpacing:2}}>COPILOTO PNP</span>
          </div>
        </div>
        <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:10,color:C.textDim}}>BETA v0.2</span>
      </div>
      {pantalla==="home"&&<Home onStart={()=>setPantalla("consulta")}/>}
      {pantalla==="consulta"&&<Consulta onConsultar={handleConsultar} loading={loading}/>}
      {pantalla==="verificacion"&&datosConsulta&&<Verificacion datos={datosConsulta} onDecision={handleDecision}/>}
      {pantalla==="acta"&&datosConsulta&&tipoDecision&&<Acta datos={datosConsulta} tipoDecision={tipoDecision} situacion={situacionFinal}/>}
    </div>
  );
}
