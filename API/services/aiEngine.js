const { GoogleGenAI } = require('@google/genai');
const Incident = require('../models/Incident');
const AiThreatIntel = require('../models/AiThreatIntel');

// Initialize Gemini
let ai;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log('Gemini API initialized successfully.');
  } else {
    console.warn('GEMINI_API_KEY is not set in .env. AI Engine will not process data.');
  }
} catch (error) {
  console.error('Failed to initialize Gemini:', error);
}

// Keep track of the last time we analyzed to avoid duplicate analysis
let lastAnalyzedTimestamp = new Date(Date.now() - 5 * 60 * 1000); // 5 mins ago

const analyzeTrafficWithGemini = async () => {
  if (!ai) return;

  try {
    // 1. Fetch recent incidents since the last analysis
    const recentIncidents = await Incident.find({ timestamp: { $gt: lastAnalyzedTimestamp } }).sort('timestamp');
    
    if (recentIncidents.length === 0) {
      return; // Nothing new to analyze
    }

    // Update the timestamp to the latest incident so we don't re-process them next time
    lastAnalyzedTimestamp = recentIncidents[recentIncidents.length - 1].timestamp;

    console.log(`[AI Engine] Analyzing ${recentIncidents.length} new incidents with Gemini...`);

    // 2. Format the logs for Gemini
    const logSummary = recentIncidents.map(inc => 
      `[${inc.timestamp.toISOString()}] IP: ${inc.ip} | Target: ${inc.target} | Severity: ${inc.severity} | Type: ${inc.type}`
    ).join('\n');

    const prompt = `
      You are an expert Cybersecurity AI analyst for a platform called DecepShield AI.
      Analyze the following honeypot server logs. 
      Determine if this traffic indicates an organized attack (like brute force, scanning, injection).
      
      Logs:
      ${logSummary}

      Return ONLY a raw JSON object with the following structure (no markdown tags, no backticks, no extra text):
      {
        "classification": "Short Title of Attack (e.g., Automated SSH Brute Force)",
        "confidence": 95, 
        "mitreId": "T1110",
        "mitreName": "Brute Force",
        "severity": "High", // Must be Low, Medium, High, or Critical
        "pattern": "A detailed 1-2 sentence explanation of what the attacker is doing based on the IPs and targets.",
        "recommendation": "A 1 sentence recommendation on how to block or mitigate this."
      }
      If the logs just look like normal, scattered background noise, return {"classification": "Normal Noise", "severity": "Low"} and fill in the rest accordingly.
    `;

    // 3. Send to Gemini 2.0 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const responseText = response.text;
    
    // 4. Parse the JSON (clean up any markdown if Gemini accidentally included it)
    const cleanJsonString = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    const aiAnalysis = JSON.parse(cleanJsonString);

    // 5. Save the result to the Database
    if (aiAnalysis.severity !== 'Low' || aiAnalysis.classification !== 'Normal Noise') {
      const newIntel = await AiThreatIntel.create({
        classification: aiAnalysis.classification || 'Unknown Threat',
        confidence: aiAnalysis.confidence || 50,
        mitreId: aiAnalysis.mitreId || 'T0000',
        mitreName: aiAnalysis.mitreName || 'Unknown',
        severity: aiAnalysis.severity || 'Medium',
        pattern: aiAnalysis.pattern || 'Suspicious behavior detected.',
        recommendation: aiAnalysis.recommendation || 'Investigate further.',
        status: 'Active'
      });
      console.log(`[AI Engine] Threat Intel Generated: ${newIntel.classification}`);
    } else {
      console.log(`[AI Engine] Normal noise, no alert generated.`);
    }

  } catch (error) {
    console.error('[AI Engine] Error during Gemini analysis:', error.message);
  }
};

module.exports = {
  analyzeTrafficWithGemini
};
