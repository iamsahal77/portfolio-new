from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
root = Path(__file__).resolve().parent
source = root / 'ezgif-8fcc76cbd7cc975c-jpg'
def convert(file):
    with Image.open(file) as original:
        for name, width in [('desktop', 1600), ('mobile', 960)]:
            dest = root / 'assets' / 'frames' / name
            dest.mkdir(parents=True, exist_ok=True)
            output = dest / file.name.replace('ezgif-', '').replace('.jpg', '.webp')
            if not output.exists():
                image = original.resize((width, round(original.height * width / original.width)), Image.Resampling.LANCZOS)
                image.save(output, 'WEBP', quality=80, method=4)
with ThreadPoolExecutor(max_workers=4) as pool:
    list(pool.map(convert, sorted(source.glob('*.jpg'))))
for variant in ['desktop', 'mobile']:
    files = list((root / 'assets' / 'frames' / variant).glob('*.webp'))
    print(variant, len(files), round(sum(p.stat().st_size for p in files) / 1048576, 2), 'MB')
