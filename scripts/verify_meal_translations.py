#!/usr/bin/env python3
"""Verify meal translations completeness against seed-meals.ts."""
import json
import re
import sys

# Read seed-meals.ts
with open('prisma/seed-meals.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract meal names - handle both single and double quotes
meal_names = re.findall(r'name:\s*"([^"]+)"', content)
if not meal_names:
    meal_names = re.findall(r"name:\s*'([^']+)'", content)

print(f"Meals found in seed-meals.ts: {len(meal_names)}")

# Load translations
with open('prisma/meal-translations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

translated = data.get('meals', {})
print(f"Meals in translations file: {len(translated)}")

# Required languages
required_langs = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu']

# Find missing meals
missing = [n for n in meal_names if n not in translated]
print(f"\nMissing from translations: {len(missing)}")
for m in missing[:30]:
    print(f"  - {m}")

# Find meals with placeholder/incomplete translations
print("\n--- Incomplete translations (non-en equals en, or empty) ---")
incomplete = []
for name, langs in translated.items():
    for lang in required_langs:
        val = langs.get(lang, '')
        if not val or val == langs.get('en', name):
            incomplete.append((name, lang, val))

if incomplete:
    print(f"Total incomplete entries: {len(incomplete)}")
    for name, lang, val in incomplete[:30]:
        print(f"  [{lang}] {name} => '{val}'")
else:
    print("All entries have non-placeholder translations for all languages.")

# Check for any meal in translations not in seed file
extra = [n for n in translated if n not in meal_names]
print(f"\nExtra meals in translations (not in seed): {len(extra)}")
for e in extra[:10]:
    print(f"  - {e}")
