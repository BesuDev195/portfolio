export interface Experience {
  id: string;
  role: string;
  organization: string;
  period?: string;
  description: string;
  tags?: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  username: string;
  ariaLabel: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  introduction: string;
  portraitImage: string;
  about: {
    lead: string;
    paragraphs: string[];
    specializations: string[];
  };
  experiences: Experience[];
  socials: SocialLink[];
}

export const siteConfig: SiteConfig = {
  // Primary identity
  name: "Besufekad Z.",
  title: "Security Researcher & Pentester",
  subtitle: "",
  tagline: "Web Application Penetration Testing & Security Research",
  introduction:
    "I am a web penetration tester and security researcher focused on identifying vulnerabilities across web applications, testing authentication boundaries, and securing portal architectures.",
  portraitImage: "/images/pp.png",

  about: {
    lead: "Specializing in practical web penetration testing, identifying business logic flaws, and securing modern web portals.",
    paragraphs: [
      "I am a dedicated web penetration tester and security researcher with hands-on experience evaluating web platforms against the OWASP Top 10, dissecting API endpoints, identifying Insecure Direct Object References (IDORs), and discovering privilege escalation vectors.",
      "Having performed security assessments for high-profile institutions including INSA and the Debre Berhan University portal, I test web applications from an adversarial perspective to deliver clear, actionable remediation guidance.",
      "I am also the founder of the SkySec journal and podcast, where I discuss practical web security techniques, real-world bug assessments, and cybersecurity methodologies."
    ],
    specializations: [
      "Web Application Penetration Testing",
      "OWASP Top 10 Vulnerability Assessment",
      "Secure Coding",
      "API & Web Portal Security Auditing",
      "Business Logic Flaw Discovery",
      "Security Reporting & Remediation Guidance"
    ]
  },

  // Experience & Engagements
  experiences: [
    {
      id: "insa-intern",
      role: "Pentester Intern",
      organization: "Information Network Security Administration (INSA)",
      period: "Internship",
      description:
        "Conducted hands-on penetration testing on web applications and institutional systems, uncovering vulnerabilities, validating security controls, and preparing structured remediation reports.",
      tags: ["Web Pentesting", "Vulnerability Assessment", "Reporting"]
    },
    {
      id: "insa-camp",
      role: "Summer Camp Trainee",
      organization: "4th INSA Cyber Summer Camp",
      period: "Training Program",
      description:
        "Completed rigorous specialized training in offensive cyber operations, practical web application penetration testing, network assessment, and secure defense strategies.",
      tags: ["Offensive Security", "Hands-on Labs", "Web Security"]
    },
    {
      id: "techtonic-lead",
      role: "Cyber Team Lead",
      organization: "Techtonic Tribe",
      period: "Leadership",
      description:
        "Led the cybersecurity team, directed practical vulnerability discovery sessions, guided members through web assessment techniques, and coordinated security workshops.",
      tags: ["Team Leadership", "Web Auditing", "Mentorship"]
    },
    {
      id: "dbu-assessment",
      role: "Web Security Assessor",
      organization: "Debre Berhan University Portal Assessment",
      period: "Security Audit",
      description:
        "Performed an in-depth web application penetration test on the Debre Berhan University portal, auditing student/faculty portals, identifying critical security flaws, and assisting with vulnerability remediation.",
      tags: ["Portal Assessment", "Access Control"]
    },
    {
      id: "skysec-founder",
      role: "Founder & Host",
      organization: "SkySec Journal and Podcast",
      period: "Founder",
      description:
        "Founded and produce the SkySec cybersecurity journal and podcast, delivering technical discussions, web pentesting breakdowns, and research articles for the security community.",
      tags: ["Technical Writing", "Podcast", "Community"]
    }
  ],

  // Social platforms & presence
  socials: [
    {
      platform: "GitHub",
      url: "https://github.com/BesuDev195",
      username: "@BesuDev195",
      ariaLabel: "View GitHub Profile"
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/besufekad-zenebe%F0%9F%87%AA%F0%9F%87%B9-129825383/",
      username: "Besufekad Z.",
      ariaLabel: "Connect on LinkedIn"
    },
    {
      platform: "X / Twitter",
      url: "https://x.com/B3sucmd",
      username: "@B3sucmd",
      ariaLabel: "Follow on X (Twitter)"
    },
    {
      platform: "Telegram",
      url: "https://t.me/skysecurity",
      username: "@skysecurity",
      ariaLabel: "Contact on Telegram"
    }
  ]
};
