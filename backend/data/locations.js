// Sample data for seeding the VietnamLocation collection

const locations = [
    {
      name: 'Hue Imperial City',
      description: 'The Imperial City of Hue was the capital of Vietnam during the Nguyen Dynasty (1802-1945). The complex features hundreds of monuments and ruins, including the Forbidden Purple City, royal residences, and various temples.',
      shortDescription: 'The historic imperial city of Vietnam\'s Nguyen Dynasty.',
      region: 'Central',
      province: 'Thua Thien Hue',
      category: 'historical',
      coordinates: {
        x: 107.577,
        y: 16.467
      },
      vrContent: {
        type: 'matterport',
        matterportId: 'SxQL3iGyoDo' // Replace with actual Matterport ID
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
      name: 'Hoi An Ancient Town',
      description: 'Hoi An Ancient Town is an exceptionally well-preserved example of a traditional Asian trading port. Its buildings and street plan reflect both indigenous and foreign influences, creating a unique cultural heritage site.',
      shortDescription: 'A well-preserved Southeast Asian trading port from the 15th-19th centuries.',
      region: 'Central',
      province: 'Quang Nam',
      category: 'historical',
      coordinates: {
        x: 108.328,
        y: 15.878
      },
      vrContent: {
        type: 'matterport',
        matterportId: 'vLn3Si7nChi' // Replace with actual Matterport ID
      },
      thumbnailImage: '/images/locations/hoi-an.jpg',
      mapMarkerImage: '/images/markers/historical-marker.png',
      historicalContext: 'Hoi An was a major international port from the 15th to 19th centuries, attracting merchants from China, Japan, and later Europe.',
      culturalSignificance: 'The town represents a fusion of cultural elements from various countries with which Vietnam had commercial connections.',
      isPopular: true,
      tags: ['unesco', 'trading port', 'ancient town'],
      viewCount: 1800
    },
    {
      name: 'Bat Trang Pottery Village',
      description: 'Bat Trang is a traditional pottery village with a history spanning 700 years. The village is famous for its high-quality ceramic products that blend traditional techniques with modern designs.',
      shortDescription: 'A traditional village specializing in ceramic production since the 14th century.',
      region: 'North',
      province: 'Hanoi',
      category: 'village',
      coordinates: {
        x: 105.913,
        y: 21.022
      },
      vrContent: {
        type: 'matterport',
        matterportId: '4JdtxrZ8prU' // Replace with actual Matterport ID
      },
      thumbnailImage: '/images/locations/bat-trang.jpg',
      mapMarkerImage: '/images/markers/village-marker.png',
      historicalContext: 'Bat Trang has been producing ceramics since the 14th century and was a major supplier to the royal court.',
      culturalSignificance: 'The village maintains traditional craftsmanship while adapting to contemporary market demands.',
      isPopular: false,
      tags: ['pottery', 'crafts', 'traditional village', 'ceramics'],
      viewCount: 950
    },
    {
      name: 'Phong Nha Cave',
      description: 'Phong Nha Cave is part of the Phong Nha-Ke Bang National Park, a UNESCO World Heritage site. The cave features spectacular stalactites, stalagmites, and an underground river.',
      shortDescription: 'A magnificent cave system in central Vietnam with underground rivers.',
      region: 'Central',
      province: 'Quang Binh',
      category: 'natural',
      coordinates: {
        x: 106.283,
        y: 17.583
      },
      vrContent: {
        type: '360-photo',
        mainUrl: '/vr/phong-nha/main.jpg',
        fallbackUrl: '/vr/phong-nha/fallback.jpg',
        format: 'equirectangular'
      },
      thumbnailImage: '/images/locations/phong-nha.jpg',
      mapMarkerImage: '/images/markers/natural-marker.png',
      historicalContext: 'The cave has been known to locals for centuries but was only explored thoroughly in recent decades.',
      culturalSignificance: 'Local legends associate the cave with supernatural beings and historical events.',
      isPopular: true,
      tags: ['cave', 'unesco', 'natural wonder'],
      viewCount: 1450
    },
    {
      name: 'One Pillar Pagoda',
      description: 'The One Pillar Pagoda is a historic Buddhist temple in Hanoi. Built in 1049, it is designed to resemble a lotus blossom, the symbol of purity, rising out of a square pond.',
      shortDescription: 'An iconic Buddhist temple designed to resemble a lotus flower.',
      region: 'North',
      province: 'Hanoi',
      category: 'temple',
      coordinates: {
        x: 105.834,
        y: 21.036
      },
      vrContent: {
        type: 'matterport',
        matterportId: 'vZvs6ZtZYrW' // Replace with actual Matterport ID
      },
      thumbnailImage: '/images/locations/one-pillar-pagoda.jpg',
      mapMarkerImage: '/images/markers/temple-marker.png',
      historicalContext: 'The pagoda was built by Emperor Ly Thai Tong who dreamed about meeting the bodhisattva Avalokiteshvara.',
      culturalSignificance: 'It represents the purity of Buddhism and is one of Vietnam\'s most iconic temples.',
      isPopular: true,
      tags: ['buddhism', 'pagoda', 'hanoi'],
      viewCount: 1650
    }
  ];
  
  module.exports = locations;