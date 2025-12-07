// Mock medical AI responses for demo purposes
// These will be replaced with real CyborgDB + AI responses

interface ResponseMatch {
  keywords: string[];
  response: string;
}

const medicalResponses: ResponseMatch[] = [
  {
    keywords: ['diabetes', 'type 2', 'treatment', 'elderly'],
    response: `## Treatment Options for Type 2 Diabetes in Elderly Patients

**First-Line Therapy:**
- **Metformin** remains the cornerstone of treatment, starting at 500mg with meals
- Consider reduced dosing (max 1500mg/day) in patients with eGFR 30-45

**Second-Line Options (based on patient profile):**
1. **GLP-1 Receptor Agonists** (e.g., Semaglutide, Liraglutide)
   - Cardiovascular benefit demonstrated
   - Weight loss effect beneficial in obese patients
   - Weekly formulations improve adherence

2. **SGLT2 Inhibitors** (e.g., Empagliflozin, Dapagliflozin)
   - Heart failure and renal protection
   - Avoid in recurrent UTIs or genital infections

3. **DPP-4 Inhibitors** (e.g., Sitagliptin, Linagliptin)
   - Weight-neutral option
   - Good safety profile in elderly

**Special Considerations for Elderly:**
- Avoid sulfonylureas (hypoglycemia risk)
- Relaxed A1C targets (7.5-8.0%) in frail patients
- Monitor renal function every 3-6 months
- Consider polypharmacy interactions

**Monitoring Schedule:**
- A1C every 3 months until stable, then every 6 months
- Annual comprehensive metabolic panel
- Annual eye and foot examinations`,
  },
  {
    keywords: ['metformin', 'lisinopril', 'interaction', 'drug'],
    response: `## Drug Interaction Analysis: Metformin + Lisinopril

**Interaction Severity:** Low (No significant clinical interaction)

**Mechanism:**
Both medications are renally eliminated but utilize different transport mechanisms. No direct pharmacokinetic or pharmacodynamic interaction.

**Clinical Considerations:**
1. **Renal Function Monitoring**
   - Both drugs require dose adjustment in renal impairment
   - Monitor creatinine and eGFR at baseline and every 3-6 months
   - Metformin: Contraindicated if eGFR <30
   - Lisinopril: Reduce dose if eGFR <30

2. **Benefits of Combination**
   - Lisinopril provides renal protection in diabetic nephropathy
   - Both reduce cardiovascular mortality in diabetic patients

**Recommendations:**
✓ Safe to use together
✓ Monitor potassium levels (ACE inhibitor effect)
✓ Hold both before contrast procedures
✓ Counsel patient on sick-day rules

**No dose adjustments required for the interaction itself.**`,
  },
  {
    keywords: ['hypertension', 'blood pressure', 'patient', 'case'],
    response: `## Hypertension Management Summary

**Based on encrypted patient records analysis:**

I found 3 patients with hypertension-related conditions in the secure database.

**Patient Overview:**
- P-001: Hypertension with Type 2 Diabetes (BP: 138/88)
- P-003: Post-cardiac surgery with CHF (BP: 126/80)
- P-006: CKD Stage 3 with secondary hypertension (BP: 142/88)

**Treatment Patterns:**
- ACE inhibitors (Lisinopril) used in 2/3 cases
- Beta-blockers added for cardiac protection
- Target BP <130/80 for diabetic patients

**Recommendations:**
1. P-001: Consider adding amlodipine if BP remains >130/80
2. P-006: May need additional antihypertensive; consider loop diuretic

**Note:** All data retrieved through encrypted vector search. Patient identities protected per HIPAA guidelines.`,
  },
  {
    keywords: ['cardiac', 'heart', 'cabg', 'surgery', 'post'],
    response: `## Post-Cardiac Surgery Care Protocols

**Current Encrypted Records Match:** Patient P-003

**Standard Post-CABG Protocol:**

**Medications:**
1. **Antiplatelet Therapy**
   - Aspirin 81mg daily (lifelong)
   - Clopidogrel 75mg x 12 months if DAPT indicated

2. **Anticoagulation (for AF)**
   - Warfarin with target INR 2.0-3.0
   - Consider DOAC if stable

3. **Cardiac Protection**
   - Beta-blocker (Metoprolol)
   - ACE inhibitor (Lisinopril)
   - Statin (high-intensity)

**Monitoring Schedule:**
- INR weekly until stable, then monthly
- Echo at 6 weeks, 6 months, annually
- Cardiac rehab referral

**Red Flags:**
⚠️ Chest pain or pressure
⚠️ Shortness of breath at rest
⚠️ Fever >101°F
⚠️ Wound drainage or redness`,
  },
  {
    keywords: ['contraindication', 'avoid', 'should not', 'risk'],
    response: `## Contraindications Analysis

**Common Drug Contraindications in Current Patient Population:**

**Metformin:**
- ❌ eGFR <30 mL/min (absolute)
- ⚠️ eGFR 30-45 (use with caution, reduce dose)
- ❌ Active liver disease
- ❌ Metabolic acidosis
- ⚡ Hold 48h before/after contrast

**ACE Inhibitors (Lisinopril):**
- ❌ History of angioedema
- ❌ Bilateral renal artery stenosis
- ❌ Pregnancy
- ⚠️ Hyperkalemia (K+ >5.5)

**Warfarin:**
- ❌ Active bleeding
- ❌ Recent CNS surgery
- ⚠️ Falls risk (relative)
- ⚠️ Poor medication adherence

**NSAIDs (relevant for pain management):**
- ❌ CKD Stage 4-5
- ❌ Active GI bleeding
- ⚠️ Heart failure
- ⚠️ Concurrent anticoagulation

This information was retrieved from encrypted clinical guidelines and cross-referenced with patient records.`,
  },
];

const defaultResponse = `## Medical Query Response

I've analyzed your query using encrypted vector search across our HIPAA-compliant medical database.

**Search Results:**
Based on the semantic similarity search, I found relevant information in our encrypted knowledge base.

**Key Points:**
- All queries are processed using AES-256 encryption
- Patient data is de-identified and protected
- Full audit trail maintained for compliance

**Recommendation:**
For specific clinical decisions, please consult the relevant specialty guidelines or reach out to the appropriate specialist.

**Note:** This response was generated through secure retrieval-augmented generation (RAG) with full encryption throughout the pipeline.`;

export function getMockMedicalResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  for (const match of medicalResponses) {
    const matchCount = match.keywords.filter(keyword => 
      lowerQuery.includes(keyword)
    ).length;
    
    if (matchCount >= 2) {
      return match.response;
    }
  }
  
  // Check for single keyword matches with lower confidence
  for (const match of medicalResponses) {
    if (match.keywords.some(keyword => lowerQuery.includes(keyword))) {
      return match.response;
    }
  }
  
  return defaultResponse;
}
