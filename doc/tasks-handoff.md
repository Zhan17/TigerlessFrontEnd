# Tasks & Handoff

更新：2026-10-02（Codex 最终只读审查及问题交接；本次记录未实施修复）。这里是当前状态的唯一入口。交接时覆盖本页快照，历史由 Git 保存。

## Current status

- **阶段**：T03–T10 实现已完成；T11 收尾尚未关闭。Codex 最终审查发现 **R01–R05 共五项未解决问题**，另有 **R06 测试稳定性待核实项**，详见下方“2026-10-02 最终审查交接”。不能把此前构建 / 测试通过等同于本次最终验收全部通过。
- **当前执行边界**：用户要求本轮只审查、指出问题，随后授权详细记录到交接文档；本轮仅更新本文件，不修改应用、测试、配置或其他文档，不实施修复。后续 agent 应根据用户的新指令开展修复。
- **仓库**：本地 `F:\AI\TigerlessTask\Front-End Task`，分支 `main`，远程 `origin` = https://github.com/Zhan17/TigerlessFrontEnd （**私有**）。作者 `Zhan17 <h843836717@gmail.com>`，只对本仓库生效。
- **环境**：Node 24.19.0 / npm 11.17.0（2026-10-01 通过 winget 从 v19 升级），`.nvmrc` = 24。
- **决策**：需求和评分项见 [checklist.md](checklist.md)；设计审稿和交互结论见 [design.md](design.md) 的 4b 节；架构选型见 [architecture.md](architecture.md) 顶部的“决定汇总”和 [decisions.md](decisions.md) D06。
- **素材**：已齐，放在仓库外的 `F:\AI\TigerlessTask\design-ref\assets\`，清单见 [assets-checklist.md](assets-checklist.md)。
- **用户的工作规则（必须遵守）**：
  - 每个大任务、每个小任务都单独 commit
  - 不确定的地方停下来问，不要猜
  - 不擅自改 requirements、architecture、design 里已经定好的内容，要改先问
  - 禁止 `any`
  - 内容一律走数据层
  - 每个有状态组件，每个状态一个 story
  - 发现的小问题先记录在本页的 Known issues，以后统一优化

## Done

- **T01 审稿和讨论**：design.md 第 4b 节，包括修正 F01–F14、已发现但不修改的清单、交互方案，C1–C10 都有结论。C6（BMI 结果里怎么体现性别）写代码前再和用户确认。
- **T01b 素材**：全部到位（L1 字标由用户导出；图标来自 Hugeicons / Unicons）。
- **T02 架构选型**：全部确定（D06）。
- **T03 搭项目**，每个小任务一个 commit：
  1. `0b74c25` create-next-app 16.3.8：App Router、TS strict、`src/`、Tailwind v4、Biome
  2. `a57dc5f` Storybook 10.6（`@storybook/nextjs-vite`、addon-docs）；preview 引入 `globals.css`
  3. `55b01be` 运行时依赖：zod、cva、tailwind-merge、motion、Radix Accordion / Dialog，开发依赖 @svgr/cli；`src/lib/cn.ts`
  4. `5dd12a0` Vitest 5 + Testing Library + jsdom；`cn` 的单元测试
  5. `5c0ec35` Playwright：320–1920 逐个宽度的横向溢出检查（`e2e/responsive.spec.ts`）。已用故意制造的溢出验证过，能抓到问题
  6. `38ce828` Biome：`noExplicitAny` 设为 error
  7. `7f3a672` 去掉 Next 的示例页，换成 Work Sans 字体和占位页

- **T04 Design tokens**，每个小任务一个 commit：
  1. `a164394` 颜色：原始色板（Figma 变量 + 截图取色）、语义别名、去掉 Tailwind 默认色板；分类主题用 `data-theme`（`bg-theme-surface` / `border-theme-divider`，不认识的分类回退到默认）
  2. `81d35a3` 流式字号：按用途命名（display、section、card-title …），375 / 1440 两个画板上精确等于设计值，已在 320 / 375 / 768 / 1440 / 1920 实测
  3. `442a84c` 布局（`max-w-shell` 1384、`max-w-content` 1320、流式 `px-gutter` 20→60、`mx-shell-inset` 12→28）、圆角、阴影、动效（`ease-out-expo` 等，时长变量）、统一的 focus 样式、减少动态效果的兜底
  4. `bf77454` `@theme static`（所有 token 都输出为 CSS 变量）；Work Sans 移到 `src/app/fonts.ts`，Storybook 也用同一个字体
  5. `9259e77` Storybook `Foundations/Tokens`：颜色、字号、圆角 / 阴影、分类主题；数值从 CSS 变量实时读取，不会和样式表不一致

- **T05 图标**：
  1. `86af2cb` 21 个规范化后的 SVG 源文件放在 `src/components/icons/svg/`：颜色改为 `currentColor`；两色图标里面的部分用 `var(--icon-contrast, #fff)`；形状相同的合并（左右箭头、24 / 48 描边箭头、32 / 40 实心箭头、展开 / 收起箭头）。来源和授权写在 `SOURCES.md`
  2. `ec7352b` 运行 `npm run icons`（SVGR 命令行）会清空并重新生成 `src/components/icons/generated/*.tsx`，再用 Biome 格式化；生成的图标默认 1em 大小、`aria-hidden`；从 `@/components/icons` 导入，名字是 `XxxIcon`。重复运行，输出不变
  3. `8f7e69e` 修复 T04 的命名冲突：颜色别名 `body` 改名为 `copy`。原来 `text-body` 只会生成颜色，字号用不了；已检查其他所有 token 名，没有冲突
  4. `9e4ad9f` Storybook `Foundations/Icons`：全部图标（大小和颜色可以调）、两色箭头在主按钮 / 次按钮上的两种配色、镜像方向

  **用法约定**：
  - 图标颜色跟随文字颜色（`text-*`）
  - 两色图标里面的部分用 `[--icon-contrast:var(--color-...)]` 或 `style` 设置
  - 左箭头用 `rotate-180`，收起的箭头用 `-scale-y-100`
  - 图标本身是装饰性的，无障碍名称写在父级按钮或链接上

- **T06 基础组件**（`src/components/ui/<组件>/`：组件、story、测试放在同一个文件夹）。用户在 T06 做的决定：
  - 用 `storybook-addon-pseudo-states` 为 hover / focus / 按下各做一个 story，所以这些交互状态要用 CSS 实现，不用 Motion 的 whileHover
  - **禁用态只有两处**：轮播箭头滑到两端时、BMI 输入无效时的 “Calculate BMI”；其他按钮都没有禁用态（design.md 未改动，以这里为准）

  | 提交 | 内容 |
  | --- | --- |
  | `0b15b9b` | pseudo-states 插件 |
  | `83be438` | tailwind-merge 认识自定义 token（原来会把 `text-button` 当成颜色删掉） |
  | `3d4d84f` | **Button**：primary / secondary / outline，lg 56 / md 48，可选两色箭头，全宽；hover = 放大到 1.03 + 色调变化 + 箭头右移；按下 = 缩小到 0.97；禁用 = 40% 透明度 |
  | `e1c6ffc` | **IconButton / IconLink**：outline（轮播 48）、solid / inverse / footer（社交 36）、plain（菜单 32）；必须传 `label`；hover 放大到 1.08，按下缩小到 0.94 |
  | `d2ec2a2` | `formatMoney`（用 Intl 把最小货币单位格式化）、`ui-copy.ts` 前端字典、价格 token（项目 32 / 52，产品 24 / 40，两个画板相同） |
  | `e792dd1` | **Eyebrow、CheckList、Price、Rating**（静态组件，每个变体一个 story） |
  | `891fd10` | **Pill**：语言胶囊，切换按钮（`aria-pressed`），高度 32→44、左右内边距 16→32；选中 = 浅绿色 |
  | `3c78ced` | **SocialLinks**：组合 IconLink，有卡片 / 照片 / 页脚三种外观 |

  - 共有 25 个单元测试；Storybook 每个有状态组件、每个状态一个 story
  - 所有尺寸和状态都在 Storybook 里实测过，读取前先让过渡动画结束（`getAnimations().finish()`）

- **T07 数据层**（`src/content/`）。用户决定：
  - 接口按资源分可以，**同一内容不要出现两次**
  - 信任条目放在 `content/home`
  - 睡眠区块的两张浮层卡片放进数据，作为 sleep program 可选的 `highlights`

  | 提交 | 内容 |
  | --- | --- |
  | `f6d14f6` | **Zod schema（API 契约）**：`/content/home`、`/programs`、`/products`、`/languages`、`/services`、`/testimonials`、`/faqs`。导航、页脚、评价都用 id 引用 program（名称取自 program）；共用的按钮文案只在 `home.ctas` 里定义一次，按 key 引用；首页用 id 列表决定放哪些内容、什么顺序；对象会忽略未知字段，开放集合（分类、图标 key）保留为 string，前端兜底 |
  | `1e346df` | 12 张 WebP 图片放在 `public/images`（约为显示尺寸的 2 倍，共 1.1 MB），加一张从手机样机裁出的医生头像。来源见 `public/images/SOURCES.md` |
  | `a0cf140` | **mock 数据**：内容来自设计稿，已应用修正 F01–F07、F11；FAQ 第 2–4 条答案是起草的（F10，**等用户审核**）。测试检查：每个资源都通过 schema 校验、所有引用都能解析、所有图片文件都存在 |
  | `1ec2bf5` | **数据访问层**：`createContentClient`，用 `DATA_SOURCE=mock\|api` 切换；首页内容是必需的，其他资源失败时只把对应区块置空，并记录在 `degraded` 里；`pickByIds` 保持顺序并跳过不存在的引用；环境变量用 Zod 校验；有 `.env.example`。api 分支用模拟的 fetch 测过，**没有对接过真实后端** |

  - 共 45 个单元测试
  - **映射层**（API 类型 → 组件 props）按决定 2.4 要做，放到 T08 每个区块各自的 feature 文件夹里一起写

## In Progress

- **T08 逐个区块实现**（合并了原来的 T09 有状态组件）。用户 2026-10-01 的决定：
  - 一个区块一个区块做；每个区块一次完成桌面 + 移动、交互、story、和 375 / 1440 对照、320–1920 检查，单独 commit
  - **按组推送**：①导航 + Hero ②中间区块（信任条、How it works、减重 + 产品）③BMI ④避孕 / 睡眠 + 轮播 + 评价 ⑤FAQ + CTA + 页脚
  - **K16 选 A**：语言胶囊可以多选，默认选中 中文 和 Português（和设计一致）
  - **第 ① 组（导航 + Hero）已完成并推送**：
    - `ea6f9e7` ButtonLink（按钮样式改用 `not-disabled:`，在 `<a>` 上也生效）
    - `351636e` 共享工具：hrefFor、iconFor、CtaButton、TextAction、RichText
    - `c99c2fb` LogoIcon
    - `7ed06ae` 导航：吸顶、滚动后加深阴影、70rem 断点、当前区块高亮（scroll-spy），移动菜单用 Radix Dialog + Motion 圆形展开
    - `24904b8` 字体增加 vietnamese 子集
    - `eaab53d` RichText 普通文字改为文本节点（修复无障碍名称丢空格）
    - `b97070e` 契约新增 `hero.highlightedLanguages`
    - `3529a46` Hero：外壳、徽章、标题、跑马灯、分类卡片
    - `2ebe907` 跑马灯、菜单、吸顶导航的 e2e 测试
  - 验证：
    - 和 375 / 1440 画板逐块对照过（导航、菜单、Hero）
    - 768 / 1024 / 1280 / 1920 检查过；分类卡片在 xl 以下堆叠，xl 以上三列
    - 65 个单元测试、10 个 e2e 测试全部通过
  - README 的偏差日志和自设计状态已写入第 ① 组的内容
  - **第 ② 组（信任条、How it works、减重 + 产品卡）已完成并推送**：
    - `274fd62` Button 增加 responsive 尺寸和 belowLg 全宽；高度改成 min-h，全宽按钮的长文案可以换行（修复 320px 溢出）
    - `b777f75` tokens（区块节奏、信任条、步骤卡片、功能卡片……）+ token 撞名检查的单元测试
    - `74059c7` 信任条（CSS 跑马灯，悬停暂停）
    - `071e9b1` How it works（F12 标题对齐，标题用 balance 断行）
    - `633c547` 项目区块 ProgramSection + 产品卡（F03、F09）
    - `6d446db` 溢出检查只报告没有被裁切的元素
  - 验证：
    - 1440 / 375 对照过信任条、How it works、减重区块和产品卡
    - 产品价格按文本宽度重新量过，改为 32px
    - 74 个单元测试、10 个 e2e 测试全部通过（320–1920 无溢出）
  - **注意**：避孕 / 睡眠区块已经用通用布局渲染，但睡眠的图片在左、浮层卡片、价格区细节等到第 ④ 组完善
  - **第 ③ 组 BMI 已完成并推送**。用户 2026-10-02 的决定：
    - **C6**：结果文案里带上性别（例如 “As a woman, your BMI is 24.2 — Healthy weight”）
      - 文档里要注明：成人 BMI 的公式和分档对男女相同，所以性别不影响数值
      - 备选方案是“结果下加一行提示（Adult BMI ranges are the same for women and men）”
      - 现在是为了遵循 UI 设计才这样做，以后可以根据实际情况修改
    - **单位切换**：已输入的数值自动换算（ft/in/lbs ↔ cm/kg），已有结果在新单位下重新计算
    - 禁用态：输入无效时 “Calculate BMI” 禁用（T06 已定）；初始为空状态（C9）
    - 提交：
      - `1dac0f5` BMI 纯函数 + 18 个测试
      - `c7c2794` SegmentedControl / NumberField / RadioPill
      - `b721537` 契约新增 `eligibility.programId`
      - `db75546` 分段控件文字不换行
      - `781ec6d` BMI 计算器
      - `9b31259` BMI e2e 测试（marquee 测试改为按无障碍名称定位）
    - 验证：
      - 1440 / 375 对照过初始状态和结果状态
      - 101 个单元测试、14 个 e2e 测试全部通过
    - README 已写入 F08、F09、禁用态、结果句子的偏差，以及性别字段的说明（C6 / K21）
  - **第 ④ 组（避孕 / 睡眠完善、服务轮播、成功案例）已完成并推送**：
    - `0b1ffaf` 修正 `--spacing-program-gap`（1440 时是 72，应为 80）；新增测试：每个流式 clamp() 在 375 等于最小值、在 1440 等于最大值
    - `4681b2f` 移动端全宽带箭头按钮的内边距收紧（和移动画板一致，“Start your birth control consult” 在 375 不换行）
    - `fbac034` 项目区块按分类布局（前端表现层）：卡片最小高度、文案列宽、照片中心 / 高度（按 1440 量）、照片最大宽度（1024–1440 照片原地缩小，不盖住文案）；移动端照片最高 416；睡眠浮层卡片 HighlightCards（指标卡用 dl、进度卡用 progressbar，320 时缩小换行）；标题在 lg 以下用 balance 断行
    - `c826547` 图标 call、video、chevron-left（Hugeicons，经 Iconify）
    - `e5bb7dc` 手机样机图裁成手机本体（原图 1109×832，手机只有约 265px 宽）
    - `c31489a` 服务轮播：原生横向滚动 + scroll-snap（触摸、触控板、键盘不依赖 JS）；箭头用 Motion 按 ease-out-expo 滑动一张卡（滑动时暂停 snap），减少动态效果时直接跳；两端禁用；滑动中手势接管；卡片按 media 类型（照片 / 产品 / 聊天），聊天面板用代码根据数据绘制；APG 轮播语义
    - `37ca609` 成功案例：白色外壳、引用卡（分类取 program 名称、星级、作者 + 社交链接）、照片卡（薄荷底 + 深绿渐变）
  - 验证：
    - 1440 / 375 对照过避孕、睡眠（含浮层卡片）、轮播、成功案例；320 / 768 / 1024 / 1280 检查过
    - 112 个单元测试、18 个 e2e 测试全部通过；build-storybook 通过，新增的 27 个 story 逐个打开无报错
  - README 已写入第 ④ 组的偏差（避孕移动端显示简介、进度条按百分比填充、1024–1440 照片缩小、F05、照片卡标题遮罩、箭头禁用、F07）、“已注意未修改”（聊天面板小字、手机图分辨率、David L. 配女性照片）和交互状态
  - **第 ⑤ 组（FAQ、结尾 CTA、页脚）已完成并推送**：
    - `7cac918` K24 改为“潜在问题，只记录”（用户 2026-10-02）
    - `355e7a9` 修正：轮播和成功案例的标题颜色按设计取色改为 brand-900（`text-heading`）
    - `5e273f0` tokens：FAQ 内边距、accordion 动画关键帧、CTA 字号和渐变色、页脚字号 / 边距 / 巨型字标宽度、`max-w-footer`（1376）
    - `c354b06` FAQ：Radix Accordion，可同时展开多条，默认展开第一条；高度动画在 hydration 后才启用（否则页面加载时展开的答案会先收起再弹开）；标题用 em 宽度保证在任何尺寸都断成 “Frequently / Asked Questions”
    - `5857520` 结尾 CTA + 页脚：CTA 卡片渐变 + 半透明字标，平板用居中紧凑布局；页脚分隔线和右侧边缘对齐（F13）、F02、F11；巨型字标被页面底部裁切并渐隐
  - 验证：
    - 1440 / 375 对照过 FAQ、CTA、页脚；1440 整页高度 10155，和设计稿完全一致；移动端页脚区域高度 2216，也一致
    - 320 / 768 / 1024 / 1920 检查过（768 的 CTA 改为紧凑布局；1024 页脚列可以收窄，长链接左对齐换行）
    - 120 个单元测试、21 个 e2e 测试全部通过；build-storybook 通过，156 个 story 逐个打开无报错
  - README 已写入第 ⑤ 组的偏差（F10、FAQ 默认展开 / 多开、F11、平板 CTA、F02、F13）、“已注意未修改”（移动端没有 FAQs 眉标、页脚大部分链接还没有目标地址）和交互状态
  - **T10 / T11 进度**（用户 2026-10-02：K17 先上线并标注 “(Test answer.)”，K18 保持现状，其余可以）：
    - `3bd7814` K17：起草的 FAQ 答案末尾加 “(Test answer.)”
    - `c817a14` T10 无障碍：e2e 加 axe 扫描（375 / 1440，WCAG 2.x A/AA，只允许已记录的两处对比度例外）和整页 Tab 遍历（每一站都有焦点环、并滚动到视口内）；修复轮播列表语义（slide 的 group 放进真正的 li 里）和滚动区域的键盘焦点；新增开发依赖 `@axe-core/playwright`
    - T10 动效核对：design.md 4b 交互表逐项都已实现；开启“减少动态效果”时整页没有运行中的动画，跑马灯静止
    - `bdc19e0` favicon：用字标的 “A” 做的 SVG 图标（K3 已解决）
    - `f5f456d` README：当前状态、阅读指引（先看 `src/content/schemas`）、修复被空行拆开的结构表、AI 使用说明
    - `5e3c5d9` 干净 clone 发现 `npm run typecheck` 找不到 Next 生成的 `LayoutProps`，脚本改为先 `next typegen`
    - **干净 clone 验证**（scratchpad 里 `git clone` 后）：`npm install`、lint、typecheck、120 个单元测试、build、build-storybook、24 个 e2e 全部通过；`npm run dev`、`npm run storybook` 都返回 200
  - **T11 剩余：AI 日志**
    - `6e6351c` 用户 2026-10-02 要求先上传 Claude Code 日志：原样复制到 `ai-logs/claude-code/`（jsonl 约 70 MB + tool-results 文件夹，逐字节比对一致；上传前扫描过 token / 密钥模式，没有发现）。GitHub 提示超过 50 MB 的警告，但已正常推送。会话还在继续，提交前如果需要可以再刷新一次副本（文件不能超过 100 MB）
    - **Codex 日志由用户自己挑选真正在用的那个会话上传**（有几个是一开始测试 Figma 连接的会话）
  - **用户本地测试反馈（2026-10-02）**：
    - BMI 单位切换：在 Chrome 里 `<fieldset>` 不会把高度传给 flex 布局，导致选项只有文字高、药丸贴在顶部；layout 动画叠加整体 scaleX 还会冲出边框。改为 fieldset 里放固定高度的轨道 div，药丸用 CSS 按选中序号定位（服务端渲染也正确），前缘先走、后缘稍后跟上形成液体拉伸，加 Motion 纵向挤压；旧选项文字等药丸离开后再变深色
    - 导航栏 / 页脚 Logo：在首页点击时平滑滚回顶部并去掉 `#锚点`，不再重新加载（`HomeLink`）；e2e 已覆盖
    - BMI 单位切换（用户追加）：加“两滴液体接触”的融合效果：新选项靠近药丸的一侧先长出小水滴，SVG goo 滤镜（模糊 + 透明度阈值）画出从细到粗的颈部直到融合，再由药丸流过去；文字不在滤镜层里。已知小代价：水滴出现的约 0.3 秒里会盖住目标文字的第一个字母
    - 信任条跑马灯（用户反馈）：原来只有两份内容、平移 -50%，一份内容比屏幕窄时（1440 下一份 1360px，超宽屏更明显）循环末尾会露出空白、开头突然补位。现在每半边按带宽重复足够多份（测量 + ResizeObserver），时长按长度换算，各宽度速度都约 42px/s；375 / 1440 / 2560 / 3840 都验证过循环末尾无空白。Hero 语言跑马灯本来就按行宽测量副本，没有这个问题
    - Biome 忽略 `ai-logs/`（原始日志不能被格式化，上传日志后 lint 会检查到其中的 JSON）
    - Hero 语言气泡（用户反馈）：鼠标点击没有反应。原因是跑马灯的副本带 `inert`，而屏幕上大部分气泡是副本；改为副本只对读屏和键盘隐藏（`aria-hidden` + `tabIndex=-1`），鼠标和触屏可以点，点击任何一份都切换同一个语言；e2e 加了“鼠标点击屏幕上的副本”测试
    - Hero 语言气泡的取舍（用户要求记录，README “已注意未修改”已写）：选择功能和边缘加速都是为“真正选择语言”服务的；现在选择只有视觉效果（C1）。如果跑马灯只是装饰，两者可以一起去掉；如果以后要实际使用，选中状态可以直接接到网站语言切换、翻译或问诊语言偏好。**待向产品方确认：跑马灯的实际价值，以及是否要和语言切换 / 翻译功能打通**
    - BMI 液体切换节奏放慢一些（总长约 0.9 秒），让“细颈 → 融合”能被看清；文字变色时机和药丸前后缘同步
    - BMI 切换和悬停高亮冲突（用户反馈）：悬停的浅绿底色属于文字层，切换时淡出的底色盖在药丸和水滴上面（看起来半透明，水滴被遮住）。改为分层：悬停底色（z-0）< 液体层（z-10）< 文字（z-20）；按下缩放移到文字上，避免选项本身形成层叠上下文。顺带解决了水滴盖住首字母的问题
    - BMI 液体切换（用户反馈“有明显空隙”）：水滴改为贴着新选项靠近药丸的一侧生成，并加强 goo 滤镜，一出现就由细颈连着药丸，不再有空隙。之后试过“两个液团、哑铃形”的版本（`6e16819`），已恢复为水滴版（`50d8ef6`）。**两个版本的权衡（用户要求记录）**：
      - 水滴版（保留）：新选项一侧先长出水滴，由细颈连着药丸，再融合、流过去；“两滴液体接触、表面张力从细到融合”的感觉最明显
      - 整团液体版：一团液体整体流过去，中途拉成哑铃形再合拢；更连贯、更接近真实流体，但“两滴接触”的瞬间不明显
      - 用户评价两个都不错，个人更倾向水滴版，所以保留水滴版；以后想换只需恢复 `6e16819` 的组件文件
    - 手机菜单跳转不准（用户反馈：只有页面在顶部时准确）：根因是 `html` 上的 `scroll-padding-top: 6rem` 也作用于吸顶导航自己的按钮，聚焦菜单按钮（点击打开时、关闭后 Radix 把焦点还回来时）会让页面往上滚约 414px，打断了滚到目标区块的平滑滚动。改为只给 `main` 里带 id 的区块和页面 / 页脚里的可聚焦控件加 `scroll-margin-top: 6rem`；从任意位置跳转都停在导航下方 96px；e2e 加了回归测试
    - FAQ：用户确认当前“可以全部展开”的选择。记录理由：现在默认所有问题对用户都重要，方便来回查看；“展开一个时其他收起”的方案同样好，不选它不是因为它不好，而是按实际内容和需求选择（README 偏差表已写）
    - Claude Code：`C:/Users/h8438/.claude/projects/F--AI-TigerlessTask-Front-End-Task/49a5b82d-24c0-49f7-8a28-b0a36d54120b.jsonl`（约 70 MB，会话结束前还会变大）和同名文件夹（tool-results，约 0.4 MB）
    - Codex（cwd 为 `F:/AI/TigerlessTask` 的会话），在 `~/.codex/sessions/` 下：`2026/10/01/` 的 14-50-39（15 MB）、16-37-47、17-09-04；`2026/10/02/` 的 09-38-23、09-45-11（今天这两条要用户确认是否属于本项目）
    - 注意：GitHub 单文件上限 100 MB，超过 50 MB 会有警告

## Next

此前 T08–T10 的开发拆分和验证保留在上方历史记录。当前下一步以本次审查发现为准；以下顺序是建议，不是新增产品约束。

| 优先级 | 任务 | 完成条件 |
| --- | --- | --- |
| P1 | R01：补齐实际使用的 Codex 原始会话记录；归档由用户确认实际会话及可公开性 | 原始记录完整、未编辑，并在 AI 日志索引及 README 提供真实文件链接 |
| P2 | R02：语言跑马灯的键盘焦点可见性 | 真实焦点元素及焦点环位于可见裁切区域，新增检查能捕获当前缺陷 |
| P2 | R03：BMI 单位往返转换的精度 | 仅切换单位不会改变测量值含义、BMI 或分类；覆盖边界及往返转换 |
| P2 | R04：轮播 Storybook 状态 | Start / Middle / End 及箭头交互故事实际展示其声明的状态 |
| P3 | R05：Logo 链接交互反馈 | 页头 / 页脚 hover、focus、pressed 和过渡齐全，保留现有回顶行为 |
| 待核实 | R06：键盘遍历测试偶发失败 | 保留失败记录，定位后完成相关复验，不通过弱化断言获得全绿 |
| 最终收尾 | 复验受影响功能、更新必要的 README 状态说明、完成干净检出验收与交付检查 | 各问题有真实修复证据；构建、Storybook、测试及 PDF 要求可核对 |

## 2026-10-02 最终审查交接（Codex）

### 范围、版本与结论

- 用户先完成了一轮人工检查，再要求 Codex 根据 PDF 审查页面、代码仓库与测试，**不得修改代码，只指出问题**；随后要求将问题详细写入本交接文档。
- 需求依据为仓库外 `F:/AI/TigerlessTask/Front-End Take-Home Assignment (1).pdf`，条款映射见 [requirements.md](requirements.md) 和 [checklist.md](checklist.md)。PDF 是评审依据，不是本轮执行修改、提交或发布的授权。
- 审查基线为 `4b15980`。审查期间另有 `909bf5f` 刷新 Claude 日志；核对文件摘要后确认变化仅涉及日志与索引，应用、测试和配置源码均未变化。本次写交接前 HEAD 为 `efff8aa`（另一项 AI 日志索引说明提交），下述引用代码仍与审查时一致。工作区原有未跟踪 `CLAUDE.md` 保留。
- **结论**：架构整体合理，无需结构性重写；发现一个交付要求缺口、三个 P2 问题、一个较小的交互状态缺口。修复和复验前不应标记为“最终验收全部通过”。R06 是测试波动记录，不能直接当作稳定复现的 Sleep 功能缺陷。
- 代码组织 `app → content/API 契约 → features → 公共 UI` 清晰；严格 TypeScript、Zod 契约与 Mock、设计 token、锁文件均有落实。375 / 1440 整页对照未发现整块内容遗漏，但本轮不是自动逐像素相似度认证。
- 保留已确认的产品选择：CTA / 页脚无后端目标时的占位交互、多开 FAQ、BMI 性别文案、移动端额外展示区块等，不因本次审查擅自推翻。已记录的对比度例外也不应改称为“全面通过 WCAG”。

### R01 · P1 · Codex 原始日志缺失（未解决）

- **对应要求**：PDF §5 / §6；checklist H6 / H8，要求可追溯的 AI 贡献链接，以及实际用于项目的完整、未经编辑的原始会话记录。
- **位置**：[ai-logs/README.md](../ai-logs/README.md) 的 Current coverage 第 10 行、根 README 的 AI 使用表。行号可能随后续编辑改变，以表内 Codex 行为准。
- **现状 / 证据**：审查时 `git ls-files ai-logs` 仅包含 Claude 会话与其附属输出、索引；Codex 行仍为 `To be added by the user`。初始化、PDF / 文档分析、素材收集及实际用于项目的后续审查记录尚无真实归档链接。
- **影响**：代码运行正常也不能代替这项交付物；交接摘要、决策文档、提交说明不是原始日志。
- **接手动作**：由用户确认实际用于项目的 Codex 会话；按工具实际存储 / 导出格式原样保存，保持附属引用可追溯，再更新 AI 索引及 README 贡献链接。本文只记录缺口，没有复制或改写任何原始日志。
- **关闭条件**：所选会话覆盖真实项目贡献；内容完整且未经编辑；记录存在于交付仓库并有可用链接；推送前按现有规则由用户检查可公开性。`efff8aa` 对短暂 Claude fork 检查会话的排除说明是已记录的用户决定，本次不擅自改变该选择，也不把它当作 Codex 已归档的证据。

### R02 · P2 · Hero 语言跑马灯隐藏键盘焦点（未解决）

- **对应要求**：PDF §4D 的 focus 状态；checklist 的键盘操作与可见焦点要求。
- **位置**：[LanguageMarquee.tsx](../src/features/hero/LanguageMarquee.tsx) 第 307 行 `overflow-hidden`、313–315 行 `onFocus`；相关测试 [a11y.spec.ts](../e2e/a11y.spec.ts) 第 55、80 行附近。
- **复现**：在 1440 × 900 打开首页；使用键盘从 Hero 的主 CTA 按 Tab 进入语言胶囊，观察真实焦点所在元素与可见窗口，不能只看画面中的同名副本。
- **实际结果**：焦点进入真实 English 按钮，实测其横向范围约为 `24.95–146.64px`，裁切容器的可见范围约为 `172.4–1252.4px`，按钮完全位于左侧裁切区外。画面里的 English 是副本，不是当前真实焦点元素。获得焦点后动画暂停，因此不会自行移动回来。
- **原因**：可参与 Tab 的原始胶囊仍随轨道平移；副本通过 `aria-hidden` / `tabIndex=-1` 隐藏于键盘和读屏。`onFocus` 只暂停动画，没有将真实焦点带回可见区。当前测试仅检查上下边界和 outline 样式，无法发现水平方向被祖先裁切的问题。
- **影响**：键盘用户看不到正在操作的语言及焦点环；已有鼠标点击副本和触屏功能通过，不能证明键盘路径正常。
- **修复方向（建议）**：协调轨道位置与焦点，使真实可聚焦项进入可见区域；保持多选、默认选中语言、副本点击、触屏和减少动态效果行为。无需为修复擅自移除已有语言功能。
- **关闭条件**：375 / 1440 下逐项 Tab / Shift+Tab，真实焦点和焦点环均可见；运行中及暂停时均正常；补充能检查水平裁切及祖先可见区域的回归验证，并保留原有行为测试。
- **证据**：仓库外 `design-ref/review-2026-10-02/language-keyboard-focus.png`。

### R03 · P2 · BMI 单位切换丢失精度、改变结果（未解决）

- **对应要求**：PDF §4E 的状态正确性；已确认的 BMI 自动换算行为。用户此前决定“已有结果在新单位下重新计算”，这不等于授权丢失原始测量精度。
- **位置**：[bmi.ts](../src/features/bmi/bmi.ts) 第 116 行 `convertInput`，130–131 / 138 / 147 行的取整；[BmiCalculator.tsx](../src/features/bmi/BmiCalculator.tsx) 的 `changeUnit`。
- **复现**：切换到 cm/kg，输入身高 `177`、体重 `78.4`，点击 Calculate BMI；保持输入不变，切换 ft/in/lbs，再切回 cm/kg，等待结果动画结束。
- **实际结果**：初始结果句子为 **25.0 / Overweight**；切换英制后输入为 **5ft 10in / 173lb**，结果句子为 **24.8 / Healthy Weight**；切回公制后输入变成 **178cm / 78kg**，结果为 **24.6 / Healthy Weight**。本次证据以稳定后的结果句子为准，不使用动画中的中间仪表读数。
- **原因**：转换后取整的展示值覆盖原始输入，再用于结果计算；反复切换继续累计精度损失。用户仅改变单位，实际测量含义和分类却发生变化。
- **修复方向（建议）**：保留可用于精确计算的规范测量值，显示格式 / 精度与内部数值分离；切换单位时仍自动换算及更新已有结果，但不把显示取整值当作用户重新输入的数据。
- **关闭条件**：上述例子往返后 BMI 和分类保持一致；多次往返不累计漂移；补充靠近分类边界、带小数、空值 / 无效输入的有意义测试；用户主动修改测量时结果更新规则仍正确。保留现有单位切换动效和性别文案。
- **证据**：仓库外 `design-ref/review-2026-10-02/bmi-unit-drift.png`；截图可能处于数字动画期间，复验必须同时核对稳定结果句子。

### R04 · P2 · 轮播 Storybook 状态与命名不一致（未解决）

- **对应要求**：PDF §4E，每个有状态组件的每个状态有独立 story，评审会逐个查看。构建出 story 文件不代表状态实际正确。
- **位置**：[ServicesCarousel.tsx](../src/features/online-care/ServicesCarousel.tsx) 第 35–41 行 `snapPositions`、88–90 行初始化；[OnlineCare.stories.tsx](../src/features/online-care/OnlineCare.stories.tsx) 第 24 / 27 / 34–44 行。
- **复现**：启动 Storybook，打开 `Sections/Services carousel`，保持默认 `board1440` 视口，分别查看 End、Middle，再查看 ArrowHover / ArrowPressed / ArrowFocus。
- **实际结果**：1440 下卡片位置被限制到最大滚动值并去重后，只有两个 snap 位置，约为 `[0, 295]`。End 传入 `defaultIndex: 3`，索引不存在，实际停在起点（Previous 禁用、Next 可用、scrollLeft 为 0）；Middle 传入 `1`，实际停在终点（Previous 可用、Next 禁用、scrollLeft 约 295）。这些结果与 story 注释的“终点”“两侧可用”不符。
- **原因**：`defaultIndex` 按卡片序号理解，但用于索引去重后的滚动位置数组，宽视口下两者不一一对应。三个箭头交互故事也使用 `defaultIndex: 1` 并指向 Next，此时该按钮禁用，无法可靠展示所声明的可用按钮交互状态。
- **修复方向（建议）**：明确初始化位置的含义，按当前可滚动范围正确定位起点 / 中间 / 终点；保证箭头状态故事作用于可用按钮。应保留宽度自适应、scroll-snap 和减少动态效果行为。
- **关闭条件**：1440 下 Start 仅左侧禁用、End 仅右侧禁用、Middle 两侧可用；箭头 hover / pressed / focus 故事实际可见；375 下也无回退。逐个在运行中的 Storybook 核对，不能仅以 build-storybook 成功关闭问题。
- **证据**：仓库外 `design-ref/review-2026-10-02/story-carousel-end.png`。

### R05 · P3 · 页头 / 页脚 Logo 链接状态不完整（未解决）

- **对应要求**：PDF §4D，每个交互元素具备 hover / focus / pressed 与过渡，自设计状态在 README 说明。
- **位置**：[HomeLink.tsx](../src/features/shared/HomeLink.tsx) 第 38 行；调用处 [SiteHeader.tsx](../src/features/navigation/SiteHeader.tsx) 与 [SiteFooter.tsx](../src/features/footer/SiteFooter.tsx)。
- **现状 / 证据**：共享链接实现有点击回顶行为，具备全局焦点样式；页头和页脚调用处未定义 hover / pressed 的视觉反馈及对应过渡。这是代码状态审查发现，不是后端路由缺失。
- **修复方向（建议）**：按现有 token 和克制的交互风格补齐状态，并在 README 状态表说明；不改变 Logo 形状或引入多余业务流程。
- **关闭条件**：两个 Logo 链接的 hover、focus-visible、pressed 均可观察，过渡尊重减少动态效果；普通点击仍平滑回顶并清除锚点，修饰键 / 新标签行为保留；必要时提供状态故事或等价验证。

### R06 · 待核实 · 键盘遍历 E2E 偶发失败

- **位置**：[a11y.spec.ts](../e2e/a11y.spec.ts) 第 39 行用例 `tabbing reaches every control in order with a visible focus ring`，第 88 行断言。
- **首轮结果**：`npm run test:e2e -- --workers=4` 为 **26 通过 / 1 失败（共 27）**；失败消息为 `a Sleep scrolled into view`，Expected true / Received false。
- **后续结果**：该用例单独运行 1 次通过，再单独连续重复 5 次，**5/5 通过**。因此累计 6 次单独复跑通过；未在本轮证明是稳定的 Sleep 功能错误，也未证明并行执行已稳定。
- **接手动作**：保留首轮失败，检查滚动完成等待、焦点位置和并发环境；R02 修复时同时考虑该用例的可见性判定。不要仅增加固定延迟、删除断言或排除用例以获得全绿，应先收集能解释差异的证据。
- **关闭条件**：相关键盘路径及水平可见性检查真实有效；问题定位 / 修正后在相同并行配置复验，记录代码版本、命令和结果。不能把“单独复跑通过”改写成“原始全套 27/27 通过”。
- **证据**：仓库外 `design-ref/review-2026-10-02/focus-test/`、`focus-repeat/`；首轮具体失败及复跑结果在本次 Codex 原始会话中。

### 本轮验证快照与环境交接

| 检查 | 本轮结果 | 证据与边界 |
| --- | --- | --- |
| `npm run lint` | 通过 | 无自动修复 |
| `npm run typecheck` | 通过 | 当前工作区依赖环境 |
| `npm test` | 通过 | 21 个文件、120 项测试 |
| `npm run build` | 通过 | Next.js 16.3.8 生产构建 |
| `npm run build-storybook -- --output-dir <仓库外路径>` | 通过 | 构建索引有 156 个 story；运行时发现 R04，不能据构建认定逐状态验收通过 |
| `npm run storybook -- --ci --port 6007 --quiet` | 可启动并渲染 | 实际打开轮播状态复现 R04；本轮没有重新逐个打开全部 156 个 story |
| `npm run test:e2e -- --workers=4` | 首轮未全通过 | 26/27；失败与复跑详情见 R06 |
| 320–1920 响应式 E2E | 通过 | 扫描每个整数宽度（1601 个）；全页横向溢出及导航换行检查通过，不替代 R02 的内部裁切焦点检查 |
| 主要交互 E2E | 通过 | 菜单开关 / Esc / 焦点返回 / 任意位置跳转、吸顶、Logo 回顶、语言点击 / 触屏 / 减少动态效果、BMI、轮播、FAQ / 页脚；现有用例未覆盖 R03 的精度边界 |
| axe 375 / 1440 | 通过（带已知例外过滤） | 对比度过滤见 `KNOWN_CONTRAST`；不能据此声称全面达到 WCAG AA |
| 375 / 1440 页面视觉检查 | 已完成整页人工对照 | 未发现整块遗漏；不是自动逐像素认证 |
| `npm ls --depth=0`、lockfile 根清单核对 | 通过 | 已安装依赖可用，锁文件与 package.json 一致 |
| 新的干净检出 `npm install` 全流程 | 本轮未执行 | 下方保留的是 Claude 此前验证记录，不能写成本轮独立复验 |

- 临时产物统一位于仓库外 `F:/AI/TigerlessTask/design-ref/review-2026-10-02/`：PDF 渲染、两尺寸整页截图、对照图、问题截图、Storybook 静态构建和单独复跑产物。**不提交这些生成物**；换机器时若需要原始截图，应单独传递该目录，本文复现步骤仍可独立使用。
- 本轮测试使用临时生产服务 3100 和 Storybook 6007，结束时已停止自己启动的服务并关闭临时浏览器页；用户原有 `localhost:3000` 开发服务和预览保留。接手运行前核对实际端口与进程，不直接复用陈旧构建，也不批量终止用户服务。
- 本轮原始审查没有修改应用、测试、配置或文档，也没有提交 Git；用户追加“记录给交接文档”后，本次仅更新 `doc/tasks-handoff.md`。R01–R05 均未修复，R06 尚未定位；无额外活动 agent。
- 接手先读本节、检查工作树与当前源码版本，再根据用户授权处理问题。每项关闭时记录修复版本、有效验证和实际结果；若只改日志 / 索引，不能据此关闭应用缺陷。

## Known issues / 以后再处理的小问题

| # | 问题 | 处理 |
| --- | --- | --- |
| K1 | `npm install` 会出现 npm 11 的 `allow-scripts` 警告（esbuild 的 postinstall） | 无害，esbuild 的二进制通过 optionalDependencies 安装，build 正常。README 已说明。以后可以考虑 `npm approve-scripts esbuild` 消除警告 |
| K2 | ~~还没有 story~~ | 已解决：T04 加了 Foundations/Tokens |
| K3 | ~~favicon 还是 Next 默认的~~ | 已解决：`src/app/icon.svg` |
| K4 | 没装 `@vitejs/plugin-react`：它的 Babel 8 可选依赖和 @svgr/cli 的 Babel 7 冲突，装上就得用 `--legacy-peer-deps` | 测试用 Vite 8 自带的 JSX 转换，已经验证能渲染组件、处理事件 |
| K5 | 本机 Git 全局 `core.autocrlf=true`；`.gitattributes` 给 ts、tsx、json、css、md、mjs、mts、js、svg、.nvmrc 指定了 LF | 新增文件类型时补上对应规则 |
| K6 | Hero 徽章文字对比度不足（C10） | 产品完成后统一调色时处理 |
| K7 | ~~字号 token 和元素的对应关系是推算的~~ | 已解决：T08 每个区块都和 375 / 1440 截图核对过；流式 token 的端点有单元测试 |
| K8 | 结尾 CTA 的渐变、页脚分隔线、星星颜色、避孕区块分隔线是从截图取色的近似值（页脚实例没读到结构化数据） | 视觉上和设计一致即可（用户规则：达到设计意图） |
| K9 | ~~移动端白色外壳的圆角还没量~~ | 已解决（2026-10-02 复核）：375 下 Hero 外壳圆角轮廓和设计稿逐行相差不超过 1px，32px 正确 |
| K10 | Tailwind 的默认色板、字号、圆角、阴影都被清掉了，只能用设计 token | 有意为之；需要新值时在 `globals.css` 里加 token |
| K11 | 新增 token 时要避免和 Tailwind 工具类前缀撞名（例：`--color-body` 和 `--text-body` 都对应 `text-body`） | `src/app/tokens.test.ts` 会自动检查（颜色 / 字号、间距 / 容器撞名）；新 token 还要登记到 `src/lib/cn.ts`，否则 tailwind-merge 可能删掉它 |
| K14 | 运行中的 Storybook 不会扫描**新建文件夹**里的 Tailwind 类（新文件夹里的组件看起来没有样式） | 新建组件文件夹后重启 Storybook。已有文件改动的热更新正常 |
| K15 | Windows 上停止后台 npm 服务时，node 子进程还在，占着端口（6006 被占后，新的 Storybook 会跑到 6007 / 6008 / 6009） | 停止后用 `Get-NetTCPConnection` 检查端口，并结束残留进程 |
| K16 | ~~语言胶囊多选还是单选~~ | 已决定：A，多选，默认选中 中文 和 Português |
| K17 | FAQ 第 2–4 条答案是我起草的（设计里没有） | 用户 2026-10-02：可以先这样上线，答案末尾加 “(Test answer.)” 标注 |
| K18 | 减重区块自己的按钮和 Hero 卡片共用的按钮都叫 “See plans”，按“program 自己的按钮”和“首页卡片的共用按钮”分开定义 | 用户 2026-10-02：保持现状 |
| K19 | Work Sans 没有西里尔字母，“Русский” 用系统字体显示 | 可以接受；不想混用字体的话，可以给俄语单独指定字体 |
| K20 | 视觉对照工具 `tmp/shot.mjs`（Playwright 截图）放在 tmp/，不提交 | 截图后用 python 把设计稿和实现拼在一起对照 |
| K21 | BMI 的性别字段不影响计算（成人分档男女相同），结果文案里只是体现性别（C6，用户要求在文档注明） | 以后可以改成“一行提示”的方案，或者去掉性别字段 |
| K13 | hover / 按下的放大比例（1.03 / 0.97）和色调变化是我自己设计的默认值 | 用户统一讲动效时可能会调整 |
| K22 | 轮播聊天面板的文字是 7–9px（和画板一致，属于手机界面插图） | README “已注意未修改”已说明；如果要求可读性，可以整体放大面板 |
| K23 | 手机样机原图分辨率低（手机本体约 265px 宽），显示到 305px 略糊 | 有更高清的导出图时替换 `public/images/phone-mockup.webp` |
| K24 | 成功案例的照片卡署名 “David L.”，照片是女性 | 用户 2026-10-02：名字无所谓，只作为潜在问题记录，不处理（卡片只是渲染数据） |
| K25 | 轮播的 snap 位置读的是 `padding-left`：计算样式里的 `scroll-padding` 含 `max()` 时不会被解析成 px | 轨道的 `pl` 和 `scroll-pl` 必须保持相同的值 |
| K26 | 1024–1440 之间项目照片按宽度上限原地缩小，不再像 1440 那样高出卡片 | 有意为之（避免盖住文案），README 已记录 |
| K27 | 本地辅助脚本 `tmp/rebuild.sh`（结束 3500 端口进程、build、启动）、`tmp/cards.mjs`（量区块位置）不提交 | 和 K20 的截图工具一起用 |
| K28 | 版权年份在构建时计算（页面是静态预渲染） | 跨年后需要重新构建；以后可以改成按请求渲染或客户端更新年份 |
| K29 | 页脚大部分链接没有目标地址，渲染为按钮（只有按下反馈，C3） | 内容提供 URL 后自动变成链接 |
| K30 | Hero 语言跑马灯的实际价值未定：选择功能和边缘加速都是为“真正选择语言”服务，目前选择只有视觉效果 | **待产品方确认**：是否和网站语言切换 / 翻译 / 问诊语言偏好打通；如果只是装饰，选择和边缘加速可以一起去掉（README “已注意未修改”已写） |
| K31 | `ai-logs/` 里的 Claude Code 日志约 75 MB，GitHub 会提示超过 50 MB（上限 100 MB） | 会话继续变长时，刷新副本前先看大小；超过 100 MB 需要和用户商量（例如 Git LFS） |
| K12 | 评价卡片上的 LinkedIn 图标用的是 Hugeicons `linkedin-01`（描边），设计里是实心的 “in” | 按用户规则，图标达到设计意图即可，不需要处理 |

## 如何审查（给接手的 agent 或审查者）

1. 读本页、[checklist.md](checklist.md)、design.md 的 4b 节、architecture.md 的决定汇总。
2. 查看工作区状态：

```sh
git status --short --branch
git log --oneline -15
```

3. 运行检查：

```sh
npm install
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium   # 只需要第一次
npm run test:e2e
npm run storybook
```

4. 对照 checklist.md 的硬性要求 H1–H8 和 design.md 4b 的修正 / 交互表，确认每一项都有对应的实现和证据。

## Validation evidence

以下是此前实现阶段的验证记录；**最新 Codex 审查结果以上方“本轮验证快照”为准**。此前通过不能覆盖 R01–R06。

| 检查 | 状态 | 说明 |
| --- | --- | --- |
| 干净 clone 全流程 | 通过 | 2026-10-02，`5e3c5d9`：install、lint、typecheck、test、build、build-storybook、test:e2e、dev 200、storybook 200 |
| `npm run build` | 通过 | 2026-10-02，第 ④ 组后（静态预渲染） |
| `npm run dev` | 通过 | 端口 3300 返回 200（T03 时验证） |
| `npm run storybook` | 通过 | 端口 6006 返回 200 |
| `npm run build-storybook` | 通过 | 2026-10-02；全部 156 个 story 逐个打开，无控制台错误 |
| lint / typecheck / test | 通过 | 120 个单元测试；typecheck 在干净 clone 上也通过 |
| `npm run test:e2e` | 通过 | 24 个：320–1920 每个宽度无溢出、导航、Hero、BMI、轮播、FAQ / 页脚、axe、键盘遍历 |
| Tokens 渲染 | 通过 | Storybook 里人工查看；流式 token 端点有单元测试 |
| 375 / 1440 视觉对照 | 全部区块已完成 | 截图拼接对照（K20）；1440 整页高度和设计稿一致 |
| AI 原始日志 | 部分完成 | Claude Code 已上传（`ai-logs/claude-code/`）；Codex 由用户上传 |

## Git 和提交

- 每个小任务一个 commit，不 squash。**只在大任务（T0x）完成时推送到 GitHub**（用户 2026-10-01 规定）；涉及 `ai-logs/` 的内容要先让用户检查。
- 提交源码、lockfile、文档、要用到的素材（以后放进 `public/`）、原始 AI 日志。不提交 `node_modules`、`.next`、`storybook-static`、Playwright 报告、`.env`。
- `CLAUDE.md` 是用户的本地工作协议，**不提交**（用户要求）。
- AI 日志按 [ai-logs/README.md](../ai-logs/README.md) 保存。
