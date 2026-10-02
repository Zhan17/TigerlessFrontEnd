# Checklist

更新：2026-10-01（Claude Code 第 2 个会话，与用户逐条对齐后整理）。用途：开发时对照、提交前逐项打勾。条款原文映射见 [requirements.md](requirements.md)，进度见 [tasks-handoff.md](tasks-handoff.md)。

## 一句话

照 Figma 用 Next.js 做 Apsu 首页（桌面 1440 + 移动 375），以 **React 组件库 + 页面** 的形式交付；自己设计数据类型与 mock、修正设计错误、补全交互状态与动效、用 Storybook 展示每个状态；提交保留完整历史与 AI 原始记录的 GitHub 仓库，之后有答辩（defense）。

## 前提共识

- Figma 是静态稿：无 hover 设计、未说明按钮行为、无动效标注。状态和按钮去向由我们决定（锚点 / 合理占位），**不做整套业务流程**。
- 但静态稿里仍有可推断的交互：`Menu` 画板（移动菜单展开态）、轮播箭头、FAQ 展开收起等。逐项列出后即为 D / E 的范围。
- 没有后端：数据契约和 mock 由我们设计（§3）。
- 原始 Figma 链接无法通过 MCP 读取（仅查看权限）；使用用户副本 `0WMyYj8ycFQlykicaNToc1`，README 中仍写原始链接。

## 硬性要求（不满足基本出局）

- [ ] H1 Next.js App Router + React + TypeScript strict + Tailwind CSS；**提交 `package-lock.json`**（§1）
- [ ] H2 干净检出后 `npm install` / `npm run build` / `npm run dev` / `npm run storybook` 全部可用（§6）
- [ ] H3 所有动态内容有 TypeScript 类型（未来 API 契约）+ 符合类型的 mock（§3）
- [ ] H4 375 / 1440 两个宽度下，每个区块默认状态忠于设计（允许已记录的修正）（§4A）
- [ ] H5 320–1920 **任意宽度**：无横向溢出、导航不换行、无重叠、无裁切（§4B）
- [ ] H6 README 必填：目录结构说明、AI 工具与各自写的部分（链接日志）、设计修正日志、自设计交互状态（§2 §4C §4D §5）
- [ ] H7 完整 commit 历史，**不 squash**（§6）
- [ ] H8 所有 AI 会话的完整、未编辑原始记录放在 `ai-logs/`（§6）

## 评分项（原文明确会看）

- [ ] **类型定义**：原文 "We read the types first"，是第一印象
- [ ] **目录组织**：原文 "is itself part of the assessment"，README 解释理由
- [ ] **还原度**：只在 375 / 1440 逐像素比对
- [ ] **找设计错误**：错别字、有问题的 UI；判断要准，不为凑数量乱改
- [ ] **交互状态**：每个可交互元素有 hover / focus / pressed + 过渡；"consistency and restraint count more than quantity"
- [ ] **Storybook**：每个有状态组件、每个状态一个 story；"we walk them one by one"
- [ ] **commit 历史与 AI 记录**：本身就是交付物，答辩时可能抽查

## 加分项

- [ ] 画板之间与 1440 以上的优雅适配（唯一明确的 bonus），答辩时能讲清做法
- [ ] 自由发挥空间：tokens 设计、图片 / 图标处理、数据层与 API 形态

## 隐含要求

- [ ] **答辩**：代码、适配方案、AI 记录都要能当面讲清，不留自己解释不了的 AI 代码
- [ ] **"unreproducible AI use is not [fine]"**：包括第一轮 Codex 初始化在内的所有会话都要提交
- [ ] `npm install` 不依赖 `--legacy-peer-deps`；依赖克制（Next + React 19 + Storybook 易冲突）
- [ ] 配好 `start` 脚本；build 无类型错误
- [ ] dev 页面上也能逐个触发交互状态，不只在 Storybook 里
- [ ] 导航切换汉堡菜单的断点要算好（"no wrapped nav items" 是点名的）；菜单展开态是有状态组件，要有 story
- [ ] 轮播等只在局部容器内滚动，不用全局 `overflow-x: hidden` 掩盖问题
- [ ] 组件库：组件靠 props 驱动、可复用，内容不写死在组件里
- [ ] 类型像真 API：可 JSON 序列化（不放 React 节点）、稳定 id、图片用对象、金额 / 枚举设计合理
- [ ] 页面从单一数据入口读取 mock，以后换真接口只改这一处
- [ ] 可访问性：focus-visible 可见焦点、键盘可操作、语义化 HTML、alt 文本、`prefers-reduced-motion`

## 交付物

- 要交：源码、`package-lock.json`、README（英文为宜）、Storybook 配置、使用的素材、`ai-logs/` 原始导出、完整 git 历史
- 不交：`node_modules`、`.next`、`storybook-static`、`.env`（`.gitignore` 已覆盖）
- 待定：`doc/` 中文工作文档是否留在最终仓库；作业 PDF 一般不入库

## 必走步骤

1. [ ] 审设计稿：区块清单、交互元素与状态清单、tokens 与素材、设计错误候选、动态内容清单
2. [ ] 先定类型与 mock，打通 数据 → 页面 → 组件 链路
3. [ ] 搭项目：Next + TS strict + Tailwind + Storybook，先验证四条命令再写 UI
4. [ ] tokens 与基础组件（Button / Input 等），连同状态和 stories 一起做
5. [ ] 逐区块实现（桌面 + 移动同时做），从导航与 Hero 开始
6. [ ] 响应式巡检：320–1920 连续拖动 + 断点前后各 1px
7. [ ] 打磨：动效一致性、键盘、减少动态效果
8. [ ] README（结构、修正日志、状态清单、AI 贡献）+ 导出全部会话原始记录
9. [ ] 重新克隆验证四条命令 → push → 提交链接

## 容易漏的点

- [ ] 导出第一轮 Codex 会话（`C:\Users\h8438\.codex\sessions\YYYY\MM\DD\rollout-*.jsonl`）
- [ ] 导出 Claude Code 会话：`~/.claude/projects/F--AI-TigerlessTask-Front-End-Task/<session-id>.jsonl` 及同名文件夹 `tool-results/`；会话结束后原样复制
- [ ] 公开前用户本人检查日志可公开性（本机路径、账户信息），但不删改
- [ ] README 修正日志 / 自设计状态**逐项**记录，边做边记
- [ ] Storybook 在 Tailwind、`next/image`、`next/font` 下正常渲染
- [ ] 设计稿字体的获取方式与授权
- [ ] 按有意义的小块 commit，不最后一次性提交

## 待用户确认

- [ ] 截止时间与投入时长
- [ ] 仓库公开还是私有；私有时邀请谁
- [ ] README 语言；`doc/` 是否保留
- [ ] Codex 会话导出；两份参考笔记（任务分析手册、AI SOP）的位置
- [ ] Figma 副本是否原样 duplicate
