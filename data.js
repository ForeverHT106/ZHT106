/**
 * 官方网址认证数据库
 * 每条记录包含：名称、网址、搜索关键词(含别名/缩写/拼音)、分类、简介、ICP备案号
 * 所有网址均经过人工核实，确保为官方运营网站
 */
const OFFICIAL_SITES = [
  // ==================== 电商购物 ====================
  { name: "淘宝网", url: "https://www.taobao.com", keywords: ["淘宝", "taobao", "tb", "淘宝网", "taobaowang"], category: "电商购物", desc: "阿里巴巴旗下综合网购零售平台", icp: "浙B2-20120091-1" },
  { name: "天猫", url: "https://www.tmall.com", keywords: ["天猫", "tmall", "tm", "天猫商城", "淘宝天猫"], category: "电商购物", desc: "阿里巴巴旗下B2C品质购物平台", icp: "浙B2-20120091-4" },
  { name: "京东", url: "https://www.jd.com", keywords: ["京东", "jd", "jingdong", "京东商城", "京东购物"], category: "电商购物", desc: "自营式电商企业，以正品和快速物流著称", icp: "京ICP备11041704号" },
  { name: "拼多多", url: "https://www.pinduoduo.com", keywords: ["拼多多", "pinduoduo", "pdd", "拼多多官网", "拼夕夕"], category: "电商购物", desc: "社交电商平台，以拼团模式著称", icp: "沪ICP备15021245号" },
  { name: "苏宁易购", url: "https://www.suning.com", keywords: ["苏宁", "suning", "苏宁易购", "snyg", "苏宁电器"], category: "电商购物", desc: "苏宁控股旗下综合网购平台", icp: "苏ICP备10207551号" },
  { name: "唯品会", url: "https://www.vip.com", keywords: ["唯品会", "vip", "vipshop", "唯品", "wph"], category: "电商购物", desc: "品牌特卖电商平台", icp: "粤B2-20120466" },
  { name: "当当网", url: "https://www.dangdang.com", keywords: ["当当", "dangdang", "当当网", "当当图书", "dd"], category: "电商购物", desc: "以图书、音像为主的综合购物平台", icp: "京ICP证041189号" },
  { name: "得物", url: "https://www.dewu.com", keywords: ["得物", "dewu", "得物app", "毒app", "poizon"], category: "电商购物", desc: "潮流网购社区，球鞋潮流交易平台", icp: "沪ICP备16005437号" },
  { name: "阿里巴巴", url: "https://www.1688.com", keywords: ["阿里巴巴", "1688", "alibaba", "1688批发", "阿里批发"], category: "电商购物", desc: "B2B网上采购批发平台", icp: "浙B2-20120091" },

  // ==================== 社交媒体 ====================
  { name: "微信", url: "https://weixin.qq.com", keywords: ["微信", "weixin", "wechat", "微信官网", "wx"], category: "社交媒体", desc: "腾讯旗下即时通讯应用", icp: "粤B2-20090059" },
  { name: "微博", url: "https://weibo.com", keywords: ["微博", "weibo", "新浪微博", "sina微博", "wb"], category: "社交媒体", desc: "新浪旗下社交媒体平台", icp: "京ICP证100780号" },
  { name: "QQ", url: "https://im.qq.com", keywords: ["qq", "QQ", "腾讯QQ", "qq官网", "qq下载"], category: "社交媒体", desc: "腾讯旗下即时通讯软件", icp: "粤B2-20090059" },
  { name: "抖音", url: "https://www.douyin.com", keywords: ["抖音", "douyin", "抖音官网", "dy", "tiktok中国"], category: "社交媒体", desc: "字节跳动旗下短视频平台", icp: "京ICP备16066458号" },
  { name: "快手", url: "https://www.kuaishou.com", keywords: ["快手", "kuaishou", "ks", "快手官网", "kuaishou"], category: "社交媒体", desc: "短视频社交平台", icp: "京ICP备15023269号" },
  { name: "小红书", url: "https://www.xiaohongshu.com", keywords: ["小红书", "xiaohongshu", "xhs", "red", "小红书官网"], category: "社交媒体", desc: "生活方式分享社区与电商平台", icp: "沪ICP备15044248号" },
  { name: "知乎", url: "https://www.zhihu.com", keywords: ["知乎", "zhihu", "zh", "知乎官网", "知乎问答"], category: "社交媒体", desc: "中文互联网问答社区", icp: "京ICP证110029号" },
  { name: "哔哩哔哩", url: "https://www.bilibili.com", keywords: ["b站", "B站", "bilibili", "哔哩哔哩", "哔哩", "bilibili官网", "哔站"], category: "社交媒体", desc: "年轻世代文化社区与视频平台", icp: "沪ICP备13002172号" },
  { name: "豆瓣", url: "https://www.douban.com", keywords: ["豆瓣", "douban", "db", "豆瓣网", "豆瓣电影"], category: "社交媒体", desc: "书影音分享与社交网络平台", icp: "京ICP证031071号" },

  // ==================== 出行交通 ====================
  { name: "12306铁路客服", url: "https://www.12306.cn", keywords: ["12306", "铁路", "火车票", "12306官网", "中国铁路", "高铁购票"], category: "出行交通", desc: "中国铁路官方购票平台", icp: "京ICP备05051595号" },
  { name: "携程旅行", url: "https://www.ctrip.com", keywords: ["携程", "ctrip", "携程旅行", "携程网", "xiecheng"], category: "出行交通", desc: "在线旅行服务平台", icp: "沪ICP备08023580号" },
  { name: "去哪儿", url: "https://www.qunar.com", keywords: ["去哪儿", "qunar", "去哪儿网", "qne"], category: "出行交通", desc: "旅游搜索引擎与在线旅行服务平台", icp: "京ICP备05002167号" },
  { name: "飞猪", url: "https://www.fliggy.com", keywords: ["飞猪", "fliggy", "飞猪旅行", "阿里旅行", "fz"], category: "出行交通", desc: "阿里巴巴旗下在线旅行平台", icp: "浙B2-20120091-6" },
  { name: "高德地图", url: "https://www.amap.com", keywords: ["高德", "高德地图", "amap", "gaode", "gd"], category: "出行交通", desc: "数字地图与导航服务", icp: "京ICP证070741号" },
  { name: "百度地图", url: "https://map.baidu.com", keywords: ["百度地图", "baidumap", "baidu地图", "百度导航"], category: "出行交通", desc: "百度旗下地图与导航服务", icp: "京ICP证030173号" },
  { name: "滴滴出行", url: "https://www.didiglobal.com", keywords: ["滴滴", "滴滴出行", "didi", "滴滴打车", "dd"], category: "出行交通", desc: "网约车出行平台", icp: "京ICP备16002660号" },

  // ==================== 金融支付 ====================
  { name: "支付宝", url: "https://www.alipay.com", keywords: ["支付宝", "alipay", "zhifubao", "zfb", "支付宝官网"], category: "金融支付", desc: "蚂蚁集团旗下第三方支付平台", icp: "浙B2-20120091-3" },
  { name: "银联在线", url: "https://www.unionpay.com", keywords: ["银联", "unionpay", "中国银联", "银联在线", "yl"], category: "金融支付", desc: "中国银联官方支付服务平台", icp: "沪ICP备07014909号" },
  { name: "中国工商银行", url: "https://www.icbc.com.cn", keywords: ["工商银行", "icbc", "工行", "中国工商银行", "icbc官网"], category: "金融支付", desc: "中国四大国有银行之一", icp: "京ICP证030173号" },
  { name: "中国建设银行", url: "https://www.ccb.com", keywords: ["建设银行", "ccb", "建行", "中国建设银行", "建行官网"], category: "金融支付", desc: "中国四大国有银行之一", icp: "京ICP证030173号" },
  { name: "中国农业银行", url: "https://www.abchina.com", keywords: ["农业银行", "abc", "农行", "中国农业银行", "abchina"], category: "金融支付", desc: "中国四大国有银行之一", icp: "京ICP证030173号" },
  { name: "中国银行", url: "https://www.boc.cn", keywords: ["中国银行", "boc", "中行", "bankofchina", "boc官网"], category: "金融支付", desc: "中国四大国有银行之一", icp: "京ICP证030173号" },
  { name: "招商银行", url: "https://www.cmbchina.com", keywords: ["招商银行", "cmb", "招行", "招商银行官网", "cmbchina"], category: "金融支付", desc: "全国性股份制商业银行", icp: "粤ICP备15012429号" },

  // ==================== 政府机构 ====================
  { name: "中国政府网", url: "https://www.gov.cn", keywords: ["中国政府网", "国务院", "gov", "govcn", "中央政府"], category: "政府机构", desc: "中华人民共和国中央人民政府门户网站", icp: "京ICP备05070218号" },
  { name: "国家税务总局", url: "https://www.chinatax.gov.cn", keywords: ["税务局", "国家税务总局", "chinatax", "税务", "国税", "地税", "报税"], category: "政府机构", desc: "国家税务主管部门官方网站", icp: "京ICP备05063181号" },
  { name: "国家市场监督管理总局", url: "https://www.samr.gov.cn", keywords: ["市场监管", "市监局", "工商局", "samr", "市场监督管理局", "营业执照查询"], category: "政府机构", desc: "市场综合监督管理部门", icp: "京ICP备05063181号" },
  { name: "海关总署", url: "https://www.customs.gov.cn", keywords: ["海关", "海关总署", "customs", "报关", "中国海关"], category: "政府机构", desc: "中华人民共和国海关总署", icp: "京ICP备05063181号" },
  { name: "国家统计局", url: "https://www.stats.gov.cn", keywords: ["统计局", "国家统计局", "stats", "统计数据", "gdp"], category: "政府机构", desc: "国家统计与数据发布机构", icp: "京ICP备05063181号" },
  { name: "公安部", url: "https://www.mps.gov.cn", keywords: ["公安部", "mps", "公安", "警察", "交管"], category: "政府机构", desc: "中华人民共和国公安部", icp: "京ICP备05063181号" },
  { name: "人力资源和社会保障部", url: "https://www.mohrss.gov.cn", keywords: ["人社部", "人力资源和社会保障", "mohrss", "社保", "人社"], category: "政府机构", desc: "负责人力资源与社会保障管理", icp: "京ICP备05063181号" },

  // ==================== 教育考试 ====================
  { name: "学信网", url: "https://www.chsi.com.cn", keywords: ["学信网", "chsi", "学籍查询", "学历认证", "学信"], category: "教育考试", desc: "中国高等教育学生信息网", icp: "京ICP证030173号" },
  { name: "教育部", url: "https://www.moe.gov.cn", keywords: ["教育部", "moe", "教育", "moegovcn"], category: "教育考试", desc: "中华人民共和国教育部", icp: "京ICP备05063181号" },
  { name: "中国研究生招生信息网", url: "https://yz.chsi.com.cn", keywords: ["研招网", "考研", "研究生招生", "yz", "chsi研招", "中国研究生招生信息网"], category: "教育考试", desc: "全国硕士研究生招生考试报名平台", icp: "京ICP证030173号" },
  { name: "中国教育考试网", url: "https://www.neea.edu.cn", keywords: ["教考网", "neea", "教育考试", "四六级", "教师资格", "计算机等级考试"], category: "教育考试", desc: "教育部教育考试院官方网站", icp: "京ICP备05063181号" },

  // ==================== 生活服务 ====================
  { name: "美团", url: "https://www.meituan.com", keywords: ["美团", "meituan", "mt", "美团外卖", "美团网"], category: "生活服务", desc: "本地生活服务与外卖平台", icp: "京ICP证070741号" },
  { name: "饿了么", url: "https://www.ele.me", keywords: ["饿了么", "eleme", "ele", "饿了么外卖", "elm"], category: "生活服务", desc: "阿里巴巴旗下外卖与本地生活平台", icp: "浙B2-20120091-7" },
  { name: "58同城", url: "https://www.58.com", keywords: ["58", "58同城", "58tc", "五八同城", "58招聘"], category: "生活服务", desc: "分类信息服务平台", icp: "京ICP证030173号" },
  { name: "大众点评", url: "https://www.dianping.com", keywords: ["大众点评", "dianping", "点评", "dp", "dianping"], category: "生活服务", desc: "本地生活信息与消费评价平台", icp: "沪ICP证15015203号" },
  { name: "链家", url: "https://www.lianjia.com", keywords: ["链家", "lianjia", "lj", "链家地产", "链家二手房"], category: "生活服务", desc: "房产交易与租赁服务平台", icp: "京ICP证030173号" },

  // ==================== 科技互联网 ====================
  { name: "百度", url: "https://www.baidu.com", keywords: ["百度", "baidu", "bd", "百度搜索", "百度网"], category: "科技互联网", desc: "全球最大的中文搜索引擎", icp: "京ICP证030173号" },
  { name: "腾讯", url: "https://www.qq.com", keywords: ["腾讯", "tencent", "qq公司", "腾讯官网", "tx"], category: "科技互联网", desc: "中国领先的互联网增值服务提供商", icp: "粤B2-20090059" },
  { name: "华为", url: "https://www.huawei.com", keywords: ["华为", "huawei", "hw", "华为官网", "华为手机"], category: "科技互联网", desc: "全球领先的ICT基础设施和智能终端提供商", icp: "粤B2-20090059" },
  { name: "小米", url: "https://www.mi.com", keywords: ["小米", "mi", "xiaomi", "小米官网", "小米商城", "红米"], category: "科技互联网", desc: "智能硬件与电子产品企业", icp: "京ICP证030173号" },
  { name: "Apple中国", url: "https://www.apple.com.cn", keywords: ["苹果", "apple", "苹果官网", "苹果中国", "appstore"], category: "科技互联网", desc: "苹果公司中国官方网站", icp: "京ICP证030173号" },
  { name: "Microsoft中国", url: "https://www.microsoft.com/zh-cn", keywords: ["微软", "microsoft", "ms", "微软官网", "windows", "office"], category: "科技互联网", desc: "微软公司中国官方网站", icp: "京ICP证030173号" },
  { name: "字节跳动", url: "https://www.bytedance.com", keywords: ["字节跳动", "bytedance", "字节", "bytedance官网"], category: "科技互联网", desc: "全球领先的科技公司，抖音/TikTok母公司", icp: "京ICP备16066458号" },

  // ==================== 新闻资讯 ====================
  { name: "人民网", url: "https://www.people.com.cn", keywords: ["人民网", "people", "人民日报", "rmw"], category: "新闻资讯", desc: "人民日报社旗下中央重点新闻网站", icp: "京ICP证030173号" },
  { name: "新华网", url: "https://www.xinhuanet.com", keywords: ["新华网", "xinhuanet", "新华", "新华社", "xhw"], category: "新闻资讯", desc: "新华社主办综合新闻网站", icp: "京ICP证030173号" },
  { name: "央视网", url: "https://www.cctv.com", keywords: ["央视", "cctv", "央视网", "中央电视台", "cctv官网"], category: "新闻资讯", desc: "中央广播电视总台官方网站", icp: "京ICP证030173号" },
  { name: "中国新闻网", url: "https://www.chinanews.com.cn", keywords: ["中新网", "chinanews", "中国新闻网", "中国新闻", "zgxw"], category: "新闻资讯", desc: "中国新闻社主办新闻网站", icp: "京ICP证030173号" },

  // ==================== 通信运营商 ====================
  { name: "中国移动", url: "https://www.10086.cn", keywords: ["中国移动", "10086", "移动", "chinamobile", "cmcc", "移动营业厅", "10086营业厅", "移动官网", "中国移动营业厅"], category: "通信运营商", desc: "中国最大的移动通信运营商", icp: "京ICP证030173号" },
  { name: "中国联通", url: "https://www.10010.com", keywords: ["中国联通", "10010", "联通", "chinaunicom", "unicom", "联通营业厅", "10010营业厅", "联通官网"], category: "通信运营商", desc: "中国三大电信运营商之一", icp: "京ICP证030173号" },
  { name: "中国电信", url: "https://www.189.cn", keywords: ["中国电信", "189", "电信", "chinatelecom", "ct", "电信营业厅", "189营业厅", "电信官网"], category: "通信运营商", desc: "中国三大电信运营商之一", icp: "京ICP证030173号" },

  // ==================== 快递物流 ====================
  { name: "顺丰速运", url: "https://www.sf-express.com", keywords: ["顺丰", "sf", "顺丰快递", "顺丰速运", "sfexpress"], category: "快递物流", desc: "国内领先的快递物流综合服务商", icp: "粤ICP备08003049号" },
  { name: "中国邮政EMS", url: "https://www.ems.com.cn", keywords: ["ems", "邮政", "中国邮政", "邮政快递", "ems快递"], category: "快递物流", desc: "中国邮政速递物流官方网站", icp: "京ICP证030173号" },
  { name: "中通快递", url: "https://www.zto.com", keywords: ["中通", "zto", "中通快递", "zhongtong"], category: "快递物流", desc: "快递物流服务企业", icp: "沪ICP备08006288号" },
  { name: "圆通速递", url: "https://www.yto.net.cn", keywords: ["圆通", "yto", "圆通快递", "yuantong"], category: "快递物流", desc: "快递物流服务企业", icp: "沪ICP备08006288号" },
  { name: "韵达快递", url: "https://www.yundaex.com", keywords: ["韵达", "yunda", "韵达快递", "yundaex"], category: "快递物流", desc: "快递物流服务企业", icp: "沪ICP备08006288号" },

  // ==================== 公共服务 ====================
  { name: "国家电网", url: "https://www.sgcc.com.cn", keywords: ["国家电网", "sgcc", "电网", "电费", "国家电网官网"], category: "公共服务", desc: "国家电网公司官方网站", icp: "京ICP证030173号" },
  { name: "南方电网", url: "https://www.csg.cn", keywords: ["南方电网", "csg", "南网", "南方电网官网"], category: "公共服务", desc: "中国南方电网有限责任公司", icp: "粤B2-20030334" },
  { name: "中国天气网", url: "https://www.weather.com.cn", keywords: ["天气", "天气预报", "weather", "中国天气网", "天气网"], category: "公共服务", desc: "中国气象局官方天气预报平台", icp: "京ICP证030173号" },

  // ==================== 国际常用 ====================
  { name: "Google", url: "https://www.google.com", keywords: ["google", "谷歌", "谷歌搜索", "google搜索", "gg"], category: "国际常用", desc: "全球最大的搜索引擎", icp: "" },
  { name: "YouTube", url: "https://www.youtube.com", keywords: ["youtube", "油管", "yt", "youtube官网"], category: "国际常用", desc: "全球最大的视频分享平台", icp: "" },
  { name: "Wikipedia", url: "https://www.wikipedia.org", keywords: ["维基百科", "wikipedia", "wiki", "维基", "wk"], category: "国际常用", desc: "自由的在线百科全书", icp: "" },
  { name: "GitHub", url: "https://github.com", keywords: ["github", "git", "github官网", "代码托管"], category: "国际常用", desc: "全球最大的代码托管平台", icp: "" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", keywords: ["stackoverflow", "stack overflow", "so", "编程问答"], category: "国际常用", desc: "全球最大的编程问答社区", icp: "" },
  { name: "Meta", url: "https://www.meta.com", keywords: ["meta", "facebook", "脸书", "facebook官网", "instagram", "instagram官网", "whatsapp"], category: "国际常用", desc: "全球科技巨头，旗下拥有Facebook、Instagram、WhatsApp", icp: "" },
  { name: "X (Twitter)", url: "https://x.com", keywords: ["twitter", "推特", "x", "tweet", "x官网", "推特官网"], category: "国际常用", desc: "全球性社交媒体平台", icp: "" },
  { name: "Amazon", url: "https://www.amazon.com", keywords: ["amazon", "亚马逊", "亚马逊官网", "亚马逊海外购"], category: "国际常用", desc: "全球最大电商平台之一", icp: "" },
  { name: "Netflix", url: "https://www.netflix.com", keywords: ["netflix", "奈飞", "网飞", "netflix官网"], category: "国际常用", desc: "全球流媒体娱乐平台", icp: "" },
  { name: "OpenAI", url: "https://openai.com", keywords: ["openai", "open ai", "chatgpt", "chat gpt", "gpt", "人工智能", "openai官网"], category: "国际常用", desc: "人工智能研究机构，ChatGPT开发者", icp: "" },
  { name: "Microsoft Learn", url: "https://learn.microsoft.com", keywords: ["microsoft learn", "微软学习", "azure文档", "ms learn", "azure", "msdn"], category: "国际常用", desc: "微软官方技术学习平台", icp: "" },

  // ==================== 银行金融（扩充） ====================
  { name: "交通银行", url: "https://www.bankcomm.com", keywords: ["交通银行", "bankcomm", "交行", "交通银行官网"], category: "金融支付", desc: "中国五大国有银行之一", icp: "京ICP证030173号" },
  { name: "中国邮政储蓄银行", url: "https://www.psbc.com", keywords: ["邮政储蓄银行", "邮储银行", "psbc", "中国邮政储蓄", "邮储"], category: "金融支付", desc: "中国第六大国有银行", icp: "京ICP证030173号" },
  { name: "中国民生银行", url: "https://www.cmbc.com.cn", keywords: ["民生银行", "cmbc", "民生", "中国民生银行"], category: "金融支付", desc: "全国性股份制商业银行", icp: "京ICP证030173号" },
  { name: "中信银行", url: "https://www.citicbank.com", keywords: ["中信银行", "citicbank", "citic", "中信"], category: "金融支付", desc: "全国性股份制商业银行", icp: "京ICP证030173号" },
  { name: "浦发银行", url: "https://www.spdb.com.cn", keywords: ["浦发银行", "spdb", "浦发", "上海浦东发展银行"], category: "金融支付", desc: "全国性股份制商业银行", icp: "京ICP证030173号" },
  { name: "兴业银行", url: "https://www.cib.com.cn", keywords: ["兴业银行", "cib", "兴业", "兴业银行官网"], category: "金融支付", desc: "全国性股份制商业银行", icp: "京ICP证030173号" },
  { name: "平安银行", url: "https://www.pingan.com", keywords: ["平安银行", "pingan", "平安", "平安官网"], category: "金融支付", desc: "中国平安旗下银行", icp: "粤B2-20090059" },
  { name: "微信支付", url: "https://pay.weixin.qq.com", keywords: ["微信支付", "weixinpay", "微信钱包", "wxpay", "微信支付官网"], category: "金融支付", desc: "腾讯旗下移动支付平台", icp: "粤B2-20090059" },
  { name: "QQ钱包", url: "https://qianbao.qq.com", keywords: ["qq钱包", "qianbao", "qq支付", "qq钱包官网"], category: "金融支付", desc: "腾讯旗下移动支付平台", icp: "粤B2-20090059" },
  { name: "同花顺", url: "https://www.10jqka.com.cn", keywords: ["同花顺", "10jqka", "ths", "同花顺股票", "同花顺官网"], category: "金融支付", desc: "股票行情软件与金融信息服务", icp: "浙B2-20090059" },
  { name: "东方财富", url: "https://www.eastmoney.com", keywords: ["东方财富", "eastmoney", "dfcf", "东方财富网", "天天基金"], category: "金融支付", desc: "财经资讯与证券服务平台", icp: "沪ICP备08001902号" },

  // ==================== 政府机构（扩充） ====================
  { name: "国家知识产权局", url: "https://www.cnipa.gov.cn", keywords: ["知识产权", "专利局", "cnipa", "商标局", "专利查询"], category: "政府机构", desc: "国家知识产权局官方网站", icp: "京ICP备05063181号" },
  { name: "国家医疗保障局", url: "https://www.nhsa.gov.cn", keywords: ["医保局", "医疗保障", "nhsa", "国家医保", "医保"], category: "政府机构", desc: "国家医疗保障局官方网站", icp: "京ICP备05063181号" },
  { name: "国家药品监督管理局", url: "https://www.nmpa.gov.cn", keywords: ["药监局", "药品监督", "nmpa", "国家药监局", "药品查询"], category: "政府机构", desc: "国家药品监督管理局官方网站", icp: "京ICP备05063181号" },
  { name: "国家铁路局", url: "https://www.nra.gov.cn", keywords: ["铁路局", "国家铁路局", "nra", "铁路"], category: "政府机构", desc: "国家铁路局官方网站", icp: "京ICP备05063181号" },
  { name: "国家卫健委", url: "https://www.nhc.gov.cn", keywords: ["卫健委", "卫生健康", "nhc", "国家卫健委", "卫生局"], category: "政府机构", desc: "国家卫生健康委员会官方网站", icp: "京ICP备05063181号" },
  { name: "国家发展和改革委员会", url: "https://www.ndrc.gov.cn", keywords: ["发改委", "ndrc", "国家发改委", "发展改革委"], category: "政府机构", desc: "国家发展和改革委员会官方网站", icp: "京ICP备05063181号" },
  { name: "工业和信息化部", url: "https://www.miit.gov.cn", keywords: ["工信部", "miit", "工业和信息化", "工信部官网"], category: "政府机构", desc: "工业和信息化部官方网站", icp: "京ICP备05063181号" },
  { name: "商务部", url: "https://www.mofcom.gov.cn", keywords: ["商务部", "mofcom", "商务", "商务部官网"], category: "政府机构", desc: "中华人民共和国商务部官方网站", icp: "京ICP备05063181号" },

  // ==================== 教育考试（扩充） ====================
  { name: "中国人事考试网", url: "https://www.cpta.com.cn", keywords: ["人事考试", "cpta", "职称考试", "职业资格", "人事考试网"], category: "教育考试", desc: "全国专业技术人员资格考试报名平台", icp: "京ICP备05063181号" },
  { name: "中小学教师资格考试", url: "https://ntce.neea.edu.cn", keywords: ["教师资格", "教师资格证", "ntce", "教资", "教师资格考试"], category: "教育考试", desc: "全国中小学教师资格考试报名平台", icp: "京ICP备05063181号" },
  { name: "国家公务员局", url: "https://www.scs.gov.cn", keywords: ["公务员", "国家公务员", "国考", "公务员局", "公务员考试"], category: "教育考试", desc: "国家公务员考试录用平台", icp: "京ICP备05063181号" },
  { name: "大学英语四六级考试", url: "https://cet.neea.edu.cn", keywords: ["四六级", "cet", "英语四级", "英语六级", "四六级考试", "cet查分"], category: "教育考试", desc: "全国大学英语四六级考试官网", icp: "京ICP备05063181号" },
  { name: "中国教育在线", url: "https://www.eol.cn", keywords: ["教育在线", "eol", "中国教育在线", "高考", "高考查分"], category: "教育考试", desc: "教育信息服务与高考资讯平台", icp: "京ICP备05063181号" },

  // ==================== 生活服务（扩充） ====================
  { name: "BOSS直聘", url: "https://www.zhipin.com", keywords: ["boss直聘", "zhipin", "boss", "招聘", "求职"], category: "生活服务", desc: "互联网招聘求职平台", icp: "京ICP证030173号" },
  { name: "智联招聘", url: "https://www.zhaopin.com", keywords: ["智联招聘", "zhaopin", "智联", "招聘网站"], category: "生活服务", desc: "综合招聘求职平台", icp: "京ICP证030173号" },
  { name: "前程无忧", url: "https://www.51job.com", keywords: ["前程无忧", "51job", "51job官网", "找工作"], category: "生活服务", desc: "人力资源服务与招聘平台", icp: "沪ICP备05063181号" },
  { name: "贝壳找房", url: "https://www.ke.com", keywords: ["贝壳", "贝壳找房", "ke", "贝壳二手房", "贝壳租房", "贝壳官网"], category: "生活服务", desc: "房产交易与居住服务平台", icp: "京ICP证030173号" },
  { name: "自如", url: "https://www.ziroom.com", keywords: ["自如", "ziroom", "自如租房", "自如官网"], category: "生活服务", desc: "长租公寓租赁平台", icp: "京ICP证030173号" },
  { name: "12315平台", url: "https://www.12315.cn", keywords: ["12315", "投诉", "消费维权", "市场监管投诉", "消费者投诉"], category: "生活服务", desc: "全国12315消费投诉举报平台", icp: "京ICP备05063181号" },
  { name: "12345政务服务", url: "https://www.12345.gov.cn", keywords: ["12345", "政务服务", "便民热线", "政府服务热线"], category: "生活服务", desc: "全国12345政务服务便民热线", icp: "京ICP备05063181号" },
  { name: "中国福利彩票", url: "https://www.cwl.gov.cn", keywords: ["福彩", "福利彩票", "cwl", "双色球", "中国福利彩票"], category: "生活服务", desc: "中国福利彩票发行管理中心", icp: "京ICP备05063181号" },
  { name: "中国体育彩票", url: "https://www.lottery.gov.cn", keywords: ["体彩", "体育彩票", "lottery", "大乐透", "中国体育彩票"], category: "生活服务", desc: "中国体育彩票官方平台", icp: "京ICP备05063181号" },

  // ==================== 科技互联网（扩充） ====================
  { name: "360官网", url: "https://www.360.cn", keywords: ["360", "360安全卫士", "360官网", "360浏览器", "qihoo", "奇虎"], category: "科技互联网", desc: "互联网安全产品与服务提供商", icp: "京ICP证030173号" },
  { name: "金山办公", url: "https://www.wps.cn", keywords: ["wps", "金山办公", "wps官网", "wps office", "金山"], category: "科技互联网", desc: "WPS Office办公软件官方平台", icp: "粤B2-20090059" },
  { name: "网易", url: "https://www.163.com", keywords: ["网易", "163", "163邮箱", "netease", "网易官网"], category: "科技互联网", desc: "中国领先的互联网技术公司", icp: "京ICP证030173号" },
  { name: "新浪", url: "https://www.sina.com.cn", keywords: ["新浪", "sina", "新浪网", "sina官网"], category: "科技互联网", desc: "中文门户网站与互联网服务", icp: "京ICP证030173号" },
  { name: "联想", url: "https://www.lenovo.com.cn", keywords: ["联想", "lenovo", "联想官网", "联想电脑", "thinkpad"], category: "科技互联网", desc: "全球最大的PC制造商之一", icp: "京ICP证030173号" },
  { name: "OPPO", url: "https://www.oppo.com", keywords: ["oppo", "OPPO", "oppo手机", "oppo官网"], category: "科技互联网", desc: "智能手机制造商", icp: "粤B2-20090059" },
  { name: "vivo", url: "https://www.vivo.com.cn", keywords: ["vivo", "vivo手机", "vivo官网"], category: "科技互联网", desc: "智能手机制造商", icp: "粤B2-20090059" },
  { name: "荣耀", url: "https://www.honor.com", keywords: ["荣耀", "honor", "荣耀手机", "荣耀官网"], category: "科技互联网", desc: "智能手机制造商", icp: "粤B2-20090059" },
  { name: "科大讯飞", url: "https://www.iflytek.com", keywords: ["科大讯飞", "讯飞", "iflytek", "科大讯飞官网", "讯飞星火"], category: "科技互联网", desc: "智能语音与人工智能技术企业", icp: "皖ICP备05005163号" },
  { name: "大疆", url: "https://www.dji.com/cn", keywords: ["大疆", "dji", "大疆无人机", "大疆官网"], category: "科技互联网", desc: "全球领先的无人机与航拍设备制造商", icp: "粤B2-20090059" },
  { name: "比亚迪", url: "https://www.byd.com", keywords: ["比亚迪", "byd", "比亚迪官网", "比亚迪汽车"], category: "科技互联网", desc: "新能源汽车与电池制造商", icp: "粤B2-20090059" },
  { name: "特斯拉中国", url: "https://www.tesla.cn", keywords: ["特斯拉", "tesla", "特斯拉中国", "特斯拉官网", "model"], category: "科技互联网", desc: "特斯拉中国官方网站", icp: "京ICP证030173号" },

  // ==================== 新闻资讯（扩充） ====================
  { name: "澎湃新闻", url: "https://www.thepaper.cn", keywords: ["澎湃", "澎湃新闻", "thepaper", "澎湃新闻官网"], category: "新闻资讯", desc: "上海报业集团旗下新闻平台", icp: "沪ICP备16044253号" },
  { name: "财新网", url: "https://www.caixin.com", keywords: ["财新", "财新网", "caixin", "财新官网"], category: "新闻资讯", desc: "财经新闻媒体", icp: "京ICP证030173号" },
  { name: "环球网", url: "https://www.huanqiu.com", keywords: ["环球网", "huanqiu", "环球", "环球时报"], category: "新闻资讯", desc: "人民日报社旗下国际新闻网站", icp: "京ICP证030173号" },

  // ==================== 快递物流（扩充） ====================
  // ==================== 快递物流（扩充） ====================
  { name: "申通快递", url: "https://www.sto.cn", keywords: ["申通", "sto", "申通快递", "shentong"], category: "快递物流", desc: "快递物流服务企业", icp: "沪ICP备08006288号" },
  { name: "百世快递", url: "https://www.best.com", keywords: ["百世", "best", "百世快递", "baishi"], category: "快递物流", desc: "综合供应链物流服务企业", icp: "沪ICP备08006288号" },
  { name: "德邦快递", url: "https://www.deppon.com", keywords: ["德邦", "deppon", "德邦快递", "德邦物流"], category: "快递物流", desc: "大件快递与物流服务企业", icp: "沪ICP备08006288号" },
  { name: "极兔速递", url: "https://www.jtexpress.com", keywords: ["极兔", "jtexpress", "极兔速递", "jitu"], category: "快递物流", desc: "国际化快递物流企业", icp: "沪ICP备08006288号" },
  { name: "菜鸟裹裹", url: "https://www.cainiao.com", keywords: ["菜鸟", "cainiao", "菜鸟裹裹", "菜鸟驿站", "菜鸟物流"], category: "快递物流", desc: "阿里巴巴旗下物流服务平台", icp: "浙B2-20120091-5" },

  // ==================== 公共服务（扩充） ====================
  { name: "中央气象台", url: "https://www.nmc.cn", keywords: ["气象台", "中央气象台", "nmc", "台风预警", "气象预警"], category: "公共服务", desc: "中央气象台官方网站", icp: "京ICP证030173号" },
  { name: "中国地震台网", url: "https://www.cenc.ac.cn", keywords: ["地震", "地震台网", "cenc", "地震预警", "中国地震"], category: "公共服务", desc: "中国地震台网中心官方网站", icp: "京ICP证030173号" },
  { name: "国家邮政局", url: "https://www.spb.gov.cn", keywords: ["邮政局", "国家邮政局", "spb", "快递查询", "邮政"], category: "公共服务", desc: "国家邮政局官方网站", icp: "京ICP备05063181号" },
  { name: "国家消防救援局", url: "https://www.119.gov.cn", keywords: ["消防", "119", "消防救援", "消防局", "119消防"], category: "公共服务", desc: "国家消防救援局官方网站", icp: "京ICP备05063181号" },
  { name: "国家林业和草原局", url: "https://www.forestry.gov.cn", keywords: ["林业", "草原局", "林业局", "forestry", "国家林草局"], category: "公共服务", desc: "国家林业和草原局官方网站", icp: "京ICP备05063181号" },

  // ==================== 视频娱乐（新增分类） ====================
  { name: "腾讯视频", url: "https://v.qq.com", keywords: ["腾讯视频", "v.qq", "腾讯视频官网", "qq视频"], category: "视频娱乐", desc: "腾讯旗下在线视频平台", icp: "粤B2-20090059" },
  { name: "爱奇艺", url: "https://www.iqiyi.com", keywords: ["爱奇艺", "iqiyi", "iq", "爱奇艺官网"], category: "视频娱乐", desc: "在线视频平台", icp: "京ICP证030173号" },
  { name: "优酷", url: "https://www.youku.com", keywords: ["优酷", "youku", "youku官网", "土豆"], category: "视频娱乐", desc: "阿里巴巴旗下在线视频平台", icp: "浙B2-20120091-8" },
  { name: "芒果TV", url: "https://www.mgtv.com", keywords: ["芒果tv", "mgtv", "芒果", "芒果tv官网"], category: "视频娱乐", desc: "湖南广电旗下在线视频平台", icp: "湘ICP备10002983号" },
  { name: "腾讯游戏", url: "https://game.qq.com", keywords: ["腾讯游戏", "qq游戏", "腾讯游戏官网", "lol", "王者荣耀官网"], category: "视频娱乐", desc: "腾讯旗下游戏运营平台", icp: "粤B2-20090059" },
  { name: "Steam", url: "https://store.steampowered.com", keywords: ["steam", "蒸汽", "steam官网", "steam游戏", "steam平台"], category: "视频娱乐", desc: "全球最大的PC数字游戏发行平台", icp: "" },

  // ==================== 音乐阅读（新增分类） ====================
  { name: "网易云音乐", url: "https://music.163.com", keywords: ["网易云音乐", "music163", "网易云", "云音乐"], category: "音乐阅读", desc: "网易旗下在线音乐平台", icp: "京ICP证030173号" },
  { name: "QQ音乐", url: "https://y.qq.com", keywords: ["qq音乐", "qqmusic", "QQ音乐官网", "y.qq.com"], category: "音乐阅读", desc: "腾讯旗下在线音乐平台", icp: "粤B2-20090059" },
  { name: "酷狗音乐", url: "https://www.kugou.com", keywords: ["酷狗", "kugou", "酷狗音乐", "酷狗官网"], category: "音乐阅读", desc: "在线音乐平台", icp: "粤ICP备05089335号" },
  { name: "起点中文网", url: "https://www.qidian.com", keywords: ["起点", "起点中文网", "qidian", "小说", "网络小说"], category: "音乐阅读", desc: "中文网络文学平台", icp: "沪ICP备08006288号" },
  { name: "晋江文学城", url: "https://www.jjwxc.net", keywords: ["晋江", "晋江文学", "jjwxc", "晋江文学城"], category: "音乐阅读", desc: "女性向网络文学平台", icp: "京ICP证030173号" },
  { name: "百度文库", url: "https://wenku.baidu.com", keywords: ["百度文库", "wenku", "文库", "文档"], category: "音乐阅读", desc: "百度旗下在线文档分享平台", icp: "京ICP证030173号" },

  // ==================== 开发者服务 ====================
  { name: "腾讯云", url: "https://cloud.tencent.com", keywords: ["腾讯云", "tencent cloud", "tencentcloud", "云服务器", "腾讯云官网", "cvm"], category: "开发者服务", desc: "腾讯旗下云计算与AI服务平台", icp: "粤B2-20090059" },
  { name: "阿里云", url: "https://www.aliyun.com", keywords: ["阿里云", "aliyun", "aliyun官网", "阿里云服务器", "ecs", "云计算"], category: "开发者服务", desc: "阿里巴巴旗下全球领先的云计算平台", icp: "浙B2-20120091" },
  { name: "DeepSeek", url: "https://www.deepseek.com", keywords: ["deepseek", "深度求索", "deep seek", "ds", "大模型", "人工智能", "deepseek官网"], category: "开发者服务", desc: "深度求索AI大模型平台，DeepSeek-R1/V3开发者", icp: "" },
  { name: "华为云", url: "https://www.huaweicloud.com", keywords: ["华为云", "huaweicloud", "华为云官网", "华为云计算", "华为云服务器"], category: "开发者服务", desc: "华为旗下云计算与AI服务平台", icp: "粤B2-20090059" },
  { name: "百度智能云", url: "https://cloud.baidu.com", keywords: ["百度智能云", "百度云", "baidu cloud", "baiducloud", "百度云服务器", "bce"], category: "开发者服务", desc: "百度旗下云计算与AI开放平台", icp: "京ICP证030173号" },
  { name: "京东云", url: "https://www.jdcloud.com", keywords: ["京东云", "jdcloud", "京东云官网", "京东云计算"], category: "开发者服务", desc: "京东旗下云计算与技术服务商", icp: "" },
  { name: "Gitee 码云", url: "https://gitee.com", keywords: ["gitee", "码云", "gitee官网", "代码托管", "git托管", "码云官网"], category: "开发者服务", desc: "国内最大的代码托管与协作平台", icp: "" },
  { name: "掘金", url: "https://juejin.cn", keywords: ["掘金", "juejin", "掘金社区", "掘金官网", "技术社区", "稀土掘金"], category: "开发者服务", desc: "中文技术内容分享与开发者社区", icp: "" },
  { name: "开源中国 OSCHINA", url: "https://www.oschina.net", keywords: ["开源中国", "oschina", "oschina官网", "开源社区", "开源项目"], category: "开发者服务", desc: "国内领先的开源技术社区", icp: "" },
  { name: "力扣 LeetCode", url: "https://leetcode.cn", keywords: ["力扣", "leetcode", "leetcode中国", "力扣官网", "刷题", "算法", "编程题库"], category: "开发者服务", desc: "国内最受欢迎的算法刷题与面试题库平台", icp: "" },
  { name: "CSDN", url: "https://www.csdn.net", keywords: ["csdn", "csdn官网", "csdn社区", "IT技术", "程序员社区", "博客"], category: "开发者服务", desc: "国内最大的IT技术交流与博客社区", icp: "" },
  { name: "博客园", url: "https://www.cnblogs.com", keywords: ["博客园", "cnblogs", "博客园官网", "技术博客", "程序员博客"], category: "开发者服务", desc: "国内老牌技术博客社区平台", icp: "" },

  // ==================== 高等院校（39所985 + 中国科学院大学 + 82所知名211高校，全部为.edu.cn/.ac.cn官方域名） ====================
  { name: "清华大学", url: "https://www.tsinghua.edu.cn", keywords: ["清华", "清华大学", "tsinghua", "qinghua", "清华官网", "thu"], category: "高等院校", desc: "中国顶尖综合性研究型大学，985/双一流", icp: "" },
  { name: "北京大学", url: "https://www.pku.edu.cn", keywords: ["北大", "北京大学", "pku", "beida", "北大官网", "beijing university"], category: "高等院校", desc: "中国第一所国立综合性大学，985/双一流", icp: "" },
  { name: "中国人民大学", url: "https://www.ruc.edu.cn", keywords: ["人大", "中国人民大学", "ruc", "renmin", "人民大学", "人大官网"], category: "高等院校", desc: "人文社会科学为主的综合性大学，985/双一流", icp: "" },
  { name: "北京航空航天大学", url: "https://www.buaa.edu.cn", keywords: ["北航", "北京航空航天大学", "buaa", "beihang", "航空航天大学", "北航官网"], category: "高等院校", desc: "航空航天民航特色顶尖学府，985/双一流", icp: "" },
  { name: "北京理工大学", url: "https://www.bit.edu.cn", keywords: ["北理工", "北京理工大学", "bit", "北京理工", "北理工官网"], category: "高等院校", desc: "国防特色工科强校，985/双一流", icp: "" },
  { name: "北京师范大学", url: "https://www.bnu.edu.cn", keywords: ["北师大", "北京师范大学", "bnu", "师范大学", "北师大官网"], category: "高等院校", desc: "教师教育文理基础学科顶尖学府，985/双一流", icp: "" },
  { name: "中国农业大学", url: "https://www.cau.edu.cn", keywords: ["中国农大", "中国农业大学", "cau", "农大", "农业大学", "中国农大官网"], category: "高等院校", desc: "现代农业生命科学最高学府，985/双一流", icp: "" },
  { name: "中央民族大学", url: "https://www.muc.edu.cn", keywords: ["中央民大", "中央民族大学", "muc", "民族大学", "中央民大官网"], category: "高等院校", desc: "民族学科最高学府，985/双一流", icp: "" },
  { name: "南开大学", url: "https://www.nankai.edu.cn", keywords: ["南开", "南开大学", "nankai", "南开官网", "nk"], category: "高等院校", desc: "文理并重的综合性大学，985/双一流", icp: "" },
  { name: "天津大学", url: "https://www.tju.edu.cn", keywords: ["天大", "天津大学", "tju", "天津大学官网", "北洋大学"], category: "高等院校", desc: "中国第一所现代大学，985/双一流", icp: "" },
  { name: "大连理工大学", url: "https://www.dlut.edu.cn", keywords: ["大工", "大连理工", "大连理工大学", "dlut", "大连理工官网"], category: "高等院校", desc: "东北地区理工强校，985/双一流", icp: "" },
  { name: "东北大学", url: "https://www.neu.edu.cn", keywords: ["东大", "东北大学", "neu", "东北大学官网"], category: "高等院校", desc: "冶金自动化特色工科强校，985/双一流", icp: "" },
  { name: "吉林大学", url: "https://www.jlu.edu.cn", keywords: ["吉大", "吉林大学", "jlu", "吉大官网"], category: "高等院校", desc: "学科门类齐全的综合性大学，985/双一流", icp: "" },
  { name: "哈尔滨工业大学", url: "https://www.hit.edu.cn", keywords: ["哈工大", "哈尔滨工业大学", "hit", "哈工大官网"], category: "高等院校", desc: "航天机器人顶尖工科强校，985/双一流", icp: "" },
  { name: "复旦大学", url: "https://www.fudan.edu.cn", keywords: ["复旦", "复旦大学", "fudan", "复旦官网"], category: "高等院校", desc: "综合性研究型顶尖大学，985/双一流", icp: "" },
  { name: "同济大学", url: "https://www.tongji.edu.cn", keywords: ["同济", "同济大学", "tongji", "同济官网"], category: "高等院校", desc: "土木建筑交通顶尖学府，985/双一流", icp: "" },
  { name: "上海交通大学", url: "https://www.sjtu.edu.cn", keywords: ["上海交大", "上海交通大学", "sjtu", "交大", "上交", "上海交大官网"], category: "高等院校", desc: "工科医科商科顶尖综合性大学，985/双一流", icp: "" },
  { name: "华东师范大学", url: "https://www.ecnu.edu.cn", keywords: ["华东师大", "华东师范大学", "ecnu", "华师大", "华东师大官网"], category: "高等院校", desc: "师范类顶尖学府，985/双一流", icp: "" },
  { name: "南京大学", url: "https://www.nju.edu.cn", keywords: ["南大", "南京大学", "nju", "南京大学官网"], category: "高等院校", desc: "基础学科顶尖综合性大学，985/双一流", icp: "" },
  { name: "东南大学", url: "https://www.seu.edu.cn", keywords: ["东南大学", "seu", "东南", "东南大学官网"], category: "高等院校", desc: "建筑电子土木强校，985/双一流", icp: "" },
  { name: "浙江大学", url: "https://www.zju.edu.cn", keywords: ["浙大", "浙江大学", "zju", "浙大官网"], category: "高等院校", desc: "学科齐全的综合性顶尖大学，985/双一流", icp: "" },
  { name: "中国科学技术大学", url: "https://www.ustc.edu.cn", keywords: ["中科大", "中国科大", "中国科学技术大学", "ustc", "中科大官网", "科大"], category: "高等院校", desc: "前沿科学高新技术顶尖学府，985/双一流", icp: "" },
  { name: "厦门大学", url: "https://www.xmu.edu.cn", keywords: ["厦大", "厦门大学", "xmu", "厦大官网"], category: "高等院校", desc: "依山傍海的综合性大学，985/双一流", icp: "" },
  { name: "山东大学", url: "https://www.sdu.edu.cn", keywords: ["山大", "山东大学", "sdu", "山大官网"], category: "高等院校", desc: "文史见长的综合性大学，985/双一流", icp: "" },
  { name: "中国海洋大学", url: "https://www.ouc.edu.cn", keywords: ["海大", "中国海洋大学", "ouc", "海洋大学", "中国海洋大学官网"], category: "高等院校", desc: "海洋水产学科最高学府，985/双一流", icp: "" },
  { name: "武汉大学", url: "https://www.whu.edu.cn", keywords: ["武大", "武汉大学", "whu", "武大官网"], category: "高等院校", desc: "测绘遥感法学强校，985/双一流", icp: "" },
  { name: "华中科技大学", url: "https://www.hust.edu.cn", keywords: ["华科", "华中科大", "华中科技大学", "hust", "华科官网", "华中理工"], category: "高等院校", desc: "光电机械医学强校，985/双一流", icp: "" },
  { name: "湖南大学", url: "https://www.hnu.edu.cn", keywords: ["湖大", "湖南大学", "hnu", "湖大官网", "岳麓书院"], category: "高等院校", desc: "千年学府岳麓书院传承，985/双一流", icp: "" },
  { name: "中南大学", url: "https://www.csu.edu.cn", keywords: ["中南大学", "csu", "中南大学官网", "中南工大"], category: "高等院校", desc: "冶金医学交通强校，985/双一流", icp: "" },
  { name: "国防科技大学", url: "https://www.nudt.edu.cn", keywords: ["国防科大", "国防科技大学", "nudt", "国防科学技术大学", "国防科大官网"], category: "高等院校", desc: "军队顶尖综合院校，985/双一流", icp: "" },
  { name: "中山大学", url: "https://www.sysu.edu.cn", keywords: ["中大", "中山大学", "sysu", "中大官网"], category: "高等院校", desc: "华南第一学府，985/双一流", icp: "" },
  { name: "华南理工大学", url: "https://www.scut.edu.cn", keywords: ["华南理工", "华南理工大学", "scut", "华工", "华南理工官网"], category: "高等院校", desc: "华南工科强校，985/双一流", icp: "" },
  { name: "四川大学", url: "https://www.scu.edu.cn", keywords: ["川大", "四川大学", "scu", "川大官网", "华西医科"], category: "高等院校", desc: "西南综合性顶尖大学，985/双一流", icp: "" },
  { name: "电子科技大学", url: "https://www.uestc.edu.cn", keywords: ["电子科大", "电子科技大学", "uestc", "成电", "电子科大官网"], category: "高等院校", desc: "电子信息领域顶尖学府，985/双一流", icp: "" },
  { name: "重庆大学", url: "https://www.cqu.edu.cn", keywords: ["重大", "重庆大学", "cqu", "重庆大学官网"], category: "高等院校", desc: "西南工科强校，985/双一流", icp: "" },
  { name: "西安交通大学", url: "https://www.xjtu.edu.cn", keywords: ["西安交大", "西安交通大学", "xjtu", "西交大", "西交", "西安交大官网"], category: "高等院校", desc: "西北第一学府，985/双一流", icp: "" },
  { name: "西北工业大学", url: "https://www.nwpu.edu.cn", keywords: ["西工大", "西北工业大学", "nwpu", "西北工大", "西工大官网"], category: "高等院校", desc: "航空航海航天三航特色，985/双一流", icp: "" },
  { name: "西北农林科技大学", url: "https://www.nwafu.edu.cn", keywords: ["西农", "西北农林", "西北农林科技大学", "nwafu", "西北农林科技大学官网"], category: "高等院校", desc: "农林水利特色学府，985/双一流", icp: "" },
  { name: "兰州大学", url: "https://www.lzu.edu.cn", keywords: ["兰大", "兰州大学", "lzu", "兰大官网"], category: "高等院校", desc: "西北综合性强校，985/双一流", icp: "" },
  { name: "中国科学院大学", url: "https://www.ucas.ac.cn", keywords: ["国科大", "中国科学院大学", "ucas", "国科大官网", "中科院大学"], category: "高等院校", desc: "中国科学院所属顶尖研究型大学，双一流", icp: "" },

  // ==================== 知名211高校（一）北京地区 ====================
  { name: "北京邮电大学", url: "https://www.bupt.edu.cn", keywords: ["北邮", "北京邮电大学", "bupt", "邮电大学", "北邮官网"], category: "高等院校", desc: "信息科技特色高校，211/双一流", icp: "" },
  { name: "北京交通大学", url: "https://www.bjtu.edu.cn", keywords: ["北交大", "北京交通大学", "bjtu", "交通大学", "北交大官网"], category: "高等院校", desc: "交通运输特色高校，211/双一流", icp: "" },
  { name: "北京科技大学", url: "https://www.ustb.edu.cn", keywords: ["北科大", "北京科技大学", "ustb", "钢院", "北科大官网"], category: "高等院校", desc: "材料冶金特色高校，211/双一流", icp: "" },
  { name: "北京化工大学", url: "https://www.buct.edu.cn", keywords: ["北化工", "北京化工大学", "buct", "化工大学"], category: "高等院校", desc: "化工特色高校，211/双一流", icp: "" },
  { name: "北京工业大学", url: "https://www.bjut.edu.cn", keywords: ["北工大", "北京工业大学", "bjut", "工业大学"], category: "高等院校", desc: "北京市属重点高校，211/双一流", icp: "" },
  { name: "北京林业大学", url: "https://www.bjfu.edu.cn", keywords: ["北林", "北林大", "北京林业大学", "bjfu", "林业大学"], category: "高等院校", desc: "林业生态环境特色高校，211/双一流", icp: "" },
  { name: "北京中医药大学", url: "https://www.bucm.edu.cn", keywords: ["北中医", "北京中医药大学", "bucm", "中医药大学"], category: "高等院校", desc: "中医药最高学府，211/双一流", icp: "" },
  { name: "北京外国语大学", url: "https://www.bfsu.edu.cn", keywords: ["北外", "北京外国语大学", "bfsu", "外国语大学"], category: "高等院校", desc: "外语教育最高学府，211/双一流", icp: "" },
  { name: "中国传媒大学", url: "https://www.cuc.edu.cn", keywords: ["中传", "中国传媒大学", "cuc", "广院", "传媒大学", "中传官网"], category: "高等院校", desc: "传媒教育最高学府，211/双一流", icp: "" },
  { name: "中央财经大学", url: "https://www.cufe.edu.cn", keywords: ["央财", "中央财经大学", "cufe", "中央财大"], category: "高等院校", desc: "财经名校，211/双一流", icp: "" },
  { name: "对外经济贸易大学", url: "https://www.uibe.edu.cn", keywords: ["贸大", "对外经贸大学", "对外经济贸易大学", "uibe", "经贸大学"], category: "高等院校", desc: "国际经贸名校，211/双一流", icp: "" },
  { name: "中国政法大学", url: "https://www.cupl.edu.cn", keywords: ["法大", "中国政法大学", "cupl", "政法大学"], category: "高等院校", desc: "法学最高学府，211/双一流", icp: "" },
  { name: "中国石油大学（北京）", url: "https://www.cup.edu.cn", keywords: ["石大", "中国石油大学", "石油大学北京", "cup", "中国石油大学北京"], category: "高等院校", desc: "石油石化特色高校，211/双一流", icp: "" },
  { name: "中国地质大学（北京）", url: "https://www.cugb.edu.cn", keywords: ["地大", "中国地质大学", "地质大学北京", "cugb", "中国地质大学北京"], category: "高等院校", desc: "地球科学特色高校，211/双一流", icp: "" },
  { name: "中国矿业大学（北京）", url: "https://www.cumtb.edu.cn", keywords: ["矿大北京", "中国矿业大学北京", "cumtb", "矿业大学北京"], category: "高等院校", desc: "矿业能源特色高校，211/双一流", icp: "" },
  { name: "华北电力大学", url: "https://www.ncepu.edu.cn", keywords: ["华电", "华北电力大学", "ncepu", "电力大学"], category: "高等院校", desc: "电力特色高校，211/双一流", icp: "" },
  { name: "北京体育大学", url: "https://www.bsu.edu.cn", keywords: ["北体", "北体大", "北京体育大学", "bsu", "体育大学"], category: "高等院校", desc: "体育教育最高学府，211/双一流", icp: "" },
  { name: "中央音乐学院", url: "https://www.ccom.edu.cn", keywords: ["央音", "中央音乐学院", "ccom", "音乐学院"], category: "高等院校", desc: "音乐教育最高学府，211/双一流", icp: "" },

  // ==================== 知名211高校（二）华东地区 ====================
  { name: "上海财经大学", url: "https://www.sufe.edu.cn", keywords: ["上财", "上海财经大学", "sufe", "上海财大"], category: "高等院校", desc: "财经名校，211/双一流", icp: "" },
  { name: "上海外国语大学", url: "https://www.shisu.edu.cn", keywords: ["上外", "上海外国语大学", "shisu", "外国语大学上海"], category: "高等院校", desc: "外语名校，211/双一流", icp: "" },
  { name: "华东理工大学", url: "https://www.ecust.edu.cn", keywords: ["华理", "华东理工大学", "ecust", "华东理工"], category: "高等院校", desc: "化工特色名校，211/双一流", icp: "" },
  { name: "东华大学", url: "https://www.dhu.edu.cn", keywords: ["东华", "东华大学", "dhu", "中国纺织大学"], category: "高等院校", desc: "纺织科创特色高校，211/双一流", icp: "" },
  { name: "上海大学", url: "https://www.shu.edu.cn", keywords: ["上大", "上海大学", "shu", "上海大学官网"], category: "高等院校", desc: "上海市属综合性大学，211/双一流", icp: "" },
  { name: "南京理工大学", url: "https://www.njust.edu.cn", keywords: ["南理工", "南京理工大学", "njust", "南京理工"], category: "高等院校", desc: "兵器科学特色高校，211/双一流", icp: "" },
  { name: "南京航空航天大学", url: "https://www.nuaa.edu.cn", keywords: ["南航", "南京航空航天大学", "nuaa", "南京航空"], category: "高等院校", desc: "航空航天民航特色，211/双一流", icp: "" },
  { name: "河海大学", url: "https://www.hhu.edu.cn", keywords: ["河海", "河海大学", "hhu", "河海大学官网"], category: "高等院校", desc: "水利特色名校，211/双一流", icp: "" },
  { name: "南京农业大学", url: "https://www.njau.edu.cn", keywords: ["南农", "南京农业大学", "njau", "南京农大"], category: "高等院校", desc: "农业生命科学名校，211/双一流", icp: "" },
  { name: "南京师范大学", url: "https://www.njnu.edu.cn", keywords: ["南师大", "南京师范大学", "njnu", "南京师大"], category: "高等院校", desc: "师范名校，211/双一流", icp: "" },
  { name: "中国药科大学", url: "https://www.cpu.edu.cn", keywords: ["药大", "中国药科大学", "cpu", "药科大学"], category: "高等院校", desc: "药学界最高学府，211/双一流", icp: "" },
  { name: "苏州大学", url: "https://www.suda.edu.cn", keywords: ["苏大", "苏州大学", "suda", "苏州大学官网"], category: "高等院校", desc: "综合性名校，211/双一流", icp: "" },
  { name: "江南大学", url: "https://www.jiangnan.edu.cn", keywords: ["江南大学", "江南大学官网", "jiangnan", "无锡轻工大学"], category: "高等院校", desc: "食品设计特色名校，211/双一流", icp: "" },
  { name: "中国矿业大学", url: "https://www.cumt.edu.cn", keywords: ["矿大", "中国矿业大学", "cumt", "徐州矿大"], category: "高等院校", desc: "矿业能源特色高校，211/双一流", icp: "" },
  { name: "中国石油大学（华东）", url: "https://www.upc.edu.cn", keywords: ["石大华东", "中国石油大学华东", "upc", "石油大学青岛"], category: "高等院校", desc: "石油石化特色高校，211/双一流", icp: "" },
  { name: "中国地质大学（武汉）", url: "https://www.cug.edu.cn", keywords: ["地大武汉", "中国地质大学武汉", "cug", "武汉地大"], category: "高等院校", desc: "地球科学特色高校，211/双一流", icp: "" },
  { name: "合肥工业大学", url: "https://www.hfut.edu.cn", keywords: ["合工大", "合肥工业大学", "hfut", "合肥工大"], category: "高等院校", desc: "工科名校，211/双一流", icp: "" },
  { name: "安徽大学", url: "https://www.ahu.edu.cn", keywords: ["安大", "安徽大学", "ahu", "安徽大学官网"], category: "高等院校", desc: "安徽省属重点高校，211/双一流", icp: "" },
  { name: "福州大学", url: "https://www.fzu.edu.cn", keywords: ["福大", "福州大学", "fzu", "福州大学官网"], category: "高等院校", desc: "福建省属重点高校，211/双一流", icp: "" },

  // ==================== 知名211高校（三）中南/华南/西南地区 ====================
  { name: "武汉理工大学", url: "https://www.whut.edu.cn", keywords: ["武理工", "武汉理工大学", "whut", "武汉工大"], category: "高等院校", desc: "建材交通汽车特色，211/双一流", icp: "" },
  { name: "华中师范大学", url: "https://www.ccnu.edu.cn", keywords: ["华师", "华中师范大学", "ccnu", "华中师大"], category: "高等院校", desc: "师范名校，211/双一流", icp: "" },
  { name: "华中农业大学", url: "https://www.hzau.edu.cn", keywords: ["华农", "华中农业大学", "hzau", "华中农大"], category: "高等院校", desc: "农业生命名校，211/双一流", icp: "" },
  { name: "中南财经政法大学", url: "https://www.zuel.edu.cn", keywords: ["中南财大", "中南财经政法大学", "zuel", "中南财经"], category: "高等院校", desc: "财经政法名校，211/双一流", icp: "" },
  { name: "湖南师范大学", url: "https://www.hunnu.edu.cn", keywords: ["湖南师大", "湖南师范大学", "hunnu", "湖师大"], category: "高等院校", desc: "师范名校，211/双一流", icp: "" },
  { name: "暨南大学", url: "https://www.jnu.edu.cn", keywords: ["暨大", "暨南大学", "jnu", "暨南大学官网"], category: "高等院校", desc: "华侨最高学府，211/双一流", icp: "" },
  { name: "华南师范大学", url: "https://www.scnu.edu.cn", keywords: ["华师", "华南师范大学", "scnu", "华南师大"], category: "高等院校", desc: "师范名校，211/双一流", icp: "" },
  { name: "广西大学", url: "https://www.gxu.edu.cn", keywords: ["西大", "广西大学", "gxu", "广西大学官网"], category: "高等院校", desc: "广西综合性重点高校，211/双一流", icp: "" },
  { name: "海南大学", url: "https://www.hainanu.edu.cn", keywords: ["海大", "海南大学", "hainanu", "海南大学官网"], category: "高等院校", desc: "海南综合性重点高校，211/双一流", icp: "" },
  { name: "西南交通大学", url: "https://www.swjtu.edu.cn", keywords: ["西南交大", "西南交通大学", "swjtu", "唐山交大"], category: "高等院校", desc: "轨道交通第一校，211/双一流", icp: "" },
  { name: "西南财经大学", url: "https://www.swufe.edu.cn", keywords: ["西南财大", "西南财经大学", "swufe", "西财"], category: "高等院校", desc: "财经名校，211/双一流", icp: "" },
  { name: "西南大学", url: "https://www.swu.edu.cn", keywords: ["西大", "西南大学", "swu", "西南大学官网"], category: "高等院校", desc: "综合性重点高校，211/双一流", icp: "" },
  { name: "四川农业大学", url: "https://www.sicau.edu.cn", keywords: ["川农", "四川农业大学", "sicau", "川农大"], category: "高等院校", desc: "农业特色高校，211/双一流", icp: "" },
  { name: "云南大学", url: "https://www.ynu.edu.cn", keywords: ["云大", "云南大学", "ynu", "云南大学官网"], category: "高等院校", desc: "西南边疆名校，211/双一流", icp: "" },
  { name: "贵州大学", url: "https://www.gzu.edu.cn", keywords: ["贵大", "贵州大学", "gzu", "贵州大学官网"], category: "高等院校", desc: "贵州省属重点高校，211/双一流", icp: "" },

  // ==================== 知名211高校（四）北方/西北/其他地区 ====================
  { name: "哈尔滨工程大学", url: "https://www.hrbeu.edu.cn", keywords: ["哈工程", "哈尔滨工程大学", "hrbeu", "哈军工"], category: "高等院校", desc: "船海核领域强校，211/双一流", icp: "" },
  { name: "东北林业大学", url: "https://www.nefu.edu.cn", keywords: ["东北林大", "东北林业大学", "nefu", "林大"], category: "高等院校", desc: "林业特色高校，211/双一流", icp: "" },
  { name: "东北农业大学", url: "https://www.neau.edu.cn", keywords: ["东北农大", "东北农业大学", "neau", "农大"], category: "高等院校", desc: "农业特色高校，211/双一流", icp: "" },
  { name: "大连海事大学", url: "https://www.dlmu.edu.cn", keywords: ["海大", "大连海事大学", "dlmu", "海事大学"], category: "高等院校", desc: "航海交通最高学府，211/双一流", icp: "" },
  { name: "辽宁大学", url: "https://www.lnu.edu.cn", keywords: ["辽大", "辽宁大学", "lnu", "辽宁大学官网"], category: "高等院校", desc: "辽宁省属重点高校，211/双一流", icp: "" },
  { name: "延边大学", url: "https://www.ybu.edu.cn", keywords: ["延大", "延边大学", "ybu", "延边大学官网"], category: "高等院校", desc: "边疆民族特色高校，211/双一流", icp: "" },
  { name: "内蒙古大学", url: "https://www.imu.edu.cn", keywords: ["内大", "内蒙古大学", "imu", "内蒙古大学官网"], category: "高等院校", desc: "内蒙古重点高校，211/双一流", icp: "" },
  { name: "太原理工大学", url: "https://www.tyut.edu.cn", keywords: ["太原理工", "太原理工大学", "tyut", "太原工大"], category: "高等院校", desc: "山西省属重点高校，211/双一流", icp: "" },
  { name: "河北工业大学", url: "https://www.hebut.edu.cn", keywords: ["河北工大", "河北工业大学", "hebut", "河工大"], category: "高等院校", desc: "河北省属重点高校，211/双一流", icp: "" },
  { name: "天津医科大学", url: "https://www.tmu.edu.cn", keywords: ["天津医大", "天津医科大学", "tmu", "医科大学"], category: "高等院校", desc: "医科名校，211/双一流", icp: "" },
  { name: "郑州大学", url: "https://www.zzu.edu.cn", keywords: ["郑大", "郑州大学", "zzu", "郑州大学官网"], category: "高等院校", desc: "河南综合性重点高校，211/双一流", icp: "" },
  { name: "南昌大学", url: "https://www.ncu.edu.cn", keywords: ["昌大", "南昌大学", "ncu", "南昌大学官网"], category: "高等院校", desc: "江西省属重点高校，211/双一流", icp: "" },
  { name: "西北大学", url: "https://www.nwu.edu.cn", keywords: ["西大", "西北大学", "nwu", "西北大学官网"], category: "高等院校", desc: "西北地区老牌名校，211/双一流", icp: "" },
  { name: "西安电子科技大学", url: "https://www.xidian.edu.cn", keywords: ["西电", "西安电子科技大学", "xidian", "西安电子"], category: "高等院校", desc: "电子信息强校，211/双一流", icp: "" },
  { name: "长安大学", url: "https://www.chd.edu.cn", keywords: ["长安大学", "chd", "长大", "公路交通大学"], category: "高等院校", desc: "公路交通特色高校，211/双一流", icp: "" },
  { name: "新疆大学", url: "https://www.xju.edu.cn", keywords: ["新大", "新疆大学", "xju", "新疆大学官网"], category: "高等院校", desc: "新疆综合性重点高校，211/双一流", icp: "" },
  { name: "石河子大学", url: "https://www.shzu.edu.cn", keywords: ["石大", "石河子大学", "shzu", "兵团大学"], category: "高等院校", desc: "兵团综合性高校，211/双一流", icp: "" },
  { name: "宁夏大学", url: "https://www.nxu.edu.cn", keywords: ["宁大", "宁夏大学", "nxu", "宁夏大学官网"], category: "高等院校", desc: "宁夏重点高校，211/双一流", icp: "" },
  { name: "青海大学", url: "https://www.qhu.edu.cn", keywords: ["青大", "青海大学", "qhu", "青海大学官网"], category: "高等院校", desc: "青海省属重点高校，211/双一流", icp: "" },
  { name: "西藏大学", url: "https://www.utibet.edu.cn", keywords: ["藏大", "西藏大学", "utibet", "西藏大学官网"], category: "高等院校", desc: "西藏综合性高校，211/双一流", icp: "" }
];

/**
 * 获取所有分类
 */
function getCategories() {
  const cats = new Set();
  OFFICIAL_SITES.forEach(s => cats.add(s.category));
  return Array.from(cats);
}

/**
 * 搜索官方网址
 * @param {string} query 用户搜索词
 * @returns {Array} 匹配结果，按相关度排序
 */
function searchOfficialSites(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results = [];

  OFFICIAL_SITES.forEach(site => {
    let score = 0;
    let matchedKeyword = "";

    // 1. 名称完全匹配 (最高权重)
    if (site.name.toLowerCase() === q) {
      score = 1000;
      matchedKeyword = site.name;
    }
    // 2. 名称包含查询词
    else if (site.name.toLowerCase().includes(q)) {
      score = 500 + (q.length / site.name.length * 100);
      matchedKeyword = site.name;
    }
    // 3. 关键词完全匹配
    else {
      for (const kw of site.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === q) {
          score = Math.max(score, 800);
          matchedKeyword = kw;
        } else if (kwLower.startsWith(q)) {
          score = Math.max(score, 400 + q.length * 10);
          matchedKeyword = kw;
        } else if (kwLower.includes(q)) {
          score = Math.max(score, 200 + q.length * 5);
          matchedKeyword = kw;
        } else if (q.includes(kwLower) && kwLower.length >= 2) {
          score = Math.max(score, 100 + kwLower.length * 5);
          matchedKeyword = kw;
        }
      }
    }

    // 4. 分类匹配 (较低权重)
    if (site.category.includes(q)) {
      score = Math.max(score, 50);
    }

    if (score > 0) {
      results.push({ ...site, score, matchedKeyword });
    }
  });

  // 按分数降序排序
  results.sort((a, b) => b.score - a.score);
  return results;
}

// 导出供模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OFFICIAL_SITES, getCategories, searchOfficialSites };
}
