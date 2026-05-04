globalThis.PRODUCT_DATA = [
  {
    id: "byou",
    name: "BYOU / Build Your Own UNO",
    shortDescription: "DIY Arduino-Uno-class board for prototyping and learning.",
    fullDescription:
      "BYOU is a Build-Your-Own UNO platform powered by ATMEGA328P with CH9340G USB-to-TTL and LM7805 regulation. It is designed for students and makers who want deeper circuit understanding while keeping UNO-class compatibility.",
    priceText: "₱1,500",
    images: [
      "assets/images/BYOU/BLK.JPG",
      "assets/images/BYOU/BLK_BACK.jpg",
      "assets/images/BYOU/GRN.jpg"
    ],
    keyFeatures: [
      "ATMEGA328P microcontroller for UNO-compatible projects",
      "CH9340G USB-to-TTL interface for reliable serial programming",
      "LM7805 onboard regulation for stable 5V operation",
      "Hands-on board architecture for educational electronics"
    ],
    applications: [
      "Embedded systems and microcontroller classes",
      "Rapid robotics and sensor prototyping",
      "DIY automation projects and STEM workshops"
    ],
    shopeeLink: "https://shopee.ph/search?keyword=BYOU%20Build%20Your%20Own%20UNO"
  },
  {
    id: "nano-expansion",
    name: "Nano Expansion Board",
    shortDescription: "Compact Nano expansion board with clean wiring paths.",
    fullDescription:
      "Nano Expansion Board provides organized wiring channels, motor driver support, and quick terminal access so your Nano-based robotics builds can move from wiring to testing faster.",
    priceText: "₱500",
    images: [
      "assets/images/Nano Expansion/2.jpg",
      "assets/images/Nano Expansion/4.jpg"
    ],
    keyFeatures: [
      "Arduino Nano-compatible header layout",
      "Support for TB6612FNG-based motor control setups",
      "Neat and accessible expansion terminals",
      "Compact footprint for mobile robotics builds"
    ],
    applications: [
      "Mini rover and line-following robots",
      "Classroom electronics prototyping",
      "Fast hardware validation benches"
    ],
    shopeeLink: "https://shopee.ph/search?keyword=Nano%20Expansion%20Board"
  },
  {
    id: "rover-module",
    name: "Rover Robotics Module",
    shortDescription: "Control module tuned for rover and sensor-based projects.",
    fullDescription:
      "Rover Robotics Module is an Arduino Nano-compatible control board with ultrasonic and IR sensor ports plus motor-driver mounting support, built for practical navigation and motion projects.",
    priceText: "₱1,200",
    images: [
      "assets/images/Rover/1.png",
      "assets/images/Rover/2.jpg",
      "assets/images/Rover/3.jpg"
    ],
    keyFeatures: [
      "Dedicated ultrasonic and IR sensor connectivity",
      "Nano-compatible control architecture",
      "Motor driver mounting support for movement control",
      "Board layout optimized for mobile robotics"
    ],
    applications: [
      "Obstacle-avoidance rover projects",
      "Autonomous robotics prototyping",
      "Sensor fusion and mobility experiments"
    ],
    shopeeLink: "https://shopee.ph/search?keyword=Rover%20Robotics%20Module"
  }
];

globalThis.getProductById = function getProductById(productId) {
  return globalThis.PRODUCT_DATA.find((product) => product.id === productId) || null;
};
