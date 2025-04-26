const locations = [
  {
    id: 1,
    name: 'Hue Imperial City',
    description: 'The Imperial City of Hue was the capital of Vietnam during the Nguyen Dynasty (1802-1945). The complex features hundreds of monuments and ruins, including the Forbidden Purple City, royal residences, and various temples.',
    shortDescription: 'The historic imperial city of Vietnam\'s Nguyen Dynasty.',
    region: 'Central',
    province: 'Thua Thien Hue',
    category: 'historical',
    coordinates: {
      x: 56, // Adjusted for your map image
      y: 47  // Adjusted for your map image
    },
    vrContent: {
      type: 'matterport',
      videoUrl: 'https://www.youtube.com/watch?v=CrU-QIvPn0E', // Replace with actual video URL
      matterportId: 'https://360view.vn/gallery/data/projects/vietnam/thuathien_hue/kinhthanh__092011/' // Replace with actual Matterport ID
    },
    thumbnailImage: '/images/locations/hue-imperial-city.jpg',
    mapMarkerImage: '/images/markers/historical-marker.png',
    historicalContext: 'Founded in 1802 by Emperor Gia Long, the Imperial City served as Vietnam\'s political and cultural center for over a century.',
    culturalSignificance: 'The Imperial City represents a unique blend of Vietnamese, Chinese, and French architectural influences.',
    isPopular: true,
    tags: ['imperial', 'nguyen dynasty', 'unesco', 'citadel'],
    viewCount: 1250
  },
  {
    id: 2,
    name: 'Hoi An Ancient Town',
    description: 'Hoi An Ancient Town is an exceptionally well-preserved example of a traditional Asian trading port. Its buildings and street plan reflect both indigenous and foreign influences, creating a unique cultural heritage site.',
    shortDescription: 'A well-preserved Southeast Asian trading port from the 15th-19th centuries.',
    region: 'Central',
    province: 'Quang Nam',
    category: 'historical',
    coordinates: {
      x: 58, // Adjusted for your map image
      y: 55  // Adjusted for your map image
    },
    vrContent: {
      type: 'matterport',
      videoUrl: 'https://www.youtube.com/watch?v=Bfy84a58vek', // Replace with actual video URL
      matterportId: 'https://vr360.com.vn/projects/hoian-metaverse/' // Replace with actual Matterport ID
    },
    thumbnailImage: '/images/locations/hoi-an.jpg',
    mapMarkerImage: '/images/markers/historical-marker.png',
    historicalContext: 'Hoi An was a major international port from the 15th to 19th centuries, attracting merchants from China, Japan, and later Europe.',
    culturalSignificance: 'The town represents a fusion of cultural elements from various countries with which Vietnam had commercial connections.',
    isPopular: true,
    tags: ['unesco', 'trading port', 'ancient town'],
    viewCount: 1800
  },
  // Added new locations
  {
    id: 3,
    name: 'Pác Bó Cave',
    description: 'Pác Bó Cave is a historically significant site where Ho Chi Minh lived and worked after returning to Vietnam in 1941 to lead the Vietnamese independence movement. The cave and surrounding area became the headquarters of the Viet Minh.',
    shortDescription: 'Revolutionary base where Ho Chi Minh returned to Vietnam in 1941 to lead the independence movement.',
    region: 'North',
    province: 'Cao Bang',
    category: 'historical',
    coordinates: {
      x: 51, // Adjusted for your map image
      y: 10  // Adjusted for your map image
    },
    vrContent: {
      type: 'matterport',
      videoUrl: 'https://www.youtube.com/watch?v=ZvW0QbxvVfc', // Replace with actual video URL
      matterportId: 'https://store360.vingg.vn/cao-bang/pac-bo/' // Replace with actual Matterport ID
    },
    thumbnailImage: '/images/locations/pac-bo-cave.jpg',
    mapMarkerImage: '/images/markers/historical-marker.png',
    historicalContext: 'In February 1941, Ho Chi Minh crossed the border from China into Vietnam and established his base in Pac Bo. Here, he wrote revolutionary documents and held meetings that would shape Vietnam\'s struggle for independence.',
    culturalSignificance: 'Pác Bó is considered the cradle of Vietnam\'s revolution, symbolizing the beginning of the modern independence movement that would eventually lead to the formation of the Democratic Republic of Vietnam.',
    isPopular: true,
    tags: ['revolution', 'ho chi minh', 'history', 'independence'],
    viewCount: 1050
  },
  {
    id: 4,
    name: 'Independence Palace',
    description: 'Also known as Reunification Palace, this historic landmark was the home and workplace of the President of South Vietnam during the Vietnam War. The building witnessed the end of the war when North Vietnamese tanks crashed through its gates on April 30, 1975.',
    shortDescription: 'Former presidential palace of South Vietnam and site of the fall of Saigon in 1975.',
    region: 'South',
    province: 'Ho Chi Minh City',
    category: 'historical',
    coordinates: {
      x: 55, // Adjusted for your map image
      y: 75  // Adjusted for your map image
    },
    vrContent: {
      type: 'matterport',
      videoUrl: 'https://www.youtube.com/watch?v=yHrUpdWxXCI', // Replace with actual video URL
      matterportId: 'https://vr360.com.vn/projects/dinhdoclap/' // Replace with actual Matterport ID
    },
    thumbnailImage: '/images/locations/independence-palace.jpg',
    mapMarkerImage: '/images/markers/historical-marker.png',
    historicalContext: 'The original palace was built in 1873 as the residence for the French Governor-General. After being damaged in 1962, it was redesigned by architect Ngô Viết Thụ and completed in 1966. It became an iconic symbol of the South Vietnamese government until its fall in 1975.',
    culturalSignificance: 'The Independence Palace represents a pivotal moment in Vietnamese history, marking the end of the Vietnam War and the reunification of North and South Vietnam. It stands as a symbol of Vietnam\'s complex political history and eventual unification.',
    isPopular: true,
    tags: ['vietnam war', 'saigon', 'architecture', 'cold war'],
    viewCount: 2100
  },
  {
    id: 5,
    name: 'Cu Chi Tunnels',
    description: 'The Cu Chi Tunnels are an immense network of underground tunnels that served as the operational headquarters for Viet Cong soldiers during the Vietnam War. Stretching over 250 kilometers, this remarkable complex included living quarters, hospitals, factories, and storage facilities.',
    shortDescription: 'Vast underground tunnel network used by guerrilla fighters during the Vietnam War.',
    region: 'South',
    province: 'Ho Chi Minh City',
    category: 'historical',
    coordinates: {
      x: 53, // Adjusted for your map image
      y: 73  // Adjusted for your map image
    },
    vrContent: {
      type: 'matterport',
      videoUrl: 'https://www.youtube.com/watch?v=UnOfVIhzzIs', // Replace with actual video URL
    },
    thumbnailImage: '/images/locations/cu-chi-tunnels.jpg',
    mapMarkerImage: '/images/markers/historical-marker.png',
    historicalContext: `The tunnels were built starting in the late 1940s during the First Indochina War against the French and were greatly expanded during the Vietnam War. They played a crucial role in the Viet Cong's military strategy, enabling fighters to control a large rural area near Saigon.`,
    culturalSignificance: 'The Cu Chi Tunnels represent Vietnamese ingenuity, resilience, and determination during wartime. They demonstrate how a militarily weaker force used innovative tactics to resist a technologically superior opponent.',
    isPopular: true,
    tags: ['vietnam war', 'military history', 'underground', 'guerrilla warfare'],
    viewCount: 2350
  },
  {
    id: 6,
    name: 'Dien Bien Phu Battlefield',
    description: 'The site of the decisive 1954 battle that ended French colonial rule in Vietnam. This remote valley in northwest Vietnam was where Vietnamese forces, under General Vo Nguyen Giap, achieved a historic victory against French troops, effectively ending the First Indochina War.',
    shortDescription: 'Historic battlefield where Vietnamese forces defeated the French in 1954, ending colonial rule.',
    region: 'North',
    province: 'Dien Bien',
    category: 'historical',
    coordinates: {
      x: 39, // Adjusted for your map image
      y: 18  // Adjusted for your map image
    },
    vrContent: {
      type: 'matterport',
      videoUrl: 'https://www.youtube.com/watch?v=jy7Z3oYOp7w', // Replace with actual video URL
    },
    thumbnailImage: '/images/locations/dien-bien-phu.jpg',
    mapMarkerImage: '/images/markers/historical-marker.png',
    historicalContext: 'From March to May 1954, Vietnamese forces besieged and ultimately defeated the French garrison at Dien Bien Phu. This decisive victory led directly to the Geneva Accords and the partition of Vietnam at the 17th parallel, setting the stage for later conflicts.',
    culturalSignificance: 'Dien Bien Phu is considered one of the most significant battles of the 20th century, marking the first time an Asian colonial force defeated a European power. It remains a powerful symbol of Vietnamese military prowess and determination to achieve independence.',
    isPopular: true,
    tags: ['battlefield', 'french colonialism', 'military history', 'independence'],
    viewCount: 980
  }
];

module.exports = locations;