# Tasks & Handoff

更新：2026-10-02（Claude Code 会话 `49a5b82d…`，T10 完成、T11 只剩 AI 日志）。这里是当前状态的唯一入口。交接时覆盖本页快照，历史由 Git 保存。

## Current status

- **阶段**：T03–T10 已完成；T11 除了 AI 日志都已完成（favicon、README、干净 clone 验证）。**剩下的唯一事项：导出 AI 日志，需要用户先检查能否公开**（见下方 T11）。
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
  - **T11 剩余：AI 日志**（等用户检查，**用户确认前不复制进仓库、不推送**）
    - Claude Code：`C:/Users/h8438/.claude/projects/F--AI-TigerlessTask-Front-End-Task/49a5b82d-24c0-49f7-8a28-b0a36d54120b.jsonl`（约 70 MB，会话结束前还会变大）和同名文件夹（tool-results，约 0.4 MB）
    - Codex（cwd 为 `F:/AI/TigerlessTask` 的会话），在 `~/.codex/sessions/` 下：`2026/10/01/` 的 14-50-39（15 MB）、16-37-47、17-09-04；`2026/10/02/` 的 09-38-23、09-45-11（今天这两条要用户确认是否属于本项目）
    - 注意：GitHub 单文件上限 100 MB，超过 50 MB 会有警告

## Next

T04 及以后的拆分是**建议**，开始前可以和用户确认顺序。

| 顺序 | 任务 | 完成条件 |
| --- | --- | --- |
| T08 | 逐个区块实现（包含原 T09 有状态组件；BMI 前先确认 C6），分 5 组推送 | 每个区块：375 / 1440 对照截图，`test:e2e` 通过，状态 story 齐全 |
| T10 | 动效（Motion）、减少动态效果、键盘操作 | 和 design.md 4b 的交互表一致 |
| T11 | 收尾：README 写偏差日志和自设计状态、导出 AI 日志、从干净的 clone 验证、推送 | 见 checklist.md |

## Known issues / 以后再处理的小问题

| # | 问题 | 处理 |
| --- | --- | --- |
| K1 | `npm install` 会出现 npm 11 的 `allow-scripts` 警告（esbuild 的 postinstall） | 无害，esbuild 的二进制通过 optionalDependencies 安装，build 正常。README 已说明。以后可以考虑 `npm approve-scripts esbuild` 消除警告 |
| K2 | ~~还没有 story~~ | 已解决：T04 加了 Foundations/Tokens |
| K3 | ~~favicon 还是 Next 默认的~~ | 已解决：`src/app/icon.svg` |
| K4 | 没装 `@vitejs/plugin-react`：它的 Babel 8 可选依赖和 @svgr/cli 的 Babel 7 冲突，装上就得用 `--legacy-peer-deps` | 测试用 Vite 8 自带的 JSX 转换，已经验证能渲染组件、处理事件 |
| K5 | 本机 Git 全局 `core.autocrlf=true`；`.gitattributes` 给 ts、tsx、json、css、md、mjs、mts、js、svg、.nvmrc 指定了 LF | 新增文件类型时补上对应规则 |
| K6 | Hero 徽章文字对比度不足（C10） | 产品完成后统一调色时处理 |
| K7 | 字号 token 和元素的对应关系，是根据 Figma 文字样式和截图里文本框的高度推算的 | T08 做每个区块时对照 375 / 1440 截图核对，不对就调整 token 或者新增 |
| K8 | 结尾 CTA 的渐变、页脚分隔线、星星颜色、避孕区块分隔线是从截图取色的近似值（页脚实例没读到结构化数据） | 视觉上和设计一致即可（用户规则：达到设计意图） |
| K9 | 移动端白色外壳的圆角还没量（token 现在是 32） | T08 做 Hero 时核对 |
| K10 | Tailwind 的默认色板、字号、圆角、阴影都被清掉了，只能用设计 token | 有意为之；需要新值时在 `globals.css` 里加 token |
| K11 | 新增 token 时要避免和 Tailwind 工具类前缀撞名（例：`--color-body` 和 `--text-body` 都对应 `text-body`） | 新增 token 后用一次构建检查生成的 CSS |
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
| AI 原始日志 | 未完成 | 文件已定位，等用户检查后再导出 |

## Git 和提交

- 每个小任务一个 commit，不 squash。**只在大任务（T0x）完成时推送到 GitHub**（用户 2026-10-01 规定）；涉及 `ai-logs/` 的内容要先让用户检查。
- 提交源码、lockfile、文档、要用到的素材（以后放进 `public/`）、原始 AI 日志。不提交 `node_modules`、`.next`、`storybook-static`、Playwright 报告、`.env`。
- `CLAUDE.md` 是用户的本地工作协议，**不提交**（用户要求）。
- AI 日志按 [ai-logs/README.md](../ai-logs/README.md) 保存。
