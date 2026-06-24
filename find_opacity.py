import re

with open('css/theme.css', 'r', encoding='utf-8') as f:
    css = f.read()

# remove comments
css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)

# extract all blocks
blocks = re.findall(r'([^{]+)\{([^}]+)\}', css)

zero_opacity_selectors = []
for selector, props in blocks:
    if 'opacity: 0' in props or 'opacity:0' in props:
        zero_opacity_selectors.append(selector.strip())

print("Selectors with opacity 0:")
for s in zero_opacity_selectors:
    print("- " + " ".join(s.split()))

