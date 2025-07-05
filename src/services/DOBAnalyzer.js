class DOBAnalyzer {
  constructor({ dob }) {
    this.dob = dob
    this.birthDate = new Date(dob)
    this.today = new Date()
    
    if (!this.isValidDate()) {
      throw new Error('Invalid date format')
    }
  }

  isValidDate() {
    return this.birthDate instanceof Date && !isNaN(this.birthDate.getTime())
  }

  getAge() {
    const years = this.today.getFullYear() - this.birthDate.getFullYear()
    let months = this.today.getMonth() - this.birthDate.getMonth()
    let days = this.today.getDate() - this.birthDate.getDate()

    if (days < 0) {
      months--
      days += new Date(this.today.getFullYear(), this.today.getMonth(), 0).getDate()
    }

    if (months < 0) {
      months += 12
    }

    return { years, months, days }
  }

  getZodiacSign() {
    const date = this.birthDate.getDate()
    const month = this.birthDate.getMonth() + 1

    const zodiacSigns = [
      { name: 'Capricorn', dates: [22, 19] },
      { name: 'Aquarius', dates: [20, 18] },
      { name: 'Pisces', dates: [19, 20] },
      { name: 'Aries', dates: [21, 19] },
      { name: 'Taurus', dates: [20, 20] },
      { name: 'Gemini', dates: [21, 20] },
      { name: 'Cancer', dates: [21, 22] },
      { name: 'Leo', dates: [23, 22] },
      { name: 'Virgo', dates: [23, 22] },
      { name: 'Libra', dates: [23, 22] },
      { name: 'Scorpio', dates: [23, 21] },
      { name: 'Sagittarius', dates: [22, 21] }
    ]

    const currentSign = zodiacSigns[month - 1]
    const isCurrentSign = date >= currentSign.dates[0] || date <= currentSign.dates[1]
    
    return isCurrentSign ? currentSign.name : zodiacSigns[month % 12].name
  }

  getLifeStage() {
    const age = this.getAge().years

    if (age < 13) return 'Childhood'
    if (age < 20) return 'Adolescence'
    if (age < 40) return 'Young Adult'
    if (age < 60) return 'Middle Age'
    
    return 'Senior'
  }

  getNumerology() {
    const digits = this.dob.replace(/-/g, '').split('').map(Number)
    let sum = digits.reduce((acc, digit) => acc + digit, 0)
    
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0)
    }
    
    return sum
  }

  getNumerologyFact({ number }) {
    const facts = {
      1: 'Leadership and independence.',
      2: 'Harmony and partnership.',
      3: 'Creativity and joy.',
      4: 'Stability and discipline.',
      5: 'Adventure and freedom.',
      6: 'Care and responsibility.',
      7: 'Intellect and introspection.',
      8: 'Power and ambition.',
      9: 'Compassion and idealism.'
    }

    return facts[number] || 'A unique number!'
  }

  getFamousBirthdays() {
    const monthDay = this.dob.slice(5)
    
    const famousBirthdays = {
      '01-01': 'Paul Revere, Verne Troyer',
      '07-20': 'Alexander the Great, Gisele Bündchen',
      '12-25': 'Isaac Newton, Justin Trudeau'
    }

    return famousBirthdays[monthDay] || 'No major celebrities found'
  }

  getHistoricalEvent({ yearsAfter }) {
    const year = this.birthDate.getFullYear() + yearsAfter
    
    const events = {
      2000: 'Y2K bug was a big topic!',
      2010: 'Instagram was launched.',
      2020: 'Global COVID-19 pandemic.'
    }

    return events[year] || 'No major event found for that year.'
  }

  getDaysOld() {
    return Math.floor((this.today.getTime() - this.birthDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  getLifeMilestones() {
    const age = this.getAge().years

    if (age < 13) {
      return ['Khám phá bản thân', 'Học hỏi kỹ năng cơ bản', 'Tạo dựng nền tảng gia đình']
    }
    
    if (age < 20) {
      return ['Phát triển cá tính', 'Tìm kiếm đam mê', 'Kết bạn và xây dựng các mối quan hệ']
    }
    
    if (age < 40) {
      return ['Xây dựng sự nghiệp', 'Tìm kiếm sự ổn định', 'Phát triển bản thân']
    }
    
    if (age < 60) {
      return ['Ổn định tài chính', 'Chia sẻ kinh nghiệm', 'Chăm sóc sức khỏe']
    }
    
    return ['Tận hưởng cuộc sống', 'Gắn kết gia đình', 'Truyền cảm hứng cho thế hệ sau']
  }

  getShoppingSuggestions({ zodiac, age }) {
    const zodiacSuggestions = {
      'Aries': ['Đá ruby', 'Vật phẩm màu đỏ', 'Đồng hồ thể thao'],
      'Taurus': ['Đá thạch anh hồng', 'Cây xanh nhỏ', 'Đồ trang trí gốm'],
      'Gemini': ['Sách', 'Bút ký', 'Phụ kiện đa năng'],
      'Cancer': ['Đá mặt trăng', 'Khung ảnh gia đình', 'Nến thơm'],
      'Leo': ['Đá mắt hổ', 'Trang sức vàng', 'Đồ decor sang trọng'],
      'Virgo': ['Đá ngọc lục bảo', 'Sổ tay', 'Cây để bàn'],
      'Libra': ['Đá thạch anh tím', 'Nước hoa', 'Tranh nghệ thuật'],
      'Scorpio': ['Đá obsidian', 'Vòng tay phong thuỷ', 'Nước hoa bí ẩn'],
      'Sagittarius': ['Đá ngọc lam', 'Balo du lịch', 'Sách khám phá'],
      'Capricorn': ['Đá mã não', 'Đồng hồ', 'Vật phẩm màu nâu/xám'],
      'Aquarius': ['Đá sapphire', 'Đồ công nghệ', 'Phụ kiện độc lạ'],
      'Pisces': ['Đá aquamarine', 'Đèn ngủ', 'Đồ decor biển']
    }

    let suggestions = zodiacSuggestions[zodiac] || ['Vật phẩm phong thuỷ hợp mệnh', 'Đồ trang trí mang lại may mắn']

    if (age < 13) {
      suggestions.push('Đồ chơi giáo dục, sách tranh, vật phẩm an toàn cho trẻ nhỏ')
    } else if (age < 20) {
      suggestions.push('Sách phát triển bản thân, phụ kiện cá tính, đồ thể thao')
    } else if (age < 40) {
      suggestions.push('Đồ decor văn phòng, đồng hồ, vật phẩm phong thuỷ cho sự nghiệp')
    } else if (age < 60) {
      suggestions.push('Đồ chăm sóc sức khoẻ, cây cảnh, vật phẩm thư giãn')
    } else {
      suggestions.push('Đồ dưỡng sinh, vật phẩm an lạc, sách truyền cảm hứng')
    }

    return suggestions
  }

  getAllData() {
    const age = this.getAge()
    const zodiac = this.getZodiacSign()
    const numerology = this.getNumerology()
    const lifeStage = this.getLifeStage()
    const daysOld = this.getDaysOld()
    const famousBirthdays = this.getFamousBirthdays()
    const historicalEvent = this.getHistoricalEvent({ yearsAfter: 10 })
    const milestones = this.getLifeMilestones()
    const shoppingSuggestions = this.getShoppingSuggestions({ zodiac, age: age.years })

    return {
      dob: this.dob,
      age,
      zodiac,
      numerology,
      lifeStage,
      daysOld,
      famousBirthdays,
      historicalEvent,
      milestones,
      shoppingSuggestions
    }
  }
}

module.exports = { DOBAnalyzer } 