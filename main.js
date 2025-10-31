// 旅行规划网站主要JavaScript功能

// 全局变量
let currentStep = 1;
let tripData = {
    destination: '',
    startDate: '',
    endDate: '',
    budget: 5000,
    preferences: []
};

// 目的地数据
const destinations = [
    '东京', '巴黎', '纽约', '伦敦', '罗马', '巴塞罗那', '悉尼', '新加坡',
    '曼谷', '首尔', '迪拜', '阿姆斯特丹', '维也纳', '布拉格', '爱丁堡'
];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    setupEventListeners();
    initializeAnimations();
    setupAutocomplete();
    initializeCharts();
    loadPopularDestinations();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索表单
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    // 预算滑块
    const budgetSlider = document.getElementById('budgetSlider');
    if (budgetSlider) {
        budgetSlider.addEventListener('input', updateBudgetDisplay);
    }

    // 偏好标签
    const preferenceTags = document.querySelectorAll('.preference-tag');
    preferenceTags.forEach(tag => {
        tag.addEventListener('click', togglePreference);
    });

    // 日期输入
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    if (startDate && endDate) {
        startDate.addEventListener('change', validateDates);
        endDate.addEventListener('change', validateDates);
    }

    // 导航链接
    setupNavigation();
}

// 设置导航
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a[href]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                // 对于实际页面，允许正常跳转
                return;
            }
            e.preventDefault();
            
            // 对于锚点链接，平滑滚动
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 初始化动画
function initializeAnimations() {
    // 页面加载动画
    anime({
        targets: '.animate-fade-in',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutQuart'
    });

    // 卡片悬停动画
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                duration: 300,
                easing: 'easeOutQuart'
            });
        });

        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });
}

// 设置自动补全
function setupAutocomplete() {
    const destinationInput = document.getElementById('destination');
    if (!destinationInput) return;

    const suggestions = document.getElementById('suggestions');
    
    destinationInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length < 1) {
            suggestions.style.display = 'none';
            return;
        }

        const matches = destinations.filter(dest => 
            dest.toLowerCase().includes(value)
        );

        if (matches.length > 0) {
            suggestions.innerHTML = matches.map(dest => 
                `<div class="suggestion-item" onclick="selectDestination('${dest}')">${dest}</div>`
            ).join('');
            suggestions.style.display = 'block';
        } else {
            suggestions.style.display = 'none';
        }
    });

    // 点击外部关闭建议
    document.addEventListener('click', function(e) {
        if (!destinationInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
        }
    });
}

// 选择目的地
function selectDestination(destination) {
    const destinationInput = document.getElementById('destination');
    const suggestions = document.getElementById('suggestions');
    
    destinationInput.value = destination;
    suggestions.style.display = 'none';
    tripData.destination = destination;
}

// 更新预算显示
function updateBudgetDisplay() {
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetDisplay = document.getElementById('budgetDisplay');
    
    if (budgetSlider && budgetDisplay) {
        const value = budgetSlider.value;
        budgetDisplay.textContent = `¥${value}`;
        tripData.budget = parseInt(value);
    }
}

// 切换偏好选择
function togglePreference(e) {
    const tag = e.target;
    const preference = tag.dataset.preference;
    
    tag.classList.toggle('selected');
    
    if (tag.classList.contains('selected')) {
        if (!tripData.preferences.includes(preference)) {
            tripData.preferences.push(preference);
        }
    } else {
        tripData.preferences = tripData.preferences.filter(p => p !== preference);
    }
}

// 验证日期
function validateDates() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        
        if (end <= start) {
            endDate.setCustomValidity('结束日期必须晚于开始日期');
        } else {
            endDate.setCustomValidity('');
            tripData.startDate = startDate.value;
            tripData.endDate = endDate.value;
        }
    }
}

// 处理搜索
async function handleSearch(e) {
    e.preventDefault();
    
    // 收集表单数据
    const formData = new FormData(e.target);
    tripData.destination = formData.get('destination') || tripData.destination;
    tripData.startDate = formData.get('startDate') || tripData.startDate;
    tripData.endDate = formData.get('endDate') || tripData.endDate;
    
    // 显示加载状态
    showLoadingState();
    
    try {
        // 使用API服务获取智能推荐
        const [hotelRecommendations, attractionRecommendations] = await Promise.all([
            window.travelAPI.getHotelRecommendations(tripData),
            window.travelAPI.getAttractionRecommendations(tripData)
        ]);
        
        // 生成推荐结果
        generateSmartRecommendations(hotelRecommendations, attractionRecommendations);
        
    } catch (error) {
        console.error('获取推荐失败:', error);
        // 使用备用方案
        generateRecommendations();
    } finally {
        hideLoadingState();
    }
}

// 显示加载状态
function showLoadingState() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.innerHTML = `
            <div class="text-center py-12">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">正在为您生成个性化行程建议...</p>
            </div>
        `;
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 隐藏加载状态
function hideLoadingState() {
    // 加载状态会被新的内容替换
}

// 生成智能推荐结果
function generateSmartRecommendations(hotels, attractions) {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) return;

    // 计算总费用和节省金额
    const totalHotelCost = hotels.reduce((sum, hotel) => sum + hotel.totalPrice, 0);
    const totalAttractionCost = attractions.reduce((sum, attraction) => sum + attraction.price, 0);
    const totalCost = totalHotelCost + totalAttractionCost + 500; // 加上交通和其他费用
    const totalSavings = hotels.reduce((sum, hotel) => sum + (hotel.savings || 0), 0);
    
    const nights = window.travelAPI.calculateNights(tripData.startDate, tripData.endDate);

    resultsSection.innerHTML = `
        <div class="animate-fade-in">
            <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">为您智能推荐的行程方案</h2>
            
            <!-- 行程概览 -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 class="text-xl font-semibold mb-4">行程概览</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-blue-50 rounded-lg">
                        <div class="text-2xl font-bold text-blue-600">${nights}</div>
                        <div class="text-gray-600">总天数</div>
                    </div>
                    <div class="text-center p-4 bg-green-50 rounded-lg">
                        <div class="text-2xl font-bold text-green-600">¥${totalCost}</div>
                        <div class="text-gray-600">预估总费用</div>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                        <div class="text-2xl font-bold text-purple-600">¥${totalSavings}</div>
                        <div class="text-gray-600">节省金额</div>
                    </div>
                    <div class="text-center p-4 bg-yellow-50 rounded-lg">
                        <div class="text-2xl font-bold text-yellow-600">${hotels.length}</div>
                        <div class="text-gray-600">推荐酒店</div>
                    </div>
                </div>
            </div>

            <!-- 推荐酒店 -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-semibold">智能推荐酒店</h3>
                    <span class="text-sm text-gray-600">基于您的偏好和预算量身定制</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${hotels.map(hotel => createSmartHotelCard(hotel)).join('')}
                </div>
            </div>

            <!-- 推荐景点 -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-semibold">精选景点推荐</h3>
                    <span class="text-sm text-gray-600">结合位置和兴趣的智能匹配</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    ${attractions.map(attraction => createSmartAttractionCard(attraction)).join('')}
                </div>
            </div>

            <!-- 个性化建议 -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-semibold mb-4">个性化省钱建议</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${generatePersonalizedTips(hotels, attractions, tripData).map(tip => `
                        <div class="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                            <div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span class="text-white text-sm">${tip.icon}</span>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">${tip.title}</h4>
                                <p class="text-sm text-gray-600">${tip.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // 重新初始化动画
    anime({
        targets: '.animate-fade-in',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutQuart'
    });

    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// 创建智能酒店卡片
function createSmartHotelCard(hotel) {
    return `
        <div class="card-hover bg-gray-50 rounded-lg overflow-hidden">
            <div class="relative">
                <img src="${hotel.images[0]}" alt="${hotel.name}" class="w-full h-48 object-cover">
                <div class="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold">
                    ${hotel.savings > 0 ? `省¥${hotel.savings}` : '热销'}
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-semibold text-lg">${hotel.name}</h4>
                    <div class="text-right">
                        <div class="text-blue-600 font-bold text-lg">¥${hotel.price}/晚</div>
                        <div class="text-sm text-gray-500">总价¥${hotel.totalPrice}</div>
                    </div>
                </div>
                
                <div class="flex items-center mb-2">
                    <span class="rating-stars mr-1">★</span>
                    <span class="text-sm font-medium">${hotel.rating}</span>
                    <span class="text-sm text-gray-600 ml-2">(${hotel.reviews}条评价)</span>
                </div>
                
                <p class="text-sm text-gray-600 mb-3">
                    📍 ${hotel.location} • 距市中心${hotel.distanceToCenter}km
                </p>
                
                <div class="flex flex-wrap gap-1 mb-3">
                    ${hotel.amenities.slice(0, 3).map(amenity => 
                        `<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${amenity}</span>`
                    ).join('')}
                    ${hotel.amenities.length > 3 ? `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">+${hotel.amenities.length-3}</span>` : ''}
                </div>
                
                ${hotel.推荐理由 && hotel.推荐理由.length > 0 ? `
                    <div class="mb-3">
                        <div class="text-xs text-green-600 font-medium mb-1">推荐理由</div>
                        <div class="text-xs text-gray-600">
                            ${hotel.推荐理由.map(reason => `• ${reason}`).join('<br>')}
                        </div>
                    </div>
                ` : ''}
                
                <button class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors text-sm">
                    查看详情
                </button>
            </div>
        </div>
    `;
}

// 创建智能景点卡片
function createSmartAttractionCard(attraction) {
    const crowdColor = {
        '较少': 'crowd-low',
        '中等': 'crowd-medium',
        '较多': 'crowd-high',
        '很多': 'crowd-high'
    }[attraction.crowd] || 'crowd-medium';
    
    return `
        <div class="card-hover bg-gray-50 rounded-lg overflow-hidden">
            <div class="relative">
                <img src="${attraction.images[0]}" alt="${attraction.name}" class="w-full h-32 object-cover">
                <div class="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold">
                    ${attraction.price === 0 ? '免费' : `¥${attraction.price}`}
                </div>
            </div>
            <div class="p-3">
                <h4 class="font-semibold text-sm mb-2">${attraction.name}</h4>
                
                <div class="flex items-center mb-2">
                    <span class="rating-stars mr-1 text-xs">★</span>
                    <span class="text-xs font-medium">${attraction.rating}</span>
                    <span class="text-xs text-gray-600 ml-1">(${attraction.reviews})</span>
                </div>
                
                <div class="text-xs text-gray-600 mb-2">
                    <div class="flex justify-between">
                        <span>人流量:</span>
                        <span class="${crowdColor} font-medium">${attraction.crowd}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>游览时长:</span>
                        <span class="font-medium">${attraction.duration}</span>
                    </div>
                </div>
                
                <div class="text-xs text-blue-600 mb-2">
                    最佳时间: ${attraction.bestTime}
                </div>
                
                ${attraction.推荐理由 && attraction.推荐理由.length > 0 ? `
                    <div class="mb-2">
                        <div class="text-xs text-green-600">${attraction.推荐理由[0]}</div>
                    </div>
                ` : ''}
                
                <button class="w-full bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition-colors text-xs">
                    加入行程
                </button>
            </div>
        </div>
    `;
}

// 生成个性化省钱建议
function generatePersonalizedTips(hotels, attractions, userData) {
    const tips = [];
    
    // 基于预算的建议
    if (userData.budget < 3000) {
        tips.push({
            icon: '💰',
            title: '预算优化建议',
            description: '选择经济型住宿和免费景点，可节省30%费用'
        });
    }
    
    // 基于酒店选择的建议
    const budgetHotels = hotels.filter(hotel => hotel.price < 150);
    if (budgetHotels.length > 0) {
        tips.push({
            icon: '🏨',
            title: '住宿省钱技巧',
            description: '选择经济型酒店已为您节省¥' + budgetHotels.reduce((sum, hotel) => sum + hotel.savings, 0)
        });
    }
    
    // 基于景点选择的建议
    const freeAttractions = attractions.filter(attr => attr.price === 0);
    if (freeAttractions.length > 0) {
        tips.push({
            icon: '🎫',
            title: '免费景点利用',
            description: `${freeAttractions.length}个免费景点可节省门票¥${freeAttractions.length * 20}`
        });
    }
    
    // 基于偏好的建议
    if (userData.preferences.includes('美食')) {
        tips.push({
            icon: '🍽️',
            title: '美食省钱攻略',
            description: '选择当地小吃街，既省钱又能体验地道美食'
        });
    }
    
    // 通用建议
    tips.push({
        icon: '⏰',
        title: '最佳预订时间',
        description: '提前30天预订可享受平均15%的折扣'
    });
    
    return tips.slice(0, 4);
}

// 计算推荐结果
function calculateRecommendations() {
    const startDate = new Date(tripData.startDate);
    const endDate = new Date(tripData.endDate);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // 基于预算和偏好筛选酒店和景点
    const suitableHotels = hotels.filter(hotel => {
        const totalHotelCost = hotel.price * totalDays;
        return totalHotelCost <= tripData.budget * 0.4; // 酒店费用不超过预算40%
    });

    const suitableAttractions = attractions.filter(attraction => {
        return tripData.preferences.length === 0 || 
               tripData.preferences.some(pref => attractionMatchesPreference(attraction, pref));
    });

    // 计算总费用和节省金额
    const selectedHotel = suitableHotels[0] || hotels[0];
    const selectedAttractions = suitableAttractions.slice(0, 3);
    
    const hotelCost = selectedHotel.price * totalDays;
    const attractionCost = selectedAttractions.reduce((sum, attr) => sum + attr.price, 0);
    const totalCost = hotelCost + attractionCost + 500; // 加上交通和其他费用
    
    const originalCost = totalCost * 1.3; // 假设原价是1.3倍
    const savings = Math.round(originalCost - totalCost);

    return {
        totalDays,
        totalCost,
        savings,
        hotels: suitableHotels.slice(0, 3),
        attractions: selectedAttractions,
        savingsTips: [
            '提前30天预订可享受15%的折扣',
            '选择工作日出行，酒店价格更优惠',
            '使用我们的合作伙伴优惠码节省10%',
            '考虑套餐预订，比分开预订更划算'
        ]
    };
}

// 景点匹配偏好
function attractionMatchesPreference(attraction, preference) {
    const preferenceMap = {
        '文化': ['博物馆', '画廊', '历史'],
        '自然': ['山', '公园', '海滩'],
        '休闲': ['观景', '温泉', '购物'],
        '探险': ['徒步', '攀岩', '漂流']
    };

    const keywords = preferenceMap[preference] || [];
    return keywords.some(keyword => attraction.name.includes(keyword));
}

// 创建酒店卡片
function createHotelCard(hotel) {
    return `
        <div class="card-hover bg-gray-50 rounded-lg overflow-hidden">
            <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h4 class="font-semibold text-lg mb-2">${hotel.name}</h4>
                <div class="flex items-center justify-between mb-2">
                    <span class="text-blue-600 font-bold">¥${hotel.price}/晚</span>
                    <div class="flex items-center">
                        <span class="text-yellow-500 mr-1">★</span>
                        <span class="text-sm text-gray-600">${hotel.rating}</span>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-3">${hotel.location}</p>
                <div class="flex flex-wrap gap-1">
                    ${hotel.amenities.slice(0, 3).map(amenity => 
                        `<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">${amenity}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
}

// 创建景点卡片
function createAttractionCard(attraction) {
    return `
        <div class="card-hover bg-gray-50 rounded-lg overflow-hidden">
            <img src="${attraction.image}" alt="${attraction.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h4 class="font-semibold text-lg mb-2">${attraction.name}</h4>
                <div class="flex items-center justify-between mb-2">
                    <span class="text-green-600 font-bold">¥${attraction.price}</span>
                    <div class="flex items-center">
                        <span class="text-yellow-500 mr-1">★</span>
                        <span class="text-sm text-gray-600">${attraction.rating}</span>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-2">人流量: ${attraction.crowd}</p>
                <p class="text-sm text-blue-600">最佳时间: ${attraction.bestTime}</p>
            </div>
        </div>
    `;
}

// 加载热门目的地
function loadPopularDestinations() {
    const container = document.getElementById('popularDestinations');
    if (!container) return;

    const popularDests = [
        { name: '东京', image: 'https://kimi-web-img.moonshot.cn/img/images.unsplash.com/11ec5583ac4ff3ec23cbbb81b5f20826cb866cfd', description: '现代与传统完美融合' },
        { name: '巴黎', image: 'https://kimi-web-img.moonshot.cn/img/thumbs.dreamstime.com/0e5d9c46781c0429b9172acc1a47f012e38876ea.jpg', description: '浪漫之都的艺术气息' },
        { name: '纽约', image: 'https://kimi-web-img.moonshot.cn/img/images.pexels.com/a9de9959fdc117cb5cd429620edd406416d06e0b.jpeg', description: '不夜城的繁华魅力' },
        { name: '伦敦', image: 'https://kimi-web-img.moonshot.cn/img/www.atlantatrails.com/e0a5b9f12db0a9ce31e723acbd1f414d30f29dfc.jpg', description: '历史与现代的交汇点' }
    ];

    container.innerHTML = popularDests.map(dest => `
        <div class="card-hover relative rounded-xl overflow-hidden">
            <img src="${dest.image}" alt="${dest.name}" class="w-full h-64 object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 text-white">
                <h3 class="text-xl font-bold">${dest.name}</h3>
                <p class="text-sm opacity-90">${dest.description}</p>
            </div>
        </div>
    `).join('');
}

// 初始化图表
function initializeCharts() {
    // 预算分析图表
    const chartContainer = document.getElementById('budgetChart');
    if (chartContainer && typeof echarts !== 'undefined') {
        const chart = echarts.init(chartContainer);
        
        const option = {
            title: {
                text: '旅行预算分析',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: ¥{c} ({d}%)'
            },
            series: [{
                name: '预算分配',
                type: 'pie',
                radius: '70%',
                data: [
                    { value: 2000, name: '住宿费用' },
                    { value: 800, name: '交通费用' },
                    { value: 600, name: '餐饮费用' },
                    { value: 400, name: '景点门票' },
                    { value: 200, name: '其他费用' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                itemStyle: {
                    color: function(params) {
                        const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#1e3a8a'];
                        return colors[params.dataIndex];
                    }
                }
            }]
        };
        
        chart.setOption(option);
        
        // 响应式调整
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }
}