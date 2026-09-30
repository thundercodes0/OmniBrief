import { SourceBrief, ArtifactPayloadMap, FactAuditResult } from '@shared/types';

export interface DemoPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  sourceText: string;
  contextPrompt: string;
  defaultParams: {
    targetAudience: string;
    tone: string;
    language: string;
    detailLevel: 'concise' | 'standard' | 'comprehensive';
    objective: string;
    contentStyle: string;
  };
  mockBrief: SourceBrief;
  mockArtifacts: ArtifactPayloadMap;
  mockAudits: Record<string, FactAuditResult>;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'cyber-advisory-2026',
    name: 'Cybersecurity Alert: Zero-Day Gateway Exploit',
    description: 'High-severity advisory on unauthenticated remote code execution targeting enterprise boundary appliances.',
    category: 'Cybersecurity & Threat Intelligence',
    sourceText: `CISA and international cyber defense partners have detected widespread active exploitation of CVE-2026-9999, a critical zero-day vulnerability affecting EdgeGuard Enterprise Secure Gateway appliances firmware versions 4.2.0 through 4.8.4.

The vulnerability enables unauthenticated remote attackers to execute arbitrary code with root privileges via crafted HTTP header payloads sent to the management interface port 8443. Shodan and Censys telemetry reveals approximately 45,000 accessible endpoints globally, with 38% located across critical infrastructure and healthcare sectors.

As of September 22, 2026, EdgeGuard Systems has acknowledged the vulnerability but has NOT released an official patch. An emergency security hotfix is expected within 72 hours. Attackers are actively chaining this flaw with credential dumping tools to establish persistence and deploy ransomware payloads.

Immediate mandatory mitigations:
1. Immediately restrict or disable external WAN access to port 8443 across all firewall perimeters.
2. Enforce strict VPN access with phishing-resistant MFA for all administrative management ports.
3. Review firewall egress logs for outbound C2 connections to suspicious IP blocks (e.g. 198.51.100.0/24).
4. Perform cryptographic hash integrity verification on all appliance system binaries.

Attribution to a specific advanced persistent threat (APT) actor remains unconfirmed, though tactics align with state-sponsored espionage clusters.`,
    contextPrompt: 'Prioritize operational urgency for enterprise IT Directors, CISOs, and SecOps engineers. Maintain strict technical accuracy.',
    defaultParams: {
      targetAudience: 'CISOs & Enterprise IT Teams',
      tone: 'Urgent & Authoritative',
      language: 'English',
      detailLevel: 'standard',
      objective: 'Warn & Advise',
      contentStyle: 'Actionable & Threat-Focused',
    },
    mockBrief: {
      briefId: 'brief_demo_cyber_01',
      meta: {
        title: 'CISA Alert: CVE-2026-9999 Critical Zero-Day in EdgeGuard Gateways',
        detectedDomain: 'Cybersecurity / Threat Intelligence',
        primaryLanguage: 'en',
        urgencyLevel: 'Critical',
        originalWordCount: 220,
        timestamp: new Date().toISOString(),
      },
      executiveSummary: 'Active widespread exploitation of an unauthenticated remote code execution zero-day (CVE-2026-9999) impacts over 45,000 EdgeGuard enterprise gateways worldwide with no official patch currently available.',
      coreThesis: 'Immediate network isolation of management interfaces is mandatory to prevent unauthorized root system compromise and subsequent ransomware deployment.',
      keyClaims: [
        {
          id: 'C1',
          statement: 'CVE-2026-9999 enables unauthenticated remote attackers to execute arbitrary code with root privileges.',
          category: 'technical_fact',
          verbatimQuote: 'enables unauthenticated remote attackers to execute arbitrary code with root privileges via crafted HTTP header payloads',
          confidence: 1.0,
        },
        {
          id: 'C2',
          statement: 'Telemetry reveals approximately 45,000 exposed devices globally, with 38% in critical infrastructure and healthcare.',
          category: 'metric',
          verbatimQuote: 'Shodan and Censys telemetry reveals approximately 45,000 accessible endpoints globally, with 38% located across critical infrastructure and healthcare sectors.',
          confidence: 0.98,
        },
        {
          id: 'C3',
          statement: 'No official vendor patch is currently available; hotfix is expected within 72 hours.',
          category: 'event',
          verbatimQuote: 'EdgeGuard Systems has acknowledged the vulnerability but has NOT released an official patch. An emergency security hotfix is expected within 72 hours.',
          confidence: 1.0,
        },
      ],
      entitiesAndStakeholders: [
        { name: 'CISA & Cyber Defense Partners', role: 'Reporting Government Authority', impactLevel: 'high' },
        { name: 'EdgeGuard Systems', role: 'Vulnerable Appliance Manufacturer', impactLevel: 'high' },
        { name: 'Critical Infrastructure & Healthcare', role: 'Disproportionately Affected Sectors', impactLevel: 'high' },
      ],
      quantitativeData: [
        { metric: 'Exposed Devices', value: '45,000+', context: 'Worldwide accessible endpoints via Shodan/Censys' },
        { metric: 'Critical Sector Share', value: '38%', context: 'Infrastructure & Healthcare endpoints' },
        { metric: 'Patch Window', value: '72 hours', context: 'Expected emergency vendor hotfix timeframe' },
        { metric: 'Affected Firmware', value: 'v4.2.0 - v4.8.4', context: 'EdgeGuard appliance versions' },
      ],
      actionableDirectives: [
        { directive: 'Immediately restrict or disable external WAN access to port 8443 at firewall edge.', priority: 'Immediate', targetAudience: 'Network Administrators' },
        { directive: 'Enforce phishing-resistant MFA across all administrative access routes.', priority: 'Immediate', targetAudience: 'SecOps' },
        { directive: 'Inspect egress traffic for outbound C2 telemetry to suspicious IP ranges.', priority: 'Short-Term', targetAudience: 'SOC Analysts' },
      ],
      boundsAndUncertainties: [
        'Attribution to a specific threat actor group remains unconfirmed.',
        'Total number of compromised vs exposed systems is not yet fully enumerated.',
      ],
    },
    mockArtifacts: {
      executive_summary: {
        title: 'Executive Threat Briefing: EdgeGuard Gateway Zero-Day (CVE-2026-9999)',
        tldr: 'An unauthenticated zero-day exploit with root access capabilities is actively compromising EdgeGuard enterprise security gateways. With 45,000 devices exposed worldwide and no vendor patch released, immediate firewall isolation of port 8443 is mandatory.',
        keyFindings: [
          'Critical root remote code execution flaw (CVE-2026-9999) affecting EdgeGuard v4.2.0 - v4.8.4.',
          'Active exploitation confirmed in the wild; attackers chaining flaw to deploy ransomware.',
          '45,000 exposed systems identified, including 38% in critical healthcare and utility networks.',
          'Vendor has committed to an emergency patch within 72 hours.',
        ],
        strategicImplications: [
          'Direct exposure of enterprise perimeter defense systems to hostile external takeover.',
          'Potential regulatory and compliance fallout for critical infrastructure operators if unmitigated.',
        ],
        recommendedActions: [
          'Mandate perimeter firewall block of port 8443 within the next 2 hours.',
          'Initiate threat hunting across egress proxies for known C2 telemetry.',
          'Prepare automated patch staging environment for deployment upon vendor hotfix release.',
        ],
        highlightedMetrics: [
          { label: 'Exposed Endpoints', value: '45,000', significance: 'Active global perimeter count' },
          { label: 'Critical Sectors', value: '38%', significance: 'Healthcare and infrastructure targets' },
          { label: 'Patch ETA', value: '72 Hours', significance: 'Anticipated vendor release window' },
        ],
        markdownContent: `## Threat Summary\nActive zero-day exploitation against **EdgeGuard Enterprise Gateways** enables unauthenticated root code execution.\n\n### Required Next Steps\n- **Block Port 8443** at the WAN perimeter immediately.\n- **Verify Integrity** of appliances running firmware 4.2.0 - 4.8.4.\n- **Standby for Vendor Hotfix** scheduled within 72 hours.`,
      },
      linkedin_post: {
        hook: '🚨 CRITICAL ADVISORY: Over 45,000 enterprise gateways are actively exposed to an unauthenticated zero-day flaw (CVE-2026-9999).',
        bodyParagraphs: [
          'CISA and global cybersecurity authorities have confirmed active in-the-wild exploitation of EdgeGuard Secure Gateway appliances. The vulnerability grants unauthenticated attackers full root remote code execution simply by sending crafted HTTP headers.',
          'Alarmingly, 38% of exposed endpoints belong to critical infrastructure and healthcare institutions—and NO vendor patch is currently available.',
        ],
        bulletInsights: [
          '⚠️ Zero-Day Vulnerability: CVE-2026-9999 (Firmware v4.2.0 - 4.8.4)',
          '🌐 45,000+ vulnerable appliances exposed on public internet',
          '⏳ Vendor hotfix expected within 72 hours',
          '🛡️ Immediate mitigation: Sever WAN access to management port 8443',
        ],
        callToAction: 'Has your security operations team audited all perimeter devices today? Take action before the 72-hour patch window closes.',
        hashtags: ['#CyberSecurity', '#InfoSec', '#ZeroDay', '#ThreatIntel', '#CISO'],
        characterCount: 940,
        fullFormattedPost: `🚨 CRITICAL ADVISORY: Over 45,000 enterprise gateways are actively exposed to an unauthenticated zero-day flaw (CVE-2026-9999).\n\nCISA and global cybersecurity authorities have confirmed active in-the-wild exploitation of EdgeGuard Secure Gateway appliances. The vulnerability grants unauthenticated attackers full root remote code execution simply by sending crafted HTTP headers.\n\nAlarmingly, 38% of exposed endpoints belong to critical infrastructure and healthcare institutions—and NO vendor patch is currently available.\n\nKey Facts:\n• ⚠️ Zero-Day Vulnerability: CVE-2026-9999 (Firmware v4.2.0 - 4.8.4)\n• 🌐 45,000+ vulnerable appliances exposed on public internet\n• ⏳ Vendor hotfix expected within 72 hours\n• 🛡️ Immediate mitigation: Sever WAN access to management port 8443\n\nHas your security operations team audited all perimeter devices today? Take action before the 72-hour patch window closes.\n\n#CyberSecurity #InfoSec #ZeroDay #ThreatIntel #CISO`,
      },
      twitter_thread: {
        hookTweet: '🧵 1/5 🚨 BREAKING CYBER ALERT: A critical unauthenticated zero-day (CVE-2026-9999) is under active exploitation against EdgeGuard enterprise gateways. 45,000+ systems exposed. Here is what you need to know and do right now: 👇',
        tweets: [
          {
            tweetNumber: 1,
            text: '🚨 BREAKING CYBER ALERT: A critical unauthenticated zero-day (CVE-2026-9999) is under active exploitation against EdgeGuard enterprise gateways. 45,000+ systems exposed. Here is what you need to know and do right now: 👇',
            charCount: 228,
            calloutBadge: 'CRITICAL ALERT',
          },
          {
            tweetNumber: 2,
            text: '2/5 The flaw allows remote attackers to obtain complete root privileges without any credentials via crafted HTTP headers to port 8443. Affects firmware versions 4.2.0 through 4.8.4.',
            charCount: 184,
            calloutBadge: 'TECHNICAL DETAIL',
          },
          {
            tweetNumber: 3,
            text: '3/5 45,000 endpoints are reachable globally. 38% are in hospitals & critical infrastructure. Attackers are already deploying ransomware payloads across unsegmented networks.',
            charCount: 174,
            calloutBadge: 'IMPACT',
          },
          {
            tweetNumber: 4,
            text: '4/5 ⚠️ No official patch exists yet. EdgeGuard expects to release an emergency hotfix within 72 hours. You cannot wait for the patch—immediate mitigation is mandatory.',
            charCount: 169,
            calloutBadge: 'PATCH STATUS',
          },
          {
            tweetNumber: 5,
            text: '5/5 ACTIONS REQUIRED NOW:\n• Block WAN port 8443 immediately\n• Require VPN + MFA for admin access\n• Inspect firewall logs for C2 beaconing\n\nRT to alert your network engineers! 🛡️',
            charCount: 174,
            calloutBadge: 'MITIGATION',
          },
        ],
        concludingCta: 'Retweet to protect infrastructure teams and verify your external perimeter ports.',
        totalTweets: 5,
        hashtags: ['#CyberSecurity', '#ZeroDay', '#InfoSec', '#CVE20269999'],
      },
      advisory: {
        advisoryId: 'ADV-2026-0922-CRIT',
        title: 'SECURITY ADVISORY: Active Exploitation of EdgeGuard Secure Gateway (CVE-2026-9999)',
        severity: 'CRITICAL',
        targetSystemsOrStakeholders: [
          'EdgeGuard Secure Gateway firmware v4.2.0 - v4.8.4',
          'Enterprise Network Operations Centers (NOC)',
          'Security Operations Centers (SOC)',
          'Healthcare & Critical Infrastructure Administrators',
        ],
        summary: 'Emergency notification regarding unauthenticated remote code execution vulnerability being actively leveraged for ransomware deployment across enterprise edge appliances.',
        threatOrIssueSynopsis: 'Attackers send malicious HTTP header payloads to management port 8443, gaining root execution without authentication. With approximately 45,000 devices exposed worldwide, hostile actors are moving quickly to establish persistent footholds prior to patch availability.',
        mitigationChecklist: [
          {
            stepNumber: 1,
            action: 'Block inbound external traffic to TCP port 8443 on all edge routers and perimeter firewalls.',
            urgency: 'Immediate',
            affectedComponent: 'Edge Perimeter Firewalls',
          },
          {
            stepNumber: 2,
            action: 'Place EdgeGuard management interfaces behind internal VPNs requiring hardware-token MFA.',
            urgency: 'Immediate',
            affectedComponent: 'Administrative Network Interface',
          },
          {
            stepNumber: 3,
            action: 'Inspect egress traffic logs for suspicious connections to known adversary C2 networks.',
            urgency: 'Within 24h',
            affectedComponent: 'Proxy & Egress Gateways',
          },
          {
            stepNumber: 4,
            action: 'Stage systems for deployment of vendor hotfix upon expected release within 72 hours.',
            urgency: 'Routine',
            affectedComponent: 'EdgeGuard Appliance Firmware',
          },
        ],
        tlpClassification: 'TLP:AMBER',
        contactAndReportingChannel: 'Report observed indicators of compromise to cirt@organization.gov or your assigned CISA liaison.',
        fullMarkdownContent: `# OFFICIAL CYBERSECURITY ADVISORY\n**ID:** ADV-2026-0922-CRIT  |  **TLP:** AMBER  |  **SEVERITY:** CRITICAL\n\n## Overview\nUnauthenticated root code execution zero-day flaw in EdgeGuard Gateway appliances.\n\n## Required Mitigations\n1. Disconnect WAN port 8443.\n2. Enforce MFA via internal VPN.\n3. Prepare for 72h hotfix release.`,
      },
      infographic: {
        title: 'EdgeGuard Zero-Day Threat Matrix',
        subtitle: 'Key Metrics & Immediate Mitigation Workflow for CVE-2026-9999',
        theme: {
          primaryColor: '#ef4444', // Alert Red
          accentColor: '#f97316',  // Warning Amber
          badgeColor: '#1e293b',   // Slate Dark
        },
        kpiStats: [
          { value: '45,000+', label: 'Exposed Appliances', subtitle: 'Globally visible on public IP telemetry', trend: 'alert' },
          { value: '38%', label: 'Critical Sectors', subtitle: 'Healthcare & Utility operators targeted', trend: 'alert' },
          { value: '0 Days', label: 'Patch Availability', subtitle: 'Zero vendor fix currently in place', trend: 'alert' },
          { value: '72 Hours', label: 'Emergency Hotfix ETA', subtitle: 'Committed release window from vendor', trend: 'neutral' },
        ],
        workflowOrTimeline: [
          { stepNumber: 1, title: 'Sever Port 8443', description: 'Immediately drop external WAN packets to management ports at boundary firewalls.' },
          { stepNumber: 2, title: 'Isolate & Enforce MFA', description: 'Restrict management console to internal VPN routes protected by hardware MFA.' },
          { stepNumber: 3, title: 'Threat Hunt Egress', description: 'Query SIEM logs for outbound connections matching anomalous adversary C2 ranges.' },
          { stepNumber: 4, title: 'Apply 72h Hotfix', description: 'Schedule rapid firmware upgrade immediately upon vendor patch delivery.' },
        ],
        keyTakeawayBox: 'DO NOT WAIT FOR THE OFFICIAL PATCH. Immediate perimeter isolation of port 8443 is the only effective mitigation currently available.',
        dataPointsOrComparison: [
          { category: 'Authentication Required', valueA: 'None (Unauthenticated)', valueB: 'Bypasses Login Prompt' },
          { category: 'Privilege Level Obtained', valueA: 'Root / Administrator', valueB: 'Full Appliance Control' },
          { category: 'Exploit Chaining Risk', valueA: 'Ransomware Droppers', valueB: 'Credential Dumping' },
        ],
      },
      presentation: {
        deckTitle: 'Emergency Threat Briefing: CVE-2026-9999',
        subtitle: 'Zero-Day Vulnerability Assessment & Enterprise Defense Strategy',
        targetDurationMinutes: 10,
        totalSlides: 5,
        slides: [
          {
            slideNumber: 1,
            slideType: 'title',
            title: 'Critical Threat Assessment: EdgeGuard Zero-Day',
            subtitle: 'CVE-2026-9999 Active Exploitation & Emergency Defense Response',
            bulletPoints: [
              'Executive Briefing for Security Leadership & Network Operations',
              'Unauthenticated Remote Code Execution in Gateway Firmware',
              'Immediate Mitigation Protocol Prior to Vendor Patch Release',
            ],
            visualDiagramPrompt: 'High-contrast dark background with a glowing red perimeter shield and stylized technical lock icon.',
            speakerNotes: 'Good morning leaders. Today we are conducting an urgent operational briefing on CVE-2026-9999, an active zero-day exploit compromising perimeter gateways globally. We have defined a strict four-step mitigation playbook.',
          },
          {
            slideNumber: 2,
            slideType: 'data_metric',
            title: 'Global Threat Telemetry & Sector Exposure',
            subtitle: 'Analysis of 45,000+ public-facing vulnerable endpoints',
            bulletPoints: [
              'Over 45,000 devices reachable globally via search engine telemetry.',
              '38% of detected vulnerable endpoints reside in healthcare and critical infrastructure.',
              'Attackers are actively utilizing credential harvesting tools to pivot into core enterprise networks.',
            ],
            visualDiagramPrompt: 'Split world map graphic highlighting vulnerability density clusters alongside sector breakdown donut chart.',
            speakerNotes: 'This slide shows the scale of the threat. Telemetry reveals 45,000 exposed units. Most alarmingly, over a third are in healthcare and essential services, making rapid response imperative.',
          },
          {
            slideNumber: 3,
            slideType: 'content',
            title: 'Technical Mechanics of the Vulnerability',
            subtitle: 'Understanding the attack vector and firmware scope',
            bulletPoints: [
              'Targeted firmware range: EdgeGuard versions 4.2.0 through 4.8.4.',
              'Vector: Specially crafted HTTP header payloads sent to port 8443.',
              'Impact: Yields immediate root execution without requiring valid credentials or session tokens.',
            ],
            visualDiagramPrompt: 'Packet flow schematic tracing unauthenticated ingress packet through management port 8443 directly to root shell execution.',
            speakerNotes: 'Technically, the vulnerability exists in the HTTP header parsing module of the management daemon. Attackers do not need credentials—a single malformed request yields root access.',
          },
          {
            slideNumber: 4,
            slideType: 'action_plan',
            title: 'Mandatory 4-Step Mitigation Playbook',
            subtitle: 'Operational steps while awaiting the 72-hour vendor hotfix',
            bulletPoints: [
              'Phase 1: Disable or drop WAN access to port 8443 across all firewall rules.',
              'Phase 2: Transition admin console access to dedicated internal VPNs with MFA.',
              'Phase 3: Execute threat hunts on egress firewalls for known adversary IP ranges.',
              'Phase 4: Pre-stage automated deployment pipelines for the hotfix arriving in 72h.',
            ],
            visualDiagramPrompt: 'Step-by-step horizontal chevron timeline with urgency badges: Immediate, Within 24h, Staging.',
            speakerNotes: 'Because EdgeGuard has not yet shipped the official patch, our defenses rely on network segmentation. We must sever WAN access to port 8443 across all company firewalls within the hour.',
          },
          {
            slideNumber: 5,
            slideType: 'conclusion',
            title: 'Summary & Executive Decision Directives',
            subtitle: 'Next review checkpoint and incident command channels',
            bulletPoints: [
              'Zero downtime required for initial perimeter port blocking.',
              'SOC team initiated 24/7 heightened monitoring of all egress gateways.',
              'Next operational readiness checkpoint scheduled in 12 hours.',
            ],
            visualDiagramPrompt: 'Checklist graphic with confirmed green completion indicators and 24/7 SOC monitoring badge.',
            speakerNotes: 'To conclude, we can execute perimeter isolation with zero impact to business traffic. SOC is on heightened alert. I will take questions now.',
          },
        ],
      },
      video_package: {
        videoMetadata: {
          title: 'Urgent Cyber Advisory: EdgeGuard Zero-Day Exploit',
          targetDurationSeconds: 60,
          recommendedAspectRatio: '16:9',
          tone: 'Urgent, Authoritative, Actionable',
          targetAudience: 'Enterprise IT & Security Teams',
        },
        scenes: [
          {
            sceneNumber: 1,
            timestamp: '00:00 - 00:12',
            durationSeconds: 12,
            visualDescription: 'Dramatic cinematic push-in on an enterprise server room bathed in flashing amber warning lights. Holographic overlay shows a rotating globe with red blinking vulnerability dots across 45,000 nodes.',
            visualRecommendation: 'Dark tech aesthetic, high-contrast red alert accents with sleek motion typography.',
            narrationText: 'A critical cybersecurity emergency is unfolding. An unauthenticated zero-day vulnerability is actively compromising enterprise security gateways across the globe.',
            subtitles: 'CRITICAL ALERT: Enterprise Gateway Zero-Day Exploit Active Worldwide.',
            onScreenText: 'URGENT: CVE-2026-9999 ZERO-DAY',
            cameraDirection: 'Slow forward dolly towards central server rack, transitioning to global threat map.',
            soundFxAndMusic: 'Low-frequency bass pulse with subtle digital telemetry beep.',
          },
          {
            sceneNumber: 2,
            timestamp: '00:12 - 00:26',
            durationSeconds: 14,
            visualDescription: 'Clean 2D vector animation displaying a network perimeter firewall. A malicious packet bypasses the login portal and reaches a root terminal prompt.',
            visualRecommendation: 'Vector motion graphics with crisp red and white accent lines explaining technical packet flow.',
            narrationText: 'Dubbed CVE-2026-9999, the flaw allows remote attackers to seize complete root control without credentials. Over 45,000 systems are exposed—and there is currently no vendor patch.',
            subtitles: 'Root control without credentials. 45,000+ devices exposed with no patch available.',
            onScreenText: 'IMPACT: Unauthenticated Root Remote Code Execution',
            cameraDirection: 'Smooth horizontal pan across packet flow into server architecture.',
            soundFxAndMusic: 'Tense rhythmic synthesizer cadence with cautionary ping.',
          },
          {
            sceneNumber: 3,
            timestamp: '00:26 - 00:44',
            durationSeconds: 18,
            visualDescription: 'Split screen displaying four numbered action cards highlighting firewall port blocking, VPN isolation, and threat hunting logs.',
            visualRecommendation: 'Modern dashboard card UI layout with animated checkmark reveals and high-visibility urgency badges.',
            narrationText: 'While a vendor hotfix is expected within 72 hours, security teams must act immediately. Restrict WAN access to port 8443, enforce MFA via VPN, and audit egress traffic now.',
            subtitles: 'IMMEDIATE MITIGATION: Block Port 8443, enforce VPN MFA, and audit egress traffic.',
            onScreenText: 'ACTION REQUIRED: Sever WAN Port 8443 Immediately',
            cameraDirection: 'Step-by-step camera zoom to each of the mitigation cards.',
            soundFxAndMusic: 'Upbeat driving percussion indicating decisive action.',
          },
          {
            sceneNumber: 4,
            timestamp: '00:44 - 00:60',
            durationSeconds: 16,
            visualDescription: 'Perimeter firewall shield turns from pulsing red to solid emerald green. CISA advisory reference and enterprise contact details appear on screen.',
            visualRecommendation: 'Clean corporate finish with reassurance branding and official advisory badge.',
            narrationText: 'Do not wait for the official patch release. Secure your perimeter today and stay tuned for the 72-hour firmware hotfix.',
            subtitles: 'Protect your network now. Full advisory details in description.',
            onScreenText: 'DEFENSE VERIFIED: Stay Vigilant | Hotfix Expected in 72h',
            cameraDirection: 'Static hero graphic with smooth fade to closing logo card.',
            soundFxAndMusic: 'Resolving harmonic synth tone fading to silence.',
          },
        ],
        fullVoiceoverScript: `A critical cybersecurity emergency is unfolding. An unauthenticated zero-day vulnerability is actively compromising enterprise security gateways across the globe.\n\nDubbed CVE-2026-9999, the flaw allows remote attackers to seize complete root control without credentials. Over forty-five thousand systems are exposed—and there is currently no vendor patch.\n\nWhile a vendor hotfix is expected within seventy-two hours, security teams must act immediately. Restrict WAN access to port 8443, enforce MFA via VPN, and audit egress traffic now.\n\nDo not wait for the official patch release. Secure your perimeter today and stay tuned for the seventy-two hour firmware hotfix.`,
        productionNotes: {
          thumbnailConcept: 'Bold red warning banner reading "ZERO-DAY EXPLOIT" over a dark enterprise server rack with glowing red lock icon.',
          srtSubtitles: `1\n00:00:00,000 --> 00:00:12,000\nCRITICAL ALERT: Enterprise Gateway Zero-Day Exploit Active Worldwide.\n\n2\n00:00:12,000 --> 00:00:26,000\nRoot control without credentials. 45,000+ devices exposed with no patch available.\n\n3\n00:00:26,000 --> 00:00:44,000\nIMMEDIATE MITIGATION: Block Port 8443, enforce VPN MFA, and audit egress traffic.\n\n4\n00:00:44,000 --> 00:01:00,000\nProtect your network now. Full advisory details in description.`,
          bRollSuggestions: [
            'Cinematic footage of dark data centers with blinking amber LED indicators',
            'Cybersecurity analyst typing on multi-monitor terminal workstation',
            'Animated 3D network topology graph highlighting isolated nodes',
          ],
          musicRecommendation: 'Dark cyber-synth with driving electronic kick drum and high-tension risers.',
        },
      },
    },
    mockAudits: {
      executive_summary: {
        artifactType: 'executive_summary',
        factualityScore: 99,
        isFullyGrounded: true,
        claimsAudited: 6,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C1',
            artifactSnippet: 'Critical root remote code execution flaw (CVE-2026-9999) affecting EdgeGuard v4.2.0 - v4.8.4.',
            sourceVerbatimQuote: 'enables unauthenticated remote attackers to execute arbitrary code with root privileges via crafted HTTP header payloads sent to the management interface port 8443.',
            matchConfidence: 0.99,
          },
          {
            claimId: 'C2',
            artifactSnippet: '45,000 exposed systems identified, including 38% in critical healthcare and utility networks.',
            sourceVerbatimQuote: 'Shodan and Censys telemetry reveals approximately 45,000 accessible endpoints globally, with 38% located across critical infrastructure and healthcare sectors.',
            matchConfidence: 0.98,
          },
          {
            claimId: 'C3',
            artifactSnippet: 'Vendor has committed to an emergency patch within 72 hours.',
            sourceVerbatimQuote: 'EdgeGuard Systems has acknowledged the vulnerability but has NOT released an official patch. An emergency security hotfix is expected within 72 hours.',
            matchConfidence: 1.0,
          },
        ],
      },
      linkedin_post: {
        artifactType: 'linkedin_post',
        factualityScore: 98,
        isFullyGrounded: true,
        claimsAudited: 5,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C2',
            artifactSnippet: '45,000+ vulnerable appliances exposed on public internet',
            sourceVerbatimQuote: 'Shodan and Censys telemetry reveals approximately 45,000 accessible endpoints globally',
            matchConfidence: 0.99,
          },
        ],
      },
      twitter_thread: {
        artifactType: 'twitter_thread',
        factualityScore: 97,
        isFullyGrounded: true,
        claimsAudited: 5,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C1',
            artifactSnippet: 'The flaw allows remote attackers to obtain complete root privileges without any credentials',
            sourceVerbatimQuote: 'enables unauthenticated remote attackers to execute arbitrary code with root privileges',
            matchConfidence: 1.0,
          },
        ],
      },
      advisory: {
        artifactType: 'advisory',
        factualityScore: 100,
        isFullyGrounded: true,
        claimsAudited: 7,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C1',
            artifactSnippet: 'Unauthenticated root code execution zero-day flaw in EdgeGuard Gateway appliances.',
            sourceVerbatimQuote: 'enables unauthenticated remote attackers to execute arbitrary code with root privileges',
            matchConfidence: 1.0,
          },
        ],
      },
      infographic: {
        artifactType: 'infographic',
        factualityScore: 99,
        isFullyGrounded: true,
        claimsAudited: 6,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C2',
            artifactSnippet: '45,000+ Exposed Appliances',
            sourceVerbatimQuote: 'approximately 45,000 accessible endpoints globally',
            matchConfidence: 0.99,
          },
        ],
      },
      presentation: {
        artifactType: 'presentation',
        factualityScore: 98,
        isFullyGrounded: true,
        claimsAudited: 8,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C1',
            artifactSnippet: 'Vector: Specially crafted HTTP header payloads sent to port 8443.',
            sourceVerbatimQuote: 'via crafted HTTP header payloads sent to the management interface port 8443.',
            matchConfidence: 0.99,
          },
        ],
      },
      video_package: {
        artifactType: 'video_package',
        factualityScore: 97,
        isFullyGrounded: true,
        claimsAudited: 6,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C3',
            artifactSnippet: 'While a vendor hotfix is expected within seventy-two hours, security teams must act immediately.',
            sourceVerbatimQuote: 'An emergency security hotfix is expected within 72 hours.',
            matchConfidence: 0.98,
          },
        ],
      },
    },
  },
  {
    id: 'ai-research-paper',
    name: 'AI Research: Autonomous Multi-Agent Systems in Healthcare',
    description: 'Peer-reviewed clinical findings evaluating autonomous diagnostic agents across 12 hospitals.',
    category: 'AI & Healthcare Research',
    sourceText: `A collaborative multi-center clinical study conducted by Stanford Medicine, Johns Hopkins, and AI Health Labs evaluated MedAgent-X, an autonomous multi-agent diagnostic consensus architecture across 12 academic medical centers from January 2025 to August 2026.

Analyzing 24,500 complex patient diagnostic trajectories encompassing rare oncology, cardiology, and rare metabolic diseases, the multi-agent consensus model achieved a diagnostic accuracy of 94.2% on initial differential diagnosis, compared to 88.6% for individual senior specialist physicians and 79.4% for single-model LLM baselines (p < 0.001).

Crucially, the system demonstrated a 73% reduction in catastrophic diagnostic oversights by utilizing a specialized "Adversarial Critic" agent that rigorously challenges preliminary diagnostic hypotheses against patient biomarker timelines. Total average time-to-consensus was measured at 42 seconds per case, representing an 85% latency reduction compared to conventional multi-disciplinary tumor board reviews.

Key operational guidelines:
1. MedAgent-X is authorized strictly as a secondary physician-in-the-loop decision-support tool, not an autonomous clinician substitute.
2. Clinical deployment requires continuous data auditing for demographic bias across underserved patient cohorts.
3. Every generated diagnostic recommendation must be paired with immutable citation links to verified biomedical literature and radiology imaging series.

Potential limitations: Performance degradation of approximately 4.8% was observed when processing handwritten clinical notes and non-standardized electronic health record (EHR) abbreviations.`,
    contextPrompt: 'Focus on medical leadership, clinical directors, and hospital chief medical officers. Highlight diagnostic accuracy gains and safety guardrails.',
    defaultParams: {
      targetAudience: 'Chief Medical Officers & Clinical Directors',
      tone: 'Formal & Scientific',
      language: 'English',
      detailLevel: 'comprehensive',
      objective: 'Report Findings',
      contentStyle: 'Data-Driven & Analytical',
    },
    mockBrief: {
      briefId: 'brief_demo_ai_02',
      meta: {
        title: 'Clinical Evaluation of MedAgent-X Multi-Agent Diagnostic Architecture',
        detectedDomain: 'Medical AI / Clinical Research',
        primaryLanguage: 'en',
        urgencyLevel: 'Informational',
        originalWordCount: 245,
        timestamp: new Date().toISOString(),
      },
      executiveSummary: 'A 12-hospital trial across 24,500 complex patient cases revealed MedAgent-X achieved 94.2% diagnostic accuracy—outperforming both single-agent models (79.4%) and human specialist baselines (88.6%) while cutting catastrophic diagnostic oversights by 73%.',
      coreThesis: 'Autonomous multi-agent consensus architectures significantly reduce diagnostic error rates when deployed with rigorous adversarial critic agents and physician-in-the-loop oversight.',
      keyClaims: [
        {
          id: 'C1',
          statement: 'MedAgent-X achieved 94.2% diagnostic accuracy on initial differentials, outperforming human specialists (88.6%) and single LLMs (79.4%).',
          category: 'metric',
          verbatimQuote: 'the multi-agent consensus model achieved a diagnostic accuracy of 94.2% on initial differential diagnosis, compared to 88.6% for individual senior specialist physicians and 79.4% for single-model LLM baselines (p < 0.001).',
          confidence: 0.99,
        },
        {
          id: 'C2',
          statement: 'Catastrophic diagnostic oversights were reduced by 73% via an Adversarial Critic agent.',
          category: 'metric',
          verbatimQuote: 'the system demonstrated a 73% reduction in catastrophic diagnostic oversights by utilizing a specialized "Adversarial Critic" agent',
          confidence: 0.99,
        },
        {
          id: 'C3',
          statement: 'Time-to-consensus averaged 42 seconds, cutting tumor board latency by 85%.',
          category: 'metric',
          verbatimQuote: 'Total average time-to-consensus was measured at 42 seconds per case, representing an 85% latency reduction compared to conventional multi-disciplinary tumor board reviews.',
          confidence: 0.98,
        },
      ],
      entitiesAndStakeholders: [
        { name: 'Stanford Medicine & Johns Hopkins', role: 'Clinical Research Institutions', impactLevel: 'high' },
        { name: 'MedAgent-X', role: 'Evaluated Diagnostic Architecture', impactLevel: 'high' },
        { name: 'Hospital Chief Medical Officers', role: 'Target Clinical Decision Makers', impactLevel: 'high' },
      ],
      quantitativeData: [
        { metric: 'Diagnostic Accuracy', value: '94.2%', context: 'Initial differential consensus vs 88.6% human specialist' },
        { metric: 'Oversight Reduction', value: '73%', context: 'Decline in catastrophic diagnostic errors' },
        { metric: 'Consensus Latency', value: '42 seconds', context: 'Average case time, an 85% reduction' },
        { metric: 'Trial Size', value: '24,500 cases', context: 'Evaluated across 12 academic medical centers' },
      ],
      actionableDirectives: [
        { directive: 'Deploy strictly as a physician-in-the-loop secondary decision support system.', priority: 'Immediate', targetAudience: 'Hospital Ethics & Safety Boards' },
        { directive: 'Audit clinical integrations for demographic bias across patient cohorts.', priority: 'Immediate', targetAudience: 'Clinical Data Engineers' },
        { directive: 'Mandate immutable citation links to source radiology and literature for all outputs.', priority: 'Strategic', targetAudience: 'Medical AI Developers' },
      ],
      boundsAndUncertainties: [
        'Observed 4.8% accuracy drop when processing non-standard EHR abbreviations and handwritten notes.',
        'Not cleared for standalone autonomous clinical decision-making without physician sign-off.',
      ],
    },
    mockArtifacts: {
      executive_summary: {
        title: 'Clinical Research Brief: Multi-Agent Consensus in Diagnostic Medicine',
        tldr: 'In a 24,500-case study across 12 academic medical centers, MedAgent-X achieved 94.2% diagnostic accuracy (vs. 88.6% for senior physicians) and reduced catastrophic oversights by 73%, delivering consensus in 42 seconds.',
        keyFindings: [
          'Statistical superiority over single LLMs (94.2% vs 79.4%, p < 0.001) and specialist clinicians (88.6%).',
          'Adversarial Critic agent mechanism successfully caught 73% of catastrophic diagnostic traps.',
          'Consensus generated in 42 seconds per case, slashing review latency by 85%.',
          'Mandated as physician-in-the-loop decision support with verified biomedical citations.',
        ],
        strategicImplications: [
          'Substantial mitigation of hospital liability and diagnostic error malpractice exposure.',
          'Scalable acceleration of multidisciplinary tumor board workflows without specialist burnout.',
        ],
        recommendedActions: [
          'Pilot MedAgent-X in secondary triage and oncology differential review pipelines.',
          'Standardize electronic health record ingestion to counter the observed 4.8% handwritten notes degradation.',
        ],
        highlightedMetrics: [
          { label: 'Diagnostic Accuracy', value: '94.2%', significance: 'Outperforms human specialists (88.6%)' },
          { label: 'Oversight Reduction', value: '73%', significance: 'Adversarial Critic error mitigation' },
          { label: 'Case Latency', value: '42s', significance: '85% faster than tumor board meetings' },
        ],
        markdownContent: `## Study Highlights\nMedAgent-X demonstrated **94.2% accuracy** across 24,500 complex patient trajectories.\n\n### Clinical Recommendations\n- Maintain strict **physician-in-the-loop** oversight.\n- Pair every output with **verified literature citations**.`,
      },
      linkedin_post: {
        hook: 'Can multi-agent AI out-diagnose human specialists? A new 24,500-patient clinical study across 12 hospitals reveals compelling data.',
        bodyParagraphs: [
          'A landmark study by Stanford Medicine, Johns Hopkins, and AI Health Labs evaluated MedAgent-X across complex oncology and cardiology cases. The consensus system reached 94.2% diagnostic accuracy, compared to 88.6% for senior specialist physicians and 79.4% for single LLMs.',
          'The secret? An "Adversarial Critic" agent that ruthlessly stress-tests hypotheses against patient biomarker timelines, slashing catastrophic diagnostic oversights by 73%.',
        ],
        bulletInsights: [
          '📊 94.2% Diagnostic Accuracy across 24,500 patient trajectories',
          '🛡️ 73% reduction in catastrophic diagnostic errors',
          '⚡ 42-second consensus latency (85% reduction vs traditional tumor boards)',
          '👨‍⚕️ Mandatory physician-in-the-loop governance',
        ],
        callToAction: 'How is your healthcare organization preparing for collaborative clinical AI workflows? Read the findings below.',
        hashtags: ['#HealthcareAI', '#DigitalHealth', '#ClinicalExcellence', '#MedicalAI', '#HealthTech'],
        characterCount: 960,
        fullFormattedPost: `Can multi-agent AI out-diagnose human specialists? A new 24,500-patient clinical study across 12 hospitals reveals compelling data.\n\nA landmark study by Stanford Medicine, Johns Hopkins, and AI Health Labs evaluated MedAgent-X across complex oncology and cardiology cases. The consensus system reached 94.2% diagnostic accuracy, compared to 88.6% for senior specialist physicians and 79.4% for single LLMs.\n\nThe secret? An "Adversarial Critic" agent that ruthlessly stress-tests hypotheses against patient biomarker timelines, slashing catastrophic diagnostic oversights by 73%.\n\nKey Breakthroughs:\n• 📊 94.2% Diagnostic Accuracy across 24,500 patient trajectories\n• 🛡️ 73% reduction in catastrophic diagnostic errors\n• ⚡ 42-second consensus latency (85% reduction vs traditional tumor boards)\n• 👨‍⚕️ Mandatory physician-in-the-loop governance\n\nHow is your healthcare organization preparing for collaborative clinical AI workflows?\n\n#HealthcareAI #DigitalHealth #ClinicalExcellence #MedicalAI #HealthTech`,
      },
      twitter_thread: {
        hookTweet: '🧵 1/5 🧬 Landmark multi-center trial (24,500 patients, 12 hospitals): Autonomous multi-agent AI achieved 94.2% diagnostic accuracy, topping specialist doctors (88.6%) and single LLMs (79.4%). Breakdown of the data: 👇',
        tweets: [
          {
            tweetNumber: 1,
            text: '🧬 Landmark multi-center trial (24,500 patients, 12 hospitals): Autonomous multi-agent AI achieved 94.2% diagnostic accuracy, topping specialist doctors (88.6%) and single LLMs (79.4%). Breakdown of the data: 👇',
            charCount: 216,
            calloutBadge: 'RESEARCH BREAKTHROUGH',
          },
          {
            tweetNumber: 2,
            text: '2/5 Traditional single-model LLMs fail on rare diseases because they hallucinate differential edge cases. MedAgent-X uses a multi-agent debate architecture with specialized sub-agents.',
            charCount: 185,
            calloutBadge: 'ARCHITECTURE',
          },
          {
            tweetNumber: 3,
            text: '3/5 The game changer: an "Adversarial Critic" agent tasked solely with refuting the primary diagnosis using patient lab timelines. Result: a 73% drop in catastrophic medical errors.',
            charCount: 179,
            calloutBadge: 'SAFETY CRITIC',
          },
          {
            tweetNumber: 4,
            text: '4/5 Speed matters: Average time to diagnostic consensus was 42 seconds—an 85% drop compared to multidisciplinary tumor board meetings.',
            charCount: 133,
            calloutBadge: 'EFFICIENCY',
          },
          {
            tweetNumber: 5,
            text: '5/5 Guardrails: The system is certified strictly as a secondary decision support tool requiring physician sign-off. It saw a 4.8% drop on handwritten notes. Full paper link below!',
            charCount: 177,
            calloutBadge: 'GOVERNANCE',
          },
        ],
        concludingCta: 'Retweet to share clinical AI progress with healthcare professionals.',
        totalTweets: 5,
        hashtags: ['#HealthTech', '#AIResearch', '#ClinicalAI'],
      },
      advisory: {
        advisoryId: 'CLIN-ADV-2026-MED',
        title: 'CLINICAL ADVISORY: Governance Standards for Multi-Agent Diagnostic Systems',
        severity: 'INFORMATIONAL',
        targetSystemsOrStakeholders: [
          'Hospital Chief Medical Officers',
          'Clinical Decision Support Committees',
          'Diagnostic Radiology & Oncology Departments',
        ],
        summary: 'Clinical deployment directives for multi-agent diagnostic consensus tools following published 12-hospital validation trials.',
        threatOrIssueSynopsis: 'While MedAgent-X achieves 94.2% diagnostic precision, unvetted autonomous usage poses risks of automation complacency and performance degradation (4.8%) on non-standard abbreviations and handwritten records.',
        mitigationChecklist: [
          {
            stepNumber: 1,
            action: 'Ensure clinical workflows enforce physician-in-the-loop validation for all generated differential diagnoses.',
            urgency: 'Immediate',
            affectedComponent: 'EHR Decision Support Integration',
          },
          {
            stepNumber: 2,
            action: 'Require all AI recommendations to surface primary biomedical literature citations.',
            urgency: 'Immediate',
            affectedComponent: 'Clinical Verification Interface',
          },
          {
            stepNumber: 3,
            action: 'Standardize digital clinical documentation formats to prevent abbreviation misinterpretation.',
            urgency: 'Within 24h',
            affectedComponent: 'Patient Intake Records',
          },
        ],
        tlpClassification: 'TLP:CLEAR',
        contactAndReportingChannel: 'Submit clinical deviation logs to the Hospital AI Safety Review Board.',
        fullMarkdownContent: `# CLINICAL GOVERNANCE ADVISORY\n**ID:** CLIN-ADV-2026-MED  |  **TLP:** CLEAR\n\n## Overview\nDeployment guidelines for MedAgent-X multi-agent diagnostic architectures.\n\n## Mandated Guardrails\n1. Always retain physician sign-off.\n2. Require immutable biomedical literature citations.`,
      },
      infographic: {
        title: 'Clinical AI Diagnostic Consensus Study',
        subtitle: 'Multi-Center Trial Performance Across 24,500 Trajectories',
        theme: {
          primaryColor: '#3b82f6', // Medical Blue
          accentColor: '#10b981',  // Emerald Success
          badgeColor: '#0f172a',   // Dark Navy
        },
        kpiStats: [
          { value: '94.2%', label: 'Diagnostic Accuracy', subtitle: 'Consensus score across 24,500 cases', trend: 'up' },
          { value: '73%', label: 'Oversight Reduction', subtitle: 'Decrease in catastrophic medical errors', trend: 'up' },
          { value: '42s', label: 'Consensus Time', subtitle: '85% faster than human tumor boards', trend: 'up' },
          { value: '12', label: 'Hospital Centers', subtitle: 'Rigorous multi-institution clinical trial', trend: 'neutral' },
        ],
        workflowOrTimeline: [
          { stepNumber: 1, title: 'Patient Data Ingestion', description: 'Biomarkers, radiology, and patient medical history ingested into secure clinical sandbox.' },
          { stepNumber: 2, title: 'Multi-Agent Hypothesis', description: 'Specialized oncology and cardiology agent personas generate competing differential diagnoses.' },
          { stepNumber: 3, title: 'Adversarial Stress Test', description: 'Critic agent rigorously stress-tests candidate diagnoses against timeline contraindications.' },
          { stepNumber: 4, title: 'Physician Review', description: 'Attending physician receives grounded differential with citations in 42 seconds.' },
        ],
        keyTakeawayBox: 'Multi-agent consensus with an adversarial critic cuts medical errors by 73% while accelerating consensus time to 42 seconds.',
        dataPointsOrComparison: [
          { category: 'Diagnostic Accuracy', valueA: '94.2% (MedAgent-X)', valueB: '88.6% (Human Specialists)' },
          { category: 'Single LLM Baseline', valueA: '79.4%', valueB: 'Prone to Hallucinations' },
          { category: 'Tumor Board Latency', valueA: '42 Seconds', valueB: 'Several Days/Weeks' },
        ],
      },
      presentation: {
        deckTitle: 'Autonomous Multi-Agent AI in Diagnostic Medicine',
        subtitle: 'Clinical Trial Outcomes Across 24,500 Complex Cases',
        targetDurationMinutes: 12,
        totalSlides: 5,
        slides: [
          {
            slideNumber: 1,
            slideType: 'title',
            title: 'MedAgent-X: Multi-Agent Clinical Consensus',
            subtitle: 'Evaluating Diagnostic Accuracy and Safety Across 12 Medical Centers',
            bulletPoints: [
              'Collaborative research from Stanford, Johns Hopkins, and AI Health Labs',
              'Evaluating 24,500 complex patient trajectories',
              'Pioneering the Adversarial Critic safety architecture',
            ],
            visualDiagramPrompt: 'Sleek healthcare visualization displaying interconnected clinical AI nodes converging on a patient DNA helix.',
            speakerNotes: 'Good afternoon colleagues. Today we present outcomes from the largest clinical trial of autonomous multi-agent diagnostic consensus in healthcare.',
          },
          {
            slideNumber: 2,
            slideType: 'data_metric',
            title: 'Statistical Benchmark Performance',
            subtitle: 'Comparing multi-agent consensus against specialist baselines',
            bulletPoints: [
              'MedAgent-X achieved 94.2% diagnostic accuracy on initial differential review.',
              'Outperformed senior physician specialists (88.6%) and single LLM baselines (79.4%).',
              'Statistical significance confirmed at p < 0.001 across all 12 centers.',
            ],
            visualDiagramPrompt: 'Bar graph comparison displaying accuracy metrics: MedAgent-X (94.2%), Specialists (88.6%), Single LLM (79.4%).',
            speakerNotes: 'The data is conclusive: multi-agent debate fundamentally outclasses single-model architectures, achieving 94.2% diagnostic accuracy.',
          },
          {
            slideNumber: 3,
            slideType: 'content',
            title: 'The Adversarial Critic Mechanism',
            subtitle: 'How structured debate prevents diagnostic oversights',
            bulletPoints: [
              'Standard LLMs suffer from premature confirmation bias.',
              'Adversarial Critic agent systematically refutes preliminary hypotheses.',
              'Resulted in a 73% reduction in catastrophic diagnostic oversights.',
            ],
            visualDiagramPrompt: 'Diagram showing diagnostic generator agent submitting hypothesis to the Adversarial Critic agent with safety feedback loops.',
            speakerNotes: 'The defining innovation is the Adversarial Critic. By attempting to disprove hypotheses against patient biomarkers, it eliminates diagnostic blind spots.',
          },
          {
            slideNumber: 4,
            slideType: 'data_metric',
            title: 'Clinical Velocity & Tumor Board Acceleration',
            subtitle: 'Slashing review latency from weeks to seconds',
            bulletPoints: [
              'Average consensus completed in 42 seconds per patient case.',
              'Represents an 85% latency reduction compared to conventional multidisciplinary reviews.',
              'Enables rapid triage and faster treatment initiation for acute patients.',
            ],
            visualDiagramPrompt: 'Speedometer graphic showing 42s case completion vs traditional 2-week tumor board scheduling.',
            speakerNotes: 'In oncology, speed saves lives. MedAgent-X condenses the preliminary tumor board deliberation process into 42 seconds.',
          },
          {
            slideNumber: 5,
            slideType: 'conclusion',
            title: 'Safety Guardrails & Governance Directives',
            subtitle: 'Responsible clinical translation roadmap',
            bulletPoints: [
              'Mandatory physician-in-the-loop authorization on every output.',
              'Demographic auditing to protect vulnerable patient cohorts.',
              'Standardized EHR intake required to mitigate 4.8% handwriting degradation.',
            ],
            visualDiagramPrompt: 'Security shield icon overlaid with clinical stethoscope and verification checkmark.',
            speakerNotes: 'To conclude, MedAgent-X is an amplifier, not a replacement. With physician-in-the-loop governance, we can eliminate diagnostic error.',
          },
        ],
      },
      video_package: {
        videoMetadata: {
          title: 'The Future of Clinical Diagnostics: Multi-Agent AI',
          targetDurationSeconds: 60,
          recommendedAspectRatio: '16:9',
          tone: 'Scientific, Inspiring, Authoritative',
          targetAudience: 'Clinicians, Healthcare Executives, Researchers',
        },
        scenes: [
          {
            sceneNumber: 1,
            timestamp: '00:00 - 00:15',
            durationSeconds: 15,
            visualDescription: 'Cinematic shot of a modern hospital operating room and diagnostic imaging bay. Subtle glowing digital neural network lines link medical imaging displays.',
            visualRecommendation: 'High-end clinical documentary lighting, crisp teal and white palette.',
            narrationText: 'What if medical teams had an autonomous panel of specialists evaluating complex diagnoses in seconds? Across 12 academic medical centers, that future just arrived.',
            subtitles: '12 Medical Centers, 24,500 Patients: The Multi-Agent Clinical Trial.',
            onScreenText: 'STUDY REPORT: Multi-Agent Diagnostic Consensus',
            cameraDirection: 'Slow steadycam tracking shot through modern hospital corridor into radiology suite.',
            soundFxAndMusic: 'Gentle piano chords layered over ambient hospital room tone.',
          },
          {
            sceneNumber: 2,
            timestamp: '00:15 - 00:30',
            durationSeconds: 15,
            visualDescription: 'Animated infographic comparing 94.2% AI accuracy against 88.6% human specialist and 79.4% standard LLM baselines.',
            visualRecommendation: 'Clean medical telemetry UI with animated progress bars and statistical confidence indicators.',
            narrationText: 'Evaluating over twenty-four thousand patient cases, MedAgent-X reached 94.2% diagnostic accuracy, topping both human specialist baselines and conventional AI models.',
            subtitles: '94.2% Diagnostic Accuracy outperforming human specialist baselines.',
            onScreenText: 'ACCURACY: 94.2% Consensus (p < 0.001)',
            cameraDirection: 'Dynamic zoom on statistical comparison graph.',
            soundFxAndMusic: 'Inspiring modern electronic pulse building optimism.',
          },
          {
            sceneNumber: 3,
            timestamp: '00:30 - 00:45',
            durationSeconds: 15,
            visualDescription: 'Physician in white coat examining holographic medical report on tablet with green checkmark next to "Adversarial Critic Verified".',
            visualRecommendation: 'Warm human-centric clinical focus balancing high technology with empathetic healthcare.',
            narrationText: 'By utilizing an Adversarial Critic agent to relentlessly stress-test hypotheses, the system eliminated 73% of catastrophic medical oversights in just 42 seconds.',
            subtitles: '73% drop in catastrophic medical errors in 42 seconds.',
            onScreenText: 'SAFETY FIRST: 73% Fewer Diagnostic Traps',
            cameraDirection: 'Over-the-shoulder shot looking at verified diagnostic recommendations.',
            soundFxAndMusic: 'Harmonic strings swelling to emotional resolution.',
          },
          {
            sceneNumber: 4,
            timestamp: '00:45 - 00:60',
            durationSeconds: 15,
            visualDescription: 'Closing montage of Stanford Medicine and hospital partner badges with key takeaway: "Physician-in-the-Loop Diagnostic Intelligence".',
            visualRecommendation: 'Authoritative academic finish with research paper citations.',
            narrationText: 'Deployed strictly as a physician-in-the-loop partner, multi-agent AI is helping doctors save lives faster. Read the complete trial data today.',
            subtitles: 'Physician-in-the-loop clinical intelligence. Read the full paper.',
            onScreenText: 'MEDAGENT-X: Amplifying Clinical Excellence',
            cameraDirection: 'Smooth pull-back to elegant title card.',
            soundFxAndMusic: 'Warm acoustic chime resolving to silence.',
          },
        ],
        fullVoiceoverScript: `What if medical teams had an autonomous panel of specialists evaluating complex diagnoses in seconds? Across twelve academic medical centers, that future just arrived.\n\nEvaluating over twenty-four thousand patient cases, MedAgent-X reached 94.2% diagnostic accuracy, topping both human specialist baselines and conventional AI models.\n\nBy utilizing an Adversarial Critic agent to relentlessly stress-test hypotheses, the system eliminated 73% of catastrophic medical oversights in just forty-two seconds.\n\nDeployed strictly as a physician-in-the-loop partner, multi-agent AI is helping doctors save lives faster. Read the complete trial data today.`,
        productionNotes: {
          thumbnailConcept: 'Split screen of doctor looking thoughtfully alongside a glowing blue multi-agent diagnostic consensus network.',
          srtSubtitles: `1\n00:00:00,000 --> 00:00:15,000\n12 Medical Centers, 24,500 Patients: The Multi-Agent Clinical Trial.\n\n2\n00:00:15,000 --> 00:00:30,000\n94.2% Diagnostic Accuracy outperforming human specialist baselines.\n\n3\n00:00:30,000 --> 00:00:45,000\n73% drop in catastrophic medical errors in 42 seconds.\n\n4\n00:00:45,000 --> 00:01:00,000\nPhysician-in-the-loop clinical intelligence. Read the full paper.`,
          bRollSuggestions: [
            'Physicians discussing patient charts in modern hospital meeting room',
            'Time-lapse of diagnostic MRI and CT imaging sequences',
            'Close-up of clinical tablet rendering differential diagnoses with literature citations',
          ],
          musicRecommendation: 'Cinematic ambient orchestral with warm piano and uplifting electronic pads.',
        },
      },
    },
    mockAudits: {
      executive_summary: {
        artifactType: 'executive_summary',
        factualityScore: 99,
        isFullyGrounded: true,
        claimsAudited: 6,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C1',
            artifactSnippet: 'Statistical superiority over single LLMs (94.2% vs 79.4%, p < 0.001) and specialist clinicians (88.6%).',
            sourceVerbatimQuote: 'achieved a diagnostic accuracy of 94.2% on initial differential diagnosis, compared to 88.6% for individual senior specialist physicians and 79.4% for single-model LLM baselines (p < 0.001).',
            matchConfidence: 0.99,
          },
        ],
      },
      linkedin_post: {
        artifactType: 'linkedin_post',
        factualityScore: 98,
        isFullyGrounded: true,
        claimsAudited: 5,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C2',
            artifactSnippet: '73% reduction in catastrophic diagnostic errors',
            sourceVerbatimQuote: 'demonstrated a 73% reduction in catastrophic diagnostic oversights by utilizing a specialized "Adversarial Critic" agent',
            matchConfidence: 1.0,
          },
        ],
      },
      twitter_thread: {
        artifactType: 'twitter_thread',
        factualityScore: 98,
        isFullyGrounded: true,
        claimsAudited: 5,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C3',
            artifactSnippet: 'Average time to diagnostic consensus was 42 seconds—an 85% drop',
            sourceVerbatimQuote: 'Total average time-to-consensus was measured at 42 seconds per case, representing an 85% latency reduction',
            matchConfidence: 0.99,
          },
        ],
      },
      advisory: {
        artifactType: 'advisory',
        factualityScore: 100,
        isFullyGrounded: true,
        claimsAudited: 6,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C1',
            artifactSnippet: 'Clinical deployment directives for multi-agent diagnostic consensus tools',
            sourceVerbatimQuote: 'evaluated MedAgent-X, an autonomous multi-agent diagnostic consensus architecture across 12 academic medical centers',
            matchConfidence: 0.97,
          },
        ],
      },
      infographic: {
        artifactType: 'infographic',
        factualityScore: 99,
        isFullyGrounded: true,
        claimsAudited: 6,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C1',
            artifactSnippet: '94.2% Diagnostic Accuracy',
            sourceVerbatimQuote: 'diagnostic accuracy of 94.2% on initial differential diagnosis',
            matchConfidence: 1.0,
          },
        ],
      },
      presentation: {
        artifactType: 'presentation',
        factualityScore: 99,
        isFullyGrounded: true,
        claimsAudited: 7,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C2',
            artifactSnippet: 'Resulted in a 73% reduction in catastrophic diagnostic oversights.',
            sourceVerbatimQuote: 'demonstrated a 73% reduction in catastrophic diagnostic oversights',
            matchConfidence: 1.0,
          },
        ],
      },
      video_package: {
        artifactType: 'video_package',
        factualityScore: 98,
        isFullyGrounded: true,
        claimsAudited: 5,
        unsupportedClaims: [],
        citations: [
          {
            claimId: 'C3',
            artifactSnippet: 'the system eliminated 73% of catastrophic medical oversights in just 42 seconds.',
            sourceVerbatimQuote: 'demonstrated a 73% reduction in catastrophic diagnostic oversights... 42 seconds per case',
            matchConfidence: 0.99,
          },
        ],
      },
    },
  },
];
