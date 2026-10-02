# Tasks & Handoff

更新：2026-10-01（America/Los_Angeles）。这是当前状态的唯一入口；交接覆盖本页快照，重要历史由 Git 保存。

## Current status

- 阶段：初始化文档；尚未实现前端或安装依赖。
- 工作目录：`Front-End Task`，本机路径 `F:\AI\TigerlessTask\Front-End Task`。
- 本地分支：`main`；交接时重新运行 Git 命令核实，不依赖文档里的旧 commit 值。
- Figma：原始文件读不了（仅查看权限）；用户副本 `0WMyYj8ycFQlykicaNToc1` 可读。**整页逐块审稿已完成**，见 [design.md](design.md)：13 个区块、同类组件、交互 brainstorm、设计错误候选、Q1–Q7 待用户决定。
- ⚠️ Figma MCP（Starter 计划）调用额度已用完，素材还没导出。参考截图保存在仓库外的 `F:\AI\TigerlessTask\design-ref\`。
- AI：初始化由 Codex 完成；2026-10-01 起 Claude Code 参与（第 2 个会话：复核需求、确认 Figma 访问）。两段会话的原始记录都需要导出到 `ai-logs/`。

## Done

- 已完整读取 PDF 第 1 页并查看渲染页；提取原始 Figma 链接。
- 已将 PDF 要求、用户目标和参考笔记区分，建立验收映射。
- 已收敛为五份工作文档，补充根 README 和 AI 日志说明。
- 已记录设计访问限制、候选整页区块及 Hero 待核对项。
- 已初始化本地 Git 为 `main`，设置忽略规则和文本属性；初始提交通过 `git log` 查看，不在文档中复制 commit hash。
- 已检查全部本地 Markdown 链接、UTF-8 文本、R01–R12 条目；确认 lockfile/原始日志可跟踪，依赖/构建/环境文件被忽略，原始日志不转换换行。

## In Progress

- 无进行中的应用实现任务。若后续暂停开发，在此写具体任务、已改文件和未完成验证，不写模糊的“UI 开发中”。

## Next

| 顺序 | 任务 | 完成条件 |
| --- | --- | --- |
| T01 | ✅ 审稿和逐块讨论已完成 | 结论见 design.md 的 4b 节：修正 F01–F14、已发现但不修改的清单、交互方案，C1–C10 全部有结论。C6（BMI 性别如何在结果里体现）实现前再和用户确认一次 |
| T01b | 导出素材 | 用户按 [assets-checklist.md](assets-checklist.md) 手动导出，放到 `F:\AI\TigerlessTask\design-ref\assets\`；Figma MCP 额度为每月 20 次，2026-10 已用完 |
| T02 | 架构选型已确定（见 [architecture.md](architecture.md) 的决定汇总 / decisions D06）；下一步是写出数据契约（Zod schema）和 mock | 有实际类型、符合类型的 mock、动态内容覆盖表；重要选择写 decisions，架构从草案更新 |
| T03 | 初始化 Next.js / Storybook | App Router、TS strict、Tailwind、lockfile 和四个目标命令可用；记录真实版本和运行结果 |
| T04 | 做首个端到端区块，再逐区块实现 | 数据 → 页面 → 组件链路成立；Hero 与导航先验证两个画板及中间宽度；随后完成全页 |
| T05 | 交互、stories 与响应式验收 | 每个交互元素有状态/过渡；每个有状态组件每状态有 story；持续缩放 320–1920 并修复问题 |
| T06 | 提交收尾 | README 的实际结构、偏差、交互与 AI 贡献完整；全部原始日志入库；干净检出验证；公开 GitHub 链接 |

任务顺序可调整：T02 / T03 可在设计核对期间部分推进；不要求每个阶段都完成一套正式审批。实现任务按可验证小块拆分，不一次把全页记为 Done。

## Review Priority

这是时间分配建议，不是新增验收等级。

1. **P0 / 提交完整性**：必需技术栈、lockfile、四条命令、动态契约与 mock、完整历史、原始 AI 日志和 README 必需内容。
2. **P1 / 页面与行为**：每个区块、375 / 1440 默认状态还原、320–1920 完整性；导航、Hero、计算器/浮层/轮播等真实高风险区域；状态与 stories 对应。
3. **P2 / 打磨**：跨宽度适配、动画一致性、键盘体验、素材与视觉细节。

P0 和 P1 都需要完成；P2 中如发现实际违背 PDF 的缺陷，提升优先级，而非因为标签就忽略。

## Turn handoff

- Turn task：评估并初始化轻量文档及本地 Git，未开始 UI 实现。
- 本轮变化：见 Done；应用目录树只是提议，不是已有文件。
- 下一次第一步：读本页、requirements 与 [checklist.md](checklist.md)（与用户对齐过的需求理解和打勾清单）；检查工作树；核对设计输入。普通开发不需要再重做本轮的文档规划。
- 不能直接读到/尚未知：Figma 具体画板与 tokens、真实素材、确切移动区块关系、邮件截止日期、最终依赖版本、AI 原始导出文件、GitHub 远程仓库地址。
- 可用参考：父目录的 PDF 与两份分析/SOP；新克隆仓库可能没有它们，不能假定本机路径在别处存在。
- 无需冻结：断点、组件拆分、状态管理、双模型角色、架构草案；按实际证据调整。
- 不要误判为完成：Figma 审阅、UI、API 类型、mock、stories、build、日志归档、远程发布。

接手时的最小检查：

```sh
git status --short --branch
git log -5 --oneline
git diff
git diff --cached
```

## Validation evidence

| 检查 | 本轮状态 | 说明 |
| --- | --- | --- |
| PDF | 已执行 | 1 页文字、链接提取及渲染查看 |
| Figma | 部分完成 | 原始文件：编辑权限错误。用户副本：get_metadata 成功，已取得画板/区块节点；未审阅细节 |
| 文档链接 / 需求映射 / Git | 已执行 | 本地链接与 UTF-8 检查通过；PDF 条款映射 R01–R12；main 已初始化，忽略与原始日志文本属性检查符合预期 |
| install / build / dev / storybook | 未执行 | 尚无 package.json，不能宣称通过 |
| 375 / 1440 与 320–1920 | 未执行 | 尚无 UI |
| AI 原始日志完整性 | 未完成 | 本轮会话结束后需导出；已有笔记不是完整记录 |

后续记录命令、结果、失败点和截图/文件位置即可；不必为每次样式调整写长报告。

## Git 和公开提交

- 本地初始化与最终远程发布分开；当前未提供 GitHub 仓库 URL，不创建或推送未知远程。
- 以有意义的小块提交，保留完整历史。不要把提交前清理变成 squash 或重写项目历史。
- 提交源码、lockfile、文档、必要素材及原始 AI 日志；依赖目录、构建输出和环境密钥不入库。
- AI 日志按 [ai-logs/README.md](../ai-logs/README.md) 保存；本次初始化也计入项目 AI 使用。
- 公开发布前核对原始日志的可公开性。若发现秘密或私人内容，与“未编辑日志”要求的冲突不能靠静默改写日志解决；先由用户与出题方明确处理方式。

## 下一次更新只需这些

任务/执行者、Done、In Progress、Next、未提交文件、验证结果、阻碍或未知信息、必要的 decision ID。没有变化的设计和架构文档无需重写。
