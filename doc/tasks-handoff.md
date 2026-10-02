# Tasks & Handoff

更新：2026-10-01（Claude Code 会话 `49a5b82d…`）。这里是当前状态的唯一入口。交接时覆盖本页快照，历史由 Git 保存。

## Current status

- **阶段**：T03 搭项目已完成；下一步是 T04（tokens 和基础组件）。页面还是占位页。
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

## In Progress

- 无。

## Next

T04 及以后的拆分是**建议**，开始前可以和用户确认顺序。

| 顺序 | 任务 | 完成条件 |
| --- | --- | --- |
| T04 | Design tokens：在 `globals.css` 的 `@theme` 里定义颜色、字号（流式 `clamp`）、间距、圆角、阴影、动效时长；分类主题用 `data-theme` | 所有 token 来自 design.md 第 1 节；Storybook 里有一个能看到 tokens 的页面 |
| T05 | 图标：用 SVGR 命令行把 `design-ref` 里的 SVG 生成 `.tsx` 组件，颜色用 `currentColor` | 有一个可以重复运行的生成脚本；图标总览 story |
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
| K2 | 还没有任何 story，Storybook 启动时会提示 “No story files found” | T04–T06 加 story 后自然消失 |
| K3 | favicon 还是 Next 默认的 | 以后用 L1 字标生成 |
| K4 | 没装 `@vitejs/plugin-react`：它的 Babel 8 可选依赖和 @svgr/cli 的 Babel 7 冲突，装上就得用 `--legacy-peer-deps` | 测试用 Vite 8 自带的 JSX 转换，已经验证能渲染组件、处理事件 |
| K5 | 本机 Git 全局 `core.autocrlf=true`；`.gitattributes` 给 ts、tsx、json、css、md、mjs、mts、js、svg、.nvmrc 指定了 LF | 新增文件类型时补上对应规则 |
| K6 | Hero 徽章文字对比度不足（C10） | 产品完成后统一调色时处理 |

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
| lint / typecheck / test | 通过 | 2 个单元测试 |
| `npm run test:e2e` | 通过 | 1601 个宽度共 5.4 秒；故意制造溢出时能检测到 |
| 375 / 1440 视觉对照 | 未执行 | 还没有页面 |
| AI 原始日志 | 未完成 | Codex 和 Claude Code 的会话都还没导出 |

## Git 和提交

- 每个小任务一个 commit，不 squash。远程仓库是私有的；推送前不需要额外确认，但涉及 `ai-logs/` 的内容要先让用户检查。
- 提交源码、lockfile、文档、要用到的素材（以后放进 `public/`）、原始 AI 日志。不提交 `node_modules`、`.next`、`storybook-static`、Playwright 报告、`.env`。
- `CLAUDE.md` 是用户的本地工作协议，**不提交**（用户要求）。
- AI 日志按 [ai-logs/README.md](../ai-logs/README.md) 保存。
