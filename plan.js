'use strict';
import { useState } from "react";

const phases = [
 {
   id: "foundation",
   label: "Foundation Phase",
   dates: "Now → Late April",
   goal: "Stabilize HRV, sharpen run speed, build swim & bike base",
   color: "#2DD4BF",
   accent: "#0F766E",
   schedule: [
     {
       day: "Monday",
       tag: "REST",
       tagColor: "#6B7280",
       sessions: [
         { type: "Full Rest", duration: "—", hr: null, notes: "Complete rest. Let HRV stabilize. No structured training." }
       ]
     },
     {
       day: "Tuesday",
       tag: "SWIM + STRENGTH",
       tagColor: "#3B82F6",
       sessions: [
         { type: "Swim — Aerobic Base", duration: "30–40 min", hr: "Easy, conversational", notes: "Drills + steady laps. No sprinting. Focus on technique." },
         { type: "Strength", duration: "30 min", hr: null, notes: "Full body, moderate load. Squats, deadlifts, rows, core. No HIIT." }
       ]
     },
     {
       day: "Wednesday",
       tag: "RUN — SPEED",
       tagColor: "#10B981",
       sessions: [
         { type: "Speed Work (green HRV only)", duration: "~50 min total", hr: "Z4 during reps", notes: "10 min warmup + 4–6×800m at 5K effort + 10 min cooldown. Skip or replace with easy 4 miles if HRV is amber/red." }
       ]
     },
     {
       day: "Thursday",
       tag: "BIKE + OPTIONAL STRENGTH",
       tagColor: "#F59E0B",
       sessions: [
         { type: "Bike — Tempo", duration: "45–60 min", hr: "155–165 for intervals", notes: "Mostly Z2 with 2×10 min at tempo. Your one mid-week hard bike effort." },
         { type: "Strength (optional)", duration: "20 min", hr: null, notes: "Upper body + core only. Skip entirely if Wednesday speed session was hard." }
       ]
     },
     {
       day: "Friday",
       tag: "EASY RUN",
       tagColor: "#10B981",
       sessions: [
         { type: "Easy Run", duration: "4–5 miles", hr: "HR strictly < 145. Walk if it climbs.", notes: "MAF pace. This is recovery running, not training. Slow is correct." }
       ]
     },
     {
       day: "Saturday",
       tag: "LONG BIKE or BRICK",
       tagColor: "#EF4444",
       sessions: [
         { type: "Long Bike", duration: "60–90 min", hr: "Z2 — HR 140–155", notes: "Steady aerobic. Every 3rd week add a 15-min easy run off the bike (brick)." }
       ]
     },
     {
       day: "Sunday",
       tag: "MEDIUM LONG RUN",
       tagColor: "#10B981",
       sessions: [
         { type: "Medium Long Run", duration: "6–7 miles (build to 9–10 by late April)", hr: "HR < 150 strictly", notes: "Your base is already there — this maintains it. Walk breaks are fine. Not a race effort. Increase by ~0.5 mile every 2 weeks." }
       ]
     }
   ],
   runningNote: "You already have the distance. Running is in maintenance + sharpening mode. Swim and bike are where you're building something new — that's where the adaptation stress lives right now."
 },
 {
   id: "build",
   label: "Build Phase",
   dates: "Post-May Half → Late July",
   goal: "Race-specific triathlon volume, brick workouts, speed maintenance",
   color: "#F97316",
   accent: "#C2410C",
   schedule: [
     {
       day: "Monday",
       tag: "REST",
       tagColor: "#6B7280",
       sessions: [{ type: "Full Rest", duration: "—", hr: null, notes: "Recovery from weekend volume. Protect this day." }]
     },
     {
       day: "Tuesday",
       tag: "RUN INTERVALS + STRENGTH",
       tagColor: "#10B981",
       sessions: [
         { type: "Track / Tempo Run", duration: "50–60 min", hr: "Z4 intervals", notes: "4–6×800m or 3×1 mile at half marathon pace. Full warmup and cooldown." },
         { type: "Strength", duration: "30 min", hr: null, notes: "Power focus — heavier, lower reps. Glutes, hamstrings, single-leg work for run economy." }
       ]
     },
     {
       day: "Wednesday",
       tag: "SWIM",
       tagColor: "#3B82F6",
       sessions: [{ type: "Swim — Endurance + Open Water Sim", duration: "45 min", hr: "Easy–Moderate", notes: "Sighting practice, longer sets. Simulate race conditions." }]
     },
     {
       day: "Thursday",
       tag: "BIKE TEMPO",
       tagColor: "#F59E0B",
       sessions: [{ type: "Bike — Race Effort Sets", duration: "60–75 min", hr: "Z3–Z4", notes: "3×15 min at triathlon target pace with 5 min easy recovery between." }]
     },
     {
       day: "Friday",
       tag: "EASY RUN",
       tagColor: "#10B981",
       sessions: [{ type: "Easy Recovery Run", duration: "4–5 miles", hr: "HR < 145", notes: "Shake out the legs before the weekend. Genuinely easy — don't let it drift into tempo." }]
     },
     {
       day: "Saturday",
       tag: "BRICK WORKOUT",
       tagColor: "#EF4444",
       sessions: [{ type: "Bike + Run Brick", duration: "90 min bike + 20–30 min run", hr: "Z2–Z3 bike / easy run", notes: "Practice T2 transition. The run will feel strange off the bike — that's exactly what you're training." }]
     },
     {
       day: "Sunday",
       tag: "MEDIUM LONG RUN",
       tagColor: "#10B981",
       sessions: [{ type: "Medium Long Run", duration: "8–10 miles", hr: "HR < 155", notes: "Aerobic endurance maintenance. You have the base — protect it with easy pace." }]
     }
   ],
   runningNote: "Speed is now maintained with Tuesday intervals. Sunday long run rebuilds back toward race distance. Bricks on Saturday are the key triathlon-specific work."
 }
];

const maytaper = [
 { week: "3 weeks out", action: "Drop total run volume 20%. Keep Wednesday speed session but shorten to 4×800m." },
 { week: "2 weeks out", action: "Drop volume another 20%. Replace speed session with 2×1 mile at goal pace. Bike and swim stay normal." },
 { week: "Race week", action: "3–4 easy miles Monday, 2 miles with 4 strides Wednesday, rest Thursday–Friday. Trust the base." }
];

const hrv_rules = [
 { condition: "HRV low / red on Garmin", action: "Wednesday speed session becomes an easy 4-mile run or is skipped entirely. Never push intervals on a red day." },
 { condition: "HRV unstable 3+ days in a row", action: "Take an unplanned down week. Cut all volume by 40%. Prioritize sleep above everything." },
 { condition: "Easy run HR above 155", action: "Stop and walk until it drops. The session is already complete — more miles won't help." },
 { condition: "Green HRV + feeling strong", action: "Execute the plan as written. Resist the urge to add extra." }
];

const recovery_stack = [
 { icon: "😴", label: "Sleep", detail: "8–9 hrs. Your #1 performance lever. Consistent wake time matters as much as duration for HRV." },
 { icon: "🥩", label: "Post-workout protein", detail: "20–30g within 45 min of any session. Critical after speed work and strength." },
 { icon: "☀️", label: "Vitamin D", detail: "Take with your fattiest meal of the day for best absorption. Ask your doctor to recheck levels in spring — Chicago winters often need higher doses than standard." },
 { icon: "💧", label: "Hydration", detail: "Cold weather masks thirst. Drink proactively. Aim for pale yellow urine, especially on long bike days." },
 { icon: "🧘", label: "Mobility", detail: "10 min post-run hip flexor + hamstring work. Especially important after speed sessions." }
];


export default function TrainingPlan() {
 const [activePhase, setActivePhase] = useState(0);
 const [expandedDay, setExpandedDay] = useState(null);
 const [activeTab, setActiveTab] = useState("schedule");
 const phase = phases[activePhase];

 return (
   <div style={{
     fontFamily: "'Georgia', serif",
     background: "#0A0A0F",
     minHeight: "100vh",
     color: "#E8E4DC",
     paddingBottom: "60px"
   }}>
     {/* Header */}
     <div style={{
       background: "linear-gradient(135deg, #0A0A0F 0%, #111827 50%, #0A0A0F 100%)",
       borderBottom: "1px solid #1F2937",
       padding: "40px 24px 32px",
       textAlign: "center",
       position: "relative",
       overflow: "hidden"
     }}>
       <div style={{
         position: "absolute", inset: 0,
         background: `radial-gradient(ellipse at 50% 0%, ${phase.color}18 0%, transparent 70%)`,
         pointerEvents: "none"
       }} />
       <div style={{ fontSize: "11px", letterSpacing: "4px", color: phase.color, marginBottom: "12px", textTransform: "uppercase" }}>
         Triathlon Training Plan · Chicago
       </div>
       <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "400", margin: "0 0 8px", letterSpacing: "-0.5px", color: "#F9F6F0" }}>
         Your Road to August
       </h1>
       <p style={{ fontSize: "14px", color: "#6B7280", margin: 0, fontStyle: "italic" }}>
         Half Marathon · May &nbsp;|&nbsp; Sprint/Olympic Triathlon · August
       </p>

       {/* Phase Selector */}
       <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "28px", flexWrap: "wrap" }}>
         {phases.map((p, i) => (
           <button key={p.id} onClick={() => { setActivePhase(i); setExpandedDay(null); }} style={{
             padding: "10px 20px", borderRadius: "40px",
             border: `1.5px solid ${i === activePhase ? p.color : "#2D2D3A"}`,
             background: i === activePhase ? `${p.color}20` : "transparent",
             color: i === activePhase ? p.color : "#6B7280",
             cursor: "pointer", fontSize: "13px", letterSpacing: "0.5px", transition: "all 0.2s"
           }}>
             {p.label}
           </button>
         ))}
       </div>
     </div>

     <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 16px" }}>

       {/* Phase info bar */}
       <div style={{
         margin: "28px 0 8px", padding: "16px 20px", borderRadius: "12px",
         background: "#111827", border: `1px solid ${phase.color}40`,
         display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between"
       }}>
         <div>
           <div style={{ fontSize: "11px", color: "#6B7280", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Dates</div>
           <div style={{ fontSize: "14px", color: phase.color }}>{phase.dates}</div>
         </div>
         <div style={{ flex: 1, minWidth: "200px" }}>
           <div style={{ fontSize: "11px", color: "#6B7280", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>Phase Goal</div>
           <div style={{ fontSize: "14px", color: "#D1C9BC" }}>{phase.goal}</div>
         </div>
       </div>

       {/* Running strategy callout */}
       <div style={{
         margin: "0 0 20px", padding: "14px 18px", borderRadius: "10px",
         background: "#0D1A14", border: "1px solid #10B98140",
         fontSize: "13px", color: "#9CA3AF", lineHeight: "1.6", fontStyle: "italic"
       }}>
         🏃‍♀️ <span style={{ color: "#10B981" }}>Running strategy:</span> {phase.runningNote}
       </div>

       {/* Tabs */}
       <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "#0D0D14", borderRadius: "10px", padding: "4px" }}>
         {[["schedule", "Weekly Schedule"], ["taper", activePhase === 0 ? "May Half Taper" : "Aug Taper"], ["hrv", "HRV Rules"], ["recovery", "Recovery"]].map(([id, label]) => (
           <button key={id} onClick={() => setActiveTab(id)} style={{
             flex: 1, padding: "8px 4px", borderRadius: "8px", border: "none",
             background: activeTab === id ? "#1F2937" : "transparent",
             color: activeTab === id ? "#E8E4DC" : "#6B7280",
             cursor: "pointer", fontSize: "11px", letterSpacing: "0.5px", transition: "all 0.2s"
           }}>
             {label}
           </button>
         ))}
       </div>

       {/* Schedule Tab */}
       {activeTab === "schedule" && (
         <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
           {phase.schedule.map((day, i) => {
             const isOpen = expandedDay === i;
             return (
               <div key={day.day} style={{
                 borderRadius: "12px",
                 background: isOpen ? "#111827" : "#0D0D14",
                 border: `1px solid ${isOpen ? "#2D3748" : "#1A1A28"}`,
                 overflow: "hidden", transition: "all 0.2s"
               }}>
                 <button onClick={() => setExpandedDay(isOpen ? null : i)} style={{
                   width: "100%", padding: "14px 18px",
                   background: "none", border: "none", cursor: "pointer",
                   display: "flex", alignItems: "center", gap: "12px", textAlign: "left"
                 }}>
                   <div style={{ width: "90px", fontSize: "13px", color: "#9CA3AF", fontFamily: "'Georgia', serif" }}>{day.day}</div>
                   <div style={{
                     padding: "3px 10px", borderRadius: "20px",
                     background: `${day.tagColor}20`, color: day.tagColor,
                     fontSize: "10px", letterSpacing: "1.5px", fontFamily: "monospace", flex: 1
                   }}>
                     {day.tag}
                   </div>
                   <div style={{ color: "#4B5563", fontSize: "16px", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>↓</div>
                 </button>

                 {isOpen && (
                   <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                     {day.sessions.map((s, j) => (
                       <div key={j} style={{
                         padding: "14px 16px", borderRadius: "8px",
                         background: "#0A0A0F", borderLeft: `3px solid ${day.tagColor}60`
                       }}>
                         <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "6px", marginBottom: "6px" }}>
                           <div style={{ fontSize: "14px", color: "#E8E4DC", fontWeight: "600" }}>{s.type}</div>
                           {s.duration !== "—" && <div style={{ fontSize: "12px", color: "#6B7280" }}>{s.duration}</div>}
                         </div>
                         {s.hr && <div style={{ fontSize: "12px", color: phase.color, marginBottom: "6px" }}>♥ {s.hr}</div>}
                         <div style={{ fontSize: "13px", color: "#9CA3AF", fontStyle: "italic" }}>{s.notes}</div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             );
           })}
         </div>
       )}

       {/* Taper Tab */}
       {activeTab === "taper" && (
         <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
           <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "8px", fontStyle: "italic" }}>
             {activePhase === 0 ? "3-week taper leading into the May half marathon:" : "2-week taper leading into the August triathlon:"}
           </div>
           {(activePhase === 0 ? maytaper : [
             { week: "2 weeks out", action: "Drop run and bike volume 25%. Keep one speed session but half the reps. Swim stays normal — it doesn't fatigue legs." },
             { week: "Race week", action: "Short easy run Monday, 20-min easy bike with 3 race-effort surges Wednesday, full rest Thursday–Friday. Light swim Saturday morning if it calms nerves." }
           ]).map((t, i) => (
             <div key={i} style={{
               padding: "16px 18px", borderRadius: "10px",
               background: "#111827", border: "1px solid #1F2937"
             }}>
               <div style={{ fontSize: "12px", color: phase.color, letterSpacing: "1px", marginBottom: "6px", textTransform: "uppercase" }}>{t.week}</div>
               <div style={{ fontSize: "14px", color: "#D1C9BC", lineHeight: "1.6" }}>{t.action}</div>
             </div>
           ))}
           <div style={{
             marginTop: "8px", padding: "14px 18px", borderRadius: "10px",
             background: "#0D1117", border: "1px solid #1F2937",
             fontSize: "13px", color: "#6B7280", fontStyle: "italic", lineHeight: "1.7"
           }}>
             The fitness is already built. Taper is about arriving fresh, not gaining more fitness. Resist the urge to squeeze in extra sessions.
           </div>
         </div>
       )}

       {/* HRV Tab */}
       {activeTab === "hrv" && (
         <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
           <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "8px", fontStyle: "italic" }}>
             Check your Garmin HRV every morning before deciding on the day's session intensity.
           </div>
           {hrv_rules.map((r, i) => (
             <div key={i} style={{
               padding: "16px 18px", borderRadius: "10px",
               background: "#111827", border: "1px solid #1F2937",
               display: "flex", flexDirection: "column", gap: "8px"
             }}>
               <div style={{ fontSize: "12px", color: "#EF4444", letterSpacing: "0.5px" }}>IF: {r.condition}</div>
               <div style={{ fontSize: "13px", color: "#D1C9BC", lineHeight: "1.6" }}>→ {r.action}</div>
             </div>
           ))}
         </div>
       )}

       {/* Recovery Tab */}
       {activeTab === "recovery" && (
         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
           {recovery_stack.map((r, i) => (
             <div key={i} style={{
               padding: "18px", borderRadius: "10px",
               background: "#0D1117", border: "1px solid #1F2937"
             }}>
               <div style={{ fontSize: "24px", marginBottom: "10px" }}>{r.icon}</div>
               <div style={{ fontSize: "13px", color: "#E8E4DC", marginBottom: "6px", fontWeight: "600" }}>{r.label}</div>
               <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.6" }}>{r.detail}</div>
             </div>
           ))}
         </div>
       )}

       <div style={{ marginTop: "40px", padding: "20px", borderRadius: "12px", background: "#0D1117", border: "1px solid #1F2937", textAlign: "center" }}>
         <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.9" }}>
           You already have the running distance. Now it's about <span style={{ color: "#E8E4DC" }}>sharpening speed, building swim & bike,</span><br />
           and letting your body recover enough to actually absorb the training.
         </div>
       </div>
     </div>
   </div>
 );
}

// Find the DOM container and render the component
const domContainer = document.querySelector('#react-app-root');
const root = ReactDOM.createRoot(domContainer);
root.render(<TrainingPlan />);

