#!/usr/bin/env python3
import json

with open('prisma/meal-translations.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

total_meals = len(data["meals"])
untranslated = [k for k,v in data['meals'].items() if v['en'] == v['hi']]
translated_count = total_meals - len(untranslated)

print(f'Total meals: {total_meals}')
print(f'Translated meals: {translated_count}')
print(f'Untranslated meals: {len(untranslated)}')

if untranslated:
    print('\nFirst 10 untranslated meals:')
    for meal in untranslated[:10]:
        print(f'  - {meal}')
