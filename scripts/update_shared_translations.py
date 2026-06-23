import json
from pathlib import Path

english = {
    "title": "Shared Space",
    "subtitle": "Plan baby names, wishlist items, memories, and preparation progress together.",
    "familyHub": "Family Planning Hub",
    "overallProgress": "Overall Progress",
    "favoriteNames": "Favorite Names",
    "wishlistReady": "Wishlist Ready",
    "memoriesSaved": "Memories Saved",
    "babyNamePicker": "Baby Name Picker",
    "babyNamePickerDesc": "Tap names you both love and watch the favorite list grow.",
    "topPick": "Top pick",
    "nameAarav": "Aarav",
    "meaningAarav": "Peaceful and wise",
    "nameAnaya": "Anaya",
    "meaningAnaya": "Caring and protected",
    "nameVihaan": "Vihaan",
    "meaningVihaan": "Dawn and new beginning",
    "nameMyra": "Myra",
    "meaningMyra": "Beloved and admirable",
    "nameVotesNote": "{votes} family votes counted across the shortlist.",
    "babyWishlist": "Baby Wishlist",
    "babyWishlistDesc": "Track clothes, essentials, feeding, sleep, and care items.",
    "wishlistClothes": "Soft newborn clothes",
    "wishlistBlanket": "Warm baby blanket",
    "wishlistDiapers": "Diapers and wipes",
    "wishlistBottles": "Feeding bottles",
    "wishlistBathKit": "Baby bath care kit",
    "categoryClothing": "Clothing",
    "categorySleep": "Sleep",
    "categoryEssentials": "Essentials",
    "categoryFeeding": "Feeding",
    "categoryCare": "Care",
    "priorityHigh": "High priority",
    "priorityMedium": "Medium priority",
    "priorityLow": "Low priority",
    "memoryWall": "Memory Wall",
    "memoryWallDesc": "Upload photos and keep special moments in one shared place.",
    "memoryTitlePlaceholder": "Memory title",
    "memoryCaptionPlaceholder": "Write a small caption",
    "uploadMemory": "Upload picture",
    "uploadHint": "Images preview here for this session so both profiles can plan the memory wall UI.",
    "memoryDefaultCaption": "A precious moment from our journey.",
    "memoryPromptFirstKick": "Save the first kick memory",
    "memoryPromptScanDay": "Add a scan day photo",
    "memoryPromptNursery": "Capture nursery preparation",
    "memoryPromptFamily": "Keep a family blessing photo",
    "removeMemory": "Remove memory",
    "progressTracker": "Progress Tracker",
    "namesProgress": "Name shortlist",
    "wishlistProgress": "Wishlist progress",
    "memoryProgress": "Memory wall",
    "partnerSyncTitle": "Made for both profiles",
    "partnerSyncDesc": "Mother and partner dashboards now open this same shared planning space.",
    "planTogether": "Plan together",
    "profileCardTitle": "Baby planning shared space",
    "profileCardDesc": "Pick baby names, prepare wishlist items, upload memories, and track progress together.",
    "openSharedSpace": "Open Shared Space"
}

translations = {
    "en": english,
    "hi": {
        "title": "साझा स्थान",
        "subtitle": "बच्चे के नाम, विशलिस्ट आइटम, यादें और तैयारी की प्रगति साथ मिलकर प्लान करें।",
        "familyHub": "फैमिली प्लानिंग हब",
        "overallProgress": "कुल प्रगति",
        "favoriteNames": "पसंदीदा नाम",
        "wishlistReady": "विशलिस्ट तैयार",
        "memoriesSaved": "सहेजी गई यादें",
        "babyNamePicker": "बच्चे का नाम चुनें",
        "babyNamePickerDesc": "जो नाम आप दोनों को पसंद हों उन्हें टैप करें और पसंदीदा सूची बढ़ाएं।",
        "topPick": "शीर्ष पसंद",
        "nameAarav": "आरव",
        "meaningAarav": "शांत और बुद्धिमान",
        "nameAnaya": "अनाया",
        "meaningAnaya": "देखभाल करने वाली और सुरक्षित",
        "nameVihaan": "विहान",
        "meaningVihaan": "भोर और नई शुरुआत",
        "nameMyra": "मायरा",
        "meaningMyra": "प्रिय और प्रशंसनीय",
        "nameVotesNote": "शॉर्टलिस्ट में {votes} पारिवारिक वोट गिने गए।",
        "babyWishlist": "बच्चे की विशलिस्ट",
        "babyWishlistDesc": "कपड़े, ज़रूरी सामान, फीडिंग, नींद और देखभाल की चीजें ट्रैक करें।",
        "wishlistClothes": "नरम नवजात कपड़े",
        "wishlistBlanket": "गर्म बेबी कंबल",
        "wishlistDiapers": "डायपर और वाइप्स",
        "wishlistBottles": "फीडिंग बोतलें",
        "wishlistBathKit": "बेबी बाथ केयर किट",
        "categoryClothing": "कपड़े",
        "categorySleep": "नींद",
        "categoryEssentials": "ज़रूरी सामान",
        "categoryFeeding": "फीडिंग",
        "categoryCare": "देखभाल",
        "priorityHigh": "उच्च प्राथमिकता",
        "priorityMedium": "मध्यम प्राथमिकता",
        "priorityLow": "कम प्राथमिकता",
        "memoryWall": "मेमोरी वॉल",
        "memoryWallDesc": "तस्वीरें अपलोड करें और खास पलों को एक साझा जगह पर रखें।",
        "memoryTitlePlaceholder": "याद का शीर्षक",
        "memoryCaptionPlaceholder": "छोटा कैप्शन लिखें",
        "uploadMemory": "तस्वीर अपलोड करें",
        "uploadHint": "तस्वीरें इस सत्र में मेमोरी वॉल के रूप में दिखाई देंगी।",
        "memoryDefaultCaption": "हमारी यात्रा का एक अनमोल पल।",
        "memoryPromptFirstKick": "पहली किक की याद सहेजें",
        "memoryPromptScanDay": "स्कैन डे फोटो जोड़ें",
        "memoryPromptNursery": "नर्सरी तैयारी कैप्चर करें",
        "memoryPromptFamily": "परिवार के आशीर्वाद की फोटो रखें",
        "removeMemory": "याद हटाएं",
        "progressTracker": "प्रगति ट्रैकर",
        "namesProgress": "नाम शॉर्टलिस्ट",
        "wishlistProgress": "विशलिस्ट प्रगति",
        "memoryProgress": "मेमोरी वॉल",
        "partnerSyncTitle": "दोनों प्रोफाइल के लिए बनाया गया",
        "partnerSyncDesc": "माँ और पार्टनर डैशबोर्ड अब इसी साझा प्लानिंग स्पेस को खोलते हैं।",
        "planTogether": "साथ प्लान करें",
        "profileCardTitle": "बेबी प्लानिंग साझा स्थान",
        "profileCardDesc": "बच्चे के नाम चुनें, विशलिस्ट तैयार करें, यादें अपलोड करें और साथ प्रगति ट्रैक करें।",
        "openSharedSpace": "साझा स्थान खोलें"
    }
}

overrides = {
    "bn": {"title": "শেয়ার্ড স্পেস", "familyHub": "পরিবার পরিকল্পনা হাব"},
    "gu": {"title": "શેર કરેલ જગ્યા", "familyHub": "પરિવાર આયોજન હબ"},
    "mr": {"title": "सामायिक जागा", "familyHub": "कुटुंब नियोजन हब"},
    "ta": {"title": "பகிரப்பட்ட இடம்", "familyHub": "குடும்ப திட்டமிடல் மையம்"},
    "te": {"title": "షేర్డ్ స్పేస్", "familyHub": "కుటుంబ ప్రణాళిక హబ్"},
}

for locale, values in overrides.items():
    translated = dict(translations["hi"])
    translated.update(values)
    translations[locale] = translated

for path in Path("src/messages").glob("*.json"):
    locale = path.stem
    if locale not in translations:
        continue
    data = json.loads(path.read_text(encoding="utf-8"))
    data["shared"] = translations[locale]
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
