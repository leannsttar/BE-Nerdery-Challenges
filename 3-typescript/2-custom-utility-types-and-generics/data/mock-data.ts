export const complexObject = {
  id: 123,
  name: "Ana Perez",
  active: true,
  age: null,
  nickname: undefined,

  roles: ["user", "admin"],
  accountStatus: "VERIFIED",

  contact: {
    email: "ana.perez@email.com",
    phone: {
      countryCode: "+34",
      number: "612345678",
      verified: true,
    },
    socialMedia: {
      twitter: "@anaperez",
      linkedin: null,
      github: "anaperez",
    },
  },

  address: {
    street: "Central Ave",
    number: 45,
    city: "Madrid",
    postalCode: "28001",
    country: "Spain",
    coordinates: {
      lat: 40.4168,
      lng: -3.7038,
      precision: "high", 
    },
  },

  hobbies: [
    "reading",
    "running",
    {
      name: "programming",
      level: "advanced",
      hoursPerWeek: 10,
      technologies: ["TypeScript", "Node.js", "React"],
    },
  ],

  purchaseHistory: [
    {
      id: "ORD-001",
      product: "Laptop",
      price: 1200.99,
      currency: "EUR",
      delivered: true,
      purchaseDate: "2025-11-02T10:30:00Z",
      deliveryAddress: {
        city: "Madrid",
        country: "Spain",
      },
    },
    {
      id: "ORD-002",
      product: "Mouse",
      price: 25.5,
      currency: "EUR",
      delivered: false,
      purchaseDate: "2025-12-10T14:15:00Z",
      tracking: {
        carrier: "DHL",
        trackingId: "DHL123456789",
        status: "IN_TRANSIT",
      },
    },
  ],

  preferences: {
    language: "en",
    currency: "EUR",
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  },

  audit: {
    createdAt: "2024-06-15T09:00:00Z",
    updatedAt: "2025-01-10T18:45:00Z",
    createdBy: "system",
    changes: [
      {
        field: "accountStatus",
        previousValue: "PENDING",
        newValue: "VERIFIED",
        date: "2024-07-01T12:00:00Z",
      },
    ],
  },
};