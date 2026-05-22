(function () {
  "use strict";

  var STORAGE_USER = "modernHuangli.userInfo";
  var WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  var state = {
    route: "onboarding",
    userInfo: null,
    selectedDate: today(),
    calendarYear: today().getFullYear(),
    calendarMonth: today().getMonth() + 1,
    editingProfile: false
  };

  var COLORS = {
    bg: "#FDFBF7",
    primaryRed: "#C04851",
    primaryGreen: "#4F7966",
    ink: "#2C2C2C",
    gold: "#D4AF37",
    gray: "#9ca3af",
    lightGray: "#f3f4f6"
  };

  var ELEMENTS = {
    "甲": "wood", "乙": "wood",
    "丙": "fire", "丁": "fire",
    "戊": "earth", "己": "earth",
    "庚": "metal", "辛": "metal",
    "壬": "water", "癸": "water"
  };

  var ELEMENT_CONFIG = {
    wood: { color: "青绿色 (Green)", direction: "正东 (East)" },
    fire: { color: "赤红色 (Red)", direction: "正南 (South)" },
    earth: { color: "咖啡色 (Brown)", direction: "东北 (Northeast)" },
    metal: { color: "金白色 (White)", direction: "正西 (West)" },
    water: { color: "深黑色 (Black)", direction: "正北 (North)" }
  };

  var WEALTH_DIRECTIONS = {
    wood: "东北 (Northeast)",
    fire: "正西 (West)",
    earth: "正北 (North)",
    metal: "正东 (East)",
    water: "正南 (South)"
  };

  var TEN_GOD_EVENTS = {
    peer: {
      yi: [
        { traditional: "会友", modern: "组局剧本杀/聚餐", category: "general", icon: "Users" },
        { traditional: "结盟", modern: "寻找合伙人/队友", category: "career", icon: "Handshake" },
        { traditional: "健身", modern: "去健身房举铁", category: "health", icon: "Dumbbell" }
      ],
      ji: [
        { traditional: "借贷", modern: "借钱给别人 (肉包打狗)", category: "wealth", icon: "Banknote" },
        { traditional: "争执", modern: "与人发生口角", category: "general", icon: "MessageCircle" },
        { traditional: "博彩", modern: "跟风投资", category: "wealth", icon: "TrendingDown" }
      ]
    },
    output: {
      yi: [
        { traditional: "纳采", modern: "展示才艺/PPT演讲", category: "career", icon: "Mic" },
        { traditional: "安床", modern: "去做SPA/按摩", category: "health", icon: "Sparkles" },
        { traditional: "宴请", modern: "探店网红美食", category: "general", icon: "Utensils" },
        { traditional: "出行", modern: "来一场Citywalk", category: "general", icon: "Map" }
      ],
      ji: [
        { traditional: "顶撞", modern: "怼老板/客户 (忍住!)", category: "career", icon: "AlertTriangle" },
        { traditional: "词讼", modern: "卷入网络骂战", category: "general", icon: "Keyboard" },
        { traditional: "散漫", modern: "上班摸鱼被抓", category: "career", icon: "EyeOff" }
      ]
    },
    wealth: {
      yi: [
        { traditional: "纳财", modern: "基金定投/理财", category: "wealth", icon: "PiggyBank" },
        { traditional: "交易", modern: "清空购物车", category: "wealth", icon: "ShoppingBag" },
        { traditional: "开市", modern: "推进项目落地", category: "career", icon: "Rocket" }
      ],
      ji: [
        { traditional: "散财", modern: "冲动消费/办卡", category: "wealth", icon: "CreditCard" },
        { traditional: "贪婪", modern: "轻信高回报骗局", category: "wealth", icon: "AlertOctagon" }
      ]
    },
    officer: {
      yi: [
        { traditional: "上官", modern: "面试/述职/汇报", category: "career", icon: "Briefcase" },
        { traditional: "祈福", modern: "制定OKR/计划", category: "general", icon: "ListChecks" },
        { traditional: "修整", modern: "早睡早起/自律", category: "health", icon: "Clock" }
      ],
      ji: [
        { traditional: "犯上", modern: "迟到早退", category: "career", icon: "Watch" },
        { traditional: "过劳", modern: "通宵加班", category: "health", icon: "BatteryWarning" },
        { traditional: "惊扰", modern: "压力过大崩溃", category: "health", icon: "Activity" }
      ]
    },
    resource: {
      yi: [
        { traditional: "求医", modern: "体检/养生/冥想", category: "health", icon: "HeartPulse" },
        { traditional: "入学", modern: "学习新技能/看书", category: "general", icon: "BookOpen" },
        { traditional: "访贵", modern: "请教前辈/导师", category: "career", icon: "UserPlus" }
      ],
      ji: [
        { traditional: "动土", modern: "瞎折腾/搬家", category: "general", icon: "Box" },
        { traditional: "焦虑", modern: "想太多内耗", category: "health", icon: "Brain" },
        { traditional: "闭塞", modern: "拒绝别人建议", category: "general", icon: "XCircle" }
      ]
    }
  };

  var GENDER_EVENTS = {
    male: {
      wealthYi: { traditional: "求偶", modern: "约会/给伴侣买礼物", category: "love", icon: "Heart" }
    },
    female: {
      officerYi: { traditional: "求偶", modern: "约会/男神互动", category: "love", icon: "Heart" }
    }
  };

  var CLASH_EVENTS = {
    yi: { traditional: "避险", modern: "购买保险", category: "wealth", icon: "Shield" },
    ji: { traditional: "冲煞", modern: "极限运动/激烈争吵", category: "health", icon: "AlertTriangle" }
  };

  var NOBLEMAN_EVENTS = {
    yi: { traditional: "贵人", modern: "寻求帮助/抱大腿", category: "career", icon: "Smile" }
  };

  var DEFAULT_KEYWORDS = ["躺平", "搞钱", "桃花", "搬砖", "养生", "水逆", "高光"];
  var LIU_CHONG = {
    "子": "午", "午": "子", "丑": "未", "未": "丑", "寅": "申", "申": "寅",
    "卯": "酉", "酉": "卯", "辰": "戌", "戌": "辰", "巳": "亥", "亥": "巳"
  };
  var LIU_HE = {
    "子": "丑", "丑": "子", "寅": "亥", "亥": "寅", "卯": "戌", "戌": "卯",
    "辰": "酉", "酉": "辰", "巳": "申", "申": "巳", "午": "未", "未": "午"
  };
  var NOBLEMAN = {
    "甲": ["丑", "未"], "戊": ["丑", "未"], "庚": ["丑", "未"],
    "乙": ["子", "申"], "己": ["子", "申"],
    "丙": ["酉", "亥"], "丁": ["酉", "亥"],
    "壬": ["卯", "巳"], "癸": ["卯", "巳"],
    "辛": ["寅", "午"]
  };
  var LU_SHEN = {
    "甲": "寅", "乙": "卯", "丙": "巳", "丁": "午", "戊": "巳",
    "己": "午", "庚": "申", "辛": "酉", "壬": "亥", "癸": "子"
  };
  var ELEMENT_ORDER = ["wood", "fire", "earth", "metal", "water"];

  function init() {
    state.userInfo = loadUserInfo();
    bindTabbar();
    if (!window.Solar) {
      renderFatalError("农历库加载失败，请重新安装应用后再试。");
      return;
    }
    navigate(state.userInfo ? "home" : "onboarding");
  }

  function bindTabbar() {
    document.getElementById("tabbar").addEventListener("click", function (event) {
      var button = event.target.closest("button[data-route]");
      if (!button) return;
      var route = button.getAttribute("data-route");
      if (route === "home") {
        state.selectedDate = today();
      }
      navigate(route);
    });
  }

  function navigate(route) {
    if (route !== "onboarding" && !state.userInfo) {
      route = "onboarding";
    }
    state.route = route;
    renderTabbar();
    if (route === "onboarding") renderOnboarding();
    if (route === "home") renderHome();
    if (route === "calendar") renderCalendar();
    if (route === "profile") renderProfile();
    window.scrollTo(0, 0);
  }

  function renderTabbar() {
    var tabbar = document.getElementById("tabbar");
    tabbar.hidden = state.route === "onboarding";
    tabbar.querySelectorAll("button").forEach(function (button) {
      button.classList.toggle("active", button.getAttribute("data-route") === state.route);
    });
  }

  function renderOnboarding() {
    var user = state.editingProfile && state.userInfo ? clone(state.userInfo) : {
      name: "",
      gender: "",
      birthDate: "",
      birthTime: "12:00",
      city: ""
    };
    var node = template("onboarding-template");
    var app = document.getElementById("app");
    app.replaceChildren(node);

    var form = document.getElementById("profile-form");
    var submit = document.getElementById("submit-profile");
    var fields = {
      name: document.getElementById("name"),
      birthDate: document.getElementById("birthDate"),
      birthTime: document.getElementById("birthTime"),
      city: document.getElementById("city")
    };

    fields.name.value = user.name;
    fields.birthDate.value = user.birthDate;
    fields.birthTime.value = user.birthTime || "12:00";
    fields.city.value = user.city;
    submit.textContent = state.editingProfile ? "保存个人信息" : "点击查看运势";

    function syncGenderButtons() {
      form.querySelectorAll("[data-gender]").forEach(function (button) {
        button.classList.toggle("active", button.getAttribute("data-gender") === user.gender);
      });
    }

    function validate() {
      submit.disabled = !(user.name.trim() && user.gender && user.birthDate && user.birthTime && user.city.trim());
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].addEventListener("input", function () {
        user[key] = fields[key].value;
        validate();
      });
    });

    form.querySelectorAll("[data-gender]").forEach(function (button) {
      button.addEventListener("click", function () {
        user.gender = button.getAttribute("data-gender");
        syncGenderButtons();
        validate();
      });
    });

    submit.addEventListener("click", function () {
      if (submit.disabled) {
        showToast("请完善所有信息");
        return;
      }
      state.userInfo = {
        name: user.name.trim(),
        gender: user.gender,
        birthDate: user.birthDate,
        birthTime: user.birthTime || "12:00",
        city: user.city.trim()
      };
      saveUserInfo(state.userInfo);
      state.editingProfile = false;
      navigate("home");
    });

    syncGenderButtons();
    validate();
  }

  function renderHome() {
    var node = template("home-template");
    document.getElementById("app").replaceChildren(node);

    var fortune;
    try {
      fortune = calculateDailyFortune(state.selectedDate, state.userInfo);
    } catch (error) {
      console.error(error);
      showToast("计算失败，请检查个人信息");
      state.editingProfile = true;
      navigate("onboarding");
      return;
    }

    var date = state.selectedDate;
    setText("current-date", formatDateStr(date));
    setText("date-subtitle", fortune.lunarDateStr + " · " + WEEKDAYS[date.getDay()]);
    setText("luck-score", String(fortune.luckScore));
    setText("keyword", fortune.keyword);
    setText("suggestion", fortune.suggestion);
    setText("lucky-color", fortune.luckyColor);
    setText("lucky-direction", fortune.luckyDirection);
    document.getElementById("score-progress").style.width = fortune.luckScore + "%";
    renderEventList("yi-list", fortune.yi);
    renderEventList("ji-list", fortune.ji);

    document.querySelector("[data-action='prev-day']").addEventListener("click", function () {
      state.selectedDate = addDays(state.selectedDate, -1);
      navigate("home");
    });
    document.querySelector("[data-action='next-day']").addEventListener("click", function () {
      state.selectedDate = addDays(state.selectedDate, 1);
      navigate("home");
    });
    attachSwipe(document.querySelector(".swipe-surface"), function () {
      state.selectedDate = addDays(state.selectedDate, 1);
      navigate("home");
    }, function () {
      state.selectedDate = addDays(state.selectedDate, -1);
      navigate("home");
    });
  }

  function renderEventList(id, items) {
    var list = document.getElementById(id);
    list.replaceChildren();
    items.forEach(function (item) {
      var row = document.createElement("article");
      row.className = "yj-item";
      var traditional = document.createElement("strong");
      traditional.textContent = item.traditional;
      var modern = document.createElement("span");
      modern.textContent = item.modern;
      row.append(traditional, modern);
      list.appendChild(row);
    });
  }

  function renderCalendar() {
    var node = template("calendar-template");
    document.getElementById("app").replaceChildren(node);
    setText("month-title", state.calendarYear + "年" + state.calendarMonth + "月");

    document.querySelector("[data-action='prev-month']").addEventListener("click", function () {
      state.calendarMonth -= 1;
      if (state.calendarMonth < 1) {
        state.calendarMonth = 12;
        state.calendarYear -= 1;
      }
      navigate("calendar");
    });

    document.querySelector("[data-action='next-month']").addEventListener("click", function () {
      state.calendarMonth += 1;
      if (state.calendarMonth > 12) {
        state.calendarMonth = 1;
        state.calendarYear += 1;
      }
      navigate("calendar");
    });

    var grid = document.getElementById("calendar-grid");
    generateCalendar(state.calendarYear, state.calendarMonth).forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      if (item.isOtherMonth) button.classList.add("other-month");
      if (item.isToday) button.classList.add("today");
      if (item.isSelected) button.classList.add("selected");
      button.setAttribute("data-date", item.dateStr);

      var day = document.createElement("strong");
      day.textContent = item.day;
      var lunar = document.createElement("span");
      lunar.textContent = item.lunarDay;
      button.append(day, lunar);
      button.addEventListener("click", function () {
        state.selectedDate = parseDate(button.getAttribute("data-date"));
        navigate("home");
      });
      grid.appendChild(button);
    });
  }

  function generateCalendar(year, month) {
    var firstDay = new Date(year, month - 1, 1);
    var lastDay = new Date(year, month, 0);
    var firstDayOfWeek = firstDay.getDay();
    var daysInMonth = lastDay.getDate();
    var prevMonthDays = new Date(year, month - 1, 0).getDate();
    var calendarData = [];

    for (var i = 0; i < firstDayOfWeek; i += 1) {
      var prevDay = prevMonthDays - firstDayOfWeek + i + 1;
      pushCalendarDate(calendarData, new Date(year, month - 2, prevDay), prevDay, true);
    }

    for (var day = 1; day <= daysInMonth; day += 1) {
      pushCalendarDate(calendarData, new Date(year, month - 1, day), day, false);
    }

    var totalBeforeNext = firstDayOfWeek + daysInMonth;
    var remaining = totalBeforeNext % 7 === 0 ? 0 : 7 - (totalBeforeNext % 7);
    for (var nextDay = 1; nextDay <= remaining; nextDay += 1) {
      pushCalendarDate(calendarData, new Date(year, month, nextDay), nextDay, true);
    }

    return calendarData;
  }

  function pushCalendarDate(calendarData, date, day, isOtherMonth) {
    var lunar = window.Solar.fromDate(date).getLunar();
    calendarData.push({
      dateStr: formatDateStr(date),
      day: day,
      lunarDay: lunar.getDayInChinese(),
      isOtherMonth: isOtherMonth,
      isToday: sameDate(date, today()),
      isSelected: sameDate(date, state.selectedDate)
    });
  }

  function renderProfile() {
    var node = template("profile-template");
    document.getElementById("app").replaceChildren(node);
    var user = state.userInfo;
    var initial = user.name.trim().slice(0, 1) || "我";
    setText("avatar", initial);
    setText("profile-name", user.name);
    setText("profile-meta", (user.gender === "male" ? "男" : "女") + " · " + user.birthDate + " " + user.birthTime + " · " + user.city);

    document.querySelector("[data-action='edit-profile']").addEventListener("click", function () {
      state.editingProfile = true;
      navigate("onboarding");
    });

    document.querySelector("[data-action='show-about']").addEventListener("click", function () {
      showModal({
        title: "现代生活指南",
        message: "基于传统黄历的现代化运势查询工具，结合个人八字生成专属每日建议。\n\n© 2024 版权所有",
        confirmText: "知道了"
      });
    });

    document.querySelector("[data-action='logout']").addEventListener("click", function () {
      showModal({
        title: "确认退出",
        message: "退出后会清除当前账号的登录状态，确认继续吗？",
        confirmText: "确认退出",
        cancelText: "取消",
        danger: true
      }).then(function (confirmed) {
        if (!confirmed) return;
        localStorage.removeItem(STORAGE_USER);
        state.userInfo = null;
        state.selectedDate = today();
        state.editingProfile = false;
        showToast("已退出账号");
        navigate("onboarding");
      });
    });
  }

  function calculateDailyFortune(date, user) {
    var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    var userKey = user.name + "-" + user.gender + "-" + user.birthDate + "-" + user.birthTime + "-" + user.city;
    var seedString = dateStr + "-" + userKey;
    var rng = mulberry32(xmur3(seedString)());

    var birthTimeParts = user.birthTime.split(":");
    var birthDateParts = user.birthDate.split("-").map(Number);
    var userSolar = window.Solar.fromYmdHms(
      birthDateParts[0],
      birthDateParts[1],
      birthDateParts[2],
      birthTimeParts.length === 2 ? parseInt(birthTimeParts[0], 10) : 12,
      birthTimeParts.length === 2 ? parseInt(birthTimeParts[1], 10) : 0,
      0
    );
    var userLunar = userSolar.getLunar();
    var userEightChar = userLunar.getEightChar();
    var userDayGan = userEightChar.getDayGan();
    var userDayZhi = userEightChar.getDayZhi();
    var userYearZhi = userEightChar.getYearZhi();
    var userElement = ELEMENTS[userDayGan];

    var currentSolar = window.Solar.fromDate(date);
    var currentLunar = currentSolar.getLunar();
    var dayGan = currentLunar.getDayGan();
    var dayZhi = currentLunar.getDayZhi();
    var dayOfficer = currentLunar.getZhiXing();
    var jieQiTable = currentLunar.getJieQiTable();
    var jieQi = jieQiTable && jieQiTable[currentLunar.toString()];
    var solarTerm = jieQi ? jieQi.getName() : "";

    var score = 65;
    var factors = [];
    var userNoblemen = NOBLEMAN[userDayGan] || [];

    if (userNoblemen.indexOf(dayZhi) >= 0) {
      score += 20;
      factors.push("nobleman");
    }

    if (LU_SHEN[userDayGan] === dayZhi) {
      score += 15;
      factors.push("lu");
    }

    if (LIU_HE[userYearZhi] === dayZhi) {
      score += 10;
      factors.push("year_he");
    } else if (LIU_CHONG[userYearZhi] === dayZhi) {
      score -= 15;
      factors.push("year_chong");
    }

    if (LIU_HE[userDayZhi] === dayZhi) {
      score += 10;
      factors.push("day_he");
    } else if (LIU_CHONG[userDayZhi] === dayZhi) {
      score -= 20;
      factors.push("day_chong");
    }

    if (["定", "成", "开", "满"].indexOf(dayOfficer) >= 0) score += 5;
    if (["破", "闭"].indexOf(dayOfficer) >= 0) score -= 10;

    score += Math.floor(rng() * 7) - 3;
    score = Math.max(35, Math.min(99, score));

    var personalized = generatePersonalizedEvents(userDayGan, dayGan, dayZhi, user.gender, factors, rng);
    var keyword = getRandom(DEFAULT_KEYWORDS, rng);
    var suggestion = "平淡是真，享受当下的宁静。";
    var relation = getTenGodRelation(userDayGan, dayGan);

    if (factors.indexOf("day_chong") >= 0 || factors.indexOf("year_chong") >= 0) {
      keyword = "冲煞";
      suggestion = "今日冲犯太岁或日支，能量场波动较大，建议以静制动，少说话多做事。";
    } else if (factors.indexOf("nobleman") >= 0) {
      keyword = "贵人";
      suggestion = "天乙贵人星临门，今日适合社交、求人办事，容易获得意外帮助。";
    } else if (relation === "wealth") {
      keyword = "搞钱";
      suggestion = "今日财星高照，适合处理财务问题或努力工作，付出容易有回报。";
    } else if (relation === "officer") {
      keyword = "搞事业";
      suggestion = "官星当值，利于职业发展和规划，保持自律会带来好运气。";
    } else if (relation === "output") {
      keyword = "灵感";
      suggestion = "食伤泄秀，灵感爆棚，适合创作、吃喝玩乐或展示自我。";
    } else if (relation === "resource") {
      keyword = "充电";
      suggestion = "印星生身，适合学习、休息或思考长远计划，不要急于求成。";
    } else if (relation === "peer") {
      keyword = "社交";
      suggestion = "比劫重重，适合聚会联络感情，但要捂紧钱包，避免冲动消费。";
    }

    var luckyElementKey = "wood";
    if (relation === "peer") luckyElementKey = getOutputElement(userElement);
    if (relation === "output") luckyElementKey = getResourceElement(userElement);
    if (relation === "wealth") luckyElementKey = userElement;
    if (relation === "officer") luckyElementKey = getResourceElement(userElement);
    if (relation === "resource") luckyElementKey = getWealthElement(userElement);
    if (factors.indexOf("day_chong") >= 0) luckyElementKey = getResourceElement(userElement);

    return {
      date: date,
      lunarDateStr: currentLunar.getMonthInChinese() + "月" + currentLunar.getDayInChinese(),
      ganZhi: currentLunar.getDayGan() + currentLunar.getDayZhi() + "日",
      solarTerm: solarTerm,
      luckScore: score,
      keyword: keyword,
      yi: personalized.yi,
      ji: personalized.ji,
      luckyColor: (ELEMENT_CONFIG[luckyElementKey] && ELEMENT_CONFIG[luckyElementKey].color) || "金色 (Gold)",
      luckyDirection: WEALTH_DIRECTIONS[userElement] || "正南 (South)",
      suggestion: suggestion
    };
  }

  function generatePersonalizedEvents(userDayGan, dayGan, dayZhi, userGender, factors, rng) {
    var relation = getTenGodRelation(userDayGan, dayGan);
    var baseEvents = TEN_GOD_EVENTS[relation];
    var yi = baseEvents.yi.slice();
    var ji = baseEvents.ji.slice();

    if (relation === "wealth" && userGender === "male") {
      yi.push(GENDER_EVENTS.male.wealthYi);
    }
    if (relation === "officer" && userGender === "female") {
      yi.push(GENDER_EVENTS.female.officerYi);
    }
    if (factors.indexOf("day_chong") >= 0 || factors.indexOf("year_chong") >= 0) {
      ji.unshift(CLASH_EVENTS.ji);
      yi.push(CLASH_EVENTS.yi);
    }
    if (factors.indexOf("nobleman") >= 0) {
      yi.unshift(NOBLEMAN_EVENTS.yi);
    }

    return {
      yi: shuffle(yi, rng).slice(0, 4),
      ji: shuffle(ji, rng).slice(0, 4)
    };
  }

  function getTenGodRelation(selfGan, otherGan) {
    var selfIdx = getElementIndex(selfGan);
    var otherIdx = getElementIndex(otherGan);
    var diff = (otherIdx - selfIdx + 5) % 5;
    if (diff === 0) return "peer";
    if (diff === 1) return "output";
    if (diff === 2) return "wealth";
    if (diff === 3) return "officer";
    if (diff === 4) return "resource";
    return "peer";
  }

  function getElementIndex(gan) {
    return ELEMENT_ORDER.indexOf(ELEMENTS[gan]);
  }

  function getOutputElement(userElement) {
    var idx = ELEMENT_ORDER.indexOf(userElement);
    return ELEMENT_ORDER[(idx + 1) % 5];
  }

  function getWealthElement(userElement) {
    var idx = ELEMENT_ORDER.indexOf(userElement);
    return ELEMENT_ORDER[(idx + 2) % 5];
  }

  function getResourceElement(userElement) {
    var idx = ELEMENT_ORDER.indexOf(userElement);
    return ELEMENT_ORDER[(idx + 4) % 5];
  }

  function xmur3(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i += 1) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = h << 13 | h >>> 19;
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  function mulberry32(a) {
    return function () {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function getRandom(arr, rng) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function shuffle(arr, rng) {
    var newArr = arr.slice();
    for (var i = newArr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = newArr[i];
      newArr[i] = newArr[j];
      newArr[j] = tmp;
    }
    return newArr;
  }

  function template(id) {
    return document.getElementById(id).content.cloneNode(true);
  }

  function setText(id, value) {
    document.getElementById(id).textContent = value;
  }

  function parseDate(value) {
    var parts = value.split("-").map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDateStr(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function today() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function addDays(date, amount) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  }

  function sameDate(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function loadUserInfo() {
    try {
      var raw = localStorage.getItem(STORAGE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(error);
      return null;
    }
  }

  function saveUserInfo(userInfo) {
    localStorage.setItem(STORAGE_USER, JSON.stringify(userInfo));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function attachSwipe(node, onLeft, onRight) {
    var startX = 0;
    var currentX = 0;
    node.addEventListener("touchstart", function (event) {
      startX = event.touches[0].clientX;
      currentX = startX;
    }, { passive: true });
    node.addEventListener("touchmove", function (event) {
      currentX = event.touches[0].clientX;
    }, { passive: true });
    node.addEventListener("touchend", function () {
      var diff = startX - currentX;
      if (Math.abs(diff) <= 56) return;
      if (diff > 0) {
        onLeft();
      } else {
        onRight();
      }
    });
  }

  function showToast(message) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("visible");
    }, 10);
    setTimeout(function () {
      toast.classList.remove("visible");
      setTimeout(function () {
        toast.remove();
      }, 220);
    }, 1800);
  }

  function showModal(options) {
    return new Promise(function (resolve) {
      var overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      var modal = document.createElement("section");
      modal.className = "modal-card";
      var title = document.createElement("h2");
      title.textContent = options.title;
      var message = document.createElement("p");
      message.textContent = options.message;
      var actions = document.createElement("div");
      actions.className = "modal-actions";
      var confirm = document.createElement("button");
      confirm.type = "button";
      confirm.textContent = options.confirmText || "确定";
      confirm.className = options.danger ? "danger-button" : "confirm-button";
      actions.appendChild(confirm);

      if (options.cancelText) {
        var cancel = document.createElement("button");
        cancel.type = "button";
        cancel.textContent = options.cancelText;
        cancel.className = "cancel-button";
        actions.insertBefore(cancel, confirm);
        cancel.addEventListener("click", close.bind(null, false));
      }

      confirm.addEventListener("click", close.bind(null, true));
      modal.append(title, message, actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      function close(result) {
        overlay.remove();
        resolve(result);
      }
    });
  }

  function renderFatalError(message) {
    var app = document.getElementById("app");
    var section = document.createElement("section");
    section.className = "screen";
    var card = document.createElement("div");
    card.className = "card yj-card";
    card.textContent = message;
    section.appendChild(card);
    app.replaceChildren(section);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
