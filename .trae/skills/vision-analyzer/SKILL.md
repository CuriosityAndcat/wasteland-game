---
name: "vision-analyzer"
description: "通用视觉分析工具，使用 智谱AI GLM-4V-Flash（完全免费）分析图片。支持图片描述、质量评估、OCR文字识别、风格对比。在任何对话中，当用户需要分析图片内容、检查图片质量、识别图片文字或对比多张图片时，请调用此技能。"
---

# Vision Analyzer - 通用视觉分析工具

## 适用场景（任何对话中均可调用）

| 用户请求 | 触发动作 |
|----------|----------|
| "帮我看看这张图/分析一下这个图片" | 调用 `describe()` |
| "这张图片质量怎么样/清晰吗" | 调用 `quality()` |
| "提取/识别这张图里的文字" | 调用 `ocr()` |
| "对比这两张图的风格" | 调用 `compare()` |
| 用户给出了图片路径 | 自动选择合适的分析模式 |

## 脚本位置

```
D:\AI游戏\搭建废土战歌文字游戏\vision-tool\vision_tool.py
```

配置文件和API Key已存放在同目录下，**开箱即用**。

## Python 导入方式（推荐，可直接在对话中调用）

```python
# 在任意对话中，只需导入并调用
import sys
sys.path.insert(0, r"D:\AI游戏\搭建废土战歌文字游戏\vision-tool")
from vision_tool import describe, quality, ocr, compare

# 分析单张图片
result = describe("图片路径")
print(result)

# 质量评估
result = quality("图片路径")

# OCR文字识别
result = ocr("图片路径")

# 对比多张图
result = compare("图1路径", "图2路径")
```

## 命令行方式

```bash
cd D:\AI游戏\搭建废土战歌文字游戏\vision-tool

python vision_tool.py "图片路径"                # 描述图片
python vision_tool.py "图片路径" --quality       # 质量评估
python vision_tool.py "图片路径" --ocr           # OCR文字识别
python vision_tool.py "图1" "图2" --compare      # 对比
python vision_tool.py --setup                   # 配置Key（仅首次）
```

## 注意事项

- 模型 `glm-4v-flash` 完全免费，无需担心费用
- API Key 已配置好，开箱即用
- 支持 jpg/png/jpeg 格式
- 单次分析约 2-5 秒
