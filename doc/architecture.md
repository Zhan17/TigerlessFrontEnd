# Architecture：方案对比（待用户决定）

更新：2026-10-01（Claude Code 会话 2）。**还没有应用代码。** 这份文档按用户要求，把每个大决策的可选方案、优劣和适用场景都列出来，**不替用户做决定**。用户选定后，在每节的“决定”一栏记下结论，重要的写进 [decisions.md](decisions.md)，然后按选定方案实现。

## 决定汇总（2026-10-01，用户选择）

| 决策 | 选择 | 备注 |
| --- | --- | --- |
| 1 代码结构 | **C 混合**：`components/ui` 组件库 + `features/` 按功能 + 集中的数据契约 + `lib/` | 路由表集中管理，用 App Router 路由分组 |
| 2.1 接口粒度 | **B 按资源分 + 页面文案接口** | F1 已定：页面级文案（Hero 标题、区块标题、CTA 等）由 `GET /content/home` 提供；产品、FAQ、评价等按资源分接口 |
| 2.2 mock 调用 | **D 取数函数 + `DATA_SOURCE` 环境变量开关** | api 分支没有真后端可以测试，代码里标明“未验证” |
| 2.3 类型 | **B Zod schema 推导类型** | 配合 2.4：Zod 负责后端契约，组件 props 用手写 interface |
| 2.4 映射层 | **B 分开**：API 类型通过转换函数变成组件 props | 转换函数保持精简 |
| 2.5 契约约定 | 默认全部采用 | 用户可以随时提出异议 |
| 2.7 状态管理 | **A 组件自己的 state** | 需要时再升级 |
| 3.1 BMI 规则 | **A 写死在前端**（常量 + 纯函数 + 单元测试） | 图例文字由阈值数字生成 |
| 3.2 BMI 保留 | **A 不保留**，刷新清零 | — |
| 6 多语言 | **只做英文** | F6 已定：保留 `Intl` 格式化金额和单位，语言胶囊带 `lang` / `dir` |
| Storybook | **`@storybook/nextjs-vite`** | F7：搭项目时验证兼容性，不行退回 `@storybook/nextjs` |
| 样式变体 | **CVA + tailwind-merge** | — |
| 手风琴 / 菜单 | **Radix Primitives**（Accordion；移动菜单用 Dialog） | F4 已定：参考资料多，社区支持多；轮播不用库 |
| 跑马灯 | 信任条用**纯 CSS**；Hero 语言胶囊用 **JS**（需要靠边加速、拖动和点击选中） | design.md 4b 的 C5 |
| 动效 | **[Motion](https://motion.dev)**，有问题时退回纯 CSS | 简单的 hover 和过渡用 CSS；液体切换、气泡回弹、菜单展开、轮播用 Motion（design.md 4b 的 C4） |
| 轮播 | **CSS scroll-snap + 按钮** | — |
| 图标 | **SVGR 命令行一次性生成 `.tsx` 组件**，提交进仓库 | F3 已定：Next 和 Storybook 两边都不需要加载器配置；新增图标时重新运行生成脚本 |
| 图片 | **动态数据**：路径 + 宽高 + alt，通过 `next/image` 显示 | 文件放在 `public/` |
| 单元测试 | **Vitest + Testing Library** | 可以接 Storybook 的 Vitest 插件，把 story 当测试跑 |
| 响应式检查 | **Playwright**，320–1920 逐个宽度检查 `scrollWidth <= clientWidth` | F5：浏览器不在 `npm install` 时自动下载 |
| 代码格式 | **Biome** | — |
| 2.6 固定短语 | **前端字典**：“From”、“/mo”、无障碍标签等放在一个前端文案文件里 | 只做英文，但集中放一处，以后加多语言时直接替换成 i18n 字典 |
| 4 主题色 | **前端根据分类映射**：数据只给 `category`，前端映射到主题 token，通过 `data-theme` 加 CSS 变量切换 | 遇到不认识的分类时使用默认主题 |

## 0. 已经固定的（作业硬性要求）

- Next.js App Router + React + TypeScript strict + Tailwind CSS；提交 lockfile。
- 用 npm。评审会运行 `npm install / build / dev / storybook`，用其他包管理器只会增加风险。
- 必须交付：组件库 + 页面、动态内容的类型和 mock、每个有状态组件每个状态一个 story。
- 具体版本（Next、React、Tailwind、Storybook）在搭项目时核对最新稳定版和互相的兼容性，不在这里凭记忆写死。

## 1. 代码结构怎么组织

背景：现在只有一个首页，但有很多入口（Weight Loss / Birth Control / Sleep、Get started、Login），以后很可能会扩展成子页面。作业原文说“目录组织本身就是考核的一部分”，README 里要解释为什么这样组织。

### 方案 A：按类型分（type-based）

```
src/components/  src/hooks/  src/lib/  src/types/  src/data/
```

| 优点 | 缺点 |
| --- | --- |
| 最简单，小型 Next 项目最常见，一眼能看懂 | 同一个区块的组件、类型、mock、story 分散在好几个文件夹里 |
| 不需要额外的规则 | 页面变多以后 `components/` 会堆成一大坨，很难分清哪些是通用的、哪些属于某个业务 |

适合：确定永远只有一个页面、想把结构做到最轻。

### 方案 B：按功能分（feature-based）

```
src/features/hero/        ← 组件 + 类型 + mock + stories + 测试，全放一起
src/features/bmi-calculator/
src/features/faq/
src/features/programs/    ← 减重、避孕、睡眠共用
...
src/shared/               ← 跨功能共用的
```

| 优点 | 缺点 |
| --- | --- |
| 内聚性高：改一个功能只看一个文件夹，删除或搬到新页面也方便 | 首页上有些区块很小（比如信任条），单独成一个 feature 有点重 |
| 和以后的子页面天然对应，比如 `/weight-loss` 页面直接复用 `features/programs` | **评审说“先看类型”**，但类型分散在各个 feature 里，需要额外做一个汇总入口 |
| 用户直觉上倾向这个方案 | 需要约定 feature 之间不能互相引用，否则会变成一团乱麻 |

参考：[Bulletproof React](https://github.com/alan2207/bulletproof-react)（社区里最常被引用的按功能分的 React 项目结构）。

### 方案 C：混合结构（组件库按类型 + 页面区块按功能 + 数据契约集中）

```
src/
  app/                    ← 只放路由，页面只负责“取数据 → 交给区块”
  components/ui/          ← 组件库：Button、Accordion、Carousel、Marquee……不包含任何 Apsu 的业务内容
  features/（或 sections/）← 按功能：hero、programs、bmi、faq、testimonials、navigation……
  content/（或 api/）      ← 集中放：数据契约类型、mock、取数函数
  lib/                    ← 纯函数：BMI 计算、价格格式化、路由表
  styles/                 ← tokens
```

| 优点 | 缺点 |
| --- | --- |
| 作业要求“组件库 + 页面”，这个结构把两者在物理上分开，评审一眼能找到组件库 | 文件夹比 A、B 多，需要在 README 里写清“什么东西放哪” |
| 类型和 mock 集中在一个地方，正好对应“评审先看类型” | 要判断一个组件属于 `ui`（通用）还是 `features`（业务），边界偶尔会模糊 |
| 功能区块依然内聚，以后加子页面时复用 features | |

参考：[Next.js 官方项目结构说明](https://nextjs.org/docs/app/getting-started/project-structure)、[shadcn/ui](https://ui.shadcn.com)（“通用 UI 组件库”层的典型写法）。

### 方案 D：Feature-Sliced Design（严格分层）

`app / pages / widgets / features / entities / shared` 六层，上层只能引用下层。

| 优点 | 缺点 |
| --- | --- |
| 方法论成熟、扩展性最强，答辩时有理论可讲 | 对一个页面来说**明显过度设计**，样板代码多 |
| | 评审可能认为复杂度没有必要；概念多，答辩时需要解释的东西也多 |

参考：[Feature-Sliced Design](https://feature-sliced.design/)

### 方案 E：monorepo，组件库单独成包（`packages/ui` + `apps/web`）

| 优点 | 缺点 |
| --- | --- |
| 字面意义上的“组件库”，可以独立发布 | 需要 workspace 配置，`npm install` 和 build 出问题的风险变大 |
| | 作业规模下收益很小 |

### 无论选哪种都建议做的

- **路由集中管理**：建一个 `routes` 路由表，按钮引用路由的名字，不直接写死 URL。以后 Weight Loss 从“页内锚点”变成“独立页面”，只改路由表一处。
- **App Router 路由分组**：用 `app/(marketing)/page.tsx` 这样的写法，以后加 `(marketing)/weight-loss`、`(app)/login` 等子页面时，不需要改动现有结构。

**决定**：待定。

## 2. 数据层：mock 怎么做，怎么兼容以后的后端

### 2.1 后端接口的粒度

| 方案 | 说明 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A 整页一个接口** | `GET /pages/home` 一次返回首页所有区块的内容 | 最简单；一次请求；类型从上往下读很直观 | 和页面布局耦合；以后其他页面要用同样的数据（比如产品）只能重复定义 |
| **B 按资源分接口** | `/programs`、`/products`、`/faqs`、`/testimonials`、`/languages`…… | 资源可以被以后的子页面复用；可以分别缓存 | 首页要组合多个请求；接口个数多 |
| **C 页面 = 有序的“区块”列表**（类似 CMS） | `sections: Array<HeroBlock \| FaqBlock \| …>`，前端按 `type` 渲染对应组件 | 最灵活：后端或运营可以调整区块顺序、隐藏区块、做 A/B 测试 | 最抽象，代码最多；对一份固定的设计稿来说可能过度 |
| **D 混合** | 业务实体（Program、Product、Faq…）按资源定义；页面接口按 id 引用并组合它们 | 兼顾复用和简单 | 需要想清楚“实体”和“页面内容”的边界 |

参考：[Payload CMS 的 Blocks](https://payloadcms.com/docs/fields/blocks)（方案 C 的典型做法）。

**决定**：待定。

### 2.2 mock 数据放在哪里、怎么被调用

| 方案 | 说明 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A 取数函数** | 一个异步函数，比如 `getHomePage(): Promise<HomePage>`，内部返回 mock；页面（服务端组件）调用它 | 简单；以后换成真实请求只改这一个函数；组件完全不知道数据从哪里来 | 没有真正的 HTTP 边界，看不出“这是一个 API” |
| **B Next 路由处理器** | `app/api/home/route.ts` 返回 mock 的 JSON | 有真实的 HTTP 接口，契约以 JSON 的形式存在 | 服务端组件在 build 时请求自己的接口是反模式（build 时服务器还没启动），需要绕开 |
| **C MSW 拦截请求** | 代码里正常写 `fetch('/api/…')`，由 [MSW](https://mswjs.io) 拦截并返回 mock | 最接近真实后端；Storybook 也能复用同一套 mock | 多一套配置；在服务端组件里使用要额外设置 |
| **D A + 环境变量开关** | `DATA_SOURCE=mock\|api` 切换 | 演示“随时可以接上真后端” | 现在没有真后端，api 分支只能写成示意 |

**决定**：待定。

### 2.3 类型怎么写：只用 TS，还是加运行时校验

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| **A 只写 TypeScript interface** | 最易读，正好满足“评审先看类型” | 后端返回的数据和类型不一致时，运行时发现不了 |
| **B 用 [Zod](https://zod.dev) schema，从 schema 推导类型** | 一份定义，同时得到类型和运行时校验；后端字段变了能立刻发现并降级处理 | 推导出来的类型没有手写 interface 好读；多一个依赖 |
| **C 手写 interface + Zod 校验，加一个测试保证两者一致** | 可读性和容错兼得 | 维护两份定义 |

**决定**：待定。

### 2.4 API 数据和组件 props 要不要分开（映射层）

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| **A 不分**：组件直接用 API 类型 | 代码少 | 后端改一个字段名，所有用到的组件都要改 |
| **B 分**：在中间加一层转换函数，API 类型转成组件需要的 props | 后端怎么变，只改转换函数；组件可以独立在 Storybook 里使用 | 多一层代码，有些字段会定义两遍 |

**决定**：待定。

### 2.5 不管选哪种，都建议遵守的契约约定（为了兼容和容错）

1. **只传内容和语义，不传样式**：数据里给 `category: 'weight-loss'`，前端自己把它映射到薄荷色主题。数据里不放颜色值、左右位置这类布局信息。（有争议的地方见第 4 节）
2. **稳定 id**：每条数据都有字符串 id（比如 slug），不依赖数组下标。
3. **链接用联合类型**：`{ type: 'route', route } | { type: 'anchor', target } | { type: 'external', url }`。按钮还没有目标页面时，可以先指向锚点，以后改数据即可。
4. **金额**：`{ amountMinor: 20000, currency: 'USD' }`（用最小货币单位的整数，避免浮点误差），再加 `interval: 'month'`。显示时用 [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) 按语言格式化，**代码里不写死 `$`**。
5. **单位**：内部统一用公制（cm、kg），显示时再换算；单位制用 `'imperial' | 'metric'` 枚举。BMI 分档的文字（如 “18.5–24.9”）**由数字生成**，不写成字符串（设计稿里的错误正是手写字符串造成的）。
6. **图片**：`{ src, alt, width, height }`，可选焦点位置。以后图片放到 CDN 时，只需要在 `next/image` 配置里加域名。
7. **图标**：数据里只传图标的名字（比如 `icon: 'truck'`），前端维护“名字 → 图标组件”的映射，不传 SVG。
8. **未知值的兜底**：后端新增了一个前端不认识的分类或图标时，用默认主题、默认图标显示，不让页面崩溃。
9. **局部容错**：某个区块的数据缺失或出错时，只隐藏这个区块（或显示占位），其他区块正常显示（React error boundary 加可选字段）。
10. **带高亮的标题**：用文字片段表示，比如 `[{ text: 'Healthcare that ' }, { text: 'speaks your language.', emphasis: true }]`。不用 HTML 字符串（有 XSS 风险），也不用 markdown（需要解析器）。
11. **版本**：响应里带 `schemaVersion`，或者接口路径里带版本号，方便以后升级。

### 2.6 哪些内容动态返回，哪些写在前端

| 动态（来自数据） | 前端固定（代码里） | 灰色地带（需要决定） |
| --- | --- | --- |
| 导航链接、Hero 文案、语言列表、分类卡片、信任条、How it works、三个业务的内容和价格、产品、服务轮播卡片、评价、FAQ、结尾 CTA、页脚链接、社交链接、免责声明 | 布局和样式、图标映射、组件自身的微文案（比如轮播的 “Next slide” 无障碍标签）、BMI 公式 | BMI 分档阈值和文案（见第 3 节）、组件上的固定短语（如 “From”、“/mo”）放数据里还是放前端字典 |

### 2.7 状态管理

页面上的交互状态（菜单开关、FAQ 展开、轮播位置、BMI 输入）都只属于单个组件。

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| **A 组件自己的 state（useState）** | 最简单，不需要依赖 | 跨组件共享时要把状态往上提 |
| **B 部分状态放进 URL**（比如 `#faq-2` 打开某条 FAQ） | 可以分享链接、刷新后保留 | 实现稍复杂 |
| **C 全局状态库**（Zustand、Context） | 以后跨页面共享状态方便 | 现在没有任何跨组件的需求，属于过度设计 |

**决定**：待定。

## 3. BMI 计算器：规则放哪里、数据要不要保存（用户新提的问题）

用户的判断：BMI 计算器是纯前端的东西，以后的页面不一定会用，没必要做成依赖后端数据的组件；而且刷新页面就会清零。

### 3.1 计算规则放在哪里

| 方案 | 说明 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A 规则写死在前端** | 公式和分档阈值都是代码里的常量 | 最简单；不依赖网络，离线也能算；BMI 是公开的医学标准，很少变化 | 分档或文案要变时只能改代码再发布 |
| **B 公式在前端，阈值和文案来自数据** | 公式是固定数学，分档（18.5 / 25 / 30）和标签、GLP-1 资格线通过数据下发 | 运营或医学团队调整资格标准时不用改代码；和其他动态内容的处理方式一致 | 多一份数据定义；数据没加载出来时要有默认值 |
| **C 计算交给后端** | 提交身高体重，后端返回结果和资格判断 | 资格逻辑集中在后端，可以记录 | 需要网络请求；现在没有后端，只能 mock；对一个简单公式来说过度 |

两个补充说明：

- 不管选哪种，**计算部分都写成一个纯函数**（输入身高、体重、单位，输出 BMI 和分档），配单元测试。组件只负责界面。这样以后换成方案 B 或 C，只是替换函数的数据来源，组件不用动。
- “是否单独做成一个组件”和“是否接后端”是两件事。作业要求每个有状态的组件都要有 story，所以 BMI 计算器**必须是一个独立组件**（有初始、已计算、报错、英制、公制等状态）。但它可以是不依赖后端的纯前端组件，正好对应方案 A。

### 3.2 输入和结果要不要保留

| 方案 | 说明 | 优点 | 缺点 |
| --- | --- | --- | --- |
| **A 不保留** | 刷新后清零 | 最简单；健康数据不落地，隐私上最安全 | 用户刷新或返回后要重新输入 |
| **B 存在 sessionStorage** | 当前标签页内刷新后保留，关掉就清除 | 体验好一点，隐私风险低 | 需要处理存储不可用的情况 |
| **C 存在 URL 参数** | 比如 `?h=170&w=70` | 可以分享、刷新后保留 | **健康数据出现在 URL 里会进入浏览历史和服务器日志，不推荐** |
| **D 提交到后端记录** | 比如作为“开始问诊”的前置信息 | 业务上有价值（转化漏斗） | 涉及隐私和合规，现在没有后端 |

**决定**：待定。

## 4. 颜色和样式渲染要提前想清楚的几点（只是提一下，细节以后讨论）

1. **颜色只放在 CSS 里，不放进数据**：tokens 写成 CSS 变量（Tailwind v4 的 [`@theme`](https://tailwindcss.com/docs/theme)），组件只用语义类名（如 `bg-surface`、`text-brand`），不直接写 `#102b1c`。
2. **分类主题色怎么切换**（需要决定）：
   - A：前端根据 `category` 映射（数据只给分类）
   - B：数据直接给一个主题名（如 `theme: 'mint'`），更灵活，但样式概念会渗进数据
   - 实现上都可以用 `data-theme="weight-loss"` 加 CSS 变量，在区块范围内切换颜色
3. **渐变和半透明色**（BMI 刻度条、CTA 背景、页脚渐变字标、80% 透明的薄荷色）也做成 token，不在组件里散写。
4. **设计稿没有暗色模式**：不需要做。但 tokens 按语义命名的话，以后加暗色模式成本很低。
5. **字体用 `next/font` 加载**：可以避免字体加载完成前后布局跳动（CLS）。
6. **流式字号**：H1 72→36、H2 52→32 之间用 `clamp()` 计算。[Utopia](https://utopia.fyi) 可以直接生成从 375 到 1440 的流式字号和间距，这是“画板之间优雅适配”加分项的核心工具之一。
7. **对比度**：Hero 徽章那种浅绿小字不达标，在定 token 时一起处理。

## 5. 其他技术选型（每项都有几种做法）

| 决策 | 选项 | 区别 |
| --- | --- | --- |
| Storybook 框架 | `@storybook/nextjs`（webpack）/ `@storybook/nextjs-vite` | 前者最成熟；后者启动和热更新更快。两者都支持 `next/image` 和 `next/font`。[官方文档](https://storybook.js.org/docs/get-started/frameworks/nextjs) |
| 组件样式变体 | [CVA](https://cva.style) + `tailwind-merge` / 手写条件类名 | CVA 让 `variant`、`size` 这类变体结构清晰，是 shadcn 的做法；手写不需要依赖，但变体多了会乱 |
| 手风琴、菜单、轮播 | 无头组件库（[Radix Accordion](https://www.radix-ui.com/primitives/docs/components/accordion)、[Embla Carousel](https://www.embla-carousel.com)）/ 自己写 | 组件库自带无障碍和键盘支持，但增加依赖；自己写依赖少，也更能体现能力，但要严格按 [WAI-ARIA 模式](https://www.w3.org/WAI/ARIA/apg/patterns/) 实现 |
| 跑马灯 | 纯 CSS 动画 / JS 库 | 纯 CSS 足够，参考 [CSS marquee](https://ryanmulligan.dev/blog/css-marquee/) |
| 轮播滚动 | CSS [scroll-snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap) + 按钮 / Embla | scroll-snap 原生支持触屏滑动，代码少；Embla 功能多 |
| 图标 | SVG 转 React 组件（SVGR）/ 手写成 TSX 组件 / `<img>` 引用 / npm 图标包 | 转成组件可以用 `currentColor` 改颜色；`<img>` 不能改颜色；npm 包最省事但多一个依赖 |
| 图片 | 静态 import 本地图片 / 数据里给路径 + `next/image` | 静态 import 自动获得尺寸和模糊占位；但动态数据只能给路径，所以 mock 里的图片也应该用路径，才和以后真实 API 一致。[next/image](https://nextjs.org/docs/app/api-reference/components/image) |
| 单元测试 | [Vitest](https://vitest.dev) + Testing Library / 不写 | 至少 BMI 计算、单位换算、价格格式化值得测 |
| **响应式自动检查** | [Playwright](https://playwright.dev) 脚本从 320 到 1920 逐个宽度检查 `scrollWidth <= clientWidth` / 只手动拖窗口 | 自动检查能直接证明“没有横向溢出”这条硬性要求，答辩时也是亮点；代价是多一个开发依赖 |
| 代码格式 | ESLint + Prettier / Biome | 一样能用，Biome 更快、配置少 |
| 多语言 | 现在接入 [next-intl](https://next-intl.dev) 并用 `[locale]` 路由 / 只把结构做成“随时可以多语言” | 见第 6 节 |

## 6. 多语言与一致性

**先区分两件事**：Hero 里的语言胶囊表示“问诊支持哪些语言”，是业务数据；网站界面本身的语言目前只有英文，是 i18n。不要混在一起。

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| **A 现在就做 i18n**（next-intl + `/en`、`/es` 路由） | 和产品定位（多语言医疗）一致，答辩时有话题 | 设计稿只有英文，其他语言的文案需要自己编；路由和 SEO 都会变复杂 |
| **B 只做好准备**：所有展示文案来自数据或字典，组件里不写死字符串；数据里带 `locale` 和 `dir`；数字、金额、单位都用 `Intl` 格式化 | 以后加语言不用改组件；工作量可控 | 现在看不到多语言的效果 |
| **C 不考虑** | 最快 | 以后改造成本高，也和产品定位不符 |

无论选哪种，都建议：
- 语言列表带语言代码和书写方向，比如 `{ code: 'ar', nativeName: 'العربية', dir: 'rtl' }`
- 布局用逻辑属性（`ms-`/`me-`、`start`/`end`），而不是 `left`/`right`，以后支持阿拉伯语这种从右往左的语言时，布局会自动翻转
- 单位和货币全部用 `Intl` 格式化，保证同一种单位在全站写法一致

**决定**：待定。

## 7. 可以参考的资料

| 主题 | 链接 |
| --- | --- |
| Next.js 项目结构 | https://nextjs.org/docs/app/getting-started/project-structure |
| 按功能分的 React 项目 | https://github.com/alan2207/bulletproof-react |
| 严格分层方法论 | https://feature-sliced.design/ |
| 组件库写法（Tailwind + CVA） | https://ui.shadcn.com 、https://cva.style |
| Tailwind v4 tokens | https://tailwindcss.com/docs/theme |
| 流式字号与间距 | https://utopia.fyi |
| 不依赖断点的布局思路 | https://every-layout.dev |
| 无障碍交互模式（手风琴、轮播、披露） | https://www.w3.org/WAI/ARIA/apg/patterns/ 、[轮播](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)、[披露](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) |
| 跑马灯 / 横向滚动 | https://ryanmulligan.dev/blog/css-marquee/ 、https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap |
| 数据校验与 mock | https://zod.dev 、https://mswjs.io |
| CMS 区块模型 | https://payloadcms.com/docs/fields/blocks |
| 金额 / 数字格式化 | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat |
| Storybook + Next.js | https://storybook.js.org/docs/get-started/frameworks/nextjs |
| 测试 | https://vitest.dev 、https://playwright.dev |
