import {
  ArtifactDataMap,
  RecentTransformation,
  SourceBriefData,
} from '../types/transformation';

export const MOCK_SOURCE_BRIEF: SourceBriefData = {
  sourceTitle: 'CISA Emergency Directive: Critical Remote Code Execution in Enterprise Security Gateways (CVE-2026-9999)',
  detectedDomain: 'Cybersecurity & Threat Intelligence',
  executiveSummary:
    'An unauthenticated remote code execution zero-day vulnerability (CVE-2026-9999) has been observed under active global exploitation targeting EdgeGuard Enterprise Gateways. The vulnerability grants complete root control via crafted HTTP header payloads sent to port 8443. Over 45,000 appliances are reachable worldwide, with 38% located across healthcare and critical infrastructure.',
  keyClaims: [
    {
      id: 'CLAIM-01',
      claim: 'CVE-2026-9999 provides unauthenticated root execution over WAN port 8443 without requiring credentials.',
      sourceQuote: 'enables unauthenticated remote attackers to execute arbitrary code with root privileges via crafted HTTP header payloads sent to the management interface',
      confidence: 0.99,
    },
    {
      id: 'CLAIM-02',
      claim: 'Global internet scans indicate 45,000+ vulnerable units exposed on public networks.',
      sourceQuote: 'Shodan and Censys telemetry reveals approximately 45,000 accessible endpoints globally, with 38% located across critical infrastructure and healthcare sectors',
      confidence: 0.98,
    },
    {
      id: 'CLAIM-03',
      claim: 'Vendor hotfix is currently unavailable; expected within 72 hours.',
      sourceQuote: 'EdgeGuard Systems has acknowledged the vulnerability but has NOT released an official patch. An emergency security hotfix is expected within 72 hours.',
      confidence: 1.0,
    },
  ],
  entities: [
    { name: 'CISA & Cyber Defense Partners', type: 'Government Agency', relevance: 'High' },
    { name: 'EdgeGuard Systems', type: 'Technology Vendor', relevance: 'High' },
    { name: 'Healthcare & Critical Infrastructure', type: 'Impacted Sector', relevance: 'High' },
    { name: 'CVE-2026-9999', type: 'Vulnerability Identifier', relevance: 'High' },
  ],
  statistics: [
    { metric: 'Exposed Appliances', value: '45,000+', context: 'Worldwide public IP telemetry' },
    { metric: 'Critical Sectors Share', value: '38%', context: 'Healthcare and infrastructure density' },
    { metric: 'Emergency Hotfix Window', value: '72 Hours', context: 'Expected vendor patch turnaround' },
    { metric: 'Affected Firmware', value: 'v4.2.0 - v4.8.4', context: 'Vulnerable appliance build versions' },
  ],
  recommendations: [
    'Immediately sever and drop inbound external WAN access to port 8443 at all boundary firewalls.',
    'Restrict administrative management console traffic exclusively to internal VPN connections enforcing hardware-token MFA.',
    'Audit proxy and SIEM egress logs for anomalous C2 beaconing connections to unverified external IPs.',
    'Pre-stage automated firmware update channels to immediately apply the vendor patch upon 72-hour release.',
  ],
  uncertainties: [
    'Formal threat actor attribution remains pending forensic validation (suspected state-aligned cluster).',
    'Total count of compromised appliances vs purely exposed perimeter endpoints is currently undetermined.',
  ],
};

export const MOCK_ARTIFACTS: ArtifactDataMap = {
  executive_summary: {
    title: 'Executive Intelligence Brief: Perimeter Security Gateway Compromise',
    tldr: 'An active zero-day flaw (CVE-2026-9999) allows unauthenticated remote attackers to gain root access to EdgeGuard enterprise security gateways. Over 45,000 units are globally exposed without an official patch. Immediate firewall isolation of port 8443 is required.',
    keyTakeaways: [
      'Critical zero-day exploit actively utilized in the wild to breach enterprise perimeters.',
      'Grants root shell access without login credentials via management port 8443.',
      'Disproportionately affects healthcare and utilities (38% of detected exposed endpoints).',
      'No official patch available today; emergency vendor update scheduled within 72 hours.',
    ],
    strategicImplications: [
      'Potential exposure of internal segmented networks to ransomware and data exfiltration.',
      'Regulatory compliance audit risk for critical infrastructure operators under reporting directives.',
    ],
    actionItems: [
      'Direct network engineering to block WAN port 8443 within the next 2 hours.',
      'Mandate MFA on all administrative gateway access points.',
      'Coordinate with SOC to initiate hunting on perimeter egress logs.',
    ],
    metrics: [
      { label: 'Exposed Units', value: '45,000+' },
      { label: 'Critical Sectors', value: '38%' },
      { label: 'Patch Window', value: '72 Hours' },
      { label: 'Exploit Vector', value: 'Port 8443' },
    ],
  },

  linkedin_post: {
    hook: '🚨 CRITICAL ADVISORY: Over 45,000 enterprise gateways are exposed to an unauthenticated zero-day exploit (CVE-2026-9999).',
    body: [
      'CISA and international cybersecurity agencies have confirmed active in-the-wild exploitation of EdgeGuard Enterprise Gateways. The flaw grants attackers complete root remote code execution without credentials.',
      'With 38% of exposed systems located across healthcare and critical infrastructure, network defenders cannot afford to wait for a vendor patch.',
    ],
    bulletPoints: [
      '⚠️ Vulnerability: CVE-2026-9999 (Firmware v4.2.0 - 4.8.4)',
      '🌐 45,000+ public-facing appliances exposed globally',
      '⏳ Vendor patch turnaround expected in 72 hours',
      '🛡️ Immediate mitigation: Drop WAN traffic to port 8443',
    ],
    callToAction: 'Has your organization audited boundary appliances today? Prioritize perimeter port isolation immediately.',
    hashtags: ['#CyberSecurity', '#InfoSec', '#ZeroDay', '#ThreatIntel', '#CISO'],
    charCount: 890,
  },

  x_thread: {
    totalTweets: 5,
    tweets: [
      {
        index: 1,
        tag: 'CRITICAL ALERT',
        text: '🚨 BREAKING: Active in-the-wild exploitation of CVE-2026-9999 affecting EdgeGuard enterprise gateways. Over 45,000 systems exposed worldwide with no vendor patch available. Key details and immediate mitigations: 🧵👇',
        charCount: 228,
      },
      {
        index: 2,
        tag: 'EXPLOIT MECHANICS',
        text: '2/5 The zero-day flaw allows remote attackers to obtain complete root privileges without credentials via crafted HTTP header payloads sent to port 8443. Impacts firmware builds 4.2.0 through 4.8.4.',
        charCount: 198,
      },
      {
        index: 3,
        tag: 'IMPACT ANALYSIS',
        text: '3/5 Public telemetry shows 45,000+ vulnerable units online. Alarmingly, 38% reside in healthcare facilities and critical infrastructure, making rapid response imperative.',
        charCount: 172,
      },
      {
        index: 4,
        tag: 'PATCH TIMELINE',
        text: '4/5 EdgeGuard Systems has confirmed the flaw and committed to an emergency hotfix within 72 hours. Organizations must not wait—immediate manual mitigation is mandatory.',
        charCount: 171,
      },
      {
        index: 5,
        tag: 'REQUIRED ACTION',
        text: '5/5 MANDATORY ACTIONS:\n1. Drop WAN inbound traffic to port 8443.\n2. Require VPN + MFA for admin access.\n3. Audit egress logs for C2 beaconing.\n\nRetweet to protect infrastructure teams!',
        charCount: 184,
      },
    ],
  },

  advisory: {
    advisoryId: 'ADV-2026-0922-CRIT',
    severity: 'CRITICAL',
    tlp: 'TLP:AMBER',
    targetAudience: [
      'Enterprise CISOs & SecOps Engineers',
      'Healthcare Network Administrators',
      'Critical Infrastructure SOC Leads',
    ],
    threatSummary:
      'Unauthenticated root remote code execution zero-day flaw actively leveraged to compromise perimeter edge appliances and stage lateral ransomware deployment.',
    technicalDetails:
      'The vulnerability resides in the HTTP header parsing daemon of the EdgeGuard administrative console listening on TCP port 8443. A malformed request results in a buffer boundary overwrite, yielding root execution without authentication tokens.',
    mitigationSteps: [
      {
        step: 1,
        action: 'Disable external WAN access to TCP port 8443 on perimeter firewalls.',
        urgency: 'Immediate',
      },
      {
        step: 2,
        action: 'Transition gateway management interfaces behind private VPNs requiring hardware MFA.',
        urgency: 'Immediate',
      },
      {
        step: 3,
        action: 'Review egress firewall logs for outbound beaconing to suspected C2 IP ranges.',
        urgency: 'Within 24h',
      },
      {
        step: 4,
        action: 'Stage systems to deploy emergency firmware update scheduled within 72 hours.',
        urgency: 'Routine',
      },
    ],
    contactInfo: 'Submit observed indicators of compromise to cirt@organization.gov or your regional CISA liaison.',
  },

  infographic: {
    headline: 'EdgeGuard Zero-Day Threat Matrix',
    subheadline: 'Key Telemetry, Attack Vectors, and 4-Step Remediation Workflow for CVE-2026-9999',
    kpiStats: [
      { value: '45,000+', label: 'Exposed Appliances', subtitle: 'Globally reachable endpoints', trend: 'alert' },
      { value: '38%', label: 'Critical Sectors', subtitle: 'Healthcare & utilities targeted', trend: 'alert' },
      { value: '0 Days', label: 'Patch Availability', subtitle: 'No vendor fix currently active', trend: 'alert' },
      { value: '72 Hours', label: 'Emergency Hotfix ETA', subtitle: 'Committed release window', trend: 'down' },
    ],
    processSteps: [
      { step: 1, title: 'Sever Port 8443', description: 'Drop inbound WAN traffic at boundary firewalls immediately.' },
      { step: 2, title: 'Enforce VPN + MFA', description: 'Restrict admin portal access to authenticated internal routes.' },
      { step: 3, title: 'Hunt Egress Logs', description: 'Inspect SIEM traffic for outbound adversary C2 communication.' },
      { step: 4, title: 'Deploy 72h Patch', description: 'Schedule rapid firmware upgrade upon vendor hotfix release.' },
    ],
    coreTakeaway:
      'DO NOT WAIT FOR THE PATCH. Perimeter isolation of management port 8443 is the only effective shield available today.',
  },

  presentation: {
    deckTitle: 'Executive Threat Briefing: CVE-2026-9999',
    estimatedMinutes: 8,
    slides: [
      {
        slideNumber: 1,
        title: 'Critical Zero-Day Vulnerability Assessment',
        bulletPoints: [
          'Briefing on active exploitation of EdgeGuard Enterprise Gateways',
          'Unauthenticated remote code execution yielding root privileges',
          'Immediate defense posture prior to vendor patch delivery',
        ],
        visualPrompt: 'High-contrast dark perimeter shield with glowing red warning telemetry badge.',
        speakerNotes: 'Good morning leaders. Today we present an urgent operational briefing on CVE-2026-9999, an active perimeter threat requiring immediate mitigation.',
      },
      {
        slideNumber: 2,
        title: 'Global Telemetry & Sector Exposure',
        bulletPoints: [
          '45,000+ public-facing appliances detected across search engines',
          '38% concentration in healthcare and municipal infrastructure',
          'Adversaries actively chaining exploit with credential dumping utilities',
        ],
        visualPrompt: 'World map showing vulnerability hotspots alongside sector distribution chart.',
        speakerNotes: 'Over 45,000 units are globally exposed. Over a third are in healthcare and essential services, making swift network segmentation imperative.',
      },
      {
        slideNumber: 3,
        title: 'Technical Mechanics & Vulnerable Surface',
        bulletPoints: [
          'Affects EdgeGuard appliance firmware builds 4.2.0 through 4.8.4',
          'Vector: Crafted HTTP headers sent to management port 8443',
          'Results in instant root execution with zero credential requirements',
        ],
        visualPrompt: 'Packet flow schematic tracing unauthenticated ingress packet to root shell execution.',
        speakerNotes: 'The vulnerability exists in the HTTP header parsing daemon. Attackers do not need valid credentials to gain root system execution.',
      },
      {
        slideNumber: 4,
        title: 'Mandatory 4-Step Mitigation Playbook',
        bulletPoints: [
          'Step 1: Sever external WAN access to port 8443 across all firewalls',
          'Step 2: Require internal VPN with hardware MFA for all admin portals',
          'Step 3: Execute threat hunts on proxy logs for known adversary C2 IPs',
          'Step 4: Prepare staging environment for the 72-hour emergency hotfix',
        ],
        visualPrompt: 'Horizontal chevron timeline diagram with urgency badges: Immediate, Within 24h, Staging.',
        speakerNotes: 'Because the vendor patch is 72 hours away, our line of defense is network perimeter isolation. We can execute this with zero impact to business traffic.',
      },
    ],
  },

  video_package: {
    title: 'Urgent Threat Advisory: CVE-2026-9999',
    durationSeconds: 60,
    aspectRatio: '16:9',
    scenes: [
      {
        sceneNumber: 1,
        timestamp: '00:00 - 00:15',
        visualDescription: 'Cinematic push-in on an enterprise server room with pulsing amber warning lights. Overlay displays global map with 45,000 glowing nodes.',
        visualRecommendation: 'Dark tech aesthetic with sleek red typography and warning badge.',
        narrationText: 'A critical cybersecurity emergency is unfolding. An unauthenticated zero-day vulnerability is actively compromising enterprise security gateways worldwide.',
        subtitles: 'CRITICAL ALERT: Enterprise Gateway Zero-Day Exploit Active Worldwide.',
        cameraDirection: 'Slow forward dolly toward server rack transitioning to map.',
      },
      {
        sceneNumber: 2,
        timestamp: '00:15 - 00:30',
        visualDescription: '2D motion graphic illustrating packet bypassing gateway login prompt and executing root terminal code.',
        visualRecommendation: 'Clean vector graphics with red alert pathways.',
        narrationText: 'Dubbed CVE-2026-9999, the flaw grants full root access without credentials. Over 45,000 systems are exposed—and no vendor patch is available today.',
        subtitles: 'Root control without credentials. 45,000+ units exposed with no patch available.',
        cameraDirection: 'Smooth horizontal vector pan across packet route.',
      },
      {
        sceneNumber: 3,
        timestamp: '00:30 - 00:45',
        visualDescription: 'Split screen displaying 3 mitigation cards highlighting firewall port blocking, VPN enforcement, and egress log analysis.',
        visualRecommendation: 'Modern dashboard card UI layout with animated checkmark reveals.',
        narrationText: 'Security teams must act immediately. Restrict WAN access to port 8443, enforce VPN authentication with MFA, and audit egress traffic now.',
        subtitles: 'IMMEDIATE MITIGATION: Block port 8443, enforce VPN MFA, and audit egress traffic.',
        cameraDirection: 'Sequential zoom to each mitigation step card.',
      },
      {
        sceneNumber: 4,
        timestamp: '00:45 - 00:60',
        visualDescription: 'Perimeter firewall shield turns solid green. Official advisory reference and emergency contact details appear on screen.',
        visualRecommendation: 'Authoritative corporate finish with verified shield badge.',
        narrationText: 'Do not wait for the official patch. Protect your network perimeter today and stay tuned for the 72-hour firmware hotfix.',
        subtitles: 'Protect your network now. Full advisory details in description.',
        cameraDirection: 'Smooth pull-back to closing logo card.',
      },
    ],
    fullScript:
      'A critical cybersecurity emergency is unfolding. An unauthenticated zero-day vulnerability is actively compromising enterprise security gateways worldwide.\n\nDubbed CVE-2026-9999, the flaw grants full root access without credentials. Over forty-five thousand systems are exposed—and no vendor patch is available today.\n\nSecurity teams must act immediately. Restrict WAN access to port 8443, enforce VPN authentication with MFA, and audit egress traffic now.\n\nDo not wait for the official patch. Protect your network perimeter today and stay tuned for the seventy-two hour firmware hotfix.',
    thumbnailConcept: 'Bold red warning banner reading "ZERO-DAY EXPLOIT" over a dark enterprise server rack with glowing red lock icon.',
  },
};

export const MOCK_RECENT_TRANSFORMATIONS: RecentTransformation[] = [
  {
    id: 'TX-2026-0901',
    title: 'CISA Emergency Directive: CVE-2026-9999 Gateway Exploit',
    domain: 'Cybersecurity',
    date: 'Sep 22, 2026 · 14:32',
    inputType: 'PDF',
    outputTypes: ['executive_summary', 'linkedin_post', 'x_thread', 'advisory', 'infographic', 'presentation', 'video_package'],
    status: 'Completed',
  },
  {
    id: 'TX-2026-0898',
    title: 'MedAgent-X Multi-Center Clinical Diagnostic Trial (24,500 Patients)',
    domain: 'Healthcare AI',
    date: 'Sep 21, 2026 · 18:15',
    inputType: 'PDF',
    outputTypes: ['executive_summary', 'linkedin_post', 'infographic', 'presentation'],
    status: 'Completed',
  },
  {
    id: 'TX-2026-0884',
    title: 'Enterprise Q3 Financial Guidance & Capital Allocation',
    domain: 'Corporate Finance',
    date: 'Sep 20, 2026 · 09:45',
    inputType: 'Text',
    outputTypes: ['executive_summary', 'linkedin_post', 'presentation'],
    status: 'Completed',
  },
  {
    id: 'TX-2026-0872',
    title: 'National Quantum Key Distribution Infrastructure Policy',
    domain: 'Government Policy',
    date: 'Sep 19, 2026 · 11:20',
    inputType: 'DOCX',
    outputTypes: ['executive_summary', 'advisory', 'infographic'],
    status: 'Completed',
  },
];
