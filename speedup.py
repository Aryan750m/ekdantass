import os
import re

css_files = [
    'css/theme.css',
    'animations.css',
    'advanced-animations.css'
]

js_files = [
    'js/site.js',
    'advanced-animations.js'
]

for f in css_files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Replace durations ending in ms (e.g. 500ms, 600ms, 250ms)
        # but avoid touching things that might not be transition durations
        content = re.sub(r'(\d{2,4})ms', '10ms', content)
        
        # Replace duration in seconds (e.g. 0.3s, 1s)
        content = re.sub(r'(?<![\w-])(0\.\d+|[1-9]\d*)s\b', '10ms', content)

        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")

for f in js_files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        content = re.sub(r'(\d{2,4})ms', '10ms', content)
        # In site.js we have: Math.min(index % 4, 3) * 90 + "ms"
        # Let's just replace the multiplier
        content = content.replace('* 90 + "ms"', '* 10 + "ms"')
        content = content.replace('* 100 + "ms"', '* 10 + "ms"')
        content = content.replace('8000', '10') # timeouts
        content = content.replace('4000', '10')

        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
