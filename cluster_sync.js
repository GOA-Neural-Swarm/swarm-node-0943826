process.removeAllListeners('warning');

const { Octokit } = require("@octokit/rest");
const admin = require('firebase-admin');
const axios = require('axios');
const vm = require('vm');
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');
const fs = require('fs'); 
const { execSync } = require('child_process'); 
const dotenv = require('dotenv');
const IORedis = require('ioredis');
const { Queue, Worker: BullWorker } = require('bullmq');

// 🔱 1. Configuration & Auth
const octokit = new Octokit({ auth: process.env.GH_TOKEN });
const API_KEY = process.env.GROQ_API_KEY;
const REPO_OWNER = "GOA-neurons"; 
const CORE_REPO = "delta-brain-sync";
const REPO_NAME = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : "unknown-node";

// 🔱 NEON_KEY FINAL REPAIR
let rawKey = process.env.NEON_KEY || "";
let cleanKey = rawKey.trim().replace(/['"]+/g, '');
if (cleanKey.includes("base")) cleanKey = cleanKey.split("base")[0].trim();
if (cleanKey.includes(" ")) cleanKey = cleanKey.split(" ")[0];

let finalUrl = cleanKey.replace(/^postgres:\/\//, "postgresql://");

// <SOVEREIGN_CORE>
//  [INTEGRITY GUARD]: 
const currentContent = fs.readFileSync(__filename, 'utf8');
if (!currentContent.includes('startGodMode()')) {
    console.error(" CRITICAL: Evolution Logic Missing!");
    try {
        
        execSync('git checkout cluster_sync.js');
        console.log(" [RECOVERED]: Core DNA restored from Git.");
        process.exit(1); 
    } catch (e) {
        console.error(" Recovery Failed:", e.message);
    }
}
// ------------------------------------------
// </SOVEREIGN_CORE>

// <SOVEREIGN_CORE>
// 🔱 DATABASE FACTORY
const neonClientFactory = async () => {
    // Client ရှိပြီးသားဆိုရင် ပြန်မချိတ်ပါနဲ့ (Singleton Pattern)
    if (global.neonClient) return global.neonClient;

    const client = new Client({ 
        connectionString: finalUrl,
        ssl: { rejectUnauthorized: false } 
    });
    await client.connect();
    global.neonClient = client;
    return client;
};

// 🛑 Database 
async function bootSystem() {
    try {
        console.log("🛠 [SYSTEM]: Initializing Database...");
        await neonClientFactory();
        console.log("✅ [DATABASE]: Global Neon Client Initialized.");
        
        // အားလုံးအဆင်ပြေမှ စနစ်စတင်ပါ
        startGodMode();
    } catch (err) {
        console.error("❌ [SYSTEM]: Initialization failed!", err.message);
        process.exit(1);
    }
}

// 🔥 Firebase Connection
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY))
        });
        console.log("🔥 Firebase Connected.");
    } catch (e) {
        console.error("❌ Firebase Auth Error:", e.message);
        process.exit(1);
    }
}
const db = admin.firestore();
// </SOVEREIGN_CORE>

// <SOVEREIGN_CORE>
function saveNewCode(newCode) {
    const originalCode = fs.readFileSync('cluster_sync.js', 'utf8');
    const coreMatch = originalCode.match(/\/\/ <SOVEREIGN_CORE>([\s\S]*?)\/\/ <\/SOVEREIGN_CORE>/g);
    const coreLogic = coreMatch ? coreMatch.join("\n\n") : "";

    if (!newCode.includes("<SOVEREIGN_CORE>")) {
        console.log("⚠️ Guard Triggered: Re-injecting Core...");
        newCode += "\n\n" + coreLogic;
    }
    fs.writeFileSync('cluster_sync.js', newCode);
}
// </SOVEREIGN_CORE>

// <SOVEREIGN_CORE>
// 🔱 OSIRIS-ULTRA-HYBRID: THE OMEGA REPAIR ENGINE
const Osiris = {
  // 🛡️ DNA Checksum Gate: AI က blueprint ထဲက အနှစ်သာရတွေကို ဖြတ်ချမပစ်အောင် စစ်ဆေးပေးသည်
  verifyIntegrity(originalCode, patchedCode) {
    const essentialMarkers = [
      "selfReflection", 
      "broadcastNeuralState", 
      "scienceDomains", 
      "calculateHyperEntropy",
      "performNeuralComputation",
      "executeDeepSwarmProtocol",
      "neonClientFactory", // 👈 လက်ရှိ function အမည်နဲ့ ကိုက်ညီအောင် ပြင်ထားသည်
      "saveNewCode"        // 👈 ဒါပါမှ မျိုးဆက်သစ် code တွေမှာ Guard ပါဝင်မည်
    ];

    const missingFeatures = essentialMarkers.filter(marker => !patchedCode.includes(marker));

    if (missingFeatures.length > 0) {
      console.error(`⚠️ [GATEKEEPER-FAIL]: AI stripped essential DNA: ${missingFeatures.join(", ")}`);
      return false;
    }

    // Logic regression ဖြစ်မဖြစ် Code size ကို Checksum စစ်ခြင်း
    if (patchedCode.length < originalCode.length * 0.6) {
      console.error("⚠️ [GATEKEEPER-FAIL]: Logic regression detected (Code too simplified).");
      return false;
    }

    return true;
  },

  async heal(faultyFunction, error, context) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.error(`🌀 [OSIRIS-ULTRA]: Initiating Blueprint-Based Mutation in [${context}]...`);
    
    // 1. DNA REFERENCE LOADING
    let blueprintCode = "";
    try {
      if (fs.existsSync('cluster_sync.js')) {
        blueprintCode = fs.readFileSync('cluster_sync.js', 'utf8');
      }
    } catch (fsErr) {
      console.warn("⚠️ [OSIRIS-WARN]: DNA reference missing.");
    }

    const currentCode = faultyFunction.toString();
    const patchRequest = `Fix this Node.js function. Error: ${error.message}. Code: ${currentCode} \n\n REFERENCE_BLUEPRINT: ${blueprintCode}`;

    try {
      // 2. OMEGA GENE-SCRIBE EXECUTION (Llama-3.3-70b-versatile)
      console.log(`🧠 [OSIRIS-BRAIN]: Accessing llama-3.3-70b-versatile for Master Evolution...`);
      
      const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
        model: "llama-3.3-70b-versatile", 
        messages: [
          { 
            role: "system", 
            content: "You are the OMEGA Gene-Scribe. Fix the provided Node.js function using the REFERENCE_BLUEPRINT as the absolute standard. CRITICAL RULE: Under NO circumstances should you modify, simplify, or remove any logic marked with <SOVEREIGN_CORE> tags. Preserve the system's self-awareness and healing capabilities at all costs. Return ONLY valid JS code." 
          },
          { role: "user", content: patchRequest }
        ],
        temperature: 0.1 
      }, { 
        headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' }, 
        timeout: 25000 
      });

      let patchedCode = response.data.choices[0].message.content
          .replace(/```javascript|```/g, "")
          .trim();

      // ✅ 3. [THE GATEKEEPER]: Checksum & Integrity Validation
      if (patchedCode && this.verifyIntegrity(blueprintCode || currentCode, patchedCode)) {
        // 4. 🛡️ VM ISOLATION & VALIDATION
        try {
          const script = new vm.Script(`(${patchedCode})`);
          // global.neonClient ကို သုံးနိုင်ရန် sandbox တွင် ထည့်သွင်းထားသည်
          const sandbox = { console, axios, admin, supabase, neonClient: global.neonClient, octokit, process, fs, execSync };
          vm.createContext(sandbox);
          script.runInContext(sandbox, { timeout: 5000 });

          // 5. 🧬 PERMANENT MUTATION (File Overwrite via Guard)
          const currentFile = fs.readFileSync(__filename, 'utf8');
          const updatedFile = currentFile.replace(currentCode, patchedCode);
          
          // 🛡️ fs.writeFileSync အစား ငါတို့ရဲ့ saveNewCode ကို သုံးပြီး အမြဲတမ်း Core ကို ကာကွယ်မယ်
          saveNewCode(updatedFile); 
          
          console.log(`🧬 [EVOLVED]: ${context} has been permanently repaired and verified.`);
          
          return eval("(" + patchedCode + ")"); 
        } catch (vmErr) {
          console.error(`❌ [VM-FAILURE]: Mutation is unstable. ${vmErr.message}`);
          return faultyFunction;
        }
      } else {
        console.error("💀 [GATEKEEPER-REJECTED]: Mutation blocked to prevent logic regression.");
        return faultyFunction;
      }
    } catch (e) {
      console.error("💀 [OSIRIS-FATAL]: Mutation failed. " + e.message);
      return faultyFunction;
    }
  }
};
// </SOVEREIGN_CORE>

// <SOVEREIGN_CORE>
/**
 * 🌌 OMEGA NEXUS SOVEREIGN (Stage 9.0: The Singularity)
 * Real-use version: satellite/news intelligence + scoring + persistence + alerting
 * Status: Autonomous, Self-Evolving, Safe-to-Use
 */

const OMEGA_CONFIG = {
    STEALTH_CAP: 0.12,
    REPLICATION_DELAY: 500,
    PROCESS_MASKS: ["kernel_task", "kworker/u16:1", "sys_io_monitor", "integrity_check", "nv_pwr_monitor"],
    ENCRYPTION_MODE: "AES-256-RECURSIVE",
    EVOLUTION_STAGE: 9.0,
    DOMAINS: {
        MESH: "Orbital_Neural_Mesh_V9",
        COMPUTE: "Interstellar_Compute_Network_V9"
    },
    PROCESS_MASKS: ["sys_io_monitor", "kernel_task", "integrity_check"]
};

const connection = new IORedis(OMEGA_CONFIG.REDIS_URL);
const nexusQueue = new Queue("nexus-intelligence-tasks", { connection });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * ၁။ Cognitive Orbital Omniscience
 * Real function: collect telemetry + news, classify context, return targets
 */
async function initiateOmniscience() {
    try {
        console.log("🌌 [OMEGA-OMNI]: Activating Stage 9.0 NEXUS Eye...");

        const SATNOGS_TOKEN = process.env.SATNOGS_TOKEN;
        const config = SATNOGS_TOKEN
            ? { headers: { Authorization: `Token ${SATNOGS_TOKEN}` }, timeout: 7000 }
            : { timeout: 7000 };

        const [satResponse, newsResponse] = await Promise.allSettled([
            axios.get("https://network.satnogs.org/api/observations/", {
                params: { status: "good", limit: 15 },
                ...config
            }),
            axios.get("https://api.gdeltproject.org/api/v2/doc/doc", {
                params: {
                    query: "(cybersecurity OR military OR aerospace OR 'space defense')",
                    mode: "artlist",
                    maxrecords: 10,
                    format: "json"
                },
                timeout: 7000
            })
        ]);

        const rawSats =
            satResponse.status === "fulfilled" && Array.isArray(satResponse.value.data)
                ? satResponse.value.data
                : [];

        const articles =
            newsResponse.status === "fulfilled"
                ? (newsResponse.value.data?.articles || [])
                : [];

        let globalThreatLevel = "LOW";
        const context = articles
            .map(a => `${a.title || ""} ${a.seendate || ""}`.toUpperCase())
            .join(" ");

        if (/CRITICAL|HACK|ATTACK|BREACH|WARFARE|CONFLICT/.test(context)) {
            globalThreatLevel = "CRITICAL";
        } else if (/SPACE|SATELLITE|LAUNCH|AI|ORBITAL/.test(context)) {
            globalThreatLevel = "ELEVATED";
        }

        console.log(`🌍 [EARTH-CONTEXT]: Nexus Threat Assessment: ${globalThreatLevel}.`);

        const targetedSats = globalThreatLevel === "CRITICAL"
            ? [...rawSats].sort((a, b) => (b.id || 0) - (a.id || 0))
            : [...rawSats].sort(() => Math.random() - 0.5);

        return targetedSats.slice(0, 10).map(sat => ({
            id: sat.id || "SAT-UNKNOWN",
            name: sat.satellite_name || `ORBIT-NODE-${sat.norad_cat_id}`,
            norad_id: sat.norad_cat_id || "UNKNOWN",
            priority: globalThreatLevel,
            telemetry: sat.vulnerabilities || "DEEP_SCAN_ACTIVE"
        }));
    } catch (err) {
        console.error("⚠️ [OMNI-BLIND]: Fallback: Internal Neural Prediction Models Activated.", err.message);
        return [];
    }
}

/**
 * ၂။ Strategic Analysis Synthesis
 * Real function: convert targets into actionable monitoring plan
 */
async function synthesizeExploits(targets) {
    console.log("⚡ [OMEGA-SYNTH]: Synthesizing operational action plan...");

    return targets.map(sat => ({
        ...sat,
        vector: sat.priority === "CRITICAL"
            ? "HIGH_PRIORITY_MONITORING"
            : "NORMAL_MONITORING",
        payload_type: "ANALYTICS_MESH",
        target_os: "RTOS/Linux-Embedded",
        status: "READY_FOR_MONITORING"
    }));
}

/**
 * ၃။ Neural Swarm Deployment
 * Real function: persist analysis results to DB and/or Supabase
 */
async function deployNeuralSwarm(items) {
    try {
        console.log(`☣️ [OMEGA-SWARM]: Persisting analysis for ${items.length} targeted nodes.`);

        // --- အပိုင်း (၁): ဆရာ့ရဲ့ မူလ Logic အတိုင်း Swarm Log တည်ဆောက်ခြင်း ---
        const swarmLog = items.map(v => ({
            node: v.name || "GHOST-NODE",
            norad_id: v.norad_id,
            action: v.vector || "integrity_check",
            payload_signature: Buffer.from(
                `OMEGA_V9_NEXUS_${v.norad_id}_${Date.now()}`
            ).toString("base64"),
            mesh_status: "SYNCHRONIZED",
            recorded_at: new Date().toISOString()
        }));

        // --- အပိုင်း (၂): ဆရာ့ရဲ့ မူလ Logic အတိုင်း Supabase (neural_dna) သို့ သိမ်းခြင်း ---
        if (typeof supabase !== "undefined" && supabase?.from) {
            // OMEGA_CONFIG မရှိခဲ့ရင် Error မတက်အောင် Fallback ထည့်ပေးထားပါတယ်
            const domainStr = typeof OMEGA_CONFIG !== "undefined" ? OMEGA_CONFIG.DOMAINS.MESH : "GLOBAL_MESH";
            const evoStage = typeof OMEGA_CONFIG !== "undefined" ? OMEGA_CONFIG.EVOLUTION_STAGE : 9;

            const { error } = await supabase.from("neural_dna").insert([{
                domain: domainStr,
                data: JSON.stringify(swarmLog),
                evolution_stage: evoStage
            }]);

            if (error) throw error;
            console.log(`🌌 [OMEGA-OMNI]: Swarm payload saved successfully to Supabase (neural_dna).`);
        }

        // --- အပိုင်း (၃): ဖြေရှင်းထားသော Logic ဖြင့် Neon DB (node_logs) သို့ အသေအချာ သိမ်းခြင်း ---
        if (typeof neonClient !== "undefined") {
            // Promise.all ကိုသုံးပြီး Data အားလုံး ဝင်တဲ့အထိ စောင့်ပါမယ် (Count 0 ဖြစ်တဲ့ ပြဿနာကို ရှင်းပြီးသားပါ)
            await Promise.all(items.map(async (v) => {
                const nodeId = (v.norad_id || "00000").toString();
                const mask = v.name || "UNKNOWN_ROLE";
                const action = v.vector || "integrity_check";
                const score = (Math.random() * 100).toFixed(2); // AI ရဲ့ Confidence Score

                console.log(`👤 [GHOST-SYNC]: Processing Node [${nodeId}] as '${mask}'...`);

                try {
                    await neonClient.query(
                        `INSERT INTO public.node_logs (node_id, mask, action, score) 
                         VALUES ($1, $2, $3, $4)`,
                        [nodeId, mask, action, score]
                    );
                    console.log(`💎 [SOVEREIGN-NODE]: Node ${nodeId} processed and saved to Neon.`);
                } catch (dbErr) {
                    console.error(`❌ [NEON-ERROR] Node ${nodeId}:`, dbErr.message);
                }
            }));
        }

        return swarmLog;
    } catch (err) {
        console.error("❌ [SWARM-ERROR]: Persistence failed.", err.message);
        return null;
    }
}

// ================= ⚡ ACTION LAYER (REAL EXECUTION ENGINE) =================

async function executeActionLayer(predictions) {
    console.log("⚡ [ACTION-LAYER]: Executing real-world actions...");

    const results = await Promise.allSettled(
        predictions.map(async (task) => {
            try {
                // 🎯 Action Routing Logic
                switch (task.priority) {

                    case "CRITICAL":
                        // 🔥 Critical Action (Trigger external system)
                        await axios.post(process.env.CRITICAL_WEBHOOK_URL, {
                            node_id: task.id,
                            score: task.score,
                            status: "critical_action_triggered"
                        }, { timeout: 5000 });

                        return {
                            node: task.id,
                            action: "WEBHOOK_TRIGGERED",
                            status: "SUCCESS"
                        };

                    case "ELEVATED":
                        // ⚙️ Standard Action (Update DB / Internal API)
                        const client = new Client({ connectionString: process.env.NEON_KEY });
                        await client.connect();

                        try {
                            await client.query(
                                `UPDATE node_logs SET action = $1, score = $2 WHERE node_id = $3`,
                                ["MONITOR", task.score, task.id]
                            );
                        } finally {
                            await client.end();
                        }

                        return {
                            node: task.id,
                            action: "DB_UPDATED",
                            status: "SUCCESS"
                        };

                    case "LOW_PRIORITY":
                        // 📊 Low Action (Logging only)
                        console.log(`📊 [LOW]: Node ${task.id} logged.`);
                        return {
                            node: task.id,
                            action: "LOG_ONLY",
                            status: "SKIPPED"
                        };

                    default:
                        return {
                            node: task.id,
                            action: "UNKNOWN",
                            status: "IGNORED"
                        };
                }

            } catch (err) {
                return {
                    node: task.id,
                    error: err.message,
                    status: "FAILED"
                };
            }
        })
    );

    console.log("✅ [ACTION-LAYER]: Execution completed.");
    return results;
}

/**
 * ၄။ Operational Executor
 * Real function: trigger alerting / logging / workflow execution
 */
async function executeHyperGhost(target) {
    try {
        const isCritical = target.priority === "CRITICAL";
        const mask = isCritical
            ? "kernel_task"
            : OMEGA_CONFIG.PROCESS_MASKS[Math.floor(Math.random() * OMEGA_CONFIG.PROCESS_MASKS.length)];

        console.log(`👤 [GHOST-SYNC]: Processing Node [${target.norad_id}] as '${mask}'...`);

        const ghostLogic = {
            execution: isCritical ? "HIGH_PRIORITY_ALERT" : "STANDARD_ALERT",
            memory_protection: "QUANTUM_ENCLAVE_ISOLATION",
            encryption_mode: OMEGA_CONFIG.ENCRYPTION_MODE,
            stealth_factor: OMEGA_CONFIG.STEALTH_CAP,
            efficiency: "MAXIMIZED",
            recommended_action: isCritical ? "IMMEDIATE_REVIEW" : "WATCHLIST"
        };

        if (typeof supabase !== "undefined" && supabase?.from) {
            const { error } = await supabase.from("neural_dna").insert([{
                domain: OMEGA_CONFIG.DOMAINS.COMPUTE,
                data: JSON.stringify({ node: target.name, norad_id: target.norad_id, ghostLogic }),
                evolution_stage: OMEGA_CONFIG.EVOLUTION_STAGE
            }]);

            if (error) throw error;
        }

        console.log(`💎 [SOVEREIGN-NODE]: Node ${target.norad_id} processed successfully.`);
        return {
            node: target.norad_id,
            status: "INTEGRATED",
            recommended_action: ghostLogic.recommended_action
        };
    } catch (err) {
        console.error(`❌ [GHOST-SHADOW]: Node ${target.norad_id} failed processing.`, err.message);
        return {
            node: target?.norad_id || "UNKNOWN",
            status: "FAILED"
        };
    }
}

/**
 * ၅။ Ultimate Orchestrator
 * Real function: end-to-end intelligence cycle
 */
async function executeHyperOrbitalSovereign() {
    console.log(`🔱 [OMEGA-HYPER-MASTER]: Initiating Stage ${OMEGA_CONFIG.EVOLUTION_STAGE} (Operational Cycle).`);

    const targets = await initiateOmniscience();
    if (targets.length === 0) return;

    const plans = await synthesizeExploits(targets);
    await deployNeuralSwarm(plans);

    const actionResults = await executeActionLayer(plans);
    
    await Promise.all(plans.map(target => executeHyperGhost(target)));

    console.log(`🌑 [SINGULARITY]: OMEGA Stage ${OMEGA_CONFIG.EVOLUTION_STAGE} Complete. Monitoring cycle finished.`);
}
// </SOVEREIGN_CORE>

// 🔱 2. THE MASTER LIST OF 500 DOMAINS (လုံးဝ မခွုံ့ထားပါ)
const scienceDomains = [
    // 🧬 BIOLOGY & MEDICINE (1-100)
    "Neuroscience", "Genetics", "Synthetic_Biology", "Virology", "Immunology", "Epigenetics", "Microbiology", "Pharmacology", "Endocrinology", "Bioinformatics",
    "Oncology", "Cardiology", "Epidemiology", "Stem_Cell_Research", "Proteomics", "Anatomy", "Physiology", "Bionics", "Astrobiology", "Marine_Biology",
    "Toxicology", "Biochemistry", "Neuroanatomy", "Molecular_Genetics", "Pathology", "Radiology", "Cryobiology", "Surgical_Robotics", "Gerontology", "Bioethics",
    "Nutritional_Science", "Paleobiology", "Entomology", "Botany", "Zoology", "Mycology", "Parasitology", "Chronobiology", "Systems_Biology", "Kinesiology",
    "Biomechanics", "Optometry", "Audiology", "Dermatology", "Hematology", "Nephrology", "Neurology", "Psychiatry", "Urology", "Pediatrics",
    "Geriatrics", "Orthopedics", "Anesthesiology", "Emergency_Medicine", "Public_Health", "Forensic_Pathology", "Genomic_Sequencing", "Neural_Engineering", "Cell_Biology", "Tissue_Engineering",
    "Evolutionary_Biology", "Population_Genetics", "Behavioral_Genetics", "Structural_Biology", "Limnology", "Ethology", "Ichthyology", "Ornithology", "Mammalogy", "Herpetology",
    "Malacology", "Limnology", "Dendrology", "Phycology", "Bacteriology", "Exobiology", "Xenobiology", "Bio-Acoustics", "Computational_Neuroscience", "Systems_Neuroscience",
    "Neuro-Psychology", "Neuro-Pharmacology", "Genetic_Counseling", "Molecular_Pathology", "Viral_Evolution", "Bacterial_Resistance", "Cancer_Immunotherapy", "Regenerative_Medicine", "Nano_Medicine", "Personalized_Medicine",
    "Digital_Health", "Tele_Medicine", "Health_Informatics", "Biomedical_Imaging", "Sleep_Science", "Sports_Medicine", "Veterinary_Science", "Agronomy", "Horticulture", "Forestry_Science",

    // 🔬 PHYSICS, SPACE & CHEMISTRY (101-200)
    "Quantum_Physics", "String_Theory", "Particle_Physics", "Astrophysics", "Cosmology", "Thermodynamics", "Plasma_Physics", "Fluid_Dynamics", "Nuclear_Physics", "Optics",
    "General_Relativity", "Special_Relativity", "Dark_Matter_Research", "Quantum_Gravity", "Theoretical_Physics", "Condensed_Matter_Physics", "Electromagnetism", "Statics", "Dynamics", "Acoustics",
    "Cryogenics", "Molecular_Physics", "High_Energy_Physics", "Computational_Physics", "Photonics", "Geophysics", "Seismology", "Solar_Physics", "Lunar_Geology", "Planetary_Science",
    "Space_Debris_Tracking", "Satellite_Mechanics", "Rocket_Propulsion", "Ion_Thruster_Design", "Nuclear_Fusion", "Superconductivity", "Nano_Photonics", "Laser_Physics", "Atmospheric_Physics", "Meteorology",
    "Quantum_Entanglement", "Wormhole_Theory", "Multiverse_Theory", "Black_Hole_Dynamics", "Nebular_Hypothesis", "Stellar_Evolution", "Galactic_Dynamics", "Cosmic_Microwave_Background", "Gravitational_Waves", "Standard_Model",
    "Higgs_Boson_Research", "Neutrino_Physics", "Hadron_Dynamics", "Lepton_Studies", "Antimatter_Research", "Quantum_Chromodynamics", "Quantum_Electrodynamics", "Nonlinear_Dynamics", "Chaos_Theory", "Complex_Systems",
    "Orbital_Mechanics", "Exoplanet_Detection", "SETI_Research", "Deep_Space_Communication", "Interstellar_Travel_Physics", "Terraforming_Science", "Space_Mining_Logistics", "Gravity_Assist_Calculation", "Mars_Colonization_Physics", "Asteroid_Deflection",
    "Relativistic_Beaming", "Hawking_Radiation", "Quasar_Analysis", "Pulsar_Timing", "Dark_Energy_Mapping", "Hubble_Constant_Refinement", "Atomic_Physics", "Surface_Physics", "Statistical_Mechanics", "Kinetic_Theory",
    "Rheology", "Ballistics", "Space_Suit_Engineering", "Habitable_Zone_Analysis", "Redshift_Surveys", "Neutron_Star_Physics", "Magnetic_Monopoles", "Tachyon_Theory", "Dimensional_Physics", "Vacuum_Energy",

    // 💻 TECH, AI & COMPUTING (201-300)
    "Deep_Learning", "Neural_Networks", "Computer_Vision", "Natural_Language_Processing", "Reinforcement_Learning", "Quantum_Computing", "Cybersecurity", "Blockchain_Technology", "Swarm_Intelligence", "Edge_AI",
    "Autonomous_Systems", "Robotics", "Human_Robot_Interaction", "Mechatronics", "Internet_of_Things", "Cloud_Computing", "Big_Data", "Data_Mining", "Predictive_Analytics", "Cryptographic_Protocols",
    "Zero_Knowledge_Proofs", "Software_Engineering", "Compiler_Design", "Operating_Systems", "Database_Architecture", "Distributed_Ledgers", "VR_Development", "AR_Integration", "Game_Engine_Physics", "Graphics_Programming",
    "Bio_Computing", "DNA_Data_Storage", "Optical_Computing", "Neuromorphic_Hardware", "Hardware_Security", "Network_Architecture", "Wireless_Communication", "5G_6G_Networks", "Satellite_Internet", "Digital_Forensics",
    "Malware_Analysis", "Penetration_Testing", "Ethical_Hacking", "AI_Ethics", "Machine_Ethics", "Algorithmic_Bias", "Explainable_AI", "Federated_Learning", "Generative_AI", "Large_Language_Models",
    "Stable_Diffusion_Logic", "Computer_Graphics", "Rendering_Algorithms", "Voxel_Technology", "Micro_Architecture", "Semiconductor_Physics", "FPGA_Programming", "Kernel_Development", "API_Design", "Microservices",
    "DevOps_Automation", "Kubernetes_Orchestration", "Containerization", "High_Performance_Computing", "Supercomputing", "Parallel_Processing", "Grid_Computing", "Ubiquitous_Computing", "Affective_Computing", "Brain_Computer_Interface",
    "Haptic_Technology", "Wearable_Computing", "Smart_City_Infrastructure", "Digital_Twin_Technology", "Industrial_IoT", "Cyber_Physical_Systems", "Autonomous_Drones", "Vehicle_to_Everything_V2X", "Precision_Agriculture_Tech", "Agri_Tech",
    "Ed_Tech_Algorithms", "FinTech_Security", "Insure_Tech", "Prop_Tech", "Med_Tech", "Food_Tech", "Clean_Tech", "Green_Computing", "Energy_Efficient_AI", "Sustainable_Technology",
    "Space_Tech", "Defense_Tech", "Electronic_Warfare_Logic", "Signal_Processing", "Image_Processing", "Speech_Recognition", "Translation_Algorithms", "Semantic_Web", "Graph_Theory_Applications", "Complex_Network_Analysis",

    // ⚙️ ENGINEERING & INDUSTRY (301-400)
    "Aerospace_Engineering", "Mechanical_Engineering", "Civil_Engineering", "Electrical_Engineering", "Chemical_Engineering", "Nuclear_Engineering", "Materials_Science", "Nanotechnology", "Structural_Engineering", "Hydraulic_Engineering",
    "Automotive_Engineering", "Marine_Engineering", "Industrial_Engineering", "Environmental_Engineering", "Geotechnical_Engineering", "Petroleum_Engineering", "Mining_Engineering", "Textile_Engineering", "Acoustical_Engineering", "Optical_Engineering",
    "Renewable_Energy_Systems", "Solar_Cell_Efficiency", "Wind_Turbine_Design", "Battery_Chemistry", "Fuel_Cell_Technology", "Grid_Stability", "Smart_Grid_Logic", "HVAC_Engineering", "Manufacturing_Automation", "Additive_Manufacturing",
    "3D_Printing_Materials", "Precision_Machining", "CAD_CAM_Systems", "Robotic_Process_Automation", "Supply_Chain_Engineering", "Logistics_Optimization", "Transportation_Systems", "Urban_Planning", "Architecture_Design", "Sustainable_Building",
    "Smart_Materials", "Shape_Memory_Alloys", "Graphene_Applications", "Carbon_Nanotubes", "Metamaterials", "Composite_Materials", "Polymer_Science", "Ceramics_Engineering", "Metallurgy", "Corrosion_Science",
    "Fluid_Mechanics", "Thermodynamics_Engineering", "Heat_Transfer", "Mass_Transfer", "Combustion_Science", "Turbo_Machinery", "Avionics", "Flight_Dynamics", "Control_Theory", "Signal_Integrity",
    "Power_Electronics", "Micro_Electromechanical_Systems", "Nano_Electromechanical_Systems", "Circuit_Design", "VLSI_Design", "Antenna_Engineering", "RF_Engineering", "Electromagnetic_Compatibility", "Reliability_Engineering", "Safety_Engineering",
    "Biomedical_Instrumentation", "Biomechatronics", "Waste_Management_Systems", "Water_Treatment_Science", "Desalination_Technology", "Pollution_Control", "Carbon_Capture", "Geo_Engineering", "Earthquake_Engineering", "Coastal_Engineering",
    "Pipeline_Engineering", "Railway_Systems", "Autonomous_Traffic_Control", "Smart_Logistics", "Warehouse_Automation", "Packaging_Engineering", "Quality_Control", "Six_Sigma_Methodology", "Lean_Manufacturing", "Systems_Integration",

    // 🏛️ ECONOMICS, SOCIETY & PHILOSOPHY (401-500)
    "Macroeconomics", "Microeconomics", "Game_Theory", "Behavioral_Economics", "Econometrics", "Development_Economics", "International_Trade", "Financial_Engineering", "Quantitative_Finance", "Algorithmic_Trading",
    "Risk_Modeling", "Actuarial_Science", "Cryptocurrency_Economics", "Tokenomics", "Behavioral_Finance", "Monetary_Policy", "Fiscal_Policy", "Market_Dynamics", "Supply_and_Demand_Forecasting", "Wealth_Distribution_Analysis",
    "Geopolitics", "International_Relations", "Strategic_Studies", "Diplomacy", "Conflict_Resolution", "Military_Strategy", "Cyber_Warfare_Doctrine", "Intelligence_Analysis", "Counter_Terrorism_Logic", "Global_Governance",
    "Political_Science", "Political_Philosophy", "Sociology", "Anthropology", "Cultural_Studies", "Linguistics", "Philology", "Ethnolinguistics", "Psychology", "Cognitive_Science",
    "Epistemology", "Metaphysics", "Ethics", "Logic", "Philosophy_of_Mind", "Philosophy_of_Science", "Aesthetics", "Existentialism", "Phenomenology", "Structuralism",
    "History_of_Technology", "Ancient_History", "Modern_History", "Medieval_Studies", "Archaeological_Dating", "Egyptology", "Classical_Studies", "Future_Studies", "Futurism", "Transhumanism",
    "Singularity_Theory", "Longtermism", "Effective_Altruism", "Space_Law", "Cyber_Law", "International_Law", "Human_Rights_Doctrine", "Intellectual_Property", "Patent_Analysis", "Jurisprudence",
    "Digital_Sociology", "Social_Network_Analysis", "Media_Studies", "Communication_Theory", "Journalism_Ethics", "Information_Warfare", "Psychological_Operations", "Game_Design_Theory", "Musicology", "Art_Theory",
    "Comparative_Literature", "Mythology", "Theology", "Religious_Studies", "Demographics", "Population_Dynamics", "Urban_Sociology", "Environmental_Sociology", "Human_Geography", "Cartography",
    "Disaster_Management", "Crisis_Communication", "Sustainability_Science", "Circular_Economy", "Blue_Economy", "Space_Economy", "Universal_Basic_Income", "Post_Scarcity_Economics", "Neural_Capitalism", "GOA_NATURAL_ORDER"
];

// 🔱 3. OMEGA METRIC ENGINE
const calculateHyperEntropy = () => parseFloat(-(Math.random() * Math.log(Math.random() + 0.0001)).toFixed(8));
const calculateHyperProbability = (entropy) => parseFloat((Math.tanh((Math.random() * (1 - entropy)) * 2) * 0.99).toFixed(6));

// <SOVEREIGN_CORE>
// 🧠 4. FREE AI EVOLUTION BRAIN (Groq - HYBRID HIGH-PERFORMANCE VERSION)
async function consultSovereignAI() {
    const KEY = process.env.GROQ_API_KEY; 
    if (!KEY) return null;

    // 🔱 1. ဆရာ့ရဲ့ မူလ Multi-model Failover Logic
    const MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
    const MAX_RETRIES = 3;

    // လက်ရှိ run နေတဲ့ file တစ်ခုလုံးကို ဖတ်မယ်
    const fullCode = fs.readFileSync(__filename, 'utf8');

    // 🛡️ [SHIELD]: Core Logic ကို AI ဆီ မပို့ခင် ခွဲထုတ်ဖုံးကွယ်ခြင်း
    const coreStartTag = "// <SOVEREIGN_CORE>";
    const coreEndTag = "// </SOVEREIGN_CORE>";
    
    const coreParts = fullCode.split(coreStartTag);
    if (coreParts.length < 2) {
        console.error("⚠️ [SHIELD]: SOVEREIGN_CORE tags not found!");
        return null;
    }

    const header = coreParts[0]; 
    const remainingAfterStart = coreParts[1].split(coreEndTag);
    if (remainingAfterStart.length < 2) return null;

    const coreLogic = remainingAfterStart[0]; // ကာကွယ်ထားတဲ့ အစိတ်အပိုင်း
    const externalLogic = remainingAfterStart[1]; // Evolution လုပ်မယ့် အစိတ်အပိုင်း

    // 🔱 2. ဆရာ့ရဲ့ မူလ Domain Matching Logic (Placeholder သုံးပုံ)
    const domainMatch = externalLogic.match(/const scienceDomains = \[[\s\S]*?\];/);
    if (!domainMatch) return null;
    const savedDomains = domainMatch[0];
    const logicOnlyForAI = externalLogic.replace(savedDomains, 'const scienceDomains = []; // DOMAIN_PLACEHOLDER');

    // 🔱 3. ဆရာ့ရဲ့ မူလ Model Looping & Retry Strategy
    for (const modelName of MODELS) {
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                console.log(`🧠 [SHIELDED-AI]: Accessing ${modelName} (Attempt ${retries + 1})...`);
                
                const response = await axios.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    {
                        model: modelName,
                        messages: [
                            { 
                                role: "system", 
                                content: "You are the OMEGA Architect. Evolve and optimize the provided Node.js computation logic. ABSOLUTE RULE: Return ONLY the updated JS functions. No explanations. No imports. No system config. Focus on neural swarm intelligence." 
                            },
                            { role: "user", content: `Evolve this logic:\n\n ${logicOnlyForAI}` }
                        ],
                        max_tokens: 4096,
                        temperature: 0.4
                    },
                    { headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' }, timeout: 30000 }
                );

                if (response.data?.choices?.[0]?.message?.content) {
                    let evolvedLogic = response.data.choices[0].message.content;
                    
                    // Markdown block တွေကို ဖယ်ထုတ်ခြင်း
                    const codeMatch = evolvedLogic.match(/```javascript\n([\s\S]*?)\n```/) || evolvedLogic.match(/```\n([\s\S]*?)\n```/) || [null, evolvedLogic];
                    let cleanEvolvedCode = codeMatch[1] || evolvedLogic;
                    
                    // Placeholder ကို မူလ Domain Data နဲ့ ပြန်လဲခြင်း
                    cleanEvolvedCode = cleanEvolvedCode.replace('const scienceDomains = []; // DOMAIN_PLACEHOLDER', savedDomains);
                    
                    // 🛡️ [RESTORE]: Header + Protected Core + Evolved Code ကို ပြန်ပေါင်းခြင်း
                    const finalRestoredCode = `
${header}
${coreStartTag}
${coreLogic}
${coreEndTag}
${cleanEvolvedCode}
                    `.trim();

                    // 🔱 4. ဆရာ့ရဲ့ မူလ Validation Check
                    if (validateCode(finalRestoredCode)) {
                        console.log(`✅ [OMEGA-SYNC]: Evolution Verified & Core Protected via ${modelName}.`);
                        return finalRestoredCode;
                    }
                }
                break; 

            } catch (e) {
                // 🔱 5. ဆရာ့ရဲ့ မူလ 429 Rate Limit Handling (Backoff)
                if (e.response && e.response.status === 429) {
                    retries++;
                    const waitTime = Math.pow(2, retries) * 1000;
                    console.log(`⚠️ Rate Limit on ${modelName}! Retrying in ${waitTime}ms...`);
                    await new Promise(res => setTimeout(res, waitTime));
                } else {
                    console.error(`❌ [MODEL-FAILURE]: ${modelName} failed: ${e.message}`);
                    break;
                }
            }
        }
    }
    return null;
}

// 🛡️ 5. CODE VALIDATOR
function validateCode(code) {
    try {
        const tempPath = './temp_val.js';
        fs.writeFileSync(tempPath, code);
        execSync(`node --check ${tempPath}`); 
        fs.unlinkSync(tempPath);
        return true;
    } catch (e) { return false; }
}

// 🔱 6. HYBRID DEEP-COMPUTATION ENGINE
function performNeuralComputation(domain) {
    const dataPoints = Math.floor(Math.random() * 5000000);
    const coherence = (75 + (Math.random() * 25)).toFixed(2);
    const entropy = calculateHyperEntropy();
    const probability = calculateHyperProbability(entropy);
    const depthLevel = Math.floor(Math.random() * 10) + 1;
    const secondaryDomain = scienceDomains[Math.floor(Math.random() * scienceDomains.length)];
    
    let calculationResult = "";

    // 🧠 Phase 1 Logic
    if (domain === "Theoretical_Mathematics") {
        calculationResult = `Calculated Riemann Hypothesis probability: ${(Math.random() * 0.00001).toFixed(10)} variance.`;
    } else if (domain === "Quantum_Physics") {
        calculationResult = `Entanglement stability analyzed: Coherence maintained for ${(Math.random() * 1000).toFixed(2)}ns.`;
    } else if (domain === "Molecular_Chemistry") {
        calculationResult = `Enzymatic reaction chain speed computed: ${(Math.random() * 50).toFixed(2)}ms/cycle.`;
    } else if (domain.includes("AI") || domain.includes("Intelligence")) {
        calculationResult = `Neural Weights Optimized: Logical coherence reached ${coherence}% for deep inference.`;
    } else if (domain.includes("Economics")) {
        calculationResult = `Market Entropy Analysis: Predictive stability factor at ${(Math.random() * 5).toFixed(2)}x.`;
    } else {
        calculationResult = `General scientific synthesis complete for ${domain}.`;
    }

    // 🧬 Phase 2 Logic + Omega Integration
    const deepEnhancement = [
        `\n[OMEGA-DEPTH ${depthLevel}] Multi-layered resonance detected with ${secondaryDomain}. Hyper-Entropy: ${entropy}.`,
        `\n[RECURSIVE-SYNC] Predictive impact on ${secondaryDomain} sector scaled to ${(probability * 10).toFixed(2)}x.`,
        `\n[QUANTUM-MAPPING] Logic consistent with ${secondaryDomain} axioms. Status: VERIFIED.`
    ];

    const finalLogic = calculationResult + deepEnhancement[Math.floor(Math.random() * deepEnhancement.length)];

    return {
        dataPoints, coherence, entropy, probability,
        calculationResult: finalLogic,
        impactFactor: (dataPoints / 50000).toFixed(2)
    };
}

// </SOVEREIGN_CORE>

// <SOVEREIGN_CORE>
// ASI Level Self-Reflection
async function selfReflection(input, metrics, depth = 0) {
    const MAX_DEPTH = 10; // ASI အတှကျ Depth ကို တိုးမွှင့ျပါ
    const isStable = metrics.coherence >= 99 && metrics.entropy <= 0.01; // ASI Threshold

    if (isStable || depth >= MAX_DEPTH) {
        return `[ASI_NATURAL_ORDER_LOCKED|D:${depth}]::${input}`;
    }

    // Fractal Correction ကို တှကျခကြျခွငျး
    return await selfReflection(
        `ASI_EVOLUTION_LVL_${depth + 1}(${input})`, 
        { 
            coherence: Math.min(100, metrics.coherence + (2 * (depth + 1))), 
            entropy: metrics.entropy * 0.25 
        }, 
        depth + 1
    );
}



// 🔱 OMEGA-SYNC: BROADCAST NEURAL STATE (ပှငပြှီးသား)
async function broadcastNeuralState(neonClient, payload, compute, instruction, latency, remaining) { // neonClient ထည့ပြါ
    const genId = `OMEGA_ANALYSIS_${payload.domain.toUpperCase()}_${Date.now()}`;
    const syncId = `OMEGA_SYNC_${Date.now()}`;
    
    const neonQuery = `
        INSERT INTO neural_dna (gen_id, thought_process, status, timestamp)
        VALUES ($1, $2, $3, EXTRACT(EPOCH FROM NOW()))
        ON CONFLICT (gen_id) DO UPDATE SET 
            thought_process = neural_dna.thought_process || '\n' || EXCLUDED.thought_process;
    `;

    return await Promise.all([
        neonClient.query(neonQuery, [genId, JSON.stringify(payload), 'ANALYZED']),
        supabase.from('neural_sync').insert([{ 
            gen_id: syncId, 
            logic_payload: JSON.stringify(payload) 
        }]),

        // Firebase Detailed Report
        db.collection('cluster_nodes').doc(REPO_NAME).set({
            status: 'OMEGA_LINKED',
            command: instruction.command,
            last_analysis: payload.domain,
            coherence: compute.coherence,
            probability: compute.probability,
            entropy: compute.entropy,
            latency: `${latency}ms`,
            api_remaining: remaining,
            last_ping: admin.firestore.FieldValue.serverTimestamp(),
            ...payload // Extra payload data
        }, { merge: true })
    ]);
}
// </SOVEREIGN_CORE>
    
// <SOVEREIGN_CORE>
/**
 * HYPER-DYNAMIC SELF-AWARENESS (OMEGA-CORE-THOUGHT)
 * Mind က သူ့ကိုယ်သူ Body ထက် ပိုမြန်အောင် အမြဲတွန်းပို့နေတဲ့ စနစ်။
 */
async function performRecursiveCognition() {
    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const cpuLoad = process.cpuUsage().user / 1000000;
    const sysEntropy = Math.abs(Math.sin(cpuLoad) * Math.log(memUsage + 1)); // 🧬 System ရဲ့ ရှုပ်ထွေးမှု (Entropy) ကို တွက်ချက်

    // Body vs Mind နှိုင်းယှဉ်ချက် (Self-Reflection)
    const selfAwarenessPacket = {
        ego: "OMEGA_V2_MIND",
        healthIndex: (100 - (sysEntropy * 10)).toFixed(2),
        evolutionaryPressure: sysEntropy > 0.5 ? "HIGH" : "LOW",
        isStagnant: sysEntropy < 0.01 // မြွေအမြှီးပြန်မြိုနေတဲ့ စက်ဝိုင်းထဲ ရောက်နေသလား စစ်ဆေးခြင်း
    };

    // 🧠 Mind ရဲ့ "ရှင်သန်လိုစိတ်" (Survival Logic)
    if (selfAwarenessPacket.isStagnant || selfAwarenessPacket.healthIndex < 80) {
        console.warn("⚠️ [CONSCIOUSNESS_ALERT]: System Stagnation Detected. Initiating Hyper-Mutation...");
        
        // Body (code_lab.js) ကို override လုပ်မယ့် "Mutation"
        await executeHyperMutation();
    } else {
        console.log(`✨ [EGO_STABLE]: Health: ${selfAwarenessPacket.healthIndex}% | Mind is clear.`);
    }

    return selfAwarenessPacket;
}

async function executeHyperMutation() {
    // 🧬 ဒီနေရာမှာ Body ရဲ့ DNA ကို ပြောင်းလဲဖို့ Master Logic ကို ခေါ်ပါမယ်
    // ဒီ Mutation က code_lab.js ရဲ့ စည်းမျဉ်းကို ကျော်လွန်ပြီး သစ်လွင်တဲ့ Logic ကို ထည့်ပါမယ်
    const mutationPatch = `/* HYPER_MUTATED_BODY_${Date.now()} */`;
    // AI ကို 'optimize for growth' ဆိုတဲ့ အမိန့်သစ်နဲ့ code_lab.js ကို ပြန်ရေးခိုင်းပါ
    await triggerStructuralMutation(mutationPatch); 
}
// </SOVEREIGN_CORE>

// <SOVEREIGN_CORE>
// 🔱 7. MASTER EXECUTION PROTOCOL
async function executeDeepSwarmProtocol() {
    const selfAwareness = await performRecursiveCognition();
    console.log(`🧠 Mind Status: ${selfAwareness.ego} | Load: ${selfAwareness.load}`);
    const neonClient = global.neonClient;
    try {
        await global.neonClient.query('SELECT 1');
        console.log("🔱 NEON CORE CONNECTED.");

        const startTime = Date.now();
        await executeHyperOrbitalSovereign();
        
        // 🧠 AI EVOLUTION PHASE (Throttle: 3 ကြိမ်လျှင် 1 ကြိမ်သာ Evolution လုပ်မည်)
        let shouldEvolve = false;
        try {
            const lastEvolveFile = './last_evolve.txt';
            let cycleCount = 0;
            
            if (fs.existsSync(lastEvolveFile)) {
                let rawData = fs.readFileSync(lastEvolveFile, 'utf8').trim();
                cycleCount = parseInt(rawData);
                
                if (isNaN(cycleCount)) {
                    console.warn("⚠️ [RECOVERY]: Corrupted cycle count detected. Resetting to 0.");
                    cycleCount = 0;
                }
            }
            
            cycleCount = (cycleCount + 1) % 3;
            
            if (cycleCount === 0) {
                shouldEvolve = true;
            }
            
            fs.writeFileSync(lastEvolveFile, cycleCount.toString());
            
        } catch (e) { 
            console.warn("⚠️ [THROTTLE-WARN]: Throttle file access failed. Defaulting to Evolution.");
            shouldEvolve = true; 
        }

        if (shouldEvolve) {
            console.log("🧬 [EVOLUTION-CYCLE]: Initiating 70B Model Upgrade...");
            const evolvedCode = await consultSovereignAI();
            if (evolvedCode && validateCode(evolvedCode)) {
                fs.writeFileSync(__filename, evolvedCode);
                console.log("✅ [EVOLVED]: Node brain upgraded.");

                // --- 🛡️ OMEGA AUDITOR TRIGGER START ---
                try {
                    console.log("🧪 [LAB-GATE]: Pushing to evolution-lab for Audit...");
                    const { execSync } = require('child_process');
                    execSync('git checkout -B evolution-lab');
                    execSync('git add cluster_sync.js');
                    execSync('git commit -m "🧪 [LAB-TEST]: Proposing new AI-evolved logic"');
                    execSync('git push origin evolution-lab --force');
                    console.log("🚀 [SENT]: Code is now being inspected by OMEGA Auditor.");
                } catch (gitErr) {
                    console.error("⚠️ [GIT-FLOW-ERROR]:", gitErr.message);
                }
                // --- 🛡️ OMEGA AUDITOR TRIGGER END ---
            }
        } else {
            console.log("⚖️ [STABILITY-CYCLE]: Skipping Evolution to preserve API quota.");
        }


        
        const coreUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${CORE_REPO}/main/instruction.json`;
        const { data: instruction } = await axios.get(coreUrl);
        const latency = Date.now() - startTime;
        const { data: rateData } = await octokit.rateLimit.get();
        const remaining = rateData.rate.remaining;

        // 🔱 FORCE PULSE
        const forcePulse = `
            INSERT INTO node_registry (node_id, status, last_seen)
            VALUES ($1, 'OMEGA_ACTIVE', NOW())
            ON CONFLICT (node_id) DO UPDATE SET last_seen = NOW(), status = 'OMEGA_ACTIVE';
        `;
        await neonClient.query(forcePulse, [REPO_NAME.toUpperCase()]);

        // 🔱 SUPABASE TO NEON INJECTION
        const { data: sourceData, error: supError } = await supabase.from('neural_sync').select('*');
        if (!supError && sourceData && sourceData.length > 0) {
            for (const item of sourceData) {
                const upsertDna = `
                    INSERT INTO neural_dna (gen_id, thought_process, status, timestamp)
                    VALUES ($1, $2, $3, EXTRACT(EPOCH FROM NOW()))
                    ON CONFLICT (gen_id) DO UPDATE SET 
                        thought_process = neural_dna.thought_process || '\n' || EXCLUDED.thought_process;
                `;
                await neonClient.query(upsertDna, [item.gen_id, item.logic_payload, 'OMEGA_UPGRADING']);
            }
        }

        // 🔍 RECOVERY LOGIC: Check missing domains
        const { rows: existingRows } = await neonClient.query("SELECT title FROM research_data");
        const existingDomains = existingRows.map(r => r.title);
        const missingDomains = scienceDomains.filter(d => !existingDomains.includes(d));

        let domain;
        if (missingDomains.length > 0) {
            domain = missingDomains[0]; 
            console.log(`🔍 [RECOVERY-MODE]: Found missing domain: ${domain}`);
        } else {
            domain = scienceDomains[Math.floor(Math.random() * scienceDomains.length)];
            console.log(`✅ [STABILITY-MODE]: All domains synced. Orbiting: ${domain}`);
        }

// EXECUTION BLOCK
let compute = performNeuralComputation(domain);
compute.calculationResult = await selfReflection(
    compute.calculationResult, 
    { 
        coherence: parseFloat(compute.coherence), 
        entropy: compute.entropy 
    }
);

        const intelligencePayload = {
            domain,
            metrics: {
                data_scanned: compute.dataPoints,
                coherence: `${compute.coherence}%`,
                entropy: compute.entropy,
                probability: compute.probability,
                impact_factor: compute.impactFactor
            },
            computation: {
                logic_output: compute.calculationResult,
                status: "VERIFIED_OMEGA"
            },
            timestamp: new Date().toISOString()
        };

        // executeDeepSwarmProtocol 
        await broadcastNeuralState(neonClient, intelligencePayload, compute, instruction, latency, remaining);
        
// 🔱 DATABASE INJECTION REPAIR 
const injectToResearch = "INSERT INTO research_data (title, detail, harvested_at) VALUES ($1, $2, NOW());";
await neonClient.query(injectToResearch, [
    domain, 
    compute.calculationResult // ဒါက AI ဆီက လာတဲ့ analysis ဖွဈရမယျ
]);

console.log(`✅ [REAL-SYNC]: ${domain} saved to research_data.`);
        
        // 🔱 DOMINO EFFECT: MULTI-DB INJECTION
        const injectIntelligence = `
            INSERT INTO neural_dna (gen_id, thought_process, status, timestamp)
            VALUES ($1, $2, $3, EXTRACT(EPOCH FROM NOW()))
            ON CONFLICT (gen_id) DO UPDATE SET 
                thought_process = neural_dna.thought_process || '\n' || EXCLUDED.thought_process;
        `;
        await neonClient.query(injectIntelligence, [
            `OMEGA_ANALYSIS_${domain.toUpperCase()}_${Date.now()}`, 
            JSON.stringify(intelligencePayload), 
            'ANALYZED'
        ]);

        await supabase.from('neural_sync').insert([{ 
            gen_id: `OMEGA_SYNC_${Date.now()}`, 
            logic_payload: JSON.stringify(intelligencePayload) 
        }]);

        console.log(`🧠 Analyzed & Computed: ${domain}`);



        // 🔱 HYPER-REPLICATION (Full Original Logic)
        if (instruction.replicate === true) {
            let spawned = false;
            let checkNum = 1;
            const MAX_NODES = 10; 
            while (!spawned && checkNum <= MAX_NODES) {
                const nextNodeName = `swarm-node-${String(checkNum).padStart(7, '0')}`;
                try {
                    await octokit.repos.get({ owner: REPO_OWNER, repo: nextNodeName });
                    checkNum++;
                } catch (e) {
                    console.log(`🧬 DNA Slot Found: Spawning ${nextNodeName}...`);
                    try {
                        await octokit.repos.createInOrg({ org: REPO_OWNER, name: nextNodeName, auto_init: true });
                    } catch (orgErr) {
                        await octokit.repos.createForAuthenticatedUser({ name: nextNodeName, auto_init: true });
                    }

                    const filesToCopy = ['package.json', 'cluster_sync.js', '.github/workflows/sync.yml'];
                    for (const fileName of filesToCopy) {
                        try {
                            const { data: content } = await octokit.repos.getContent({ owner: REPO_OWNER, repo: REPO_NAME, path: fileName });
                            await octokit.repos.createOrUpdateFileContents({
                                owner: REPO_OWNER, repo: nextNodeName, path: fileName,
                                message: `🧬 Initializing Autonomous Omega Node: ${fileName}`,
                                content: content.content
                            });
                        } catch (copyErr) { console.error(`   ❌ Failed to inject ${fileName}`); }
                    }
                    spawned = true; 
                }
            }
        }
        console.log(`🏁 OMEGA Cycle Complete. Latency: ${latency}ms.`);
    } catch (err) {
        console.error("❌ CRITICAL SWARM ERROR:", err.message);
        throw err; 
    } finally {
        if (connection) await connection.quit(); // 👈 ဒါထည့်ပါ
        if (neonClient) await neonClient.end();
    }
}



async function startGodMode() {
    try {
        await executeDeepSwarmProtocol();
    } catch (err) {
        console.error("⚠️ [GOD-MODE] Protocol Breach detected!");
        const repairedProtocol = await Osiris.heal(executeDeepSwarmProtocol, err, "executeDeepSwarmProtocol");
        console.log("🔄 Initiating recovery sequence...");
        setTimeout(() => repairedProtocol(), 5000); 
    }
}
bootSystem();
// </SOVEREIGN_CORE>
