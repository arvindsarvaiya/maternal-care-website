import json
from pathlib import Path

updates = {
    "en": {
        "namePlaceholder": "Add a baby name",
        "meaningPlaceholder": "Meaning or why you love it",
        "addName": "Add name",
        "loadingNames": "Loading baby names...",
        "emptyNamesTitle": "No baby names yet",
        "emptyNamesDesc": "Add the first name so both profiles can vote on it.",
        "noNamesYet": "No names yet",
        "noMeaningAdded": "No meaning added yet",
        "addedBy": "Added by {name}",
        "deleteName": "Delete name",
        "nameLoadError": "Could not load baby names. Please try again.",
        "nameSaveError": "Could not save this baby name. Please try again.",
        "nameDeleteError": "Could not delete this baby name. Please try again."
    },
    "hi": {
        "namePlaceholder": "बच्चे का नाम जोड़ें",
        "meaningPlaceholder": "अर्थ या यह नाम क्यों पसंद है",
        "addName": "नाम जोड़ें",
        "loadingNames": "बच्चे के नाम लोड हो रहे हैं...",
        "emptyNamesTitle": "अभी कोई नाम नहीं है",
        "emptyNamesDesc": "पहला नाम जोड़ें ताकि दोनों प्रोफाइल उस पर वोट कर सकें।",
        "noNamesYet": "अभी कोई नाम नहीं",
        "noMeaningAdded": "अभी अर्थ नहीं जोड़ा गया",
        "addedBy": "{name} ने जोड़ा",
        "deleteName": "नाम हटाएं",
        "nameLoadError": "बच्चे के नाम लोड नहीं हो सके। कृपया फिर कोशिश करें।",
        "nameSaveError": "यह नाम सेव नहीं हो सका। कृपया फिर कोशिश करें।",
        "nameDeleteError": "यह नाम हटाया नहीं जा सका। कृपया फिर कोशिश करें।"
    },
    "bn": {
        "namePlaceholder": "শিশুর নাম যোগ করুন",
        "meaningPlaceholder": "অর্থ বা কেন নামটি পছন্দ",
        "addName": "নাম যোগ করুন",
        "loadingNames": "শিশুর নাম লোড হচ্ছে...",
        "emptyNamesTitle": "এখনও কোনো নাম নেই",
        "emptyNamesDesc": "প্রথম নামটি যোগ করুন যাতে দুই প্রোফাইলই ভোট করতে পারে।",
        "noNamesYet": "এখনও কোনো নাম নেই",
        "noMeaningAdded": "এখনও অর্থ যোগ করা হয়নি",
        "addedBy": "{name} যোগ করেছেন",
        "deleteName": "নাম মুছুন",
        "nameLoadError": "শিশুর নাম লোড করা যায়নি। আবার চেষ্টা করুন।",
        "nameSaveError": "এই নামটি সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
        "nameDeleteError": "এই নামটি মুছা যায়নি। আবার চেষ্টা করুন।"
    },
    "gu": {
        "namePlaceholder": "બાળકનું નામ ઉમેરો",
        "meaningPlaceholder": "અર્થ અથવા તમને કેમ ગમે છે",
        "addName": "નામ ઉમેરો",
        "loadingNames": "બાળકનાં નામ લોડ થઈ રહ્યાં છે...",
        "emptyNamesTitle": "હજુ કોઈ નામ નથી",
        "emptyNamesDesc": "પહેલું નામ ઉમેરો જેથી બંને પ્રોફાઇલ તેના પર મત આપી શકે।",
        "noNamesYet": "હજુ કોઈ નામ નથી",
        "noMeaningAdded": "હજુ અર્થ ઉમેરાયો નથી",
        "addedBy": "{name} દ્વારા ઉમેરાયું",
        "deleteName": "નામ કાઢી નાખો",
        "nameLoadError": "બાળકનાં નામ લોડ થઈ શક્યાં નહીં. કૃપા કરીને ફરી પ્રયાસ કરો.",
        "nameSaveError": "આ નામ સેવ થઈ શક્યું નહીં. કૃપા કરીને ફરી પ્રયાસ કરો.",
        "nameDeleteError": "આ નામ કાઢી શક્યું નહીં. કૃપા કરીને ફરી પ્રયાસ કરો."
    },
    "mr": {
        "namePlaceholder": "बाळाचे नाव जोडा",
        "meaningPlaceholder": "अर्थ किंवा हे नाव का आवडते",
        "addName": "नाव जोडा",
        "loadingNames": "बाळाची नावे लोड होत आहेत...",
        "emptyNamesTitle": "अजून कोणतीही नावे नाहीत",
        "emptyNamesDesc": "पहिले नाव जोडा जेणेकरून दोन्ही प्रोफाइल त्यावर मत देऊ शकतील.",
        "noNamesYet": "अजून नावे नाहीत",
        "noMeaningAdded": "अजून अर्थ जोडलेला नाही",
        "addedBy": "{name} यांनी जोडले",
        "deleteName": "नाव हटवा",
        "nameLoadError": "बाळाची नावे लोड होऊ शकली नाहीत. कृपया पुन्हा प्रयत्न करा.",
        "nameSaveError": "हे नाव सेव होऊ शकले नाही. कृपया पुन्हा प्रयत्न करा.",
        "nameDeleteError": "हे नाव हटवता आले नाही. कृपया पुन्हा प्रयत्न करा."
    },
    "ta": {
        "namePlaceholder": "குழந்தை பெயரை சேர்க்கவும்",
        "meaningPlaceholder": "அர்த்தம் அல்லது ஏன் பிடித்தது",
        "addName": "பெயர் சேர்க்கவும்",
        "loadingNames": "குழந்தை பெயர்கள் ஏற்றப்படுகின்றன...",
        "emptyNamesTitle": "இன்னும் பெயர்கள் இல்லை",
        "emptyNamesDesc": "இரு சுயவிவரங்களும் வாக்களிக்க முதல் பெயரை சேர்க்கவும்.",
        "noNamesYet": "இன்னும் பெயர்கள் இல்லை",
        "noMeaningAdded": "இன்னும் அர்த்தம் சேர்க்கப்படவில்லை",
        "addedBy": "{name} சேர்த்தார்",
        "deleteName": "பெயரை நீக்கவும்",
        "nameLoadError": "குழந்தை பெயர்களை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        "nameSaveError": "இந்த பெயரை சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
        "nameDeleteError": "இந்த பெயரை நீக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்."
    },
    "te": {
        "namePlaceholder": "బిడ్డ పేరు జోడించండి",
        "meaningPlaceholder": "అర్థం లేదా ఎందుకు నచ్చింది",
        "addName": "పేరు జోడించండి",
        "loadingNames": "బిడ్డ పేర్లు లోడ్ అవుతున్నాయి...",
        "emptyNamesTitle": "ఇంకా పేర్లు లేవు",
        "emptyNamesDesc": "రెండు ప్రొఫైళ్లు ఓటు వేయడానికి మొదటి పేరును జోడించండి.",
        "noNamesYet": "ఇంకా పేర్లు లేవు",
        "noMeaningAdded": "ఇంకా అర్థం జోడించలేదు",
        "addedBy": "{name} జోడించారు",
        "deleteName": "పేరు తొలగించండి",
        "nameLoadError": "బిడ్డ పేర్లు లోడ్ కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
        "nameSaveError": "ఈ పేరు సేవ్ కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
        "nameDeleteError": "ఈ పేరు తొలగించలేకపోయాం. దయచేసి మళ్లీ ప్రయత్నించండి."
    }
}

for path in Path("src/messages").glob("*.json"):
    locale = path.stem
    if locale not in updates:
        continue
    data = json.loads(path.read_text(encoding="utf-8"))
    data.setdefault("shared", {}).update(updates[locale])
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
