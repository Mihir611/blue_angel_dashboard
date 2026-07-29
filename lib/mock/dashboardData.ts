// Placeholder data — swap these for real values once your analytics
// endpoints are ready (e.g. GET /api/analytics/members, /api/analytics/rides).

export const memberGrowthData = [
    { month: "Feb", members: 320 },
    { month: "Mar", members: 410 },
    { month: "Apr", members: 468 },
    { month: "May", members: 540 },
    { month: "Jun", members: 610 },
    { month: "Jul", members: 702 },
];

export const activityData = [
    { month: "Feb", rides: 12, events: 3 },
    { month: "Mar", rides: 18, events: 4 },
    { month: "Apr", rides: 15, events: 6 },
    { month: "May", rides: 22, events: 5 },
    { month: "Jun", rides: 27, events: 8 },
    { month: "Jul", rides: 31, events: 7 },
];

export const recentGroups = [
    { id: "1", name: "Bangalore Weekend Riders", members: 214, isPrivate: false },
    { id: "2", name: "Himalayan Expedition Crew", members: 89, isPrivate: true },
    { id: "3", name: "Royal Enfield Owners — South", members: 512, isPrivate: false },
];

export const recentRides = [
    { id: "1", title: "Sunrise ride to Nandi Hills", type: "ride" as const, date: "Aug 2, 6:00 AM", location: "Bangalore" },
    { id: "2", title: "Motonomaad Annual Meetup", type: "event" as const, date: "Aug 10, 10:00 AM", location: "Goa" },
    { id: "3", title: "Coastal night ride", type: "ride" as const, date: "Aug 15, 9:00 PM", location: "Mangalore" },
];

export const recentAnnouncements = [
    { id: "1", title: "New chapter opening in Pune", postedAt: "2 days ago" },
    { id: "2", title: "App update: GPS tracking is live", postedAt: "5 days ago" },
];

export const recentBloodRequests = [
    { id: "1", patientName: "Ramesh K.", bloodGroup: "O-", hospital: "Manipal Hospital", location: "Bangalore", urgency: "critical" as const },
    { id: "2", patientName: "Anita S.", bloodGroup: "B+", hospital: "Apollo Hospital", location: "Chennai", urgency: "urgent" as const },
];