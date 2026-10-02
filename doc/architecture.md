# Architecture

更新：2026-10-01。**当前没有应用代码；下列目录是建议草案，不是“最终采用结构”。** 实现后以代码和配置为准，更新本文件及 README 的实际结构。

## 已固定 / 仍可调整

- 作业固定：Next.js App Router、React、TypeScript strict、Tailwind CSS、提交 lockfile；其余选择见 [requirements.md](requirements.md)。
- 暂建议使用 npm 与 `package-lock.json`，与验收命令一致；具体版本在脚手架阶段核对兼容性并记录，不在本轮凭空固定。
- 本轮实际结构：根 README、`doc/`、`ai-logs/README.md`、Git 辅助文件。

## 推荐起点：单页、清晰类型、少量分层

```text
src/
  app/
    layout.tsx
    page.tsx                # 首页组合与数据读取
    globals.css             # Tailwind 入口及实际设计 tokens
  components/
    ui/                     # Button、Input 等真正可复用的基础组件
    sections/               # Hero、FAQ 等首页区块，按盘点结果建立
  types/
    home.ts                 # 动态首页内容的未来 API 契约
  data/
    home.mock.ts            # 符合契约的 mock 内容
  lib/
    get-home-page.ts        # 简单数据入口，未来可替换为真实请求
public/
  assets/                   # 实际使用的本地图片、图标、字体
.storybook/                 # 脚手架阶段建立
doc/
ai-logs/
```

这棵树尚未创建。stories 可与组件放在一起，复杂业务纯函数也可就近保存；出现真实复杂度再拆模块。不要为了目录完整先生成空层、仓库模式或通用 schema 框架。

## 数据流与契约

`types → 符合类型的 mock → getHomePage → page → 区块 → 基础组件`。

- 先盘点全部动态内容，再定义类型。候选包括导航、标题/CTA、语言、产品/价格、服务卡、评价、FAQ 和页脚链接；是否动态要有明确依据，不把所有文案一概写死，也不把 CSS 布局塞进 API。
- 类型与 mock 分开，mock 用 TypeScript 类型约束检查结构；实际 API 尚不存在，不虚构已有 endpoint。
- 稳定 id、语义字段、图片信息、链接目标按需要定义；金额、单位、可选字段与联合类型要能解释选择原因。
- Rich heading 可用文本片段表达高亮，避免依赖任意 HTML 字符串。
- 交互临时状态（菜单展开、表单输入、轮播位置）属于 UI；动态内容契约不要混入 DOM 节点或 setter。
- `getHomePage` 只作为简单替换入口，不必创建真实 API route、数据库或全局状态库。

最终契约以实际 TypeScript 文件为准；此处解释设计理由，不重复粘贴整份接口定义。

## 组件与渲染边界

- 首页与静态展示优先保留服务端组件；需要事件、浏览器 API 或本地状态的局部组件使用客户端边界。边界随实现验证，不预先将整页设为客户端。
- 基础组件提供一致的交互状态；区块负责组合与响应式；页面负责顺序和数据分发。只提取实际复用或有独立状态/验证价值的组件。
- 组件的状态应可在 Storybook 中稳定复现；按需要提供 props 或交互步骤，不为写 stories 给所有组件强行受控接口。
- 若 Figma 核实需要 BMI，计算/换算/分类纯函数与展示分开；规则来源和输入边界在实现时确认，不把参考笔记当作已验证业务规格。
- CTA 目标和未实现的后续流程需给出明确行为；不扩展成整个后端产品。

## 响应式与验证

- 用正常文档流、flex/grid 和内容决定断点；局部浮层/装饰确有需要时再绝对定位。Hero 最终布局尚未确定。
- 在 375 / 1440 比较视觉，在 320–1920 连续检查完整性；不以 `overflow-x: hidden` 遮盖页面问题。
- 配置 `npm run build`、`dev`、`storybook`；脚手架建立后再按实际需要增加类型、lint 或测试命令。
- 复杂逻辑、菜单/轮播边界、输入转换等值得针对性测试；可逆文档改动和简单静态样式不必为测试数量写测试。
- “最终采用”记录只保留已落地结构、相关 decision ID 与例外；不用为每个文件移动另写决策。
