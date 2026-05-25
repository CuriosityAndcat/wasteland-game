"""
废土战歌 · 头像视觉分析工具
============================
使用 智谱AI GLM-4V-Flash（完全免费）分析生成的头像图片。
支持：角色识别、风格分析、质量评估、一致性检查

用法:
  python vision_analyzer.py                              # 分析全部头像
  python vision_analyzer.py hunter_v4                    # 分析指定头像
  python vision_analyzer.py --compare                    # 对比风格一致性
  python vision_analyzer.py --setup                      # 配置API Key

注册: https://open.bigmodel.cn/
"""

import os, sys, json, base64
from pathlib import Path

PORTRAITS_DIR = Path(__file__).parent / "public" / "portraits"
CONFIG_FILE = Path(__file__).parent / ".vision_config.json"
API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

ROLE_MAP = {
    "hunter_v4": "猎人(主角)-17岁废土猎人,皮夹克红围巾",
    "mechanic_v4": "小武(机械师)-16岁,护目镜工具腰带",
    "female_warrior_v4": "阿雅(格斗家)-18岁,马尾战斗绷带",
    "red_wolf_v4": "红狼(神秘猎人)-28岁,银发红眼眼罩",
    "father_v4": "父亲-45岁严厉废土生存者",
    "system": "系统AI-全息数字界面",
}
BOSS_MAP = {
    "boss0":"狂犬首领","boss1":"深渊巨兽","boss2":"暗影潜伏者",
    "boss3":"钢铁巨兽","boss4":"瓦鲁","boss6":"铁血将军",
    "boss7":"巨象","boss8":"百足巨虫","boss9":"黑风",
    "boss10":"暗影首领","boss11":"审判者AI",
}
ENEMY_MAP = {"e1":"巨蚁","e3":"杀人虫","e4":"仿生蜗牛","e5":"蜈蚣",
             "e6":"蝎子","e7":"战斗机器人","e8":"变异鼠","e9":"强化兵","e10":"铁甲兵"}

def get_api_key():
    key = os.environ.get("ZHIPU_API_KEY")
    if key: return key
    if CONFIG_FILE.exists():
        return json.loads(CONFIG_FILE.read_text()).get("api_key", "")
    return ""

def setup():
    print("="*50)
    print("  🔑 配置 智谱AI API Key（完全免费）")
    print("="*50)
    print("\n  1. 访问 https://open.bigmodel.cn/")
    print("  2. 注册/登录 → API密钥 → 新建Key")
    print()
    key = input("请输入 API Key: ").strip()
    if key:
        CONFIG_FILE.write_text(json.dumps({"api_key": key}, indent=2))
        os.environ["ZHIPU_API_KEY"] = key
        print("✅ 配置完成！")
    else:
        print("❌ 取消")

def cat_name(fn):
    n = Path(fn).stem
    if n in ROLE_MAP: return "角色", n
    if n in BOSS_MAP: return "BOSS", n
    if n in ENEMY_MAP: return "敌人", n
    return "其他", n

def analyze_img(path, prompt):
    import requests
    key = get_api_key()
    if not key: return "❌ 未配置API Key"

    b64 = base64.b64encode(path.read_bytes()).decode()

    resp = requests.post(API_URL,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": "glm-4v-flash",
            "messages": [{"role": "user", "content": [
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                {"type": "text", "text": prompt}
            ]}],
        },
        timeout=60
    )

    if resp.status_code == 200:
        return resp.json()["choices"][0]["message"]["content"]
    return f"❌ 错误({resp.status_code}): {resp.text[:200]}"

def describe_image(path):
    c, n = cat_name(path)
    desc = ROLE_MAP.get(n, BOSS_MAP.get(n, ENEMY_MAP.get(n, "")))
    p = f"""请从以下维度分析这张{c}图片（中文回答）：

1.【主体】这是什么？{f'（预期：{desc}）' if desc else ''}
2.【外观】服装、颜色、装备细节
3.【画风】画风类型、光影、氛围
4.【质量】清晰度、细节丰富度、有无问题
5.【建议】优化建议

每点1-2句话。"""
    return analyze_img(path, p)

def quality_check(path):
    p = """请严格评价这张游戏头像图片的质量：
1.【清晰度】是否清晰？有无模糊、锯齿？
2.【主体】五官是否正常？手指有无变形？
3.【缺陷】噪点、压缩痕迹、水印？
4.【评分】整体1-10分
5.【结论】建议重制 / 可以接受 / 质量优秀"""
    return analyze_img(path, p)

def check_consistency(paths):
    import requests
    key = get_api_key()
    content = [{"type": "text", "text": """请分析以下多张游戏角色头像的风格一致性：
1.【画风统一性】是否一致？
2.【色彩协调性】色调是否统一？
3.【光影一致】光源方向是否一致？
4.【细节层次】精细度是否在同一水平？
5.【总体评分】满分10分"""}]
    for path in paths:
        b64 = base64.b64encode(path.read_bytes()).decode()
        content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}})

    resp = requests.post(API_URL,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={"model": "glm-4v-flash", "messages": [{"role": "user", "content": content}]},
        timeout=120
    )
    if resp.status_code == 200:
        return resp.json()["choices"][0]["message"]["content"]
    return f"❌ 错误({resp.status_code}): {resp.text[:200]}"

def main():
    if "--setup" in sys.argv:
        setup()
        return

    if not PORTRAITS_DIR.exists():
        print(f"❌ 目录不存在: {PORTRAITS_DIR}")
        return

    all_imgs = sorted(PORTRAITS_DIR.glob("*.jpg")) + sorted(PORTRAITS_DIR.glob("*.png"))
    if not all_imgs:
        print("❌ 未找到文件")
        return

    if not get_api_key():
        print("运行 python vision_analyzer.py --setup 配置Key")
        return

    if "--compare" in sys.argv:
        imgs = [p for p in all_imgs if any(p.stem.startswith(r) for r in ["hunter","mechanic","female","red_wolf","father"])]
        if not imgs:
            print("❌ 未找到角色头像")
            return
        print(f"分析 {len(imgs)} 张角色头像风格一致性...")
        print("="*50)
        print(check_consistency(imgs))
        return

    target = next((a for a in sys.argv[1:] if not a.startswith("--")), None)
    if target:
        matched = [p for p in all_imgs if target in p.stem]
        if not matched:
            print(f"❌ 未找到 '{target}'")
            return
        img = matched[0]
        c, n = cat_name(img)
        print(f"{'='*50}")
        print(f"  🔍 {img.stem} ({c})")
        print(f"{'='*50}")
        print(describe_image(img))
        if "--no-quality" not in sys.argv:
            print(f"\n{'='*50}\n  📊 质量评估\n{'='*50}")
            print(quality_check(img))
    else:
        print(f"共 {len(all_imgs)} 个头像\n")
        for img in all_imgs:
            c, n = cat_name(img)
            print(f"{'─'*40}\n  📷 {img.stem} ({c})")
            try:
                r = describe_image(img)
                print(r[:200] + ("..." if len(r)>200 else ""))
            except Exception as e:
                print(f"  ❌ {e}")

if __name__ == "__main__":
    main()
