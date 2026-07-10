export default {
  site: 'https://ai-education-paradigm.pages.dev',
  lang: 'zh-CN', locale: 'zh-CN', brand: 'AI时代教育新范式', mark: 'AI',
  description: '以Learning Rails、教育Agent、教师监督和学习证据重新思考AI时代的教育。',
  github: 'https://github.com/moseszhu999/ai-education-paradigm',
  nav: [{href:'/articles/',label:'文章'},{href:'/#themes',label:'核心概念'},{href:'/#boundaries',label:'研究路线'},{href:'/about/',label:'关于'}],
  footerText: '研究教师、学生与教育Agent如何在有边界的Learning Rails中协作。',
  aboutLabel: '项目说明', readMore: '阅读全文 →', back: '← 返回全部文章',
  kicker: 'AI-native education paradigm',
  heroTitle: 'AI时代，教育需要新的运行轨道。',
  heroDescription: '教师定义目标、边界和确认规则；教育Agent承担大量个性化执行；学生的理解、错误与成长形成可追溯的学习证据。',
  primaryCta: {href:'/articles/why-ai-changes-education-paradigm/',label:'阅读项目主张'}, secondaryCta:'浏览全部文章',
  heroPanelTitle:'最小教育闭环', heroSteps:['教师建立CourseRail','学生在边界内与教育Agent学习','过程形成学习证据','异常触发教师干预','教师确认正式结果'],
  conceptEyebrow:'Concept system', conceptTitle:'先定义新教育世界的基本对象', conceptDescription:'我们不把AI当作传统课堂的外挂，而是逐步建立一套可讨论、可实验、可验证的教育语言。',
  concepts:['Learning Rails','CourseRails','教育Agent','教师控制台','学习证据','学生学习状态','教师干预点','模型可替换'],
  featuredEyebrow:'Start here', featuredTitle:'首批核心文章', featuredDescription:'从范式、Learning Rails、教育Agent与学习证据四个方向开始。',
  featuredSlugs:['why-ai-changes-education-paradigm','what-are-learning-rails','education-agent-not-chatbot'],
  calloutEyebrow:'Open research agenda', calloutTitle:'这个网站既是内容站，也是公开实验室。', calloutDescription:'接下来将持续发布教师问题、家长问题、术语词典、教育实验、工具模板和真实失败记录，让内容增长成为产品发现与市场验证的一部分。', calloutCta:'了解研究边界',
  knowledgeLabel:'Knowledge base', articlesTitle:'文章与研究笔记', articlesDescription:'围绕真实问题持续积累，而不是批量制造没有新价值的页面。',
  aboutTitle:'不是给旧教育系统增加一个聊天窗口', aboutLead:'本项目研究AI Agent如何改变教师、学生、课程、评价和教育组织之间的关系。',
  aboutHtml:`<h2>当前产品真相</h2><blockquote>教师建立有边界的CourseRails / Learning Rails；学习者在轨道内与教育Agent协作；模型可以替换；ontology构成长期结构资产；生成结果成为正式结果前需要教师确认。</blockquote><h2>我们坚持的边界</h2><ul><li>不把流畅回答等同于学习发生；</li><li>不默认自动评分可以替代教师判断；</li><li>不建立学生或教师的公开排名系统；</li><li>不以持续监控作为个性化学习的代价；</li><li>不让底层模型供应商决定教育体系。</li></ul><h2>为什么先建设内容</h2><p>新范式需要新的概念、公开争论和真实实验。这个网站会把研究问题拆成可搜索页面，并通过读者反馈、搜索数据和教育实践反向帮助产品确定最有价值的切入点。</p>`,
  styles: `:root{--bg:#f7f8fb;--surface:#fff;--surface-strong:#eef2ff;--text:#172033;--muted:#5c667a;--line:#dfe4ee;--brand:#3157d5;--brand-dark:#1c3795;--accent:#0c8f78;--shadow:0 18px 50px rgba(23,32,51,.08);--radius:22px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);line-height:1.7}a{color:inherit}main{min-height:72vh}.container{width:min(1120px,calc(100% - 40px));margin:0 auto}.site-header{position:sticky;top:0;z-index:20;backdrop-filter:blur(14px);background:rgba(247,248,251,.86);border-bottom:1px solid rgba(223,228,238,.8)}.nav{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;font-weight:800}.brand-mark{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:linear-gradient(135deg,var(--brand),var(--accent));color:#fff}.nav-links{display:flex;gap:22px;align-items:center}.nav-links a{text-decoration:none;color:var(--muted);font-weight:650}.nav-links a:hover{color:var(--brand)}.hero{padding:92px 0 70px;background:radial-gradient(circle at 84% 8%,rgba(49,87,213,.18),transparent 35%),radial-gradient(circle at 15% 20%,rgba(12,143,120,.14),transparent 34%)}.hero-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:44px;align-items:center}.kicker,.eyebrow,.category{color:var(--brand);font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:.78rem}h1,h2,h3{line-height:1.18;letter-spacing:-.025em}h1{font-size:clamp(2.6rem,6vw,5.3rem);margin:14px 0 22px}h2{font-size:clamp(2rem,4vw,3.1rem);margin:0 0 16px}h3{font-size:1.35rem}.hero p,.lead{color:var(--muted);font-size:1.15rem}.actions{display:flex;flex-wrap:wrap;gap:14px;margin-top:30px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:999px;text-decoration:none;font-weight:800;background:var(--brand);color:#fff}.button.secondary{background:#fff;color:var(--brand-dark);border:1px solid var(--line)}.hero-panel{background:rgba(255,255,255,.84);border:1px solid rgba(255,255,255,.9);box-shadow:var(--shadow);border-radius:30px;padding:28px}.hero-panel ol{margin:0;padding-left:22px}.hero-panel li{margin:12px 0}.section{padding:78px 0}.section.alt{background:var(--surface);border-block:1px solid var(--line)}.section-head{max-width:760px;margin-bottom:32px}.section-head p{color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:24px;box-shadow:0 10px 30px rgba(23,32,51,.04)}.card p{color:var(--muted)}.card h3 a{text-decoration:none}.card h3 a:hover{color:var(--brand)}.card-meta{display:flex;justify-content:space-between;gap:12px;color:var(--muted);font-size:.85rem}.text-link{color:var(--brand);font-weight:800;text-decoration:none}.pill-list{display:flex;flex-wrap:wrap;gap:10px}.pill{padding:8px 13px;background:var(--surface-strong);border-radius:999px;color:var(--brand-dark);font-weight:700}.callout{background:linear-gradient(135deg,var(--brand-dark),var(--brand));color:#fff;border-radius:28px;padding:36px}.eyebrow.light{color:#fff}.callout p{color:rgba(255,255,255,.83)}.articles-page,.article-shell,.simple-page{width:min(900px,calc(100% - 40px));margin:0 auto;padding:72px 0}.article-list{display:grid;gap:18px;margin-top:34px}.article-header{border-bottom:1px solid var(--line);padding-bottom:30px;margin-bottom:38px}.article-header h1{font-size:clamp(2.4rem,5vw,4.4rem)}.article-meta{display:flex;gap:18px;color:var(--muted);font-size:.9rem}.prose{font-size:1.07rem}.prose h2{margin-top:2.3em;font-size:1.85rem}.prose h3{margin-top:1.8em}.prose p,.prose li{color:#30394b}.prose blockquote{margin:28px 0;padding:18px 24px;border-left:4px solid var(--brand);background:var(--surface-strong);border-radius:0 16px 16px 0}.site-footer{padding:42px 0;border-top:1px solid var(--line);color:var(--muted)}.footer-grid{display:flex;justify-content:space-between;gap:24px}.footer-grid a{color:var(--brand)}@media(max-width:820px){.hero-grid,.grid{grid-template-columns:1fr}.nav-links{display:none}.hero{padding-top:60px}.footer-grid{flex-direction:column}}`,
  favicon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3157d5"/><stop offset="1" stop-color="#0c8f78"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#g)"/><path d="M17 20h30v7H17zm0 17h30v7H17z" fill="white"/><circle cx="24" cy="23.5" r="6" fill="white"/><circle cx="40" cy="40.5" r="6" fill="white"/></svg>`,
  ogImage:`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#172033"/><stop offset=".58" stop-color="#3157d5"/><stop offset="1" stop-color="#0c8f78"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><circle cx="1030" cy="100" r="230" fill="white" opacity=".07"/><circle cx="90" cy="570" r="260" fill="white" opacity=".05"/><text x="90" y="270" fill="white" font-family="Arial,sans-serif" font-weight="700" font-size="72">AI时代教育新范式</text><text x="90" y="350" fill="white" opacity=".82" font-family="Arial,sans-serif" font-size="34">Learning Rails · 教育Agent · 学习证据</text></svg>`,
  articles:[
    {slug:'why-ai-changes-education-paradigm',title:'AI时代为什么会发生教育范式改变',description:'AI改变的不只是备课、批改和答疑工具，而是教师、学生、课程、评价与教育组织之间的关系。',publishedAt:'2026-07-10',category:'教育新范式',keywords:['AI教育','教育范式','教育Agent','个性化学习'],body:`很多所谓的“AI教育”，只是把大模型放进旧课堂：AI帮助教师备课，帮助学生答题，帮助机构生成报告。这些功能有价值，但它们仍然默认原有结构不变——统一班级、统一课程、统一进度、统一作业、统一考试。

真正的范式变化发生在另一层：**每个学生可以拥有持续工作的教育Agent，教师可以通过一套有边界的学习轨道管理大量不同的学习路径。**

## 旧范式的基本结构

传统规模化教育依靠标准化解决成本问题：

- 同年龄学生进入同一班级；
- 同一时间学习同一内容；
- 教师向全班提供相同讲解；
- 作业与考试承担主要反馈功能；
- 教师只能在有限时间里照顾少数明显异常。

这种结构的优势是可复制，问题是无法真正适应个体差异。

## AI带来的结构性变化

教育Agent可以持续观察学生的提问、错误、修改、解释与作品，并据此调整任务难度、反馈方式和下一步路径。于是教育不再只能围绕“班级平均水平”组织，而可以同时维持多条学习轨道。

教师的价值并不会消失。相反，教师从重复讲解者转向：

1. 设定学习目标和边界；
2. 设计可执行的CourseRails；
3. 监督Agent与学生的互动；
4. 识别误解、依赖、停滞和情绪风险；
5. 在关键节点进行人类干预；
6. 对正式学习结论进行确认。

## 最小可验证单元

新范式不需要从建设一所“未来学校”开始。一个可验证单元已经足够：

> 一个教师、一组学生、每个学生的教育Agent、一条有边界的Learning Rail，以及一套能够追溯的学习证据。

只要这个单元能够证明教师工作量下降、学生路径出现真实差异、学习证据更加连续，新范式就开始成立。

## 我们要验证的不是AI会不会讲题

真正的问题是：

- 一个教师能否有效监督几十条不同学习路径？
- Agent能否在不越权、不直接给答案的情况下促进思考？
- 学习评价能否从单次分数转为连续证据？
- 教师能否准确知道何时必须介入？

这就是本项目希望持续公开研究和实验的问题。`},
    {slug:'what-are-learning-rails',title:'Learning Rails是什么',description:'Learning Rails是一套由教师定义目标、资源、权限、检查点和干预规则的AI原生学习轨道。',publishedAt:'2026-07-10',category:'Learning Rails',keywords:['Learning Rails','CourseRails','AI学习路径','教育Agent'],body:`Learning Rails不是一张固定课程表，也不是让AI自由决定一切。它是一套由教师设计、由教育Agent执行和调整、由学习证据持续校验的学习运行轨道。

## 一条Learning Rail至少包含什么

- 明确的学习目标；
- 学生当前状态与先决条件；
- 允许使用的知识来源和材料；
- Agent可以执行的教学动作；
- Agent不能越过的权限边界；
- 阶段性检查点；
- 必须触发教师介入的条件；
- 能够证明学习发生的证据；
- 教师确认正式结果的节点。

## 它与固定课程有什么不同

固定课程强调“所有人按相同顺序完成相同内容”。Learning Rails强调目标和边界稳定，但路径可以根据学生状态动态变化。

例如，两个学生都在学习分数：一个学生的问题是概念理解，另一个学生的问题是计算粗心。他们可以位于同一条课程轨道，却接受不同的解释、练习和反馈。

## 为什么需要Rails

完全开放的AI聊天存在几个教育风险：

- 学生的问题可能不断偏离目标；
- Agent可能直接给出答案；
- 不同模型的行为难以保持一致；
- 教师无法判断学生真正经历了什么；
- 系统容易把语言流畅误认为知识掌握。

Rails把AI能力放进可监督的教育结构中。模型可以更换，但目标、规则、证据和教师权限仍然稳定。

## Learning Rails不是自动驾驶教育

它更像有明确线路、信号和调度规则的铁路系统。Agent负责大量运行工作，教师仍然掌握线路设计、异常处理和正式确认。`},
    {slug:'education-agent-not-chatbot',title:'教育Agent不是一个AI聊天机器人',description:'真正的教育Agent需要持续状态、教学边界、证据记录与教师升级机制，而不只是即时回答问题。',publishedAt:'2026-07-10',category:'教育Agent',keywords:['教育Agent','AI导师','聊天机器人','教师监督'],body:`聊天机器人以当前对话为中心，教育Agent则以学生的长期成长为中心。

## 普通聊天机器人的典型行为

它接收一个问题，生成一个看起来合理的回答。回答结束后，任务基本结束。

## 教育Agent需要多出的能力

1. **理解目标**：知道学生当前正在完成哪一条学习轨道。
2. **维护状态**：区分已经掌握、暂时会做、存在误解和尚未接触。
3. **控制帮助程度**：优先提问、提示和分解，而不是直接替学生完成。
4. **记录证据**：保存关键错误、解释、修改和作品，而不是只保存聊天记录。
5. **识别风险**：发现依赖、挫败、持续停滞或不适当内容。
6. **请求教师介入**：知道什么时候自己不应该继续。

## 判断教育Agent的简单问题

不要只问“回答是否正确”，还要问：

- 它是否帮助学生形成了自己的解释？
- 它是否知道学生为什么出错？
- 它是否根据前面的证据改变了教学动作？
- 它是否留下教师可以检查的依据？
- 它是否在需要时停止并升级给教师？

如果这些问题都无法回答，那么它更接近聊天工具，而不是教育Agent。`},
    {slug:'how-teachers-manage-student-agents',title:'一个教师如何管理多个学生Agent',description:'教师不需要阅读所有对话，而应通过异常、证据缺口、干预请求和学习状态变化管理Agent网络。',publishedAt:'2026-07-10',category:'教师的新角色',keywords:['教师控制台','学生Agent','人机协同教学','教师干预'],body:`如果每个学生都有一个教育Agent，教师是否会被几十条甚至几百条对话淹没？答案取决于系统是否仍然按照“逐条查看”的旧方式设计。

## 教师不应管理全部过程

教师控制台应该优先呈现：

- 长时间没有进展的学生；
- 连续出现同一种误解的学生；
- Agent无法确定下一步的案例；
- 可能出现直接抄答案或过度依赖的行为；
- 学习证据不足但系统准备提高难度的情况；
- 需要情感支持、动机判断或价值判断的问题。

## 从内容生产者到学习调度者

教师仍然可以讲解，但不再需要把全部时间用于重复性讲解和批改。更多时间将用于：

- 设计学习目标；
- 确认轨道是否合理；
- 查看高风险与高不确定性案例；
- 对学生进行短而精准的人工干预；
- 更新Agent的边界和策略。

## 衡量教师控制台是否有效

一个好的教师控制台不以展示更多数据为目标，而以减少无效注意力为目标。它应当回答：

> 今天哪几个学生最需要我，以及为什么？

这可能是AI时代教师工作方式变化的关键界面。`},
    {slug:'learning-evidence-beyond-scores',title:'学习证据比考试分数多了什么',description:'学习证据记录学生如何理解、出错、修正与迁移，让评价从结果数字转向可追溯的学习过程。',publishedAt:'2026-07-10',category:'学习证据',keywords:['学习证据','形成性评价','能力画像','AI教育评价'],body:`分数告诉我们一次任务得到了多少分，却经常无法解释学生为什么得到这个分数。

## 学习证据可以包括什么

- 学生第一次给出的解释；
- 关键错误及其原因；
- 接受提示后的修改过程；
- 能否用自己的语言重新说明；
- 能否把知识迁移到新问题；
- 多次学习后是否仍然保持掌握；
- 作品、演示、对话和实践任务；
- 教师的人工观察与确认。

## 为什么AI时代更需要证据

AI可以生成正确答案，也可以帮助学生生成看似完整的作品。因此，仅看最终结果越来越难判断知识是否真正属于学生。

评价需要追踪学生与任务互动的过程，并区分：

- 学生独立完成；
- 在提示后完成；
- 由AI主要完成；
- 学生能够解释但暂时无法熟练执行；
- 学生能够在新情境中迁移。

## 证据不等于监控

学习证据系统必须遵守最小化原则。它不应收集与学习无关的持续监控数据，也不应把学生变成一个公开排名数字。

目标是帮助学生和教师理解学习状态，而不是制造新的 surveillance system。`},
    {slug:'from-education-management-to-ai-native-education',title:'从教培管理系统到AI原生教育系统',description:'传统教培系统管理学生、课程、排课和收费；AI原生教育系统还需要管理学习状态、Agent、证据和教师干预。',publishedAt:'2026-07-10',category:'实践反思',keywords:['教培管理系统','AI原生教育','教育数字化','Learning Rails'],body:`我曾长期建设教培管理系统。它可以管理试听、学生、课程、班级、排课、考勤、订单、课耗和教师统计。这些能力解决了机构运营中的真实问题，但它们主要回答的是：

> 一家教育机构如何更有效地管理业务？

AI时代还需要回答另一个问题：

> 学习本身如何被重新组织？

## 传统系统的中心对象

传统教培系统围绕这些对象运行：

- 学生档案；
- 课程和班级；
- 教师与校区；
- 排课和出勤；
- 订单、缴费与课耗；
- 经营统计。

这些对象非常重要，却无法完整表达学生是否真正理解、Agent做了什么、教师为什么介入，以及下一步路径为何改变。

## AI原生系统需要新增的对象

- 学习目标；
- Learning Rail / CourseRail；
- 学生学习状态；
- 教育Agent；
- 允许与禁止的Agent动作；
- 学习证据；
- 证据缺口；
- 教师干预请求；
- 教师确认；
- 路径调整记录。

## 旧系统不是包袱

运营系统积累了真实机构场景、角色、流程和数据边界。它可以成为新范式的实验入口，但不能通过简单增加一个聊天窗口完成转型。

真正的升级，是把系统中心从“课程和订单的管理”逐步移动到“学习轨道、证据和人机协同的管理”。`}
  ]
};
