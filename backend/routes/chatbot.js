const express = require('express');
const touristPlaces = require('../data/touristPlaces');

const router = express.Router();

const knowledgeBase = {
  greetings: ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good evening'],
  stateQueries: {
    'rajasthan': { places: ['Amber Fort', 'Hawa Mahal', 'Mehrangarh Fort', 'Lake Pichola', 'Ranthambore', 'Jaisalmer Fort'], tip: 'Best time: October to March. Famous for forts, palaces, and desert safaris.' },
    'kerala': { places: ['Alleppey Backwaters', 'Munnar', 'Kovalam Beach', 'Periyar Wildlife Sanctuary', 'Varkala'], tip: "God's Own Country. Best time: September to March for backwaters and beaches." },
    'goa': { places: ['Calangute Beach', 'Dudhsagar Falls', 'Fort Aguada', 'Basilica of Bom Jesus', 'Anjuna Beach'], tip: 'Best time: November to February. Known for beaches, Portuguese heritage, and nightlife.' },
    'himachal pradesh': { places: ['Shimla', 'Manali', 'Spiti Valley', 'Kasol', 'Dharamsala'], tip: 'Best time: March to June for summers, December to February for snow sports.' },
    'uttar pradesh': { places: ['Taj Mahal', 'Varanasi Ghats', 'Fatehpur Sikri', 'Agra Fort', 'Sarnath'], tip: 'Home to 4 UNESCO World Heritage Sites. Best time: October to March.' },
    'karnataka': { places: ['Hampi', 'Mysore Palace', 'Coorg', 'Jog Falls', 'Bandipur National Park'], tip: 'Rich in Dravidian heritage. Best time: October to February.' },
    'tamil nadu': { places: ['Meenakshi Temple', 'Ooty', 'Mahabalipuram', 'Brihadeeswarar Temple', 'Kodaikanal'], tip: 'Temple land of India. Best time: October to March.' },
    'maharashtra': { places: ['Ajanta Caves', 'Ellora Caves', 'Gateway of India', 'Lonavala', 'Marine Drive'], tip: 'Financial capital with ancient caves. Best time: October to March.' },
    'gujarat': { places: ['Rann of Kutch', 'Somnath Temple', 'Gir National Park', 'Statue of Unity', 'Dwarka'], tip: 'Land of Gandhi. Best time: November to February.' },
    'west bengal': { places: ['Darjeeling', 'Sundarbans', 'Victoria Memorial', 'Kolkata'], tip: 'Culture and nature combined. Best time: October to March.' },
    'ladakh': { places: ['Pangong Lake', 'Leh Palace', 'Nubra Valley', 'Magnetic Hill'], tip: 'Land of High Passes. Best time: June to September.' },
    'jammu and kashmir': { places: ['Dal Lake', 'Gulmarg', 'Sonamarg', 'Pahalgam'], tip: 'Paradise on Earth. Best time: April to October.' },
    'sikkim': { places: ['Gangtok', 'Tsomgo Lake', 'Rumtek Monastery', 'Nathula Pass'], tip: 'Himalayan gem. Best time: March to May, October to December.' },
    'andaman': { places: ['Radhanagar Beach', 'Cellular Jail', 'Neil Island', 'Havelock Island'], tip: 'Island paradise. Best time: November to April.' },
  },
  categoryQueries: {
    'beach': ['Calangute Beach (Goa)', 'Kovalam Beach (Kerala)', 'Radhanagar Beach (Andaman)', 'Puri Beach (Odisha)', 'Varkala (Kerala)', 'Gokarna (Karnataka)'],
    'hill station': ['Shimla (HP)', 'Manali (HP)', 'Ooty (TN)', 'Munnar (Kerala)', 'Darjeeling (WB)', 'Gangtok (Sikkim)', 'Coorg (Karnataka)'],
    'temple': ['Golden Temple (Punjab)', 'Tirupati (AP)', 'Meenakshi Temple (TN)', 'Kedarnath (UK)', 'Somnath (Gujarat)', 'Bodh Gaya (Bihar)'],
    'fort': ['Red Fort (Delhi)', 'Amber Fort (Rajasthan)', 'Mehrangarh Fort (Rajasthan)', 'Chittorgarh (Rajasthan)', 'Golconda Fort (Telangana)', 'Jaisalmer Fort (Rajasthan)'],
    'wildlife': ['Jim Corbett (UK)', 'Kaziranga (Assam)', 'Ranthambore (Rajasthan)', 'Sundarbans (WB)', 'Bandipur (Karnataka)', 'Gir (Gujarat)'],
    'waterfall': ['Dudhsagar (Goa)', 'Jog Falls (Karnataka)', 'Chitrakote (Chhattisgarh)', 'Athirapally (Kerala)', 'Hundru (Jharkhand)'],
    'lake': ['Dal Lake (J&K)', 'Pangong Lake (Ladakh)', 'Alleppey (Kerala)', 'Pichola (Rajasthan)', 'Nainital (UK)', 'Tsomgo (Sikkim)'],
    'historical monument': ['Taj Mahal (UP)', 'Red Fort (Delhi)', 'Qutub Minar (Delhi)', 'Ajanta Caves (MH)', 'Hampi (Karnataka)', 'Konark Sun Temple (Odisha)'],
  },
  festivalQueries: {
    'january': 'Makar Sankranti (Pan India), Lohri (Punjab), Pongal (Tamil Nadu), Kite Festival (Gujarat)',
    'february': 'Surajkund Fair (Haryana), Vasant Panchami, Desert Festival (Rajasthan)',
    'march': 'Holi (Pan India), Shigmo (Goa), Gangaur (Rajasthan)',
    'april': 'Baisakhi (Punjab), Vishu (Kerala), Ram Navami, Ugadi (Karnataka/AP)',
    'may': 'Buddha Purnima (Pan India), Thrissur Pooram (Kerala)',
    'june': 'Rath Yatra (Odisha), Hemis Festival (Ladakh)',
    'july': 'Guru Purnima, Teej (Rajasthan)',
    'august': 'Independence Day, Raksha Bandhan, Onam (Kerala), Janmashtami',
    'september': 'Ganesh Chaturthi (Maharashtra), Navratri begins',
    'october': 'Navratri, Dussehra, Durga Puja (West Bengal), Kullu Dussehra',
    'november': 'Diwali (Pan India), Pushkar Fair (Rajasthan), Guru Nanak Jayanti',
    'december': 'Christmas (Goa), Hornbill Festival (Nagaland), Rann Utsav (Gujarat)',
  },
  itineraries: {
    'jaipur': `🗺️ 3-Day Jaipur Itinerary:\n\n📅 Day 1: Pink City Highlights\n• Morning: Amber Fort & Jaigarh Fort\n• Afternoon: City Palace & Jantar Mantar\n• Evening: Hawa Mahal & Johari Bazaar\n\n📅 Day 2: Forts & Culture\n• Morning: Nahargarh Fort (sunrise view)\n• Afternoon: Albert Hall Museum\n• Evening: Chokhi Dhani folk experience\n\n📅 Day 3: Outskirts & Shopping\n• Morning: Jal Mahal & Sisodia Rani Garden\n• Afternoon: Craft shopping at Bapu Bazaar\n• Evening: Departure`,
    'delhi': `🗺️ 3-Day Delhi Itinerary:\n\n📅 Day 1: Old Delhi\n• Red Fort, Chandni Chowk, Jama Masjid\n• Spice Market & street food\n\n📅 Day 2: New Delhi\n• India Gate, Qutub Minar, Humayun's Tomb\n• Lodi Garden evening walk\n\n📅 Day 3: Culture & Museums\n• National Museum, ISKCON Temple\n• Dilli Haat & Connaught Place`,
    'mumbai': `🗺️ 3-Day Mumbai Itinerary:\n\n📅 Day 1: South Mumbai\n• Gateway of India, Colaba Causeway\n• Elephanta Caves boat trip\n\n📅 Day 2: Culture\n• Dharavi, Dadar flower market\n• Marine Drive sunset, Siddhivinayak Temple\n\n📅 Day 3: Suburbs\n• Juhu Beach, Film City tour\n• Bandra-Worli Sea Link, street food`,
    'varanasi': `🗺️ 3-Day Varanasi Itinerary:\n\n📅 Day 1: Ghats & Spirituality\n• Sunrise boat ride on the Ganges\n• Dashashwamedh Ghat Aarti\n• Kashi Vishwanath Temple\n\n📅 Day 2: Historical Sites\n• Sarnath (Buddha's first sermon)\n• Ramnagar Fort, Tulsi Manas Temple\n\n📅 Day 3: Culture & Cuisine\n• Local markets, silk weaving demo\n• Evening Ganga Aarti ceremony`,
  }
};

function processQuery(query) {
  const q = query.toLowerCase().trim();

  // Greetings
  if (knowledgeBase.greetings.some(g => q.includes(g))) {
    return `🙏 Namaste! Welcome to Bharat Explorer! I'm your AI travel guide for Incredible India.\n\nI can help you with:\n• Best places to visit in any Indian state\n• Festival information month-wise\n• Travel itineraries for popular cities\n• Tips on beaches, temples, hill stations, and more\n\nWhat would you like to explore today?`;
  }

  // State queries
  for (const [state, info] of Object.entries(knowledgeBase.stateQueries)) {
    if (q.includes(state)) {
      return `🗺️ **${state.charAt(0).toUpperCase() + state.slice(1)}** Travel Guide:\n\n✨ Top Places:\n${info.places.map(p => `• ${p}`).join('\n')}\n\n📌 Travel Tip: ${info.tip}\n\nWould you like a detailed itinerary for any of these places?`;
    }
  }

  // Itinerary queries
  for (const [city, itinerary] of Object.entries(knowledgeBase.itineraries)) {
    if (q.includes(city) && (q.includes('itinerary') || q.includes('plan') || q.includes('days') || q.includes('trip'))) {
      return itinerary;
    }
  }

  // Category queries
  for (const [cat, places] of Object.entries(knowledgeBase.categoryQueries)) {
    if (q.includes(cat)) {
      return `🏆 Best ${cat.charAt(0).toUpperCase() + cat.slice(1)}s in India:\n\n${places.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n💡 Use the Destinations page to explore all places by category!`;
    }
  }

  // Festival queries
  const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  for (const month of months) {
    if (q.includes(month) || q.includes('festival')) {
      if (q.includes(month)) {
        return `🎊 **Festivals in ${month.charAt(0).toUpperCase() + month.slice(1)}**:\n\n${knowledgeBase.festivalQueries[month]}\n\n🗓️ Plan your trip around these festivals for an unforgettable experience!`;
      }
    }
  }

  // Budget queries
  if (q.includes('budget') || q.includes('cheap') || q.includes('cost')) {
    return `💰 Budget Travel Tips for India:\n\n• **Low Budget (₹1000-1500/day):** Hostels, local transport, dhabas\n• **Mid Range (₹2000-4000/day):** Hotels, AC trains, restaurants\n• **Luxury (₹8000+/day):** Heritage hotels, flights, fine dining\n\n🏨 Best value destinations: Varanasi, Hampi, McLeod Ganj, Rishikesh\n✈️ Use IRCTC for affordable train bookings across India!`;
  }

  // Weather/best time queries
  if (q.includes('best time') || q.includes('weather') || q.includes('season') || q.includes('when to visit')) {
    return `🌤️ Best Time to Visit India:\n\n❄️ **Oct–Mar (Peak Season):** North India - Golden Triangle, Rajasthan, UP\n☀️ **Apr–Jun (Summer):** Hill stations - Shimla, Manali, Ooty, Darjeeling\n🌧️ **Jul–Sep (Monsoon):** Goa, Kerala backwaters, Northeast India (lush greenery)\n🏝️ **Nov–Apr (Islands):** Andaman, Lakshadweep\n⛷️ **Dec–Feb (Winter Sports):** Gulmarg (skiing), Auli, Rohtang\n\nAvoid extreme heat in North India (April-June) and heavy monsoon (July-Aug).`;
  }

  // Use dataset for general queries
  const keywords = q.split(' ').filter(w => w.length > 3);
  const matchedPlaces = touristPlaces.filter(p =>
    keywords.some(k =>
      p.name.toLowerCase().includes(k) ||
      p.state.toLowerCase().includes(k) ||
      p.city.toLowerCase().includes(k) ||
      p.category.toLowerCase().includes(k)
    )
  ).slice(0, 5);

  if (matchedPlaces.length > 0) {
    return `🔍 Found these relevant places for your query:\n\n${matchedPlaces.map(p =>
      `📍 **${p.name}** (${p.state})\nCategory: ${p.category} | Best Time: ${p.best_time}\n${p.description.slice(0, 80)}...`
    ).join('\n\n')}\n\n💡 Use the Destinations Explorer for more details!`;
  }

  return `🤔 I'm not sure about that specific query, but I can help you with:\n\n• "Best places in [state name]"\n• "Festivals in [month]"\n• "[City name] 3-day itinerary"\n• "Best beaches/temples/hill stations in India"\n• "Best time to visit India"\n• "Budget travel tips"\n\nTry one of these or explore using our interactive India Map!`;
}

// POST /api/chatbot
router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message is required' });
  const response = processQuery(message);
  res.json({ success: true, response, timestamp: new Date().toISOString() });
});

module.exports = router;
