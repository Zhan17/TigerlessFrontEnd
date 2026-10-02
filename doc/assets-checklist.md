# 素材与输入清单

更新：2026-10-01。这份清单列出开发要用到的全部素材和输入：哪些已经有了、哪些缺、放在哪里、用什么格式导出。用户对照它准备素材，可以手动导出，也可以交给其他 agent。

本次交接状态（Codex 收集后）：

- **已拿到**：原有素材，以及 I02、I03、I05、I06、I07a、I08、I09、I10、I11 共 9 张原始图片；文件名和尺寸见第 4.1 节。T1 标题已确认。
- **✅ 素材已齐（2026-10-01）**：用户导出了 L1，文件是 `design-ref\assets\logo\Vector.svg`，复制了一份命名为 `L1-apsu-logo.svg`。尺寸 87×32，4 个路径（A、p、s、u），颜色 `#102B1C`。已在浏览器里渲染，和设计稿导航中的字标对比一致。L2、L3、L4 都用 L1 在代码里实现：L2 换色，L3 加渐变遮罩，L4 调成半透明。
- **已由 Claude Code 解决（2026-10-01）**：
  - **C01–C10 图标**：从公开图标库 Hugeicons（MIT）和 Unicons（Apache-2.0）通过 Iconify 下载，与设计截图逐个比对；C01 和 C09 是手写的简单 SVG。见第 5.3 节。
  - **I07a**：卡片 1 本身是白底，白底原图可以直接用，在代码里裁切即可，**不需要再导出**。原图的手机部分大约只有 270px 宽，显示宽度约 310px，会稍微放大。Figma 的 2x 导出也来自同一张源图，重新导出不会更清晰。
  - **I07b 聊天浮层**：改用代码实现，作为装饰组件并设置 `aria-hidden`。文案都已知：Dr. Helena Fox / Online / Today / 两条消息 / 10:00 AM；头像从 I07a 里裁出医生的脸。**不需要导出。**
- 其他 8 张图片是原始填充图，不是按图层裁切后的导出，开发时对照设计稿在代码里裁切和定位。
- **另需撰写**：T2 的 FAQ 第 2–4 条答案在设计中不存在，由开发 agent 起草后交用户审核。

## 1. Figma 额度

- 用户的 Figma 账号在所有团队里都是 **Starter 计划 + View 席位**。按 [Figma 官方文档](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/)，Figma MCP 的读取类工具**每月最多 20 次，按月重置**。2026-10-01 这一轮已经用完；具体恢复日期未确认，不要把预计日期当作承诺。
- 不受限制的方式：**在 Figma 里手动导出**。这个副本在用户自己的账号下，导出图层没有次数限制。下面的清单就是按手动导出写的。
- 如果额度恢复后还想用 MCP，优先补读第 6 节列的结构化节点。
- 本轮用户已登录 Codex 内置浏览器，副本可读取；登录并未解除 MCP 额度限制。Codex 从页面已加载的图片资源取得了 9 张原图并校验文件；浏览器内的 SVG/PNG 导出下载未成功，复制 SVG 的结果为空。因此第 5 节剩余项需要手动导出，或由有可用导出能力的 agent 接手。

## 2. 放到哪里（统一路径）

原始素材放在**仓库外**，开发时由我压缩、改名后再复制进项目的 `public/`。这样未压缩的大文件不会进入 git 历史。

```
F:\AI\TigerlessTask\design-ref\
├─ assets\
│  ├─ images\     ← 位图（人物、产品、照片）
│  ├─ icons\      ← 图标 SVG
│  └─ logo\       ← Apsu 字标 SVG
├─ screens\       ← 补充截图（比如第 4 张轮播卡片）
├─ desktop-1440-full.png  等（已有）
└─ figma-layer-tree.txt   （已有）
```

文件名建议用下表的 ID 开头，例如 `I05-birth-control-woman.png`。名字不必完全一致，**保留 ID 前缀**我就能对上。

## 3. 怎么导出

1. 打开链接：`https://www.figma.com/design/0WMyYj8ycFQlykicaNToc1/?node-id=1-537`，把 `node-id` 换成表里的节点号，`:` 写成 `-`。也可以在左侧图层面板里按名称搜索。
2. 选中图层 → 右侧面板最下方 **Export** → 点 `+`。
3. 格式：
   - **抠图**（人物、药瓶、注射笔、手机）：PNG **2x**，保留透明背景。
   - **整张照片**：PNG 2x 或 JPG 2x。
   - **图标、字标**：SVG。
4. 如果图片是某个 frame 的**填充背景**，而 frame 里还有文字或按钮，直接导出会把文字也带上。这种情况先 `Ctrl+D` 复制这个 frame，删掉里面的子图层，再导出副本。

## 4. 已经有的

| 类别 | 内容 | 位置 |
| --- | --- | --- |
| 需求 | 作业 PDF 全文 | `F:\AI\TigerlessTask\Front-End Take-Home Assignment (1).pdf` |
| 截图 | 桌面整页、移动整页、画板外的移动减重区块和 BMI、移动菜单（都是 1x 原尺寸） | `design-ref\*.png` |
| 结构 | 整页图层树（节点号、尺寸） | `design-ref\figma-layer-tree.txt` |
| tokens | 全部颜色、字体样式、阴影变量 | 已整理进 [design.md](design.md) 第 1 节 |
| 结构化代码 | Hero（徽章、标题、语言胶囊、分类卡片）、BMI 计算器、FAQ（含第 5 个问题）、轮播标题 | 已整理进 design.md |
| 文案 | 原有可见文字已写进 design.md；T1 第 4 张轮播卡片标题现已确认是 **Free Expedited Shipping** | T1 从 `1:788` → Header → 文字图层读取；本次只更新本清单，尚未同步进 design.md，也未补整张卡片截图。标题已满足原清单的文字替代方案，不再阻塞素材交接 |
| 字体 | Work Sans | 不用下载，代码里通过 `next/font/google` 加载 |
| **图片** | `hero-category-vial.png`（Hero 药瓶，4096²，透明）、`bmi-background.png`（BMI 背景，4096×2733）、`bmi-ring-dashed.png`（BMI 虚线圆环） | `design-ref\assets\images\` |
| **图标** | truck、stethoscope、globe-earth；arrow-right-circle 三种（主按钮 40、次按钮 32、文字链接 24）；轮播左右箭头 48；sort；单选按钮选中 / 未选中；BMI 进度环；FAQ 展开 / 收起箭头 | `design-ref\assets\icons\` |

### 4.1 本轮新增的 9 张原始图片

以下文件都在 `F:\AI\TigerlessTask\design-ref\assets\images\`，已下载并通过图片文件完整性校验。**“original” 表示原始填充图片，不是 Figma 图层的 2x 导出**；原图中的留白、裁切、比例可能与画板显示不同，需在实现时对照设计。

| ID | 内容 / 节点 | 已保存文件 | 原始尺寸 | 背景与后续注意 |
| --- | --- | --- | --- | --- |
| I02 | 橙色背心人物，`1:537` | `I02-weight-loss-woman-original.png` | 1185×1327 | PNG，含透明区域；原图已齐 |
| I03 | 倾斜药瓶，`1:540` / `1:549` | `I03-product-vial-original.png` | 4096×4096 | PNG，含透明区域；与现有 Hero 图片的解码像素不同，不要直接认定为同一张图旋转后的效果 |
| I05 | 绿毛衣站姿人物，`1:671` | `I05-birth-control-woman-original.png` | 1457×2697 | PNG，含透明区域；原图已齐 |
| I06 | 盘腿闭眼人物，`1:673` | `I06-sleep-woman-original.png` | 1901×2429 | PNG，含透明区域；上方两张浮层卡片仍由代码实现，不需导出 |
| I07a | 手机样机，`1:736` | `I07a-phone-mockup-original.png` | 1109×832 | RGB 白底原图，**非透明裁切版**；第 5.2 节仍保留补导出项 |
| I08 | 医护照片，`1:781` | `I08-clinicians-original.jpg` | 4096×2304 | JPG；原图已齐，卡片裁切由实现处理 |
| I09 | Wegovy 注射笔，`1:787` | `I09-wegovy-pens-original.png` | 628×406 | PNG，含透明区域；取自可见的去背景填充图，未取隐藏的背景版本；未放大成 2x |
| I10 | 戴口罩配送人物，`1:788` | `I10-delivery-original.jpg` | 2731×4096 | JPG，纯照片，不含卡片标题；原图已齐 |
| I11 | 成功故事中间卡片人物，`1:825` | `I11-success-story-original.png` | 4096×2731 | PNG，含透明区域；原图已齐，卡片叠层效果由实现处理 |

交接时先检查以上本地文件，不要重新下载已齐原图。它们和参考截图均在仓库外，**仅交接 GitHub 仓库不会携带这些文件**，跨机器接手时需另行传递 `design-ref`。本轮未改其他项目文件、未提交 Git，下载地址清单和临时缩略图已清理。

## 5. 还缺的（请准备）

### 5.1 字标（SVG）

**只需要 L1**。导航字标和页脚字标看起来是同一个形状，L2、L3、L4 都可以用 L1 在代码里实现：L2 换色，L3 加渐变遮罩，L4 调成半透明。
导出 L1 的两种方法：
- 选中图层 `1:308`，在 Export 里选 SVG，点导出
- 右键 → Copy/Paste as → **Copy as SVG**，粘贴到记事本，另存为 `L1-apsu-logo.svg`

放到 `design-ref\assets\logo\`。
备用方案：如果实在导不出，我从截图里页脚 1440px 宽的大字标描摹成矢量，但精度会差一些。

| ID | 内容 | 节点 | 备注 |
| --- | --- | --- | --- |
| L1 | Apsu 字标，深色，导航用 | `1:308`（桌面导航里的 Vector） | 必须 |
| L2 | Apsu 字标，浅色，页脚大字标 | 在 `1:883` Footer (Desktop) 里，左上角 | 如果和 L1 是同一个形状只是换色，可以不导出，告诉我即可 |
| L3 | 页脚底部巨大的渐变 “Apsu” | 在 `1:883` 底部 | 导出 SVG；导不出就 PNG 2x |
| L4 | CTA 背后的 “Apsu” 水印 | 移动版 `1:1405`；桌面版在 `1:883` 的 CTA 里 | 有 L1 的话我可以用代码画出来，**可选** |

### 5.2 位图：仅剩缺失 / 待补完整项

| ID | 内容 | 节点 | 格式 | 必要性 |
| --- | --- | --- | --- | --- |
| I07a | 轮播卡片 1：手机样机 | `1:736`（Mockup 4） | — | **已解决**：卡片是白底，白底原图直接用，在代码里裁切 |
| I07b | 轮播卡片 1：聊天浮层 | `1:737`（Chat/voice-message） | — | **已解决**：改为代码实现的装饰组件。如果用户另外导出了 3x PNG，也可以替换使用 |

### 5.3 图标（SVG）

**已全部解决（2026-10-01，Claude Code）**。文件在 `design-ref\assets\icons\`，与设计截图逐个比对过。圆形底色和图标颜色在代码里用 CSS 控制，所以白色版（C07）不需要单独的文件。

| ID | 图标 | 文件 | 来源 / 比对结论 |
| --- | --- | --- | --- |
| C01 | check-circle | `C01-check-circle.svg` | 手写：实心圆 + 白色勾，和设计一致 |
| C02 | map-location | `C02-map-location.svg` | `hugeicons:maps-location-01`，折叠地图 + 定位针，匹配 |
| C03 | payment-success | `C03-payment-success.svg` | `hugeicons:payment-success-01`，名称完全一致 |
| C04 | customer-support | `C04-customer-support.svg` | `hugeicons:customer-support`，名称完全一致 |
| C05 | star | `C05-star.svg` | `uis:star`，实心星，颜色在代码里设置 |
| C06 / C07 | 评价卡片的 X / Instagram / LinkedIn | `C06-social-x.svg`、`C06-social-instagram.svg`、`C06-social-linkedin-solid.svg` | Hugeicons；X 和 Instagram 匹配。卡片上的 LinkedIn 是实心 “in”，选了 `linkedin-01`，**实现时再确认一次** |
| C08 | 页脚 X / Facebook / Instagram / LinkedIn | 复用 C06 的 X 和 Instagram，加上 `C08-social-facebook.svg`、`C08-social-linkedin-outline.svg` | Facebook 用 `hugeicons:facebook-02`（单独的 f），LinkedIn 用 `linkedin-02`（描边） |
| C09 | menu-right | `C09-menu-right.svg` | 手写：三条线，右对齐，最后一条较短 |
| C10 | times-circle | `C10-times-circle.svg` | `uil:times-circle`，名称完全一致 |

授权：Hugeicons 是 MIT，Unicons 是 Apache-2.0，都可以用在公开仓库里。README 需要注明图标来源。

### 5.4 仍待处理的文字和可选截图

| ID | 内容 | 怎么给 |
| --- | --- | --- |
| T2 | FAQ 第 2–4 条的答案 | **不是缺失素材，设计中没有答案**。开发 agent 按页面已有信息起草，交用户审核；也可由用户提供 |
| T3（可选） | 你在 Figma 里看到、但我截图里没看清的细节 | 截图放进 `screens\` |

T1 标题已完成，见第 4 节。第 4 张卡片完整截图尚未补充，如后续需要核对布局可再补，当前不要求重复提供标题。

## 6. 额度恢复后优先用 MCP 补读的节点（可选）

这些不是必须的，截图加 tokens 已经能实现。补读的作用是拿到精确的间距和结构，减少对着截图量尺寸的误差。按优先级：

1. `1:883` Footer (Desktop)，含 CTA
2. `1:732` 服务轮播卡片
3. `1:795` 成功故事卡片
4. `1:513` 和 `1:538` 减重区块和产品卡
5. `1:645` 和 `1:672` 避孕和睡眠区块
6. `1:305` 导航栏
7. `1:467` How it works
8. 移动版：`1:885`、`1:1246`、`1:1402`、`1:1077`

## 7. 不需要准备的

- 字体文件（用 Google Fonts）
- favicon（我用字标生成）
- 后端或 API 文档（作业要求我们自己设计）
- hover 等交互设计稿（设计里没有，由我们自己设计）
