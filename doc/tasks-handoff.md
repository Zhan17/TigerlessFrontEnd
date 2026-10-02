# Tasks & Handoff

更新：2026-10-01（Claude Code 会话 `49a5b82d…`，T05 完成后）。这里是当前状态的唯一入口。交接时覆盖本页快照，历史由 Git 保存。

## Current status

- **阶段**：T03 搭项目、T04 design tokens、T05 图标已完成；下一步是 T06（基础组件）。页面还是占位页。
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

## In Progress

- **T06 基础组件**（进行中）。用户在 T06 开始时做的决定：
  - 用 `storybook-addon-pseudo-states` 为 hover / focus / 按下各做一个 story，所以这些交互状态要用 CSS 实现，不用 Motion 的 whileHover
  - **禁用态只有两处**：轮播箭头滑到两端时、BMI 输入无效时的 “Calculate BMI”；其他按钮都没有禁用态（design.md 未改动，以这里为准）

  已完成：
  - `0b15b9b` 安装 pseudo-states 插件
  - `83be438` 修复 tailwind-merge 不认识自定义 token 的问题（原来会把 `text-button` 当成颜色删掉）
  - `3d4d84f` Button：primary / secondary / outline，lg / md，可选箭头，全宽；hover = 放大到 1.03 + 色调变化 + 箭头右移，按下 = 缩小到 0.97，禁用 = 40% 透明度；每个状态一个 story；有单元测试

  接下来：IconButton（圆形按钮：轮播箭头、社交图标）→ Eyebrow / CheckList / Price / Rating → SocialLinks → 语言胶囊 Pill

## Next

T04 及以后的拆分是**建议**，开始前可以和用户确认顺序。

| 顺序 | 任务 | 完成条件 |
| --- | --- | --- |
| T06 | 基础组件（`components/ui`）：Button、IconButton、Eyebrow、CheckList、Price、Rating、SocialLinks 等，每个组件和它的状态、story 一起做 | 每个状态一个 story；hover / focus / 按下 / 禁用状态统一 |
| T07 | 数据层：Zod schema（按资源 + `content/home`）、mock、取数函数加 `DATA_SOURCE` 开关、映射到组件 props | 类型可读；mock 通过校验；有测试 |
| T08 | 逐个区块实现（导航和 Hero 先做），桌面和移动同时做 | 375 / 1440 对照截图；`test:e2e` 通过 |
| T09 | 有状态组件：移动菜单、语言跑马灯、轮播、FAQ、BMI（BMI 前先确认 C6） | 状态 story 齐全；BMI 纯函数有测试 |
| T10 | 动效（Motion）、减少动态效果、键盘操作 | 和 design.md 4b 的交互表一致 |
| T11 | 收尾：README 写偏差日志和自设计状态、导出 AI 日志、从干净的 clone 验证、推送 | 见 checklist.md |

## Known issues / 以后再处理的小问题

| # | 问题 | 处理 |
| --- | --- | --- |
| K1 | `npm install` 会出现 npm 11 的 `allow-scripts` 警告（esbuild 的 postinstall） | 无害，esbuild 的二进制通过 optionalDependencies 安装，build 正常。README 已说明。以后可以考虑 `npm approve-scripts esbuild` 消除警告 |
| K2 | ~~还没有 story~~ | 已解决：T04 加了 Foundations/Tokens |
| K3 | favicon 还是 Next 默认的 | 以后用 L1 字标生成 |
| K4 | 没装 `@vitejs/plugin-react`：它的 Babel 8 可选依赖和 @svgr/cli 的 Babel 7 冲突，装上就得用 `--legacy-peer-deps` | 测试用 Vite 8 自带的 JSX 转换，已经验证能渲染组件、处理事件 |
| K5 | 本机 Git 全局 `core.autocrlf=true`；`.gitattributes` 给 ts、tsx、json、css、md、mjs、mts、js、svg、.nvmrc 指定了 LF | 新增文件类型时补上对应规则 |
| K6 | Hero 徽章文字对比度不足（C10） | 产品完成后统一调色时处理 |
| K7 | 字号 token 和元素的对应关系，是根据 Figma 文字样式和截图里文本框的高度推算的 | T08 做每个区块时对照 375 / 1440 截图核对，不对就调整 token 或者新增 |
| K8 | 结尾 CTA 的渐变、页脚分隔线、星星颜色、避孕区块分隔线是从截图取色的近似值（页脚实例没读到结构化数据） | 视觉上和设计一致即可（用户规则：达到设计意图） |
| K9 | 移动端白色外壳的圆角还没量（token 现在是 32） | T08 做 Hero 时核对 |
| K10 | Tailwind 的默认色板、字号、圆角、阴影都被清掉了，只能用设计 token | 有意为之；需要新值时在 `globals.css` 里加 token |
| K11 | 新增 token 时要避免和 Tailwind 工具类前缀撞名（例：`--color-body` 和 `--text-body` 都对应 `text-body`） | 新增 token 后用一次构建检查生成的 CSS |
| K13 | hover / 按下的放大比例（1.03 / 0.97）和色调变化是我自己设计的默认值 | 用户统一讲动效时可能会调整 |
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
| 干净安装 `npm install` | 通过 | 2026-10-01，Node 24.19.0；删除 node_modules 后重新安装，0 vulnerabilities |
| `npm run build` | 通过 | 占位页 |
| `npm run dev` | 通过 | 端口 3300 返回 200，页面渲染出 h1 “Apsu” |
| `npm run storybook` | 通过 | 端口 6006 返回 200（提示还没有 story） |
| `npm run build-storybook` | 通过 | — |
| lint / typecheck / test | 通过 | 2 个单元测试（T04 后重新跑过） |
| `npm run test:e2e` | 通过 | 1601 个宽度；故意制造溢出时能检测到（T04 后重新跑过） |
| Tokens 渲染 | 通过 | Storybook 里人工查看颜色、字号、主题；用 Playwright 量过字号 |
| 375 / 1440 视觉对照 | 未执行 | 还没有页面 |
| AI 原始日志 | 未完成 | Codex 和 Claude Code 的会话都还没导出 |

## Git 和提交

- 每个小任务一个 commit，不 squash。**只在大任务（T0x）完成时推送到 GitHub**（用户 2026-10-01 规定）；涉及 `ai-logs/` 的内容要先让用户检查。
- 提交源码、lockfile、文档、要用到的素材（以后放进 `public/`）、原始 AI 日志。不提交 `node_modules`、`.next`、`storybook-static`、Playwright 报告、`.env`。
- `CLAUDE.md` 是用户的本地工作协议，**不提交**（用户要求）。
- AI 日志按 [ai-logs/README.md](../ai-logs/README.md) 保存。
