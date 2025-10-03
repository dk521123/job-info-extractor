from fpdf import FPDF, XPos, YPos
from PIL import Image, ImageDraw, ImageFont


#########
# To create a PDF with Japanese text
#########
pdf = FPDF()
pdf.add_page()

pdf.add_font('Noto', '', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
pdf.set_font('Noto', '', 14)

lines = [
    "会社名：株式会社テスト",
    "職種：ソフトウェアエンジニア",
    "勤務地：東京都渋谷区",
    "給与：年収500万円〜700万円"
]

for line in lines:
    pdf.cell(200, 10, text=line, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

pdf.output("test_files/sample.pdf")
print("✅ sample.pdf created")

#########
# To create an image with the same text
#########
img = Image.new("RGB", (600, 300), color=(255, 255, 255))
draw = ImageDraw.Draw(img)

font_path = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
font = ImageFont.truetype(font_path, 20)

y = 40
for line in lines:
    draw.text((40, y), line, fill=(0, 0, 0), font=font)
    y += 40

img.save("test_files/sample.png")
print("✅ sample.png created")
