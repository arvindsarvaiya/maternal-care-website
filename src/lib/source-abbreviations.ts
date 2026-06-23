// Source Abbreviations — User-Facing Reference
//
// This file provides the full names and descriptions of all health organizations
// cited in the postpartum knowledge database. It is designed to be displayed
// to end users (especially rural Indian mothers) so they can understand where
// the health information comes from.
//
// Each abbreviation that appears in the inline citations like (WHO, MOHFW, AAP)
// is explained here in both English and Hindi.

export interface SourceAbbreviation {
    /** Full name of the organization */
    fullName: string;
    /** Simple description of what they do, in plain English */
    description: string;
    /** Simple description in Hindi (target: rural Indian population) */
    descriptionHindi: string;
    /** Whether this is an Indian organization */
    isIndian: boolean;
}

export const sourceAbbreviations: Record<string, SourceAbbreviation> = {
    WHO: {
        fullName: 'World Health Organization',
        description: 'The United Nations agency for global health — sets worldwide health guidelines',
        descriptionHindi: 'विश्व स्वास्थ्य संगठन — पूरी दुनिया के लिए स्वास्थ्य दिशानिर्देश बनाता है',
        isIndian: false,
    },
    ACOG: {
        fullName: 'American College of Obstetricians and Gynecologists',
        description: 'Leading US medical organization for pregnancy, childbirth, and women\'s health',
        descriptionHindi: 'अमेरिकी प्रसूति एवं स्त्री रोग विशेषज्ञ संगठन — गर्भावस्था और महिला स्वास्थ्य के विशेषज्ञ',
        isIndian: false,
    },
    AAP: {
        fullName: 'American Academy of Pediatrics',
        description: 'Leading US organization for children\'s health and pediatric care',
        descriptionHindi: 'अमेरिकी बाल चिकित्सा अकादमी — बच्चों के स्वास्थ्य की विशेषज्ञ संस्था',
        isIndian: false,
    },
    CDC: {
        fullName: 'Centers for Disease Control and Prevention (USA)',
        description: 'US national public health agency — monitors disease prevention and health safety',
        descriptionHindi: 'अमेरिकी रोग नियंत्रण एवं रोकथाम केंद्र — बीमारियों की रोकथाम और स्वास्थ्य सुरक्षा की निगरानी करता है',
        isIndian: false,
    },
    NICE: {
        fullName: 'National Institute for Health and Care Excellence (UK)',
        description: 'UK organization that provides evidence-based health guidance',
        descriptionHindi: 'यूके का राष्ट्रीय स्वास्थ्य एवं देखभाल संस्थान — प्रमाण-आधारित स्वास्थ्य सलाह देता है',
        isIndian: false,
    },
    MOHFW: {
        fullName: 'Ministry of Health & Family Welfare (India)',
        description: 'Government of India\'s health ministry — sets national health policies and programs',
        descriptionHindi: 'भारत सरकार का स्वास्थ्य एवं परिवार कल्याण मंत्रालय — राष्ट्रीय स्वास्थ्य नीतियां और कार्यक्रम बनाता है',
        isIndian: true,
    },
    IAP: {
        fullName: 'Indian Academy of Pediatrics',
        description: 'India\'s leading organization of child health specialists',
        descriptionHindi: 'भारतीय बाल चिकित्सा अकादमी — भारत के बाल स्वास्थ्य विशेषज्ञों का प्रमुख संगठन',
        isIndian: true,
    },
    FOGSI: {
        fullName: 'Federation of Obstetric and Gynaecological Societies of India',
        description: 'India\'s leading body of pregnancy and women\'s health doctors',
        descriptionHindi: 'भारतीय प्रसूति एवं स्त्री रोग संघ — भारत के गर्भावस्था और महिला स्वास्थ्य डॉक्टरों का प्रमुख संगठन',
        isIndian: true,
    },
    ICMR: {
        fullName: 'Indian Council of Medical Research',
        description: 'India\'s top medical research body — conducts and funds health research',
        descriptionHindi: 'भारतीय आयुर्विज्ञान अनुसंधान परिषद — भारत की शीर्ष चिकित्सा अनुसंधान संस्था',
        isIndian: true,
    },
    NIN: {
        fullName: 'National Institute of Nutrition (India)',
        description: 'India\'s premier nutrition research institute — sets dietary guidelines for Indians',
        descriptionHindi: 'राष्ट्रीय पोषण संस्थान — भारतीयों के लिए आहार दिशानिर्देश तय करता है',
        isIndian: true,
    },
    UNICEF: {
        fullName: 'United Nations Children\'s Fund',
        description: 'UN agency focused on children\'s well-being, nutrition, and health worldwide',
        descriptionHindi: 'संयुक्त राष्ट्र बाल कोष — दुनिया भर में बच्चों के कल्याण, पोषण और स्वास्थ्य के लिए काम करता है',
        isIndian: false,
    },
    NHS: {
        fullName: 'National Health Service (UK)',
        description: 'UK\'s public healthcare system — provides trusted health advice',
        descriptionHindi: 'यूके की राष्ट्रीय स्वास्थ्य सेवा — विश्वसनीय स्वास्थ्य सलाह प्रदान करती है',
        isIndian: false,
    },
    AAD: {
        fullName: 'American Academy of Dermatology',
        description: 'Leading US organization for skin, hair, and nail health',
        descriptionHindi: 'अमेरिकी त्वचा विज्ञान अकादमी — त्वचा, बाल और नाखून स्वास्थ्य की विशेषज्ञ संस्था',
        isIndian: false,
    },
};

/**
 * Get the source abbreviations reference for user-facing display.
 * Returns a map of abbreviation codes to their full details in both English and Hindi.
 */
export function getSourceAbbreviations(): Record<string, SourceAbbreviation> {
    return sourceAbbreviations;
}

/**
 * Generate a human-readable legend of all source abbreviations.
 * @param language - 'en' for English, 'hi' for Hindi
 * @returns Markdown-formatted string listing all sources with explanations
 */
export function formatSourceLegend(language: 'en' | 'hi' = 'en'): string {
    const entries = Object.entries(sourceAbbreviations);
    const lines: string[] = [];
    const indianEntries = entries.filter(([_, v]) => v.isIndian);
    const globalEntries = entries.filter(([_, v]) => !v.isIndian);

    if (language === 'hi') {
        lines.push('**📚 जानकारी के स्रोत — इन संक्षिप्त नामों का क्या मतलब है?**');
        lines.push('');
        lines.push('**🇮🇳 भारतीय संस्थाएं:**');
        for (const [abbr, info] of indianEntries) {
            lines.push(`• **${abbr}** — ${info.fullName} — ${info.descriptionHindi}`);
        }
        lines.push('');
        lines.push('**🌍 अंतरराष्ट्रीय संस्थाएं:**');
        for (const [abbr, info] of globalEntries) {
            lines.push(`• **${abbr}** — ${info.fullName} — ${info.descriptionHindi}`);
        }
    } else {
        lines.push('**📚 Information Sources — What Do These Abbreviations Mean?**');
        lines.push('');
        lines.push('**🇮🇳 Indian Organizations:**');
        for (const [abbr, info] of indianEntries) {
            lines.push(`• **${abbr}** — ${info.fullName}: ${info.description}`);
        }
        lines.push('');
        lines.push('**🌍 International Organizations:**');
        for (const [abbr, info] of globalEntries) {
            lines.push(`• **${abbr}** — ${info.fullName}: ${info.description}`);
        }
    }

    lines.push('');
    lines.push('💡 *Every claim in this guide is backed by these trusted health authorities. When you see abbreviations like (WHO, MOHFW) next to health advice, it means the guidance is supported by both the World Health Organization and India\'s Ministry of Health & Family Welfare.*');

    return lines.join('\n');
}

/**
 * Get a simple explanation for a single abbreviation code.
 * @param abbr - The abbreviation code (e.g., 'WHO', 'MOHFW')
 * @param language - 'en' or 'hi'
 * @returns A human-readable string like "World Health Organization (global health guidelines)" or null
 */
export function explainAbbreviation(abbr: string, language: 'en' | 'hi' = 'en'): string | null {
    const info = sourceAbbreviations[abbr];
    if (!info) return null;
    if (language === 'hi') {
        return `${info.fullName} — ${info.descriptionHindi}`;
    }
    return `${info.fullName} — ${info.description}`;
}