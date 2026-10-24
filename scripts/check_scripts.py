with open('d:/Reoti_Handloom/www_page.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', text)
for s in scripts:
    print('Script:', s)
