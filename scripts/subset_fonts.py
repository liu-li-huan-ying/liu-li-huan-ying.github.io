#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""按字表把可变字体裁成 woff2。

只被 scripts/build-fonts.mjs 调用，不单独使用。
用法： python subset_fonts.py <job.json>

job.json 结构：
  {
    "cacheDir": ".../.fontcache",
    "jobs": [
      { "source": "xxx.otf", "out": "yyy.woff2",
        "axes": { "wght": 900 }, "text": "要保留的字符" }
    ]
  }

axes 省略（或为 null）时保留可变轴，输出仍是可变字体 —— CSS 那边写成
font-weight:200 900，一个文件顶掉四个静态字重。中日韩字体尤其划算：
四个静态实例各自存一份完整轮廓，可变字体只存一份轮廓加变化量，
体积少一半以上，而且浏览器只需下载一次、只触发一次重排。

给定 axes 时先实例化成静态字体再裁剪。同一个 (源字体, 轴值) 会被多个 out
复用，所以实例化一次、存成静态字体落在 cacheDir 里按需反复裁剪 ——
中日韩变量字体实例化一次十几秒，能省就省。

依赖： fonttools、brotli
"""
import json
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.subset import Subsetter, Options


def axes_of(font):
    try:
        return {a.axisTag: (a.minValue, a.defaultValue, a.maxValue) for a in font["fvar"].axes}
    except KeyError:
        return {}


def instance_path(cache_dir, job):
    axes = job.get("axes") or {}
    stem = os.path.splitext(os.path.basename(job["source"]))[0]
    if not axes:
        return job["source"]
    tag = "-".join("%s%s" % (k, v) for k, v in sorted(axes.items()))
    return os.path.join(cache_dir, "%s@%s.otf" % (stem, tag))


def build_instance(cache_dir, job):
    font = TTFont(job["source"], lazy=False)
    axes = job.get("axes") or {}
    available = axes_of(font)
    if not available:
        raise SystemExit("源字体没有可变轴，无法实例化：" + job["source"])
    for tag, value in axes.items():
        if tag not in available:
            raise SystemExit("源字体缺少 %s 轴（现有 %s）" % (tag, list(available)))
        lo, _default, hi = available[tag]
        if not (lo <= value <= hi):
            raise SystemExit("%s=%s 超出 %s 轴范围 %s-%s" % (tag, value, tag, lo, hi))
    font = instancer.instantiateVariableFont(font, axes, inplace=False, updateFontNames=False)
    dest = instance_path(cache_dir, job)
    font.save(dest)
    font.close()
    print("  实例化 %s" % os.path.basename(dest))
    return dest


def main():
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    cache_dir = spec["cacheDir"]
    jobs = spec["jobs"]
    os.makedirs(cache_dir, exist_ok=True)
    total = 0
    report = {}

    for job in jobs:
        if job.get("axes"):
            static = instance_path(cache_dir, job)
            if not os.path.exists(static):
                static = build_instance(cache_dir, job)
        else:
            # 保留可变轴，直接裁源文件
            static = job["source"]

        # 每次都从静态字体重新读一份 —— 裁剪会改字形表，不能在上一次的结果上接着裁
        font = TTFont(static, lazy=False)

        options = Options()
        options.flavor = "woff2"
        # CJK 提示与去子程序化都只会让文件变大，浏览器缩放渲染并不需要它们
        options.hinting = False
        options.desubroutinize = False
        options.glyph_names = False
        options.name_IDs = ["*"]
        options.drop_tables = list(options.drop_tables) + ["DSIG"]

        subsetter = Subsetter(options=options)
        subsetter.populate(text=job["text"])
        subsetter.subset(font)

        # 保留可变轴的输出要告诉 CSS 那边字重区间，好写成 font-weight:200 900
        if not job.get("axes"):
            wght = axes_of(font).get("wght")
            if wght:
                report[job["out"]] = [int(wght[0]), int(wght[2])]

        os.makedirs(os.path.dirname(job["out"]), exist_ok=True)
        font.save(job["out"])
        font.close()

        size = os.path.getsize(job["out"])
        total += size
        print(
            "  %-42s %7.1f KB  (%d 字)"
            % (os.path.basename(job["out"]), size / 1024.0, len(set(job["text"])))
        )

    report_path = os.path.join(cache_dir, "axes-report.json")
    json.dump(report, open(report_path, "w", encoding="utf-8"))

    print("  合计 %.1f KB" % (total / 1024.0))


if __name__ == "__main__":
    main()
