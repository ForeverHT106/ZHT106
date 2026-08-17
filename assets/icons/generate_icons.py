# -*- coding: utf-8 -*-
"""
咔哒 (Kada) 品牌图标生成脚本
根据 assets/logo.svg 的设计，用 Pillow 重绘并生成：
  - favicon.ico            (16/24/32/48/64/128/256 多尺寸，Windows 快捷方式 + 浏览器通用)
  - favicon-16x16.png      (浏览器小图标)
  - favicon-32x32.png      (浏览器小图标)
  - apple-touch-icon.png   (180x180, iOS/Android 主屏图标)
  - android-chrome-192.png / android-chrome-512.png (PWA/主屏图标)
  - logo-256.png           (通用大图标)
用法: python generate_icons.py
"""
import os
from PIL import Image, ImageDraw

# ---------- 设计参数（与 logo.svg 一致） ----------
GRAD_TOP = (26, 115, 232)      # #1a73e8 品牌蓝
GRAD_BOTTOM = (21, 87, 176)    # #1557b0 深蓝
POINTER_WHITE = (255, 255, 255, 255)
DOT_YELLOW = (245, 166, 35, 255)     # #f5a623
RING_YELLOW = (245, 166, 35, 150)    # 涟漪环（静态半透明）

# SVG 坐标（viewBox 100x100）
# 圆角方块: rect x=4 y=4 w=92 h=92 rx=24
# 鼠标指针: M29 19 L60 50 L46 52 L51.5 69 L42 72.5 L36.5 56 L22 64 Z
# 黄点:     circle cx=64 cy=71 r=6.5
POINTER_PTS = [(29, 19), (60, 50), (46, 52), (51.5, 69), (42, 72.5), (36.5, 56), (22, 64)]
DOT_CX, DOT_CY, DOT_R = 64, 71, 6.5
RING_R = 12.5  # 涟漪外环半径

SUPERSAMPLE = 4   # 超采样倍数（抗锯齿）
BASE = 256        # 输出基准尺寸


def lerp(a, b, t):
    return int(a + (b - a) * t)


def draw_icon(size):
    """在 size x size 画布上绘制图标（RGBA）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    s = size / 100.0  # 缩放系数

    # 1) 对角渐变圆角方块（左上 #1a73e8 -> 右下 #1557b0）
    mask = Image.new('L', (size, size), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([4 * s, 4 * s, 96 * s, 96 * s], radius=24 * s, fill=255)

    grad = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    seg = 8
    for y in range(size):
        t0 = y / (2.0 * size)            # 行左端渐变位置
        t1 = (y + size) / (2.0 * size)   # 行右端渐变位置
        for s_i in range(seg):
            x0 = s_i * size // seg
            x1 = (s_i + 1) * size // seg
            t = t0 + (t1 - t0) * (s_i + 0.5) / seg
            color = (lerp(GRAD_TOP[0], GRAD_BOTTOM[0], t),
                     lerp(GRAD_TOP[1], GRAD_BOTTOM[1], t),
                     lerp(GRAD_TOP[2], GRAD_BOTTOM[2], t), 255)
            gd.line([(x0, y), (x1, y)], fill=color)

    img.paste(grad, (0, 0), mask)

    # 2) 白色鼠标指针（咔哒 = 点击）
    pts = [(x * s, y * s) for x, y in POINTER_PTS]
    d.polygon(pts, fill=POINTER_WHITE)

    # 3) 黄色落地圆点
    cx, cy = DOT_CX * s, DOT_CY * s
    r = DOT_R * s
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=DOT_YELLOW)

    # 4) 静态涟漪环（原 SVG 为动画，静态版取一帧扩散效果）
    rr = RING_R * s
    d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr],
              outline=RING_YELLOW, width=max(1, int(2.0 * s)))

    return img


def main():
    out_dir = os.path.dirname(os.path.abspath(__file__))
    # 超采样绘制，再缩放到各目标尺寸（LANCZOS 高质量）
    hi = draw_icon(BASE * SUPERSAMPLE)

    def resize(target):
        return hi.resize((target, target), Image.LANCZOS)

    # ICO：Pillow 自动从 256 生成多尺寸
    ico = resize(256)
    ico.save(os.path.join(out_dir, 'favicon.ico'), format='ICO',
             sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64),
                    (128, 128), (256, 256)])

    outputs = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'apple-touch-icon.png': 180,
        'android-chrome-192.png': 192,
        'android-chrome-512.png': 512,
        'logo-256.png': 256,
    }
    for name, target in outputs.items():
        resize(target).save(os.path.join(out_dir, name), format='PNG')

    print('已生成:')
    for name in ['favicon.ico'] + list(outputs.keys()):
        path = os.path.join(out_dir, name)
        print(f'  - {name}  ({os.path.getsize(path):,} bytes)')


if __name__ == '__main__':
    main()
