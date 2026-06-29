#!/usr/bin/env python3
"""
Generate meal translations for all 240 meals in seed-meals.ts
This script reads the meal names and generates translations for all supported languages.
"""

import json
import re

# Read seed-meals.ts to extract meal names
with open('prisma/seed-meals.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract meal names using regex
meal_pattern = r'name:\s*"([^"]+)"'
meal_names = re.findall(meal_pattern, content)

print(f"Found {len(meal_names)} meals")

# Load existing translations if any
try:
    with open('prisma/meal-translations.json', 'r', encoding='utf-8') as f:
        translations = json.load(f)
except FileNotFoundError:
    translations = {"meals": {}}

# Add missing meals
for meal_name in meal_names:
    if meal_name not in translations["meals"]:
        # For now, use English as placeholder for all languages
        # In production, you'd use a translation API or manual translation
        translations["meals"][meal_name] = {
            "en": meal_name,
            "hi": meal_name,  # Placeholder - needs actual translation
            "bn": meal_name,  # Placeholder - needs actual translation
            "ta": meal_name,  # Placeholder - needs actual translation
            "te": meal_name,  # Placeholder - needs actual translation
            "mr": meal_name,  # Placeholder - needs actual translation
            "gu": meal_name   # Placeholder - needs actual translation
        }

# Save translations
with open('prisma/meal-translations.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print(f"Generated translations for {len(translations['meals'])} meals")
print("Note: Translations are placeholders and need to be replaced with actual translations")
