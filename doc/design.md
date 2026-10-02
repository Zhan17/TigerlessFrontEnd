# Design audit / 设计盘点

更新：2026-10-01（Claude Code 会话 2）。这一轮只做审稿和 brainstorm，**还没有写代码**。“候选修正”和“交互方案”需要和用户逐块讨论后才定；定下来的修正写进 README 的偏差日志，重要取舍写进 [decisions.md](decisions.md)。

## 0. 证据与访问状态

- 原始文件只有查看权限，Figma MCP 读不了。使用用户副本：[链接](https://www.figma.com/design/0WMyYj8ycFQlykicaNToc1/Front-end-Assignment--Copy-?node-id=1-304)，file key `0WMyYj8ycFQlykicaNToc1`。
- **⚠️ Figma MCP 调用额度（Starter 计划）已在本轮用完**。已拿到的数据：整页图层树、两个画板和菜单的 1x 全尺寸截图、颜色 / 字体变量，以及 Hero、BMI、FAQ、轮播标题的结构化代码。没拿到的：第 4 张轮播卡片的完整文字、成功故事中间卡片和页脚的结构化数据、**所有图片 / 图标素材的导出**。
- 本地参考文件（在仓库外，不提交）：`F:\AI\TigerlessTask\design-ref\`
  - `desktop-1440-full.png`、`mobile-375-full.png`、`mobile-offboard-weightloss-bmi.png`、`mobile-menu-open.png`、`figma-layer-tree.txt`
- 图层名几乎都是 `Frame 2147…`，很多文字图层的**名字**是占位文字（“Health Harbor provided…”），真实文案以截图和设计上下文为准。
- 图层树里的坐标会因为旋转 / 翻转出现奇怪的偏移，比如信任条显示在 x=1440，但实际渲染是正常的。**不要根据 metadata 坐标判断“放错位置”**，以截图为准。之前在 handoff 里怀疑信任条放错，现在确认是误判。

### 画板与节点

| 节点 | 内容 | 尺寸 |
| --- | --- | --- |
| `1:303` | 桌面首页 | 1440×10155 |
| `1:884` | 移动首页 | 375×9583 |
| `1:1077` | **游离在移动画板外**的帧：移动版减重区块、两张产品卡、BMI | 335×2284 |
| `1:1416` | 移动菜单展开态 | 375×824 |

## 1. 全局：tokens、字体、栅格

### 字体

- 实际只用 **Work Sans**，字重只有 400 和 500。Google Fonts 提供，OFL 授权，可以用 `next/font/google`。
- 变量表里有 `font/family/title = Syne`、`font/family/body = Syne`，但页面没有用到，是残留变量，忽略。
- **样式命名不可信**：`Page Title/72px-Bold`、`…-Semibold` 实际都是 Medium 500；`Section Title/56px-Semibold` 实际是 Regular 400；`Subtitle/18px-Medium` 实际是 Regular。写代码时 token 按**用途**命名，取实际数值，不沿用这些名字。

| 用途 | 桌面 | 移动 |
| --- | --- | --- |
| H1（Hero） | 72 / 1.1，500 | 36 / 1.24 |
| 区块 H2 | 52 / 1.24（另有 48、40） | 32 / 1.24 |
| 卡片标题 | 40 / 32 / 24（1.16） | 24 / 20 |
| 正文 | 20 / 18，行高 1.6 | 16 / 14，行高 1.6 |
| 小标签（eyebrow） | 16–18，字距 2px，大写 | 16 |
| 按钮 | 18 / 1.32，500 | 16 |
| 最小字号 | 12（BMI 图例） | 12 |

体感评估：正文 18 / 16、行高 1.6 很舒服，可以直接用。问题在 H1 和 H2：72 到 36、52 到 32 之间设计没给中间值，中间宽度需要用 `clamp()` 做流式字号，否则 768–1200 之间要么太大会挤压，要么太小显得空。

### 颜色（去重后的语义建议）

| 语义 | 值 | 设计里的重复 / 近似值 |
| --- | --- | --- |
| 品牌深绿（主按钮、标题） | `#102b1c` | `#173A26`、多个近黑 `#111111` `#1D1D1D` `#2A2A2A` `#292B2A` |
| 强调绿（高亮文字、eyebrow） | `#00774d` | Highlighted / Label text / Secondary_Mint 600 三个名字指向同一个值 |
| 亮薄荷（Hero 徽章文字） | `#21ac88` | `#009269` |
| 浅绿（选中胶囊、FAQ 分隔线） | `#b8d9c6` | 变量名叫 `Green/Light :active`，暗示它是“激活态”颜色 |
| 边框 | `#cddcd3` | — |
| 页面背景 | `#faf9f4` | 重复定义两次 |
| 输入框背景 | `#f6f8fa` | — |
| FAQ 展开头部 | `#587362` | — |
| 分类主题色 | 薄荷 `#bcffe6cc`、紫 `#ffdeff`、蓝 `#d0fffd` | 减重 = 薄荷，避孕 = 紫，睡眠 = 蓝，Hero 卡片和功能区块都用这套对应 |

近黑色有 5–6 个近似值，实现时收敛成 2–3 个语义 token。

**可访问性风险**：Hero 徽章用的是 `#21ac88` 14px 文字配白底，对比度约 2.9:1，**不满足 WCAG AA（4.5:1）**。候选修正：改用 `#00774d`（约 5.6:1）。

### 栅格、间距、圆角、阴影

- 桌面：内容区宽 1320（左右各 60px 边距）。Hero、成功故事、CTA 区块外面套一层白色大圆角容器，宽 1384，左右各 28px，圆角 32。
- 移动：变量写的是 4 栏、边距 16、栏间距 12，但画板实际用 **20px** 页面边距（部分容器 12 + 内边距 8 = 20）。**以画板为准，用 20**。
- 圆角：32（大容器）、16（卡片）、12（FAQ）、全圆角（按钮 / 胶囊）。
- 阴影：两个效果样式（多层的 `Card Shadow` 和 `card shadow 2`），实际图层里还有不少临时手写的阴影值，要统一。

### 图标

图标名称混用了两套图标库：`payment-success-01`、`customer-support`、`linkedin-02` 是 Hugeicons 的命名；`arrow-right-circle`、`check-circle`、`times-circle`、`angle-left` 像 Unicons 的命名。实现时可以导出 SVG，也可以统一用一个图标库，留待后面讨论。

## 2. 逐块分析

每块按 **元素 / 布局 → 桌面与移动的差异 → 交互（隐藏的和需要自己设计的）→ 疑似设计错误 → 潜在实现问题** 的顺序记录。疑似错误按把握程度标注：✅ 确定是错，🟡 需要判断，⚪ 只是记录。

### S1 导航栏（Navbar）+ 移动菜单

- **元素**：Apsu 字标（矢量）；4 个链接 Weight Loss / Birth Control / Sleep / Contact Us；主按钮 Get started（深绿实心）；Login（描边）。
- **布局**：导航是一条悬浮的胶囊条（1320×60，带阴影），放在 Hero 的白色大容器里。链接图层本身是 36px 高、带内边距的“按钮”，说明设计者预期它有 hover 背景。
- **移动端**：只剩字标和汉堡图标（`menu-right`）。菜单画板 `1:1416`：整屏白色面板，顶部是字标和关闭图标（`times-circle`），下面一条分隔线；链接居中竖排；Get started 和 Login 全宽上下排列。
- **交互（需要自己设计）**：
  - 链接点了去哪：Weight Loss / Birth Control / Sleep 跳到页内对应区块。**页面里没有 Contact 区块**，Contact Us 需要决定去向（页脚、FAQ，或 `mailto:`）。
  - Get started / Login：没有对应页面，需要决定行为（见第 3 节问题 Q1）。
  - 移动菜单：打开 / 关闭、锁定背景滚动、按 Esc 关闭、焦点限制在菜单内、点链接后自动关闭、过渡动画。
  - 导航是否吸顶（sticky），可选方案见第 3 节。
- **疑似设计错误**：
  - 🟡 菜单关闭图标偏蓝灰，和品牌深绿不一致。
  - ⚪ 图层名 `Botton`，只是图层名拼错，不影响页面。
- **潜在问题**：作业点名要求“导航不能换行”。桌面导航大约需要 1100px 宽，**大约 1024 以下必须切成汉堡菜单**，需要实测确定断点。菜单展开态是有状态组件，要有 story。

### S2 Hero

- **元素**：
  1. 信任徽章 3 个（图标 + 文字）：40+ Languages / US-licensed physicians / Free expedited shipping
  2. H1 “Healthcare that **speaks your language.**”，后半句绿色高亮
  3. 副标题两行
  4. 主按钮 “Start a free consultation”，带圆形箭头图标，高 56
  5. **语言胶囊**两行，左右边缘有 120px 渐隐遮罩
  6. 3 张分类卡片（424×421）：WEIGHT MANAGEMENT / BIRTH CONTROL / SLEEP，各有彩色背景、eyebrow、标题、白色 “See plans” 按钮和产品图
- **移动端**：
  - 徽章排成两行，**顺序变了**（shipping 移到第一行）。这是为了换行好看，不算错误。
  - H1 36px；按钮宽 281；胶囊变小（高 32）
  - 分类卡片纵向堆叠（335×220），图片放右侧
- **隐藏交互**：
  - 胶囊的内容每行重复了两遍，加上两侧渐隐遮罩，强烈暗示这是**无限滚动的跑马灯**，两行可能反向滚动。
  - 部分胶囊（中文、Português）是浅绿实心，颜色变量叫 `:active`，可能代表“选中”或“当前”状态。
  - 分类卡片可能整张都可以点击。
- **疑似设计错误**：
  - ✅ **三张分类卡片用的是同一张 TIRZEPATIDE “Weight Loss Program” 药瓶图**，避孕和睡眠卡片也显示减重药。
  - ✅ **“Русскийالعربية” 是俄语和阿拉伯语挤在一个胶囊里**，同一行还混着左到右和右到左两种书写方向。应拆成 “Русский” 和 “العربية” 两个胶囊，阿拉伯语加 `dir="rtl"` 和 `lang`。
  - 🟡 卡片 eyebrow 写的是 “WEIGHT MANAGEMENT”，但导航和下面区块都叫 “Weight Loss”，命名不统一。
  - 🟡 徽章文字对比度不足（见第 1 节）。
  - ⚪ 胶囊文字带尾随空格（如 “Español ”），会让文字稍微偏离居中；第一张卡片的阴影和另外两张写法不同。
- **潜在问题**：
  - H1 在设计里是固定宽度 872，中间宽度要靠流式字号控制换行。
  - 跑马灯必须在局部容器内裁切，不能撑出页面横向滚动。
  - 语言列表应该放在数据里，带语言代码和书写方向。

### S3 信任条（Trust strip，跑马灯）

- **元素**：通栏深绿色横条（桌面高 149，移动高 96），白色图标 + 文字：50 States / Discreet Shipping / Cash-pay, No Issuance Needed / 24/7 AI Care Assistant / US Board Certified MDs。整组内容重复了两次，说明是无限滚动跑马灯。
- **疑似设计错误**：✅ **“No Issuance Needed” 应为 “No Insurance Needed”**。同页的睡眠区块写的是 “Cash-pay, no insurance needed”，CTA 写的是 “No Insurance Required”，可以互相印证。
- **交互**：自动滚动；鼠标悬停时是否暂停待定；开启“减少动态效果”时改为静止。条目本身不可交互。
- **同类组件**：和 Hero 语言胶囊共用一个 `Marquee` 组件。

### S4 How it works

- **元素**：eyebrow “HOW IT WORKS”；H2 “Real physicians, AI-amplified.”；副标题；两张白色卡片，各有大号浅薄荷色编号 01 / 02、标题、说明和勾选列表（卡片 1 有 3 条，卡片 2 有 2 条）；底部一句总结 “The AI handles the language. Your physician makes the medical decisions.”
- **移动端**：卡片纵向堆叠。
- **交互**：没有，纯展示区块，不需要 story 状态。
- **疑似设计错误**：
  - 🟡 两张卡片的标题**不在同一高度**（Human physicians 约在 y=820，AI care assistant 约在 y=837）。原因是内容底部对齐、而两张卡的列表条数不同。改为顶部对齐即可。
  - ⚪ 这里的列表项以句号结尾，其他区块的列表项没有句号，标点不统一。

### S5 Weight Loss（减重区块 + 产品卡）

- **元素**：
  - 大薄荷色卡片：左边是 eyebrow “WEIGHT LOSS”、H2 “Loss Weight In Your Way.”、3 条勾选项、白色 “See plans” 按钮；右边人物图**超出卡片顶部**。
  - 两张白色产品卡：药瓶图、产品名（Compounded Semaglutide / Compounded Tirzepatide）、分隔线、“From $200/mo”、深绿 “Get started” 按钮。
- **移动端**：⚠️ **这个区块不在移动画板里**，被放在画板外的 `1:1077`。移动版布局是：图片放到文字下方、产品卡纵向堆叠、按钮全宽。
- **疑似设计错误**：
  - ✅ **“Loss Weight In Your Way.” 语法错误**，应为 “Lose Weight Your Way.” 或 “Lose Weight in Your Way.”
  - ✅ **Semaglutide 产品卡用的是 Tirzepatide 药瓶图**。
  - ✅ **移动画板缺少整个减重区块和 BMI 计算器**，内容放在画板外。实现时要按桌面顺序插回：How it works 之后、Birth Control 之前。
  - 🟡 标题用每个单词首字母大写（Title Case），而 Birth Control 区块用句首大写，大小写风格不统一。
  - ⚪ 两个产品都是 “From $200/mo”。价格是数据，mock 里照搬即可，不算设计错误。

### S6 BMI 计算器（属于 Weight Loss 区块）— 全页状态最多的组件

- **元素**：
  - 背景是运动照片加深色遮罩。
  - 左侧表单卡片：eyebrow “CHECK YOUR ELIGIBILITY” 和右上角 “BMI” 标签；标题 “Could a GLP-1 program be right for you?”；提示语；单位切换（ft / lbs | cm/kgs）；身高 ft + in 两个输入框（带上下箭头）；体重 lbs；性别单选（Male / Female，默认 Female）；全宽 “Calculate BMI” 按钮。
  - 右侧结果卡片：环形仪表显示 “56 Your BMI Score”；渐变刻度条；4 个分档标签；“See your GLP-1 Options →” 链接。
- **移动端（`1:1077` 内）**：合并成一张卡片，仪表放在顶部，文字是 “Your Score”。**没有单位切换、没有 eyebrow、没有刻度图例、没有 GLP-1 链接。**
- **需要设计的状态**：
  - 单位：英制 / 公制。切换时已填的数值要换算，不能清空。
  - 输入：空、有效、超出范围或非数字（报错）。
  - 结果：未计算（初始）、偏瘦、正常、超重、肥胖。
  - 按钮的 hover / 按下 / 禁用态；输入框的 focus 态。
- **疑似设计错误**：
  - ✅ **输入框全是 0，结果却显示 56**，默认状态自相矛盾，而且 56 本身是极端值。候选修正：初始显示空状态（“—” 加提示文字），或者给一组合理的默认值，结果由计算得出。
  - ✅ **刻度图例数值写错**：“Healthy Weight <18.5 - 24.9” 应为 “18.5–24.9”；“Overweight <25.0 - 29.9” 应为 “25–29.9”。
  - ✅ “cm/kgs” 应为 “cm / kg”。单位不加 s，空格写法也要和 “ft / lbs” 一致。
  - 🟡 移动版缺少单位切换，是功能缺失，应该补上。
  - 🟡 “Your Score” 和 “Your BMI Score” 文案不一致。
  - 🟡 BMI 计算本身不需要性别，这个字段是否保留、是否参与计算，见第 3 节问题 Q6。
- **潜在问题**：
  - 计算逻辑写成纯函数并配单元测试。
  - 环形仪表用 SVG 按数值绘制，不用设计稿里的静态图。
  - 分档阈值放在数据或配置里，便于以后改。

### S7 Birth Control（避孕区块）

- **元素**：紫色卡片，左边文字、右边人物图（超出卡片顶部）。H2 “Birth control, without the waiting room.”；说明；3 条勾选项；分隔线；“From $20/mo”；白色按钮 “Start your birth control consult”。
- **移动端**：纵向堆叠，图片在底部，按钮全宽。
- **疑似设计错误**：
  - 🟡 **没有 eyebrow 标签**。减重区块有 “WEIGHT LOSS”，避孕和睡眠区块都没有，三个区块不一致。
  - ⚪ 桌面版说明文字的框宽 615，比所在列宽 562 还宽，在 Figma 里文字会溢出列宽。

### S8 Sleep（睡眠区块）

- **元素**：蓝色卡片，左边人物图上叠着两张小浮层卡片（“Olivia Gomes 78 Normal / 89.5% Progress” 和 “Your profile 82%” 带渐变条）；右边是 H2 “Sleep”、副标题 “Real rest without the dependency.”、一句说明、4 条勾选项、“From $20/mo”、按钮 “Start your sleep consult”。
- **移动端**：纵向堆叠，图片和浮层卡片放在底部。
- **疑似设计错误**：
  - ✅ **“Non-habit-forming Physician-prescribed For sensitive sleepers.” 大小写和标点错误**，应为 “Non-habit-forming, physician-prescribed, for sensitive sleepers.”
  - 🟡 勾选项 “Non-controlled, non-habit-forming options” 和 “No controlled sedatives” 意思重复。
  - ⚪ 浮层卡片上的数据（78 Normal、89.5% Progress）没有实际含义，只是装饰。
- **同类组件**：S5、S7、S8 是同一种“功能区块”版式：彩色卡片 + eyebrow + H2 + 说明 + 勾选列表 + 价格 + 按钮 + 人物图，图片左右交替。**适合做成一个组件，用 props 控制主题色和图片位置。**

### S9 Completely online（服务轮播）

- **元素**：H2 “Completely online on your schedule”（52px）；上一张 / 下一张箭头按钮（48px 描边圆形）。卡片 382×654，共 4 张，最后一张**超出右侧画板边缘**：
  1. “24/7 Provider Support”：手机样机 + 聊天浮层
  2. “Easy Manager Treatment”：医护照片作背景，白字标题
  3. “Access to FDA-approved Medication Options”：Wegovy 注射笔图片
  4. “Free Expedited Shipping”：戴口罩的配送人物照片。在桌面画板里只露出一部分（标题已从 `1:788` 确认）
- **移动端**：箭头放在标题下方靠右；卡片 333×510，一次显示一张，右侧露出下一张的边。
- **交互（需要自己设计）**：横向滚动并吸附到卡片（scroll-snap）；箭头每次滚动一张；**滑到两端时箭头需要禁用态（设计里没有）**；触屏可以滑动；键盘可以操作。卡片没有按钮，本身不需要交互态。
- **疑似设计错误**：
  - ✅ **“Easy Manager Treatment” 不通顺**，候选改为 “Easy Treatment Management” 或 “Easily Manage Treatment”。
  - 🟡 起始位置时“上一张”箭头和“下一张”样式完全一样，缺少禁用态。
  - 🟡 卡片 3 用了 Wegovy（品牌药，FDA 批准）的图片，但页脚免责声明说公司提供的是复方药、未经 FDA 批准，内容上有冲突。还可能涉及商标问题。只记录，是否修改再讨论。
- **潜在问题**：
  - 卡片超出画板的部分必须裁切在区块内部，不能撑出页面横向滚动。
  - 卡片 1 里的聊天浮层文字只有约 8px，用 DOM 实现没有意义，建议整体导出成一张图片。

### S10 Our Success Stories（成功故事）

- **元素**：白色大容器；H2 “Our **Success Stories**”（后半绿色）；副标题 “Care that finally made sense.”；3 张卡片：
  - 左：Weight Loss，5 星，评价文字，署名 Maria R. / Houston, TX，3 个社交图标（X、Instagram、LinkedIn）
  - 中：整张人物照片作背景，署名 David L / Queens, NY，白色社交图标，**没有分类、星级和评价文字**
  - 右：Sleep，署名 An N. / San Jose, CA
- **移动端**：纵向堆叠。桌面和移动都是静态排列，不是轮播。
- **疑似设计错误**：
  - ✅ 署名 “David L” 缺少句点，另外两张是 “Maria R.” 和 “An N.”。
  - 🟡 中间卡片没有分类和评价内容。三个业务里刚好缺 Birth Control，中间卡片可能本该是 Birth Control 的评价。
  - 🟡 **病人评价卡片上挂社交账号链接**，在医疗场景下有隐私问题，链接去向也不明确。见第 3 节问题 Q5。
- **交互**：只有社交图标按钮需要状态。

### S11 FAQ

- **元素**：左边是 eyebrow “FAQs”、H2 “Frequently Asked Questions”、副标题。右边是 4 条手风琴：第 1 条默认展开（深绿 `#587362` 头部、白字、白色圆形向上箭头、虚线分隔、白色内容区）；其余 3 条收起（白底、描边圆形向下箭头）。
- **这是 Figma 里唯一真正做了变体的组件**：组件名 `FAQs`，变体 `Expand / Close`。
- **移动端**：纵向堆叠；**移动版没有 “FAQs” eyebrow**。
- **疑似设计错误**：
  - ✅ **只有第 1 条有答案**，另外 3 条的隐藏内容都是复制的 “all 50 states” 那一句，需要补写真实答案。组件默认值里还有第 5 个问题 “Is there a membership or subscription fee?” 和完整答案，可以直接用。
  - 🟡 移动版缺少 eyebrow。
  - ⚪ eyebrow 写成 “FAQs”，其他 eyebrow 都是全大写（如 “HOW IT WORKS”），大小写不统一。
- **交互**：每条有收起、展开、hover、focus 四种状态；展开收起带高度动画；使用 `aria-expanded`。同时只能展开一条还是可以展开多条，见第 3 节。

### S12 结尾 CTA

- **元素**：深绿到薄荷的渐变卡片，背后有大号 “Apsu” 水印；H2 “Ready For Healthcare In Your Language?”；“No Appointment Needed • No Insurance Required”；按钮 “Start free consultations”。
- **移动端**：文字居中竖排，圆点分隔符变成单独一行，按钮全宽放在底部。
- **疑似设计错误**：
  - ✅ **“Start free consultations” 和 Hero 的 “Start a free consultation” 不一致**，复数用法也别扭。建议统一。
  - 🟡 标题用每个单词首字母大写，和其他标题风格不一致。

### S13 Footer（页脚）

- **元素**：深绿底；大号字标和标语 “American medicine, in the language you think in.”；三列链接：
  - Products：Weight Loss / Birth Control / Sleep
  - **Comapny**：About Apsu / Blogs / FAQs / Contact Us
  - Legal：Terms / Privacy Policy / Medication Safety Information

  然后是免责声明；“By using our services, you agree to our Terms & Conditions.”；分隔线；4 个社交图标（X、Facebook、Instagram、LinkedIn）；© 2026 APSU；底部一个巨大的渐变 “Apsu” 字标（被底边裁切）。
- **移动端**：单列排列。
- **疑似设计错误**：
  - ✅ **“Comapny” 应为 “Company”。**
  - 🟡 桌面版右边缘没对齐：Legal 列最长的一项伸到约 x=1410，分隔线却在 1352 结束，版权文字又对齐到 1408。
  - 🟡 移动版底部巨大字标在右侧被裁掉，实现时必须明确裁切，否则会造成横向溢出。
  - ⚪ “Terms & Conditions” 应做成链接；“Blogs” 一般写作 “Blog”。

## 3. 跨区块的同类组件（可以统一做）

| 组件 | 出现位置 | 建议 |
| --- | --- | --- |
| **Button** | 主按钮（深绿 + 白色箭头圆，高 56 / 48）、次按钮（白底 + 黑色箭头圆）、描边按钮（Login）、全宽版本（移动）、文字链接加箭头（BMI “See your GLP-1 Options”） | 一个组件，用 `variant`、`size`、`icon`、`fullWidth` 控制。**所有箭头按钮共用同一种 hover 动效**（箭头右移 + 背景加深） |
| **IconButton** | 轮播箭头 48、FAQ 箭头 40、社交图标 36、汉堡 / 关闭 32 | 统一 focus 环和按下效果 |
| **Marquee** | Hero 语言胶囊、信任条 | 一个组件，可配置方向和速度；开启“减少动态效果”时静止；鼠标悬停是否暂停待定 |
| **Eyebrow** | HOW IT WORKS、WEIGHT LOSS、FAQs、CHECK YOUR ELIGIBILITY、Hero 卡片 | 绿色和深色两种 |
| **SectionHeading** | 各区块 H2，部分带绿色高亮片段 | 高亮用数据里的文字片段表达，不用 HTML 字符串 |
| **CheckList** | S4、S5、S7、S8 | 一个组件 |
| **Price** | “From $X/mo”（S5、S7、S8） | 数据结构：`{ amount, currency, interval }` |
| **FeatureSection** | S5、S7、S8 | 一个组件，用 props 控制主题色和图片左右位置 |
| **分类主题色** | Hero 卡片、功能区块 | 减重 → 薄荷，避孕 → 紫，睡眠 → 蓝，作为数据里的枚举 |
| **SocialLinks** | 评价卡片（深色实心、照片上的白色）、页脚（描边） | 三种外观 |
| **Rating** | 评价卡片的星级 | — |

## 4. 交互 brainstorm（待讨论，每项先给推荐）

通用原则：克制、一致。一套动效 token：
- 颜色变化 150ms，位移 / 缩放 200ms，展开收起 / 菜单 300ms，统一 ease-out
- hover：背景变深一档，箭头右移 2–4px
- 按下：缩放到 0.98
- focus-visible：统一 2px 强调绿描边、偏移 2px
- 禁用：降低不透明度、不响应点击
- 开启“减少动态效果”时：关闭跑马灯和位移动画，只保留颜色变化

| 组件 | 方案 | 推荐 |
| --- | --- | --- |
| 导航 | A 不吸顶 / B 吸顶，滚动后加深阴影 / C 往下滚隐藏、往上滚出现 | **B** |
| 导航链接 | 当前所在区块高亮（scrollspy），或不做 | 可选加分项，先不做 |
| 移动菜单 | A 整屏淡入 / B 从顶部下滑 / C 侧边抽屉 | **A 或 B**，因为设计画的就是整屏面板 |
| 语言胶囊 | A 纯装饰跑马灯，不可交互 / B 跑马灯 + 悬停暂停 + 胶囊 hover 变浅绿 / C 静态换行 | **A + 悬停暂停**。胶囊不是真实的语言切换，做成可点击反而误导 |
| Hero 分类卡片 | A 只有 “See plans” 按钮可点 / B 整张卡片可点，hover 时轻微上浮、图片放大 | **B**（用“伸展链接”写法，避免链接里再嵌套按钮） |
| 服务轮播 | A 原生 scroll-snap + 箭头按钮 / B 引入轮播库 | **A**，到两端时箭头禁用 |
| FAQ | A 同时只能展开一条 / B 可以同时展开多条 | 倾向 **A**，和设计“一条展开”的视觉一致 |
| BMI | A 点击按钮才计算（和设计一致）/ B 输入时实时计算 | **A**；结果出来时仪表有填充动画，刻度条上标出当前位置；“See your GLP-1 Options” 跳到产品卡 |
| 评价卡片社交图标 | A 保留并链接到占位地址 / B 删除（记为设计修正）/ C 保留外观但不可交互 | 待讨论（问题 Q5） |

### 需要用户决定的问题

- **Q1 按钮去向**：Get started、Login、各个 consult 按钮都没有对应页面。A 跳到页内锚点（比如 BMI 或产品卡）/ B 做一个简单的占位页面 / C 弹窗。
- **Q2 Contact Us**：页面里没有联系区块，链接去哪？
- **Q3 移动版减重区块和 BMI**：确认按桌面顺序插回移动页，并且补上单位切换。
- **Q4 Hero 卡片图片**：设计只提供了一张药瓶图。避孕和睡眠卡片是用其他素材替换、生成占位图，还是暂时只修正文字标签？
- **Q5 评价卡片的社交图标**怎么处理（见上表）。
- **Q6 BMI 的性别字段**：保留并参与计算，还是只做展示（BMI 公式不需要性别）？
- **Q7 修正的力度**：🟡 类问题（命名不统一、大小写风格、缺 eyebrow）要不要全部修？原文强调 “where you judge the design wrong”，修太多可能被认为改版过度。

## 4b. 讨论结论（2026-10-01，用户逐块反馈）

### 修正力度原则（Q7）

**只修严重问题**：明显的错别字、语法错误、逻辑错误、功能缺失、明显的对齐问题。单复数这类轻微的措辞问题属于文案范畴，先不改，但要记录在 README 的“已发现但未修改”里，并说明为什么不改（对 UI 影响不大）。

### 确认要修的（实现后写进 README 的 Design deviations）

| # | 区块 | 修正 |
| --- | --- | --- |
| F01 | S3 | “No Issuance Needed” 改为 “No Insurance Needed” |
| F02 | S13 | “Comapny” 改为 “Company” |
| F03 | S5 | “Loss Weight In Your Way.” 改为 “Lose Weight In Your Way.”（只改语法错误，大小写保留原设计，C8） |
| F04 | S8 | “Non-habit-forming Physician-prescribed For sensitive sleepers.” 改为 “Non-habit-forming, physician-prescribed, for sensitive sleepers.” |
| F05 | S9 | “Easy Manager Treatment” 改为 “Easy Treatment Management” |
| F06 | S2 | 把 “Русскийالعربية” 拆成两个胶囊，阿拉伯语加 `lang="ar"` 和 `dir="rtl"` |
| F07 | S10 | “David L” 改为 “David L.” |
| F08 | S6 | BMI 改为真实计算。0 / 56 只是占位，图例文字由阈值数字生成（顺带修好了 “<18.5 - 24.9” 的写法）；“cm/kgs” 改为 “cm / kg” |
| F09 | S5 / S6 移动端 | 把减重区块和 BMI 插回移动页（Q3），移动版 BMI 补上单位切换 |
| F10 | S11 | 补写 FAQ 第 2–4 条的答案（长度不一，用来测试展开效果，见下方问题 C7） |
| F11 | S12 | “Start free consultations” 统一为 “Start a free consultation” |
| F12 | S4 | 两张卡片标题对齐：把 02 的标题往上提，和 01 齐平 |
| F13 | S13 | 页脚右侧边缘统一对齐 |
| F14 | 全局 | 其他明显的高度和对齐不一致问题，统一对齐 |

### 已发现但不修改（写进 README，并说明原因）

- **Hero 和产品卡都用同一张减重药瓶图（Q4）**：用户认为这只是占位图，以后会换，不是 UI 问题。保留原图。
- Wegovy 图片和页脚 “复方药未经 FDA 批准” 的说法存在冲突：属于内容和法务问题。
- 各种小标题不一致：避孕和睡眠区块没有 eyebrow、移动版 FAQ 缺 eyebrow、“FAQs” 的大小写、“WEIGHT MANAGEMENT” 和 “Weight Loss” 叫法不同。
- 措辞问题：“Blogs”、列表项句号不统一、睡眠区块两条勾选项意思重复。
- 评价卡片的社交图标：保留，链接到对应社交平台的官网首页作为占位（Q5）。
- BMI 的性别字段：保留（Q6），处理方式见 C6。
- 标题大小写风格不统一：保留原设计（C8）。
- **Hero 徽章文字对比度不足**（`#21ac88` 14px 文字配白底，约 2.9:1）：这一版不改，产品完成后统一调色时再处理（C10）。

### 交互和动效（用户提出的方向）

**全局一致性**
- 同一类按钮使用同一种反馈，不能出现“都是圆形按钮，但反馈不一样”的情况。
- **桌面端**：hover 时像气泡一样轻微放大、突出；按下时有点击反馈（轻微缩小）。
- **触屏端**：没有 hover，只保留点击反馈，并且要做好。
- **所有圆形图标**（箭头圆、社交图标、FAQ 箭头）：hover 时像气泡一样稍微放大一下。
- 下拉和展开动画要流畅。

| 组件 | 交互 |
| --- | --- |
| 导航 | 吸顶，滚动后加阴影；滚动到对应区块时高亮当前链接；hover 时文字有轻微上浮、突出的感觉 |
| 移动菜单 | 从右上角开始，向左下方逐渐展开（圆形扩散）；内容往下滑出。测试时不流畅就调整 |
| Hero 语言胶囊 | 两行缓慢漂移；鼠标放在中间区域时暂停；**鼠标移到左右两侧渐隐区域时，朝那个方向加速滚动**，方便找到想要的语言；手机上可以左右拖动来快速滑动。**点击或轻触胶囊会高亮选中**，只有视觉上的选中态，不关联任何功能（C1 选 A）。用 JS 实现（C5） |
| Hero 分类卡片 | 整张卡片可以点击；hover 时像气泡一样轻微放大、上浮 |
| 信任条 | **自动、缓慢向左滚动的跑马灯**，不需要用户操作（用户说的“自动转、像走马灯”指的是这里）。用纯 CSS 实现 |
| BMI 单位切换 | 选中块在两个选项之间滑动，滑动过程中像液体一样先拉伸、收缩再到位；点击按钮才计算 |
| 服务轮播 | **不自动播放**（C2）。点箭头切换一张卡片，动画**先快后慢**：快速移到下一张，再稳稳停住；手机上支持手指左右滑动，要有好的手感。滑到两端时箭头显示禁用态（默认方案，用户没有提出循环播放） |
| 评价社交图标 | 真实链接到 x.com、instagram.com、linkedin.com 的官网首页作为占位 |
| FAQ | **可以同时展开多条**；展开、收起要流畅；用短答案和超长答案测试文字是否溢出 |
| 没有目标页面的按钮（Q1、Q2、C3） | **只有按下的动效，不跳转，也不弹提示**。适用于 Get started、Login、Contact Us、各个 consult 按钮、Hero 分类卡片和 “See plans” 等。导航里的 Weight Loss / Birth Control / Sleep 照 S1 的结论，滚动到页面内对应的区块 |
| BMI | 初始状态：输入框为空，结果区显示 “—” 和一句提示，点计算后仪表才出现动画（C9）。性别处理见 C6 |
| 减少动态效果 | 系统开启“减少动态效果”时，关闭自动滚动和弹性动画（无障碍的常规做法） |

### 这一轮问题的结论

| # | 结论 |
| --- | --- |
| C1 | 选 A：胶囊点击后只有视觉高亮；渐隐区域悬停时加速滚动 |
| C2 | 自动跑马灯是 S3 信任条；服务轮播用箭头和滑动切换，先快后慢，不自动播放 |
| C3 | 选 A：只有按下的动效，不跳转 |
| C4 | **引入 [Motion](https://motion.dev)**；如果有问题，退回纯 CSS。实现上，简单的 hover 和过渡用 CSS，液体切换、气泡回弹、菜单展开、轮播用 Motion |
| C5 | 语言胶囊跑马灯用 JS；信任条用纯 CSS |
| C6 | 保留性别，并在结果里体现。**注意**：成人 BMI 的计算公式和分档对男女是一样的。如果为了“显得不同”给男女算出不同的数值，在医疗页面上是错误信息。可行的做法是：数值照实计算，在结果文案里带上性别，比如 “As a woman, your BMI is 24.2 — Healthy weight”。实现前再和用户确认这个做法 |
| C7 | 页面上的 FAQ 写真实答案，长度有短有长；超长答案的极端情况放在 Storybook 测试 |
| C8 | 大小写保留原设计；指出过的问题都记录下来，这一版完成后再优化细节 |
| C9 | 接受：初始为空状态 |
| C10 | 这一版不改，记录下来，以后统一调色时再处理（用户原话是“先进行额外修改”，按上下文理解为“先不做额外修改”） |

## 5. 动态内容候选（下一步设计类型时用）

导航链接；Hero（徽章、带高亮片段的标题、语言列表）；分类卡片；信任条条目；How it works 步骤；三个业务（eyebrow、标题、说明、勾选列表、价格、按钮、图片、主题色）；产品；BMI 配置（分档阈值、单位）；服务轮播卡片；评价；FAQ；结尾 CTA；页脚（链接列、社交链接、免责声明、版权）。

## 6. 素材清单（额度恢复后导出，或由用户手动导出）

- **图片**：Hero 药瓶图、减重人物图、产品药瓶图、BMI 背景照片、避孕人物图、睡眠人物图（含浮层卡片）、轮播卡片 1–4 的图片（手机样机和聊天浮层建议合成一张）、评价人物照片、CTA 水印、页脚巨大字标、Apsu 字标 SVG。
- **图标**：truck、stethoscope、globe-earth、arrow-right-circle（深色 / 白色两种）、check-circle、map-location、payment-success、customer-support、chevron、star、X / Instagram / LinkedIn / Facebook、menu-right、times-circle、sort（输入框上下箭头）、单选按钮。
