// Mock data for MVP demonstration

export const users = [
  { id: 'leader1', name: 'Kyle Haines', role: 'adult', unit: 'Crew 22' },
  { id: 'leader2', name: 'Sarah Thompson', role: 'adult', unit: 'Troop 3125' },
  { id: 'leader3', name: 'Mike Chen', role: 'adult', unit: 'Troop 114' },
  { id: 'scout1', name: 'Liam H.', role: 'youth', unit: 'Crew 22' },
  { id: 'scout2', name: 'Alex M.', role: 'youth', unit: 'Troop 3125' },
  { id: 'parent1', name: 'Parent of Liam', role: 'parent', unit: 'Crew 22' },
];

export const channels = [
  {
    id: 'announcements',
    name: 'Contingent Announcements',
    description: 'Official updates from contingent leadership',
    type: 'public',
    allowedRoles: ['adult', 'youth', 'parent'],
    canPost: ['adult'],
    icon: '📢'
  },
  {
    id: 'crew22',
    name: 'Crew 22',
    description: 'Crew 22 unit communication',
    type: 'unit',
    allowedRoles: ['adult', 'youth', 'parent'],
    canPost: ['adult', 'youth'],
    unit: 'Crew 22',
    moderators: ['leader1'],
    icon: '🏕️'
  },
  {
    id: 'troop3125',
    name: 'Troop 3125',
    description: 'Troop 3125 unit communication',
    type: 'unit',
    allowedRoles: ['adult', 'youth', 'parent'],
    canPost: ['adult', 'youth'],
    unit: 'Troop 3125',
    moderators: ['leader2'],
    icon: '🏕️'
  },
  {
    id: 'troop114',
    name: 'Troop 114',
    description: 'Troop 114 unit communication',
    type: 'unit',
    allowedRoles: ['adult', 'youth', 'parent'],
    canPost: ['adult', 'youth'],
    unit: 'Troop 114',
    moderators: ['leader3'],
    icon: '🏕️'
  },
  {
    id: 'leadership',
    name: 'Adult Leadership',
    description: 'Leadership coordination - adults only',
    type: 'leadership',
    allowedRoles: ['adult'],
    canPost: ['adult'],
    icon: '👥'
  },
  {
    id: 'activities',
    name: 'Activities & Schedule',
    description: 'Daily schedules, merit badges, events',
    type: 'public',
    allowedRoles: ['adult', 'youth', 'parent'],
    canPost: ['adult'],
    icon: '📅'
  },
  {
    id: 'parents',
    name: 'Family Updates',
    description: 'Updates for families back home',
    type: 'parent',
    allowedRoles: ['adult', 'parent'],
    canPost: ['adult'],
    icon: '👨‍👩‍👧‍👦'
  }
];

export const messages = [
  {
    id: 'm1',
    channelId: 'announcements',
    userId: 'leader1',
    content: 'Welcome to the VAHC Jamboree Hub! This is your central place for all contingent communication. Please explore the different channels.',
    timestamp: new Date('2025-07-20T08:00:00'),
    pinned: true
  },
  {
    id: 'm2',
    channelId: 'announcements',
    userId: 'leader2',
    content: 'Morning meeting at 7:30 AM daily at the flagpole. All unit leaders must attend.',
    timestamp: new Date('2025-07-20T08:15:00'),
    pinned: true
  },
  {
    id: 'm3',
    channelId: 'crew22',
    userId: 'leader1',
    content: 'Crew 22 - we\'re meeting at 9 AM for merit badge sign-ups. Don\'t forget your buddy!',
    timestamp: new Date('2025-07-20T08:30:00')
  },
  {
    id: 'm4',
    channelId: 'crew22',
    userId: 'scout1',
    content: 'I signed up for First Aid and Wilderness Survival!',
    timestamp: new Date('2025-07-20T09:05:00')
  },
  {
    id: 'm5',
    channelId: 'leadership',
    userId: 'leader1',
    content: 'Reminder: Two-deep leadership required for all activities. Please coordinate coverage for this afternoon\'s aquatics session.',
    timestamp: new Date('2025-07-20T10:00:00')
  },
  {
    id: 'm6',
    channelId: 'activities',
    userId: 'leader2',
    content: '📅 Today\'s Highlights:\n• 10 AM - Opening arena show\n• 2 PM - Mountain biking\n• 6 PM - Dinner\n• 8 PM - Evening program',
    timestamp: new Date('2025-07-20T07:00:00'),
    pinned: true
  },
  {
    id: 'm7',
    channelId: 'parents',
    userId: 'leader1',
    content: 'All Scouts arrived safely and are settling in well. Weather is beautiful - sunny and 75°F. First photos will be posted tomorrow!',
    timestamp: new Date('2025-07-20T19:00:00')
  },
  {
    id: 'm8',
    channelId: 'troop3125',
    userId: 'leader2',
    content: 'Troop 3125 patrol leaders - please confirm your patrol roster before lunch.',
    timestamp: new Date('2025-07-20T11:00:00')
  },
  {
    id: 'm9',
    channelId: 'troop3125',
    userId: 'scout2',
    content: 'Thunderbird patrol all accounted for! ⚡',
    timestamp: new Date('2025-07-20T11:15:00')
  }
];

export const schedule = [
  {
    id: 's1',
    time: '7:30 AM',
    title: 'Morning Meeting',
    location: 'Contingent Flagpole',
    type: 'leadership',
    description: 'Daily leadership meeting - all unit leaders'
  },
  {
    id: 's2',
    time: '8:00 AM',
    title: 'Breakfast',
    location: 'Dining Hall',
    type: 'meal'
  },
  {
    id: 's3',
    time: '9:00 AM',
    title: 'Merit Badge Sessions',
    location: 'Various',
    type: 'activity',
    description: 'Morning merit badge classes begin'
  },
  {
    id: 's4',
    time: '10:00 AM',
    title: 'Opening Show',
    location: 'Main Arena',
    type: 'event',
    description: 'Jamboree kickoff event - all contingents'
  },
  {
    id: 's5',
    time: '12:00 PM',
    title: 'Lunch',
    location: 'Dining Hall',
    type: 'meal'
  },
  {
    id: 's6',
    time: '2:00 PM',
    title: 'Afternoon Activities',
    location: 'Activity Areas',
    type: 'activity',
    description: 'Aquatics, climbing, biking, shooting sports'
  },
  {
    id: 's7',
    time: '6:00 PM',
    title: 'Dinner',
    location: 'Dining Hall',
    type: 'meal'
  },
  {
    id: 's8',
    time: '8:00 PM',
    title: 'Evening Program',
    location: 'Main Arena',
    type: 'event',
    description: 'Entertainment and campfire'
  },
  {
    id: 's9',
    time: '10:00 PM',
    title: 'Lights Out',
    location: 'Campsites',
    type: 'general'
  }
];

export const info = {
  weather: {
    current: { temp: 75, condition: 'Sunny', icon: '☀️' },
    forecast: [
      { day: 'Mon', high: 78, low: 62, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Tue', high: 80, low: 64, condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', high: 82, low: 66, condition: 'Scattered Showers', icon: '🌦️' }
    ]
  },
  emergency: {
    healthLodge: '555-0123',
    contingentLeader: '555-0124',
    jamboreeHQ: '555-0125'
  },
  locations: {
    campsite: 'Area 7, Section B',
    diningHall: 'Building 12',
    tradingPost: 'Central Plaza',
    healthLodge: 'Building 3'
  }
};
