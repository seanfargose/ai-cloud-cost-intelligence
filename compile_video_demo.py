#!/usr/bin/env python3
import os
import glob
from PIL import Image

def compile_video():
    frames_dir = "frames"
    frame_files = sorted(glob.glob(os.path.join(frames_dir, "frame_*.png")))
    
    if not frame_files:
        print("❌ No frames found in frames/ directory")
        return

    print(f"🎬 Loading {len(frame_files)} frames for video compilation...")
    images = [Image.open(f) for f in frame_files]

    # Save as high-quality animated WebP (Video format)
    webp_output = "multi_cloud_ecosystem_demo.webp"
    print(f"📦 Compiling animated WebP video: {webp_output}...")
    images[0].save(
        webp_output,
        save_all=True,
        append_images=images[1:],
        duration=150,
        loop=0,
        quality=90,
        method=4
    )
    print(f"✅ Created {webp_output} ({os.path.getsize(webp_output) / 1024 / 1024:.2f} MB)")

    # Save smaller preview GIF
    gif_output = "multi_cloud_ecosystem_demo.gif"
    print(f"📦 Compiling animated GIF: {gif_output}...")
    # Resize slightly for GIF efficiency
    gif_images = [img.resize((1024, 640), Image.Resampling.LANCZOS).convert("P", palette=Image.Palette.ADAPTIVE) for img in images[::2]]
    gif_images[0].save(
        gif_output,
        save_all=True,
        append_images=gif_images[1:],
        duration=200,
        loop=0,
        optimize=True
    )
    print(f"✅ Created {gif_output} ({os.path.getsize(gif_output) / 1024 / 1024:.2f} MB)")

if __name__ == "__main__":
    compile_video()
