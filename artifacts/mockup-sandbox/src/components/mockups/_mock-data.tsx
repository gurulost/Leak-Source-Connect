// Mock data matching API schemas from @workspace/api-client-react
// Maps to: useListLeaks, useGetPlatformStats, useListJournalists, useListCategories, useGetRecentActivity, useGetSensitivityBreakdown

export type LeakSensitivity = "low" | "medium" | "high" | "critical";
export type LeakStatus = "pending" | "verified" | "claimed" | "published";
export type ActivityEventType = "leak_submitted" | "leak_verified" | "leak_claimed" | "leak_published";

export interface Leak {
  id: number;
  title: string;
  teaser: string;
  category: string;
  sensitivity: LeakSensitivity;
  status: LeakStatus;
  anonymousHandle: string;
  documentCount: number;
  claimedByJournalistId: number | null;
  claimedByJournalistName: string | null;
  viewCount: number;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Journalist {
  id: number;
  displayName: string;
  outlet: string;
  bio: string;
  specializations: string[];
  verificationBadge: boolean;
  leaksClaimed: number;
  leaksPublished: number;
  avatarInitials: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  leakCount: number;
  iconName: string;
}

export interface PlatformStats {
  totalLeaks: number;
  totalJournalists: number;
  totalCategories: number;
  verifiedLeaks: number;
  claimedLeaks: number;
  publishedLeaks: number;
  pendingLeaks: number;
  criticalLeaks: number;
}

export interface ActivityEvent {
  id: number;
  eventType: ActivityEventType;
  description: string;
  timestamp: string;
  category: string;
  sensitivity: LeakSensitivity;
}

export interface SensitivityCount {
  sensitivity: LeakSensitivity;
  count: number;
}

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const MOCK_LEAKS: Leak[] = [
  {
    id: 1,
    title: "Pentagon Black Sites Network Exposed",
    teaser: "Classified documents reveal over 180 undisclosed military detention facilities operating across three continents.",
    category: "government",
    sensitivity: "critical",
    status: "published",
    anonymousHandle: "shadow-4821",
    documentCount: 47,
    claimedByJournalistId: 1,
    claimedByJournalistName: "Alex Morgan",
    viewCount: 12847,
    verifiedAt: hoursAgo(168),
    createdAt: hoursAgo(240),
    updatedAt: hoursAgo(48),
  },
  {
    id: 2,
    title: "Offshore Banking Corridor Hidden from Tax Authorities",
    teaser: "Financial records show $2.3 trillion in assets laundered through shell corporations and obscured trade routes.",
    category: "finance",
    sensitivity: "critical",
    status: "verified",
    anonymousHandle: "cipher-7302",
    documentCount: 156,
    claimedByJournalistId: 2,
    claimedByJournalistName: "Jordan Lee",
    viewCount: 8934,
    verifiedAt: hoursAgo(72),
    createdAt: hoursAgo(192),
    updatedAt: hoursAgo(24),
  },
  {
    id: 3,
    title: "Pharmaceutical Trials Data Manipulation Scandal",
    teaser: "Internal emails reveal systematic suppression of adverse side effects in FDA-approved drug trials affecting 50+ million patients.",
    category: "healthcare",
    sensitivity: "high",
    status: "claimed",
    anonymousHandle: "veil-5891",
    documentCount: 89,
    claimedByJournalistId: 3,
    claimedByJournalistName: "Casey Johnson",
    viewCount: 4521,
    verifiedAt: null,
    createdAt: hoursAgo(96),
    updatedAt: hoursAgo(12),
  },
  {
    id: 4,
    title: "Climate Data Falsification at Major Oil Company",
    teaser: "Reports show intentional misreporting of carbon emissions to regulators and investors over 15 years.",
    category: "environment",
    sensitivity: "high",
    status: "verified",
    anonymousHandle: "echo-2176",
    documentCount: 203,
    claimedByJournalistId: 4,
    claimedByJournalistName: "Morgan Chen",
    viewCount: 6234,
    verifiedAt: hoursAgo(48),
    createdAt: hoursAgo(144),
    updatedAt: hoursAgo(36),
  },
  {
    id: 5,
    title: "Tech Giant Monopoly Agreement with Competitors",
    teaser: "Signed agreements prove market division and price fixing conspiracy across three major tech platforms.",
    category: "technology",
    sensitivity: "high",
    status: "pending",
    anonymousHandle: "specter-8734",
    documentCount: 34,
    claimedByJournalistId: null,
    claimedByJournalistName: null,
    viewCount: 2156,
    verifiedAt: null,
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(2),
  },
  {
    id: 6,
    title: "Defense Contractor Quality Control Cover-up",
    teaser: "Whistleblower documents show thousands of defective components shipped to military installations despite failed quality tests.",
    category: "defense",
    sensitivity: "critical",
    status: "claimed",
    anonymousHandle: "signal-9201",
    documentCount: 76,
    claimedByJournalistId: 5,
    claimedByJournalistName: "Riley Martinez",
    viewCount: 5687,
    verifiedAt: null,
    createdAt: hoursAgo(84),
    updatedAt: hoursAgo(18),
  },
  {
    id: 7,
    title: "Corporate Wage Theft Ring Across Retail Chain",
    teaser: "Time tracking system manipulation proves systematic underpayment affecting 120,000 employees worth $340 million.",
    category: "corporate",
    sensitivity: "medium",
    status: "verified",
    anonymousHandle: "mirage-4455",
    documentCount: 61,
    claimedByJournalistId: 6,
    claimedByJournalistName: "Sam Fisher",
    viewCount: 3421,
    verifiedAt: hoursAgo(36),
    createdAt: hoursAgo(168),
    updatedAt: hoursAgo(60),
  },
  {
    id: 8,
    title: "Surveillance Program Target Lists Revealed",
    teaser: "Agency files expose domestic targeting criteria that violate constitutional protections for journalists and activists.",
    category: "government",
    sensitivity: "critical",
    status: "pending",
    anonymousHandle: "wraith-1823",
    documentCount: 112,
    claimedByJournalistId: null,
    claimedByJournalistName: null,
    viewCount: 1234,
    verifiedAt: null,
    createdAt: hoursAgo(18),
    updatedAt: hoursAgo(8),
  },
  {
    id: 9,
    title: "Medical Device Recalls Never Issued to Public",
    teaser: "Hospital records show dangerous device failures known to manufacturer but withheld from FDA and healthcare providers.",
    category: "healthcare",
    sensitivity: "high",
    status: "claimed",
    anonymousHandle: "echo-3344",
    documentCount: 45,
    claimedByJournalistId: 3,
    claimedByJournalistName: "Casey Johnson",
    viewCount: 2876,
    verifiedAt: null,
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(14),
  },
  {
    id: 10,
    title: "Deepwater Oil Rig Safety Reports Falsified",
    teaser: "Maintenance logs prove critical safety equipment failures were documented as operational prior to catastrophic incident.",
    category: "environment",
    sensitivity: "high",
    status: "pending",
    anonymousHandle: "phantom-6789",
    documentCount: 87,
    claimedByJournalistId: null,
    claimedByJournalistName: null,
    viewCount: 876,
    verifiedAt: null,
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(6),
  },
];

export const MOCK_JOURNALISTS: Journalist[] = [
  {
    id: 1,
    displayName: "Alex Morgan",
    outlet: "Global Investigative Collective",
    bio: "Award-winning investigative journalist specializing in government accountability and defense contracting fraud.",
    specializations: ["government", "defense", "corruption"],
    verificationBadge: true,
    leaksClaimed: 23,
    leaksPublished: 19,
    avatarInitials: "AM",
    createdAt: hoursAgo(720),
    updatedAt: hoursAgo(24),
  },
  {
    id: 2,
    displayName: "Jordan Lee",
    outlet: "Financial Crimes Bureau",
    bio: "Expert in financial investigations and money laundering networks. Published work has led to multiple prosecutions.",
    specializations: ["finance", "money-laundering", "tax-evasion"],
    verificationBadge: true,
    leaksClaimed: 31,
    leaksPublished: 28,
    avatarInitials: "JL",
    createdAt: hoursAgo(720),
    updatedAt: hoursAgo(12),
  },
  {
    id: 3,
    displayName: "Casey Johnson",
    outlet: "Health & Science Today",
    bio: "Healthcare investigator focused on pharmaceutical transparency and patient safety advocacy.",
    specializations: ["healthcare", "pharma", "safety"],
    verificationBadge: true,
    leaksClaimed: 18,
    leaksPublished: 14,
    avatarInitials: "CJ",
    createdAt: hoursAgo(720),
    updatedAt: hoursAgo(8),
  },
  {
    id: 4,
    displayName: "Morgan Chen",
    outlet: "Environmental Defense Network",
    bio: "Environmental journalist covering climate change, corporate pollution, and regulatory capture.",
    specializations: ["environment", "climate", "pollution"],
    verificationBadge: true,
    leaksClaimed: 25,
    leaksPublished: 22,
    avatarInitials: "MC",
    createdAt: hoursAgo(720),
    updatedAt: hoursAgo(18),
  },
  {
    id: 5,
    displayName: "Riley Martinez",
    outlet: "Defense Watch Institute",
    bio: "Military and defense contractor accountability reporter with 12 years of experience.",
    specializations: ["defense", "military", "contracts"],
    verificationBadge: true,
    leaksClaimed: 27,
    leaksPublished: 23,
    avatarInitials: "RM",
    createdAt: hoursAgo(720),
    updatedAt: hoursAgo(20),
  },
  {
    id: 6,
    displayName: "Sam Fisher",
    outlet: "Labor Rights Initiative",
    bio: "Covering workplace violations, wage theft, and labor exploitation in corporate America.",
    specializations: ["labor", "corporate", "workers-rights"],
    verificationBadge: false,
    leaksClaimed: 12,
    leaksPublished: 8,
    avatarInitials: "SF",
    createdAt: hoursAgo(480),
    updatedAt: hoursAgo(36),
  },
  {
    id: 7,
    displayName: "Taylor White",
    outlet: "Technology Accountability Project",
    bio: "Tech industry watchdog exposing monopolistic practices and privacy violations.",
    specializations: ["technology", "privacy", "monopoly"],
    verificationBadge: false,
    leaksClaimed: 8,
    leaksPublished: 5,
    avatarInitials: "TW",
    createdAt: hoursAgo(360),
    updatedAt: hoursAgo(48),
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Government",
    slug: "government",
    description: "Political corruption, classified programs, surveillance, and policy violations",
    leakCount: 8,
    iconName: "Building2",
  },
  {
    id: 2,
    name: "Finance",
    slug: "finance",
    description: "Banking fraud, money laundering, tax evasion, and financial crimes",
    leakCount: 5,
    iconName: "Banknote",
  },
  {
    id: 3,
    name: "Healthcare",
    slug: "healthcare",
    description: "Pharmaceutical fraud, medical device dangers, and patient safety violations",
    leakCount: 6,
    iconName: "Heart",
  },
  {
    id: 4,
    name: "Environment",
    slug: "environment",
    description: "Environmental violations, pollution cover-ups, and climate data manipulation",
    leakCount: 4,
    iconName: "Leaf",
  },
  {
    id: 5,
    name: "Technology",
    slug: "technology",
    description: "Tech monopolies, privacy violations, and corporate misconduct",
    leakCount: 3,
    iconName: "Cpu",
  },
  {
    id: 6,
    name: "Defense",
    slug: "defense",
    description: "Military fraud, weapons system defects, and defense contractor corruption",
    leakCount: 2,
    iconName: "Shield",
  },
  {
    id: 7,
    name: "Corporate",
    slug: "corporate",
    description: "Labor violations, wage theft, workplace safety, and corporate malfeasance",
    leakCount: 3,
    iconName: "Briefcase",
  },
];

export const MOCK_PLATFORM_STATS: PlatformStats = {
  totalLeaks: 1247,
  totalJournalists: 127,
  totalCategories: 7,
  verifiedLeaks: 587,
  claimedLeaks: 302,
  publishedLeaks: 156,
  pendingLeaks: 358,
  criticalLeaks: 23,
};

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: 1,
    eventType: "leak_published",
    description: 'Leak published: "Pentagon Black Sites Network Exposed"',
    timestamp: hoursAgo(48),
    category: "government",
    sensitivity: "critical",
  },
  {
    id: 2,
    eventType: "leak_verified",
    description: 'Leak verified: "Offshore Banking Corridor Hidden from Tax Authorities"',
    timestamp: hoursAgo(72),
    category: "finance",
    sensitivity: "critical",
  },
  {
    id: 3,
    eventType: "leak_submitted",
    description: 'New leak submitted: "Tech Giant Monopoly Agreement with Competitors"',
    timestamp: hoursAgo(6),
    category: "technology",
    sensitivity: "high",
  },
  {
    id: 4,
    eventType: "leak_claimed",
    description: 'Morgan Chen from Environmental Defense Network claimed: "Climate Data Falsification..."',
    timestamp: hoursAgo(48),
    category: "environment",
    sensitivity: "high",
  },
  {
    id: 5,
    eventType: "leak_verified",
    description: 'Leak verified: "Deepwater Oil Rig Safety Reports Falsified"',
    timestamp: hoursAgo(36),
    category: "environment",
    sensitivity: "high",
  },
  {
    id: 6,
    eventType: "leak_claimed",
    description: 'Alex Morgan from Global Investigative Collective claimed: "Pentagon Black Sites..."',
    timestamp: hoursAgo(240),
    category: "government",
    sensitivity: "critical",
  },
  {
    id: 7,
    eventType: "leak_published",
    description: 'Leak published: "Corporate Wage Theft Ring Across Retail Chain"',
    timestamp: hoursAgo(120),
    category: "corporate",
    sensitivity: "medium",
  },
  {
    id: 8,
    eventType: "leak_submitted",
    description: 'New leak submitted: "Surveillance Program Target Lists Revealed"',
    timestamp: hoursAgo(18),
    category: "government",
    sensitivity: "critical",
  },
  {
    id: 9,
    eventType: "leak_claimed",
    description: 'Casey Johnson from Health & Science Today claimed: "Pharmaceutical Trials Data..."',
    timestamp: hoursAgo(96),
    category: "healthcare",
    sensitivity: "high",
  },
  {
    id: 10,
    eventType: "leak_verified",
    description: 'Leak verified: "Medical Device Recalls Never Issued to Public"',
    timestamp: hoursAgo(24),
    category: "healthcare",
    sensitivity: "high",
  },
];

export const MOCK_SENSITIVITY_BREAKDOWN: SensitivityCount[] = [
  { sensitivity: "low", count: 234 },
  { sensitivity: "medium", count: 456 },
  { sensitivity: "high", count: 421 },
  { sensitivity: "critical", count: 136 },
];
