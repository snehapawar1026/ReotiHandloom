import re
with open('d:/Reoti_Handloom/www_page.html', 'r', encoding='utf-8') as f:
    html = f.read()

links = set(re.findall(r'href=["\'](/[^"\'#]+)["\']', html))
print('Total unique internal links on www:', len(links))
for l in sorted(list(links))[:20]:
    print(' -', l)
