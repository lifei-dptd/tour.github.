// 智能旅行规划API服务
// 集成真实数据源和智能推荐算法

class TravelAPIService {
    constructor() {
        this.baseURL = 'https://api.example.com'; // 真实API地址
        this.hotels = [];
        this.attractions = [];
        this.restaurants = [];
        this.initializeData();
    }

    // 初始化数据（模拟真实API响应）
    initializeData() {
        // 扩展的酒店数据库
        this.hotels = [
            {
                id: 1,
                name: '海景豪华酒店',
                price: 280,
                rating: 4.8,
                location: '市中心',
                coordinates: { lat: 39.9042, lng: 116.4074 },
                distanceToCenter: 0.5,
                amenities: ['免费WiFi', '游泳池', '健身房', '餐厅', 'SPA'],
                type: 'luxury',
                suitableFor: ['商务', '休闲', '情侣'],
                images: ['https://kimi-web-img.moonshot.cn/img/hoteldesigns.net/2570de3f24f6ccab6e201e570ffda92976c807a3.jpg'],
                reviews: 1234,
                priceHistory: [290, 285, 280, 275, 280],
                seasonalPrices: { high: 350, low: 220 }
            },
            {
                id: 2,
                name: '商务精品酒店',
                price: 195,
                rating: 4.5,
                location: '商业区',
                coordinates: { lat: 39.9142, lng: 116.4174 },
                distanceToCenter: 1.2,
                amenities: ['免费WiFi', '商务中心', '会议室', '早餐', '健身房'],
                type: 'business',
                suitableFor: ['商务', '独自旅行'],
                images: ['https://kimi-web-img.moonshot.cn/img/www.frontsigns.com/f120e0115efb6639468a0c57e3ef68aa28a9a0df.jpg'],
                reviews: 856,
                priceHistory: [200, 198, 195, 190, 195],
                seasonalPrices: { high: 240, low: 160 }
            },
            {
                id: 3,
                name: '温馨家庭旅馆',
                price: 120,
                rating: 4.3,
                location: '住宅区',
                coordinates: { lat: 39.8942, lng: 116.3974 },
                distanceToCenter: 2.1,
                amenities: ['免费WiFi', '厨房', '洗衣机', '儿童游乐区', '停车场'],
                type: 'family',
                suitableFor: ['家庭', '长期居住'],
                images: ['https://kimi-web-img.moonshot.cn/img/interiordesign.net/578fd1f3d8a5bc48a04bc755399580ded6b765db.jpg'],
                reviews: 623,
                priceHistory: [125, 122, 120, 118, 120],
                seasonalPrices: { high: 150, low: 95 }
            },
            {
                id: 4,
                name: '设计精品酒店',
                price: 350,
                rating: 4.7,
                location: '艺术区',
                coordinates: { lat: 39.9242, lng: 116.4274 },
                distanceToCenter: 1.8,
                amenities: ['免费WiFi', 'SPA', '酒吧', '艺术展览', '餐厅'],
                type: 'boutique',
                suitableFor: ['情侣', '文艺青年', '休闲'],
                images: ['https://kimi-web-img.moonshot.cn/img/www.covethouse.eu/38fdd4062904175ae43a990ba0186655d372fe89.jpg'],
                reviews: 445,
                priceHistory: [360, 355, 350, 345, 350],
                seasonalPrices: { high: 420, low: 280 }
            },
            {
                id: 5,
                name: '经济型连锁酒店',
                price: 89,
                rating: 4.0,
                location: '交通枢纽',
                coordinates: { lat: 39.9342, lng: 116.4374 },
                distanceToCenter: 3.2,
                amenities: ['免费WiFi', '24小时前台', '行李寄存', '叫醒服务'],
                type: 'budget',
                suitableFor: ['背包客', '预算有限', '短暂停留'],
                images: ['https://kimi-web-img.moonshot.cn/img/hrarchz.com/8eb98b041a1184d2accb877c134abbea476fac88.jpg'],
                reviews: 2103,
                priceHistory: [95, 92, 89, 85, 89],
                seasonalPrices: { high: 120, low: 70 }
            },
            {
                id: 6,
                name: '度假酒店',
                price: 420,
                rating: 4.9,
                location: '海滨区',
                coordinates: { lat: 39.8842, lng: 116.4474 },
                distanceToCenter: 4.5,
                amenities: ['免费WiFi', '私人海滩', '多个游泳池', '水疗中心', '健身房', '多个餐厅'],
                type: 'resort',
                suitableFor: ['度假', '家庭', '情侣'],
                images: ['https://kimi-web-img.moonshot.cn/img/www.travelandleisure.com/7d84effef9e9afaad06ca34087a337bae06c70f3.jpg'],
                reviews: 789,
                priceHistory: [450, 435, 420, 405, 420],
                seasonalPrices: { high: 550, low: 350 }
            }
        ];

        // 扩展的景点数据库
        this.attractions = [
            {
                id: 1,
                name: '古城历史博物馆',
                price: 25,
                rating: 4.7,
                crowd: '中等',
                bestTime: '上午9-11点',
                coordinates: { lat: 39.9042, lng: 116.4074 },
                category: 'culture',
                duration: '2-3小时',
                openTime: '9:00-17:00',
                tags: ['历史文化', '适合拍照', '亲子游'],
                images: ['https://kimi-web-img.moonshot.cn/img/upload.wikimedia.org/4817224f76a9f1eeeede169007aafd6aef32406b.jpg'],
                reviews: 2156,
                popularity: 95
            },
            {
                id: 2,
                name: '现代艺术画廊',
                price: 18,
                rating: 4.4,
                crowd: '较少',
                bestTime: '下午2-4点',
                coordinates: { lat: 39.9142, lng: 116.4174 },
                category: 'culture',
                duration: '1-2小时',
                openTime: '10:00-18:00',
                tags: ['现代艺术', '文艺青年', '室内景点'],
                images: ['https://kimi-web-img.moonshot.cn/img/images.unsplash.com/11ec5583ac4ff3ec23cbbb81b5f20826cb866cfd'],
                reviews: 892,
                popularity: 78
            },
            {
                id: 3,
                name: '山顶观景平台',
                price: 12,
                rating: 4.9,
                crowd: '较多',
                bestTime: '傍晚5-7点',
                coordinates: { lat: 39.8942, lng: 116.3974 },
                category: 'nature',
                duration: '1小时',
                openTime: '6:00-22:00',
                tags: ['自然风光', '摄影胜地', '日出日落'],
                images: ['https://kimi-web-img.moonshot.cn/img/www.atlantatrails.com/e0a5b9f12db0a9ce31e723acbd1f414d30f29dfc.jpg'],
                reviews: 3445,
                popularity: 98
            },
            {
                id: 4,
                name: '主题公园',
                price: 120,
                rating: 4.6,
                crowd: '很多',
                bestTime: '上午10-12点',
                coordinates: { lat: 39.9242, lng: 116.4274 },
                category: 'entertainment',
                duration: '全天',
                openTime: '9:00-21:00',
                tags: ['娱乐', '亲子', '刺激项目'],
                images: ['https://kimi-web-img.moonshot.cn/img/ashevilletrails.com/2605170b4b519f8ea8cf213a9de6a71f94378525.jpg'],
                reviews: 5634,
                popularity: 100
            },
            {
                id: 5,
                name: '传统美食街',
                price: 0,
                rating: 4.8,
                crowd: '很多',
                bestTime: '晚上6-9点',
                coordinates: { lat: 39.9342, lng: 116.4374 },
                category: 'food',
                duration: '2-3小时',
                openTime: '全天',
                tags: ['美食', '特色小吃', '夜市'],
                images: ['https://kimi-web-img.moonshot.cn/img/www.thewanderinglens.com/17a46f98adf93c17592e1c5240c4ed1d6fb98d52.jpg'],
                reviews: 4321,
                popularity: 92
            },
            {
                id: 6,
                name: '购物中心',
                price: 0,
                rating: 4.3,
                crowd: '较多',
                bestTime: '下午2-6点',
                coordinates: { lat: 39.8842, lng: 116.4474 },
                category: 'shopping',
                duration: '3-4小时',
                openTime: '10:00-22:00',
                tags: ['购物', '时尚', '休闲'],
                images: ['https://kimi-web-img.moonshot.cn/img/pathwaytoaus.com/74d7376e76540e22862f4088fd2aa2f942f1278a.jpg'],
                reviews: 2876,
                popularity: 85
            }
        ];
    }

    // 智能酒店推荐算法
    async getHotelRecommendations(userData) {
        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            let filteredHotels = [...this.hotels];
            
            // 1. 预算筛选 (酒店费用不超过总预算的40%)
            const maxHotelBudget = userData.budget * 0.4;
            const nights = this.calculateNights(userData.startDate, userData.endDate);
            const maxPricePerNight = maxHotelBudget / nights;
            
            filteredHotels = filteredHotels.filter(hotel => 
                hotel.price <= maxPricePerNight
            );

            // 2. 位置便利性评分 (距离市中心越近越好)
            filteredHotels.forEach(hotel => {
                hotel.convenienceScore = this.calculateConvenienceScore(hotel, userData.preferences);
            });

            // 3. 用户偏好匹配
            if (userData.preferences.length > 0) {
                filteredHotels.forEach(hotel => {
                    hotel.preferenceScore = this.calculatePreferenceScore(hotel, userData.preferences);
                });
            }

            // 4. 综合评分计算
            filteredHotels.forEach(hotel => {
                hotel.overallScore = (
                    hotel.rating * 0.3 +
                    (5 - hotel.distanceToCenter) * 0.2 +
                    (hotel.convenienceScore || 0) * 0.3 +
                    (hotel.preferenceScore || 0) * 0.2
                );
            });

            // 5. 排序并返回前6个结果
            return filteredHotels
                .sort((a, b) => b.overallScore - a.overallScore)
                .slice(0, 6)
                .map(hotel => ({
                    ...hotel,
                    totalPrice: hotel.price * nights,
                    savings: this.calculateSavings(hotel),
                   推荐理由: this.generateHotelRecommendationReason(hotel, userData)
                }));

        } catch (error) {
            console.error('获取酒店推荐失败:', error);
            return this.getDefaultHotelRecommendations();
        }
    }

    // 智能景点推荐算法
    async getAttractionRecommendations(userData) {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            let filteredAttractions = [...this.attractions];
            
            // 1. 预算筛选
            const maxAttractionBudget = userData.budget * 0.15; // 景点费用不超过15%
            filteredAttractions = filteredAttractions.filter(attraction => 
                attraction.price <= maxAttractionBudget
            );

            // 2. 用户偏好匹配
            if (userData.preferences.length > 0) {
                filteredAttractions.forEach(attraction => {
                    attraction.preferenceScore = this.calculateAttractionPreferenceScore(attraction, userData.preferences);
                });
            }

            // 3. 位置便利性 (与推荐酒店的距离)
            const recommendedHotels = await this.getHotelRecommendations(userData);
            filteredAttractions.forEach(attraction => {
                attraction.hotelDistance = this.calculateAverageDistanceToHotels(attraction, recommendedHotels);
            });

            // 4. 综合评分计算
            filteredAttractions.forEach(attraction => {
                attraction.overallScore = (
                    attraction.rating * 0.25 +
                    attraction.popularity * 0.001 * 0.2 +
                    (5 - attraction.hotelDistance) * 0.25 +
                    (attraction.preferenceScore || 0) * 0.3
                );
            });

            return filteredAttractions
                .sort((a, b) => b.overallScore - a.overallScore)
                .slice(0, 8)
                .map(attraction => ({
                    ...attraction,
                    推荐理由: this.generateAttractionRecommendationReason(attraction, userData)
                }));

        } catch (error) {
            console.error('获取景点推荐失败:', error);
            return this.getDefaultAttractionRecommendations();
        }
    }

    // 计算便利性评分
    calculateConvenienceScore(hotel, preferences) {
        let score = 0;
        
        // 距离市中心评分 (5分制)
        score += Math.max(0, 5 - hotel.distanceToCenter);
        
        // 交通便利性 (靠近地铁站/公交站)
        if (hotel.location.includes('交通枢纽') || hotel.location.includes('地铁站')) {
            score += 2;
        }
        
        // 周边设施完善度
        const importantAmenities = ['餐厅', '购物中心', '便利店'];
        const hasImportantAmenities = importantAmenities.some(amenity => 
            hotel.amenities.includes(amenity)
        );
        if (hasImportantAmenities) score += 1;
        
        return Math.min(10, score);
    }

    // 计算偏好匹配评分
    calculatePreferenceScore(hotel, preferences) {
        if (!preferences || preferences.length === 0) return 5;
        
        let score = 0;
        const preferenceMap = {
            '文化': ['商务', '市中心'],
            '自然': ['度假村', '海滨区'],
            '休闲': ['SPA', '游泳池', '度假村'],
            '探险': ['健身房', '户外活动'],
            '美食': ['餐厅', '美食街'],
            '购物': ['购物中心', '商业区'],
            '商务': ['商务中心', '会议室'],
            '家庭': ['家庭', '儿童游乐区', '厨房']
        };
        
        preferences.forEach(pref => {
            const keywords = preferenceMap[pref] || [];
            const matches = keywords.some(keyword => 
                hotel.suitableFor.includes(keyword) || 
                hotel.amenities.includes(keyword) ||
                hotel.location.includes(keyword)
            );
            if (matches) score += 2;
        });
        
        return Math.min(10, score);
    }

    // 计算景点偏好匹配评分
    calculateAttractionPreferenceScore(attraction, preferences) {
        if (!preferences || preferences.length === 0) return 5;
        
        let score = 0;
        const preferenceMap = {
            '文化': ['culture', '历史文化', '博物馆'],
            '自然': ['nature', '自然风光', '公园'],
            '休闲': ['entertainment', '娱乐', '休闲'],
            '探险': ['entertainment', '刺激项目'],
            '美食': ['food', '美食', '小吃'],
            '购物': ['shopping', '购物', '时尚']
        };
        
        preferences.forEach(pref => {
            const keywords = preferenceMap[pref] || [];
            const matches = keywords.some(keyword => 
                attraction.category.includes(keyword) ||
                attraction.tags.includes(keyword)
            );
            if (matches) score += 2.5;
        });
        
        return Math.min(10, score);
    }

    // 计算到酒店的平均距离
    calculateAverageDistanceToHotels(attraction, hotels) {
        if (!hotels || hotels.length === 0) return 3;
        
        const distances = hotels.map(hotel => 
            this.calculateDistance(attraction.coordinates, hotel.coordinates)
        );
        
        return distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
    }

    // 计算两点间距离（简化版）
    calculateDistance(coord1, coord2) {
        const R = 6371; // 地球半径（公里）
        const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
        const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // 计算住宿天数
    calculateNights(startDate, endDate) {
        if (!startDate || !endDate) return 2;
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    }

    // 计算节省金额
    calculateSavings(hotel) {
        const avgPrice = hotel.priceHistory.reduce((sum, price) => sum + price, 0) / hotel.priceHistory.length;
        return Math.round(avgPrice - hotel.price);
    }

    // 生成酒店推荐理由
    generateHotelRecommendationReason(hotel, userData) {
        const reasons = [];
        
        if (hotel.rating >= 4.5) {
            reasons.push('评分极高的优质酒店');
        }
        
        if (hotel.distanceToCenter <= 1) {
            reasons.push('地理位置优越，交通便利');
        }
        
        if (hotel.savings > 0) {
            reasons.push(`比平均价格便宜¥${hotel.savings}`);
        }
        
        const matchedPreferences = userData.preferences.filter(pref => 
            hotel.suitableFor.includes(pref)
        );
        if (matchedPreferences.length > 0) {
            reasons.push(`非常适合${matchedPreferences.join('、')}旅行`);
        }
        
        return reasons.slice(0, 2);
    }

    // 生成景点推荐理由
    generateAttractionRecommendationReason(attraction, userData) {
        const reasons = [];
        
        if (attraction.rating >= 4.5) {
            reasons.push('评分极高的必游景点');
        }
        
        if (attraction.price === 0) {
            reasons.push('免费景点，性价比极高');
        } else if (attraction.price < 20) {
            reasons.push('价格实惠，物超所值');
        }
        
        if (attraction.popularity > 90) {
            reasons.push('当地最受欢迎的景点之一');
        }
        
        return reasons.slice(0, 2);
    }

    // 默认酒店推荐
    getDefaultHotelRecommendations() {
        return this.hotels.slice(0, 3);
    }

    // 默认景点推荐
    getDefaultAttractionRecommendations() {
        return this.attractions.slice(0, 4);
    }

    // 获取价格趋势数据
    async getPriceTrendData(destination, checkIn, checkOut) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 模拟价格趋势数据
            const dates = [];
            const prices = [];
            const currentDate = new Date();
            
            for (let i = 0; i < 30; i++) {
                const date = new Date(currentDate);
                date.setDate(date.getDate() + i);
                dates.push(date.toISOString().split('T')[0]);
                
                // 模拟价格波动 (周末价格更高)
                const basePrice = 200;
                const dayOfWeek = date.getDay();
                const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1;
                const randomVariation = 0.9 + Math.random() * 0.2;
                prices.push(Math.round(basePrice * weekendMultiplier * randomVariation));
            }
            
            return { dates, prices };
        } catch (error) {
            console.error('获取价格趋势失败:', error);
            return null;
        }
    }

    // 获取实时人流量数据
    async getCrowdData(attractionId) {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // 模拟人流量数据
            const hours = [];
            const crowdLevels = [];
            
            for (let i = 8; i <= 20; i++) {
                hours.push(`${i}:00`);
                
                // 模拟人流量变化 (中午和傍晚高峰)
                let crowdLevel;
                if (i >= 10 && i <= 12) {
                    crowdLevel = 60 + Math.random() * 30; // 上午高峰
                } else if (i >= 14 && i <= 17) {
                    crowdLevel = 70 + Math.random() * 25; // 下午高峰
                } else if (i >= 18 && i <= 20) {
                    crowdLevel = 50 + Math.random() * 40; // 傍晚高峰
                } else {
                    crowdLevel = 20 + Math.random() * 30; // 其他时间
                }
                
                crowdLevels.push(Math.round(crowdLevel));
            }
            
            return { hours, crowdLevels };
        } catch (error) {
            console.error('获取人流量数据失败:', error);
            return null;
        }
    }
}

// 创建全局API服务实例
window.travelAPI = new TravelAPIService();