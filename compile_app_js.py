import os
import json
import subprocess
from pathlib import Path
import html

WORKSPACE = Path("C:/Users/luisn/.gemini/antigravity/scratch/rfid-tool-manager")
app_js_path = WORKSPACE / "frontend/app.js"
output_path = WORKSPACE / "frontend/app.compiled.js"
compiler_html_path = WORKSPACE / "compiler.html"

app_js_code = app_js_path.read_text(encoding="utf-8")
print(f"Reading app.js ({len(app_js_code)} chars, {len(app_js_code.splitlines())} lines)...")

# Write compiler HTML with embedded JS string in a script or textarea
compiler_html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <textarea id="source">{html.escape(app_js_code)}</textarea>
    <pre id="output"></pre>
    <div id="status">pending</div>
    <script>
        try {{
            const src = document.getElementById('source').value;
            const res = Babel.transform(src, {{
                presets: [['react', {{ runtime: 'classic' }}]]
            }}).code;
            document.getElementById('output').textContent = res;
            document.getElementById('status').textContent = 'DONE';
        }} catch(e) {{
            document.getElementById('output').textContent = 'ERROR: ' + e.message;
            document.getElementById('status').textContent = 'FAIL';
        }}
    </script>
</body>
</html>"""

compiler_html_path.write_text(compiler_html, encoding="utf-8")
print("Compiler HTML written. Launching headless Chrome...")

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--virtual-time-budget=10000",
    "--dump-dom",
    str(compiler_html_path)
]

res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
dom = res.stdout

if '<div id="status">DONE</div>' in dom:
    start_tag = '<pre id="output">'
    end_tag = '</pre>'
    start_idx = dom.find(start_tag) + len(start_tag)
    end_idx = dom.find(end_tag, start_idx)
    compiled_code = html.unescape(dom[start_idx:end_idx])
    
    # Save compiled file
    output_path.write_text(compiled_code, encoding="utf-8")
    print(f"SUCCESS! Precompiled app.compiled.js generated: {len(compiled_code)} chars ({len(compiled_code.splitlines())} lines).")
    
    # Clean up compiler html
    compiler_html_path.unlink(missing_ok=True)
else:
    print("Compilation did not succeed.")
    if 'ERROR:' in dom:
        err_start = dom.find('ERROR:')
        print(dom[err_start:err_start+500])
